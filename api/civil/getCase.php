<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function decodeCivilCaseDetailJsonFields(array $case): array
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

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        sendError('El id es obligatorio', 400);
    }

    $caseStmt = $pdo->prepare('
        SELECT
            id,
            numero,
            delegacion_id,
            area_generadora_id,
            jurisdiccion,
            tipo_juicio,
            subtipo_juicio,
            sub_subtipo_juicio,
            numero_juicio,
            anio,
            numero_expediente,
            acumulado_a,
            organo_jurisdiccional_id,
            (
                SELECT nombre
                FROM organos_jurisdiccionales
                WHERE id = expedientes_civil.organo_jurisdiccional_id
                LIMIT 1
            ) AS organo_jurisdiccional_nombre,
            (
                SELECT circuito
                FROM organos_jurisdiccionales
                WHERE id = expedientes_civil.organo_jurisdiccional_id
                LIMIT 1
            ) AS organo_jurisdiccional_circuito,
            fecha_inicio,
            imss_es,
            actor,
            demandados,
            codemandados,
            prestacion_principal,
            prestaciones_secundarias,
            prestaciones_notas,
            importe_demandado,
            abogado_responsable_id,
            (
                SELECT nombre_completo
                FROM usuarios
                WHERE id = expedientes_civil.abogado_responsable_id
                LIMIT 1
            ) AS abogado_responsable_nombre,
            pronostico,
            estatus,
            fecha_creacion,
            fecha_actualizacion,
            fecha_vencimiento,
            created_at
        FROM expedientes_civil
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');

    $caseStmt->execute([
        'id' => $id,
    ]);

    $case = $caseStmt->fetch();

    if (!$case) {
        sendError('Caso no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    $case = decodeCivilCaseDetailJsonFields($case);

    $trackingStmt = $pdo->prepare('
        SELECT
            id,
            expediente_id,
            fecha_actuacion,
            tipo_actuacion,
            descripcion,
            actualizado_siij,
            created_at
        FROM seguimiento_civil
        WHERE expediente_id = :id
          AND activo = TRUE
        ORDER BY fecha_actuacion DESC, id DESC
    ');

    $trackingStmt->execute([
        'id' => $id,
    ]);

    $trackings = $trackingStmt->fetchAll();

    $childrenStmt = $pdo->prepare('
        SELECT caso_hijo_id
        FROM acumulados_civil
        WHERE caso_padre_id = :id
          AND activo = TRUE
        ORDER BY caso_hijo_id
    ');

    $childrenStmt->execute([
        'id' => $id,
    ]);

    $children = $childrenStmt->fetchAll();

    $parentStmt = $pdo->prepare('
        SELECT caso_padre_id
        FROM acumulados_civil
        WHERE caso_hijo_id = :id
          AND activo = TRUE
        LIMIT 1
    ');

    $parentStmt->execute([
        'id' => $id,
    ]);

    $parent = $parentStmt->fetch();

    $case['seguimientos'] = $trackings;
    $case['seguimiento'] = $trackings[0] ?? new stdClass();
    $case['juicios_acumulados'] = array_map(
        fn(array $row): int => (int) $row['caso_hijo_id'],
        $children
    );

    $case['acumulado_a'] = $parent ? (int) $parent['caso_padre_id'] : null;

    sendSuccess('Caso civil cargado correctamente', [
        'case' => $case,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el caso civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
