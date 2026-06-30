<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    $user = requireCivilWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody, true);

    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $trackingId = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($trackingId <= 0) {
        sendError('El id del seguimiento es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $trackingStmt = $pdo->prepare('
        SELECT
            sc.id,
            sc.expediente_id,
            ec.delegacion_id
        FROM seguimiento_civil sc
        INNER JOIN expedientes_civil ec
            ON ec.id = sc.expediente_id
        WHERE sc.id = :id
        LIMIT 1
    ');

    $trackingStmt->execute([
        'id' => $trackingId,
    ]);

    $tracking = $trackingStmt->fetch();

    if (!$tracking) {
        sendError('Seguimiento civil no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $tracking['delegacion_id'] !== null ? (int) $tracking['delegacion_id'] : null);

    $documentsStmt = $pdo->prepare('
        SELECT id, ruta_archivo
        FROM documentos_civil
        WHERE seguimiento_id = :seguimiento_id
    ');

    $documentsStmt->execute([
        'seguimiento_id' => $trackingId,
    ]);

    $documents = $documentsStmt->fetchAll();

    $pdo->beginTransaction();

    $updateTrackingStmt = $pdo->prepare('
        UPDATE seguimiento_civil
        SET
            activo = FALSE,
            deleted_at = :deleted_at,
            deleted_by = :deleted_by
        WHERE id = :id
          AND activo = TRUE
    ');

    $updateTrackingStmt->execute([
        'id' => $trackingId,
        'deleted_at' => date('c'),
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    $updateCaseStmt = $pdo->prepare('
        UPDATE expedientes_civil
        SET fecha_actualizacion = :fecha_actualizacion
        WHERE id = :id
    ');

    $updateCaseStmt->execute([
        'id' => (int) $tracking['expediente_id'],
        'fecha_actualizacion' => date('c'),
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => 'ELIMINAR',
        'entidad' => 'SEGUIMIENTO_CIVIL',
        'entidad_id' => $trackingId,
        'expediente_id' => (int) $tracking['expediente_id'],
        'seguimiento_id' => $trackingId,
        'delegacion_id' => $tracking['delegacion_id'] ?? null,
        'descripcion' => 'Eliminacion de seguimiento civil',
        'detalles' => [
            'documentos_ligados' => count($documents),
        ],
    ]);

    $pdo->commit();

    sendSuccess('Seguimiento civil eliminado correctamente', [
        'trackingId' => $trackingId,
        'expedienteId' => (int) $tracking['expediente_id'],
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo eliminar el seguimiento civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
