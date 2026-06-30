<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    $user = requireAdmin();

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
        SELECT delegacion_id, activo
        FROM expedientes_civil
        WHERE id = :id
        LIMIT 1
    ');
    $scopeStmt->execute([
        'id' => $id,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso no encontrado', 404);
    }

    if (!empty($existingCase['activo'])) {
        sendError('El caso civil ya esta activo', 400);
    }

    $stmt = $pdo->prepare('
        UPDATE expedientes_civil
        SET
            activo = TRUE,
            deleted_at = NULL,
            deleted_by = NULL,
            fecha_actualizacion = :fecha_actualizacion
        WHERE id = :id
          AND activo = FALSE
    ');
    $stmt->execute([
        'id' => $id,
        'fecha_actualizacion' => date('c'),
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('No se pudo restaurar el caso civil', 400);
    }

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => 'RESTAURAR',
        'entidad' => 'EXPEDIENTE_CIVIL',
        'entidad_id' => $id,
        'expediente_id' => $id,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Restauracion de expediente civil',
    ]);

    sendSuccess('Caso civil restaurado correctamente');
} catch (Throwable $exception) {
    sendError('No se pudo restaurar el caso civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
