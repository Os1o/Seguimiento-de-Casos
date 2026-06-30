-- Regla de negocio:
-- No puede existir otro expediente activo con el mismo numero_expediente
-- dentro del mismo modulo.

CREATE UNIQUE INDEX IF NOT EXISTS ux_expedientes_civil_numero_expediente_activo
ON expedientes_civil (numero_expediente)
WHERE activo = TRUE;

CREATE UNIQUE INDEX IF NOT EXISTS ux_expedientes_penal_numero_expediente_activo
ON expedientes_penal (numero_expediente)
WHERE activo = TRUE;
