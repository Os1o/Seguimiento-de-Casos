<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requireCivilAccess();

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
            dc.id,
            dc.expediente_id,
            dc.nombre_original,
            dc.nombre_guardado,
            dc.ruta_archivo,
            dc.mime_type,
            ec.delegacion_id
        FROM documentos_civil dc
        INNER JOIN expedientes_civil ec
            ON ec.id = dc.expediente_id
        WHERE dc.id = :id
        LIMIT 1
    ');

    $stmt->execute([
        'id' => $documentoId,
    ]);

    $documento = $stmt->fetch();

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
