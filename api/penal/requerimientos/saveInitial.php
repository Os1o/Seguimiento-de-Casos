<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

function readRequerimientoInitialPayload(): array
{
    $solicitudesRaw = trim((string) ($_POST['solicitudes'] ?? ''));
    if ($solicitudesRaw === '') {
        sendError('Debes capturar al menos una solicitud del requerimiento', 400);
    }

    $solicitudesDecoded = json_decode($solicitudesRaw, true);
    if (!is_array($solicitudesDecoded)) {
        sendError('El listado de solicitudes no tiene un formato valido', 400);
    }

    $solicitudes = [];
    foreach ($solicitudesDecoded as $index => $solicitud) {
        if (!is_array($solicitud)) {
            sendError('El listado de solicitudes contiene datos invalidos', 400);
        }

        $titulo = trim((string) ($solicitud['titulo'] ?? ''));
        $descripcion = trim((string) ($solicitud['descripcion'] ?? ''));

        if ($titulo === '' || $descripcion === '') {
            sendError('Todas las solicitudes deben tener titulo y descripcion', 400);
        }

        $solicitudes[] = [
            'numero_orden' => $index + 1,
            'titulo' => mb_strtoupper($titulo, 'UTF-8'),
            'descripcion' => mb_strtoupper($descripcion, 'UTF-8'),
        ];
    }

    if ($solicitudes === []) {
        sendError('Debes capturar al menos una solicitud del requerimiento', 400);
    }

    return [
        'asunto_id' => isset($_POST['asunto_id']) ? (int) $_POST['asunto_id'] : 0,
        'folio_referencia' => mb_strtoupper(trim((string) ($_POST['folio_referencia'] ?? '')), 'UTF-8'),
        'autoridad_emisora' => mb_strtoupper(trim((string) ($_POST['autoridad_emisora'] ?? '')), 'UTF-8'),
        'fecha_recepcion' => trim((string) ($_POST['fecha_recepcion'] ?? '')),
        'fecha_limite_atencion' => trim((string) ($_POST['fecha_limite_atencion'] ?? '')),
        'solicitudes' => $solicitudes,
    ];
}

function validateDateField(string $value, string $fieldLabel): void
{
    $date = DateTimeImmutable::createFromFormat('Y-m-d', $value);
    $errors = DateTimeImmutable::getLastErrors();

    if (!$date || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
        sendError("La fecha de {$fieldLabel} no tiene un formato valido", 400);
    }
}

function validateOptionalInitialDocument(): ?array
{
    if (!isset($_FILES['documento_inicial']) || !is_array($_FILES['documento_inicial'])) {
        return null;
    }

    $archivo = $_FILES['documento_inicial'];
    $uploadError = (int) ($archivo['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($uploadError === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($uploadError !== UPLOAD_ERR_OK) {
        sendError(getUploadErrorMessage($uploadError), 400, [
            'upload_error' => $uploadError,
        ]);
    }

    $nombreOriginal = (string) ($archivo['name'] ?? 'documento.pdf');
    $tmpPath = (string) ($archivo['tmp_name'] ?? '');
    $tamano = (int) ($archivo['size'] ?? 0);

    if ($tamano <= 0) {
        sendError('El documento inicial esta vacio', 400);
    }

    if ($tamano > 10 * 1024 * 1024) {
        sendError('El documento inicial no puede exceder 10 MB', 400);
    }

    if (strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION)) !== 'pdf') {
        sendError('Solo se permiten archivos PDF como documento inicial', 400);
    }

    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        sendError('El archivo recibido no es una carga valida', 400);
    }

    $mimeType = detectUploadedFileMimeType($tmpPath);
    if ($mimeType !== 'application/pdf') {
        sendError('El documento inicial no es un PDF valido', 400, [
            'mime_type' => $mimeType,
        ]);
    }

    if (!hasValidPdfSignature($tmpPath)) {
        sendError('El documento inicial no contiene una firma PDF valida', 400);
    }

    return [
        'nombre_original' => $nombreOriginal,
        'tmp_path' => $tmpPath,
        'tamano_bytes' => $tamano,
        'mime_type' => 'application/pdf',
    ];
}

function buildRequerimientoPdfName(string $originalName): string
{
    $safeBase = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $safeBase = trim((string) $safeBase, '._-');

    if ($safeBase === '') {
        $safeBase = 'requerimiento_inicial';
    }

    return date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safeBase . '.pdf';
}

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = readRequerimientoInitialPayload();

    if ($payload['asunto_id'] <= 0 || $payload['autoridad_emisora'] === '' || $payload['fecha_recepcion'] === '' || $payload['fecha_limite_atencion'] === '') {
        sendError('Completa los campos obligatorios del requerimiento inicial', 400);
    }

    validateDateField($payload['fecha_recepcion'], 'recepcion');
    validateDateField($payload['fecha_limite_atencion'], 'limite de atencion');

    if ($payload['fecha_limite_atencion'] < $payload['fecha_recepcion']) {
        sendError('La fecha limite de atencion no puede ser menor a la fecha de recepcion', 400);
    }

    $documentoInicial = validateOptionalInitialDocument();
    $pdo = getDatabaseConnection();

    $stmt = $pdo->prepare('
        SELECT id, delegacion_id, numero_carpeta
        FROM penal_asuntos
        WHERE id = :id
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $stmt->execute(['id' => $payload['asunto_id']]);
    $asunto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asunto) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null);

    $finalAbsolutePath = null;
    $finalRelativePath = null;

    $pdo->beginTransaction();

    $insertRequerimiento = $pdo->prepare('
        INSERT INTO penal_requerimientos (
            asunto_id,
            folio_referencia,
            autoridad_emisora,
            fecha_recepcion,
            fecha_limite_atencion,
            fase_actual,
            created_by
        )
        VALUES (
            :asunto_id,
            :folio_referencia,
            :autoridad_emisora,
            :fecha_recepcion,
            :fecha_limite_atencion,
            :fase_actual,
            :created_by
        )
        RETURNING id
    ');

    $insertRequerimiento->execute([
        'asunto_id' => $payload['asunto_id'],
        'folio_referencia' => $payload['folio_referencia'] !== '' ? $payload['folio_referencia'] : null,
        'autoridad_emisora' => $payload['autoridad_emisora'],
        'fecha_recepcion' => $payload['fecha_recepcion'],
        'fecha_limite_atencion' => $payload['fecha_limite_atencion'],
        'fase_actual' => 'ALTA_INICIAL',
        'created_by' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    $requerimientoId = (int) $insertRequerimiento->fetchColumn();
    if ($requerimientoId <= 0) {
        throw new RuntimeException('No se pudo obtener el identificador del requerimiento');
    }

    $insertSolicitud = $pdo->prepare('
        INSERT INTO penal_requerimiento_solicitudes (
            requerimiento_id,
            numero_orden,
            titulo,
            descripcion
        )
        VALUES (
            :requerimiento_id,
            :numero_orden,
            :titulo,
            :descripcion
        )
    ');

    foreach ($payload['solicitudes'] as $solicitud) {
        $insertSolicitud->execute([
            'requerimiento_id' => $requerimientoId,
            'numero_orden' => $solicitud['numero_orden'],
            'titulo' => $solicitud['titulo'],
            'descripcion' => $solicitud['descripcion'],
        ]);
    }

    if ($documentoInicial !== null) {
        $storageDir = getStorageBasePath() . DIRECTORY_SEPARATOR . 'documentos' . DIRECTORY_SEPARATOR . 'penal' . DIRECTORY_SEPARATOR . 'requerimientos' . DIRECTORY_SEPARATOR . $requerimientoId;
        $relativeDir = 'storage/documentos/penal/requerimientos/' . $requerimientoId;

        if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
            throw new RuntimeException('No se pudo preparar la carpeta de almacenamiento');
        }

        $storedName = buildRequerimientoPdfName($documentoInicial['nombre_original']);
        $finalAbsolutePath = $storageDir . DIRECTORY_SEPARATOR . $storedName;
        $finalRelativePath = $relativeDir . '/' . $storedName;

        if (!move_uploaded_file($documentoInicial['tmp_path'], $finalAbsolutePath)) {
            throw new RuntimeException('No se pudo guardar el documento inicial en disco');
        }

        $insertDocumento = $pdo->prepare('
            INSERT INTO penal_requerimiento_documentos (
                requerimiento_id,
                tipo_documento,
                nombre_original,
                nombre_guardado,
                ruta_archivo,
                mime_type,
                tamano_bytes,
                usuario_id
            )
            VALUES (
                :requerimiento_id,
                :tipo_documento,
                :nombre_original,
                :nombre_guardado,
                :ruta_archivo,
                :mime_type,
                :tamano_bytes,
                :usuario_id
            )
        ');

        $insertDocumento->execute([
            'requerimiento_id' => $requerimientoId,
            'tipo_documento' => 'INICIAL_FISCALIA',
            'nombre_original' => $documentoInicial['nombre_original'],
            'nombre_guardado' => $storedName,
            'ruta_archivo' => $finalRelativePath,
            'mime_type' => $documentoInicial['mime_type'],
            'tamano_bytes' => $documentoInicial['tamano_bytes'],
            'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
        ]);
    }

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ALTA_REQUERIMIENTO',
        'entidad' => 'PENAL_REQUERIMIENTO',
        'entidad_id' => $requerimientoId,
        'expediente_id' => $payload['asunto_id'],
        'delegacion_id' => isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null,
        'descripcion' => 'Alta inicial de requerimiento ministerial',
        'detalles' => [
            'numero_carpeta' => $asunto['numero_carpeta'] ?? null,
            'folio_referencia' => $payload['folio_referencia'],
            'autoridad_emisora' => $payload['autoridad_emisora'],
            'fecha_recepcion' => $payload['fecha_recepcion'],
            'fecha_limite_atencion' => $payload['fecha_limite_atencion'],
            'solicitudes' => count($payload['solicitudes']),
            'documento_inicial' => $documentoInicial !== null,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Requerimiento registrado correctamente', [
        'requerimiento_id' => $requerimientoId,
        'solicitudes' => count($payload['solicitudes']),
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if (isset($finalAbsolutePath) && is_string($finalAbsolutePath) && $finalAbsolutePath !== '' && is_file($finalAbsolutePath)) {
        @unlink($finalAbsolutePath);
    }

    logInternalError('No se pudo registrar el requerimiento ministerial', 500, [
        'detail' => $exception->getMessage(),
    ]);

    sendError('No se pudo registrar el requerimiento ministerial', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
