-- =====================================================
-- BAJA LOGICA DE ACUMULACIONES CIVILES
-- =====================================================

ALTER TABLE acumulados_civil
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES usuarios(id);

ALTER TABLE acumulados_civil
    DROP CONSTRAINT IF EXISTS acumulados_civil_caso_padre_id_caso_hijo_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS uniq_acumulados_civil_caso_hijo_activo
    ON acumulados_civil(caso_hijo_id)
    WHERE activo = TRUE;

CREATE INDEX IF NOT EXISTS idx_acumulados_civil_padre_activo
    ON acumulados_civil(caso_padre_id, activo);

CREATE INDEX IF NOT EXISTS idx_acumulados_civil_hijo_activo
    ON acumulados_civil(caso_hijo_id, activo);
