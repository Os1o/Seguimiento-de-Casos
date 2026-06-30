-- Diagnostico previo antes de limpiar o depurar delegaciones.
-- No borra nada. Solo ayuda a identificar:
-- 1) delegaciones con uso real
-- 2) delegaciones sin relacion con areas, usuarios o expedientes
-- 3) casos ambiguos para mapear circuitos del catalogo real

-- Resumen de uso por delegacion
SELECT
    d.id,
    d.nombre,
    d.estado,
    COUNT(DISTINCT a.id) AS total_areas,
    COUNT(DISTINCT u.id) AS total_usuarios,
    COUNT(DISTINCT ec.id) FILTER (WHERE ec.activo = TRUE) AS expedientes_civiles_activos,
    COUNT(DISTINCT ep.id) FILTER (WHERE ep.activo = TRUE) AS expedientes_penales_activos,
    COUNT(DISTINCT ec_all.id) AS expedientes_civiles_totales,
    COUNT(DISTINCT ep_all.id) AS expedientes_penales_totales
FROM delegaciones d
LEFT JOIN areas a
    ON a.delegacion_id = d.id
LEFT JOIN usuarios u
    ON u.delegacion_id = d.id
LEFT JOIN expedientes_civil ec
    ON ec.delegacion_id = d.id
LEFT JOIN expedientes_penal ep
    ON ep.delegacion_id = d.id
LEFT JOIN expedientes_civil ec_all
    ON ec_all.delegacion_id = d.id
LEFT JOIN expedientes_penal ep_all
    ON ep_all.delegacion_id = d.id
GROUP BY d.id, d.nombre, d.estado
ORDER BY d.id;

-- Delegaciones sin uso aparente en areas, usuarios y expedientes
SELECT
    d.id,
    d.nombre,
    d.estado
FROM delegaciones d
LEFT JOIN areas a
    ON a.delegacion_id = d.id
LEFT JOIN usuarios u
    ON u.delegacion_id = d.id
LEFT JOIN expedientes_civil ec
    ON ec.delegacion_id = d.id
LEFT JOIN expedientes_penal ep
    ON ep.delegacion_id = d.id
WHERE a.id IS NULL
  AND u.id IS NULL
  AND ec.id IS NULL
  AND ep.id IS NULL
ORDER BY d.id;

-- Delegaciones actualmente usadas por civil para tribunal / juzgado
SELECT DISTINCT
    d.id,
    d.nombre,
    d.estado
FROM expedientes_civil ec
INNER JOIN delegaciones d
    ON d.id = ec.delegacion_id
ORDER BY d.id;

-- Referencia manual sugerida para circuitos del catalogo real.
-- OJO: estos casos requieren validacion humana antes de importar con delegacion_id.
--
-- 1° CDMX            -> puede corresponder a CDMX NORTE / CDMX SUR / D.F. NORTE / D.F. SUR
-- 2° Estado de México -> puede corresponder a ESTADO MEXICO ORIENTE / ESTADO MEXICO PONIENTE
-- 7° Veracruz        -> puede corresponder a VERACRUZ NORTE / VERACRUZ SUR
--
-- El resto de circuitos parece tener match mas directo por estado.
