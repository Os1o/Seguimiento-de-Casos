-- Sincroniza la tabla legacy tribunales con el catalogo real
-- de organos jurisdiccionales, preservando la compatibilidad
-- con expedientes_civil.tribunal_id.

BEGIN;

WITH source_rows AS (
    SELECT
        oj.id AS organo_jurisdiccional_id,
        oj.nombre,
        oj.circuito,
        oj.tipo,
        oj.materia,
        ojd.delegacion_id
    FROM organos_jurisdiccionales oj
    INNER JOIN organos_jurisdiccionales_delegaciones ojd
        ON ojd.organo_jurisdiccional_id = oj.id
    WHERE oj.modulo = 'CIVIL'
      AND oj.activo = TRUE
)
UPDATE tribunales t
SET
    nombre = src.nombre,
    organo_jurisdiccional_id = src.organo_jurisdiccional_id,
    circuito = src.circuito,
    tipo = src.tipo,
    materia = src.materia,
    activo = TRUE
FROM source_rows src
WHERE t.delegacion_id = src.delegacion_id
  AND UPPER(TRIM(t.nombre)) = UPPER(TRIM(src.nombre));

WITH source_rows AS (
    SELECT
        oj.id AS organo_jurisdiccional_id,
        oj.nombre,
        oj.circuito,
        oj.tipo,
        oj.materia,
        ojd.delegacion_id
    FROM organos_jurisdiccionales oj
    INNER JOIN organos_jurisdiccionales_delegaciones ojd
        ON ojd.organo_jurisdiccional_id = oj.id
    WHERE oj.modulo = 'CIVIL'
      AND oj.activo = TRUE
)
INSERT INTO tribunales (
    nombre,
    delegacion_id,
    organo_jurisdiccional_id,
    circuito,
    tipo,
    materia,
    activo
)
SELECT
    src.nombre,
    src.delegacion_id,
    src.organo_jurisdiccional_id,
    src.circuito,
    src.tipo,
    src.materia,
    TRUE
FROM source_rows src
WHERE NOT EXISTS (
    SELECT 1
    FROM tribunales t
    WHERE t.delegacion_id = src.delegacion_id
      AND (
        t.organo_jurisdiccional_id = src.organo_jurisdiccional_id
        OR UPPER(TRIM(t.nombre)) = UPPER(TRIM(src.nombre))
      )
)
ON CONFLICT DO NOTHING;

WITH source_rows AS (
    SELECT
        oj.id AS organo_jurisdiccional_id,
        ojd.delegacion_id
    FROM organos_jurisdiccionales oj
    INNER JOIN organos_jurisdiccionales_delegaciones ojd
        ON ojd.organo_jurisdiccional_id = oj.id
    WHERE oj.modulo = 'CIVIL'
      AND oj.activo = TRUE
)
UPDATE tribunales t
SET
    activo = FALSE,
    circuito = NULL,
    tipo = NULL,
    materia = NULL,
    organo_jurisdiccional_id = NULL
WHERE t.organo_jurisdiccional_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM source_rows src
      WHERE src.organo_jurisdiccional_id = t.organo_jurisdiccional_id
        AND src.delegacion_id = t.delegacion_id
  );

COMMIT;
