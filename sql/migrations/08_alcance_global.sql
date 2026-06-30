-- =====================================================
-- ALCANCE GLOBAL DE USUARIOS
-- =====================================================
-- Separa el "rol" del "alcance" del usuario.
-- Roles soportados:
--   - admin
--   - editor
--   - consulta
--
-- Alcance:
--   - alcance_global = true  => puede ver todas las JSJ
--   - alcance_global = false => solo su delegacion_id

ALTER TABLE usuarios
ADD COLUMN IF NOT EXISTS alcance_global boolean NOT NULL DEFAULT false;

-- Admin siempre global
UPDATE usuarios
SET
    alcance_global = true,
    delegacion_id = NULL
WHERE rol = 'admin';

-- Migracion de cualquier "jefe" previo a consulta global
UPDATE usuarios
SET
    rol = 'consulta',
    alcance_global = true,
    delegacion_id = NULL
WHERE rol = 'jefe';

-- Si habia usuarios de consulta sin delegacion, tomarlos como consulta global
UPDATE usuarios
SET alcance_global = true
WHERE rol = 'consulta'
  AND delegacion_id IS NULL;

-- Los editores deben ser locales
UPDATE usuarios
SET alcance_global = false
WHERE rol = 'editor';

SELECT id, usuario, nombre_completo, rol, delegacion_id, alcance_global
FROM usuarios
ORDER BY id;
