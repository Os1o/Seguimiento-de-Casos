<?php

declare(strict_types=1);

require_once dirname(__DIR__) . '/bootstrap.php';

$user = requireAuth();

if (empty($_SESSION['session_token']) || !is_string($_SESSION['session_token'])) {
    $_SESSION['session_token'] = bin2hex(random_bytes(32));
}

sendSuccess('Sesion activa', [
    'user' => array_merge($user, [
        'sessionToken' => $_SESSION['session_token'],
    ]),
]);
