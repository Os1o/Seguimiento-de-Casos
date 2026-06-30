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

    $id = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($id <= 0) {
        sendError('El id es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();
    $scopeStmt = $pdo->prepare('SELECT delegacion_id FROM expedientes_civil WHERE id = :id LIMIT 1');
    $scopeStmt->execute([
        'id' => $id,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $existingCase['delegacion_id'] !== null ? (int) $existingCase['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        UPDATE expedientes_civil
        SET
            activo = FALSE,
            deleted_at = :deleted_at,
            deleted_by = :deleted_by,
            fecha_actualizacion = :fecha_actualizacion
        WHERE id = :id
          AND activo = TRUE
    ');
    $stmt->execute([
        'id' => $id,
        'deleted_at' => date('c'),
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
        'fecha_actualizacion' => date('c'),
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('Caso no encontrado', 404);
    }

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => 'ELIMINAR',
        'entidad' => 'EXPEDIENTE_CIVIL',
        'entidad_id' => $id,
        'expediente_id' => $id,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Eliminacion de expediente civil',
    ]);

    sendSuccess('Caso civil eliminado correctamente');
} catch (Throwable $exception) {
    sendError('No se pudo eliminar el caso civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
