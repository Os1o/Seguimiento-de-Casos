<?php

declare(strict_types=1);

require_once dirname(__DIR__, 2) . '/bootstrap.php';

try {
    $user = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = json_decode((string) file_get_contents('php://input'), true);

    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $id = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($id <= 0) {
        sendError('El id del requerimiento es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();
    $stmt = $pdo->prepare('
        SELECT
            pr.id,
            pr.asunto_id,
            pr.folio_referencia,
            pr.activo,
            pa.numero_carpeta,
            pa.delegacion_id
        FROM penal_requerimientos pr
        INNER JOIN penal_asuntos pa
            ON pa.id = pr.asunto_id
        WHERE pr.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');
    $stmt->execute(['id' => $id]);
    $requerimiento = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$requerimiento) {
        sendError('Requerimiento no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, isset($requerimiento['delegacion_id']) ? (int) $requerimiento['delegacion_id'] : null);

    if (!(bool) $requerimiento['activo']) {
        sendSuccess('El requerimiento ya estaba eliminado');
    }

    $update = $pdo->prepare('
        UPDATE penal_requerimientos
        SET
            activo = FALSE,
            deleted_at = NOW(),
            deleted_by = :deleted_by,
            updated_at = NOW()
        WHERE id = :id
          AND activo = TRUE
    ');
    $update->execute([
        'id' => $id,
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ELIMINAR',
        'entidad' => 'Requerimiento ministerial',
        'entidad_id' => $id,
        'expediente_id' => (int) $requerimiento['asunto_id'],
        'delegacion_id' => $requerimiento['delegacion_id'] ?? null,
        'descripcion' => 'Baja logica de requerimiento ministerial',
        'detalles' => [
            'numero_expediente' => $requerimiento['numero_carpeta'] ?? null,
            'estatus' => 'Eliminado',
            'folio_referencia' => $requerimiento['folio_referencia'] ?? null,
        ],
    ]);

    sendSuccess('Requerimiento eliminado correctamente');
} catch (Throwable $exception) {
    sendError('No se pudo eliminar el requerimiento', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
