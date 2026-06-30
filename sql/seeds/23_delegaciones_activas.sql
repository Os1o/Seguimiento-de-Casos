-- Desactiva delegaciones que no participan en el flujo actual de areas generadoras.
-- No se borran, solo se ocultan de catalogos y modulos.

ALTER TABLE delegaciones
ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;

UPDATE delegaciones
SET activo = FALSE
WHERE id IN (9, 35, 36, 37, 38, 39, 40, 41, 42);

-- Dejar explicitamente activas las demas.
UPDATE delegaciones
SET activo = TRUE
WHERE id NOT IN (9, 35, 36, 37, 38, 39, 40, 41, 42);
