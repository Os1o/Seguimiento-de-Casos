<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

const REQ_PHASE_TWO_MAX_FILE_BYTES = 10 * 1024 * 1024;

function canModifyClosedReqData(array $user): bool
{
    $role = strtolower((string)($user['rol'] ?? ''));

    return $role === 'admin';
}

function getReqPhaseTwoAreaNames(PDO $pdo, array $ids): array
{
    $ids = array_values(array_unique(array_filter(array_map('intval', $ids), static fn (int $id): bool => $id > 0)));

    if ($ids === []) {
        return [];
    }

    $placeholders = implode(', ', array_fill(0, count($ids), '?'));
    $stmt = $pdo->prepare("SELECT id, nombre FROM areas WHERE id IN ({$placeholders})");
    $stmt->execute($ids);

    $map = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $map[(int) $row['id']] = (string) $row['nombre'];
    }

    return $map;
}

function resolveReqPhaseTwoAreaName(?int $id, array $map): ?string
{
    if ($id === null || $id <= 0) {
        return null;
    }

    return $map[$id] ?? (string) $id;
}

function readPhaseTwoPayload(): array
{
    $requerimientoId = filter_input(INPUT_POST, 'requerimiento_id', FILTER_VALIDATE_INT);
    $fechaInicioInterno = trim((string) ($_POST['fecha_inicio_interno'] ?? ''));
    $areaResponsableId = filter_input(INPUT_POST, 'area_responsable_id', FILTER_VALIDATE_INT);
    $solicitudesRaw = (string) ($_POST['solicitudes'] ?? '[]');
    $solicitudesDecoded = json_decode($solicitudesRaw, true);

    if (!$requerimientoId || $requerimientoId < 1) {
        sendError('Requerimiento invalido', 400);
    }

    if ($fechaInicioInterno === '' || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaInicioInterno)) {
        sendError('La fecha de inicio del requerimiento interno es obligatoria', 400);
    }

    if (!$areaResponsableId || $areaResponsableId < 1) {
        sendError('El area responsable es obligatoria', 400);
    }

    if (!is_array($solicitudesDecoded)) {
        sendError('Las solicitudes del requerimiento no tienen un formato valido', 400);
    }

    $solicitudes = [];

    foreach ($solicitudesDecoded as $item) {
        if (!is_array($item)) {
            continue;
        }

        $id = isset($item['id']) ? (int) $item['id'] : 0;
        $estadoRecepcion = strtolower(trim((string) ($item['estado_recepcion'] ?? 'pendiente')));
        $fechaDesahogo = trim((string) ($item['fecha_desahogo'] ?? ''));
        $observacionesDocumento = trim((string) ($item['observaciones_documento'] ?? ''));

        if ($id < 1) {
            sendError('Una solicitud no tiene identificador valido', 400);
        }

        if (!in_array($estadoRecepcion, ['pendiente', 'recibido'], true)) {
            sendError('El estado de recepcion de una solicitud no es valido', 400);
        }

        if ($fechaDesahogo !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $fechaDesahogo)) {
            sendError('La fecha de desahogo no tiene un formato valido', 400);
        }

        if ($estadoRecepcion !== 'recibido') {
            $observacionesDocumento = '';
        }

        $solicitudes[] = [
            'id' => $id,
            'estado_recepcion' => $estadoRecepcion,
            'fecha_desahogo' => $fechaDesahogo,
            'observaciones_documento' => $observacionesDocumento,
        ];
    }

    return [
        'requerimiento_id' => $requerimientoId,
        'fecha_inicio_interno' => $fechaInicioInterno,
        'area_responsable_id' => $areaResponsableId,
        'solicitudes' => $solicitudes,
    ];
}

function validateOptionalPhaseTwoPdf(string $fieldName, string $label): ?array
{
    if (!isset($_FILES[$fieldName]) || !is_array($_FILES[$fieldName])) {
        return null;
    }

    $file = $_FILES[$fieldName];
    $error = (int) ($file['error'] ?? UPLOAD_ERR_NO_FILE);

    if ($error === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    if ($error !== UPLOAD_ERR_OK) {
        sendError($label . ': ' . getUploadErrorMessage($error), 400);
    }

    $tmpName = (string) ($file['tmp_name'] ?? '');
    $size = (int) ($file['size'] ?? 0);
    $originalName = (string) ($file['name'] ?? '');
    $mimeType = detectUploadedFileMimeType($tmpName);

    if ($size <= 0 || $size > REQ_PHASE_TWO_MAX_FILE_BYTES) {
        sendError($label . ': el archivo excede el tamano maximo permitido de 10 MB', 400);
    }

    if ($mimeType !== 'application/pdf' || !hasValidPdfSignature($tmpName)) {
        sendError($label . ': el documento debe ser un PDF valido', 400);
    }

    return [
        'tmp_name' => $tmpName,
        'original_name' => $originalName !== '' ? $originalName : 'documento.pdf',
        'mime_type' => $mimeType,
        'size' => $size,
    ];
}

function buildPhaseTwoPdfName(string $originalName, string $prefix): string
{
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    $extension = $extension === 'pdf' ? 'pdf' : 'pdf';

    return sprintf(
        '%s_%s_%s.%s',
        $prefix,
        date('Ymd_His'),
        bin2hex(random_bytes(4)),
        $extension
    );
}

function storePhaseTwoPdf(array $file, string $directory, string $prefix, array &$storedFiles): array
{
    if (!is_dir($directory) && !mkdir($directory, 0775, true) && !is_dir($directory)) {
        sendError('No se pudo preparar la carpeta de documentos', 500);
    }

    $storedName = buildPhaseTwoPdfName($file['original_name'], $prefix);
    $absolutePath = $directory . DIRECTORY_SEPARATOR . $storedName;

    if (!move_uploaded_file($file['tmp_name'], $absolutePath)) {
        sendError('No se pudo guardar el documento en el servidor', 500);
    }

    $storedFiles[] = $absolutePath;

    return [
        'stored_name' => $storedName,
        'absolute_path' => $absolutePath,
    ];
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $user = requirePenalWriteAccess();
    $pdo = getDatabaseConnection();
    $payload = readPhaseTwoPayload();
    $canModifyClosedData = canModifyClosedReqData($user);
    $storedFiles = [];

    $reqStmt = $pdo->prepare('
        SELECT
            pr.id,
            pr.asunto_id,
            pr.folio_referencia,
            pr.fecha_inicio_interno,
            pr.area_responsable_id,
            doc_interno.id AS documento_interno_id,
            pa.delegacion_id,
            pa.numero_carpeta,
            COALESCE(pca.fecha_conocimiento_amp, pa.fecha_conocimiento_amp) AS fecha_conocimiento_amp
        FROM penal_requerimientos pr
        LEFT JOIN LATERAL (
            SELECT d.id
            FROM penal_requerimiento_documentos d
            WHERE d.requerimiento_id = pr.id
              AND d.tipo_documento = \'INTERNO_IMSS\'
              AND d.activo = TRUE
            ORDER BY d.created_at DESC, d.id DESC
            LIMIT 1
        ) doc_interno ON TRUE
        INNER JOIN penal_asuntos pa
            ON pa.id = pr.asunto_id
           AND pa.deleted_at IS NULL
        LEFT JOIN penal_conocimiento_amp pca
            ON pca.asunto_id = pa.id
        WHERE pr.id = :id
          AND pr.activo = TRUE
        LIMIT 1
    ');
    $reqStmt->execute(['id' => $payload['requerimiento_id']]);
    $requerimiento = $reqStmt->fetch(PDO::FETCH_ASSOC);

    if (!$requerimiento) {
        sendError('Requerimiento no encontrado', 404);
    }

    ensureWriteDelegacionAccess(
        $user,
        $requerimiento['delegacion_id'] !== null ? (int) $requerimiento['delegacion_id'] : null
    );

    if (empty($requerimiento['fecha_conocimiento_amp'])) {
        sendError('Es necesario registrar la fecha de conocimiento del AMP antes de gestionar Requerimientos', 400);
    }

    $areaStmt = $pdo->prepare('SELECT id FROM areas WHERE id = :id LIMIT 1');
    $fechaInicioInterno = $payload['fecha_inicio_interno'];
    $areaResponsableId = $payload['area_responsable_id'];

    if (!$canModifyClosedData) {
        if (!empty($requerimiento['fecha_inicio_interno'])) {
            $fechaInicioInterno = (string) $requerimiento['fecha_inicio_interno'];
        }

        if (!empty($requerimiento['area_responsable_id'])) {
            $areaResponsableId = (int) $requerimiento['area_responsable_id'];
        }
    }

    $areaStmt->execute(['id' => $areaResponsableId]);

    if (!$areaStmt->fetchColumn()) {
        sendError('El area responsable seleccionada no existe', 400);
    }

    $estatusStmt = $pdo->prepare('
        SELECT id, nombre
        FROM penal_catalogo_estatus_solicitud
        WHERE activo = TRUE
          AND nombre IN (:enTramite, :desahogada)
    ');
    $estatusStmt->execute([
        'enTramite' => 'En trámite',
        'desahogada' => 'Desahogada',
    ]);

    $estatusIds = [];
    foreach ($estatusStmt->fetchAll(PDO::FETCH_ASSOC) as $estatus) {
        $estatusIds[$estatus['nombre']] = (int) $estatus['id'];
    }

    if (empty($estatusIds['Desahogada'])) {
        sendError('No se encontro el estatus de solicitud Desahogada', 500);
    }

    $solicitudIdsStmt = $pdo->prepare('
        SELECT
            s.id,
            s.titulo,
            mov.fecha_desahogo,
            doc.id AS documento_id,
            doc.nombre_original AS documento_nombre_original,
            doc.nombre_guardado AS documento_nombre_guardado,
            doc.ruta_archivo AS documento_ruta_archivo,
            doc.mime_type AS documento_mime_type,
            doc.tamano_bytes AS documento_tamano_bytes
        FROM penal_requerimiento_solicitudes s
        LEFT JOIN LATERAL (
            SELECT m.id, m.fecha_desahogo
            FROM penal_requerimiento_solicitud_movimientos m
            WHERE m.solicitud_id = s.id
              AND m.activo = TRUE
            ORDER BY m.created_at DESC, m.id DESC
            LIMIT 1
        ) mov ON TRUE
        LEFT JOIN LATERAL (
            SELECT d.id, d.nombre_original, d.nombre_guardado, d.ruta_archivo, d.mime_type, d.tamano_bytes
            FROM penal_requerimiento_solicitud_documentos d
            INNER JOIN penal_requerimiento_solicitud_movimientos mdoc
                ON mdoc.id = d.movimiento_id
               AND mdoc.solicitud_id = s.id
               AND mdoc.activo = TRUE
            WHERE d.activo = TRUE
            ORDER BY d.created_at DESC, d.id DESC
            LIMIT 1
        ) doc ON TRUE
        WHERE s.requerimiento_id = :requerimientoId
          AND s.activo = TRUE
    ');
    $solicitudIdsStmt->execute(['requerimientoId' => $payload['requerimiento_id']]);
    $currentSolicitudStates = [];
    foreach ($solicitudIdsStmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $currentSolicitudStates[(int) $row['id']] = $row;
    }
    $validSolicitudIds = array_keys($currentSolicitudStates);

    $submittedIds = array_map(static fn (array $item): int => (int) $item['id'], $payload['solicitudes']);
    foreach ($submittedIds as $submittedId) {
        if (!in_array($submittedId, $validSolicitudIds, true)) {
            sendError('Una solicitud no pertenece al requerimiento seleccionado', 400);
        }
    }

    $documentoInterno = validateOptionalPhaseTwoPdf('documento_interno', 'Documento del requerimiento interno');
    if (!$canModifyClosedData && !empty($requerimiento['documento_interno_id'])) {
        $documentoInterno = null;
    }
    $solicitudFiles = [];
    $existingSolicitudDocs = [];

    foreach ($payload['solicitudes'] as $solicitud) {
        $currentState = $currentSolicitudStates[$solicitud['id']] ?? null;
        $wasAlreadyDesahogada = $currentState
            && trim((string) ($currentState['fecha_desahogo'] ?? '')) !== '';
        $isLocked = $wasAlreadyDesahogada;

        if ($isLocked && !$canModifyClosedData) {
            continue;
        }

        $fieldName = 'solicitud_documento_' . $solicitud['id'];
        $file = validateOptionalPhaseTwoPdf($fieldName, 'Documento de solicitud');

        $hasExistingDoc = !empty($currentState['documento_id']);
        $hasUploadedDoc = $file !== null;
        $hasFecha = $solicitud['fecha_desahogo'] !== '';
        $isReceived = $solicitud['estado_recepcion'] === 'recibido';

        if (!$isReceived && !$hasFecha && !$hasUploadedDoc) {
            continue;
        }

        if (!$isReceived || !$hasFecha || (!$hasExistingDoc && !$hasUploadedDoc)) {
            sendError('Para desahogar una solicitud debes marcar documentacion recibida, capturar fecha de desahogo y adjuntar PDF', 400);
        }

        if ($file !== null) {
            $solicitudFiles[$solicitud['id']] = $file;
        } elseif ($hasExistingDoc) {
            $existingSolicitudDocs[$solicitud['id']] = [
                'id' => (int) $currentState['documento_id'],
                'nombre_original' => $currentState['documento_nombre_original'],
                'nombre_guardado' => $currentState['documento_nombre_guardado'],
                'ruta_archivo' => $currentState['documento_ruta_archivo'],
                'mime_type' => $currentState['documento_mime_type'],
                'tamano_bytes' => $currentState['documento_tamano_bytes'],
            ];
        }
    }

    $pdo->beginTransaction();

    $updateReqStmt = $pdo->prepare('
        UPDATE penal_requerimientos
        SET
            fecha_inicio_interno = :fechaInicioInterno,
            area_responsable_id = :areaResponsableId,
            fase_actual = :faseActual,
            updated_at = now()
        WHERE id = :id
    ');
    $updateReqStmt->execute([
        'fechaInicioInterno' => $fechaInicioInterno,
        'areaResponsableId' => $areaResponsableId,
        'faseActual' => 'SEGUIMIENTO_INTERNO',
        'id' => $payload['requerimiento_id'],
    ]);

    $areaAuditNames = getReqPhaseTwoAreaNames($pdo, [
        isset($requerimiento['area_responsable_id']) ? (int) $requerimiento['area_responsable_id'] : null,
        $areaResponsableId,
    ]);

    $internalChanges = buildAuditFieldChanges(
        [
            'fecha_inicio_interno' => $requerimiento['fecha_inicio_interno'] ?? null,
            'area_responsable_id' => resolveReqPhaseTwoAreaName(
                isset($requerimiento['area_responsable_id']) ? (int) $requerimiento['area_responsable_id'] : null,
                $areaAuditNames
            ),
        ],
        [
            'fecha_inicio_interno' => $fechaInicioInterno,
            'area_responsable_id' => resolveReqPhaseTwoAreaName($areaResponsableId, $areaAuditNames),
        ],
        [
            'fecha_inicio_interno' => 'Fecha inicio',
            'area_responsable_id' => 'Area responsable',
        ]
    );

    if ($documentoInterno !== null) {
        $directory = getStorageBasePath()
            . DIRECTORY_SEPARATOR . 'documentos'
            . DIRECTORY_SEPARATOR . 'penal'
            . DIRECTORY_SEPARATOR . 'requerimientos'
            . DIRECTORY_SEPARATOR . (string) $payload['requerimiento_id']
            . DIRECTORY_SEPARATOR . 'interno';
        $stored = storePhaseTwoPdf($documentoInterno, $directory, 'requerimiento_interno', $storedFiles);
        $relativePath = 'documentos/penal/requerimientos/' . $payload['requerimiento_id'] . '/interno/' . $stored['stored_name'];

        $docReqStmt = $pdo->prepare('
            INSERT INTO penal_requerimiento_documentos (
                requerimiento_id,
                tipo_documento,
                nombre_original,
                nombre_guardado,
                ruta_archivo,
                mime_type,
                tamano_bytes,
                usuario_id
            ) VALUES (
                :requerimientoId,
                :tipoDocumento,
                :nombreOriginal,
                :nombreGuardado,
                :rutaArchivo,
                :mimeType,
                :tamanoBytes,
                :usuarioId
            )
        ');
        $docReqStmt->execute([
            'requerimientoId' => $payload['requerimiento_id'],
            'tipoDocumento' => 'INTERNO_IMSS',
            'nombreOriginal' => $documentoInterno['original_name'],
            'nombreGuardado' => $stored['stored_name'],
            'rutaArchivo' => $relativePath,
            'mimeType' => $documentoInterno['mime_type'],
            'tamanoBytes' => $documentoInterno['size'],
            'usuarioId' => (int) ($user['id'] ?? 0),
        ]);
    }

    if ($internalChanges !== [] || $documentoInterno !== null) {
        auditLog($pdo, $user, [
            'modulo' => 'PENAL',
            'accion' => 'EDITAR',
            'entidad' => 'Requerimiento ministerial',
            'entidad_id' => $payload['requerimiento_id'],
            'expediente_id' => (int) $requerimiento['asunto_id'],
            'delegacion_id' => $requerimiento['delegacion_id'] ?? null,
            'descripcion' => 'Registro de requerimiento interno | Folio: ' . (($requerimiento['folio_referencia'] ?? '') !== '' ? $requerimiento['folio_referencia'] : 'Sin folio'),
            'detalles' => [
                'folio_requerimiento' => $requerimiento['folio_referencia'] ?? null,
                'fecha_inicio' => $fechaInicioInterno,
                'area_responsable' => resolveReqPhaseTwoAreaName($areaResponsableId, $areaAuditNames),
            ],
        ]);
    }

    $movimientoStmt = $pdo->prepare('
        INSERT INTO penal_requerimiento_solicitud_movimientos (
            solicitud_id,
            estatus_solicitud_id,
            fecha_desahogo,
            observaciones_documento,
            usuario_id
        ) VALUES (
            :solicitudId,
            :estatusSolicitudId,
            :fechaDesahogo,
            :observacionesDocumento,
            :usuarioId
        )
        RETURNING id
    ');

    $docSolicitudStmt = $pdo->prepare('
        INSERT INTO penal_requerimiento_solicitud_documentos (
            movimiento_id,
            nombre_original,
            nombre_guardado,
            ruta_archivo,
            mime_type,
            tamano_bytes,
            usuario_id
        ) VALUES (
            :movimientoId,
            :nombreOriginal,
            :nombreGuardado,
            :rutaArchivo,
            :mimeType,
            :tamanoBytes,
            :usuarioId
        )
    ');

    $desahogadas = 0;
    $pendientes = 0;

    foreach ($payload['solicitudes'] as $solicitud) {
        $currentState = $currentSolicitudStates[$solicitud['id']] ?? null;
        $wasAlreadyDesahogada = $currentState
            && trim((string) ($currentState['fecha_desahogo'] ?? '')) !== '';
        $isLocked = $wasAlreadyDesahogada;

        if ($isLocked && !$canModifyClosedData) {
            $desahogadas++;
            continue;
        }

        if ($solicitud['estado_recepcion'] !== 'recibido') {
            $pendientes++;
            continue;
        }

        $movimientoStmt->execute([
            'solicitudId' => $solicitud['id'],
            'estatusSolicitudId' => $estatusIds['Desahogada'],
            'fechaDesahogo' => $solicitud['fecha_desahogo'],
            'observacionesDocumento' => $solicitud['observaciones_documento'],
            'usuarioId' => (int) ($user['id'] ?? 0),
        ]);
        $movimientoId = (int) $movimientoStmt->fetchColumn();
        $tituloSolicitud = trim((string) ($currentState['titulo'] ?? ('Solicitud ' . $solicitud['id'])));

        if (!$wasAlreadyDesahogada) {
            auditLog($pdo, $user, [
                'modulo' => 'PENAL',
                'accion' => 'EDITAR',
                'entidad' => 'Requerimiento ministerial',
                'entidad_id' => $payload['requerimiento_id'],
                'expediente_id' => (int) $requerimiento['asunto_id'],
                'delegacion_id' => $requerimiento['delegacion_id'] ?? null,
                'descripcion' => 'Solicitud ' . $tituloSolicitud . ' desahogada | Folio: ' . (($requerimiento['folio_referencia'] ?? '') !== '' ? $requerimiento['folio_referencia'] : 'Sin folio'),
                'detalles' => [
                    'folio_requerimiento' => $requerimiento['folio_referencia'] ?? null,
                    'titulo_solicitud' => $tituloSolicitud,
                    'fecha_desahogo' => $solicitud['fecha_desahogo'],
                ],
            ]);
        }

        if (isset($solicitudFiles[$solicitud['id']])) {
            $file = $solicitudFiles[$solicitud['id']];
            $directory = getStorageBasePath()
                . DIRECTORY_SEPARATOR . 'documentos'
                . DIRECTORY_SEPARATOR . 'penal'
                . DIRECTORY_SEPARATOR . 'requerimientos'
                . DIRECTORY_SEPARATOR . (string) $payload['requerimiento_id']
                . DIRECTORY_SEPARATOR . 'solicitudes'
                . DIRECTORY_SEPARATOR . (string) $solicitud['id'];
            $stored = storePhaseTwoPdf($file, $directory, 'solicitud_' . $solicitud['id'], $storedFiles);
            $relativePath = 'documentos/penal/requerimientos/' . $payload['requerimiento_id']
                . '/solicitudes/' . $solicitud['id'] . '/' . $stored['stored_name'];

            $docSolicitudStmt->execute([
                'movimientoId' => $movimientoId,
                'nombreOriginal' => $file['original_name'],
                'nombreGuardado' => $stored['stored_name'],
                'rutaArchivo' => $relativePath,
                'mimeType' => $file['mime_type'],
                'tamanoBytes' => $file['size'],
                'usuarioId' => (int) ($user['id'] ?? 0),
            ]);
        } elseif (isset($existingSolicitudDocs[$solicitud['id']])) {
            $existingDoc = $existingSolicitudDocs[$solicitud['id']];
            $docSolicitudStmt->execute([
                'movimientoId' => $movimientoId,
                'nombreOriginal' => (string) $existingDoc['nombre_original'],
                'nombreGuardado' => (string) $existingDoc['nombre_guardado'],
                'rutaArchivo' => (string) $existingDoc['ruta_archivo'],
                'mimeType' => (string) $existingDoc['mime_type'],
                'tamanoBytes' => (int) $existingDoc['tamano_bytes'],
                'usuarioId' => (int) ($user['id'] ?? 0),
            ]);
        }

        $desahogadas++;
    }

    $pdo->commit();

    sendSuccess('Seguimiento interno guardado correctamente', [
        'requerimiento_id' => $payload['requerimiento_id'],
        'fase_actual' => 'SEGUIMIENTO_INTERNO',
        'solicitudes_desahogadas' => $desahogadas,
        'solicitudes_pendientes' => $pendientes,
    ]);
} catch (Throwable $exception) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    if (isset($storedFiles) && is_array($storedFiles)) {
        foreach ($storedFiles as $filePath) {
            if (is_string($filePath) && is_file($filePath)) {
                @unlink($filePath);
            }
        }
    }

    $statusCode = (int) ($exception->getCode() ?: 500);
    if ($statusCode < 400 || $statusCode > 599) {
        $statusCode = 500;
    }

    sendError('No se pudo guardar el seguimiento interno del requerimiento', $statusCode, [
        'detail' => $exception->getMessage(),
    ]);
}
