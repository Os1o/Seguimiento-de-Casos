<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

try {
    requireAdmin();

    $pdo = getDatabaseConnection();

    $stmt = $pdo->query('
        SELECT
            id,
            usuario,
            nombre_completo,
            rol,
            delegacion_id,
            alcance_global,
            permiso_civil_mercantil,
            permiso_penal,
            es_abogado,
            es_jefe,
            activo,
            created_at
        FROM usuarios
        ORDER BY nombre_completo ASC
    ');

    $users = $stmt->fetchAll();

    sendSuccess('Usuarios cargados correctamente', [
        'users' => $users,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudieron cargar los usuarios', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
