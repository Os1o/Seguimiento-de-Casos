<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function penalMascBool(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    return in_array(strtolower((string) $value), ['1', 'true', 't', 'si', 's'], true);
}

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $payload = json_decode(file_get_contents('php://input'), true);
    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $asuntoId = isset($payload['asunto_id']) ? (int) $payload['asunto_id'] : 0;
    $fechaConvenio = trim((string) ($payload['fecha_convenio'] ?? ''));
    $descripcion = trim((string) ($payload['descripcion'] ?? ''));
    $cierraCarpeta = penalMascBool($payload['cierra_carpeta'] ?? false);

    if ($asuntoId <= 0) {
        sendError('El asunto_id es obligatorio', 400);
    }

    if ($fechaConvenio === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaConvenio)) {
        sendError('La fecha del convenio MASC es obligatoria', 400);
    }

    if ($descripcion === '') {
        sendError('La descripcion del convenio MASC es obligatoria', 400);
    }

    if (mb_strlen($descripcion, 'UTF-8') > 1000) {
        sendError('La descripcion del convenio MASC no puede exceder 1000 caracteres', 400);
    }

    $pdo = getDatabaseConnection();

    $caseStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.delegacion_id,
            pa.numero_carpeta,
            pa.fecha_presentacion_denuncia,
            COALESCE(pca.fecha_conocimiento_amp, pa.fecha_conocimiento_amp) AS fecha_conocimiento_amp,
            pa.estatus_general
        FROM penal_asuntos pa
        LEFT JOIN penal_conocimiento_amp pca
            ON pca.asunto_id = pa.id
        WHERE pa.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');
    $caseStmt->execute(['id' => $asuntoId]);
    $asunto = $caseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$asunto) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureWriteDelegacionAccess($user, isset($asunto['delegacion_id']) ? (int) $asunto['delegacion_id'] : null);

    if (empty($asunto['fecha_conocimiento_amp'])) {
        sendError('Es necesario registrar la fecha de conocimiento del AMP antes de gestionar MASC', 400);
    }

    if ($fechaConvenio < (string) $asunto['fecha_presentacion_denuncia']) {
        sendError('La fecha del convenio MASC no puede ser menor a la fecha de presentacion de la denuncia / querella', 400);
    }

    $existingStmt = $pdo->prepare('
        SELECT *
        FROM penal_masc
        WHERE asunto_id = :asunto_id
        LIMIT 1
    ');
    $existingStmt->execute(['asunto_id' => $asuntoId]);
    $existingMasc = $existingStmt->fetch(PDO::FETCH_ASSOC);

    if ($existingMasc && !isAdminUser($user)) {
        sendError('Solo admin puede editar un MASC existente', 403);
    }

    if (!$existingMasc && strtoupper((string) ($asunto['estatus_general'] ?? '')) !== 'TRAMITE') {
        sendError('Solo se puede registrar MASC en carpetas en tramite', 400);
    }

    $pdo->beginTransaction();

    if ($existingMasc) {
        $updateStmt = $pdo->prepare('
            UPDATE penal_masc
            SET fecha_convenio = :fecha_convenio,
                descripcion = :descripcion,
                cierra_carpeta = :cierra_carpeta,
                updated_at = now(),
                updated_by = :updated_by
            WHERE id = :id
            RETURNING *
        ');
        $updateStmt->execute([
            'id' => (int) $existingMasc['id'],
            'fecha_convenio' => $fechaConvenio,
            'descripcion' => $descripcion,
            'cierra_carpeta' => $cierraCarpeta ? 'true' : 'false',
            'updated_by' => isset($user['id']) ? (int) $user['id'] : null,
        ]);
        $masc = $updateStmt->fetch(PDO::FETCH_ASSOC);

        $postConclusion = strtoupper((string) ($asunto['estatus_general'] ?? '')) === 'CONCLUIDO';
        auditLog($pdo, $user, [
            'modulo' => 'PENAL',
            'accion' => 'EDITAR',
            'entidad' => 'MASC penal',
            'entidad_id' => (int) $masc['id'],
            'expediente_id' => $asuntoId,
            'delegacion_id' => $asunto['delegacion_id'] ?? null,
            'descripcion' => $postConclusion ? 'Edición de MASC post-conclusión' : 'Edición de MASC',
            'detalles' => [
                'numero_expediente' => $asunto['numero_carpeta'] ?? null,
                'fecha_convenio' => $fechaConvenio,
                'cierra_carpeta' => $cierraCarpeta,
            ],
        ]);
    } else {
        $insertStmt = $pdo->prepare('
            INSERT INTO penal_masc (
                asunto_id,
                fecha_convenio,
                descripcion,
                cierra_carpeta,
                created_by,
                updated_by
            ) VALUES (
                :asunto_id,
                :fecha_convenio,
                :descripcion,
                :cierra_carpeta,
                :created_by,
                :updated_by
            )
            RETURNING *
        ');
        $insertStmt->execute([
            'asunto_id' => $asuntoId,
            'fecha_convenio' => $fechaConvenio,
            'descripcion' => $descripcion,
            'cierra_carpeta' => $cierraCarpeta ? 'true' : 'false',
            'created_by' => isset($user['id']) ? (int) $user['id'] : null,
            'updated_by' => isset($user['id']) ? (int) $user['id'] : null,
        ]);
        $masc = $insertStmt->fetch(PDO::FETCH_ASSOC);

        $actuacionCierre = null;
        if ($cierraCarpeta) {
            $faseStmt = $pdo->prepare('
                SELECT
                    pce.id AS etapa_id,
                    pce.nombre AS etapa_nombre,
                    pcf.id AS fase_id,
                    pcf.nombre AS fase_nombre
                FROM penal_catalogo_etapas pce
                INNER JOIN penal_catalogo_fases pcf
                    ON pcf.etapa_id = pce.id
                WHERE pce.nombre = :etapa_nombre
                  AND pcf.nombre = :fase_nombre
                  AND pce.activo = TRUE
                  AND pcf.activo = TRUE
                LIMIT 1
            ');
            $faseStmt->execute([
                'etapa_nombre' => 'CONCLUIDO POR RESOLUCIÓN',
                'fase_nombre' => 'MASC',
            ]);
            $faseCierre = $faseStmt->fetch(PDO::FETCH_ASSOC);

            if (!$faseCierre) {
                throw new RuntimeException('No existe la fase MASC configurada para cierre por resolucion');
            }

            $insertActuacion = $pdo->prepare('
                INSERT INTO penal_actuaciones (
                    asunto_id,
                    fecha_actuacion,
                    etapa_id,
                    fase_id,
                    descripcion,
                    usuario_id,
                    es_actuacion_cierre
                ) VALUES (
                    :asunto_id,
                    :fecha_actuacion,
                    :etapa_id,
                    :fase_id,
                    :descripcion,
                    :usuario_id,
                    TRUE
                )
                RETURNING *
            ');
            $insertActuacion->execute([
                'asunto_id' => $asuntoId,
                'fecha_actuacion' => $fechaConvenio,
                'etapa_id' => (int) $faseCierre['etapa_id'],
                'fase_id' => (int) $faseCierre['fase_id'],
                'descripcion' => $descripcion,
                'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
            ]);
            $actuacionCierre = $insertActuacion->fetch(PDO::FETCH_ASSOC);

            $updateCase = $pdo->prepare('
                UPDATE penal_asuntos
                SET estatus_general = \'CONCLUIDO\',
                    updated_at = now()
                WHERE id = :id
            ');
            $updateCase->execute(['id' => $asuntoId]);
        }

        auditLog($pdo, $user, [
            'modulo' => 'PENAL',
            'accion' => 'CREAR',
            'entidad' => 'MASC penal',
            'entidad_id' => (int) $masc['id'],
            'expediente_id' => $asuntoId,
            'seguimiento_id' => isset($actuacionCierre['id']) ? (int) $actuacionCierre['id'] : null,
            'delegacion_id' => $asunto['delegacion_id'] ?? null,
            'descripcion' => 'Alta de MASC',
            'detalles' => [
                'numero_expediente' => $asunto['numero_carpeta'] ?? null,
                'fecha_convenio' => $fechaConvenio,
                'cierra_carpeta' => $cierraCarpeta,
                'actuacion_cierre_id' => $actuacionCierre['id'] ?? null,
            ],
        ]);
    }

    $pdo->commit();

    sendSuccess('MASC guardado correctamente', [
        'masc' => $masc,
        'estatus_general' => $cierraCarpeta ? 'CONCLUIDO' : ($asunto['estatus_general'] ?? 'TRAMITE'),
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    sendError('No se pudo guardar el MASC', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
