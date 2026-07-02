<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function sanitizeAuditEntityLabel(?string $entity): string
{
    $entity = trim((string) $entity);
    $map = [
        'PENAL_CONOCIMIENTO_AMP' => 'Fecha del AMP',
        'REQUERIMIENTO_PENAL' => 'Requerimiento ministerial',
        'PENAL_REQUERIMIENTO' => 'Requerimiento ministerial',
        'PENAL_ASUNTO' => 'Expediente penal',
        'EXPEDIENTE_PENAL' => 'Expediente penal',
        'SEGUIMIENTO_PENAL' => 'Actuacion penal',
        'PENAL_ACTUACION' => 'Actuacion penal',
    ];

    return $map[$entity] ?? $entity;
}

try {
    requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $pdo = getDatabaseConnection();

    $sinPaginacion = !empty($_GET['sin_paginacion']);
    $page = isset($_GET['page']) ? (int) $_GET['page'] : 1;
    if ($page <= 0) {
        $page = 1;
    }

    $limit = isset($_GET['limit']) ? (int) $_GET['limit'] : 100;
    if ($limit <= 0) {
        $limit = 100;
    }
    $limit = $sinPaginacion ? min($limit, 5000) : min($limit, 500);
    $offset = ($page - 1) * $limit;

    $modulo = trim((string) ($_GET['modulo'] ?? ''));
    $accion = trim((string) ($_GET['accion'] ?? ''));
    $fechaDesde = trim((string) ($_GET['fecha_desde'] ?? ''));
    $fechaHasta = trim((string) ($_GET['fecha_hasta'] ?? ''));
    $usuarioId = isset($_GET['usuario_id']) && $_GET['usuario_id'] !== '' ? (int) $_GET['usuario_id'] : null;
    $expedienteId = isset($_GET['expediente_id']) && $_GET['expediente_id'] !== '' ? (int) $_GET['expediente_id'] : null;

    $where = [];
    $params = [
        'limit' => $limit,
    ];

    if ($modulo !== '') {
        $where[] = 'ae.modulo = :modulo';
        $params['modulo'] = $modulo;
    }

    if ($accion !== '') {
        $where[] = 'ae.accion = :accion';
        $params['accion'] = $accion;
    }

    if ($fechaDesde !== '') {
        $where[] = 'ae.created_at >= CAST(:fecha_desde AS date)';
        $params['fecha_desde'] = $fechaDesde;
    }

    if ($fechaHasta !== '') {
        $where[] = "ae.created_at < (CAST(:fecha_hasta AS date) + INTERVAL '1 day')";
        $params['fecha_hasta'] = $fechaHasta;
    }

    if ($usuarioId !== null) {
        $where[] = 'ae.usuario_id = :usuario_id';
        $params['usuario_id'] = $usuarioId;
    }

    if ($expedienteId !== null) {
        $where[] = 'ae.expediente_id = :expediente_id';
        $params['expediente_id'] = $expedienteId;
    }

    $fromSql = "
        FROM auditoria_eventos ae
        LEFT JOIN delegaciones d
            ON d.id = ae.delegacion_id
        LEFT JOIN expedientes_civil ec
            ON ec.id = ae.expediente_id
           AND ae.modulo = 'CIVIL'
        LEFT JOIN expedientes_penal ep
            ON ep.id = ae.expediente_id
           AND ae.modulo = 'PENAL'
        LEFT JOIN penal_asuntos paudit
            ON paudit.id = ae.expediente_id
           AND ae.modulo = 'PENAL'
        LEFT JOIN seguimiento_civil sc
            ON sc.id = ae.seguimiento_id
           AND ae.modulo = 'CIVIL'
        LEFT JOIN seguimiento_penal sp
            ON sp.id = ae.seguimiento_id
           AND ae.modulo = 'PENAL'
        LEFT JOIN penal_actuaciones pact
            ON pact.id = ae.seguimiento_id
           AND ae.modulo = 'PENAL'
           AND pact.asunto_id = paudit.id
        LEFT JOIN penal_catalogo_etapas pce
            ON pce.id = pact.etapa_id
    ";

    $countSql = 'SELECT COUNT(*) ' . $fromSql;
    if ($where !== []) {
        $countSql .= ' WHERE ' . implode(' AND ', $where);
    }

    $countStmt = $pdo->prepare($countSql);
    foreach ($params as $key => $value) {
        if ($key === 'limit') {
            continue;
        }
        $countStmt->bindValue(':' . $key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $countStmt->execute();
    $total = (int) $countStmt->fetchColumn();

    $sql = "
        SELECT
            ae.id,
            ae.usuario_id,
            ae.usuario_nombre,
            ae.usuario_login,
            ae.rol,
            ae.delegacion_id,
            d.nombre AS delegacion_nombre,
            ae.modulo,
            ae.accion,
            ae.entidad,
            ae.entidad_id,
            ae.expediente_id,
            ae.seguimiento_id,
            COALESCE(ec.numero_expediente, paudit.numero_carpeta, ep.numero_expediente) AS expediente_numero_visible,
            COALESCE(sc.tipo_actuacion, pce.nombre, sp.tipo_actuacion) AS seguimiento_tipo_actuacion,
            ae.descripcion,
            ae.detalles,
            ae.ip_address,
            ae.user_agent,
            ae.created_at
        {$fromSql}
    ";

    if ($where !== []) {
        $sql .= ' WHERE ' . implode(' AND ', $where);
    }

    $sql .= '
        ORDER BY ae.created_at DESC, ae.id DESC
    ';

    if (!$sinPaginacion) {
        $sql .= '
            LIMIT :limit
            OFFSET :offset
        ';
        $params['offset'] = $offset;
    }

    $queryParams = $params;
    if ($sinPaginacion) {
        unset($queryParams['limit'], $queryParams['offset']);
    }

    $stmt = $pdo->prepare($sql);
    foreach ($queryParams as $key => $value) {
        $stmt->bindValue(':' . $key, $value, is_int($value) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $stmt->execute();

    $logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($logs as &$log) {
        $log['entidad'] = sanitizeAuditEntityLabel($log['entidad'] ?? '');

        if (isset($log['detalles']) && is_string($log['detalles']) && trim($log['detalles']) !== '') {
            $decodedDetails = json_decode($log['detalles'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decodedDetails)) {
                $log['detalles'] = $decodedDetails;
            }
        }
    }
    unset($log);

    sendSuccess('Bitacora cargada correctamente', [
        'logs' => $logs,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $limit > 0 ? (int) ceil($total / $limit) : 1,
        ],
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar la bitacora', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
