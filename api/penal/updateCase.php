<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function parsePenalUpdateJsonArray(string $field): array
{
    $raw = (string) ($_POST[$field] ?? '[]');
    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        sendError('El campo ' . $field . ' contiene datos invalidos', 400);
    }

    return $decoded;
}

function normalizePenalUpdatePayload(): array
{
    $payload = [
        'id' => isset($_POST['id']) ? (int) $_POST['id'] : 0,
        'delegacion_id' => isset($_POST['delegacion_id']) ? (int) $_POST['delegacion_id'] : null,
        'numero_carpeta' => trim((string) ($_POST['numero_carpeta'] ?? '')),
        'anio_inicio' => isset($_POST['anio_inicio']) ? (int) $_POST['anio_inicio'] : null,
        'fecha_presentacion_denuncia' => trim((string) ($_POST['fecha_presentacion_denuncia'] ?? '')),
        'delito_id' => isset($_POST['delito_id']) ? (int) $_POST['delito_id'] : null,
        'area_hechos_id' => isset($_POST['area_hechos_id']) ? (int) $_POST['area_hechos_id'] : null,
        'hechos_denunciante' => trim((string) ($_POST['hechos_denunciante'] ?? '')),
        'dato_relevante' => trim((string) ($_POST['dato_relevante'] ?? '')),
        'sin_cuantificar' => isset($_POST['sin_cuantificar']) && (string) $_POST['sin_cuantificar'] === '1',
        'cuantia_monto' => trim((string) ($_POST['cuantia_monto'] ?? '')),
        'escenario_denunciante' => trim((string) ($_POST['escenario_denunciante'] ?? '')),
        'coadyuvancia' => isset($_POST['coadyuvancia']) && (string) $_POST['coadyuvancia'] === '1',
        'abogado_responsable_id' => isset($_POST['abogado_responsable_id']) && $_POST['abogado_responsable_id'] !== ''
            ? (int) $_POST['abogado_responsable_id']
            : null,
        'documento_inicial_observaciones' => trim((string) ($_POST['documento_inicial_observaciones'] ?? '')),
        'denunciantes' => parsePenalUpdateJsonArray('denunciantes'),
        'probables_responsables' => parsePenalUpdateJsonArray('probables_responsables'),
    ];

    return normalizeInputToUppercase($payload, ['fecha_presentacion_denuncia', 'cuantia_monto']);
}

function getPenalAuditNameMap(PDO $pdo, string $table, array $ids): array
{
    $ids = array_values(array_unique(array_filter(array_map('intval', $ids), static fn (int $id): bool => $id > 0)));

    if ($ids === []) {
        return [];
    }

    $allowedTables = [
        'delegaciones' => 'delegaciones',
        'delitos' => 'delitos',
        'areas' => 'areas',
        'areas_penal' => 'areas_penal',
        'usuarios' => 'usuarios',
    ];

    if (!isset($allowedTables[$table])) {
        return [];
    }

    $placeholders = implode(', ', array_fill(0, count($ids), '?'));
    $nameColumn = $table === 'usuarios' ? 'nombre_completo' : 'nombre';
    $stmt = $pdo->prepare("SELECT id, {$nameColumn} AS nombre FROM {$allowedTables[$table]} WHERE id IN ({$placeholders})");
    $stmt->execute($ids);

    $map = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $map[(int) $row['id']] = (string) $row['nombre'];
    }

    return $map;
}

function replacePenalAuditIdsWithNames(array $data, array $maps): array
{
    $resolved = $data;

    foreach ($maps as $field => $map) {
        if (!array_key_exists($field, $resolved) || $resolved[$field] === null || $resolved[$field] === '') {
            continue;
        }

        $id = (int) $resolved[$field];
        if (isset($map[$id])) {
            $resolved[$field] = $map[$id];
        }
    }

    if (array_key_exists('estatus_general', $resolved)) {
        $statusMap = [
            'TRAMITE' => 'En tramite',
            'CONCLUIDO' => 'Concluido',
        ];
        $status = strtoupper((string) $resolved['estatus_general']);
        $resolved['estatus_general'] = $statusMap[$status] ?? $resolved['estatus_general'];
    }

    return $resolved;
}

function buildPenalCaseAuditChanges(PDO $pdo, array $before, array $after): array
{
    $maps = [
        'delegacion_id' => getPenalAuditNameMap($pdo, 'delegaciones', [$before['delegacion_id'] ?? null, $after['delegacion_id'] ?? null]),
        'delito_id' => getPenalAuditNameMap($pdo, 'delitos', [$before['delito_id'] ?? null, $after['delito_id'] ?? null]),
        'area_hechos_id' => getPenalAuditNameMap($pdo, 'areas_penal', [$before['area_hechos_id'] ?? null, $after['area_hechos_id'] ?? null]),
        'abogado_responsable_id' => getPenalAuditNameMap($pdo, 'usuarios', [$before['abogado_responsable_id'] ?? null, $after['abogado_responsable_id'] ?? null]),
    ];

    return buildAuditFieldChanges(
        replacePenalAuditIdsWithNames($before, $maps),
        replacePenalAuditIdsWithNames($after, $maps),
        [
            'delegacion_id' => 'OOAD',
            'numero_carpeta' => 'Numero de carpeta',
            'anio_inicio' => 'Anio',
            'fecha_presentacion_denuncia' => 'Fecha de presentacion',
            'delito_id' => 'Delito',
            'area_hechos_id' => 'Area generadora',
            'hechos_denunciante' => 'Hechos del denunciante',
            'dato_relevante' => 'Dato relevante',
            'sin_cuantificar' => 'Sin cuantificar',
            'cuantia_monto' => 'Cuantia',
            'escenario_denunciante' => 'Escenario denunciante',
            'coadyuvancia' => 'Coadyuvancia',
            'estatus_general' => 'Estatus',
            'abogado_responsable_id' => 'Abogado responsable',
        ]
    );
}

function resolveAndValidatePenalUpdateResponsibleLawyer(PDO $pdo, array $user, array $payload): int
{
    $lawyerId = isset($payload['abogado_responsable_id']) ? (int) $payload['abogado_responsable_id'] : 0;

    if (($user['rol'] ?? null) === 'editor' && isAbogadoUser($user) && !isJefeUser($user)) {
        $lawyerId = (int) ($user['id'] ?? 0);
    }

    if ($lawyerId <= 0) {
        sendError('Debe seleccionar un abogado responsable', 400);
    }

    $stmt = $pdo->prepare('
        SELECT id, delegacion_id
        FROM usuarios
        WHERE id = :id
          AND activo = TRUE
          AND es_abogado = TRUE
          AND permiso_penal = TRUE
        LIMIT 1
    ');
    $stmt->execute(['id' => $lawyerId]);
    $lawyer = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$lawyer) {
        sendError('El abogado responsable seleccionado no es valido', 400);
    }

    if (!isAdminUser($user)) {
        $caseDelegacionId = isset($payload['delegacion_id']) ? (int) $payload['delegacion_id'] : null;
        $lawyerDelegacionId = isset($lawyer['delegacion_id']) ? (int) $lawyer['delegacion_id'] : null;

        if ($caseDelegacionId === null || $lawyerDelegacionId === null || $caseDelegacionId !== $lawyerDelegacionId) {
            sendError('El abogado responsable debe pertenecer a la misma JSJ del asunto', 400);
        }

        if (($user['rol'] ?? null) === 'editor' && isAbogadoUser($user) && !isJefeUser($user) && (int) ($user['id'] ?? 0) !== $lawyerId) {
            sendError('No puedes asignar un abogado responsable distinto a tu usuario', 403);
        }
    }

    return $lawyerId;
}

function validatePenalUpdateCaseNumber(string $numeroCarpeta): void
{
    $numeroCarpeta = strtoupper(trim($numeroCarpeta));

    if ($numeroCarpeta === '') {
        sendError('El numero de carpeta es obligatorio', 400);
    }

    if (mb_strlen($numeroCarpeta, 'UTF-8') > 84) {
        sendError('El numero de carpeta no puede exceder 84 caracteres', 400);
    }

    if (!preg_match('/^(FED|LOC)\/[A-Z0-9\/-]{3,80}$/', $numeroCarpeta)) {
        sendError('El numero de carpeta solo puede incluir jurisdiccion FED o LOC, letras, numeros, diagonales y guiones medios', 400);
    }
}

function normalizePenalUpdateMonto(string $monto, bool $sinCuantificar): ?string
{
    if ($sinCuantificar) {
        return null;
    }

    $normalized = str_replace(',', '', trim($monto));

    if ($normalized === '') {
        sendError('Captura el monto o marca Sin cuantificar', 400);
    }

    if (!is_numeric($normalized)) {
        sendError('La cuantia debe ser numerica', 400);
    }

    return number_format((float) $normalized, 2, '.', '');
}

function validatePenalUpdateDenunciantes(array $denunciantes, string $escenario): array
{
    if ($denunciantes === []) {
        sendError('Debes capturar al menos un denunciante', 400);
    }

    $normalized = [];
    $imssPrincipal = 0;
    $principales = 0;

    foreach ($denunciantes as $index => $denunciante) {
        if (!is_array($denunciante)) {
            sendError('El listado de denunciantes contiene datos invalidos', 400);
        }

        $nombre = trim((string) ($denunciante['nombre'] ?? ''));
        if ($nombre === '') {
            sendError('Todos los denunciantes deben tener nombre', 400);
        }

        $esImss = !empty($denunciante['es_imss']);
        $esPrincipal = strtoupper((string) ($denunciante['rol'] ?? '')) === 'PRINCIPAL';
        $esCoadyuvante = !empty($denunciante['es_coadyuvante']);

        if ($esImss && $esPrincipal) {
            $imssPrincipal++;
        }

        if ($esPrincipal) {
            $principales++;
        }

        $normalized[] = [
            'nombre' => $nombre,
            'es_imss' => $esImss,
            'es_principal' => $esPrincipal,
            'es_coadyuvante' => $esCoadyuvante,
            'orden' => $index + 1,
        ];
    }

    if ($escenario === 'IMSS' && $imssPrincipal !== 1) {
        sendError('Cuando el escenario es IMSS debe existir exactamente un IMSS como denunciante principal', 400);
    }

    if (in_array($escenario, ['COADYUVANCIA', 'DISTINTO_IMSS'], true) && $principales < 1) {
        sendError('Debes capturar al menos un denunciante principal', 400);
    }

    return $normalized;
}

function validatePenalUpdateProbables(array $responsables): array
{
    if ($responsables === []) {
        sendError('Debes capturar al menos un probable responsable o marcar QRR', 400);
    }

    $normalized = [];

    foreach ($responsables as $index => $responsable) {
        if (!is_array($responsable)) {
            sendError('El listado de probables responsables contiene datos invalidos', 400);
        }

        $nombre = trim((string) ($responsable['nombre'] ?? ''));
        if ($nombre === '') {
            sendError('Todos los probables responsables deben tener nombre', 400);
        }

        $normalized[] = [
            'nombre' => $nombre,
            'es_qrr' => !empty($responsable['qrr']),
            'orden' => $index + 1,
        ];
    }

    return $normalized;
}

function validateOptionalPenalUpdateDocument(): ?array
{
    if (!isset($_FILES['archivo_inicial']) || !is_array($_FILES['archivo_inicial'])) {
        return null;
    }

    $archivo = $_FILES['archivo_inicial'];
    $uploadError = (int) ($archivo['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($uploadError === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($uploadError !== UPLOAD_ERR_OK) {
        sendError(getUploadErrorMessage($uploadError), 400, ['upload_error' => $uploadError]);
    }

    $nombreOriginal = (string) ($archivo['name'] ?? 'documento.pdf');
    $tmpPath = (string) ($archivo['tmp_name'] ?? '');
    $tamano = (int) ($archivo['size'] ?? 0);

    if ($tamano <= 0) {
        sendError('El documento inicial esta vacio', 400);
    }

    if ($tamano > 10 * 1024 * 1024) {
        sendError('El documento inicial no puede exceder 10 MB', 400);
    }

    if (strtolower(pathinfo($nombreOriginal, PATHINFO_EXTENSION)) !== 'pdf') {
        sendError('Solo se permiten archivos PDF como documento inicial', 400);
    }

    if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
        sendError('El archivo recibido no es una carga valida', 400);
    }

    $mimeType = detectUploadedFileMimeType($tmpPath);
    if ($mimeType !== 'application/pdf' || !hasValidPdfSignature($tmpPath)) {
        sendError('El documento inicial no es un PDF valido', 400);
    }

    return [
        'nombre_original' => $nombreOriginal,
        'tmp_path' => $tmpPath,
        'tamano_bytes' => $tamano,
        'mime_type' => 'application/pdf',
    ];
}

function buildPenalUpdateStoredPdfName(string $originalName): string
{
    $safeBase = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $safeBase = trim((string) $safeBase, '._-');

    if ($safeBase === '') {
        $safeBase = 'documento_inicial';
    }

    return date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safeBase . '.pdf';
}

function toPenalUpdatePgBool(bool $value): string
{
    return $value ? 'true' : 'false';
}

function validatePenalUpdatePayload(PDO $pdo, array $user, array $current, array $payload): array
{
    if ($payload['id'] <= 0) {
        sendError('El id del asunto penal es obligatorio', 400);
    }

    if ($payload['delegacion_id'] === null || $payload['numero_carpeta'] === '' || $payload['anio_inicio'] === null || $payload['fecha_presentacion_denuncia'] === '' || $payload['delito_id'] === null || $payload['area_hechos_id'] === null) {
        sendError('Completa todos los campos obligatorios del asunto penal', 400);
    }

    if ($payload['hechos_denunciante'] === '') {
        sendError('Debes capturar los hechos con datos de la victima o denunciante', 400);
    }

    if ($payload['fecha_presentacion_denuncia'] > date('Y-m-d')) {
        sendError('La fecha de presentacion de la denuncia / querella no puede ser posterior a hoy', 400);
    }

    if (mb_strlen($payload['hechos_denunciante'], 'UTF-8') > 1000) {
        sendError('Los hechos con datos de la victima o denunciante no pueden exceder 1000 caracteres', 400);
    }

    if ($payload['dato_relevante'] !== '' && mb_strlen($payload['dato_relevante'], 'UTF-8') > 500) {
        sendError('El dato relevante no puede exceder 500 caracteres', 400);
    }

    if (!in_array($payload['escenario_denunciante'], ['IMSS', 'COADYUVANCIA', 'DISTINTO_IMSS'], true)) {
        sendError('El escenario del denunciante no es valido', 400);
    }

    validatePenalUpdateCaseNumber($payload['numero_carpeta']);
    $payload['cuantia_monto'] = normalizePenalUpdateMonto($payload['cuantia_monto'], $payload['sin_cuantificar']);
    $payload['denunciantes'] = validatePenalUpdateDenunciantes($payload['denunciantes'], $payload['escenario_denunciante']);
    $payload['probables_responsables'] = validatePenalUpdateProbables($payload['probables_responsables']);

    ensureWriteDelegacionAccess($user, isset($current['delegacion_id']) ? (int) $current['delegacion_id'] : null);

    if (!isAdminUser($user)) {
        $payload['delegacion_id'] = getUserDelegacionId($user);
    }

    ensureWriteDelegacionAccess($user, $payload['delegacion_id']);
    $payload['abogado_responsable_id'] = resolveAndValidatePenalUpdateResponsibleLawyer($pdo, $user, $payload);

    $stmt = $pdo->prepare('
        SELECT id
        FROM penal_asuntos
        WHERE numero_carpeta = :numero_carpeta
          AND id <> :id
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $stmt->execute([
        'numero_carpeta' => $payload['numero_carpeta'],
        'id' => $payload['id'],
    ]);

    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        sendError('Ya existe otro asunto penal con ese numero de carpeta', 409);
    }

    $stmt = $pdo->prepare('SELECT id FROM delegaciones WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $payload['delegacion_id']]);
    if (!$stmt->fetchColumn()) {
        sendError('La OOAD seleccionada no existe', 400);
    }

    $stmt = $pdo->prepare('SELECT id FROM delitos WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $payload['delito_id']]);
    if (!$stmt->fetchColumn()) {
        sendError('El delito seleccionado no existe', 400);
    }

    $stmt = $pdo->prepare('
        SELECT id
        FROM areas_penal
        WHERE id = :id
          AND delegacion_id = :delegacion_id
          AND activo = TRUE
        LIMIT 1
    ');
    $stmt->execute([
        'id' => $payload['area_hechos_id'],
        'delegacion_id' => $payload['delegacion_id'],
    ]);

    if (!$stmt->fetchColumn()) {
        sendError('El area generadora no pertenece a la OOAD seleccionada', 400);
    }

    return $payload;
}

try {
    $user = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $pdo = getDatabaseConnection();
    $payload = normalizePenalUpdatePayload();

    $currentStmt = $pdo->prepare('
        SELECT *
        FROM penal_asuntos
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $currentStmt->execute(['id' => $payload['id']]);
    $current = $currentStmt->fetch(PDO::FETCH_ASSOC);

    if (!$current) {
        sendError('Caso penal no encontrado', 404);
    }

    if (strtoupper((string) ($current['estatus_general'] ?? '')) === 'CONCLUIDO') {
        sendError('El asunto se encuentra concluido, no se permiten modificaciones.', 400);
    }

    $payload = validatePenalUpdatePayload($pdo, $user, $current, $payload);
    $archivoInicial = validateOptionalPenalUpdateDocument();
    $finalAbsolutePath = null;

    $pdo->beginTransaction();

    $updateAsunto = $pdo->prepare('
        UPDATE penal_asuntos
        SET
            delegacion_id = :delegacion_id,
            numero_carpeta = :numero_carpeta,
            anio_inicio = :anio_inicio,
            fecha_presentacion_denuncia = :fecha_presentacion_denuncia,
            delito_id = :delito_id,
            hechos_denunciante = :hechos_denunciante,
            sin_cuantificar = :sin_cuantificar,
            cuantia_monto = :cuantia_monto,
            area_hechos_id = :area_hechos_id,
            dato_relevante = :dato_relevante,
            escenario_denunciante = :escenario_denunciante,
            coadyuvancia = :coadyuvancia,
            abogado_responsable_id = :abogado_responsable_id,
            updated_at = NOW()
        WHERE id = :id
        RETURNING *
    ');

    $updateAsunto->execute([
        'id' => $payload['id'],
        'delegacion_id' => $payload['delegacion_id'],
        'numero_carpeta' => $payload['numero_carpeta'],
        'anio_inicio' => $payload['anio_inicio'],
        'fecha_presentacion_denuncia' => $payload['fecha_presentacion_denuncia'],
        'delito_id' => $payload['delito_id'],
        'hechos_denunciante' => $payload['hechos_denunciante'],
        'sin_cuantificar' => toPenalUpdatePgBool($payload['sin_cuantificar']),
        'cuantia_monto' => $payload['cuantia_monto'],
        'area_hechos_id' => $payload['area_hechos_id'],
        'dato_relevante' => $payload['dato_relevante'] !== '' ? $payload['dato_relevante'] : null,
        'escenario_denunciante' => $payload['escenario_denunciante'],
        'coadyuvancia' => toPenalUpdatePgBool($payload['coadyuvancia']),
        'abogado_responsable_id' => $payload['abogado_responsable_id'],
    ]);

    $asunto = $updateAsunto->fetch(PDO::FETCH_ASSOC);

    $pdo->prepare('DELETE FROM penal_denunciantes WHERE asunto_id = :asunto_id')->execute(['asunto_id' => $payload['id']]);
    $pdo->prepare('DELETE FROM penal_probables_responsables WHERE asunto_id = :asunto_id')->execute(['asunto_id' => $payload['id']]);

    $insertDenunciante = $pdo->prepare('
        INSERT INTO penal_denunciantes (asunto_id, nombre, es_imss, es_principal, es_coadyuvante, orden)
        VALUES (:asunto_id, :nombre, :es_imss, :es_principal, :es_coadyuvante, :orden)
    ');

    foreach ($payload['denunciantes'] as $denunciante) {
        $insertDenunciante->execute([
            'asunto_id' => $payload['id'],
            'nombre' => $denunciante['nombre'],
            'es_imss' => toPenalUpdatePgBool($denunciante['es_imss']),
            'es_principal' => toPenalUpdatePgBool($denunciante['es_principal']),
            'es_coadyuvante' => toPenalUpdatePgBool($denunciante['es_coadyuvante']),
            'orden' => $denunciante['orden'],
        ]);
    }

    $insertResponsable = $pdo->prepare('
        INSERT INTO penal_probables_responsables (asunto_id, nombre, es_qrr, orden)
        VALUES (:asunto_id, :nombre, :es_qrr, :orden)
    ');

    foreach ($payload['probables_responsables'] as $responsable) {
        $insertResponsable->execute([
            'asunto_id' => $payload['id'],
            'nombre' => $responsable['nombre'],
            'es_qrr' => toPenalUpdatePgBool($responsable['es_qrr']),
            'orden' => $responsable['orden'],
        ]);
    }

    if ($archivoInicial !== null) {
        $storageDir = getStorageBasePath() . DIRECTORY_SEPARATOR . 'documentos' . DIRECTORY_SEPARATOR . 'penal' . DIRECTORY_SEPARATOR . $payload['id'];
        $relativeDir = 'storage/documentos/penal/' . $payload['id'];

        if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
            throw new RuntimeException('No se pudo preparar la carpeta de almacenamiento');
        }

        $storedName = buildPenalUpdateStoredPdfName($archivoInicial['nombre_original']);
        $finalAbsolutePath = $storageDir . DIRECTORY_SEPARATOR . $storedName;
        $finalRelativePath = $relativeDir . '/' . $storedName;

        if (!move_uploaded_file($archivoInicial['tmp_path'], $finalAbsolutePath)) {
            throw new RuntimeException('No se pudo guardar el documento inicial en disco');
        }

        $insertDocumento = $pdo->prepare('
            INSERT INTO penal_asunto_documentos (
                asunto_id,
                nombre_original,
                nombre_guardado,
                ruta_archivo,
                mime_type,
                tamano_bytes,
                observaciones,
                usuario_id
            )
            VALUES (
                :asunto_id,
                :nombre_original,
                :nombre_guardado,
                :ruta_archivo,
                :mime_type,
                :tamano_bytes,
                :observaciones,
                :usuario_id
            )
        ');

        $insertDocumento->execute([
            'asunto_id' => $payload['id'],
            'nombre_original' => $archivoInicial['nombre_original'],
            'nombre_guardado' => $storedName,
            'ruta_archivo' => $finalRelativePath,
            'mime_type' => $archivoInicial['mime_type'],
            'tamano_bytes' => $archivoInicial['tamano_bytes'],
            'observaciones' => $payload['documento_inicial_observaciones'] !== '' ? $payload['documento_inicial_observaciones'] : null,
            'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
        ]);
    }

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'EDITAR',
        'entidad' => 'Expediente penal',
        'entidad_id' => $payload['id'],
        'expediente_id' => $payload['id'],
        'delegacion_id' => $payload['delegacion_id'],
        'descripcion' => 'Edicion de asunto penal',
        'detalles' => [
            'numero_expediente' => $asunto['numero_carpeta'] ?? $payload['numero_carpeta'],
            'estatus' => strtoupper((string) ($asunto['estatus_general'] ?? '')) === 'CONCLUIDO' ? 'Concluido' : 'En tramite',
            'cambios' => buildPenalCaseAuditChanges($pdo, $current, is_array($asunto) ? $asunto : []),
            'escenario_denunciante' => $payload['escenario_denunciante'],
            'coadyuvancia' => $payload['coadyuvancia'],
            'denunciantes' => count($payload['denunciantes']),
            'probables_responsables' => count($payload['probables_responsables']),
            'documento_actualizado' => $archivoInicial !== null,
        ],
    ]);

    $pdo->commit();

    sendSuccess('Asunto penal actualizado correctamente', [
        'case' => $asunto,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if (isset($finalAbsolutePath) && is_string($finalAbsolutePath) && $finalAbsolutePath !== '' && is_file($finalAbsolutePath)) {
        @unlink($finalAbsolutePath);
    }

    logInternalError('No se pudo actualizar el asunto penal', 500, [
        'detail' => $exception->getMessage(),
    ]);

    sendJson([
        'ok' => false,
        'message' => 'No se pudo actualizar el asunto penal',
        'errors' => [
            'detail' => $exception->getMessage(),
        ],
    ], 500);
}
