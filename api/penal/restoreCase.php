<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

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
        SELECT delegacion_id, numero_carpeta, estatus_general, activo
        FROM penal_asuntos
        WHERE id = :id
        LIMIT 1
    ');
    $scopeStmt->execute([
        'id' => $id,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso penal no encontrado', 404);
    }

    if (!empty($existingCase['activo'])) {
        sendError('El caso penal ya esta activo', 400);
    }

    $stmt = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            activo = TRUE,
            deleted_at = NULL,
            deleted_by = NULL,
            updated_at = :updated_at
        WHERE id = :id
          AND activo = FALSE
    ');
    $stmt->execute([
        'id' => $id,
        'updated_at' => date('c'),
    ]);

    if ($stmt->rowCount() === 0) {
        sendError('No se pudo restaurar el caso penal', 400);
    }

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'RESTAURAR',
        'entidad' => 'Expediente penal',
        'entidad_id' => $id,
        'expediente_id' => $id,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Restauracion de asunto penal',
        'detalles' => [
            'numero_expediente' => $existingCase['numero_carpeta'] ?? null,
            'estatus' => strtoupper((string) ($existingCase['estatus_general'] ?? '')) === 'CONCLUIDO' ? 'Concluido' : 'En tramite',
        ],
    ]);

    sendSuccess('Caso penal restaurado correctamente');
} catch (Throwable $exception) {
    sendError('No se pudo restaurar el caso penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
