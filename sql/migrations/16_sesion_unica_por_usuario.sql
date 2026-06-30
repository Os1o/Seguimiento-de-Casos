-- =====================================================
-- SESION UNICA POR USUARIO
-- =====================================================

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS sesion_token_activa TEXT;

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS sesion_actualizada_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_usuarios_sesion_token_activa
    ON usuarios (sesion_token_activa);
