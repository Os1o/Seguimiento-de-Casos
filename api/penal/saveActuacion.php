<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function validarArchivoActuacionPenal(): ?array
{
    if (
        !isset($_FILES['archivo_actuacion']) ||
        !is_array($_FILES['archivo_actuacion']) ||
        (int) ($_FILES['archivo_actuacion']['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE
    ) {
        return null;
    }

    $archivo = $_FILES['archivo_actuacion'];
    $uploadError = (int) ($archivo['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($uploadError !== UPLOAD_ERR_OK) {
        sendError(getUploadErrorMessage($uploadError), 400, [
            'upload_error' => $uploadError,
        ]);
    }

    $nombreOriginal = (string) ($archivo['name'] ?? 'actuacion.pdf');
    $tmpPath = (string) ($archivo['tmp_name'] ?? '');
    $tamano = (int) ($archivo['size'] ?? 0);

    if ($tamano <= 0) {
        sendError('El documento de la actuación está vacío', 400);
    }

    if ($tamano > 10 * 1024 * 1024) {
        sendError('El documento de la actuación no puede exceder 10 MB', 400);
    }

    if (strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION)) !== 'pdf') {
        sendError('Solo se permiten archivos PDF en la actuación', 400);
    }

    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        sendError('El archivo recibido no es una carga válida', 400);
    }

    $mimeType = detectUploadedFileMimeType($tmpPath);
    if ($mimeType !== 'application/pdf') {
        sendError('El documento de la actuación no es un PDF válido', 400, [
            'mime_type' => $mimeType,
        ]);
    }

    if (!hasValidPdfSignature($tmpPath)) {
        sendError('El documento de la actuación no contiene una firma PDF válida', 400);
    }

    return [
        'nombre_original' => $nombreOriginal,
        'tmp_path' => $tmpPath,
        'tamano_bytes' => $tamano,
        'mime_type' => 'application/pdf',
    ];
}

function construirNombreDocumentoActuacion(string $nombreOriginal): array
{
    $safeBase = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($nombreOriginal, PATHINFO_FILENAME));
    $safeBase = trim((string) $safeBase, '._-');

    if ($safeBase === '') {
        $safeBase = 'actuacion_penal';
    }

    $storedName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safeBase . '.pdf';

    return [
        'base' => $safeBase,
        'stored' => $storedName,
    ];
}

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $asuntoId = isset($_POST['asunto_id']) ? (int) $_POST['asunto_id'] : 0;
    $fechaActuacion = trim((string) ($_POST['fecha_actuacion'] ?? ''));
    $etapaId = isset($_POST['etapa_id']) ? (int) $_POST['etapa_id'] : 0;
    $descripcion = trim((string) ($_POST['descripcion'] ?? ''));

    if ($asuntoId <= 0) {
        sendError('El asunto_id es obligatorio', 400);
    }

    if ($fechaActuacion === '') {
        sendError('La fecha de actuación es obligatoria', 400);
    }

    if ($etapaId <= 0) {
        sendError('La etapa es obligatoria', 400);
    }

    if ($descripcion === '') {
        sendError('La descripción es obligatoria', 400);
    }

    if (mb_strlen($descripcion, 'UTF-8') > 500) {
        sendError('La descripción no puede exceder 500 caracteres', 400);
    }

    $archivo = validarArchivoActuacionPenal();
    $pdo = getDatabaseConnection();

    $asuntoStmt = $pdo->prepare('
        SELECT id, delegacion_id, numero_carpeta, fecha_presentacion_denuncia, fecha_conocimiento_amp, estatus_general
        FROM penal_asuntos
        WHERE id = :id
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $asuntoStmt->execute(['id' => $asuntoId]);
    $asunto = $asuntoStmt->fetch(PDO::FETCH_ASSOC);

    if (!$asunto) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null);

    if (empty($asunto['fecha_conocimiento_amp'])) {
        sendError('Primero debe registrarse la fecha de conocimiento del AMP para habilitar las actuaciones penales', 400);
    }

    if ($fechaActuacion < (string) $asunto['fecha_presentacion_denuncia']) {
        sendError('La fecha de actuación no puede ser menor a la fecha de presentación de la denuncia / querella', 400);
    }

    $etapaStmt = $pdo->prepare('
        SELECT id, nombre, concluye_asunto
        FROM penal_catalogo_etapas
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $etapaStmt->execute(['id' => $etapaId]);
    $etapa = $etapaStmt->fetch(PDO::FETCH_ASSOC);

    if (!$etapa) {
        sendError('La etapa seleccionada no existe', 400);
    }

    $pdo->beginTransaction();

    $insertActuacion = $pdo->prepare('
        INSERT INTO penal_actuaciones (
            asunto_id,
            fecha_actuacion,
            etapa_id,
            descripcion,
            usuario_id
        ) VALUES (
            :asunto_id,
            :fecha_actuacion,
            :etapa_id,
            :descripcion,
            :usuario_id
        )
        RETURNING *
    ');

    $insertActuacion->execute([
        'asunto_id' => $asuntoId,
        'fecha_actuacion' => $fechaActuacion,
        'etapa_id' => $etapaId,
        'descripcion' => $descripcion,
        'usuario_id' => $user['id'] ?? null,
    ]);

    $actuacion = $insertActuacion->fetch(PDO::FETCH_ASSOC);

    $nuevoEstatus = !empty($etapa['concluye_asunto']) ? 'CONCLUIDO' : 'TRAMITE';

    $updateAsunto = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            estatus_general = :estatus_general,
            updated_at = now()
        WHERE id = :id
        RETURNING *
    ');
    $updateAsunto->execute([
        'id' => $asuntoId,
        'estatus_general' => $nuevoEstatus,
    ]);

    $asuntoActualizado = $updateAsunto->fetch(PDO::FETCH_ASSOC);

    $documentoGuardado = null;

    if ($archivo !== null) {
        $storageDir = getStorageBasePath() . DIRECTORY_SEPARATOR . 'documentos' . DIRECTORY_SEPARATOR . 'penal' . DIRECTORY_SEPARATOR . 'actuaciones';
        if (!is_dir($storageDir) && !mkdir($storageDir, 0777, true) && !is_dir($storageDir)) {
            throw new RuntimeException('No se pudo crear el directorio de documentos de actuaciones');
        }

        $nombres = construirNombreDocumentoActuacion($archivo['nombre_original']);
        $rutaRelativa = 'storage/documentos/penal/actuaciones/' . $nombres['stored'];
        $rutaAbsoluta = $storageDir . DIRECTORY_SEPARATOR . $nombres['stored'];

        if (!move_uploaded_file($archivo['tmp_path'], $rutaAbsoluta)) {
            throw new RuntimeException('No se pudo mover el documento de la actuación');
        }

        $insertDocumento = $pdo->prepare('
            INSERT INTO penal_actuacion_documentos (
                actuacion_id,
                nombre_original,
                nombre_guardado,
                ruta_archivo,
                mime_type,
                tamano_bytes,
                usuario_id
            ) VALUES (
                :actuacion_id,
                :nombre_original,
                :nombre_guardado,
                :ruta_archivo,
                :mime_type,
                :tamano_bytes,
                :usuario_id
            )
            RETURNING *
        ');

        $insertDocumento->execute([
            'actuacion_id' => $actuacion['id'],
            'nombre_original' => $archivo['nombre_original'],
            'nombre_guardado' => $nombres['stored'],
            'ruta_archivo' => $rutaRelativa,
            'mime_type' => $archivo['mime_type'],
            'tamano_bytes' => $archivo['tamano_bytes'],
            'usuario_id' => $user['id'] ?? null,
        ]);

        $documentoGuardado = $insertDocumento->fetch(PDO::FETCH_ASSOC);
    }

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'CREAR',
        'entidad' => 'Actuacion penal',
        'entidad_id' => isset($actuacion['id']) ? (int) $actuacion['id'] : null,
        'expediente_id' => $asuntoId,
        'seguimiento_id' => isset($actuacion['id']) ? (int) $actuacion['id'] : null,
        'delegacion_id' => $asunto['delegacion_id'] ?? null,
        'descripcion' => 'Alta de actuación penal',
        'detalles' => [
            'numero_expediente' => $asunto['numero_carpeta'] ?? null,
            'estatus' => $nuevoEstatus === 'CONCLUIDO' ? 'Concluido' : 'En tramite',
            'fecha_actuacion' => $fechaActuacion,
            'etapa_id' => $etapaId,
            'etapa_nombre' => $etapa['nombre'] ?? null,
            'estatus_asunto' => $nuevoEstatus,
            'documento_cargado' => $documentoGuardado !== null,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Actuación penal guardada correctamente', [
        'actuacion' => $actuacion,
        'asunto' => $asuntoActualizado,
        'documento' => $documentoGuardado,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo guardar la actuación penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
