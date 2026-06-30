ALTER TABLE usuarios
    ADD COLUMN IF NOT EXISTS es_abogado BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS es_jefe BOOLEAN DEFAULT FALSE;

ALTER TABLE expedientes_civil
    ADD COLUMN IF NOT EXISTS abogado_responsable_id INT REFERENCES usuarios(id);

ALTER TABLE expedientes_civil
    DROP COLUMN IF EXISTS abogado_responsable;
