<?php

declare(strict_types=1);

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);

    session_start();
}

if (!defined('APP_SESSION_TIMEOUT_SECONDS')) {
    define('APP_SESSION_TIMEOUT_SECONDS', 600);
}

function destroyCurrentSession(bool $startFreshSession = false): void
{
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

    if ($startFreshSession) {
        session_start();
    }
}

if (isset($_SESSION['user'])) {
    $lastActivity = isset($_SESSION['last_activity']) ? (int) $_SESSION['last_activity'] : 0;
    $now = time();
    $userIdForTimeout = (int) ($_SESSION['user']['id'] ?? 0);
    $sessionTokenForTimeout = isset($_SESSION['session_token']) && is_string($_SESSION['session_token'])
        ? $_SESSION['session_token']
        : null;

    if ($lastActivity > 0 && ($now - $lastActivity) > APP_SESSION_TIMEOUT_SECONDS) {
        require_once __DIR__ . '/config.php';
        require_once __DIR__ . '/db.php';
        require_once __DIR__ . '/helpers.php';

        if ($userIdForTimeout > 0) {
            try {
                $timeoutPdo = getDatabaseConnection();
                clearActiveSessionTokenIfMatches($timeoutPdo, $userIdForTimeout, $sessionTokenForTimeout);
            } catch (Throwable $exception) {
                error_log('[AplicativoLocal][SESION] ' . $exception->getMessage());
            }
        }

        destroyCurrentSession(true);
    } else if (($_SERVER['HTTP_X_HEARTBEAT'] ?? '') !== '1') {
        $_SESSION['last_activity'] = $now;
    }
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=utf-8');

if (isset($_SESSION['user'])) {
    $sessionUserId = (int) ($_SESSION['user']['id'] ?? 0);

    if ($sessionUserId > 0) {
        try {
            $sessionUserStmt = getDatabaseConnection()->prepare('
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
            $sessionUserStmt->execute([
                'id' => $sessionUserId,
            ]);

            $freshSessionUser = $sessionUserStmt->fetch(PDO::FETCH_ASSOC);

            if (!$freshSessionUser || empty($freshSessionUser['activo'])) {
                destroyCurrentSession();
                sendError('Sesion invalida o expirada', 401);
            }

            $_SESSION['user'] = array_merge($_SESSION['user'], [
                'id' => (int) $freshSessionUser['id'],
                'usuario' => $freshSessionUser['usuario'],
                'nombreCompleto' => $freshSessionUser['nombre_completo'],
                'rol' => $freshSessionUser['rol'],
                'delegacionId' => $freshSessionUser['delegacion_id'] !== null ? (int) $freshSessionUser['delegacion_id'] : null,
                'alcanceGlobal' => (bool) $freshSessionUser['alcance_global'],
                'permisoCivilMercantil' => (bool) $freshSessionUser['permiso_civil_mercantil'],
                'permisoPenal' => (bool) $freshSessionUser['permiso_penal'],
                'esAbogado' => (bool) $freshSessionUser['es_abogado'],
                'esJefe' => (bool) $freshSessionUser['es_jefe'],
            ]);
        } catch (Throwable $exception) {
            error_log('[AplicativoLocal][SESION_SYNC] ' . $exception->getMessage());
        }
    }

    $scriptName = basename((string) ($_SERVER['SCRIPT_NAME'] ?? ''));
    $excludedSessionTokenScripts = [
        'login.php',
        'logout.php',
        'logoutBeacon.php',
    ];

    if (!in_array($scriptName, $excludedSessionTokenScripts, true)) {
        $sessionToken = $_SESSION['session_token'] ?? null;
        $requestToken = $_SERVER['HTTP_X_APP_SESSION_TOKEN'] ?? null;

        if ((!is_string($requestToken) || $requestToken === '') && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $requestToken = $_GET['app_session_token'] ?? null;
        }

        if (!is_string($sessionToken) || $sessionToken === '' || !is_string($requestToken) || $requestToken === '' || !hash_equals($sessionToken, $requestToken)) {
            destroyCurrentSession();
            sendError('Sesion invalida o expirada', 401);
        }

        $userId = (int) ($_SESSION['user']['id'] ?? 0);
        if ($userId > 0) {
            $stmt = getDatabaseConnection()->prepare('
                SELECT sesion_token_activa
                FROM usuarios
                WHERE id = :id
                LIMIT 1
            ');
            $stmt->execute([
                'id' => $userId,
            ]);

            $activeSessionToken = $stmt->fetchColumn();

            if (!is_string($activeSessionToken) || $activeSessionToken === '' || !hash_equals($activeSessionToken, $sessionToken)) {
                destroyCurrentSession();
                sendError('Tu sesion se cerro porque esta cuenta inicio sesion en otro navegador o equipo.', 401);
            }
        }
    }
}
