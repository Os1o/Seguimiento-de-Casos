<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function normalizeCivilCasePayload(array $payload): array
{
    $allowedFields = [
        'id',
        'numero',
        'delegacion_id',
        'area_generadora_id',
        'jurisdiccion',
        'tipo_juicio',
        'subtipo_juicio',
        'sub_subtipo_juicio',
        'numero_juicio',
        'anio',
        'numero_expediente',
        'organo_jurisdiccional_id',
        'fecha_inicio',
        'imss_es',
        'actor',
        'demandados',
        'codemandados',
        'prestacion_principal',
        'prestaciones_secundarias',
        'prestaciones_notas',
        'importe_demandado',
        'abogado_responsable_id',
        'pronostico',
        'estatus',
        'fecha_vencimiento',
    ];

    $case = [];

    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $payload)) {
            $case[$field] = $payload[$field];
        }
    }

    if (empty($case['anio']) && !empty($payload['ano'])) {
        $case['anio'] = $payload['ano'];
    }

    $case['delegacion_id'] = isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null;
    $case['area_generadora_id'] = isset($case['area_generadora_id']) ? (int) $case['area_generadora_id'] : null;
    $case['organo_jurisdiccional_id'] = isset($case['organo_jurisdiccional_id']) ? (int) $case['organo_jurisdiccional_id'] : null;
    $case['prestacion_principal'] = isset($case['prestacion_principal']) ? (int) $case['prestacion_principal'] : null;
    $case['abogado_responsable_id'] = isset($case['abogado_responsable_id']) && $case['abogado_responsable_id'] !== ''
        ? (int) $case['abogado_responsable_id']
        : null;
    $case['importe_demandado'] = isset($case['importe_demandado']) ? (float) $case['importe_demandado'] : 0;
    $case['actor'] = $case['actor'] ?? null;
    $case['demandados'] = $case['demandados'] ?? [];
    $case['codemandados'] = $case['codemandados'] ?? [];
    $case['prestaciones_secundarias'] = $case['prestaciones_secundarias'] ?? [];

    return $case;
}

function validateCivilCase(array $case): void
{
    if (empty($case['delegacion_id']) || empty($case['area_generadora_id']) || empty($case['organo_jurisdiccional_id']) || empty($case['fecha_inicio'])) {
        sendError('Completa todos los campos obligatorios', 400);
    }

    if (empty($case['numero_expediente'])) {
        sendError('Debe capturar el numero de expediente', 400);
    }

    if (!empty($case['fecha_inicio']) && $case['fecha_inicio'] > date('Y-m-d')) {
        sendError('La fecha de inicio no puede ser posterior a hoy', 400);
    }

    if (empty($case['imss_es'])) {
        sendError('Debe seleccionar la calidad del IMSS', 400);
    }

    if ($case['imss_es'] !== 'ACTOR' && empty($case['actor'])) {
        sendError('Debe capturar al menos un actor', 400);
    }

    if ($case['imss_es'] !== 'DEMANDADO' && empty($case['demandados'])) {
        sendError('Debe capturar al menos un demandado', 400);
    }

    if (empty($case['prestacion_principal'])) {
        sendError('Debe seleccionar una prestacion principal', 400);
    }
}

function resolveAndValidateCivilResponsibleLawyer(PDO $pdo, array $user, array &$case): void
{
    if (!isAdminUser($user) && isAbogadoUser($user)) {
        $case['abogado_responsable_id'] = (int) $user['id'];
    }

    if (empty($case['abogado_responsable_id'])) {
        sendError('Debe seleccionar un abogado responsable', 400);
    }

    $stmt = $pdo->prepare('
        SELECT id, delegacion_id
        FROM usuarios
        WHERE id = :id
          AND activo = TRUE
          AND es_abogado = TRUE
          AND permiso_civil_mercantil = TRUE
        LIMIT 1
    ');

    $stmt->execute([
        'id' => (int) $case['abogado_responsable_id'],
    ]);

    $lawyer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lawyer) {
        sendError('El abogado responsable seleccionado no es valido', 400);
    }

    if (isAdminUser($user)) {
        return;
    }

    if (isAbogadoUser($user) && (int) $user['id'] !== (int) $lawyer['id']) {
        sendError('No puedes asignar un abogado responsable distinto a tu usuario', 403);
    }

    $caseDelegacionId = isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null;
    $lawyerDelegacionId = isset($lawyer['delegacion_id']) ? (int) $lawyer['delegacion_id'] : null;

    if ($caseDelegacionId === null || $lawyerDelegacionId === null || $caseDelegacionId !== $lawyerDelegacionId) {
        sendError('El abogado responsable debe pertenecer a la misma JSJ del asunto', 400);
    }
}

function validateCivilOrganoDelegacion(PDO $pdo, array $case): void
{
    if (empty($case['delegacion_id']) || empty($case['organo_jurisdiccional_id'])) {
        return;
    }

    $stmt = $pdo->prepare('
        SELECT 1
        FROM organos_jurisdiccionales_delegaciones
        WHERE organo_jurisdiccional_id = :organo_jurisdiccional_id
          AND delegacion_id = :delegacion_id
        LIMIT 1
    ');

    $stmt->execute([
        'organo_jurisdiccional_id' => (int) $case['organo_jurisdiccional_id'],
        'delegacion_id' => (int) $case['delegacion_id'],
    ]);

    if (!$stmt->fetchColumn()) {
        sendError('El tribunal o juzgado seleccionado no corresponde a la delegacion elegida', 400);
    }
}

function ensureUniqueCivilCaseNumber(PDO $pdo, array $case): void
{
    $numeroExpediente = trim((string) ($case['numero_expediente'] ?? ''));
    if ($numeroExpediente === '') {
        return;
    }

    $sql = '
        SELECT id
        FROM expedientes_civil
        WHERE numero_expediente = :numero_expediente
          AND activo = TRUE
    ';

    $params = [
        'numero_expediente' => $numeroExpediente,
    ];

    if (!empty($case['id'])) {
        $sql .= ' AND id <> :id';
        $params['id'] = (int) $case['id'];
    }

    $sql .= ' LIMIT 1';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        sendError('Ya existe un expediente activo con ese numero de asunto', 409);
    }
}

function buildCivilAuditChanges(array $before, array $after): array
{
    return buildAuditFieldChanges(
        $before,
        $after,
        [
            'delegacion_id' => 'JSJ',
            'area_generadora_id' => 'Area generadora',
            'jurisdiccion' => 'Jurisdiccion',
            'tipo_juicio' => 'Materia',
            'subtipo_juicio' => 'Tipo de procedimiento',
            'sub_subtipo_juicio' => 'Via',
            'numero_juicio' => 'Numero de asunto',
            'anio' => 'Ano',
            'numero_expediente' => 'Numero de expediente',
            'organo_jurisdiccional_id' => 'Tribunal / Juzgado',
            'fecha_inicio' => 'Fecha de inicio',
            'imss_es' => 'Calidad IMSS',
            'actor' => 'Actor',
            'demandados' => 'Demandados',
            'codemandados' => 'Codemandados',
            'prestacion_principal' => 'Prestacion principal',
            'prestaciones_secundarias' => 'Prestaciones secundarias',
            'prestaciones_notas' => 'Notas de prestaciones',
            'importe_demandado' => 'Importe demandado',
            'abogado_responsable_id' => 'Abogado responsable',
            'pronostico' => 'Pronostico',
            'estatus' => 'Estatus',
            'fecha_vencimiento' => 'Fecha de vencimiento',
        ],
        [
            'actor',
            'demandados',
            'codemandados',
            'prestaciones_secundarias',
        ]
    );
}

function isCivilAccumulatedChild(PDO $pdo, int $caseId): bool
{
    $stmt = $pdo->prepare('
        SELECT 1
        FROM acumulados_civil
        WHERE caso_hijo_id = :case_id
          AND activo = TRUE
        LIMIT 1
    ');

    $stmt->execute([
        'case_id' => $caseId,
    ]);

    return (bool) $stmt->fetchColumn();
}

try {
    $user = requireCivilWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody, true);

    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $payload = normalizeInputToUppercase($payload);

    $case = normalizeCivilCasePayload($payload);
    if (!isAdminUser($user)) {
        $case['delegacion_id'] = getUserDelegacionId($user);
    }

    validateCivilCase($case);

    $pdo = getDatabaseConnection();

    validateCivilOrganoDelegacion($pdo, $case);
    ensureUniqueCivilCaseNumber($pdo, $case);
    resolveAndValidateCivilResponsibleLawyer($pdo, $user, $case);

    $isUpdate = !empty($case['id']);

    $existingCase = null;

    if ($isUpdate) {
        $scopeStmt = $pdo->prepare('SELECT * FROM expedientes_civil WHERE id = :id LIMIT 1');
        $scopeStmt->execute([
            'id' => (int) $case['id'],
        ]);

        $existingCase = $scopeStmt->fetch(PDO::FETCH_ASSOC);

        if (!$existingCase) {
            sendError('Caso no encontrado', 404);
        }

        ensureWriteDelegacionAccess($user, $existingCase['delegacion_id'] !== null ? (int) $existingCase['delegacion_id'] : null);

        if (isCivilAccumulatedChild($pdo, (int) $case['id'])) {
            sendError('El asunto esta acumulado y no puede editarse. Debe desacumularse primero.', 409);
        }
    }

    if ($isUpdate) {
        $case['fecha_actualizacion'] = date('c');

        $stmt = $pdo->prepare('
            UPDATE expedientes_civil
            SET
                numero = :numero,
                delegacion_id = :delegacion_id,
                area_generadora_id = :area_generadora_id,
                jurisdiccion = :jurisdiccion,
                tipo_juicio = :tipo_juicio,
                subtipo_juicio = :subtipo_juicio,
                sub_subtipo_juicio = :sub_subtipo_juicio,
                numero_juicio = :numero_juicio,
                anio = :anio,
                numero_expediente = :numero_expediente,
                organo_jurisdiccional_id = :organo_jurisdiccional_id,
                fecha_inicio = :fecha_inicio,
                imss_es = :imss_es,
                actor = :actor::jsonb,
                demandados = :demandados::jsonb,
                codemandados = :codemandados::jsonb,
                prestacion_principal = :prestacion_principal,
                prestaciones_secundarias = :prestaciones_secundarias::jsonb,
                prestaciones_notas = :prestaciones_notas,
                importe_demandado = :importe_demandado,
                abogado_responsable_id = :abogado_responsable_id,
                pronostico = :pronostico,
                estatus = :estatus,
                fecha_vencimiento = :fecha_vencimiento,
                fecha_actualizacion = :fecha_actualizacion
            WHERE id = :id
            RETURNING *
        ');

        $stmt->execute([
            'id' => (int) $case['id'],
            'numero' => $case['numero'] ?? null,
            'delegacion_id' => $case['delegacion_id'],
            'area_generadora_id' => $case['area_generadora_id'],
            'jurisdiccion' => $case['jurisdiccion'] ?? null,
            'tipo_juicio' => $case['tipo_juicio'] ?? null,
            'subtipo_juicio' => $case['subtipo_juicio'] ?? null,
            'sub_subtipo_juicio' => $case['sub_subtipo_juicio'] ?? null,
            'numero_juicio' => $case['numero_juicio'] ?? null,
            'anio' => $case['anio'] ?? null,
            'numero_expediente' => $case['numero_expediente'],
            'organo_jurisdiccional_id' => $case['organo_jurisdiccional_id'],
            'fecha_inicio' => $case['fecha_inicio'],
            'imss_es' => $case['imss_es'],
            'actor' => json_encode($case['actor'], JSON_UNESCAPED_UNICODE),
            'demandados' => json_encode($case['demandados'], JSON_UNESCAPED_UNICODE),
            'codemandados' => json_encode($case['codemandados'], JSON_UNESCAPED_UNICODE),
            'prestacion_principal' => $case['prestacion_principal'],
            'prestaciones_secundarias' => json_encode($case['prestaciones_secundarias'], JSON_UNESCAPED_UNICODE),
            'prestaciones_notas' => $case['prestaciones_notas'] ?? null,
            'importe_demandado' => $case['importe_demandado'],
            'abogado_responsable_id' => $case['abogado_responsable_id'],
            'pronostico' => $case['pronostico'] ?? null,
            'estatus' => $case['estatus'] ?? 'TRAMITE',
            'fecha_vencimiento' => $case['fecha_vencimiento'] ?? null,
            'fecha_actualizacion' => $case['fecha_actualizacion'],
        ]);
    } else {
        $case['fecha_creacion'] = date('c');
        $case['fecha_actualizacion'] = date('c');

        $stmt = $pdo->prepare('
            INSERT INTO expedientes_civil (
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
                organo_jurisdiccional_id,
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
                pronostico,
                estatus,
                fecha_vencimiento,
                fecha_creacion,
                fecha_actualizacion
            )
            VALUES (
                :numero,
                :delegacion_id,
                :area_generadora_id,
                :jurisdiccion,
                :tipo_juicio,
                :subtipo_juicio,
                :sub_subtipo_juicio,
                :numero_juicio,
                :anio,
                :numero_expediente,
                :organo_jurisdiccional_id,
                :fecha_inicio,
                :imss_es,
                :actor::jsonb,
                :demandados::jsonb,
                :codemandados::jsonb,
                :prestacion_principal,
                :prestaciones_secundarias::jsonb,
                :prestaciones_notas,
                :importe_demandado,
                :abogado_responsable_id,
                :pronostico,
                :estatus,
                :fecha_vencimiento,
                :fecha_creacion,
                :fecha_actualizacion
            )
            RETURNING *
        ');

        $stmt->execute([
            'numero' => $case['numero'] ?? null,
            'delegacion_id' => $case['delegacion_id'],
            'area_generadora_id' => $case['area_generadora_id'],
            'jurisdiccion' => $case['jurisdiccion'] ?? null,
            'tipo_juicio' => $case['tipo_juicio'] ?? null,
            'subtipo_juicio' => $case['subtipo_juicio'] ?? null,
            'sub_subtipo_juicio' => $case['sub_subtipo_juicio'] ?? null,
            'numero_juicio' => $case['numero_juicio'] ?? null,
            'anio' => $case['anio'] ?? null,
            'numero_expediente' => $case['numero_expediente'],
            'organo_jurisdiccional_id' => $case['organo_jurisdiccional_id'],
            'fecha_inicio' => $case['fecha_inicio'],
            'imss_es' => $case['imss_es'],
            'actor' => json_encode($case['actor'], JSON_UNESCAPED_UNICODE),
            'demandados' => json_encode($case['demandados'], JSON_UNESCAPED_UNICODE),
            'codemandados' => json_encode($case['codemandados'], JSON_UNESCAPED_UNICODE),
            'prestacion_principal' => $case['prestacion_principal'],
            'prestaciones_secundarias' => json_encode($case['prestaciones_secundarias'], JSON_UNESCAPED_UNICODE),
            'prestaciones_notas' => $case['prestaciones_notas'] ?? null,
            'importe_demandado' => $case['importe_demandado'],
            'abogado_responsable_id' => $case['abogado_responsable_id'],
            'pronostico' => $case['pronostico'] ?? null,
            'estatus' => $case['estatus'] ?? 'TRAMITE',
            'fecha_vencimiento' => $case['fecha_vencimiento'] ?? null,
            'fecha_creacion' => $case['fecha_creacion'],
            'fecha_actualizacion' => $case['fecha_actualizacion'],
        ]);
    }

    $savedCase = $stmt->fetch();
    $auditDetails = [
        'numero_expediente' => $savedCase['numero_expediente'] ?? null,
        'estatus' => $savedCase['estatus'] ?? null,
    ];

    if ($isUpdate && is_array($existingCase)) {
        $auditDetails['cambios'] = buildCivilAuditChanges($existingCase, is_array($savedCase) ? $savedCase : []);
    }

    auditLog($pdo, $user, [
        'modulo' => 'CIVIL',
        'accion' => $isUpdate ? 'EDITAR' : 'CREAR',
        'entidad' => 'EXPEDIENTE_CIVIL',
        'entidad_id' => (int) ($savedCase['id'] ?? 0) ?: null,
        'expediente_id' => (int) ($savedCase['id'] ?? 0) ?: null,
        'delegacion_id' => $savedCase['delegacion_id'] ?? null,
        'descripcion' => $isUpdate ? 'Edicion de expediente civil' : 'Creacion de expediente civil',
        'detalles' => $auditDetails,
    ]);

    sendSuccess('Caso civil guardado correctamente', [
        'case' => $savedCase,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo guardar el caso civil', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
