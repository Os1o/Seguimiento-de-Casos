-- Tabla temporal/permanente de staging para cargar el Excel real
-- antes de pasarlo al catalogo final.
--
-- Columnas basadas en la hoja:
-- CATALOGO CIVIL Y MERCANTIL
--
-- Circuito | JSJ u OOAD | Organo Jurisdiccional | Tipo | Materia
--
-- Nota:
-- La tabla no incluye una columna id para que la carga manual del CSV
-- se haga por posicion sin chocar con importadores visuales.

CREATE TABLE IF NOT EXISTS staging_organos_jurisdiccionales_excel (
    circuito TEXT NULL,
    jsj_ooad TEXT NULL,
    organo_jurisdiccional TEXT NULL,
    tipo TEXT NULL,
    materia TEXT NULL
);

CREATE INDEX IF NOT EXISTS ix_staging_organos_excel_circuito
ON staging_organos_jurisdiccionales_excel (circuito);

CREATE INDEX IF NOT EXISTS ix_staging_organos_excel_organo
ON staging_organos_jurisdiccionales_excel (organo_jurisdiccional);

-- Antes de cada carga nueva del Excel, puedes limpiar:
-- TRUNCATE TABLE staging_organos_jurisdiccionales_excel;
