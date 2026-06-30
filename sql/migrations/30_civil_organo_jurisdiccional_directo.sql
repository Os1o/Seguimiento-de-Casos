-- =====================================================
-- CIVIL: usar organo_jurisdiccional_id directo
-- Quita a tribunales de la ecuacion operativa de civil.
-- =====================================================

BEGIN;

ALTER TABLE expedientes_civil
    ADD COLUMN IF NOT EXISTS organo_jurisdiccional_id INT NULL REFERENCES organos_jurisdiccionales(id);

UPDATE expedientes_civil ec
SET organo_jurisdiccional_id = t.organo_jurisdiccional_id
FROM tribunales t
WHERE ec.tribunal_id = t.id
  AND t.organo_jurisdiccional_id IS NOT NULL
  AND ec.organo_jurisdiccional_id IS NULL;

CREATE INDEX IF NOT EXISTS ix_expedientes_civil_organo_jurisdiccional
    ON expedientes_civil(organo_jurisdiccional_id);

COMMIT;

-- Validacion sugerida despues de correrlo:
-- SELECT id, numero_expediente
-- FROM expedientes_civil
-- WHERE activo = TRUE
--   AND organo_jurisdiccional_id IS NULL;
