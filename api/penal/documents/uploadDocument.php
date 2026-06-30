<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $expedienteId = isset($_POST['expediente_id']) ? (int) $_POST['expediente_id'] : 0;
    $seguimientoId = isset($_POST['seguimiento_id']) ? (int) $_POST['seguimiento_id'] : 0;

    if ($expedienteId <= 0) {
        sendError('El expediente_id es obligatorio', 400);
    }

    if ($seguimientoId <= 0) {
        sendError('El seguimiento_id es obligatorio', 400);
    }

    if (!isset($_FILES['archivo'])) {
        sendError('No se recibio ningun archivo', 400);
    }

    $archivo = $_FILES['archivo'];
    $uploadError = (int) ($archivo['error'] ?? UPLOAD_ERR_NO_FILE);

    if (!is_array($archivo) || $uploadError !== UPLOAD_ERR_OK) {
        sendError(getUploadErrorMessage($uploadError), 400, [
            'upload_error' => $uploadError,
        ]);
    }

    $nombreOriginal = (string) ($archivo['name'] ?? 'documento.pdf');
    $tmpPath = (string) ($archivo['tmp_name'] ?? '');
    $tamano = (int) ($archivo['size'] ?? 0);

    if ($tamano <= 0) {
        sendError('El archivo esta vacio', 400);
    }

    if ($tamano > 10 * 1024 * 1024) {
        sendError('El archivo excede el maximo permitido de 10 MB', 400);
    }

    $extension = strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION));
    if ($extension !== 'pdf') {
        sendError('Solo se permiten archivos PDF', 400);
    }

    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        sendError('El archivo recibido no es una carga valida', 400);
    }

    $mimeType = detectUploadedFileMimeType($tmpPath);
    if ($mimeType !== 'application/pdf') {
        sendError('El archivo no es un PDF valido', 400, [
            'mime_type' => $mimeType,
        ]);
    }

    if (!hasValidPdfSignature($tmpPath)) {
        sendError('El archivo no contiene una firma PDF valida', 400);
    }

    $pdo = getDatabaseConnection();

    $scopeStmt = $pdo->prepare('SELECT delegacion_id FROM expedientes_penal WHERE id = :id LIMIT 1');
    $scopeStmt->execute([
        'id' => $expedienteId,
    ]);

    $expediente = $scopeStmt->fetch();

    if (!$expediente) {
        sendError('Expediente no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $expediente['delegacion_id'] !== null ? (int) $expediente['delegacion_id'] : null);

    $seguimientoStmt = $pdo->prepare('
        SELECT id, expediente_id
        FROM seguimiento_penal
        WHERE id = :seguimiento_id
          AND activo = TRUE
        LIMIT 1
    ');

    $seguimientoStmt->execute([
        'seguimiento_id' => $seguimientoId,
    ]);

    $seguimiento = $seguimientoStmt->fetch();

    if (!$seguimiento) {
        $latestTrackingStmt = $pdo->prepare('
            SELECT id, expediente_id
            FROM seguimiento_penal
            WHERE expediente_id = :expediente_id
              AND activo = TRUE
            ORDER BY id DESC
            LIMIT 1
        ');

        $latestTrackingStmt->execute([
            'expediente_id' => $expedienteId,
        ]);

        $seguimiento = $latestTrackingStmt->fetch();
    }

    if (!$seguimiento) {
        sendError('Seguimiento penal no encontrado', 404);
    }

    $seguimientoId = isset($seguimiento['id']) ? (int) $seguimiento['id'] : 0;
    $seguimientoExpedienteId = isset($seguimiento['expediente_id']) ? (int) $seguimiento['expediente_id'] : 0;

    if ($seguimientoId <= 0 || $seguimientoExpedienteId <= 0) {
        sendError('El seguimiento no esta ligado a un expediente valido', 400);
    }

    if ($seguimientoExpedienteId !== $expedienteId) {
        $expedienteId = $seguimientoExpedienteId;
    }

    $storageDir = getStorageBasePath() . DIRECTORY_SEPARATOR . 'documentos' . DIRECTORY_SEPARATOR . 'penal' . DIRECTORY_SEPARATOR . $expedienteId;

    if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        sendError('No se pudo preparar la carpeta de almacenamiento', 500);
    }

    $nombreSeguro = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($nombreOriginal, PATHINFO_FILENAME));
    $nombreSeguro = trim((string) $nombreSeguro, '._-');
    if ($nombreSeguro === '') {
        $nombreSeguro = 'documento';
    }

    $nombreGuardado = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $nombreSeguro . '.pdf';
    $rutaFisica = $storageDir . '/' . $nombreGuardado;
    $rutaRelativa = 'storage/documentos/penal/' . $expedienteId . '/' . $nombreGuardado;

    if (!move_uploaded_file($tmpPath, $rutaFisica)) {
        sendError('No se pudo guardar el archivo en disco', 500);
    }

    $stmt = $pdo->prepare('
        INSERT INTO documentos_penal (
            expediente_id,
            seguimiento_id,
            nombre_original,
            nombre_guardado,
            ruta_archivo,
            mime_type,
            tamano_bytes,
            usuario_id
        )
        VALUES (
            :expediente_id,
            :seguimiento_id,
            :nombre_original,
            :nombre_guardado,
            :ruta_archivo,
            :mime_type,
            :tamano_bytes,
            :usuario_id
        )
        RETURNING
            id,
            expediente_id,
            seguimiento_id,
            nombre_original,
            nombre_guardado,
            ruta_archivo,
            mime_type,
            tamano_bytes,
            usuario_id,
            created_at
    ');

    $stmt->execute([
        'expediente_id' => $expedienteId,
        'seguimiento_id' => $seguimientoId,
        'nombre_original' => $nombreOriginal,
        'nombre_guardado' => $nombreGuardado,
        'ruta_archivo' => $rutaRelativa,
        'mime_type' => 'application/pdf',
        'tamano_bytes' => $tamano,
        'usuario_id' => (int) ($user['id'] ?? 0) ?: null,
    ]);

    $documento = $stmt->fetch();

    sendSuccess('Documento cargado correctamente', [
        'documento' => $documento,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el documento', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
