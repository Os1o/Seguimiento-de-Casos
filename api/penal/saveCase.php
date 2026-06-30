<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

function parsePostedJsonArray(string $field): array
{
    $raw = $_POST[$field] ?? null;

    if (!is_string($raw) || trim($raw) === '') {
        sendError("El campo {$field} es obligatorio", 400);
    }

    $decoded = json_decode($raw, true);

    if (!is_array($decoded)) {
        sendError("El campo {$field} no tiene un formato valido", 400);
    }

    return $decoded;
}

function normalizePenalNewCasePayload(): array
{
    $payload = [
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
        'documento_inicial_observaciones' => trim((string) ($_POST['documento_inicial_observaciones'] ?? '')),
        'denunciantes' => parsePostedJsonArray('denunciantes'),
        'probables_responsables' => parsePostedJsonArray('probables_responsables'),
    ];

    $payload = normalizeInputToUppercase($payload, ['fecha_presentacion_denuncia', 'cuantia_monto']);

    return $payload;
}

function validatePenalCaseNumber(string $numeroCarpeta): void
{
    $numeroCarpeta = strtoupper(trim($numeroCarpeta));
    $partes = explode('/', $numeroCarpeta);

    if (count($partes) !== 5) {
        sendError('El numero de carpeta debe tener el formato JURISDICCION/ENTIDAD/OOAD/NUMERO/ANIO', 400);
    }

    [$jurisdiccion, $entidad, $ooad, $numero, $anio] = $partes;

    if ($jurisdiccion === '' || !preg_match('/^[A-Z]{3,4}$/', $entidad) || !preg_match('/^[A-Z]{3,4}$/', $ooad)) {
        sendError('La entidad y la OOAD de la carpeta deben tener entre 3 y 4 letras', 400);
    }

    if (!preg_match('/^\d{7}$/', $numero)) {
        sendError('El numero consecutivo de la carpeta debe tener exactamente 7 digitos', 400);
    }

    if (!preg_match('/^\d{4}$/', $anio)) {
        sendError('El anio de la carpeta debe tener 4 digitos', 400);
    }
}

function normalizeMonto(?string $monto, bool $sinCuantificar): ?string
{
    if ($sinCuantificar) {
        return null;
    }

    $monto = trim((string) $monto);
    if ($monto === '') {
        sendError('Debes capturar el monto o marcar sin cuantificar', 400);
    }

    $monto = str_replace(',', '', $monto);
    if (!is_numeric($monto)) {
        sendError('La cuantia debe ser un numero valido', 400);
    }

    return number_format((float) $monto, 2, '.', '');
}

function validateDenunciantes(array $denunciantes, string $escenario): array
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
        $esCoadyuvante = !empty($denunciante['es_coadyuvante']);
        $esPrincipal = strtoupper((string) ($denunciante['rol'] ?? '')) === 'PRINCIPAL';

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

function validateProbablesResponsables(array $responsables): array
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

function validateInitialPenalDocument(): array
{
    if (!isset($_FILES['archivo_inicial']) || !is_array($_FILES['archivo_inicial'])) {
        sendError('Debes adjuntar el documento inicial en PDF', 400);
    }

    $archivo = $_FILES['archivo_inicial'];
    $uploadError = (int) ($archivo['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($uploadError !== UPLOAD_ERR_OK) {
        sendError(getUploadErrorMessage($uploadError), 400, [
            'upload_error' => $uploadError,
        ]);
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
    if ($mimeType !== 'application/pdf') {
        sendError('El documento inicial no es un PDF valido', 400, [
            'mime_type' => $mimeType,
        ]);
    }

    if (!hasValidPdfSignature($tmpPath)) {
        sendError('El documento inicial no contiene una firma PDF valida', 400);
    }

    return [
        'nombre_original' => $nombreOriginal,
        'tmp_path' => $tmpPath,
        'tamano_bytes' => $tamano,
        'mime_type' => 'application/pdf',
    ];
}

function validateNewPenalCasePayload(PDO $pdo, array $user, array $payload): array
{
    if ($payload['delegacion_id'] === null || $payload['numero_carpeta'] === '' || $payload['anio_inicio'] === null || $payload['fecha_presentacion_denuncia'] === '' || $payload['delito_id'] === null || $payload['area_hechos_id'] === null) {
        sendError('Completa todos los campos obligatorios del asunto penal', 400);
    }

    if ($payload['hechos_denunciante'] === '') {
        sendError('Debes capturar los hechos con datos de la victima o denunciante', 400);
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

    validatePenalCaseNumber($payload['numero_carpeta']);
    $payload['cuantia_monto'] = normalizeMonto($payload['cuantia_monto'], $payload['sin_cuantificar']);
    $payload['denunciantes'] = validateDenunciantes($payload['denunciantes'], $payload['escenario_denunciante']);
    $payload['probables_responsables'] = validateProbablesResponsables($payload['probables_responsables']);

    if (!isAdminUser($user)) {
        $payload['delegacion_id'] = getUserDelegacionId($user);
    }

    ensureWriteDelegacionAccess($user, $payload['delegacion_id']);

    $stmt = $pdo->prepare('
        SELECT id
        FROM penal_asuntos
        WHERE numero_carpeta = :numero_carpeta
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $stmt->execute([
        'numero_carpeta' => $payload['numero_carpeta'],
    ]);

    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        sendError('Ya existe un asunto penal con ese numero de carpeta', 409);
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
        FROM areas
        WHERE id = :id
          AND delegacion_id = :delegacion_id
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

function buildStoredPdfNames(string $originalName): array
{
    $safeBase = preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($originalName, PATHINFO_FILENAME));
    $safeBase = trim((string) $safeBase, '._-');
    if ($safeBase === '') {
        $safeBase = 'documento_inicial';
    }

    $storedName = date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '_' . $safeBase . '.pdf';

    return [
        'base' => $safeBase,
        'stored' => $storedName,
    ];
}

function toPgBool(bool $value): string
{
    return $value ? 'true' : 'false';
}

try {
    $user = requirePenalWriteAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    if (isset($_POST['id']) && trim((string) $_POST['id']) !== '') {
        sendError('La edicion del asunto penal nuevo todavia no esta habilitada en este endpoint', 400);
    }

    $archivoInicial = validateInitialPenalDocument();
    $pdo = getDatabaseConnection();
    $payload = validateNewPenalCasePayload($pdo, $user, normalizePenalNewCasePayload());

    $storedNames = buildStoredPdfNames($archivoInicial['nombre_original']);
    $storageDir = getStorageBasePath() . DIRECTORY_SEPARATOR . 'documentos' . DIRECTORY_SEPARATOR . 'penal';
    $relativeDir = 'storage/documentos/penal';
    $finalRelativePath = null;
    $finalAbsolutePath = null;

    $pdo->beginTransaction();

    $insertAsunto = $pdo->prepare('
        INSERT INTO penal_asuntos (
            delegacion_id,
            numero_carpeta,
            anio_inicio,
            fecha_presentacion_denuncia,
            delito_id,
            hechos_denunciante,
            sin_cuantificar,
            cuantia_monto,
            area_hechos_id,
            dato_relevante,
            escenario_denunciante,
            coadyuvancia,
            estatus_general,
            abogado_responsable_id
        )
        VALUES (
            :delegacion_id,
            :numero_carpeta,
            :anio_inicio,
            :fecha_presentacion_denuncia,
            :delito_id,
            :hechos_denunciante,
            :sin_cuantificar,
            :cuantia_monto,
            :area_hechos_id,
            :dato_relevante,
            :escenario_denunciante,
            :coadyuvancia,
            :estatus_general,
            NULL
        )
        RETURNING *
    ');

    $insertAsunto->execute([
        'delegacion_id' => $payload['delegacion_id'],
        'numero_carpeta' => $payload['numero_carpeta'],
        'anio_inicio' => $payload['anio_inicio'],
        'fecha_presentacion_denuncia' => $payload['fecha_presentacion_denuncia'],
        'delito_id' => $payload['delito_id'],
        'hechos_denunciante' => $payload['hechos_denunciante'],
        'sin_cuantificar' => toPgBool($payload['sin_cuantificar']),
        'cuantia_monto' => $payload['cuantia_monto'],
        'area_hechos_id' => $payload['area_hechos_id'],
        'dato_relevante' => $payload['dato_relevante'] !== '' ? $payload['dato_relevante'] : null,
        'escenario_denunciante' => $payload['escenario_denunciante'],
        'coadyuvancia' => toPgBool($payload['coadyuvancia']),
        'estatus_general' => 'TRAMITE',
    ]);

    $asunto = $insertAsunto->fetch(PDO::FETCH_ASSOC);
    $asuntoId = isset($asunto['id']) ? (int) $asunto['id'] : 0;

    if ($asuntoId <= 0) {
        throw new RuntimeException('No se pudo obtener el identificador del asunto penal');
    }

    $insertDenunciante = $pdo->prepare('
        INSERT INTO penal_denunciantes (
            asunto_id,
            nombre,
            es_imss,
            es_principal,
            es_coadyuvante,
            orden
        )
        VALUES (
            :asunto_id,
            :nombre,
            :es_imss,
            :es_principal,
            :es_coadyuvante,
            :orden
        )
    ');

    foreach ($payload['denunciantes'] as $denunciante) {
        $insertDenunciante->execute([
            'asunto_id' => $asuntoId,
            'nombre' => $denunciante['nombre'],
            'es_imss' => toPgBool($denunciante['es_imss']),
            'es_principal' => toPgBool($denunciante['es_principal']),
            'es_coadyuvante' => toPgBool($denunciante['es_coadyuvante']),
            'orden' => $denunciante['orden'],
        ]);
    }

    $insertResponsable = $pdo->prepare('
        INSERT INTO penal_probables_responsables (
            asunto_id,
            nombre,
            es_qrr,
            orden
        )
        VALUES (
            :asunto_id,
            :nombre,
            :es_qrr,
            :orden
        )
    ');

    foreach ($payload['probables_responsables'] as $responsable) {
        $insertResponsable->execute([
            'asunto_id' => $asuntoId,
            'nombre' => $responsable['nombre'],
            'es_qrr' => toPgBool($responsable['es_qrr']),
            'orden' => $responsable['orden'],
        ]);
    }

    $storageDir .= DIRECTORY_SEPARATOR . $asuntoId;
    $relativeDir .= '/' . $asuntoId;

    if (!is_dir($storageDir) && !mkdir($storageDir, 0775, true) && !is_dir($storageDir)) {
        throw new RuntimeException('No se pudo preparar la carpeta de almacenamiento');
    }

    $finalAbsolutePath = $storageDir . DIRECTORY_SEPARATOR . $storedNames['stored'];
    $finalRelativePath = $relativeDir . '/' . $storedNames['stored'];

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
        'asunto_id' => $asuntoId,
        'nombre_original' => $archivoInicial['nombre_original'],
        'nombre_guardado' => $storedNames['stored'],
        'ruta_archivo' => $finalRelativePath,
        'mime_type' => $archivoInicial['mime_type'],
        'tamano_bytes' => $archivoInicial['tamano_bytes'],
        'observaciones' => $payload['documento_inicial_observaciones'] !== '' ? $payload['documento_inicial_observaciones'] : null,
        'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
    ]);

    auditLog($pdo, $user, [
        'modulo' => 'PENAL',
        'accion' => 'ALTA',
        'entidad' => 'PENAL_ASUNTO',
        'entidad_id' => $asuntoId,
        'expediente_id' => $asuntoId,
        'delegacion_id' => $payload['delegacion_id'],
        'descripcion' => 'Alta de asunto penal',
        'detalles' => [
            'numero_carpeta' => $payload['numero_carpeta'],
            'escenario_denunciante' => $payload['escenario_denunciante'],
            'coadyuvancia' => $payload['coadyuvancia'],
            'denunciantes' => count($payload['denunciantes']),
            'probables_responsables' => count($payload['probables_responsables']),
            'sin_cuantificar' => $payload['sin_cuantificar'],
            'cuantia_monto' => $payload['cuantia_monto'],
            'area_hechos_id' => $payload['area_hechos_id'],
            'delito_id' => $payload['delito_id'],
        ],
    ]);

    $pdo->commit();

    sendSuccess('Asunto penal guardado correctamente', [
        'case' => $asunto,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if (isset($finalAbsolutePath) && is_string($finalAbsolutePath) && $finalAbsolutePath !== '' && is_file($finalAbsolutePath)) {
        @unlink($finalAbsolutePath);
    }

    logInternalError('No se pudo guardar el asunto penal', 500, [
        'detail' => $exception->getMessage(),
    ]);

    sendJson([
        'ok' => false,
        'message' => 'No se pudo guardar el asunto penal',
        'errors' => [
            'detail' => $exception->getMessage(),
        ],
    ], 500);
}
