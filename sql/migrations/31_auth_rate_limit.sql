-- =====================================================
-- AUTH: rate limiting para login
-- Controla intentos fallidos por IP y por usuario.
-- =====================================================

BEGIN;

CREATE TABLE IF NOT EXISTS auth_rate_limits (
    id BIGSERIAL PRIMARY KEY,
    scope TEXT NOT NULL CHECK (scope IN ('ip', 'usuario')),
    identifier TEXT NOT NULL,
    attempt_count INT NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
    window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    blocked_until TIMESTAMPTZ NULL,
    last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_auth_rate_limits_scope_identifier UNIQUE (scope, identifier)
);

CREATE INDEX IF NOT EXISTS ix_auth_rate_limits_scope_identifier
    ON auth_rate_limits(scope, identifier);

CREATE INDEX IF NOT EXISTS ix_auth_rate_limits_blocked_until
    ON auth_rate_limits(blocked_until);

COMMIT;

-- Validacion sugerida:
-- SELECT * FROM auth_rate_limits ORDER BY updated_at DESC LIMIT 20;
