<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function decodeCivilCaseJsonFields(array $case): array
{
    foreach (['actor', 'demandados', 'codemandados', 'prestaciones_secundarias'] as $field) {
        if (!array_key_exists($field, $case)) {
            continue;
        }

        if ($case[$field] === null || $case[$field] === '') {
            $case[$field] = $field === 'actor' ? null : [];
            continue;
        }

        if (is_string($case[$field])) {
            $decodedValue = json_decode($case[$field], true);
            $case[$field] = json_last_error() === JSON_ERROR_NONE
                ? $decodedValue
                : ($field === 'actor' ? null : []);
        }
    }

    return $case;
}

try {
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
            ec.numero,
            ec.delegacion_id,
            ec.area_generadora_id,
            ec.jurisdiccion,
            ec.tipo_juicio,
            ec.subtipo_juicio,
            ec.sub_subtipo_juicio,
            ec.numero_juicio,
            ec.anio,
            ec.numero_expediente,
            parentRelation.caso_padre_id AS acumulado_a,
            ec.organo_jurisdiccional_id,
            oj.nombre AS organo_jurisdiccional_nombre,
            oj.circuito AS organo_jurisdiccional_circuito,
            ec.fecha_inicio,
            ec.imss_es,
            ec.actor,
            ec.demandados,
            ec.codemandados,
            ec.prestacion_principal,
            ec.prestaciones_secundarias,
            ec.prestaciones_notas,
            ec.importe_demandado,
            ec.abogado_responsable_id,
            abogado.nombre_completo AS abogado_responsable_nombre,
            ec.pronostico,
            ec.estatus,
            ec.fecha_creacion,
            ec.fecha_actualizacion,
            ec.fecha_vencimiento,
            ec.created_at,
            json_agg(childRelation.caso_hijo_id) FILTER (WHERE childRelation.caso_hijo_id IS NOT NULL) AS juicios_acumulados
        FROM expedientes_civil ec
        LEFT JOIN usuarios abogado
            ON abogado.id = ec.abogado_responsable_id
        LEFT JOIN organos_jurisdiccionales oj
            ON oj.id = ec.organo_jurisdiccional_id
        LEFT JOIN acumulados_civil parentRelation
            ON parentRelation.caso_hijo_id = ec.id
           AND parentRelation.activo = TRUE
        LEFT JOIN acumulados_civil childRelation
            ON childRelation.caso_padre_id = ec.id
           AND childRelation.activo = TRUE
    ';

    $params = [];

    if ($delegacionId !== null) {
        $sql .= ' WHERE ec.activo = TRUE AND ec.delegacion_id = :delegacionId';
        $params['delegacionId'] = $delegacionId;
    } else {
        $sql .= ' WHERE ec.activo = TRUE';
    }

    $sql .= '
        GROUP BY
            ec.id,
            parentRelation.caso_padre_id,
            abogado.nombre_completo,
            oj.nombre,
            oj.circuito
    ';

    $sql .= ' ORDER BY ec.fecha_actualizacion DESC NULLS LAST, ec.id DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $cases = array_map(function (array $case): array {
        $case = decodeCivilCaseJsonFields($case);

        if ($case['juicios_acumulados'] === null) {
            $case['juicios_acumulados'] = [];
        }

        if (is_string($case['juicios_acumulados'])) {
            $decodedAccumulations = json_decode($case['juicios_acumulados'], true);
            $case['juicios_acumulados'] = is_array($decodedAccumulations) ? $decodedAccumulations : [];
        }

        $case['juicios_acumulados'] = array_map('intval', $case['juicios_acumulados']);
        $case['acumulado_a'] = $case['acumulado_a'] !== null ? (int) $case['acumulado_a'] : null;

        return $case;
    }, $stmt->fetchAll());

    sendSuccess('Casos civiles cargados correctamente', [
        'cases' => $cases,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los casos civiles', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
