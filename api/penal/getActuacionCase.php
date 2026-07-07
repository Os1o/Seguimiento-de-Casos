<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requirePenalAccess();
    $pdo = getDatabaseConnection();

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        sendError('El id es obligatorio', 400);
    }

    $stmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.delegacion_id,
            pa.numero_carpeta,
            pa.fecha_presentacion_denuncia,
            pa.fecha_conocimiento_amp,
            pa.estatus_general,
            pa.delito_id,
            d.nombre AS delito_nombre
        FROM penal_asuntos pa
        LEFT JOIN delitos d ON d.id = pa.delito_id
        WHERE pa.id = :id
          AND pa.deleted_at IS NULL
        LIMIT 1
    ');

    $stmt->execute(['id' => $id]);
    $case = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    if (empty($case['fecha_conocimiento_amp'])) {
        sendError('Primero debe registrarse la fecha de conocimiento del AMP para habilitar las actuaciones penales', 400);
    }

    $etapasStmt = $pdo->query('
        SELECT id, nombre, orden, concluye_asunto
        FROM penal_catalogo_etapas
        WHERE activo = TRUE
        ORDER BY orden ASC, nombre ASC
    ');
    $etapas = $etapasStmt->fetchAll(PDO::FETCH_ASSOC);

    $historialStmt = $pdo->prepare('
        SELECT
            pa.id,
            pa.asunto_id,
            pa.fecha_actuacion,
            pa.descripcion,
            pa.texto_complementario_estatus,
            pa.referencia_carpeta,
            pa.created_at,
            pce.nombre AS etapa_nombre,
            pce.concluye_asunto,
            pcf.nombre AS fase_nombre,
            u.nombre_completo AS usuario_nombre
        FROM penal_actuaciones pa
        INNER JOIN penal_catalogo_etapas pce
            ON pce.id = pa.etapa_id
        LEFT JOIN penal_catalogo_fases pcf
            ON pcf.id = pa.fase_id
        LEFT JOIN usuarios u
            ON u.id = pa.usuario_id
        WHERE pa.asunto_id = :asunto_id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
        ORDER BY pa.fecha_actuacion DESC, pa.id DESC
    ');
    $historialStmt->execute([
        'asunto_id' => $id,
    ]);
    $history = $historialStmt->fetchAll(PDO::FETCH_ASSOC);

    $documentosStmt = $pdo->prepare('
        SELECT
            pad.id,
            pad.actuacion_id,
            pad.nombre_original,
            pad.nombre_guardado,
            pad.ruta_archivo,
            pad.mime_type,
            pad.tamano_bytes,
            pad.created_at
        FROM penal_actuacion_documentos pad
        INNER JOIN penal_actuaciones pa
            ON pa.id = pad.actuacion_id
        WHERE pa.asunto_id = :asunto_id
          AND pa.activo = TRUE
          AND pa.deleted_at IS NULL
          AND pad.activo = TRUE
        ORDER BY pad.created_at ASC, pad.id ASC
    ');
    $documentosStmt->execute([
        'asunto_id' => $id,
    ]);
    $documentos = $documentosStmt->fetchAll(PDO::FETCH_ASSOC);

    $documentosPorActuacion = [];
    foreach ($documentos as $documento) {
        $actuacionId = (int) ($documento['actuacion_id'] ?? 0);
        if (!isset($documentosPorActuacion[$actuacionId])) {
            $documentosPorActuacion[$actuacionId] = [];
        }
        $documentosPorActuacion[$actuacionId][] = $documento;
    }

    foreach ($history as &$item) {
        $item['documentos'] = $documentosPorActuacion[(int) ($item['id'] ?? 0)] ?? [];
    }
    unset($item);

    sendSuccess('Datos de actuación penal cargados correctamente', [
        'case' => $case,
        'etapas' => $etapas,
        'history' => $history,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los datos de actuación penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
