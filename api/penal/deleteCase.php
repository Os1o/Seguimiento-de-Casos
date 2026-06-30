<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requirePenalWriteAccess();

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
    $scopeStmt = $pdo->prepare('
        SELECT delegacion_id
        FROM penal_asuntos
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $scopeStmt->execute([
        'id' => $id,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso penal no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $existingCase['delegacion_id'] !== null ? (int) $existingCase['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            activo = FALSE,
            deleted_at = :deleted_at,
            deleted_by = :deleted_by,
            updated_at = :updated_at
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
    ');
    $stmt->execute([
        'id' => $id,
        'deleted_at' => date('c'),
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
        'updated_at' => date('c'),
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('Caso penal no encontrado', 404);
    }

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ELIMINAR',
        'entidad' => 'PENAL_ASUNTO',
        'entidad_id' => $id,
        'expediente_id' => $id,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Eliminacion de asunto penal',
    ]);

    sendSuccess('Caso penal eliminado correctamente');
} catch (Throwable $exception) {
    sendError('No se pudo eliminar el caso penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
