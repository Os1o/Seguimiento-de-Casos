<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function civilCsvEscape(mixed $value): string
{
    $text = trim((string) ($value ?? ''));
    $text = str_replace(["\r\n", "\r", "\n"], ' ', $text);
    $text = str_replace('"', '""', $text);

    return '"' . $text . '"';
}

function civilDecodeJsonField(mixed $value): mixed
{
    if ($value === null || $value === '') {
        return null;
    }

    if (is_array($value)) {
        return $value;
    }

    if (!is_string($value)) {
        return $value;
    }

    $decoded = json_decode($value, true);

    return json_last_error() === JSON_ERROR_NONE ? $decoded : $value;
}

function civilIsListArray(array $value): bool
{
    return array_keys($value) === range(0, count($value) - 1);
}

function civilFormatPersona(mixed $persona): string
{
    if ($persona === null || $persona === '') {
        return '';
    }

    if (is_string($persona)) {
        return trim($persona);
    }

    if (!is_array($persona)) {
        return trim((string) $persona);
    }

    if (civilIsListArray($persona)) {
        $items = array_map(static fn($item) => civilFormatPersona($item), $persona);
        $items = array_values(array_filter($items, static fn($item) => $item !== ''));

        return implode(";", $items);
    }

    if ($persona === []) {
        return '';
    }

    if (!empty($persona['empresa'])) {
        return trim((string) $persona['empresa']);
    }

    $partes = array_filter([
        $persona['nombres'] ?? null,
        $persona['apellido_paterno'] ?? null,
        $persona['apellido_materno'] ?? null,
    ], static fn($item) => $item !== null && $item !== '');

    $nombre = trim(implode(' ', $partes));
    if ($nombre !== '') {
        return $nombre;
    }

    $json = trim((string) json_encode($persona, JSON_UNESCAPED_UNICODE));
    if ($json === '[]' || $json === '{}') {
        return '';
    }

    return $json;
}

function civilFormatImporte(mixed $importe): string
{
    if ($importe === null || $importe === '') {
        return '';
    }

    if (!is_numeric($importe)) {
        return trim((string) $importe);
    }

    return number_format((float) $importe, 2, '.', '');
}

function civilFormatDate(mixed $value): string
{
    $text = trim((string) ($value ?? ''));
    if ($text === '') {
        return '';
    }

    try {
        return (new DateTimeImmutable($text))->format('d/m/Y');
    } catch (Throwable) {
        return $text;
    }
}

function civilFormatDateTime(mixed $value): string
{
    $text = trim((string) ($value ?? ''));
    if ($text === '') {
        return '';
    }

    try {
        return (new DateTimeImmutable($text))->format('d/m/Y H:i');
    } catch (Throwable) {
        return $text;
    }
}

function civilFormatAcumulados(array $row): string
{
    $padre = trim((string) ($row['acumulado_a_numero'] ?? ''));
    $hijos = isset($row['cantidad_acumulados']) ? (int) $row['cantidad_acumulados'] : 0;

    if ($padre !== '') {
        return 'Acumulado a: ' . $padre;
    }

    if ($hijos > 0) {
        return $hijos === 1 ? '1 asunto acumulado' : $hijos . ' asuntos acumulados';
    }

    return '';
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Método no permitido', 405);
    }

    $user = requireCivilAccess();
    $pdo = getDatabaseConnection();

    $delegacionId = isset($_GET['delegacion_id']) && $_GET['delegacion_id'] !== ''
        ? (int) $_GET['delegacion_id']
        : null;

    if (!hasGlobalScope($user)) {
        $delegacionId = getUserDelegacionId($user);
    }

    $sql = '
        SELECT
            ec.id,
            ec.numero_expediente,
            ec.estatus,
            ec.fecha_actualizacion,
            ec.fecha_vencimiento,
            d.nombre AS jsj_nombre,
            ec.tipo_juicio,
            ec.subtipo_juicio,
            ec.sub_subtipo_juicio,
            oj.nombre AS tribunal_juzgado,
            ec.fecha_inicio,
            ec.actor,
            ec.demandados,
            ec.codemandados,
            p.nombre AS prestacion_principal_nombre,
            ec.importe_demandado,
            ec.imss_es,
            abogado.nombre_completo AS abogado_responsable_nombre,
            latest_tracking.fecha_actuacion AS ultima_fecha_actuacion,
            latest_tracking.tipo_actuacion AS ultimo_tipo_actuacion,
            latest_tracking.descripcion AS ultima_descripcion,
            parentCase.numero_expediente AS acumulado_a_numero,
            COUNT(DISTINCT childRelation.caso_hijo_id) FILTER (
                WHERE childRelation.caso_hijo_id IS NOT NULL
            ) AS cantidad_acumulados
        FROM expedientes_civil ec
        LEFT JOIN delegaciones d
            ON d.id = ec.delegacion_id
        LEFT JOIN organos_jurisdiccionales oj
            ON oj.id = ec.organo_jurisdiccional_id
        LEFT JOIN prestaciones p
            ON p.id = ec.prestacion_principal
        LEFT JOIN usuarios abogado
            ON abogado.id = ec.abogado_responsable_id
        LEFT JOIN LATERAL (
            SELECT
                sc.fecha_actuacion,
                sc.tipo_actuacion,
                sc.descripcion
            FROM seguimiento_civil sc
            WHERE sc.expediente_id = ec.id
              AND (sc.activo = TRUE OR sc.activo IS NULL)
            ORDER BY sc.fecha_actuacion DESC NULLS LAST, sc.id DESC
            LIMIT 1
        ) AS latest_tracking ON TRUE
        LEFT JOIN acumulados_civil parentRelation
            ON parentRelation.caso_hijo_id = ec.id
           AND parentRelation.activo = TRUE
        LEFT JOIN expedientes_civil parentCase
            ON parentCase.id = parentRelation.caso_padre_id
        LEFT JOIN acumulados_civil childRelation
            ON childRelation.caso_padre_id = ec.id
           AND childRelation.activo = TRUE
        WHERE ec.activo = TRUE
    ';

    $params = [];

    if ($delegacionId !== null) {
        $sql .= ' AND ec.delegacion_id = :delegacion_id';
        $params['delegacion_id'] = $delegacionId;
    }

    $sql .= '
        GROUP BY
            ec.id,
            d.nombre,
            oj.nombre,
            p.nombre,
            abogado.nombre_completo,
            latest_tracking.fecha_actuacion,
            latest_tracking.tipo_actuacion,
            latest_tracking.descripcion,
            parentCase.numero_expediente
        ORDER BY ec.fecha_actualizacion DESC NULLS LAST, ec.id DESC
    ';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $headers = [
        'JSJ',
        'Estatus',
        'Num. asunto',
        'Fecha de actualización',
        'Materia',
        'Tipo de procedimiento',
        'Vía',
        'Tribunal / Juzgado',
        'Fecha inicio',
        'Actor',
        'Demandado',
        'Codemandado',
        'Prestacion principal',
        'Importe',
        'Calidad IMSS',
        'Acumulados',
        'Abogado responsable',
        'Última fecha de actuación',
        'Último tipo de actuación',
        'Última descripción',
        'Fecha limite',
    ];

    $lines = [];
    $lines[] = implode(',', array_map('civilCsvEscape', $headers));

    foreach ($rows as $row) {
        $actor = civilFormatPersona(civilDecodeJsonField($row['actor'] ?? null));
        $demandado = civilFormatPersona(civilDecodeJsonField($row['demandados'] ?? null));
        $codemandado = civilFormatPersona(civilDecodeJsonField($row['codemandados'] ?? null));

        if ($actor === '' && strtoupper(trim((string) ($row['imss_es'] ?? ''))) === 'ACTOR') {
            $actor = 'IMSS';
        }

        $line = [
            $row['jsj_nombre'] ?? '',
            $row['estatus'] ?? '',
            $row['numero_expediente'] ?? '',
            civilFormatDateTime($row['fecha_actualizacion'] ?? ''),
            $row['tipo_juicio'] ?? '',
            $row['subtipo_juicio'] ?? '',
            $row['sub_subtipo_juicio'] ?? '',
            $row['tribunal_juzgado'] ?? '',
            civilFormatDate($row['fecha_inicio'] ?? ''),
            $actor,
            $demandado,
            $codemandado,
            $row['prestacion_principal_nombre'] ?? '',
            civilFormatImporte($row['importe_demandado'] ?? null),
            $row['imss_es'] ?? '',
            civilFormatAcumulados($row),
            $row['abogado_responsable_nombre'] ?? '',
            civilFormatDate($row['ultima_fecha_actuacion'] ?? ''),
            $row['ultimo_tipo_actuacion'] ?? '',
            $row['ultima_descripcion'] ?? '',
            civilFormatDate($row['fecha_vencimiento'] ?? ''),
        ];

        $lines[] = implode(',', array_map('civilCsvEscape', $line));
    }

    $timestamp = date('Ymd_His');
    $filename = 'asuntos_civil_' . $timestamp . '.csv';

    header_remove('Content-Type');
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');

    echo "\xEF\xBB\xBF";
    echo implode("\r\n", $lines);
    exit;
} catch (Throwable $exception) {
    sendError('No se pudo exportar el CSV civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
