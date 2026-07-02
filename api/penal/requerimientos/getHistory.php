<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

if (!function_exists('requirePenalReadAccess')) {
    function requirePenalReadAccess(): array
    {
        return requirePenalAccess();
    }
}

function mapReqHistoryMovement(string $accion, array $detalles, string $descripcion = ''): string
{
    $estatus = trim((string) ($detalles['estatus'] ?? ''));
    if ($estatus !== '') {
        return $estatus;
    }

    if (trim($descripcion) !== '') {
        return $descripcion;
    }

    return match (strtoupper($accion)) {
        'CREAR', 'ALTA' => 'Alta inicial',
        'ELIMINAR', 'ELIMINACION' => 'Eliminacion',
        'RESTAURAR', 'RESTAURACION' => 'Restauracion',
        default => 'Edicion',
    };
}

function formatReqHistoryValue(mixed $value): string
{
    if ($value === null || $value === '') {
        return 'Sin dato';
    }

    if (is_bool($value)) {
        return $value ? 'Si' : 'No';
    }

    if (is_array($value)) {
        return implode(', ', array_map('formatReqHistoryValue', $value));
    }

    return (string) $value;
}

function formatReqHistoryChanges(array $changes): string
{
    $parts = [];

    foreach ($changes as $fieldKey => $change) {
        if (!is_array($change)) {
            continue;
        }

        $field = (string) ($change['etiqueta'] ?? $change['campo'] ?? $change['field'] ?? $fieldKey);
        $before = formatReqHistoryValue($change['antes'] ?? $change['before'] ?? null);
        $after = formatReqHistoryValue($change['despues'] ?? $change['after'] ?? null);
        $parts[] = $field . ': ' . $before . ' -> ' . $after;
    }

    return implode(' | ', $parts);
}

function buildReqHistoryDetail(string $descripcion, array $detalles): string
{
    $parts = [];
    $descripcionIncluyeFolio = preg_match('/\bFolio(?: requerimiento)?:/i', $descripcion) === 1;

    if ($descripcion !== '') {
        $parts[] = $descripcion;
    }

    if (!$descripcionIncluyeFolio && !empty($detalles['folio_requerimiento'])) {
        $parts[] = 'Folio requerimiento: ' . formatReqHistoryValue($detalles['folio_requerimiento']);
    }

    if (!$descripcionIncluyeFolio && empty($detalles['folio_requerimiento']) && !empty($detalles['folio_referencia'])) {
        $parts[] = 'Folio: ' . formatReqHistoryValue($detalles['folio_referencia']);
    }

    if (!empty($detalles['fecha_inicio'])) {
        $parts[] = 'Fecha inicio: ' . formatReqHistoryValue($detalles['fecha_inicio']);
    }

    if (!empty($detalles['area_responsable'])) {
        $parts[] = 'Area responsable: ' . formatReqHistoryValue($detalles['area_responsable']);
    }

    if (!empty($detalles['titulo_solicitud'])) {
        $parts[] = 'Solicitud: ' . formatReqHistoryValue($detalles['titulo_solicitud']);
    }

    if (!empty($detalles['fecha_desahogo'])) {
        $parts[] = 'Fecha desahogo: ' . formatReqHistoryValue($detalles['fecha_desahogo']);
    }

    if (!empty($detalles['fecha_envio'])) {
        $parts[] = 'Fecha envio: ' . formatReqHistoryValue($detalles['fecha_envio']);
    }

    if (!empty($detalles['fecha_respuesta_fiscalia'])) {
        $parts[] = 'Fecha respuesta fiscalia: ' . formatReqHistoryValue($detalles['fecha_respuesta_fiscalia']);
    }

    if (array_key_exists('solicitudes', $detalles)) {
        $parts[] = 'Solicitudes: ' . formatReqHistoryValue($detalles['solicitudes']);
    }

    if (array_key_exists('solicitudes_desahogadas', $detalles)) {
        $parts[] = 'Solicitudes desahogadas: ' . formatReqHistoryValue($detalles['solicitudes_desahogadas']);
    }

    if (array_key_exists('solicitudes_pendientes', $detalles)) {
        $parts[] = 'Solicitudes pendientes: ' . formatReqHistoryValue($detalles['solicitudes_pendientes']);
    }

    if (!empty($detalles['cambios']) && is_array($detalles['cambios'])) {
        $changes = formatReqHistoryChanges($detalles['cambios']);
        if ($changes !== '') {
            $parts[] = 'Cambios: ' . $changes;
        }
    }

    return implode(' | ', array_filter($parts, static fn(string $part): bool => trim($part) !== ''));
}

try {
    $user = requirePenalReadAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $requerimientoId = isset($_GET['requerimiento_id']) ? (int) $_GET['requerimiento_id'] : 0;
    if ($requerimientoId <= 0) {
        sendError('El requerimiento_id es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $reqStmt = $pdo->prepare('
        SELECT pr.id, pa.delegacion_id
        FROM penal_requerimientos pr
        INNER JOIN penal_asuntos pa
            ON pa.id = pr.asunto_id
        WHERE pr.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');
    $reqStmt->execute(['id' => $requerimientoId]);
    $requerimiento = $reqStmt->fetch(PDO::FETCH_ASSOC);

    if (!$requerimiento) {
        sendError('Requerimiento no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($requerimiento['delegacion_id']) ? (int) $requerimiento['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        SELECT
            created_at,
            accion,
            usuario_nombre,
            descripcion,
            detalles
        FROM auditoria_eventos
        WHERE modulo = \'PENAL\'
          AND entidad = \'Requerimiento ministerial\'
          AND entidad_id = :requerimiento_id
        ORDER BY created_at ASC, id ASC
    ');
    $stmt->execute(['requerimiento_id' => $requerimientoId]);

    $events = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $detalles = [];
        if (isset($row['detalles']) && is_string($row['detalles']) && trim($row['detalles']) !== '') {
            $decoded = json_decode($row['detalles'], true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $detalles = $decoded;
            }
        }

        $descripcion = (string) ($row['descripcion'] ?? '');
        $events[] = [
            'fecha' => $row['created_at'] ?? null,
            'movimiento' => mapReqHistoryMovement((string) ($row['accion'] ?? ''), $detalles, $descripcion),
            'usuario_nombre' => (string) ($row['usuario_nombre'] ?? 'Sistema'),
            'detalle' => buildReqHistoryDetail($descripcion, $detalles),
        ];
    }

    sendSuccess('Historial de requerimiento cargado correctamente', [
        'historial' => $events,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el historial del requerimiento', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
