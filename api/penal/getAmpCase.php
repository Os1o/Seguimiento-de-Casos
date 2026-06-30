<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    $user = requirePenalAccess();
    $pdo = getDatabaseConnection();

    $id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

    if ($id <= 0) {
        sendError('El id del asunto es obligatorio', 400);
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
        LEFT JOIN delitos d
            ON d.id = pa.delito_id
        WHERE pa.id = :id
          AND pa.activo = TRUE
        LIMIT 1
    ');

    $stmt->execute([
        'id' => $id,
    ]);

    $case = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$case) {
        sendError('Asunto penal no encontrado', 404);
    }

    ensureReadDelegacionAccess($user, isset($case['delegacion_id']) ? (int) $case['delegacion_id'] : null);

    sendSuccess('Asunto penal cargado correctamente', [
        'case' => $case,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo cargar el asunto penal para AMP', 500, [
        'detail' => $exception->getMessage(),
    ]);
}