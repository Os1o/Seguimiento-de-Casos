<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

function readPenalDelitoPayload(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $rawBody = file_get_contents('php://input') ?: '';
    $jsonPayload = str_contains(strtolower($contentType), 'application/json') && $rawBody !== ''
        ? json_decode($rawBody, true)
        : null;

    $source = is_array($jsonPayload) ? $jsonPayload : $_POST;

    return [
        'categoria_id' => isset($source['categoria_id']) ? (int) $source['categoria_id'] : null,
        'nombre' => mb_strtoupper(trim((string) ($source['nombre'] ?? '')), 'UTF-8'),
    ];
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $user = requirePenalWriteAccess();
    $role = strtolower((string) ($user['rol'] ?? ''));

    if (!isAdminUser($user) && $role !== 'editor') {
        sendError('No tienes permisos para agregar delitos penales', 403);
    }

    $payload = readPenalDelitoPayload();

    if ($payload['categoria_id'] === null || $payload['categoria_id'] <= 0) {
        sendError('Selecciona una categoria valida', 400);
    }

    if ($payload['nombre'] === '') {
        sendError('Captura el nombre del delito', 400);
    }

    if (mb_strlen($payload['nombre'], 'UTF-8') > 255) {
        sendError('El nombre del delito no puede exceder 255 caracteres', 400);
    }

    $pdo = getDatabaseConnection();

    $categoriaStmt = $pdo->prepare('
        SELECT id
        FROM categorias_delito
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $categoriaStmt->execute(['id' => $payload['categoria_id']]);

    if (!$categoriaStmt->fetchColumn()) {
        sendError('La categoria seleccionada no existe o esta inactiva', 400);
    }

    $duplicateStmt = $pdo->prepare('
        SELECT id
        FROM delitos
        WHERE categoria_id = :categoria_id
          AND LOWER(nombre) = LOWER(:nombre)
        LIMIT 1
    ');
    $duplicateStmt->execute([
        'categoria_id' => $payload['categoria_id'],
        'nombre' => $payload['nombre'],
    ]);

    if ($duplicateStmt->fetchColumn()) {
        sendError('Ya existe un delito con ese nombre dentro de la categoria seleccionada', 409);
    }

    $insertStmt = $pdo->prepare('
        INSERT INTO delitos (nombre, fuero, categoria_id)
        VALUES (:nombre, :fuero, :categoria_id)
        RETURNING id, nombre, fuero, categoria_id
    ');
    $insertStmt->execute([
        'nombre' => $payload['nombre'],
        'fuero' => 'LOCAL',
        'categoria_id' => $payload['categoria_id'],
    ]);

    sendSuccess('Delito agregado correctamente', [
        'delito' => $insertStmt->fetch(PDO::FETCH_ASSOC),
    ], 201);
} catch (Throwable $exception) {
    sendError('No se pudo guardar el delito', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
