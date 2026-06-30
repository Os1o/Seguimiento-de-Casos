<?php

declare(strict_types=1);

function sendJson(array $data, int $statusCode = 200): void
{
    http_response_code($statusCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function isDebugMode(): bool
{
    return defined('APP_DEBUG') && APP_DEBUG === true;
}

function shouldExposeErrorDetails(int $statusCode): bool
{
    return $statusCode < 500 || isDebugMode();
}

function logInternalError(string $message, int $statusCode, array $errors = []): void
{
    if ($statusCode < 500) {
        return;
    }

    $logPayload = [
        'message' => $message,
        'statusCode' => $statusCode,
    ];

    if ($errors !== []) {
        $logPayload['errors'] = $errors;
    }

    error_log('[AplicativoLocal] ' . json_encode($logPayload, JSON_UNESCAPED_UNICODE));
}

function sendSuccess(string $message, array $data = [], int $statusCode = 200): void
{
    sendJson([
        'ok' => true,
        'message' => $message,
        'data' => $data,
    ], $statusCode);
}

function sendError(string $message, int $statusCode = 400, array $errors = []): void
{
    logInternalError($message, $statusCode, $errors);

    $payload = [
        'ok' => false,
        'message' => $message,
    ];

    if ($errors !== [] && shouldExposeErrorDetails($statusCode)) {
        $payload['errors'] = $errors;
    }

    sendJson($payload, $statusCode);
}

function getAuthenticatedUser(): ?array
{
    return isset($_SESSION['user']) && is_array($_SESSION['user'])
        ? $_SESSION['user']
        : null;
}

function requireAuth(): array
{
    $user = getAuthenticatedUser();

    if ($user === null) {
        sendError('No hay sesion activa', 401);
    }

    return $user;
}

function requireAdmin(): array
{
    $user = requireAuth();

    if (($user['rol'] ?? null) !== 'admin') {
        sendError('No tienes permisos para realizar esta accion', 403);
    }

    return $user;
}

function requireAnyModuleAccess(): array
{
    $user = requireAuth();

    if (isAdminUser($user)) {
        return $user;
    }

    if (empty($user['permisoCivilMercantil']) && empty($user['permisoPenal'])) {
        sendError('No tienes permiso para acceder a los catalogos del sistema', 403);
    }

    return $user;
}

function requireCivilAccess(): array
{
    $user = requireAuth();

    if (($user['rol'] ?? null) === 'admin') {
        return $user;
    }

    if (empty($user['permisoCivilMercantil'])) {
        sendError('No tienes permiso para acceder al modulo civil', 403);
    }

    return $user;
}

function requirePenalAccess(): array
{
    $user = requireAuth();

    if (($user['rol'] ?? null) === 'admin') {
        return $user;
    }

    if (empty($user['permisoPenal'])) {
        sendError('No tienes permiso para acceder al modulo penal', 403);
    }

    return $user;
}

function isAdminUser(array $user): bool
{
    return ($user['rol'] ?? null) === 'admin';
}

function isAbogadoUser(array $user): bool
{
    return !empty($user['esAbogado']) || !empty($user['es_abogado']);
}

function isJefeUser(array $user): bool
{
    return !empty($user['esJefe']) || !empty($user['es_jefe']);
}

function hasGlobalScope(array $user): bool
{
    if (isAdminUser($user)) {
        return true;
    }

    return !empty($user['alcanceGlobal']) || !empty($user['alcance_global']);
}

function getUserDelegacionId(array $user): ?int
{
    if (array_key_exists('delegacionId', $user) && $user['delegacionId'] !== null) {
        return (int) $user['delegacionId'];
    }

    if (array_key_exists('delegacion_id', $user) && $user['delegacion_id'] !== null) {
        return (int) $user['delegacion_id'];
    }

    return null;
}

function requireCivilWriteAccess(): array
{
    $user = requireCivilAccess();

    if (!isAdminUser($user) && ($user['rol'] ?? null) === 'consulta') {
        sendError('No tienes permisos para modificar informacion del modulo civil', 403);
    }

    return $user;
}

function requirePenalWriteAccess(): array
{
    $user = requirePenalAccess();

    if (!isAdminUser($user) && ($user['rol'] ?? null) === 'consulta') {
        sendError('No tienes permisos para modificar informacion del modulo penal', 403);
    }

    return $user;
}

function ensureReadDelegacionAccess(array $user, ?int $delegacionId): void
{
    if (hasGlobalScope($user)) {
        return;
    }

    $userDelegacionId = getUserDelegacionId($user);

    if ($userDelegacionId === null || $delegacionId === null || $userDelegacionId !== $delegacionId) {
        sendError('No tienes permisos para acceder a registros de otra delegacion', 403);
    }
}

function ensureWriteDelegacionAccess(array $user, ?int $delegacionId): void
{
    if (isAdminUser($user)) {
        return;
    }

    $userDelegacionId = getUserDelegacionId($user);

    if ($userDelegacionId === null || $delegacionId === null || $userDelegacionId !== $delegacionId) {
        sendError('No tienes permisos para modificar registros de otra delegacion', 403);
    }
}

function toSystemUppercase(string $value): string
{
    if (function_exists('mb_strtoupper')) {
        return mb_strtoupper($value, 'UTF-8');
    }

    return strtoupper($value);
}

function getStorageBasePath(): string
{
    return rtrim((string) APP_STORAGE_PATH, '/\\');
}

function resolveStorageAbsolutePath(string $relativePath): string
{
    $normalizedPath = str_replace('\\', '/', ltrim($relativePath, '/\\'));

    if (str_starts_with($normalizedPath, 'storage/')) {
        $normalizedPath = substr($normalizedPath, strlen('storage/'));
    }

    return getStorageBasePath() . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $normalizedPath);
}

function normalizeInputToUppercase(mixed $value, array $excludedKeys = [], ?string $currentKey = null): mixed
{
    if ($currentKey !== null && in_array($currentKey, $excludedKeys, true)) {
        return $value;
    }

    if (is_array($value)) {
        $normalized = [];

        foreach ($value as $key => $item) {
            $normalized[$key] = normalizeInputToUppercase(
                $item,
                $excludedKeys,
                is_string($key) ? $key : null
            );
        }

        return $normalized;
    }

    if (is_string($value)) {
        return toSystemUppercase($value);
    }

    return $value;
}

function getRequestIpAddress(): ?string
{
    $candidates = [
        $_SERVER['HTTP_X_FORWARDED_FOR'] ?? null,
        $_SERVER['REMOTE_ADDR'] ?? null,
    ];

    foreach ($candidates as $candidate) {
        if (!is_string($candidate) || trim($candidate) === '') {
            continue;
        }

        $parts = array_map('trim', explode(',', $candidate));
        if ($parts !== [] && $parts[0] !== '') {
            return $parts[0];
        }
    }

    return null;
}

function getRequestUserAgent(): ?string
{
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    return is_string($userAgent) && trim($userAgent) !== '' ? $userAgent : null;
}

function getUploadErrorMessage(int $uploadErrorCode): string
{
    return match ($uploadErrorCode) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'El archivo excede el tamano maximo permitido',
        UPLOAD_ERR_PARTIAL => 'El archivo se subio de forma incompleta',
        UPLOAD_ERR_NO_FILE => 'No se recibio ningun archivo',
        UPLOAD_ERR_NO_TMP_DIR => 'No hay carpeta temporal disponible para la carga',
        UPLOAD_ERR_CANT_WRITE => 'No se pudo escribir el archivo temporal en disco',
        UPLOAD_ERR_EXTENSION => 'La carga del archivo fue detenida por una extension del servidor',
        default => 'No se pudo subir el archivo',
    };
}

function detectUploadedFileMimeType(string $tmpPath): ?string
{
    if ($tmpPath === '' || !is_file($tmpPath) || !is_readable($tmpPath)) {
        return null;
    }

    if (function_exists('finfo_open')) {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo !== false) {
            $mimeType = finfo_file($finfo, $tmpPath);
            finfo_close($finfo);

            if (is_string($mimeType) && trim($mimeType) !== '') {
                return trim($mimeType);
            }
        }
    }

    if (function_exists('mime_content_type')) {
        $mimeType = mime_content_type($tmpPath);
        if (is_string($mimeType) && trim($mimeType) !== '') {
            return trim($mimeType);
        }
    }

    return null;
}

function hasValidPdfSignature(string $tmpPath): bool
{
    if ($tmpPath === '' || !is_file($tmpPath) || !is_readable($tmpPath)) {
        return false;
    }

    $handle = @fopen($tmpPath, 'rb');
    if ($handle === false) {
        return false;
    }

    $header = fread($handle, 5);
    fclose($handle);

    return $header === '%PDF-';
}

function normalizeAuthRateLimitIdentifier(string $identifier): string
{
    $normalized = trim($identifier);

    if ($normalized === '') {
        return '';
    }

    return function_exists('mb_strtolower')
        ? mb_strtolower($normalized, 'UTF-8')
        : strtolower($normalized);
}

function getAuthRateLimitMaxAttempts(string $scope): int
{
    return match ($scope) {
        'ip' => defined('APP_LOGIN_RATE_LIMIT_IP_MAX_ATTEMPTS') ? (int) APP_LOGIN_RATE_LIMIT_IP_MAX_ATTEMPTS : 10,
        'usuario' => defined('APP_LOGIN_RATE_LIMIT_USER_MAX_ATTEMPTS') ? (int) APP_LOGIN_RATE_LIMIT_USER_MAX_ATTEMPTS : 5,
        default => 5,
    };
}

function getAuthRateLimitWindowSeconds(string $scope): int
{
    return match ($scope) {
        'ip' => defined('APP_LOGIN_RATE_LIMIT_IP_WINDOW_SECONDS') ? (int) APP_LOGIN_RATE_LIMIT_IP_WINDOW_SECONDS : 600,
        'usuario' => defined('APP_LOGIN_RATE_LIMIT_USER_WINDOW_SECONDS') ? (int) APP_LOGIN_RATE_LIMIT_USER_WINDOW_SECONDS : 600,
        default => 600,
    };
}

function getAuthRateLimitBlockSeconds(string $scope): int
{
    return match ($scope) {
        'ip' => defined('APP_LOGIN_RATE_LIMIT_IP_BLOCK_SECONDS') ? (int) APP_LOGIN_RATE_LIMIT_IP_BLOCK_SECONDS : 900,
        'usuario' => defined('APP_LOGIN_RATE_LIMIT_USER_BLOCK_SECONDS') ? (int) APP_LOGIN_RATE_LIMIT_USER_BLOCK_SECONDS : 900,
        default => 900,
    };
}

function getAuthRateLimitExceededMessage(int $retryAfterSeconds): string
{
    $retryAfterSeconds = max(1, $retryAfterSeconds);
    $retryAfterMinutes = (int) ceil($retryAfterSeconds / 60);

    return sprintf(
        'Demasiados intentos de inicio de sesion. Intenta de nuevo en %d minuto%s.',
        $retryAfterMinutes,
        $retryAfterMinutes === 1 ? '' : 's'
    );
}

function getAuthRateLimitRecord(PDO $pdo, string $scope, string $identifier): ?array
{
    if ($identifier === '') {
        return null;
    }

    $stmt = $pdo->prepare('
        SELECT id, attempt_count, window_started_at, blocked_until
        FROM auth_rate_limits
        WHERE scope = :scope
          AND identifier = :identifier
        LIMIT 1
    ');

    $stmt->execute([
        'scope' => $scope,
        'identifier' => $identifier,
    ]);

    $record = $stmt->fetch();

    return is_array($record) ? $record : null;
}

function ensureAuthRateLimitAllowed(PDO $pdo, string $scope, string $identifier): void
{
    $identifier = normalizeAuthRateLimitIdentifier($identifier);

    if ($identifier === '') {
        return;
    }

    $record = getAuthRateLimitRecord($pdo, $scope, $identifier);
    if ($record === null || empty($record['blocked_until'])) {
        return;
    }

    $blockedUntil = strtotime((string) $record['blocked_until']);
    if ($blockedUntil === false) {
        return;
    }

    $retryAfterSeconds = $blockedUntil - time();
    if ($retryAfterSeconds <= 0) {
        return;
    }

    header('Retry-After: ' . $retryAfterSeconds);

    sendError(getAuthRateLimitExceededMessage($retryAfterSeconds), 429, [
        'retry_after_seconds' => $retryAfterSeconds,
        'scope' => $scope,
    ]);
}

function registerFailedAuthRateLimitAttempt(PDO $pdo, string $scope, string $identifier): array
{
    $identifier = normalizeAuthRateLimitIdentifier($identifier);

    if ($identifier === '') {
        return [
            'blocked' => false,
            'retry_after_seconds' => 0,
        ];
    }

    $record = getAuthRateLimitRecord($pdo, $scope, $identifier);
    $maxAttempts = max(1, getAuthRateLimitMaxAttempts($scope));
    $windowSeconds = max(60, getAuthRateLimitWindowSeconds($scope));
    $blockSeconds = max(60, getAuthRateLimitBlockSeconds($scope));
    $now = time();
    $attemptCount = 1;
    $windowStartedAt = date('Y-m-d H:i:sP', $now);
    $blockedUntil = null;

    if ($record !== null) {
        $windowStartedAtTimestamp = strtotime((string) $record['window_started_at']);

        if ($windowStartedAtTimestamp !== false && ($now - $windowStartedAtTimestamp) < $windowSeconds) {
            $attemptCount = ((int) $record['attempt_count']) + 1;
            $windowStartedAt = (string) $record['window_started_at'];
        }
    }

    if ($attemptCount >= $maxAttempts) {
        $blockedUntil = date('Y-m-d H:i:sP', $now + $blockSeconds);
    }

    $stmt = $pdo->prepare('
        INSERT INTO auth_rate_limits (
            scope,
            identifier,
            attempt_count,
            window_started_at,
            blocked_until,
            last_attempt_at,
            created_at,
            updated_at
        )
        VALUES (
            :scope,
            :identifier,
            :attempt_count,
            :window_started_at,
            :blocked_until,
            NOW(),
            NOW(),
            NOW()
        )
        ON CONFLICT (scope, identifier)
        DO UPDATE SET
            attempt_count = EXCLUDED.attempt_count,
            window_started_at = EXCLUDED.window_started_at,
            blocked_until = EXCLUDED.blocked_until,
            last_attempt_at = NOW(),
            updated_at = NOW()
    ');

    $stmt->execute([
        'scope' => $scope,
        'identifier' => $identifier,
        'attempt_count' => $attemptCount,
        'window_started_at' => $windowStartedAt,
        'blocked_until' => $blockedUntil,
    ]);

    return [
        'blocked' => $blockedUntil !== null,
        'retry_after_seconds' => $blockedUntil !== null ? $blockSeconds : 0,
    ];
}

function clearAuthRateLimit(PDO $pdo, string $scope, string $identifier): void
{
    $identifier = normalizeAuthRateLimitIdentifier($identifier);

    if ($identifier === '') {
        return;
    }

    $stmt = $pdo->prepare('
        DELETE FROM auth_rate_limits
        WHERE scope = :scope
          AND identifier = :identifier
    ');

    $stmt->execute([
        'scope' => $scope,
        'identifier' => $identifier,
    ]);
}

function clearAuthRateLimitForSuccessfulLogin(PDO $pdo, ?string $ipAddress, string $usuario): void
{
    if (is_string($ipAddress) && trim($ipAddress) !== '') {
        clearAuthRateLimit($pdo, 'ip', $ipAddress);
    }

    clearAuthRateLimit($pdo, 'usuario', $usuario);
}

function auditLog(PDO $pdo, ?array $user, array $event): void
{
    try {
        $stmt = $pdo->prepare('
            INSERT INTO auditoria_eventos (
                usuario_id,
                usuario_nombre,
                usuario_login,
                rol,
                delegacion_id,
                modulo,
                accion,
                entidad,
                entidad_id,
                expediente_id,
                seguimiento_id,
                descripcion,
                detalles,
                ip_address,
                user_agent
            )
            VALUES (
                :usuario_id,
                :usuario_nombre,
                :usuario_login,
                :rol,
                :delegacion_id,
                :modulo,
                :accion,
                :entidad,
                :entidad_id,
                :expediente_id,
                :seguimiento_id,
                :descripcion,
                :detalles::jsonb,
                :ip_address,
                :user_agent
            )
        ');

        $stmt->execute([
            'usuario_id' => isset($user['id']) ? (int) $user['id'] : null,
            'usuario_nombre' => (string) (($event['usuario_nombre'] ?? null)
                ?? ($user['nombreCompleto'] ?? $user['nombre_completo'] ?? $user['usuario'] ?? 'SISTEMA')),
            'usuario_login' => (string) (($event['usuario_login'] ?? null)
                ?? ($user['usuario'] ?? 'sistema')),
            'rol' => (string) (($event['rol'] ?? null)
                ?? ($user['rol'] ?? 'sistema')),
            'delegacion_id' => array_key_exists('delegacion_id', $event)
                ? ($event['delegacion_id'] !== null ? (int) $event['delegacion_id'] : null)
                : getUserDelegacionId($user ?? []),
            'modulo' => (string) ($event['modulo'] ?? 'GENERAL'),
            'accion' => (string) ($event['accion'] ?? 'DESCONOCIDA'),
            'entidad' => (string) ($event['entidad'] ?? 'SISTEMA'),
            'entidad_id' => array_key_exists('entidad_id', $event) && $event['entidad_id'] !== null
                ? (int) $event['entidad_id']
                : null,
            'expediente_id' => array_key_exists('expediente_id', $event) && $event['expediente_id'] !== null
                ? (int) $event['expediente_id']
                : null,
            'seguimiento_id' => array_key_exists('seguimiento_id', $event) && $event['seguimiento_id'] !== null
                ? (int) $event['seguimiento_id']
                : null,
            'descripcion' => (string) ($event['descripcion'] ?? 'Movimiento registrado'),
            'detalles' => json_encode($event['detalles'] ?? [], JSON_UNESCAPED_UNICODE),
            'ip_address' => (string) (($event['ip_address'] ?? null) ?? getRequestIpAddress()),
            'user_agent' => (string) (($event['user_agent'] ?? null) ?? getRequestUserAgent()),
        ]);
    } catch (Throwable $exception) {
        error_log('[AplicativoLocal][AUDITORIA] ' . $exception->getMessage());
    }
}

function syncActiveSessionToken(PDO $pdo, int $userId, ?string $sessionToken): void
{
    $stmt = $pdo->prepare('
        UPDATE usuarios
        SET
            sesion_token_activa = :sesion_token_activa,
            sesion_actualizada_at = NOW()
        WHERE id = :id
    ');

    $stmt->execute([
        'id' => $userId,
        'sesion_token_activa' => $sessionToken,
    ]);
}

function clearActiveSessionTokenIfMatches(PDO $pdo, int $userId, ?string $sessionToken): void
{
    if ($sessionToken === null || $sessionToken === '') {
        return;
    }

    $stmt = $pdo->prepare('
        UPDATE usuarios
        SET
            sesion_token_activa = NULL,
            sesion_actualizada_at = NOW()
        WHERE id = :id
          AND sesion_token_activa = :sesion_token_activa
    ');

    $stmt->execute([
        'id' => $userId,
        'sesion_token_activa' => $sessionToken,
    ]);
}

function normalizeAuditChangeValue(mixed $value, bool $decodeJson = false): mixed
{
    if ($value === '') {
        return null;
    }

    if ($decodeJson && is_string($value)) {
        $trimmed = trim($value);
        if ($trimmed !== '' && ($trimmed[0] === '[' || $trimmed[0] === '{')) {
            $decoded = json_decode($trimmed, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $value = $decoded;
            }
        }
    }

    if (is_array($value)) {
        $normalized = [];
        foreach ($value as $key => $item) {
            $normalized[$key] = normalizeAuditChangeValue($item, false);
        }

        if (array_is_list($normalized)) {
            usort($normalized, static function ($left, $right): int {
                return strcmp(
                    json_encode($left, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: '',
                    json_encode($right, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?: ''
                );
            });
        } else {
            ksort($normalized);
        }

        return $normalized;
    }

    if (is_bool($value) || $value === null) {
        return $value;
    }

    if (is_int($value) || is_float($value)) {
        return $value;
    }

    return is_string($value) ? trim($value) : $value;
}

function buildAuditFieldChanges(array $before, array $after, array $fieldLabels, array $jsonFields = []): array
{
    $changes = [];

    foreach ($fieldLabels as $field => $label) {
        $beforeValue = array_key_exists($field, $before) ? normalizeAuditChangeValue($before[$field], in_array($field, $jsonFields, true)) : null;
        $afterValue = array_key_exists($field, $after) ? normalizeAuditChangeValue($after[$field], in_array($field, $jsonFields, true)) : null;

        if (json_encode($beforeValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) === json_encode($afterValue, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)) {
            continue;
        }

        $changes[$field] = [
            'etiqueta' => $label,
            'antes' => $beforeValue,
            'despues' => $afterValue,
        ];
    }

    return $changes;
}
