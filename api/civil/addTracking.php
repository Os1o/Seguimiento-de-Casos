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

    $payload = normalizeInputToUppercase($payload);

    $expedienteId = isset($payload['expedienteId']) ? (int) $payload['expedienteId'] : 0;
    $seguimiento = $payload['seguimiento'] ?? null;
    $fechaVencimiento = $payload['fechaVencimiento'] ?? null;
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
    $scopeStmt = $pdo->prepare('SELECT delegacion_id, fecha_inicio FROM expedientes_civil WHERE id = :id LIMIT 1');
    $scopeStmt->execute([
        'id' => $expedienteId,
    ]);

    $existingCase = $scopeStmt->fetch();

    if (!$existingCase) {
        sendError('Caso no encontrado', 404);
    }

    if (!empty($existingCase['fecha_inicio']) && $seguimiento['fecha_actuacion'] < (string) $existingCase['fecha_inicio']) {
        sendError('La fecha de actuacion no puede ser anterior a la fecha de inicio del expediente', 400);
    }

    if ($seguimiento['fecha_actuacion'] > date('Y-m-d')) {
        sendError('La fecha de actuacion no puede ser posterior a hoy', 400);
    }

    ensureWriteDelegacionAccess($user, $existingCase['delegacion_id'] !== null ? (int) $existingCase['delegacion_id'] : null);

    $accumulationStmt = $pdo->prepare('
        SELECT 1
        FROM acumulados_civil
        WHERE caso_hijo_id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $accumulationStmt->execute([
        'id' => $expedienteId,
    ]);

    if ($accumulationStmt->fetchColumn()) {
        sendError('El asunto esta acumulado y no puede recibir seguimiento. Debe desacumularse primero.', 409);
    }

    $pdo->beginTransaction();

    $trackingStmt = $pdo->prepare('
        INSERT INTO seguimiento_civil (
            expediente_id,
            fecha_actuacion,
            tipo_actuacion,
            descripcion,
            actualizado_siij
        )
        VALUES (
            :expediente_id,
            :fecha_actuacion,
            :tipo_actuacion,
            :descripcion,
            :actualizado_siij
        )
        RETURNING *
    ');

    $trackingStmt->execute([
        'expediente_id' => $expedienteId,
        'fecha_actuacion' => $seguimiento['fecha_actuacion'],
        'tipo_actuacion' => $seguimiento['tipo_actuacion'],
        'descripcion' => $seguimiento['descripcion'] ?? null,
        'actualizado_siij' => $seguimiento['actualizado_siij'] ?? 'NO',
    ]);

    $savedTracking = $trackingStmt->fetch();

    $fields = [
        'fecha_actualizacion = :fecha_actualizacion',
        'fecha_vencimiento = :fecha_vencimiento',
    ];
    $params = [
        'id' => $expedienteId,
        'fecha_actualizacion' => date('c'),
        'fecha_vencimiento' => $fechaVencimiento !== '' ? $fechaVencimiento : null,
    ];

    if ($nuevoEstatus !== null) {
        $fields[] = 'estatus = :estatus';
        $params['estatus'] = $nuevoEstatus;
    }

    $updateStmt = $pdo->prepare('
        UPDATE expedientes_civil
        SET ' . implode(', ', $fields) . '
        WHERE id = :id
        RETURNING *
    ');
    $updateStmt->execute($params);

    $updatedCase = $updateStmt->fetch();

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => 'ACTUALIZAR',
        'entidad' => 'SEGUIMIENTO_CIVIL',
        'entidad_id' => (int) ($savedTracking['id'] ?? 0) ?: null,
        'expediente_id' => $expedienteId,
        'seguimiento_id' => (int) ($savedTracking['id'] ?? 0) ?: null,
        'delegacion_id' => $existingCase['delegacion_id'] ?? null,
        'descripcion' => 'Alta de seguimiento civil',
        'detalles' => [
            'tipo_actuacion' => $savedTracking['tipo_actuacion'] ?? null,
            'estatus_expediente' => $updatedCase['estatus'] ?? null,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Seguimiento civil agregado correctamente', [
        'tracking' => $savedTracking,
        'case' => $updatedCase,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo agregar el seguimiento civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
