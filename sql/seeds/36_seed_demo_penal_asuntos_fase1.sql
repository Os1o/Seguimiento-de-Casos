-- =====================================================
-- DEMO PENAL NUEVO MODELO: asuntos fase 1
-- Inserta exactamente 10 asuntos penales demo en penal_asuntos.
-- - Reejecutable: limpia solo registros demo de este seed.
-- - Exactamente 3 registros quedan en Michoacan.
-- - No inserta AMP, actuaciones, requerimientos, seguimiento interno
--   ni contestaciones.
-- - Fechas y folios pertenecen al ejercicio 2026.
-- =====================================================

BEGIN;

-- -----------------------------------------------------
-- Limpieza segura de demos previos de este seed
-- -----------------------------------------------------
DELETE FROM penal_asuntos
WHERE dato_relevante LIKE 'DEMO PENAL FASE 1%'
   OR numero_carpeta IN (
        'FED/MIC/MIC/9300001/2026',
        'LOC/MIC/MIC/9300002/2026',
        'FED/MIC/MIC/9300003/2026',
        'LOC/CAM/CAM/9300004/2026',
        'FED/CHS/CHS/9300005/2026',
        'LOC/AGS/AGS/9300006/2026',
        'FED/JAL/JAL/9300007/2026',
        'LOC/NLE/NLE/9300008/2026',
        'FED/PUE/PUE/9300009/2026',
        'LOC/YUC/YUC/9300010/2026'
   );

-- -----------------------------------------------------
-- Validaciones de catalogos requeridos
-- -----------------------------------------------------
DO $$
DECLARE
    v_missing_delegaciones text;
    v_missing_areas text;
    v_total_delitos int;
BEGIN
    WITH requeridas(nombre) AS (
        VALUES
            ('MICHOACAN'),
            ('CAMPECHE'),
            ('CHIAPAS'),
            ('AGUASCALIENTES'),
            ('JALISCO'),
            ('NUEVO LEON'),
            ('PUEBLA'),
            ('YUCATAN')
    )
    SELECT string_agg(r.nombre, ', ' ORDER BY r.nombre)
    INTO v_missing_delegaciones
    FROM requeridas r
    WHERE NOT EXISTS (
        SELECT 1
        FROM delegaciones d
        WHERE UPPER(d.nombre) = r.nombre
          AND COALESCE(d.activo, TRUE) = TRUE
    );

    IF v_missing_delegaciones IS NOT NULL THEN
        RAISE EXCEPTION 'Faltan delegaciones activas para seed penal fase 1: %', v_missing_delegaciones;
    END IF;

    WITH requeridas(nombre) AS (
        VALUES
            ('MICHOACAN'),
            ('CAMPECHE'),
            ('CHIAPAS'),
            ('AGUASCALIENTES'),
            ('JALISCO'),
            ('NUEVO LEON'),
            ('PUEBLA'),
            ('YUCATAN')
    )
    SELECT string_agg(r.nombre, ', ' ORDER BY r.nombre)
    INTO v_missing_areas
    FROM requeridas r
    INNER JOIN delegaciones d
        ON UPPER(d.nombre) = r.nombre
       AND COALESCE(d.activo, TRUE) = TRUE
    WHERE NOT EXISTS (
        SELECT 1
        FROM areas a
        WHERE a.delegacion_id = d.id
    );

    IF v_missing_areas IS NOT NULL THEN
        RAISE EXCEPTION 'Faltan areas generadoras para seed penal fase 1: %', v_missing_areas;
    END IF;

    SELECT COUNT(*)
    INTO v_total_delitos
    FROM delitos;

    IF v_total_delitos < 10 THEN
        RAISE EXCEPTION 'Se requieren al menos 10 delitos en catalogo para cargar la demo penal fase 1. Encontrados: %', v_total_delitos;
    END IF;
END $$;

-- -----------------------------------------------------
-- Contexto base
-- -----------------------------------------------------
DROP TABLE IF EXISTS tmp_demo_penal_fase1_specs;
CREATE TEMP TABLE tmp_demo_penal_fase1_specs (
    orden int PRIMARY KEY,
    delegacion_nombre text NOT NULL,
    clave text NOT NULL,
    jurisdiccion text NOT NULL,
    numero text NOT NULL,
    mes int NOT NULL,
    dia int NOT NULL,
    delito_rn int NOT NULL,
    escenario_denunciante text NOT NULL,
    coadyuvancia boolean NOT NULL,
    sin_cuantificar boolean NOT NULL,
    cuantia_monto numeric(14,2),
    denunciante_nombre text NOT NULL,
    denunciante_es_imss boolean NOT NULL,
    denunciante_es_principal boolean NOT NULL,
    denunciante_es_coadyuvante boolean NOT NULL,
    probable_nombre text NOT NULL,
    probable_es_qrr boolean NOT NULL
);

INSERT INTO tmp_demo_penal_fase1_specs (
    orden,
    delegacion_nombre,
    clave,
    jurisdiccion,
    numero,
    mes,
    dia,
    delito_rn,
    escenario_denunciante,
    coadyuvancia,
    sin_cuantificar,
    cuantia_monto,
    denunciante_nombre,
    denunciante_es_imss,
    denunciante_es_principal,
    denunciante_es_coadyuvante,
    probable_nombre,
    probable_es_qrr
) VALUES
    (1, 'MICHOACAN', 'MIC', 'FED', '9300001', 1, 8, 1, 'IMSS', false, true, NULL, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, false, 'QRR', true),
    (2, 'MICHOACAN', 'MIC', 'LOC', '9300002', 2, 12, 2, 'DISTINTO_IMSS', false, false, 18000.00, 'MARIA GUADALUPE RIOS MENDOZA', false, true, false, 'JOSE ALBERTO NUNEZ SOTO', false),
    (3, 'MICHOACAN', 'MIC', 'FED', '9300003', 3, 18, 3, 'COADYUVANCIA', true, true, NULL, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, true, 'QRR', true),
    (4, 'CAMPECHE', 'CAM', 'LOC', '9300004', 1, 22, 4, 'IMSS', false, false, 24500.00, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, false, 'CARLOS EDUARDO PECH CANUL', false),
    (5, 'CHIAPAS', 'CHS', 'FED', '9300005', 2, 6, 5, 'DISTINTO_IMSS', false, true, NULL, 'ANA LUCIA GOMEZ CRUZ', false, true, false, 'QRR', true),
    (6, 'AGUASCALIENTES', 'AGS', 'LOC', '9300006', 3, 4, 6, 'IMSS', false, false, 7200.00, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, false, 'MIGUEL ANGEL REYES LOPEZ', false),
    (7, 'JALISCO', 'JAL', 'FED', '9300007', 4, 9, 7, 'COADYUVANCIA', true, true, NULL, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, true, 'QRR', true),
    (8, 'NUEVO LEON', 'NLE', 'LOC', '9300008', 5, 13, 8, 'DISTINTO_IMSS', false, false, 31500.00, 'ROBERTO SALINAS TREJO', false, true, false, 'FERNANDA LIZETH MARTINEZ ORTIZ', false),
    (9, 'PUEBLA', 'PUE', 'FED', '9300009', 6, 17, 9, 'IMSS', false, true, NULL, 'INSTITUTO MEXICANO DEL SEGURO SOCIAL', true, true, false, 'QRR', true),
    (10, 'YUCATAN', 'YUC', 'LOC', '9300010', 7, 21, 10, 'DISTINTO_IMSS', false, false, 12800.00, 'LUIS ENRIQUE PAT UC', false, true, false, 'JORGE MANUEL CHAN POOT', false);

CREATE TEMP TABLE tmp_demo_penal_fase1_catalogos AS
WITH delitos_ordenados AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS rn
    FROM delitos
),
delegaciones_base AS (
    SELECT
        s.orden,
        d.id AS delegacion_id,
        (
            SELECT a.id
            FROM areas a
            WHERE a.delegacion_id = d.id
            ORDER BY
                CASE
                    WHEN UPPER(a.nombre) LIKE '%JEFATURA DE SERVICIOS JURIDICOS%' THEN 0
                    WHEN UPPER(a.nombre) LIKE '%DEPARTAMENTO CONTENCIOSO%' THEN 1
                    ELSE 2
                END,
                a.id
            LIMIT 1
        ) AS area_id
    FROM tmp_demo_penal_fase1_specs s
    INNER JOIN delegaciones d
        ON UPPER(d.nombre) = s.delegacion_nombre
       AND COALESCE(d.activo, TRUE) = TRUE
)
SELECT
    s.*,
    db.delegacion_id,
    db.area_id,
    doo.id AS delito_id,
    make_date(2026, s.mes, s.dia) AS fecha_presentacion_denuncia,
    s.jurisdiccion || '/' || s.clave || '/' || s.clave || '/' || s.numero || '/2026' AS numero_carpeta
FROM tmp_demo_penal_fase1_specs s
INNER JOIN delegaciones_base db
    ON db.orden = s.orden
INNER JOIN delitos_ordenados doo
    ON doo.rn = s.delito_rn;

-- -----------------------------------------------------
-- Insercion de asuntos penales fase 1
-- -----------------------------------------------------
INSERT INTO penal_asuntos (
    delegacion_id,
    numero_carpeta,
    anio_inicio,
    fecha_presentacion_denuncia,
    delito_id,
    hechos_denunciante,
    sin_cuantificar,
    cuantia_monto,
    area_hechos_id,
    dato_relevante,
    escenario_denunciante,
    coadyuvancia,
    fecha_conocimiento_amp,
    fecha_judicializacion,
    determinacion_judicial,
    estatus_general,
    abogado_responsable_id
)
SELECT
    delegacion_id,
    numero_carpeta,
    2026,
    fecha_presentacion_denuncia,
    delito_id,
    'HECHOS DEMO DEL REGISTRO INICIAL PENAL ' || LPAD(orden::text, 2, '0') || '. CAPTURA DE PRUEBA SIN AMP, ACTUACIONES NI REQUERIMIENTOS.',
    sin_cuantificar,
    CASE WHEN sin_cuantificar THEN NULL ELSE cuantia_monto END,
    area_id,
    'DEMO PENAL FASE 1 - ' || LPAD(orden::text, 2, '0'),
    escenario_denunciante,
    coadyuvancia,
    NULL,
    NULL,
    NULL,
    'TRAMITE',
    NULL
FROM tmp_demo_penal_fase1_catalogos
ORDER BY orden;

CREATE TEMP TABLE tmp_demo_penal_fase1_inserted AS
SELECT
    pa.id AS asunto_id,
    c.*
FROM tmp_demo_penal_fase1_catalogos c
INNER JOIN penal_asuntos pa
    ON pa.numero_carpeta = c.numero_carpeta;

INSERT INTO penal_denunciantes (
    asunto_id,
    nombre,
    es_imss,
    es_principal,
    es_coadyuvante,
    orden
)
SELECT
    asunto_id,
    denunciante_nombre,
    denunciante_es_imss,
    denunciante_es_principal,
    denunciante_es_coadyuvante,
    1
FROM tmp_demo_penal_fase1_inserted
ORDER BY orden;

INSERT INTO penal_probables_responsables (
    asunto_id,
    nombre,
    es_qrr,
    orden
)
SELECT
    asunto_id,
    probable_nombre,
    probable_es_qrr,
    1
FROM tmp_demo_penal_fase1_inserted
ORDER BY orden;

-- -----------------------------------------------------
-- Validaciones finales de consistencia del seed
-- -----------------------------------------------------
DO $$
DECLARE
    v_total int;
    v_michoacan int;
    v_con_amp int;
    v_con_actuaciones int;
    v_con_requerimientos int;
BEGIN
    SELECT COUNT(*)
    INTO v_total
    FROM penal_asuntos
    WHERE dato_relevante LIKE 'DEMO PENAL FASE 1%';

    IF v_total <> 10 THEN
        RAISE EXCEPTION 'El seed penal fase 1 debe dejar exactamente 10 asuntos. Encontrados: %', v_total;
    END IF;

    SELECT COUNT(*)
    INTO v_michoacan
    FROM penal_asuntos pa
    INNER JOIN delegaciones d
        ON d.id = pa.delegacion_id
    WHERE pa.dato_relevante LIKE 'DEMO PENAL FASE 1%'
      AND UPPER(d.nombre) = 'MICHOACAN';

    IF v_michoacan <> 3 THEN
        RAISE EXCEPTION 'El seed penal fase 1 debe dejar exactamente 3 asuntos de Michoacan. Encontrados: %', v_michoacan;
    END IF;

    SELECT COUNT(*)
    INTO v_con_amp
    FROM penal_asuntos pa
    LEFT JOIN penal_conocimiento_amp pca
        ON pca.asunto_id = pa.id
    WHERE pa.dato_relevante LIKE 'DEMO PENAL FASE 1%'
      AND (pa.fecha_conocimiento_amp IS NOT NULL OR pca.id IS NOT NULL);

    IF v_con_amp <> 0 THEN
        RAISE EXCEPTION 'El seed penal fase 1 no debe generar AMP. Encontrados: %', v_con_amp;
    END IF;

    SELECT COUNT(*)
    INTO v_con_actuaciones
    FROM penal_actuaciones act
    INNER JOIN penal_asuntos pa
        ON pa.id = act.asunto_id
    WHERE pa.dato_relevante LIKE 'DEMO PENAL FASE 1%';

    IF v_con_actuaciones <> 0 THEN
        RAISE EXCEPTION 'El seed penal fase 1 no debe generar actuaciones. Encontradas: %', v_con_actuaciones;
    END IF;

    SELECT COUNT(*)
    INTO v_con_requerimientos
    FROM penal_requerimientos pr
    INNER JOIN penal_asuntos pa
        ON pa.id = pr.asunto_id
    WHERE pa.dato_relevante LIKE 'DEMO PENAL FASE 1%';

    IF v_con_requerimientos <> 0 THEN
        RAISE EXCEPTION 'El seed penal fase 1 no debe generar requerimientos. Encontrados: %', v_con_requerimientos;
    END IF;
END $$;

COMMIT;

-- -----------------------------------------------------
-- Referencia rapida
-- Michoacan:
--   FED/MIC/MIC/9300001/2026
--   LOC/MIC/MIC/9300002/2026
--   FED/MIC/MIC/9300003/2026
--
-- Total generado: 10 asuntos en penal_asuntos.
-- Fase 2/Fase 3: sin registros en penal_requerimientos,
-- penal_actuaciones ni penal_conocimiento_amp.
-- -----------------------------------------------------
