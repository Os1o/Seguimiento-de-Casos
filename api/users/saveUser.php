<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

function normalizeLegacyUserRole(?string $role, ?string &$alcanceGlobal = null): string
{
    $normalizedRole = trim((string) $role);

    if ($normalizedRole === 'jefe') {
        $alcanceGlobal = 'true';
        return 'consulta';
    }

    return $normalizedRole;
}

try {
    $adminUser = requireAdmin();

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        sendError('Metodo no permitido', 405);
    }

    $rawBody = file_get_contents('php://input');
    $payload = json_decode($rawBody, true);

    if (!is_array($payload)) {
        sendError('JSON invalido', 400);
    }

    $payload = normalizeInputToUppercase($payload, [
        'usuario',
        'password',
        'rol',
        'nombre_original',
        'nombre_guardado',
        'ruta_archivo',
        'mime_type',
    ]);

    $pdo = getDatabaseConnection();

    $id = isset($payload['id']) ? (int) $payload['id'] : null;
    $nombreCompleto = trim((string) ($payload['nombre_completo'] ?? ''));
    $usuario = trim((string) ($payload['usuario'] ?? ''));
    $password = (string) ($payload['password'] ?? '');
    $rol = normalizeLegacyUserRole(
        (string) ($payload['rol'] ?? ''),
        $alcanceGlobalLegacyNormalization
    );
    $allowedRoles = ['admin', 'editor', 'consulta'];
    $delegacionId = array_key_exists('delegacion_id', $payload) && $payload['delegacion_id'] !== null && $payload['delegacion_id'] !== ''
        ? (int) $payload['delegacion_id']
        : null;
    $alcanceGlobal = array_key_exists('alcance_global', $payload)
        ? (!empty($payload['alcance_global']) ? 'true' : 'false')
        : 'false';
    if (isset($alcanceGlobalLegacyNormalization)) {
        $alcanceGlobal = $alcanceGlobalLegacyNormalization;
    }
    $permisoCivilMercantil = !empty($payload['permiso_civil_mercantil']) ? 'true' : 'false';
    $permisoPenal = !empty($payload['permiso_penal']) ? 'true' : 'false';
    $esAbogado = !empty($payload['es_abogado']) ? 'true' : 'false';
    $esJefe = !empty($payload['es_jefe']) ? 'true' : 'false';
    $activo = array_key_exists('activo', $payload)
        ? (!empty($payload['activo']) ? 'true' : 'false')
        : 'true';

    if ($rol !== '' && !in_array($rol, $allowedRoles, true)) {
        sendError('El rol especificado no es valido', 400);
    }

    if ($rol === 'admin') {
        $alcanceGlobal = 'true';
        $delegacionId = null;
    }

    if ($rol === 'editor' && $alcanceGlobal === 'true') {
        sendError('El rol editor no puede tener alcance global', 400);
    }

    if ($rol === 'consulta' && $alcanceGlobal === 'false' && $delegacionId === null) {
        sendError('Los usuarios de consulta local deben tener una delegacion asignada', 400);
    }

    if ($rol === 'editor' && $delegacionId === null) {
        sendError('Los usuarios editores deben tener una delegacion asignada', 400);
    }

    if ($id === null) {
        if ($nombreCompleto === '' || $usuario === '' || $password === '' || $rol === '') {
            sendError('Nombre, usuario, password y rol son obligatorios', 400);
        }

        $stmtExiste = $pdo->prepare('SELECT id FROM usuarios WHERE usuario = :usuario LIMIT 1');
        $stmtExiste->execute([
            'usuario' => $usuario,
        ]);

        if ($stmtExiste->fetch()) {
            sendError('Ya existe un usuario con ese nombre de usuario', 409);
        }

        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('
            INSERT INTO usuarios (
                usuario,
                password,
                nombre_completo,
                rol,
                delegacion_id,
                alcance_global,
                permiso_civil_mercantil,
                permiso_penal,
                es_abogado,
                es_jefe,
                activo
            )
            VALUES (
                :usuario,
                :password,
                :nombre_completo,
                :rol,
                :delegacion_id,
                :alcance_global,
                :permiso_civil_mercantil,
                :permiso_penal,
                :es_abogado,
                :es_jefe,
                :activo
            )
            RETURNING
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
        ');

        $stmt->execute([
            'usuario' => $usuario,
            'password' => $passwordHash,
            'nombre_completo' => $nombreCompleto,
            'rol' => $rol,
            'delegacion_id' => $delegacionId,
            'alcance_global' => $alcanceGlobal,
            'permiso_civil_mercantil' => $permisoCivilMercantil,
            'permiso_penal' => $permisoPenal,
            'es_abogado' => $esAbogado,
            'es_jefe' => $esJefe,
            'activo' => $activo,
        ]);

        $savedUser = $stmt->fetch();

        auditLog($pdo, $adminUser, [
            'modulo' => 'USUARIOS',
            'accion' => 'CREAR',
            'entidad' => 'USUARIO',
            'entidad_id' => (int) ($savedUser['id'] ?? 0) ?: null,
        'descripcion' => 'Creacion de usuario',
        'detalles' => [
            'nombre_completo' => $savedUser['nombre_completo'] ?? null,
            'usuario' => $savedUser['usuario'] ?? null,
            'rol' => $savedUser['rol'] ?? null,
            'delegacion_id' => $savedUser['delegacion_id'] ?? null,
            'alcance_global' => $savedUser['alcance_global'] ?? null,
            'permiso_civil_mercantil' => $savedUser['permiso_civil_mercantil'] ?? null,
            'permiso_penal' => $savedUser['permiso_penal'] ?? null,
            'es_abogado' => $savedUser['es_abogado'] ?? null,
            'es_jefe' => $savedUser['es_jefe'] ?? null,
            'activo' => $savedUser['activo'] ?? null,
        ],
    ]);

        sendSuccess('Usuario creado correctamente', [
            'user' => $savedUser,
        ]);
    }

    $stmtUsuarioActual = $pdo->prepare('
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
            activo
        FROM usuarios
        WHERE id = :id
        LIMIT 1
    ');
    $stmtUsuarioActual->execute([
        'id' => $id,
    ]);

    $existingUser = $stmtUsuarioActual->fetch();

    if (!$existingUser) {
        sendError('Usuario no encontrado', 404);
    }

    if ($id === (int) ($adminUser['id'] ?? 0) && array_key_exists('activo', $payload) && $activo === 'false') {
        sendError('No puedes desactivar tu propia cuenta', 400);
    }

    if ($nombreCompleto === '' && $usuario === '' && $rol === '' && $password === '' && !array_key_exists('activo', $payload) && !array_key_exists('alcance_global', $payload) && !array_key_exists('delegacion_id', $payload)) {
        sendError('No hay datos para actualizar', 400);
    }

    $existingUserRole = normalizeLegacyUserRole(
        (string) $existingUser['rol'],
        $existingUserLegacyScope
    );
    $effectiveRol = $rol !== '' ? $rol : $existingUserRole;
    $effectiveAlcanceGlobal = array_key_exists('alcance_global', $payload)
        ? $alcanceGlobal
        : (!empty($existingUser['alcance_global']) ? 'true' : 'false');

    if (isset($existingUserLegacyScope) && $existingUserLegacyScope === 'true') {
        $effectiveAlcanceGlobal = 'true';
    }
    $effectiveDelegacionId = array_key_exists('delegacion_id', $payload)
        ? $delegacionId
        : ($existingUser['delegacion_id'] !== null ? (int) $existingUser['delegacion_id'] : null);

    if ($effectiveRol === 'admin') {
        $effectiveAlcanceGlobal = 'true';
        $effectiveDelegacionId = null;
        $alcanceGlobal = 'true';
        $delegacionId = null;
    }

    if ($effectiveRol === 'editor' && $effectiveAlcanceGlobal === 'true') {
        sendError('El rol editor no puede tener alcance global', 400);
    }

    if ($effectiveRol === 'editor' && $effectiveDelegacionId === null) {
        sendError('Los usuarios editores deben tener una delegacion asignada', 400);
    }

    if ($effectiveRol === 'consulta' && $effectiveAlcanceGlobal === 'false' && $effectiveDelegacionId === null) {
        sendError('Los usuarios de consulta local deben tener una delegacion asignada', 400);
    }

    if ($usuario !== '' && $usuario !== $existingUser['usuario']) {
        $stmtExiste = $pdo->prepare('SELECT id FROM usuarios WHERE usuario = :usuario AND id <> :id LIMIT 1');
        $stmtExiste->execute([
            'usuario' => $usuario,
            'id' => $id,
        ]);

        if ($stmtExiste->fetch()) {
            sendError('Ya existe un usuario con ese nombre de usuario', 409);
        }
    }

    $fields = [];
    $params = [
        'id' => $id,
    ];

    if ($nombreCompleto !== '') {
        $fields[] = 'nombre_completo = :nombre_completo';
        $params['nombre_completo'] = $nombreCompleto;
    }

    if ($usuario !== '') {
        $fields[] = 'usuario = :usuario';
        $params['usuario'] = $usuario;
    }

    if ($rol !== '') {
        $fields[] = 'rol = :rol';
        $params['rol'] = $rol;
    }

    if (array_key_exists('delegacion_id', $payload)) {
        $fields[] = 'delegacion_id = :delegacion_id';
        $params['delegacion_id'] = $delegacionId;
    }

    if (array_key_exists('alcance_global', $payload) || $rol === 'admin') {
        $fields[] = 'alcance_global = :alcance_global';
        $params['alcance_global'] = $alcanceGlobal;
    }

    if (array_key_exists('permiso_civil_mercantil', $payload)) {
        $fields[] = 'permiso_civil_mercantil = :permiso_civil_mercantil';
        $params['permiso_civil_mercantil'] = $permisoCivilMercantil;
    }

    if (array_key_exists('permiso_penal', $payload)) {
        $fields[] = 'permiso_penal = :permiso_penal';
        $params['permiso_penal'] = $permisoPenal;
    }

    if (array_key_exists('es_abogado', $payload)) {
        $fields[] = 'es_abogado = :es_abogado';
        $params['es_abogado'] = $esAbogado;
    }

    if (array_key_exists('es_jefe', $payload)) {
        $fields[] = 'es_jefe = :es_jefe';
        $params['es_jefe'] = $esJefe;
    }

    if (array_key_exists('activo', $payload)) {
        $fields[] = 'activo = :activo';
        $params['activo'] = $activo;
    }

    if ($password !== '') {
        $fields[] = 'password = :password';
        $params['password'] = password_hash($password, PASSWORD_DEFAULT);
    }

    if (empty($fields)) {
        sendError('No hay campos validos para actualizar', 400);
    }

    $sql = '
        UPDATE usuarios
        SET ' . implode(', ', $fields) . '
        WHERE id = :id
        RETURNING
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
    ';

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    $savedUser = $stmt->fetch();

    $cambios = [];

    if (($existingUser['nombre_completo'] ?? null) !== ($savedUser['nombre_completo'] ?? null)) {
        $cambios['nombre_completo'] = [
            'antes' => $existingUser['nombre_completo'] ?? null,
            'despues' => $savedUser['nombre_completo'] ?? null,
        ];
    }

    if (($existingUser['usuario'] ?? null) !== ($savedUser['usuario'] ?? null)) {
        $cambios['usuario'] = [
            'antes' => $existingUser['usuario'] ?? null,
            'despues' => $savedUser['usuario'] ?? null,
        ];
    }

    if (($existingUserRole ?? null) !== ($savedUser['rol'] ?? null)) {
        $cambios['rol'] = [
            'antes' => $existingUserRole ?? null,
            'despues' => $savedUser['rol'] ?? null,
        ];
    }

    if ((int) ($existingUser['delegacion_id'] ?? 0) !== (int) ($savedUser['delegacion_id'] ?? 0)) {
        $cambios['delegacion_id'] = [
            'antes' => $existingUser['delegacion_id'] ?? null,
            'despues' => $savedUser['delegacion_id'] ?? null,
        ];
    }

    if (($existingUser['alcance_global'] ?? null) !== ($savedUser['alcance_global'] ?? null)) {
        $cambios['alcance_global'] = [
            'antes' => $existingUser['alcance_global'] ?? null,
            'despues' => $savedUser['alcance_global'] ?? null,
        ];
    }

    if (($existingUser['permiso_civil_mercantil'] ?? null) !== ($savedUser['permiso_civil_mercantil'] ?? null)) {
        $cambios['permiso_civil_mercantil'] = [
            'antes' => $existingUser['permiso_civil_mercantil'] ?? null,
            'despues' => $savedUser['permiso_civil_mercantil'] ?? null,
        ];
    }

    if (($existingUser['permiso_penal'] ?? null) !== ($savedUser['permiso_penal'] ?? null)) {
        $cambios['permiso_penal'] = [
            'antes' => $existingUser['permiso_penal'] ?? null,
            'despues' => $savedUser['permiso_penal'] ?? null,
        ];
    }

    if (($existingUser['es_abogado'] ?? null) !== ($savedUser['es_abogado'] ?? null)) {
        $cambios['es_abogado'] = [
            'antes' => $existingUser['es_abogado'] ?? null,
            'despues' => $savedUser['es_abogado'] ?? null,
        ];
    }

    if (($existingUser['es_jefe'] ?? null) !== ($savedUser['es_jefe'] ?? null)) {
        $cambios['es_jefe'] = [
            'antes' => $existingUser['es_jefe'] ?? null,
            'despues' => $savedUser['es_jefe'] ?? null,
        ];
    }

    if (($existingUser['activo'] ?? null) !== ($savedUser['activo'] ?? null)) {
        $cambios['activo'] = [
            'antes' => $existingUser['activo'] ?? null,
            'despues' => $savedUser['activo'] ?? null,
        ];
    }

    if ($password !== '') {
        $cambios['password'] = [
            'antes' => 'CONFIGURADO',
            'despues' => 'ACTUALIZADO',
        ];
    }

    auditLog($pdo, $adminUser, [
        'modulo' => 'USUARIOS',
        'accion' => 'EDITAR',
        'entidad' => 'USUARIO',
        'entidad_id' => (int) ($savedUser['id'] ?? 0) ?: null,
        'descripcion' => 'Actualizacion de usuario',
        'detalles' => [
            'nombre_completo' => $savedUser['nombre_completo'] ?? null,
            'usuario' => $savedUser['usuario'] ?? null,
            'rol' => $savedUser['rol'] ?? null,
            'delegacion_id' => $savedUser['delegacion_id'] ?? null,
            'alcance_global' => $savedUser['alcance_global'] ?? null,
            'activo' => $savedUser['activo'] ?? null,
            'permiso_civil_mercantil' => $savedUser['permiso_civil_mercantil'] ?? null,
            'permiso_penal' => $savedUser['permiso_penal'] ?? null,
            'es_abogado' => $savedUser['es_abogado'] ?? null,
            'es_jefe' => $savedUser['es_jefe'] ?? null,
            'cambios' => $cambios,
        ],
    ]);

    sendSuccess('Usuario actualizado correctamente', [
        'user' => $savedUser,
    ]);
} catch (Throwable $exception) {
    sendError('No se pudo guardar el usuario', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
