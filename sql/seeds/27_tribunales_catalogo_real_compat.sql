-- Capa de compatibilidad para que la app civil siga usando tribunal_id
-- mientras el catalogo real se administra desde organos_jurisdiccionales.

ALTER TABLE tribunales
    ADD COLUMN IF NOT EXISTS organo_jurisdiccional_id INT NULL REFERENCES organos_jurisdiccionales(id),
    ADD COLUMN IF NOT EXISTS circuito TEXT NULL,
    ADD COLUMN IF NOT EXISTS tipo TEXT NULL,
    ADD COLUMN IF NOT EXISTS materia TEXT NULL,
    ADD COLUMN IF NOT EXISTS activo BOOLEAN NOT NULL DEFAULT TRUE;

CREATE INDEX IF NOT EXISTS ix_tribunales_delegacion_activo
ON tribunales (delegacion_id, activo);

CREATE INDEX IF NOT EXISTS ix_tribunales_organo
ON tribunales (organo_jurisdiccional_id);

CREATE UNIQUE INDEX IF NOT EXISTS ux_tribunales_organo_delegacion
ON tribunales (organo_jurisdiccional_id, delegacion_id)
WHERE organo_jurisdiccional_id IS NOT NULL;
