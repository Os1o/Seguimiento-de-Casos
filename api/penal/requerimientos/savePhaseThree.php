<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

const REQ_PHASE_THREE_MAX_FILE_BYTES = 10 * 1024 * 1024;

function canModifyClosedReqData(array $user): bool
{
    $role = strtolower((string)($user['rol'] ?? ''));
    $isBossRaw = $user['esJefe'] ?? $user['es_jefe'] ?? false;
    $isBoss = $isBossRaw === true
        || $isBossRaw === 1
        || $isBossRaw === '1'
        || $isBossRaw === 't'
        || $isBossRaw === 'true';

    return $role === 'admin' || ($role === 'editor' && $isBoss);
}

function validateReqPhaseThreeDate(string $value, string $fieldName): string
{
    $value = trim($value);
    if ($value === '') {
        sendError($fieldName . ' es obligatoria', 400);
    }

    $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);
    if (!$date || $date->format('Y-m-d') !== $value) {
        sendError($fieldName . ' no tiene un formato valido', 400);
    }

    return $value;
}

function validateOptionalReqPhaseThreeDate(string $value, string $fieldName): ?string
{
    $value = trim($value);
    if ($value === '') {
        return null;
    }

    $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);
    if (!$date || $date->format('Y-m-d') !== $value) {
        sendError($fieldName . ' no tiene un formato valido', 400);
    }

    return $value;
}

function getReqPhaseThreeUploadedPdf(string $fieldName, string $label, bool $required): ?array
{
    if (!isset($_FILES[$fieldName]) || !is_array($_FILES[$fieldName])) {
        if ($required) {
            sendError($label . ' es obligatorio', 400);
        }
        return null;
    }

    $file = $_FILES[$fieldName];
    $error = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($error === UPLOAD_ERR_NO_FILE) {
        if ($required) {
            sendError($label . ' es obligatorio', 400);
        }
        return null;
    }

    if ($error !== UPLOAD_ERR_OK) {
        sendError('No se pudo cargar ' . $label, 400);
    }

    $tmpPath = (string)($file['tmp_name'] ?? '');
    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        sendError($label . ' no es valido', 400);
    }

    $size = (int)($file['size'] ?? 0);
    if ($size <= 0 || $size > REQ_PHASE_THREE_MAX_FILE_BYTES) {
        sendError($label . ' excede el tamano permitido', 400);
    }

    $mimeType = detectUploadedFileMimeType($tmpPath);
    if ($mimeType !== 'application/pdf' || !hasValidPdfSignature($tmpPath)) {
        sendError($label . ' debe ser un PDF valido', 400);
    }

    return [
        'tmp_name' => $tmpPath,
        'name' => (string)($file['name'] ?? 'documento.pdf'),
        'size' => $size,
        'mime_type' => $mimeType,
    ];
}

function storeReqPhaseThreeDocument(array $file, int $requerimientoId, int $contestacionId, string $prefix): array
{
    $safeOriginalName = preg_replace('/[^A-Za-z0-9._-]+/', '_', basename($file['name']));
    $safeOriginalName = $safeOriginalName ?: 'documento.pdf';
    $storedName = $prefix . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.pdf';

    $relativeDir = 'documentos/penal/requerimientos/' . $requerimientoId . '/contestaciones/' . $contestacionId;
    $absoluteDir = getStorageBasePath() . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relativeDir);

    if (!is_dir($absoluteDir) && !mkdir($absoluteDir, 0775, true) && !is_dir($absoluteDir)) {
        sendError('No se pudo preparar el almacenamiento del documento', 500);
    }

    $absolutePath = $absoluteDir . DIRECTORY_SEPARATOR . $storedName;
    if (!move_uploaded_file($file['tmp_name'], $absolutePath)) {
        sendError('No se pudo guardar el documento', 500);
    }

    return [
        'nombre_original' => $safeOriginalName,
        'nombre_guardado' => $storedName,
        'ruta_archivo' => $relativeDir . '/' . $storedName,
        'mime_type' => $file['mime_type'],
        'tamano_bytes' => $file['size'],
        'absolute_path' => $absolutePath,
    ];
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metodo no permitido', 405);
}

$storedFiles = [];
$pdo = null;

try {
    $user = requirePenalWriteAccess();
    $pdo = getDatabaseConnection();

    $requerimientoId = filter_input(INPUT_POST, 'requerimiento_id', FILTER_VALIDATE_INT);
    if (!$requerimientoId) {
        sendError('Requerimiento invalido', 400);
    }

    $fechaEnvioRespuesta = validateReqPhaseThreeDate((string)($_POST['fecha_envio_respuesta'] ?? ''), 'Fecha de envio de la contestacion');
    $fechaRespuestaFiscalia = validateOptionalReqPhaseThreeDate((string)($_POST['fecha_respuesta_fiscalia'] ?? ''), 'Fecha de recepcion de la respuesta');
    $observacionesFinales = trim((string)($_POST['observaciones_finales'] ?? ''));

    $documentoContestacion = getReqPhaseThreeUploadedPdf('documento_contestacion', 'Documento enviado por el IMSS', true);
    $documentoFiscalia = getReqPhaseThreeUploadedPdf('documento_respuesta_fiscalia', 'Documento de respuesta de la fiscalia', false);

    if (($fechaRespuestaFiscalia === null) !== ($documentoFiscalia === null)) {
        sendError('La fecha y el documento de respuesta de la fiscalia deben capturarse juntos', 400);
    }

    $stmt = $pdo->prepare(
        'SELECT r.id, r.asunto_id, a.delegacion_id, a.numero_carpeta
           FROM penal_requerimientos r
           INNER JOIN penal_asuntos a ON a.id = r.asunto_id
          WHERE r.id = :id
            AND r.activo = TRUE
            AND a.deleted_at IS NULL'
    );
    $stmt->execute([':id' => $requerimientoId]);
    $requerimiento = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$requerimiento) {
        sendError('Requerimiento no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, (int)$requerimiento['delegacion_id']);

    $existingContestacionStmt = $pdo->prepare(
        'SELECT COUNT(*)
           FROM penal_requerimiento_contestaciones
          WHERE requerimiento_id = :requerimiento_id
            AND activo = TRUE'
    );
    $existingContestacionStmt->execute([':requerimiento_id' => $requerimientoId]);

    if ((int)$existingContestacionStmt->fetchColumn() > 0 && !canModifyClosedReqData($user)) {
        sendError('La contestacion final ya fue registrada y no puede modificarse con este perfil', 403);
    }

    $pdo->beginTransaction();

    $ordenStmt = $pdo->prepare(
        'SELECT COALESCE(MAX(numero_orden), 0) + 1
           FROM penal_requerimiento_contestaciones
          WHERE requerimiento_id = :requerimiento_id
            AND activo = TRUE'
    );
    $ordenStmt->execute([':requerimiento_id' => $requerimientoId]);
    $numeroOrden = (int)$ordenStmt->fetchColumn();

    $insertContestacion = $pdo->prepare(
        'INSERT INTO penal_requerimiento_contestaciones (
             requerimiento_id,
             numero_orden,
             fecha_envio_respuesta,
             fecha_respuesta_fiscalia,
             observaciones_finales,
             usuario_id
         ) VALUES (
             :requerimiento_id,
             :numero_orden,
             :fecha_envio_respuesta,
             :fecha_respuesta_fiscalia,
             :observaciones_finales,
             :usuario_id
         )
         RETURNING id'
    );
    $insertContestacion->execute([
        ':requerimiento_id' => $requerimientoId,
        ':numero_orden' => $numeroOrden,
        ':fecha_envio_respuesta' => $fechaEnvioRespuesta,
        ':fecha_respuesta_fiscalia' => $fechaRespuestaFiscalia,
        ':observaciones_finales' => $observacionesFinales !== '' ? $observacionesFinales : null,
        ':usuario_id' => (int)$user['id'],
    ]);
    $contestacionId = (int)$insertContestacion->fetchColumn();

    $insertDoc = $pdo->prepare(
        'INSERT INTO penal_requerimiento_contestacion_documentos (
             contestacion_id,
             tipo_documento,
             nombre_original,
             nombre_guardado,
             ruta_archivo,
             mime_type,
             tamano_bytes,
             usuario_id
         ) VALUES (
             :contestacion_id,
             :tipo_documento,
             :nombre_original,
             :nombre_guardado,
             :ruta_archivo,
             :mime_type,
             :tamano_bytes,
             :usuario_id
         )'
    );

    $storedContestacion = storeReqPhaseThreeDocument($documentoContestacion, $requerimientoId, $contestacionId, 'contestacion_imss');
    $storedFiles[] = $storedContestacion['absolute_path'];
    $insertDoc->execute([
        ':contestacion_id' => $contestacionId,
        ':tipo_documento' => 'CONTESTACION_ENVIADA',
        ':nombre_original' => $storedContestacion['nombre_original'],
        ':nombre_guardado' => $storedContestacion['nombre_guardado'],
        ':ruta_archivo' => $storedContestacion['ruta_archivo'],
        ':mime_type' => $storedContestacion['mime_type'],
        ':tamano_bytes' => $storedContestacion['tamano_bytes'],
        ':usuario_id' => (int)$user['id'],
    ]);

    if ($documentoFiscalia !== null) {
        $storedFiscalia = storeReqPhaseThreeDocument($documentoFiscalia, $requerimientoId, $contestacionId, 'respuesta_fiscalia');
        $storedFiles[] = $storedFiscalia['absolute_path'];
        $insertDoc->execute([
            ':contestacion_id' => $contestacionId,
            ':tipo_documento' => 'RESPUESTA_FISCALIA',
            ':nombre_original' => $storedFiscalia['nombre_original'],
            ':nombre_guardado' => $storedFiscalia['nombre_guardado'],
            ':ruta_archivo' => $storedFiscalia['ruta_archivo'],
            ':mime_type' => $storedFiscalia['mime_type'],
            ':tamano_bytes' => $storedFiscalia['tamano_bytes'],
            ':usuario_id' => (int)$user['id'],
        ]);
    }

    $updateReq = $pdo->prepare(
        "UPDATE penal_requerimientos
            SET fase_actual = 'CONTESTACION_FINAL',
                updated_at = NOW()
          WHERE id = :id"
    );
    $updateReq->execute([':id' => $requerimientoId]);

    auditLog(
        $pdo,
        (int)$user['id'],
        'Penal',
        'Contestacion final de requerimiento',
        'penal_requerimientos',
        $requerimientoId,
        'Se registro la contestacion final del requerimiento para la carpeta ' . (string)$requerimiento['numero_carpeta']
    );

    $pdo->commit();

    sendSuccess([
        'requerimiento_id' => $requerimientoId,
        'contestacion_id' => $contestacionId,
        'numero_orden' => $numeroOrden,
    ], 'Contestacion final guardada correctamente');
} catch (Throwable $e) {
    if ($pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    foreach ($storedFiles as $path) {
        if (is_string($path) && $path !== '' && is_file($path)) {
            @unlink($path);
        }
    }

    sendError('No se pudo guardar la contestacion final: ' . $e->getMessage(), 500);
}
