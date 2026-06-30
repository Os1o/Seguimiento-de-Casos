-- =====================================================
-- DEMO CIVIL MULTIDELEGACION
-- Crea 12 expedientes civiles falsos para demostracion.
-- - Reejecutable
-- - Solo limpia registros con prefijo DEMO-CIV-
-- - Deja expedientes de distintas delegaciones
-- - Incluye algunos ya acumulados y otros listos para acumular
-- =====================================================

BEGIN;

-- -----------------------------------------------------
-- Limpieza segura de demos previas
-- -----------------------------------------------------
DELETE FROM expedientes_civil
WHERE numero_expediente LIKE 'DEMO-CIV-%';

-- -----------------------------------------------------
-- Validaciones minimas
-- -----------------------------------------------------
DO $$
DECLARE
    v_total_delegaciones INT;
    v_total_prestaciones INT;
BEGIN
    SELECT COUNT(*)
    INTO v_total_delegaciones
    FROM (
        SELECT d.id
        FROM delegaciones d
        WHERE COALESCE(d.activo, TRUE) = TRUE
          AND EXISTS (
              SELECT 1
              FROM areas a
              WHERE a.delegacion_id = d.id
          )
          AND EXISTS (
              SELECT 1
              FROM organos_jurisdiccionales_delegaciones ojd
              INNER JOIN organos_jurisdiccionales oj
                  ON oj.id = ojd.organo_jurisdiccional_id
              WHERE ojd.delegacion_id = d.id
                AND oj.modulo = 'CIVIL'
                AND oj.activo = TRUE
          )
    ) x;

    IF v_total_delegaciones < 7 THEN
        RAISE EXCEPTION 'Se requieren al menos 7 delegaciones activas con area y tribunal para cargar la demo civil. Encontradas: %', v_total_delegaciones;
    END IF;

    SELECT COUNT(*)
    INTO v_total_prestaciones
    FROM prestaciones;

    IF v_total_prestaciones = 0 THEN
        RAISE EXCEPTION 'No existen prestaciones en el catalogo.';
    END IF;
END $$;

-- -----------------------------------------------------
-- Contexto base
-- -----------------------------------------------------
CREATE TEMP TABLE tmp_demo_delegaciones AS
WITH delegaciones_elegibles AS (
    SELECT
        d.id AS delegacion_id,
        ROW_NUMBER() OVER (ORDER BY d.id) AS rn
    FROM delegaciones d
    WHERE COALESCE(d.activo, TRUE) = TRUE
      AND EXISTS (
          SELECT 1
          FROM areas a
          WHERE a.delegacion_id = d.id
      )
      AND EXISTS (
          SELECT 1
          FROM organos_jurisdiccionales_delegaciones ojd
          INNER JOIN organos_jurisdiccionales oj
              ON oj.id = ojd.organo_jurisdiccional_id
          WHERE ojd.delegacion_id = d.id
            AND oj.modulo = 'CIVIL'
            AND oj.activo = TRUE
      )
)
SELECT
    rn,
    delegacion_id,
    (
        SELECT a.id
        FROM areas a
        WHERE a.delegacion_id = de.delegacion_id
        ORDER BY a.id
        LIMIT 1
    ) AS area_id,
    (
        SELECT oj.id
        FROM organos_jurisdiccionales_delegaciones ojd
        INNER JOIN organos_jurisdiccionales oj
            ON oj.id = ojd.organo_jurisdiccional_id
        WHERE ojd.delegacion_id = de.delegacion_id
          AND oj.modulo = 'CIVIL'
          AND oj.activo = TRUE
        ORDER BY oj.id
        LIMIT 1
    ) AS organo_jurisdiccional_id
FROM delegaciones_elegibles de
WHERE rn <= 7;

CREATE TEMP TABLE tmp_demo_prestaciones AS
SELECT
    ROW_NUMBER() OVER (ORDER BY id) AS rn,
    id AS prestacion_id
FROM prestaciones
ORDER BY id
LIMIT 4;

CREATE TEMP TABLE tmp_demo_specs (
    slot INT PRIMARY KEY,
    deleg_rn INT NOT NULL,
    codigo TEXT NOT NULL,
    jurisdiccion TEXT NOT NULL,
    tipo_juicio TEXT NOT NULL,
    subtipo_juicio TEXT,
    sub_subtipo_juicio TEXT,
    numero_juicio TEXT,
    anio TEXT,
    fecha_inicio DATE NOT NULL,
    imss_es TEXT NOT NULL,
    actor JSONB,
    demandados JSONB,
    codemandados JSONB,
    prestacion_rn INT NOT NULL,
    prestaciones_secundarias JSONB NOT NULL DEFAULT '[]'::jsonb,
    prestaciones_notas TEXT,
    importe_demandado NUMERIC(15,2),
    pronostico TEXT,
    estatus_inicial TEXT,
    fecha_vencimiento DATE
);

INSERT INTO tmp_demo_specs (
    slot, deleg_rn, codigo, jurisdiccion, tipo_juicio, subtipo_juicio, sub_subtipo_juicio,
    numero_juicio, anio, fecha_inicio, imss_es, actor, demandados, codemandados,
    prestacion_rn, prestaciones_secundarias, prestaciones_notas, importe_demandado,
    pronostico, estatus_inicial, fecha_vencimiento
) VALUES
(1, 1, 'DEMO-CIV-2026-001', 'LOCAL',   'CIVIL',     'Ordinario Civil',      'Oral',     NULL,       NULL,   DATE '2026-01-08', 'DEMANDADO',
 '[{"tipo_persona":"FISICA","nombres":"MARIA","apellido_paterno":"SOLIS","apellido_materno":"VEGA"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"CLINICA DEL NORTE SC"}]'::jsonb,
 '[]'::jsonb,
 1, '[]'::jsonb, 'Asunto demo padre con un expediente ya acumulado y otro disponible para acumular.', 185000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-07-10'),

(2, 1, 'DEMO-CIV-2026-002', 'LOCAL',   'CIVIL',     'Ordinario Civil',      'Oral',     NULL,       NULL,   DATE '2026-01-10', 'DEMANDADO',
 '[{"tipo_persona":"FISICA","nombres":"JORGE","apellido_paterno":"MORA","apellido_materno":"RIVAS"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"SERVICIOS MEDICOS DEL CENTRO SA DE CV"}]'::jsonb,
 '[]'::jsonb,
 2, '[]'::jsonb, 'Asunto demo hijo ya acumulado al expediente 001.', 98000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-07-12'),

(3, 1, 'DEMO-CIV-2026-003', 'LOCAL',   'MERCANTIL', 'Ordinario Mercantil',  'Escrito',  NULL,       NULL,   DATE '2026-01-12', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"DISTRIBUIDORA HOSPITALARIA DEL BAJIO SA DE CV"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"AVALES DEL CENTRO SA DE CV"}]'::jsonb,
 3, '[]'::jsonb, 'Asunto demo disponible para acumular manualmente al expediente 001 si asi lo deseas.', 342000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-07-15'),

(4, 2, 'DEMO-CIV-2026-004', 'FEDERAL', 'CIVIL',     'Ordinario Civil',      'Escrito',  '204/2026', '2026', DATE '2026-01-16', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"FISICA","nombres":"ROBERTO","apellido_paterno":"TORRES","apellido_materno":"PEREZ"}]'::jsonb,
 '[]'::jsonb,
 1, '[]'::jsonb, 'Expediente demo padre en otra delegacion.', 265000.00,
 'SIN PRONOSTICO', 'TRAMITE', DATE '2026-07-18'),

(5, 2, 'DEMO-CIV-2026-005', 'FEDERAL', 'CIVIL',     'Ordinario Civil',      'Escrito',  '205/2026', '2026', DATE '2026-01-18', 'TERCERO',
 '[{"tipo_persona":"MORAL","empresa":"ASEGURADORA REGIONAL DEL SUR SA DE CV"}]'::jsonb,
 '[{"tipo_persona":"FISICA","nombres":"LUIS","apellido_paterno":"TENORIO","apellido_materno":"CAMPOS"}]'::jsonb,
 '[]'::jsonb,
 2, '[]'::jsonb, 'Expediente demo hijo ya acumulado al expediente 004.', 76000.00,
 'DESFAVORABLE', 'TRAMITE', DATE '2026-07-20'),

(6, 2, 'DEMO-CIV-2026-006', 'LOCAL',   'CIVIL',     'Arrendamiento',        NULL,       NULL,       NULL,   DATE '2026-01-21', 'DEMANDADO',
 '[{"tipo_persona":"MORAL","empresa":"OPERADORA DE INMUEBLES DEL BAJIO"}]'::jsonb,
 '[{"tipo_persona":"FISICA","nombres":"HECTOR","apellido_paterno":"SALGADO","apellido_materno":"LOPEZ"}]'::jsonb,
 '[]'::jsonb,
 4, '[]'::jsonb, 'Expediente demo listo para acumularse manualmente al expediente 004.', 112500.00,
 'SIN PRONOSTICO', 'TRAMITE', DATE '2026-07-24'),

(7, 3, 'DEMO-CIV-2026-007', 'LOCAL',   'MERCANTIL', 'Ordinario Mercantil',  'Escrito',  NULL,       NULL,   DATE '2026-01-25', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"PROVEEDORA MEDICA DEL GOLFO SA DE CV"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"FIANZAS UNIDAS SA DE CV"}]'::jsonb,
 3, '[]'::jsonb, 'Expediente demo padre en una tercera delegacion.', 590000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-07-27'),

(8, 3, 'DEMO-CIV-2026-008', 'LOCAL',   'MERCANTIL', 'Especiales',           'Fianzas',  NULL,       NULL,   DATE '2026-01-27', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"AFIANZADORA CORPORATIVA MEXICANA SA DE CV"}]'::jsonb,
 '[]'::jsonb,
 2, '[]'::jsonb, 'Expediente demo hijo ya acumulado al expediente 007.', 870000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-07-30'),

(9, 4, 'DEMO-CIV-2026-009', 'LOCAL',   'CIVIL',     'Usucapion',            NULL,       NULL,       NULL,   DATE '2026-02-02', 'DEMANDADO',
 '[{"tipo_persona":"FISICA","nombres":"AURELIA","apellido_paterno":"RAMOS","apellido_materno":"DIAZ"}]'::jsonb,
 '[{"tipo_persona":"FISICA","nombres":"RAUL","apellido_paterno":"ESPINOZA","apellido_materno":"LEON"}]'::jsonb,
 '[]'::jsonb,
 1, '[]'::jsonb, 'Expediente demo independiente para mostrar variedad de estatus y delegacion.', 0.00,
 'DESFAVORABLE', 'TRAMITE', DATE '2026-08-04'),

(10, 5, 'DEMO-CIV-2026-010', 'FEDERAL', 'MERCANTIL', 'Concursos Mercantiles', NULL,      '310/2026', '2026', DATE '2026-02-05', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"CONSTRUCTORA DEL ORIENTE SA DE CV"}]'::jsonb,
 '[]'::jsonb,
 4, '[]'::jsonb, 'Expediente demo federal mercantil para que el dashboard se vea mas completo.', 1450000.00,
 'FAVORABLE', 'TRAMITE', DATE '2026-08-06'),

(11, 6, 'DEMO-CIV-2026-011', 'LOCAL',   'CIVIL',     'Especial Hipotecario', NULL,       NULL,       NULL,   DATE '2026-02-09', 'DEMANDADO',
 '[{"tipo_persona":"FISICA","nombres":"ROSA","apellido_paterno":"CARRILLO","apellido_materno":"VEGA"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"FINANCIERA HIPOTECARIA DEL NORTE SA DE CV"}]'::jsonb,
 '[]'::jsonb,
 2, '[]'::jsonb, 'Expediente demo independiente con importe cero para mostrar defensa hipotecaria.', 0.00,
 'DESFAVORABLE', 'TRAMITE', DATE '2026-08-10'),

(12, 7, 'DEMO-CIV-2026-012', 'LOCAL',   'CIVIL',     'Ordinario Civil',      'Oral',     NULL,       NULL,   DATE '2026-02-12', 'ACTOR',
 '[]'::jsonb,
 '[{"tipo_persona":"FISICA","nombres":"PABLO","apellido_paterno":"AGUILAR","apellido_materno":"SOTO"}]'::jsonb,
 '[{"tipo_persona":"MORAL","empresa":"RESPONSABILIDAD SOLIDARIA DEL CENTRO SA"}]'::jsonb,
 3, '[]'::jsonb, 'Expediente demo independiente para cerrar la muestra con otra delegacion.', 214500.00,
 'SIN PRONOSTICO', 'TRAMITE', DATE '2026-08-14');

CREATE TEMP TABLE tmp_demo_inserted (
    codigo TEXT PRIMARY KEY,
    expediente_id INT NOT NULL
);

WITH base_numero AS (
    SELECT COALESCE(MAX(numero), 0) AS max_numero
    FROM expedientes_civil
),
insertados AS (
    INSERT INTO expedientes_civil (
        numero,
        delegacion_id,
        area_generadora_id,
        jurisdiccion,
        tipo_juicio,
        subtipo_juicio,
        sub_subtipo_juicio,
        numero_juicio,
        anio,
        numero_expediente,
        organo_jurisdiccional_id,
        fecha_inicio,
        imss_es,
        actor,
        demandados,
        codemandados,
        prestacion_principal,
        prestaciones_secundarias,
        prestaciones_notas,
        importe_demandado,
        pronostico,
        estatus,
        fecha_creacion,
        fecha_actualizacion,
        fecha_vencimiento,
        activo
    )
    SELECT
        b.max_numero + s.slot,
        d.delegacion_id,
        d.area_id,
        s.jurisdiccion,
        s.tipo_juicio,
        s.subtipo_juicio,
        s.sub_subtipo_juicio,
        s.numero_juicio,
        s.anio,
        s.codigo,
        d.organo_jurisdiccional_id,
        s.fecha_inicio,
        s.imss_es,
        s.actor,
        s.demandados,
        s.codemandados,
        COALESCE(p.prestacion_id, (SELECT prestacion_id FROM tmp_demo_prestaciones ORDER BY rn LIMIT 1)),
        s.prestaciones_secundarias,
        s.prestaciones_notas,
        s.importe_demandado,
        s.pronostico,
        s.estatus_inicial,
        (s.fecha_inicio::timestamp + TIME '09:00')::timestamptz,
        (s.fecha_inicio::timestamp + TIME '12:00')::timestamptz,
        s.fecha_vencimiento,
        TRUE
    FROM tmp_demo_specs s
    INNER JOIN tmp_demo_delegaciones d
        ON d.rn = s.deleg_rn
    CROSS JOIN base_numero b
    LEFT JOIN tmp_demo_prestaciones p
        ON p.rn = s.prestacion_rn
    RETURNING id, numero_expediente
)
INSERT INTO tmp_demo_inserted (codigo, expediente_id)
SELECT numero_expediente, id
FROM insertados;

INSERT INTO seguimiento_civil (
    expediente_id,
    fecha_actuacion,
    tipo_actuacion,
    descripcion,
    actualizado_siij,
    activo
)
SELECT
    i.expediente_id,
    x.fecha_actuacion,
    x.tipo_actuacion,
    x.descripcion,
    x.actualizado_siij,
    TRUE
FROM (
    VALUES
        ('DEMO-CIV-2026-001', DATE '2026-02-14', 'Audiencia',   'Se celebro audiencia preliminar y se admitieron documentales de ambas partes.', 'SI'),
        ('DEMO-CIV-2026-002', DATE '2026-02-18', 'Acuerdo',     'Se tuvo por relacionado este asunto para fines de acumulacion demo.', 'NO'),
        ('DEMO-CIV-2026-003', DATE '2026-02-20', 'Promocion',   'Se presento escrito inicial para cobro de facturas y costas.', 'NO'),
        ('DEMO-CIV-2026-004', DATE '2026-02-24', 'Contestacion','Se dio contestacion y se reservo fecha para audiencia constitucional.', 'SI'),
        ('DEMO-CIV-2026-005', DATE '2026-02-26', 'Acuerdo',     'Se agrego al expediente principal para la demostracion de acumulados.', 'NO'),
        ('DEMO-CIV-2026-006', DATE '2026-02-28', 'Notificacion','Se notifico emplazamiento y se dejo constancia de requerimiento.', 'SI'),
        ('DEMO-CIV-2026-007', DATE '2026-03-03', 'Demanda',     'Se ratifico demanda mercantil y se pidio requerimiento de pago.', 'SI'),
        ('DEMO-CIV-2026-008', DATE '2026-03-05', 'Acuerdo',     'Se relaciono como hijo demo para mostrar acumulacion activa.', 'NO'),
        ('DEMO-CIV-2026-009', DATE '2026-03-06', 'Pruebas',     'Se ofrecieron documentales, testimonial e inspeccion judicial.', 'NO'),
        ('DEMO-CIV-2026-010', DATE '2026-03-09', 'Promocion',   'Se presento credito a reconocer dentro del concurso mercantil.', 'SI'),
        ('DEMO-CIV-2026-011', DATE '2026-03-11', 'Audiencia',   'Se fijo fecha para audiencia de pruebas y alegatos.', 'NO'),
        ('DEMO-CIV-2026-012', DATE '2026-03-13', 'Pericial',    'Se admitio pericial contable y grafoscopica para reforzar la accion.', 'NO')
) AS x(codigo, fecha_actuacion, tipo_actuacion, descripcion, actualizado_siij)
INNER JOIN tmp_demo_inserted i
    ON i.codigo = x.codigo;

INSERT INTO acumulados_civil (
    caso_padre_id,
    caso_hijo_id,
    activo
)
SELECT
    p.expediente_id,
    h.expediente_id,
    TRUE
FROM (
    VALUES
        ('DEMO-CIV-2026-001', 'DEMO-CIV-2026-002'),
        ('DEMO-CIV-2026-004', 'DEMO-CIV-2026-005'),
        ('DEMO-CIV-2026-007', 'DEMO-CIV-2026-008')
) AS rel(codigo_padre, codigo_hijo)
INNER JOIN tmp_demo_inserted p
    ON p.codigo = rel.codigo_padre
INNER JOIN tmp_demo_inserted h
    ON h.codigo = rel.codigo_hijo;

UPDATE expedientes_civil
SET
    estatus = 'CONCLUIDO',
    fecha_actualizacion = NOW()
WHERE numero_expediente IN (
    'DEMO-CIV-2026-002',
    'DEMO-CIV-2026-005',
    'DEMO-CIV-2026-008'
);

COMMIT;

-- -----------------------------------------------------
-- Referencia rapida para la demo
-- DEMO-CIV-2026-001 acumula a DEMO-CIV-2026-002
-- DEMO-CIV-2026-004 acumula a DEMO-CIV-2026-005
-- DEMO-CIV-2026-007 acumula a DEMO-CIV-2026-008
--
-- Para acumular manualmente en la demo:
-- DEMO-CIV-2026-003 puede acumularse a DEMO-CIV-2026-001
-- DEMO-CIV-2026-006 puede acumularse a DEMO-CIV-2026-004
-- -----------------------------------------------------
