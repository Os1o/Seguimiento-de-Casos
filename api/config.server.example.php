<?php

declare(strict_types=1);

// Copia este archivo fuera del webroot, por ejemplo:
// C:/servidor/appdata/seguimiento_juicios/config/private-config.php
// Luego define la variable de entorno APP_PRIVATE_CONFIG apuntando a esa ruta.

define('APP_BASE_PATH', 'C:/servidor/www/AplicativoLocal');
define('APP_STORAGE_PATH', 'D:/servidor/appdata/seguimiento_juicios/storage');

define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'seguimiento_juicios');
define('DB_USER', 'app_seguimiento');
define('DB_PASSWORD', 'CAMBIAR_ESTA_PASSWORD');

define('APP_DEBUG', false);

define('APP_LOGIN_RATE_LIMIT_IP_MAX_ATTEMPTS', 10);
define('APP_LOGIN_RATE_LIMIT_IP_WINDOW_SECONDS', 600);
define('APP_LOGIN_RATE_LIMIT_IP_BLOCK_SECONDS', 900);

define('APP_LOGIN_RATE_LIMIT_USER_MAX_ATTEMPTS', 5);
define('APP_LOGIN_RATE_LIMIT_USER_WINDOW_SECONDS', 600);
define('APP_LOGIN_RATE_LIMIT_USER_BLOCK_SECONDS', 900);
