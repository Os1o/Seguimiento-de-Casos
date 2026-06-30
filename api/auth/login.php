<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Metodo no permitido', 405);
}

$rawBody = file_get_contents('php://input');
$requestData = json_decode($rawBody, true);

if (!is_array($requestData)) {
    sendError('JSON invalido', 400);
}

$usuario = trim((string) ($requestData['usuario'] ?? ''));
$password = (string) ($requestData['password'] ?? '');

if ($usuario === '' || $password === '') {
    sendError('Usuario y password son obligatorios', 400);
}

try {
    $pdo = getDatabaseConnection();
    $ipAddress = getRequestIpAddress();
    $normalizedUsuario = normalizeAuthRateLimitIdentifier($usuario);

    if (is_string($ipAddress) && trim($ipAddress) !== '') {
        ensureAuthRateLimitAllowed($pdo, 'ip', $ipAddress);
    }

    ensureAuthRateLimitAllowed($pdo, 'usuario', $normalizedUsuario);

    $stmt = $pdo->prepare(
        'SELECT id, usuario, password, nombre_completo, rol, delegacion_id, alcance_global, permiso_civil_mercantil, permiso_penal, es_abogado, es_jefe, activo, sesion_token_activa
         FROM usuarios
         WHERE usuario = :usuario
         LIMIT 1'
    );

    $stmt->execute([
        'usuario' => $usuario,
    ]);

    $user = $stmt->fetch();

    if (!$user) {
        $ipBlock = is_string($ipAddress) && trim($ipAddress) !== ''
            ? registerFailedAuthRateLimitAttempt($pdo, 'ip', $ipAddress)
            : ['blocked' => false, 'retry_after_seconds' => 0];
        $userBlock = registerFailedAuthRateLimitAttempt($pdo, 'usuario', $normalizedUsuario);

        if (!empty($ipBlock['blocked']) || !empty($userBlock['blocked'])) {
            $retryAfterSeconds = max((int) ($ipBlock['retry_after_seconds'] ?? 0), (int) ($userBlock['retry_after_seconds'] ?? 0));
            header('Retry-After: ' . $retryAfterSeconds);

            auditLog($pdo, null, [
                'modulo' => 'AUTH',
                'accion' => 'RATE_LIMIT_LOGIN',
                'entidad' => 'LOGIN',
                'descripcion' => 'Bloqueo temporal por demasiados intentos fallidos de inicio de sesion',
                'detalles' => [
                    'usuario' => $normalizedUsuario,
                    'ip_address' => $ipAddress,
                    'retry_after_seconds' => $retryAfterSeconds,
                ],
            ]);

            sendError(getAuthRateLimitExceededMessage($retryAfterSeconds), 429, [
                'retry_after_seconds' => $retryAfterSeconds,
            ]);
        }

        sendError('Credenciales invalidas', 401);
    }

    if (!(bool) $user['activo']) {
        sendError('Usuario inactivo', 403);
    }

    if (!password_verify($password, (string) $user['password'])) {
        $ipBlock = is_string($ipAddress) && trim($ipAddress) !== ''
            ? registerFailedAuthRateLimitAttempt($pdo, 'ip', $ipAddress)
            : ['blocked' => false, 'retry_after_seconds' => 0];
        $userBlock = registerFailedAuthRateLimitAttempt($pdo, 'usuario', $normalizedUsuario);

        if (!empty($ipBlock['blocked']) || !empty($userBlock['blocked'])) {
            $retryAfterSeconds = max((int) ($ipBlock['retry_after_seconds'] ?? 0), (int) ($userBlock['retry_after_seconds'] ?? 0));
            header('Retry-After: ' . $retryAfterSeconds);

            auditLog($pdo, null, [
                'modulo' => 'AUTH',
                'accion' => 'RATE_LIMIT_LOGIN',
                'entidad' => 'LOGIN',
                'descripcion' => 'Bloqueo temporal por demasiados intentos fallidos de inicio de sesion',
                'detalles' => [
                    'usuario' => $normalizedUsuario,
                    'ip_address' => $ipAddress,
                    'retry_after_seconds' => $retryAfterSeconds,
                ],
            ]);

            sendError(getAuthRateLimitExceededMessage($retryAfterSeconds), 429, [
                'retry_after_seconds' => $retryAfterSeconds,
            ]);
        }

        sendError('Credenciales invalidas', 401);
    }

    clearAuthRateLimitForSuccessfulLogin($pdo, $ipAddress, $normalizedUsuario);

    unset($user['password']);

    session_regenerate_id(true);
    $sessionToken = bin2hex(random_bytes(32));
    $sessionWasReplaced = is_string($user['sesion_token_activa'] ?? null)
        && trim((string) $user['sesion_token_activa']) !== '';

    $_SESSION['user'] = [
        'id' => (int) $user['id'],
        'usuario' => $user['usuario'],
        'nombreCompleto' => $user['nombre_completo'],
        'rol' => $user['rol'],
        'delegacionId' => $user['delegacion_id'] !== null ? (int) $user['delegacion_id'] : null,
        'alcanceGlobal' => (bool) $user['alcance_global'],
        'permisoCivilMercantil' => (bool) $user['permiso_civil_mercantil'],
        'permisoPenal' => (bool) $user['permiso_penal'],
        'esAbogado' => (bool) $user['es_abogado'],
        'esJefe' => (bool) $user['es_jefe'],
    ];
    $_SESSION['session_token'] = $sessionToken;
    $_SESSION['last_activity'] = time();
    syncActiveSessionToken($pdo, (int) $user['id'], $sessionToken);

    if ($sessionWasReplaced) {
        auditLog($pdo, $_SESSION['user'], [
            'modulo' => 'AUTH',
            'accion' => 'REEMPLAZAR_SESION',
            'entidad' => 'SESION',
            'entidad_id' => (int) $user['id'],
            'descripcion' => 'Sesion anterior invalidada por un nuevo inicio de sesion',
            'detalles' => [
                'usuario' => $user['usuario'] ?? null,
                'nombre_completo' => $user['nombre_completo'] ?? null,
            ],
        ]);
    }

    auditLog($pdo, $_SESSION['user'], [
        'modulo' => 'AUTH',
        'accion' => 'LOGIN',
        'entidad' => 'SESION',
        'entidad_id' => (int) $user['id'],
        'descripcion' => 'Inicio de sesion correcto',
    ]);

    session_write_close();

    sendSuccess('Login correcto', [
        'user' => [
            'id' => (int) $user['id'],
            'usuario' => $user['usuario'],
            'nombreCompleto' => $user['nombre_completo'],
            'rol' => $user['rol'],
            'delegacionId' => $user['delegacion_id'] !== null ? (int) $user['delegacion_id'] : null,
            'alcanceGlobal' => (bool) $user['alcance_global'],
            'permisoCivilMercantil' => (bool) $user['permiso_civil_mercantil'],
            'permisoPenal' => (bool) $user['permiso_penal'],
            'esAbogado' => (bool) $user['es_abogado'],
            'esJefe' => (bool) $user['es_jefe'],
            'sessionToken' => $sessionToken,
        ],
    ]);
} catch (Throwable $exception) {
    sendError('Error interno al iniciar sesion', 500, [
        'detail' => $exception->getMessage(),
    ]);
}
