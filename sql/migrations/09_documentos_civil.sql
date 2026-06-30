CREATE TABLE IF NOT EXISTS documentos_civil (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER NOT NULL REFERENCES expedientes_civil(id) ON DELETE CASCADE,
    nombre_original TEXT NOT NULL,
    nombre_guardado TEXT NOT NULL,
    ruta_archivo TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    tamano_bytes INTEGER NOT NULL,
    usuario_id INTEGER NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_civil_expediente_id
    ON documentos_civil(expediente_id);
