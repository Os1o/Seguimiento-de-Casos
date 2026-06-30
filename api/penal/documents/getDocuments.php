<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $expedienteId = isset($_GET['expediente_id']) ? (int) $_GET['expediente_id'] : 0;

    if ($expedienteId <= 0) {
        sendError('El expediente_id es obligatorio', 400);
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
        'id' => $expedienteId,
    ]);

    $expediente = $scopeStmt->fetch(PDO::FETCH_ASSOC);

    if (!$expediente) {
        sendError('Expediente no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, $expediente['delegacion_id'] !== null ? (int) $expediente['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        SELECT
            pad.id,
            pad.asunto_id AS expediente_id,
            NULL::integer AS seguimiento_id,
            \'ASUNTO\' AS documento_tipo,
            pad.nombre_original,
            pad.nombre_guardado,
            pad.ruta_archivo,
            pad.mime_type,
            pad.tamano_bytes,
            pad.usuario_id,
            pad.created_at,
            u.nombre_completo AS usuario_nombre
        FROM penal_asunto_documentos pad
        LEFT JOIN usuarios u
            ON u.id = pad.usuario_id
        WHERE pad.asunto_id = :expediente_id
          AND pad.activo = TRUE

        UNION ALL

        SELECT
            pad.id,
            pa.asunto_id AS expediente_id,
            pa.id AS seguimiento_id,
            \'ACTUACION\' AS documento_tipo,
            pad.nombre_original,
            pad.nombre_guardado,
            pad.ruta_archivo,
            pad.mime_type,
            pad.tamano_bytes,
            pad.usuario_id,
            pad.created_at,
            u.nombre_completo AS usuario_nombre
        FROM penal_actuacion_documentos pad
        INNER JOIN penal_actuaciones pa
            ON pa.id = pad.actuacion_id
        LEFT JOIN usuarios u
            ON u.id = pad.usuario_id
        WHERE pa.asunto_id = :expediente_id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
          AND pad.activo = TRUE

        UNION ALL

        SELECT
            prd.id,
            pr.asunto_id AS expediente_id,
            NULL::integer AS seguimiento_id,
            CASE prd.tipo_documento
                WHEN \'INICIAL_FISCALIA\' THEN \'REQUERIMIENTO_INICIAL\'
                WHEN \'INTERNO_IMSS\' THEN \'REQUERIMIENTO_INTERNO\'
                ELSE \'REQUERIMIENTO\'
            END AS documento_tipo,
            prd.nombre_original,
            prd.nombre_guardado,
            prd.ruta_archivo,
            prd.mime_type,
            prd.tamano_bytes,
            prd.usuario_id,
            prd.created_at,
            u.nombre_completo AS usuario_nombre
        FROM penal_requerimiento_documentos prd
        INNER JOIN penal_requerimientos pr
            ON pr.id = prd.requerimiento_id
        LEFT JOIN usuarios u
            ON u.id = prd.usuario_id
        WHERE pr.asunto_id = :expediente_id
          AND pr.activo = TRUE
          AND prd.activo = TRUE

        UNION ALL

        SELECT
            prsd.id,
            pr.asunto_id AS expediente_id,
            NULL::integer AS seguimiento_id,
            \'REQUERIMIENTO_SOLICITUD\' AS documento_tipo,
            prsd.nombre_original,
            prsd.nombre_guardado,
            prsd.ruta_archivo,
            prsd.mime_type,
            prsd.tamano_bytes,
            prsd.usuario_id,
            prsd.created_at,
            u.nombre_completo AS usuario_nombre
        FROM penal_requerimiento_solicitud_documentos prsd
        INNER JOIN penal_requerimiento_solicitud_movimientos prsm
            ON prsm.id = prsd.movimiento_id
        INNER JOIN penal_requerimiento_solicitudes prs
            ON prs.id = prsm.solicitud_id
        INNER JOIN penal_requerimientos pr
            ON pr.id = prs.requerimiento_id
        LEFT JOIN usuarios u
            ON u.id = prsd.usuario_id
        WHERE pr.asunto_id = :expediente_id
          AND pr.activo = TRUE
          AND prs.activo = TRUE
          AND prsm.activo = TRUE
          AND prsd.activo = TRUE

        UNION ALL

        SELECT
            prcd.id,
            pr.asunto_id AS expediente_id,
            NULL::integer AS seguimiento_id,
            CASE prcd.tipo_documento
                WHEN \'CONTESTACION_ENVIADA\' THEN \'REQUERIMIENTO_CONTESTACION_ENVIADA\'
                WHEN \'RESPUESTA_FISCALIA\' THEN \'REQUERIMIENTO_RESPUESTA_FISCALIA\'
                ELSE \'REQUERIMIENTO_CONTESTACION\'
            END AS documento_tipo,
            prcd.nombre_original,
            prcd.nombre_guardado,
            prcd.ruta_archivo,
            prcd.mime_type,
            prcd.tamano_bytes,
            prcd.usuario_id,
            prcd.created_at,
            u.nombre_completo AS usuario_nombre
        FROM penal_requerimiento_contestacion_documentos prcd
        INNER JOIN penal_requerimiento_contestaciones prc
            ON prc.id = prcd.contestacion_id
        INNER JOIN penal_requerimientos pr
            ON pr.id = prc.requerimiento_id
        LEFT JOIN usuarios u
            ON u.id = prcd.usuario_id
        WHERE pr.asunto_id = :expediente_id
          AND pr.activo = TRUE
          AND prc.activo = TRUE
          AND prcd.activo = TRUE

        ORDER BY created_at DESC, id DESC
    ');

    $stmt->execute([
        'expediente_id' => $expedienteId,
    ]);

    $documentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    sendSuccess('Documentos cargados correctamente', [
        'documentos' => $documentos,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los documentos', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
