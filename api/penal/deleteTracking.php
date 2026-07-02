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

    $actuacionId = isset($payload['id']) ? (int) $payload['id'] : 0;

    if ($actuacionId <= 0) {
        sendError('El id de la actuacion es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $actuacionStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.asunto_id,
            pa.fecha_actuacion,
            pce.nombre AS etapa_nombre,
            p.numero_carpeta,
            p.delegacion_id
        FROM penal_actuaciones pa
        INNER JOIN penal_asuntos p
            ON p.id = pa.asunto_id
        INNER JOIN penal_catalogo_etapas pce
            ON pce.id = pa.etapa_id
        WHERE pa.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
          AND p.deleted_at IS NULL
        LIMIT 1
    ');

    $actuacionStmt->execute([
        'id' => $actuacionId,
    ]);

    $actuacion = $actuacionStmt->fetch(PDO::FETCH_ASSOC);

    if (!$actuacion) {
        sendError('Actuacion penal no encontrada', 404);
    }

    $asuntoId = (int) ($actuacion['asunto_id'] ?? 0);
    $delegacionId = isset($actuacion['delegacion_id']) ? (int) $actuacion['delegacion_id'] : null;

    ensureWriteDelegacionAccess($user, $delegacionId);

    $documentosStmt = $pdo->prepare('
        SELECT id
        FROM penal_actuacion_documentos
        WHERE actuacion_id = :actuacion_id
          AND activo = TRUE
    ');
    $documentosStmt->execute([
        'actuacion_id' => $actuacionId,
    ]);
    $documentos = $documentosStmt->fetchAll(PDO::FETCH_ASSOC);

    $pdo->beginTransaction();

    $deleteActuacionStmt = $pdo->prepare('
        UPDATE penal_actuaciones
        SET
            activo = FALSE,
            deleted_at = :deleted_at,
            deleted_by = :deleted_by,
            updated_at = now()
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
    ');

    $deleteActuacionStmt->execute([
        'id' => $actuacionId,
        'deleted_at' => date('c'),
        'deleted_by' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    $ultimoStmt = $pdo->prepare('
        SELECT
            pa.id,
            pce.concluye_asunto
        FROM penal_actuaciones pa
        INNER JOIN penal_catalogo_etapas pce
            ON pce.id = pa.etapa_id
        WHERE pa.asunto_id = :asunto_id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        ORDER BY pa.fecha_actuacion DESC, pa.id DESC
        LIMIT 1
    ');
    $ultimoStmt->execute([
        'asunto_id' => $asuntoId,
    ]);
    $ultimaActuacion = $ultimoStmt->fetch(PDO::FETCH_ASSOC);

    $nuevoEstatus = 'TRAMITE';
    if ($ultimaActuacion && !empty($ultimaActuacion['concluye_asunto'])) {
        $nuevoEstatus = 'CONCLUIDO';
    }

    $updateAsuntoStmt = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            estatus_general = :estatus_general,
            updated_at = now()
        WHERE id = :id
    ');
    $updateAsuntoStmt->execute([
        'id' => $asuntoId,
        'estatus_general' => $nuevoEstatus,
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ELIMINAR',
        'entidad' => 'Actuacion penal',
        'entidad_id' => $actuacionId,
        'expediente_id' => $asuntoId,
        'seguimiento_id' => $actuacionId,
        'delegacion_id' => $delegacionId,
        'descripcion' => 'Eliminacion de actuacion penal',
        'detalles' => [
            'numero_expediente' => $actuacion['numero_carpeta'] ?? null,
            'estatus' => $nuevoEstatus === 'CONCLUIDO' ? 'Concluido' : 'En tramite',
            'asunto_id' => $asuntoId,
            'fecha_actuacion' => $actuacion['fecha_actuacion'] ?? null,
            'etapa_nombre' => $actuacion['etapa_nombre'] ?? null,
            'documentos_ligados' => count($documentos),
            'estatus_asunto_resultante' => $nuevoEstatus,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Actuacion penal eliminada correctamente', [
        'actuacionId' => $actuacionId,
        'asuntoId' => $asuntoId,
        'estatusGeneral' => $nuevoEstatus,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo eliminar la actuacion penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
