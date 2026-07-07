<?php

declare(strict_types=1);

require_once __DIR__ . '/../bootstrap.php';

try {
    requirePenalAccess();

    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        sendError('Metodo no permitido', 405);
    }

    $etapaId = isset($_GET['etapa_id']) ? (int) $_GET['etapa_id'] : 0;

    if ($etapaId <= 0) {
        sendError('La etapa es obligatoria', 400);
    }

    $pdo = getDatabaseConnection();

    $etapaStmt = $pdo->prepare('
        SELECT id
        FROM penal_catalogo_etapas
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $etapaStmt->execute(['id' => $etapaId]);

    if (!$etapaStmt->fetch(PDO::FETCH_ASSOC)) {
        sendError('La etapa seleccionada no existe', 404);
    }

    $stmt = $pdo->prepare('
        SELECT id, etapa_id, nombre, orden
        FROM penal_catalogo_fases
        WHERE etapa_id = :etapa_id
          AND activo = TRUE
        ORDER BY orden ASC, nombre ASC
    ');
    $stmt->execute(['etapa_id' => $etapaId]);

    sendSuccess('Fases cargadas correctamente', [
        'fases' => $stmt->fetchAll(PDO::FETCH_ASSOC),
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar las fases de la etapa', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
