<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$user = getAuthenticatedUser();
$sessionToken = isset($_SESSION['session_token']) && is_string($_SESSION['session_token'])
    ? $_SESSION['session_token']
    : null;

try {
    $pdo = getDatabaseConnection();

    if ($user !== null) {
        clearActiveSessionTokenIfMatches($pdo, (int) ($user['id'] ?? 0), $sessionToken);

        auditLog($pdo, $user, [
            'modulo' => 'AUTH',
            'accion' => 'LOGOUT',
            'entidad' => 'SESION',
            'entidad_id' => (int) ($user['id'] ?? 0) ?: null,
            'descripcion' => 'Cierre de sesion',
        ]);
    }
} catch (Throwable $exception) {
    error_log('[AplicativoLocal][AUDITORIA] ' . $exception->getMessage());
}

$_SESSION = [];

if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();

    setcookie(
        session_name(),
        '',
        time() - 42000,
        $params['path'],
        $params['domain'],
        (bool) $params['secure'],
        (bool) $params['httponly']
    );
}

session_destroy();

sendSuccess('Sesion cerrada correctamente');
