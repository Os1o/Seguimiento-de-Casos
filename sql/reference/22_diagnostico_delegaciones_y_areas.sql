-- Diagnostico puntual de delegaciones contra areas generadoras.
-- No borra nada.

-- 1) Delegaciones que SI tienen al menos un area generadora
SELECT
    d.id,
    d.nombre,
    d.estado,
    COUNT(a.id) AS total_areas
FROM delegaciones d
INNER JOIN areas a
    ON a.delegacion_id = d.id
GROUP BY d.id, d.nombre, d.estado
ORDER BY d.id;

-- 2) Delegaciones que NO tienen ninguna area generadora
SELECT
    d.id,
    d.nombre,
    d.estado
FROM delegaciones d
LEFT JOIN areas a
    ON a.delegacion_id = d.id
WHERE a.id IS NULL
ORDER BY d.id;

-- 3) Areas generadoras huerfanas o fuera de match esperado
-- Sirve para detectar si hubiera un problema de integridad.
SELECT
    a.id,
    a.delegacion_id,
    a.nombre
FROM areas a
LEFT JOIN delegaciones d
    ON d.id = a.delegacion_id
WHERE d.id IS NULL
ORDER BY a.id;
