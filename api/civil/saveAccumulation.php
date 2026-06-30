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

    $casoPadreId = array_key_exists('casoPadreId', $payload) && $payload['casoPadreId'] !== null && $payload['casoPadreId'] !== ''
        ? (int) $payload['casoPadreId']
        : null;
    $casoHijoId = isset($payload['casoHijoId']) ? (int) $payload['casoHijoId'] : 0;

    if ($casoHijoId <= 0) {
        sendError('casoHijoId es obligatorio', 400);
    }

    if ($casoPadreId !== null && $casoPadreId <= 0) {
        sendError('casoPadreId es invalido', 400);
    }

    if ($casoPadreId !== null && $casoPadreId === $casoHijoId) {
        sendError('No se puede acumular un caso consigo mismo', 400);
    }

    $pdo = getDatabaseConnection();
    $childScopeStmt = $pdo->prepare('
        SELECT delegacion_id, numero_expediente
        FROM expedientes_civil
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $childScopeStmt->execute([
        'id' => $casoHijoId,
    ]);

    $childCase = $childScopeStmt->fetch();

    if (!$childCase) {
        sendError('Caso hijo no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, $childCase['delegacion_id'] !== null ? (int) $childCase['delegacion_id'] : null);

    if ($casoPadreId !== null) {
        $childAsParentStmt = $pdo->prepare('
            SELECT 1
            FROM acumulados_civil
            WHERE caso_padre_id = :caso_padre_id
              AND activo = TRUE
            LIMIT 1
        ');
        $childAsParentStmt->execute([
            'caso_padre_id' => $casoHijoId,
        ]);

        if ($childAsParentStmt->fetchColumn()) {
            sendError('Un expediente que ya acumula otros asuntos no puede ser acumulado a otro expediente', 400);
        }
    }

    if ($casoPadreId !== null) {
        $parentScopeStmt = $pdo->prepare('
            SELECT delegacion_id, numero_expediente
            FROM expedientes_civil
            WHERE id = :id
              AND activo = TRUE
            LIMIT 1
        ');
        $parentScopeStmt->execute([
            'id' => $casoPadreId,
        ]);

        $parentCase = $parentScopeStmt->fetch();

        if (!$parentCase) {
            sendError('Caso padre no encontrado', 404);
        }

        ensureWriteDelegacionAccess($user, $parentCase['delegacion_id'] !== null ? (int) $parentCase['delegacion_id'] : null);
    }

    $previousAccumulationStmt = $pdo->prepare('
        SELECT
            ac.id,
            ac.caso_padre_id,
            padre.numero_expediente AS caso_padre_numero
        FROM acumulados_civil ac
        INNER JOIN expedientes_civil padre
            ON padre.id = ac.caso_padre_id
        WHERE ac.caso_hijo_id = :caso_hijo_id
          AND ac.activo = TRUE
        LIMIT 1
    ');
    $previousAccumulationStmt->execute([
        'caso_hijo_id' => $casoHijoId,
    ]);
    $previousAccumulation = $previousAccumulationStmt->fetch() ?: null;

    $pdo->beginTransaction();

    $deactivatePreviousStmt = $pdo->prepare('
        UPDATE acumulados_civil
        SET
            activo = FALSE,
            deleted_at = :deleted_at,
            deleted_by = :deleted_by
        WHERE caso_hijo_id = :caso_hijo_id
          AND activo = TRUE
    ');
    $deactivatePreviousStmt->execute([
        'caso_hijo_id' => $casoHijoId,
        'deleted_at' => date('c'),
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    $savedAccumulation = null;

    if ($casoPadreId !== null) {
        $insertStmt = $pdo->prepare('
            INSERT INTO acumulados_civil (
                caso_padre_id,
                caso_hijo_id,
                activo
            )
            VALUES (
                :caso_padre_id,
                :caso_hijo_id,
                TRUE
            )
            RETURNING *
        ');

        $insertStmt->execute([
            'caso_padre_id' => $casoPadreId,
            'caso_hijo_id' => $casoHijoId,
        ]);

        $savedAccumulation = $insertStmt->fetch();
    }

    $updateStmt = $pdo->prepare('
        UPDATE expedientes_civil
        SET
            estatus = :estatus,
            fecha_actualizacion = :fecha_actualizacion
        WHERE id = :id
        RETURNING *
    ');

    $updateStmt->execute([
        'id' => $casoHijoId,
        'estatus' => $casoPadreId !== null ? 'CONCLUIDO' : 'TRAMITE',
        'fecha_actualizacion' => date('c'),
    ]);

    $updatedChildCase = $updateStmt->fetch();

    $tipoMovimiento = 'NUEVA';
    if ($previousAccumulation && $casoPadreId === null) {
        $tipoMovimiento = 'REMOCION';
    } elseif ($previousAccumulation && $casoPadreId !== null) {
        $tipoMovimiento = (int) $previousAccumulation['caso_padre_id'] === $casoPadreId
            ? 'SIN_CAMBIO'
            : 'CAMBIO';
    }

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => $casoPadreId !== null ? 'ACUMULAR' : 'DESACUMULAR',
        'entidad' => 'ACUMULACION_CIVIL',
        'entidad_id' => $savedAccumulation['id'] ?? null,
        'expediente_id' => $casoHijoId,
        'delegacion_id' => $childCase['delegacion_id'] ?? null,
        'descripcion' => $casoPadreId !== null ? 'Registro de acumulacion civil' : 'Remocion de acumulacion civil',
        'detalles' => [
            'tipo_movimiento' => $tipoMovimiento,
            'caso_padre_id' => $casoPadreId,
            'caso_padre_numero' => $parentCase['numero_expediente'] ?? null,
            'caso_padre_anterior_id' => $previousAccumulation['caso_padre_id'] ?? null,
            'caso_padre_anterior_numero' => $previousAccumulation['caso_padre_numero'] ?? null,
            'caso_hijo_id' => $casoHijoId,
            'caso_hijo_numero' => $childCase['numero_expediente'] ?? null,
        ],
    ]);

    $pdo->commit();

    sendSuccess($casoPadreId !== null ? 'Acumulacion civil guardada correctamente' : 'Acumulacion civil removida correctamente', [
        'accumulation' => $savedAccumulation,
        'updatedChildCase' => $updatedChildCase,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo guardar la acumulacion civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
