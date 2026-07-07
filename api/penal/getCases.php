<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function mapPenalListPeople(?string $json): array
{
    if ($json === null || $json === '') {
        return [];
    }

    $rows = json_decode($json, true);
    if (!is_array($rows)) {
        return [];
    }

    return array_values(array_filter(array_map(static function (array $row): array {
        $name = trim((string) ($row['nombre'] ?? ''));
        if ($name === '') {
            return [];
        }

        return [
            'id' => isset($row['id']) ? (int) $row['id'] : null,
            'nombre' => $name,
            'es_imss' => penalListBool($row['es_imss'] ?? false),
            'es_principal' => penalListBool($row['es_principal'] ?? false),
            'es_coadyuvante' => penalListBool($row['es_coadyuvante'] ?? false),
            'es_qrr' => penalListBool($row['es_qrr'] ?? false),
            'orden' => isset($row['orden']) ? (int) $row['orden'] : null,
        ];
    }, $rows)));
}

function penalListBool(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    return in_array(strtolower((string) $value), ['1', 't', 'true', 's', 'si', 'sí'], true);
}

function mapPenalListCase(array $case): array
{
    $denunciantes = mapPenalListPeople($case['denunciantes_json'] ?? null);
    $responsables = mapPenalListPeople($case['responsables_json'] ?? null);
    $estatus = strtoupper((string) ($case['estatus_general'] ?? 'TRAMITE'));

    return [
        'id' => (int) $case['id'],
        'delegacion_id' => isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null,
        'delegacion_nombre' => $case['delegacion_nombre'] ?? null,
        'numero_expediente' => $case['numero_carpeta'] ?? null,
        'numero_carpeta' => $case['numero_carpeta'] ?? null,
        'anio' => $case['anio_inicio'] ?? null,
        'anio_inicio' => $case['anio_inicio'] ?? null,
        'fecha_inicio' => $case['fecha_presentacion_denuncia'] ?? null,
        'fecha_presentacion_denuncia' => $case['fecha_presentacion_denuncia'] ?? null,
        'delito_id' => isset($case['delito_id']) ? (int) $case['delito_id'] : null,
        'delito_nombre' => $case['delito_nombre'] ?? null,
        'categoria_delito_nombre' => $case['categoria_delito_nombre'] ?? null,
        'ultima_etapa_nombre' => $case['ultima_etapa_nombre'] ?? null,
        'ultima_fase_nombre' => $case['ultima_fase_nombre'] ?? null,
        'denunciante' => $denunciantes,
        'probable_responsable' => $responsables,
        'qrr' => array_reduce($responsables, static fn(bool $carry, array $item): bool => $carry || !empty($item['es_qrr']), false),
        'sin_cuantificar' => penalListBool($case['sin_cuantificar'] ?? false),
        'cuantia_monto' => $case['cuantia_monto'] ?? null,
        'monto' => $case['cuantia_monto'] ?? null,
        'area_hechos_id' => isset($case['area_hechos_id']) ? (int) $case['area_hechos_id'] : null,
        'area_generadora_nombre' => $case['area_generadora_nombre'] ?? null,
        'dato_relevante' => $case['dato_relevante'] ?? null,
        'escenario_denunciante' => $case['escenario_denunciante'] ?? null,
        'coadyuvancia' => penalListBool($case['coadyuvancia'] ?? false),
        'fecha_conocimiento_amp' => $case['fecha_conocimiento_amp'] ?? null,
        'fecha_judicializacion' => $case['fecha_judicializacion'] ?? null,
        'determinacion_judicial' => $case['determinacion_judicial'] ?? null,
        'tiene_requerimientos_pendientes' => penalListBool($case['tiene_requerimientos_pendientes'] ?? false),
        'estatus' => $estatus,
        'estatus_general' => $estatus,
        'abogado_responsable_id' => isset($case['abogado_responsable_id']) ? (int) $case['abogado_responsable_id'] : null,
        'abogado_responsable' => $case['abogado_responsable'] ?? null,
        'fecha_creacion' => $case['created_at'] ?? null,
        'fecha_actualizacion' => $case['updated_at'] ?? null,
        'created_at' => $case['created_at'] ?? null,
        'updated_at' => $case['updated_at'] ?? null,
    ];
}

try {
    $user = requirePenalAccess();
    $pdo = getDatabaseConnection();

    $delegacionId = isset($_GET['delegacion_id']) && $_GET['delegacion_id'] !== ''
        ? (int) $_GET['delegacion_id']
        : null;

    if (!hasGlobalScope($user)) {
        $delegacionId = getUserDelegacionId($user);
    }

    $sql = '
        SELECT
            pa.id,
            pa.delegacion_id,
            delg.nombre AS delegacion_nombre,
            pa.numero_carpeta,
            pa.anio_inicio,
            pa.fecha_presentacion_denuncia,
            pa.delito_id,
            d.nombre AS delito_nombre,
            cd.nombre AS categoria_delito_nombre,
            pa.sin_cuantificar,
            pa.cuantia_monto,
            pa.area_hechos_id,
            a.nombre AS area_generadora_nombre,
            pa.dato_relevante,
            pa.escenario_denunciante,
            pa.coadyuvancia,
            COALESCE(pca.fecha_conocimiento_amp, pa.fecha_conocimiento_amp) AS fecha_conocimiento_amp,
            pa.fecha_judicializacion,
            pa.determinacion_judicial,
            pa.estatus_general,
            pa.abogado_responsable_id,
            u.nombre_completo AS abogado_responsable,
            pa.created_at,
            pa.updated_at,
            ultima_actuacion.ultima_etapa_nombre,
            ultima_actuacion.ultima_fase_nombre,
            EXISTS (
                SELECT 1
                FROM penal_requerimientos pr
                WHERE pr.asunto_id = pa.id
                  AND pr.activo = TRUE
                  AND NOT EXISTS (
                      SELECT 1
                      FROM penal_requerimiento_contestaciones prc
                      WHERE prc.requerimiento_id = pr.id
                  )
            ) AS tiene_requerimientos_pendientes,
            COALESCE(den.denunciantes_json, \'[]\') AS denunciantes_json,
            COALESCE(resp.responsables_json, \'[]\') AS responsables_json
        FROM penal_asuntos pa
        LEFT JOIN delegaciones delg
            ON delg.id = pa.delegacion_id
        LEFT JOIN delitos d
            ON d.id = pa.delito_id
        LEFT JOIN categorias_delito cd
            ON cd.id = d.categoria_id
        LEFT JOIN areas_penal a
            ON a.id = pa.area_hechos_id
        LEFT JOIN usuarios u
            ON u.id = pa.abogado_responsable_id
        LEFT JOIN penal_conocimiento_amp pca
            ON pca.asunto_id = pa.id
        LEFT JOIN LATERAL (
            SELECT
                pce.nombre AS ultima_etapa_nombre,
                pcf.nombre AS ultima_fase_nombre
            FROM penal_actuaciones pact
            INNER JOIN penal_catalogo_etapas pce
                ON pce.id = pact.etapa_id
            LEFT JOIN penal_catalogo_fases pcf
                ON pcf.id = pact.fase_id
            WHERE pact.asunto_id = pa.id
              AND pact.activo = TRUE
              AND pact.deleted_at IS NULL
            ORDER BY pact.fecha_actuacion DESC, pact.id DESC
            LIMIT 1
        ) ultima_actuacion ON TRUE
        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    \'id\', pd.id,
                    \'nombre\', pd.nombre,
                    \'es_imss\', pd.es_imss,
                    \'es_principal\', pd.es_principal,
                    \'es_coadyuvante\', pd.es_coadyuvante,
                    \'orden\', pd.orden
                )
                ORDER BY pd.orden ASC, pd.id ASC
            ) AS denunciantes_json
            FROM penal_denunciantes pd
            WHERE pd.asunto_id = pa.id
        ) den ON TRUE
        LEFT JOIN LATERAL (
            SELECT json_agg(
                json_build_object(
                    \'id\', ppr.id,
                    \'nombre\', ppr.nombre,
                    \'es_qrr\', ppr.es_qrr,
                    \'orden\', ppr.orden
                )
                ORDER BY ppr.orden ASC, ppr.id ASC
            ) AS responsables_json
            FROM penal_probables_responsables ppr
            WHERE ppr.asunto_id = pa.id
        ) resp ON TRUE
        WHERE pa.activo = TRUE
          AND pa.deleted_at IS NULL
    ';

    $params = [];

    if ($delegacionId !== null) {
        $sql .= ' AND pa.delegacion_id = :delegacionId';
        $params['delegacionId'] = $delegacionId;
    }

    $sql .= ' ORDER BY pa.updated_at DESC NULLS LAST, pa.id DESC';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $cases = array_map(
        static fn(array $case): array => mapPenalListCase($case),
        $stmt->fetchAll(PDO::FETCH_ASSOC)
    );

    sendSuccess('Asuntos penales cargados correctamente', [
        'cases' => $cases,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los asuntos penales', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
