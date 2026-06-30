<?php

declare(strict_types=1);

$privateConfigPath = getenv('APP_PRIVATE_CONFIG');

if (is_string($privateConfigPath) && $privateConfigPath !== '' && is_file($privateConfigPath)) {
    require_once $privateConfigPath;
}

$localConfigPath = __DIR__ . '/config.local.php';
if (is_file($localConfigPath)) {
    require_once $localConfigPath;
}

if (!defined('APP_BASE_PATH')) {
    define('APP_BASE_PATH', dirname(__DIR__));
}

if (!defined('APP_STORAGE_PATH')) {
    define('APP_STORAGE_PATH', APP_BASE_PATH . '/storage');
}

if (!defined('APP_DEBUG')) {
    define('APP_DEBUG', false);
}

if (!defined('DB_HOST')) {
    define('DB_HOST', 'localhost');
}

if (!defined('DB_PORT')) {
    define('DB_PORT', '5432');
}

if (!defined('DB_NAME')) {
    define('DB_NAME', 'seguimiento_juicios');
}

if (!defined('DB_USER')) {
    define('DB_USER', '');
}

if (!defined('DB_PASSWORD')) {
    define('DB_PASSWORD', '');
}

if (!defined('APP_LOGIN_RATE_LIMIT_IP_MAX_ATTEMPTS')) {
    define('APP_LOGIN_RATE_LIMIT_IP_MAX_ATTEMPTS', 10);
}

if (!defined('APP_LOGIN_RATE_LIMIT_IP_WINDOW_SECONDS')) {
    define('APP_LOGIN_RATE_LIMIT_IP_WINDOW_SECONDS', 600);
}

if (!defined('APP_LOGIN_RATE_LIMIT_IP_BLOCK_SECONDS')) {
    define('APP_LOGIN_RATE_LIMIT_IP_BLOCK_SECONDS', 900);
}

if (!defined('APP_LOGIN_RATE_LIMIT_USER_MAX_ATTEMPTS')) {
    define('APP_LOGIN_RATE_LIMIT_USER_MAX_ATTEMPTS', 5);
}

if (!defined('APP_LOGIN_RATE_LIMIT_USER_WINDOW_SECONDS')) {
    define('APP_LOGIN_RATE_LIMIT_USER_WINDOW_SECONDS', 600);
}

if (!defined('APP_LOGIN_RATE_LIMIT_USER_BLOCK_SECONDS')) {
    define('APP_LOGIN_RATE_LIMIT_USER_BLOCK_SECONDS', 900);
}
