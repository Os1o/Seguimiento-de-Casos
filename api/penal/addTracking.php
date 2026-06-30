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

    $payload = normalizeInputToUppercase($payload);

    $expedienteId = isset($payload['expedienteId']) ? (int) $payload['expedienteId'] : 0;
    $seguimiento = $payload['seguimiento'] ?? null;
    $nuevoEstatus = isset($payload['estatus']) && $payload['estatus'] !== ''
        ? strtoupper((string) $payload['estatus'])
        : null;

    if ($expedienteId <= 0) {
        sendError('El expedienteId es obligatorio', 400);
    }

    if (!is_array($seguimiento)) {
        sendError('El seguimiento es obligatorio', 400);
    }

    if (empty($seguimiento['fecha_actuacion']) || empty($seguimiento['tipo_actuacion'])) {
        sendError('La fecha y el tipo de actuacion son obligatorios', 400);
    }

    if ($nuevoEstatus !== null && !in_array($nuevoEstatus, ['TRAMITE', 'CONCLUIDO'], true)) {
        sendError('El estatus es invalido', 400);
    }

    $pdo = getDatabaseConnection();
    $scopeStmt = $pdo->prepare('SELECT delegacion_id FROM expedientes_penal WHERE id = :id LIMIT 1');
    $scopeStmt->execute([
        'id' => $expedienteId,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso penal no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $existingCase['delegacion_id'] !== null ? (int) $existingCase['delegacion_id'] : null);

    $pdo->beginTransaction();

    $trackingStmt = $pdo->prepare('
        INSERT INTO seguimiento_penal (
            expediente_id,
            fecha_actuacion,
            tipo_actuacion,
            descripcion
        )
        VALUES (
            :expediente_id,
            :fecha_actuacion,
            :tipo_actuacion,
            :descripcion
        )
        RETURNING *
    ');

    $trackingStmt->execute([
        'expediente_id' => $expedienteId,
        'fecha_actuacion' => $seguimiento['fecha_actuacion'],
        'tipo_actuacion' => $seguimiento['tipo_actuacion'],
        'descripcion' => $seguimiento['descripcion'] ?? null,
    ]);

    $savedTracking = $trackingStmt->fetch();

    $fields = ['fecha_actualizacion = :fecha_actualizacion'];
    $params = [
        'id' => $expedienteId,
        'fecha_actualizacion' => date('c'),
    ];

    if ($nuevoEstatus !== null) {
        $fields[] = 'estatus = :estatus';
        $params['estatus'] = $nuevoEstatus;
    }

    $updateStmt = $pdo->prepare('
        UPDATE expedientes_penal
        SET ' . implode(', ', $fields) . '
        WHERE id = :id
        RETURNING *
    ');

    $updateStmt->execute($params);

    $updatedCase = $updateStmt->fetch();

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ACTUALIZAR',
        'entidad' => 'SEGUIMIENTO_PENAL',
        'entidad_id' => (int) ($savedTracking['id'] ?? 0) ?: null,
        'expediente_id' => $expedienteId,
        'seguimiento_id' => (int) ($savedTracking['id'] ?? 0) ?: null,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Alta de seguimiento penal',
        'detalles' => [
            'tipo_actuacion' => $savedTracking['tipo_actuacion'] ?? null,
            'estatus_expediente' => $updatedCase['estatus'] ?? null,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Seguimiento penal agregado correctamente', [
        'tracking' => $savedTracking,
        'case' => $updatedCase,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo agregar el seguimiento penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
