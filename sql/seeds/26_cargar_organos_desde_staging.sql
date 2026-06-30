-- Transformacion desde staging_organos_jurisdiccionales_excel
-- hacia:
-- 1) organos_jurisdiccionales
-- 2) organos_jurisdiccionales_delegaciones
--
-- Reglas:
-- - solo modulo CIVIL
-- - se ignoran filas sin organo_jurisdiccional
-- - la columna jsj_ooad no se usa por ahora porque en tu archivo viene vacia
-- - el match a delegaciones se hace por circuito
-- - circuitos ambiguos se expanden a varias delegaciones

BEGIN;

INSERT INTO organos_jurisdiccionales (
    nombre,
    circuito,
    tipo,
    materia,
    modulo,
    activo
)
SELECT DISTINCT
    TRIM(organo_jurisdiccional) AS nombre,
    TRIM(circuito) AS circuito,
    NULLIF(TRIM(tipo), '') AS tipo,
    NULLIF(TRIM(materia), '') AS materia,
    'CIVIL' AS modulo,
    TRUE AS activo
FROM staging_organos_jurisdiccionales_excel
WHERE NULLIF(TRIM(organo_jurisdiccional), '') IS NOT NULL
  AND NULLIF(TRIM(circuito), '') IS NOT NULL
ON CONFLICT (modulo, nombre) DO UPDATE
SET
    circuito = EXCLUDED.circuito,
    tipo = EXCLUDED.tipo,
    materia = EXCLUDED.materia,
    activo = TRUE,
    updated_at = NOW();

DELETE FROM organos_jurisdiccionales_delegaciones
WHERE organo_jurisdiccional_id IN (
    SELECT id
    FROM organos_jurisdiccionales
    WHERE modulo = 'CIVIL'
);

INSERT INTO organos_jurisdiccionales_delegaciones (
    organo_jurisdiccional_id,
    delegacion_id
)
SELECT DISTINCT
    oj.id,
    mapa.delegacion_id
FROM organos_jurisdiccionales oj
INNER JOIN (
    SELECT '30° Aguascalientes' AS circuito, 1 AS delegacion_id UNION ALL
    SELECT '15° Baja California', 2 UNION ALL
    SELECT '26° Baja California Sur', 3 UNION ALL
    SELECT '31° Campeche', 4 UNION ALL
    SELECT '8° Coahuila', 5 UNION ALL
    SELECT '32° Colima', 6 UNION ALL
    SELECT '20° Chiapas', 7 UNION ALL
    SELECT '17° Chihuahua', 8 UNION ALL
    SELECT '25° Durango', 10 UNION ALL
    SELECT '16° Guanajuato', 11 UNION ALL
    SELECT '21° Guerrero', 12 UNION ALL
    SELECT '29° Hidalgo', 13 UNION ALL
    SELECT '3° Jalisco', 14 UNION ALL
    SELECT '2° Estado de México', 15 UNION ALL
    SELECT '2° Estado de México', 16 UNION ALL
    SELECT '11° Michoacán', 17 UNION ALL
    SELECT '18° Morelos', 18 UNION ALL
    SELECT '24° Nayarit', 19 UNION ALL
    SELECT '4° Nuevo León', 20 UNION ALL
    SELECT '13° Oaxaca', 21 UNION ALL
    SELECT '6° Puebla', 22 UNION ALL
    SELECT '22° Querétaro', 23 UNION ALL
    SELECT '27° Quintana Roo', 24 UNION ALL
    SELECT '9° San Luis Potosí', 25 UNION ALL
    SELECT '12° Sinaloa', 26 UNION ALL
    SELECT '5° Sonora', 27 UNION ALL
    SELECT '10° Tabasco', 28 UNION ALL
    SELECT '19° Tamaulipas', 29 UNION ALL
    SELECT '28° Tlaxcala', 30 UNION ALL
    SELECT '7° Veracruz', 31 UNION ALL
    SELECT '7° Veracruz', 32 UNION ALL
    SELECT '14° Yucatán', 33 UNION ALL
    SELECT '23° Zacatecas', 34 UNION ALL
    SELECT '1° CDMX', 43 UNION ALL
    SELECT '1° CDMX', 44 UNION ALL
    SELECT '1° CDMX', 45 UNION ALL
    SELECT '1° CDMX', 46
) mapa
    ON mapa.circuito = oj.circuito
WHERE oj.modulo = 'CIVIL'
ON CONFLICT DO NOTHING;

COMMIT;
