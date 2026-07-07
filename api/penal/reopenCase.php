<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $asuntoId = isset($payload['asunto_id']) ? (int) $payload['asunto_id'] : 0;
    if ($asuntoId <= 0 && isset($payload['id'])) {
        $asuntoId = (int) $payload['id'];
    }

    if ($asuntoId <= 0) {
        sendError('El asunto_id es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $stmt = $pdo->prepare('
        SELECT id, delegacion_id, numero_carpeta, estatus_general
        FROM penal_asuntos
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $stmt->execute(['id' => $asuntoId]);
    $asunto = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$asunto) {
        sendError('Asunto penal no encontrado', 404);
    }

    $pdo->beginTransaction();

    $updateStmt = $pdo->prepare('
        UPDATE penal_asuntos
        SET estatus_general = \'TRAMITE\',
            updated_at = now()
        WHERE id = :id
        RETURNING *
    ');
    $updateStmt->execute(['id' => $asuntoId]);
    $updated = $updateStmt->fetch(PDO::FETCH_ASSOC);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'EDITAR',
        'entidad' => 'Expediente penal',
        'entidad_id' => $asuntoId,
        'expediente_id' => $asuntoId,
        'delegacion_id' => $asunto['delegacion_id'] ?? null,
        'descripcion' => 'Reapertura de carpeta penal',
        'detalles' => [
            'numero_expediente' => $asunto['numero_carpeta'] ?? null,
            'estatus_anterior' => $asunto['estatus_general'] ?? null,
            'estatus_nuevo' => 'TRAMITE',
        ],
    ]);

    $pdo->commit();

    sendSuccess('Carpeta penal reabierta correctamente', [
        'case' => $updated,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo reabrir la carpeta penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
