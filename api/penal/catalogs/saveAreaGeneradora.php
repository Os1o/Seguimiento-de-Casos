<?php

declare(strict_types=1);

require_once dirname(dirname(__DIR__)) . '/bootstrap.php';

function readAreaGeneradoraPenalPayload(): array
{
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    $rawBody = file_get_contents('php://input') ?: '';
    $jsonPayload = str_contains(strtolower($contentType), 'application/json') && $rawBody !== ''
        ? json_decode($rawBody, true)
        : null;

    $source = is_array($jsonPayload) ? $jsonPayload : $_POST;

    return [
        'delegacion_id' => isset($source['delegacion_id']) ? (int) $source['delegacion_id'] : null,
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
        sendError('No tienes permisos para agregar areas generadoras penales', 403);
    }

    $payload = readAreaGeneradoraPenalPayload();

    if ($payload['delegacion_id'] === null || $payload['delegacion_id'] <= 0) {
        sendError('Selecciona una OOAD valida', 400);
    }

    if ($payload['nombre'] === '') {
        sendError('Captura el nombre del area generadora', 400);
    }

    if (mb_strlen($payload['nombre'], 'UTF-8') > 255) {
        sendError('El nombre del area generadora no puede exceder 255 caracteres', 400);
    }

    ensureWriteDelegacionAccess($user, $payload['delegacion_id']);

    $pdo = getDatabaseConnection();

    $delegacionStmt = $pdo->prepare('
        SELECT id
        FROM delegaciones
        WHERE id = :id
          AND activo = TRUE
        LIMIT 1
    ');
    $delegacionStmt->execute(['id' => $payload['delegacion_id']]);

    if (!$delegacionStmt->fetchColumn()) {
        sendError('La OOAD seleccionada no existe o esta inactiva', 400);
    }

    $duplicateStmt = $pdo->prepare('
        SELECT id
        FROM areas_penal
        WHERE delegacion_id = :delegacion_id
          AND activo = TRUE
          AND LOWER(nombre) = LOWER(:nombre)
        LIMIT 1
    ');
    $duplicateStmt->execute([
        'delegacion_id' => $payload['delegacion_id'],
        'nombre' => $payload['nombre'],
    ]);

    if ($duplicateStmt->fetchColumn()) {
        sendError('Ya existe un area generadora penal con ese nombre para la OOAD seleccionada', 409);
    }

    $insertStmt = $pdo->prepare('
        INSERT INTO areas_penal (delegacion_id, nombre)
        VALUES (:delegacion_id, :nombre)
        RETURNING id, delegacion_id, nombre
    ');
    $insertStmt->execute([
        'delegacion_id' => $payload['delegacion_id'],
        'nombre' => $payload['nombre'],
    ]);

    sendSuccess('Area generadora penal agregada correctamente', [
        'area' => $insertStmt->fetch(PDO::FETCH_ASSOC),
    ], 201);
} catch (Throwable $exception) {
    sendError('No se pudo guardar el area generadora penal', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
