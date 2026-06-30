CREATE TABLE IF NOT EXISTS auditoria_eventos (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    usuario_nombre TEXT NOT NULL,
    usuario_login TEXT NULL,
    rol TEXT NULL,
    delegacion_id INTEGER NULL REFERENCES delegaciones(id) ON DELETE SET NULL,
    modulo TEXT NOT NULL,
    accion TEXT NOT NULL,
    entidad TEXT NOT NULL,
    entidad_id INTEGER NULL,
    expediente_id INTEGER NULL,
    seguimiento_id INTEGER NULL,
    descripcion TEXT NOT NULL,
    detalles JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address TEXT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_created_at
    ON auditoria_eventos(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_modulo
    ON auditoria_eventos(modulo);

CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_accion
    ON auditoria_eventos(accion);

CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_usuario_id
    ON auditoria_eventos(usuario_id);

CREATE INDEX IF NOT EXISTS idx_auditoria_eventos_expediente_id
    ON auditoria_eventos(expediente_id);
