-- =====================================================
-- BAJA LOGICA BASE
-- Fase 1: preparar expedientes y seguimientos
-- No cambia comportamiento de la app todavia.
-- =====================================================

-- -----------------------------------------------------
-- EXPEDIENTES CIVIL
-- -----------------------------------------------------
ALTER TABLE expedientes_civil
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES usuarios(id);

CREATE INDEX IF NOT EXISTS idx_expedientes_civil_activo
    ON expedientes_civil(activo);

-- -----------------------------------------------------
-- SEGUIMIENTO CIVIL
-- -----------------------------------------------------
ALTER TABLE seguimiento_civil
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES usuarios(id);

CREATE INDEX IF NOT EXISTS idx_seguimiento_civil_expediente_activo
    ON seguimiento_civil(expediente_id, activo);

-- -----------------------------------------------------
-- EXPEDIENTES PENAL
-- -----------------------------------------------------
ALTER TABLE expedientes_penal
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES usuarios(id);

CREATE INDEX IF NOT EXISTS idx_expedientes_penal_activo
    ON expedientes_penal(activo);

-- -----------------------------------------------------
-- SEGUIMIENTO PENAL
-- -----------------------------------------------------
ALTER TABLE seguimiento_penal
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS deleted_by INT REFERENCES usuarios(id);

CREATE INDEX IF NOT EXISTS idx_seguimiento_penal_expediente_activo
    ON seguimiento_penal(expediente_id, activo);
