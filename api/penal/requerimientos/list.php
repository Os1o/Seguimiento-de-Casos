<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

function mapReqPhaseLabel(?string $phase): string
{
    return match ($phase) {
        'SEGUIMIENTO_INTERNO' => 'Seguimiento interno',
        'CONTESTACION_FINAL' => 'Contestacion final',
        'CERRADO' => 'Cerrado',
        default => 'Alta inicial',
    };
}

function canModifyClosedReqData(array $user): bool
{
    $role = strtolower((string)($user['rol'] ?? ''));

    return $role === 'admin';
}

function fetchReqDocuments(PDO $pdo, int $requerimientoId): array
{
    $stmt = $pdo->prepare('
        SELECT id, tipo_documento, nombre_original, ruta_archivo, created_at
        FROM penal_requerimiento_documentos
        WHERE requerimiento_id = :requerimiento_id
          AND activo = TRUE
        ORDER BY created_at ASC, id ASC
    ');
    $stmt->execute(['requerimiento_id' => $requerimientoId]);

    return array_map(static function (array $row): array {
        return [
            'id' => (int) $row['id'],
            'tipo_documento' => (string) $row['tipo_documento'],
            'nombre_original' => (string) $row['nombre_original'],
            'ruta_archivo' => (string) $row['ruta_archivo'],
            'created_at' => $row['created_at'],
        ];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function fetchReqSolicitudes(PDO $pdo, int $requerimientoId): array
{
    $stmt = $pdo->prepare('
        SELECT
            s.id,
            s.numero_orden,
            s.titulo,
            s.descripcion,
            s.created_at,
            mov.id AS movimiento_id,
            mov.fecha_desahogo,
            mov.observaciones_documento,
            mov.created_at AS movimiento_created_at,
            doc.id AS documento_id,
            doc.nombre_original AS documento_nombre,
            doc.ruta_archivo AS documento_ruta,
            doc.created_at AS documento_created_at
        FROM penal_requerimiento_solicitudes s
        LEFT JOIN LATERAL (
            SELECT m.*
            FROM penal_requerimiento_solicitud_movimientos m
            WHERE m.solicitud_id = s.id
              AND m.activo = TRUE
            ORDER BY m.created_at DESC, m.id DESC
            LIMIT 1
        ) mov ON TRUE
        LEFT JOIN LATERAL (
            SELECT d.*
            FROM penal_requerimiento_solicitud_documentos d
            WHERE d.movimiento_id = mov.id
              AND d.activo = TRUE
            ORDER BY d.created_at DESC, d.id DESC
            LIMIT 1
        ) doc ON TRUE
        WHERE s.requerimiento_id = :requerimiento_id
          AND s.activo = TRUE
        ORDER BY s.numero_orden ASC, s.id ASC
    ');
    $stmt->execute(['requerimiento_id' => $requerimientoId]);

    return array_map(static function (array $row): array {
        $desahogada = !empty($row['fecha_desahogo']);

        return [
            'id' => (int) $row['id'],
            'numero_orden' => (int) $row['numero_orden'],
            'titulo' => (string) $row['titulo'],
            'descripcion' => (string) $row['descripcion'],
            'estatus' => $desahogada ? 'DESAHOGADA' : 'EN_TRAMITE',
            'estatus_label' => $desahogada ? 'Desahogada' : 'En tramite',
            'fecha_desahogo' => $row['fecha_desahogo'],
            'observaciones_documento' => $row['observaciones_documento'],
            'documento' => !empty($row['documento_id']) ? [
                'id' => (int) $row['documento_id'],
                'nombre_original' => (string) $row['documento_nombre'],
                'ruta_archivo' => (string) $row['documento_ruta'],
                'created_at' => $row['documento_created_at'],
            ] : null,
        ];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function fetchReqContestaciones(PDO $pdo, int $requerimientoId): array
{
    $stmt = $pdo->prepare('
        SELECT
            c.id,
            c.numero_orden,
            c.fecha_envio_respuesta,
            c.fecha_respuesta_fiscalia,
            c.observaciones_finales,
            c.created_at,
            doc_cont.id AS documento_contestacion_id,
            doc_cont.nombre_original AS documento_contestacion_nombre,
            doc_cont.ruta_archivo AS documento_contestacion_ruta,
            doc_cont.created_at AS documento_contestacion_created_at,
            doc_resp.id AS documento_respuesta_id,
            doc_resp.nombre_original AS documento_respuesta_nombre,
            doc_resp.ruta_archivo AS documento_respuesta_ruta,
            doc_resp.created_at AS documento_respuesta_created_at
        FROM penal_requerimiento_contestaciones c
        LEFT JOIN LATERAL (
            SELECT d.*
            FROM penal_requerimiento_contestacion_documentos d
            WHERE d.contestacion_id = c.id
              AND d.tipo_documento = \'CONTESTACION_ENVIADA\'
              AND d.activo = TRUE
            ORDER BY d.created_at DESC, d.id DESC
            LIMIT 1
        ) doc_cont ON TRUE
        LEFT JOIN LATERAL (
            SELECT d.*
            FROM penal_requerimiento_contestacion_documentos d
            WHERE d.contestacion_id = c.id
              AND d.tipo_documento = \'RESPUESTA_FISCALIA\'
              AND d.activo = TRUE
            ORDER BY d.created_at DESC, d.id DESC
            LIMIT 1
        ) doc_resp ON TRUE
        WHERE c.requerimiento_id = :requerimiento_id
          AND c.activo = TRUE
        ORDER BY c.numero_orden ASC, c.id ASC
    ');
    $stmt->execute(['requerimiento_id' => $requerimientoId]);

    return array_map(static function (array $row): array {
        return [
            'id' => (int) $row['id'],
            'numero_orden' => (int) $row['numero_orden'],
            'fecha_envio_respuesta' => $row['fecha_envio_respuesta'],
            'fecha_respuesta_fiscalia' => $row['fecha_respuesta_fiscalia'],
            'observaciones_finales' => $row['observaciones_finales'],
            'documento_contestacion' => !empty($row['documento_contestacion_id']) ? [
                'id' => (int) $row['documento_contestacion_id'],
                'nombre_original' => (string) $row['documento_contestacion_nombre'],
                'ruta_archivo' => (string) $row['documento_contestacion_ruta'],
                'created_at' => $row['documento_contestacion_created_at'],
            ] : null,
            'documento_respuesta_fiscalia' => !empty($row['documento_respuesta_id']) ? [
                'id' => (int) $row['documento_respuesta_id'],
                'nombre_original' => (string) $row['documento_respuesta_nombre'],
                'ruta_archivo' => (string) $row['documento_respuesta_ruta'],
                'created_at' => $row['documento_respuesta_created_at'],
            ] : null,
            'created_at' => $row['created_at'],
        ];
    }, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $asuntoId = isset($_GET['id']) ? (int) $_GET['id'] : (int) ($_GET['asunto_id'] ?? 0);

    if ($asuntoId <= 0) {
        sendError('El id del asunto es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();
    $canManageRequirements = canModifyClosedReqData($user);
    $includeDeleted = $canManageRequirements
        && (($_GET['include_deleted'] ?? '') === '1' || ($_GET['incluir_eliminados'] ?? '') === '1');
    $activeRequirementsSql = $includeDeleted ? '' : ' AND pr.activo = TRUE';

    $caseStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.delegacion_id,
            pa.numero_carpeta,
            pa.fecha_presentacion_denuncia,
            pa.estatus_general,
            d.nombre AS delito_nombre,
            delg.nombre AS delegacion_nombre
        FROM penal_asuntos pa
        LEFT JOIN delitos d
            ON d.id = pa.delito_id
        LEFT JOIN delegaciones delg
            ON delg.id = pa.delegacion_id
        WHERE pa.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');
    $caseStmt->execute(['id' => $asuntoId]);
    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    $requirementsStmt = $pdo->prepare('
        SELECT
            pr.id,
            pr.folio_referencia,
            pr.autoridad_emisora,
            pr.fecha_recepcion,
            pr.fecha_limite_atencion,
            pr.fecha_inicio_interno,
            pr.area_responsable_id,
            ar.nombre AS area_responsable_nombre,
            pr.fase_actual,
            pr.activo,
            pr.deleted_at,
            pr.deleted_by,
            ud.nombre_completo AS deleted_by_nombre,
            pr.created_at,
            pr.updated_at
        FROM penal_requerimientos pr
        LEFT JOIN areas ar
            ON ar.id = pr.area_responsable_id
        LEFT JOIN usuarios ud
            ON ud.id = pr.deleted_by
        WHERE pr.asunto_id = :asunto_id
          ' . $activeRequirementsSql . '
        ORDER BY pr.activo DESC, pr.created_at DESC, pr.id DESC
    ');
    $requirementsStmt->execute(['asunto_id' => $asuntoId]);

    $requirements = [];
    $totalSolicitudes = 0;
    $totalEnTramite = 0;
    $totalDesahogadas = 0;

    foreach ($requirementsStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $requerimientoId = (int) $row['id'];
        $solicitudes = fetchReqSolicitudes($pdo, $requerimientoId);
        $documentos = fetchReqDocuments($pdo, $requerimientoId);
        $contestaciones = fetchReqContestaciones($pdo, $requerimientoId);

        $solicitudesTotal = count($solicitudes);
        $solicitudesDesahogadas = count(array_filter($solicitudes, static fn (array $item): bool => $item['estatus'] === 'DESAHOGADA'));
        $solicitudesEnTramite = $solicitudesTotal - $solicitudesDesahogadas;

        $totalSolicitudes += $solicitudesTotal;
        $totalEnTramite += $solicitudesEnTramite;
        $totalDesahogadas += $solicitudesDesahogadas;

        $requirements[] = [
            'id' => $requerimientoId,
            'asunto_id' => $asuntoId,
            'folio_referencia' => $row['folio_referencia'] ?: ('REQ-' . str_pad((string) $requerimientoId, 4, '0', STR_PAD_LEFT)),
            'autoridad_emisora' => (string) ($row['autoridad_emisora'] ?? ''),
            'fecha_recepcion' => $row['fecha_recepcion'],
            'fecha_limite_atencion' => $row['fecha_limite_atencion'],
            'fecha_inicio_interno' => $row['fecha_inicio_interno'],
            'area_responsable_id' => isset($row['area_responsable_id']) ? (int) $row['area_responsable_id'] : null,
            'area_responsable_nombre' => $row['area_responsable_nombre'],
            'fase_actual' => (string) ($row['fase_actual'] ?? 'ALTA_INICIAL'),
            'fase_actual_label' => mapReqPhaseLabel((string) ($row['fase_actual'] ?? 'ALTA_INICIAL')),
            'activo' => (bool) $row['activo'],
            'eliminado' => !((bool) $row['activo']),
            'deleted_at' => $row['deleted_at'] ?? null,
            'deleted_by' => isset($row['deleted_by']) ? (int) $row['deleted_by'] : null,
            'deleted_by_nombre' => $row['deleted_by_nombre'] ?? null,
            'solicitudes_total' => $solicitudesTotal,
            'solicitudes_en_tramite' => $solicitudesEnTramite,
            'solicitudes_desahogadas' => $solicitudesDesahogadas,
            'documentos' => $documentos,
            'solicitudes' => $solicitudes,
            'contestaciones' => $contestaciones,
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
        ];
    }

    sendSuccess('Requerimientos cargados correctamente', [
        'asunto' => [
            'id' => (int) $case['id'],
            'numero_carpeta' => (string) $case['numero_carpeta'],
            'fecha_presentacion_denuncia' => $case['fecha_presentacion_denuncia'],
            'estatus_general' => (string) ($case['estatus_general'] ?? ''),
            'delito_nombre' => (string) ($case['delito_nombre'] ?? ''),
            'delegacion_nombre' => (string) ($case['delegacion_nombre'] ?? ''),
        ],
        'stats' => [
            'total_requerimientos' => count($requirements),
            'total_solicitudes' => $totalSolicitudes,
            'solicitudes_en_tramite' => $totalEnTramite,
            'solicitudes_desahogadas' => $totalDesahogadas,
            'requerimientos_eliminados' => count(array_filter($requirements, static fn (array $item): bool => $item['eliminado'] === true)),
        ],
        'requerimientos' => $requirements,
        'permisos' => [
            'puede_modificar_cerrados' => $canManageRequirements,
            'puede_editar_requerimientos' => $canManageRequirements,
            'puede_eliminar_requerimientos' => $canManageRequirements,
            'puede_restaurar_requerimientos' => $canManageRequirements,
            'mostrando_eliminados' => $includeDeleted,
        ],
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los requerimientos', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
