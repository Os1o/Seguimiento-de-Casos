ALTER TABLE documentos_civil
    ADD COLUMN IF NOT EXISTS seguimiento_id INTEGER NULL
    REFERENCES seguimiento_civil(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_documentos_civil_seguimiento_id
    ON documentos_civil(seguimiento_id);

CREATE UNIQUE INDEX IF NOT EXISTS uq_documentos_civil_seguimiento_id
    ON documentos_civil(seguimiento_id)
    WHERE seguimiento_id IS NOT NULL;
