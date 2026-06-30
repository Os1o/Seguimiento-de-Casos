CREATE TABLE IF NOT EXISTS documentos_penal (
    id SERIAL PRIMARY KEY,
    expediente_id INTEGER NOT NULL REFERENCES expedientes_penal(id) ON DELETE CASCADE,
    seguimiento_id INTEGER NULL REFERENCES seguimiento_penal(id) ON DELETE CASCADE,
    nombre_original TEXT NOT NULL,
    nombre_guardado TEXT NOT NULL,
    ruta_archivo TEXT NOT NULL,
    mime_type TEXT NOT NULL DEFAULT 'application/pdf',
    tamano_bytes INTEGER NOT NULL,
    usuario_id INTEGER NULL REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documentos_penal_expediente_id
    ON documentos_penal(expediente_id);

CREATE INDEX IF NOT EXISTS idx_documentos_penal_seguimiento_id
    ON documentos_penal(seguimiento_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_documentos_penal_seguimiento_id
    ON documentos_penal(seguimiento_id)
    WHERE seguimiento_id IS NOT NULL;
