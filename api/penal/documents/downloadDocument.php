<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $documentoId = isset($_GET['id']) ? (int) $_GET['id'] : 0;
    $tipo = strtoupper(trim((string) ($_GET['tipo'] ?? '')));

    if ($documentoId <= 0) {
        sendError('El id del documento es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    if ($tipo === 'ASUNTO') {
        $stmt = $pdo->prepare('
            SELECT
                pad.id,
                pad.nombre_original,
                pad.ruta_archivo,
                pad.mime_type,
                pa.delegacion_id
            FROM penal_asunto_documentos pad
            INNER JOIN penal_asuntos pa
                ON pa.id = pad.asunto_id
            WHERE pad.id = :id
              AND pad.activo = TRUE
              AND pa.activo = TRUE
              AND pa.deleted_at IS NULL
            LIMIT 1
        ');
    } elseif ($tipo === 'ACTUACION') {
        $stmt = $pdo->prepare('
            SELECT
                pad.id,
                pad.nombre_original,
                pad.ruta_archivo,
                pad.mime_type,
                pas.delegacion_id
            FROM penal_actuacion_documentos pad
            INNER JOIN penal_actuaciones pa
                ON pa.id = pad.actuacion_id
            INNER JOIN penal_asuntos pas
                ON pas.id = pa.asunto_id
            WHERE pad.id = :id
              AND pad.activo = TRUE
              AND pa.activo = TRUE
              AND pa.deleted_at IS NULL
              AND pas.activo = TRUE
              AND pas.deleted_at IS NULL
            LIMIT 1
        ');
    } elseif (in_array($tipo, ['REQUERIMIENTO', 'REQUERIMIENTO_INICIAL', 'REQUERIMIENTO_INTERNO'], true)) {
        $stmt = $pdo->prepare('
            SELECT
                prd.id,
                prd.nombre_original,
                prd.ruta_archivo,
                prd.mime_type,
                pa.delegacion_id
            FROM penal_requerimiento_documentos prd
            INNER JOIN penal_requerimientos pr
                ON pr.id = prd.requerimiento_id
            INNER JOIN penal_asuntos pa
                ON pa.id = pr.asunto_id
            WHERE prd.id = :id
              AND prd.activo = TRUE
              AND pr.activo = TRUE
              AND pa.activo = TRUE
              AND pa.deleted_at IS NULL
            LIMIT 1
        ');
    } elseif ($tipo === 'REQUERIMIENTO_SOLICITUD') {
        $stmt = $pdo->prepare('
            SELECT
                prsd.id,
                prsd.nombre_original,
                prsd.ruta_archivo,
                prsd.mime_type,
                pa.delegacion_id
            FROM penal_requerimiento_solicitud_documentos prsd
            INNER JOIN penal_requerimiento_solicitud_movimientos prsm
                ON prsm.id = prsd.movimiento_id
            INNER JOIN penal_requerimiento_solicitudes prs
                ON prs.id = prsm.solicitud_id
            INNER JOIN penal_requerimientos pr
                ON pr.id = prs.requerimiento_id
            INNER JOIN penal_asuntos pa
                ON pa.id = pr.asunto_id
            WHERE prsd.id = :id
              AND prsd.activo = TRUE
              AND prsm.activo = TRUE
              AND prs.activo = TRUE
              AND pr.activo = TRUE
              AND pa.activo = TRUE
              AND pa.deleted_at IS NULL
            LIMIT 1
        ');
    } elseif (in_array($tipo, ['REQUERIMIENTO_CONTESTACION', 'REQUERIMIENTO_CONTESTACION_ENVIADA', 'REQUERIMIENTO_RESPUESTA_FISCALIA'], true)) {
        $stmt = $pdo->prepare('
            SELECT
                prcd.id,
                prcd.nombre_original,
                prcd.ruta_archivo,
                prcd.mime_type,
                pa.delegacion_id
            FROM penal_requerimiento_contestacion_documentos prcd
            INNER JOIN penal_requerimiento_contestaciones prc
                ON prc.id = prcd.contestacion_id
            INNER JOIN penal_requerimientos pr
                ON pr.id = prc.requerimiento_id
            INNER JOIN penal_asuntos pa
                ON pa.id = pr.asunto_id
            WHERE prcd.id = :id
              AND prcd.activo = TRUE
              AND prc.activo = TRUE
              AND pr.activo = TRUE
              AND pa.activo = TRUE
              AND pa.deleted_at IS NULL
            LIMIT 1
        ');
    } else {
        $stmt = $pdo->prepare('
            SELECT *
            FROM (
                SELECT
                    pad.id,
                    pad.nombre_original,
                    pad.ruta_archivo,
                    pad.mime_type,
                    pa.delegacion_id,
                    1 AS prioridad
                FROM penal_asunto_documentos pad
                INNER JOIN penal_asuntos pa
                    ON pa.id = pad.asunto_id
                WHERE pad.id = :id
                  AND pad.activo = TRUE
                  AND pa.activo = TRUE
                  AND pa.deleted_at IS NULL

                UNION ALL

                SELECT
                    pad.id,
                    pad.nombre_original,
                    pad.ruta_archivo,
                    pad.mime_type,
                    pas.delegacion_id,
                    2 AS prioridad
                FROM penal_actuacion_documentos pad
                INNER JOIN penal_actuaciones pa
                    ON pa.id = pad.actuacion_id
                INNER JOIN penal_asuntos pas
                    ON pas.id = pa.asunto_id
                WHERE pad.id = :id
                  AND pad.activo = TRUE
                  AND pa.activo = TRUE
                  AND pa.deleted_at IS NULL
                  AND pas.activo = TRUE
                  AND pas.deleted_at IS NULL

                UNION ALL

                SELECT
                    prd.id,
                    prd.nombre_original,
                    prd.ruta_archivo,
                    prd.mime_type,
                    pa.delegacion_id,
                    3 AS prioridad
                FROM penal_requerimiento_documentos prd
                INNER JOIN penal_requerimientos pr
                    ON pr.id = prd.requerimiento_id
                INNER JOIN penal_asuntos pa
                    ON pa.id = pr.asunto_id
                WHERE prd.id = :id
                  AND prd.activo = TRUE
                  AND pr.activo = TRUE
                  AND pa.activo = TRUE
                  AND pa.deleted_at IS NULL

                UNION ALL

                SELECT
                    prsd.id,
                    prsd.nombre_original,
                    prsd.ruta_archivo,
                    prsd.mime_type,
                    pa.delegacion_id,
                    4 AS prioridad
                FROM penal_requerimiento_solicitud_documentos prsd
                INNER JOIN penal_requerimiento_solicitud_movimientos prsm
                    ON prsm.id = prsd.movimiento_id
                INNER JOIN penal_requerimiento_solicitudes prs
                    ON prs.id = prsm.solicitud_id
                INNER JOIN penal_requerimientos pr
                    ON pr.id = prs.requerimiento_id
                INNER JOIN penal_asuntos pa
                    ON pa.id = pr.asunto_id
                WHERE prsd.id = :id
                  AND prsd.activo = TRUE
                  AND prsm.activo = TRUE
                  AND prs.activo = TRUE
                  AND pr.activo = TRUE
                  AND pa.activo = TRUE
                  AND pa.deleted_at IS NULL

                UNION ALL

                SELECT
                    prcd.id,
                    prcd.nombre_original,
                    prcd.ruta_archivo,
                    prcd.mime_type,
                    pa.delegacion_id,
                    5 AS prioridad
                FROM penal_requerimiento_contestacion_documentos prcd
                INNER JOIN penal_requerimiento_contestaciones prc
                    ON prc.id = prcd.contestacion_id
                INNER JOIN penal_requerimientos pr
                    ON pr.id = prc.requerimiento_id
                INNER JOIN penal_asuntos pa
                    ON pa.id = pr.asunto_id
                WHERE prcd.id = :id
                  AND prcd.activo = TRUE
                  AND prc.activo = TRUE
                  AND pr.activo = TRUE
                  AND pa.activo = TRUE
                  AND pa.deleted_at IS NULL
            ) t
            ORDER BY prioridad ASC
            LIMIT 1
        ');
    }

    $stmt->execute([
        'id' => $documentoId,
    ]);

    $documento = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$documento) {
        sendError('Documento no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, $documento['delegacion_id'] !== null ? (int) $documento['delegacion_id'] : null);

    $rutaFisica = resolveStorageAbsolutePath((string) $documento['ruta_archivo']);

    if (!is_file($rutaFisica)) {
        sendError('El archivo no existe en disco', 404);
    }

    header_remove('Content-Type');
    header('Content-Type: ' . ((string) ($documento['mime_type'] ?? 'application/pdf')));
    header('Content-Length: ' . filesize($rutaFisica));
    header('Content-Disposition: inline; filename="' . basename((string) $documento['nombre_original']) . '"');
    header('X-Content-Type-Options: nosniff');

    readfile($rutaFisica);
    exit;
} catch (Throwable $exception) {
    sendError('No se pudo descargar el documento', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
