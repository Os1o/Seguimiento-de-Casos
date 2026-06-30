<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $documentoId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($documentoId <= 0) {
        sendError('El id del documento es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $stmt = $pdo->prepare('
        SELECT
            pad.id,
            pad.actuacion_id,
            pad.nombre_original,
            pad.nombre_guardado,
            pad.ruta_archivo,
            pad.mime_type,
            pa.asunto_id,
            pas.delegacion_id
        FROM penal_actuacion_documentos pad
        INNER JOIN penal_actuaciones pa
            ON pa.id = pad.actuacion_id
        INNER JOIN penal_asuntos pas
            ON pas.id = pa.asunto_id
        WHERE pad.id = :id
        LIMIT 1
    ');

    $stmt->execute([
        'id' => $documentoId,
    ]);

    $documento = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$documento) {
        sendError('Documento no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, $documento['delegacion_id'] !== null ? (int) $documento['delegacion_id'] : null);

    $rutaFisica = resolveStorageAbsolutePath((string) $documento['ruta_archivo']);

    if (!is_file($rutaFisica)) {
        sendError('El archivo no existe en disco', 404);
    }

    header_remove('Content-Type');
    header('Content-Type: application/pdf');
    header('Content-Length: ' . filesize($rutaFisica));
    header('Content-Disposition: inline; filename="' . basename((string) $documento['nombre_original']) . '"');
    header('X-Content-Type-Options: nosniff');

    readfile($rutaFisica);
    exit;
} catch (Throwable $exception) {
    sendError('No se pudo descargar el documento', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
