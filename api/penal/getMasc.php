<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $asuntoId = isset($_GET['asunto_id']) ? (int) $_GET['asunto_id'] : 0;

    if ($asuntoId <= 0) {
        sendError('El asunto_id es obligatorio', 400);
    }

    $pdo = getDatabaseConnection();

    $caseStmt = $pdo->prepare('
        SELECT id, delegacion_id
        FROM penal_asuntos
        WHERE id = :id
          AND activo = TRUE
          AND deleted_at IS NULL
        LIMIT 1
    ');
    $caseStmt->execute(['id' => $asuntoId]);
    $case = $caseStmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    $stmt = $pdo->prepare('
        SELECT
            pm.id,
            pm.asunto_id,
            pm.fecha_convenio,
            pm.descripcion,
            pm.cierra_carpeta,
            pm.created_at,
            pm.updated_at,
            uc.nombre_completo AS created_by_nombre,
            uu.nombre_completo AS updated_by_nombre
        FROM penal_masc pm
        LEFT JOIN usuarios uc
            ON uc.id = pm.created_by
        LEFT JOIN usuarios uu
            ON uu.id = pm.updated_by
        WHERE pm.asunto_id = :asunto_id
        LIMIT 1
    ');
    $stmt->execute(['asunto_id' => $asuntoId]);

    sendSuccess('MASC cargado correctamente', [
        'masc' => $stmt->fetch(PDO::FETCH_ASSOC) ?: null,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el MASC', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
