<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function mapPenalDenunciantes(array $rows): array
{
    return array_map(static function (array $row): array {
        return [
            'id' => isset($row['id']) ? (int) $row['id'] : null,
            'nombre' => (string) ($row['nombre'] ?? ''),
            'es_imss' => !empty($row['es_imss']),
            'es_principal' => !empty($row['es_principal']),
            'es_coadyuvante' => !empty($row['es_coadyuvante']),
            'orden' => isset($row['orden']) ? (int) $row['orden'] : null,
        ];
    }, $rows);
}

function mapPenalProbablesResponsables(array $rows): array
{
    return array_map(static function (array $row): array {
        return [
            'id' => isset($row['id']) ? (int) $row['id'] : null,
            'nombre' => (string) ($row['nombre'] ?? ''),
            'es_qrr' => !empty($row['es_qrr']),
            'orden' => isset($row['orden']) ? (int) $row['orden'] : null,
        ];
    }, $rows);
}

try {
    $user = requirePenalAccess();
    $pdo = getDatabaseConnection();

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        sendError('El id es obligatorio', 400);
    }

    $caseStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.delegacion_id,
            delg.nombre AS delegacion_nombre,
            pa.numero_carpeta,
            pa.anio_inicio,
            pa.fecha_presentacion_denuncia,
            pa.delito_id,
            d.nombre AS delito_nombre,
            pa.hechos_denunciante,
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
            pa.updated_at
        FROM penal_asuntos pa
        LEFT JOIN delegaciones delg
            ON delg.id = pa.delegacion_id
        LEFT JOIN delitos d
            ON d.id = pa.delito_id
        LEFT JOIN areas_penal a
            ON a.id = pa.area_hechos_id
        LEFT JOIN usuarios u
            ON u.id = pa.abogado_responsable_id
        LEFT JOIN penal_conocimiento_amp pca
            ON pca.asunto_id = pa.id
        WHERE pa.id = :id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');

    $caseStmt->execute([
        'id' => $id,
    ]);

    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Caso penal no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    $denunciantesStmt = $pdo->prepare('
        SELECT id, nombre, es_imss, es_principal, es_coadyuvante, orden
        FROM penal_denunciantes
        WHERE asunto_id = :asunto_id
        ORDER BY orden ASC, id ASC
    ');
    $denunciantesStmt->execute([
        'asunto_id' => $id,
    ]);
    $denunciantes = mapPenalDenunciantes($denunciantesStmt->fetchAll(PDO::FETCH_ASSOC));

    $responsablesStmt = $pdo->prepare('
        SELECT id, nombre, es_qrr, orden
        FROM penal_probables_responsables
        WHERE asunto_id = :asunto_id
        ORDER BY orden ASC, id ASC
    ');
    $responsablesStmt->execute([
        'asunto_id' => $id,
    ]);
    $probablesResponsables = mapPenalProbablesResponsables($responsablesStmt->fetchAll(PDO::FETCH_ASSOC));

    $documentoInicialStmt = $pdo->prepare('
        SELECT
            id,
            nombre_original,
            ruta_archivo,
            created_at
        FROM penal_asunto_documentos
        WHERE asunto_id = :asunto_id
          AND activo = TRUE
        ORDER BY created_at DESC, id DESC
        LIMIT 1
    ');
    $documentoInicialStmt->execute([
        'asunto_id' => $id,
    ]);
    $documentoInicial = $documentoInicialStmt->fetch(PDO::FETCH_ASSOC) ?: null;

    $trackingStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.asunto_id AS expediente_id,
            pa.fecha_actuacion,
            pce.nombre AS tipo_actuacion,
            pa.descripcion,
            pa.created_at,
            pa.texto_complementario_estatus,
            pa.referencia_carpeta
        FROM penal_actuaciones pa
        INNER JOIN penal_catalogo_etapas pce
            ON pce.id = pa.etapa_id
        WHERE pa.asunto_id = :asunto_id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        ORDER BY pa.fecha_actuacion DESC, pa.id DESC
    ');
    $trackingStmt->execute([
        'asunto_id' => $id,
    ]);
    $trackings = $trackingStmt->fetchAll(PDO::FETCH_ASSOC);

    $requerimientosStmt = $pdo->prepare('
        SELECT
            COUNT(*) AS total_requerimientos,
            COUNT(*) FILTER (WHERE fase_actual = \'SEGUIMIENTO_INTERNO\') AS requerimientos_seguimiento,
            COUNT(*) FILTER (WHERE fase_actual = \'CONTESTACION_FINAL\') AS requerimientos_contestacion
        FROM penal_requerimientos
        WHERE asunto_id = :asunto_id
          AND activo = TRUE
    ');
    $requerimientosStmt->execute([
        'asunto_id' => $id,
    ]);
    $requerimientos = $requerimientosStmt->fetch(PDO::FETCH_ASSOC) ?: [];

    $case['numero_expediente'] = $case['numero_carpeta'];
    $case['fecha_inicio'] = $case['fecha_presentacion_denuncia'];
    $case['fecha_creacion'] = $case['created_at'];
    $case['fecha_actualizacion'] = $case['updated_at'];
    $case['cuantia'] = $case['cuantia_monto'];
    $case['lugar_hechos'] = $case['area_generadora_nombre'];
    $case['es_coadyuvancia'] = !empty($case['coadyuvancia']);
    $case['estatus'] = (string) ($case['estatus_general'] ?? 'TRAMITE');
    $case['denunciantes'] = $denunciantes;
    $case['probables_responsables'] = $probablesResponsables;
    $case['probable_responsable'] = $probablesResponsables[0] ?? null;
    $case['denunciante'] = $denunciantes[0] ?? null;
    $case['documento_inicial'] = $documentoInicial ? [
        'id' => (int) $documentoInicial['id'],
        'nombre_original' => (string) ($documentoInicial['nombre_original'] ?? ''),
        'ruta_archivo' => (string) ($documentoInicial['ruta_archivo'] ?? ''),
        'documento_tipo' => 'ASUNTO',
        'created_at' => $documentoInicial['created_at'] ?? null,
    ] : null;
    $case['total_requerimientos'] = isset($requerimientos['total_requerimientos']) ? (int) $requerimientos['total_requerimientos'] : 0;
    $case['requerimientos_seguimiento'] = isset($requerimientos['requerimientos_seguimiento']) ? (int) $requerimientos['requerimientos_seguimiento'] : 0;
    $case['requerimientos_contestacion'] = isset($requerimientos['requerimientos_contestacion']) ? (int) $requerimientos['requerimientos_contestacion'] : 0;
    $case['seguimientos'] = $trackings;
    $case['seguimiento'] = $trackings[0] ?? new stdClass();

    sendSuccess('Caso penal cargado correctamente', [
        'case' => $case,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el caso penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
