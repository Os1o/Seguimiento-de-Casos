-- Nueva tabla para el catalogo real de organos jurisdiccionales.
-- Pensada para civil desde ahora y lista para penal si despues se requiere.

CREATE TABLE IF NOT EXISTS organos_jurisdiccionales (
    id SERIAL PRIMARY KEY,
    nombre TEXT NOT NULL,
    circuito TEXT NOT NULL,
    tipo TEXT NULL,
    materia TEXT NULL,
    modulo TEXT NOT NULL DEFAULT 'CIVIL',
    activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ux_organos_jurisdiccionales_modulo_nombre
ON organos_jurisdiccionales (modulo, nombre);

CREATE INDEX IF NOT EXISTS ix_organos_jurisdiccionales_circuito
ON organos_jurisdiccionales (circuito);

CREATE INDEX IF NOT EXISTS ix_organos_jurisdiccionales_modulo_activo
ON organos_jurisdiccionales (modulo, activo);

-- Relacion flexible organo <-> delegacion.
-- Necesaria porque algunos circuitos deben aplicar a mas de una delegacion
-- (por ejemplo CDMX, Estado de Mexico, Veracruz).
CREATE TABLE IF NOT EXISTS organos_jurisdiccionales_delegaciones (
    organo_jurisdiccional_id INT NOT NULL REFERENCES organos_jurisdiccionales(id) ON DELETE CASCADE,
    delegacion_id INT NOT NULL REFERENCES delegaciones(id) ON DELETE CASCADE,
    PRIMARY KEY (organo_jurisdiccional_id, delegacion_id)
);

CREATE INDEX IF NOT EXISTS ix_organos_jurisdiccionales_delegaciones_delegacion
ON organos_jurisdiccionales_delegaciones (delegacion_id);

-- Civil podra migrar despues de expedientes_civil.tribunal_id a esta tabla.
-- Penal no lo usa todavia en UI, pero ya queda preparado.
