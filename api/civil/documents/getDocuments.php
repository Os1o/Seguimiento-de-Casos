<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requireCivilAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $expedienteId = isset($_GET['expediente_id']) ? (int) $_GET['expediente_id'] : 0;

    if ($expedienteId <= 0) {
        sendError('El expediente_id es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $scopeStmt = $pdo->prepare('SELECT delegacion_id FROM expedientes_civil WHERE id = :id LIMIT 1');
    $scopeStmt->execute([
        'id' => $expedienteId,
    ]);

    $expediente = $scopeStmt->fetch();

    if (!$expediente) {
        sendError('Expediente no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, $expediente['delegacion_id'] !== null ? (int) $expediente['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        SELECT
            dc.id,
            dc.expediente_id,
            dc.seguimiento_id,
            dc.nombre_original,
            dc.nombre_guardado,
            dc.ruta_archivo,
            dc.mime_type,
            dc.tamano_bytes,
            dc.usuario_id,
            dc.created_at,
            u.nombre_completo AS usuario_nombre
        FROM documentos_civil dc
        LEFT JOIN seguimiento_civil sc
            ON sc.id = dc.seguimiento_id
        LEFT JOIN usuarios u
            ON u.id = dc.usuario_id
        WHERE dc.expediente_id = :expediente_id
          AND (dc.seguimiento_id IS NULL OR sc.activo = TRUE)
        ORDER BY dc.created_at DESC, dc.id DESC
    ');

    $stmt->execute([
        'expediente_id' => $expedienteId,
    ]);

    $documentos = $stmt->fetchAll();

    sendSuccess('Documentos cargados correctamente', [
        'documentos' => $documentos,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los documentos', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
