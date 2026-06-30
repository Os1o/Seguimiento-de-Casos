-- =====================================================
-- PENAL: seed demo multiooad
-- Inserta 10 asuntos penales demo y varios seguimientos.
-- Deja 4 asuntos en la misma OOAD (CAMPECHE) para pruebas
-- de perfil local por JSJ / delegacion.
-- Reejecutable: limpia solo registros demo.
-- =====================================================

BEGIN;

-- -----------------------------------------------------
-- Limpiar demos previos
-- -----------------------------------------------------
DELETE FROM seguimiento_penal
WHERE expediente_id IN (
    SELECT id
    FROM expedientes_penal
    WHERE dato_relevante LIKE 'DEMO PENAL%'
       OR numero_expediente IN (
            'FED/CAM/CAM/9200001/2026',
            'LOC/CAM/CAM/9200002/2026',
            'FED/CAM/CAM/9200003/2026',
            'LOC/CAM/CAM/9200004/2026',
            'FED/CHS/CHS/9200005/2026',
            'LOC/CHS/CHS/9200006/2026',
            'FED/AGS/AGS/9200007/2026',
            'LOC/AGS/AGS/9200008/2026',
            'FED/DFN/DFN/9200009/2026',
            'LOC/DFN/DFN/9200010/2026'
       )
);

DELETE FROM expedientes_penal
WHERE dato_relevante LIKE 'DEMO PENAL%'
   OR numero_expediente IN (
        'FED/CAM/CAM/9200001/2026',
        'LOC/CAM/CAM/9200002/2026',
        'FED/CAM/CAM/9200003/2026',
        'LOC/CAM/CAM/9200004/2026',
        'FED/CHS/CHS/9200005/2026',
        'LOC/CHS/CHS/9200006/2026',
        'FED/AGS/AGS/9200007/2026',
        'LOC/AGS/AGS/9200008/2026',
        'FED/DFN/DFN/9200009/2026',
        'LOC/DFN/DFN/9200010/2026'
   );

-- -----------------------------------------------------
-- Reacomodar secuencias por si hubo restauraciones
-- o inserts manuales previos
-- -----------------------------------------------------
SELECT setval(
    'public.expedientes_penal_id_seq',
    COALESCE((SELECT MAX(id) FROM expedientes_penal), 1),
    true
);

SELECT setval(
    'public.seguimiento_penal_id_seq',
    COALESCE((SELECT MAX(id) FROM seguimiento_penal), 1),
    true
);

DROP TABLE IF EXISTS tmp_demo_penal_seed;
CREATE TEMP TABLE tmp_demo_penal_seed (
    orden INT PRIMARY KEY,
    delegacion_id INT NOT NULL,
    numero_expediente TEXT NOT NULL,
    fecha_inicio DATE NOT NULL,
    delito_id INT NOT NULL,
    estado_procesal_id INT NOT NULL,
    denunciante JSONB NOT NULL,
    probable_responsable JSONB NOT NULL,
    fecha_conocimiento_amp DATE NULL,
    acciones_pendientes TEXT NULL,
    fecha_judicializacion DATE NULL,
    determinacion_judicial TEXT NULL,
    sentencia TEXT NULL,
    fecha_sentencia DATE NULL,
    fecha_conclusion DATE NULL,
    dato_relevante TEXT NOT NULL,
    estatus TEXT NOT NULL,
    abogado_responsable TEXT NULL
);

INSERT INTO tmp_demo_penal_seed (
    orden,
    delegacion_id,
    numero_expediente,
    fecha_inicio,
    delito_id,
    estado_procesal_id,
    denunciante,
    probable_responsable,
    fecha_conocimiento_amp,
    acciones_pendientes,
    fecha_judicializacion,
    determinacion_judicial,
    sentencia,
    fecha_sentencia,
    fecha_conclusion,
    dato_relevante,
    estatus,
    abogado_responsable
) VALUES
(
    1,
    4,
    'FED/CAM/CAM/9200001/2026',
    DATE '2026-01-08',
    27,
    2,
    '{"tipo_persona":"MORAL","empresa":"OOAD CAMPECHE - COORDINACION DE ABASTO"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"JORGE","apellido_paterno":"MAY","apellido_materno":"MOO"}'::jsonb,
    DATE '2026-01-09',
    'Preparar comparecencia con personal de almacén y ratificación de denuncia.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DEMO PENAL CAM 01 - ROBO DE INSUMOS MEDICOS',
    'TRAMITE',
    'LIC. MARIA DEL CARMEN PUC'
),
(
    2,
    4,
    'LOC/CAM/CAM/9200002/2026',
    DATE '2026-01-12',
    17,
    1,
    '{"tipo_persona":"MORAL","empresa":"OOAD CAMPECHE - JEFATURA DE SERVICIOS JURIDICOS"}'::jsonb,
    '{"tipo_persona":"MORAL","empresa":"PROVEEDORA DEL GOLFO S.A. DE C.V."}'::jsonb,
    DATE '2026-01-13',
    'Solicitar información contable y soporte de facturación al área requirente.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DEMO PENAL CAM 02 - FRAUDE EN CONTRATACION',
    'TRAMITE',
    'LIC. MARIA DEL CARMEN PUC'
),
(
    3,
    4,
    'FED/CAM/CAM/9200003/2026',
    DATE '2026-01-20',
    12,
    3,
    '{"tipo_persona":"MORAL","empresa":"OOAD CAMPECHE - HGR NO. 1"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"OSCAR","apellido_paterno":"PECH","apellido_materno":"TZUC"}'::jsonb,
    DATE '2026-01-21',
    NULL,
    DATE '2026-03-03',
    'AUTO DE VINCULACION A PROCESO',
    'FAVORABLE',
    DATE '2026-04-18',
    DATE '2026-04-18',
    'DEMO PENAL CAM 03 - FALSIFICACION DE DOCUMENTOS CLINICOS',
    'CONCLUIDO',
    'LIC. ANA RIVERO CASTILLO'
),
(
    4,
    4,
    'LOC/CAM/CAM/9200004/2026',
    DATE '2026-02-02',
    1,
    2,
    '{"tipo_persona":"MORAL","empresa":"OOAD CAMPECHE - UMF NO. 2"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"MARIO","apellido_paterno":"CANUL","apellido_materno":"EK"}'::jsonb,
    DATE '2026-02-03',
    'Integrar entrevistas al personal administrativo y resguardo de evidencia.',
    DATE '2026-03-10',
    'VINCULADO A PROCESO',
    NULL,
    NULL,
    NULL,
    'DEMO PENAL CAM 04 - ABUSO DE CONFIANZA EN CAJA',
    'TRAMITE',
    'LIC. ANA RIVERO CASTILLO'
),
(
    5,
    7,
    'FED/CHS/CHS/9200005/2026',
    DATE '2026-01-15',
    30,
    1,
    '{"tipo_persona":"MORAL","empresa":"OOAD CHIAPAS - HOSPITAL GENERAL DE ZONA"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"EDUARDO","apellido_paterno":"LOPEZ","apellido_materno":"HERNANDEZ"}'::jsonb,
    DATE '2026-01-16',
    'Cuantificar faltante de medicamento controlado y obtener videos de vigilancia.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DEMO PENAL CHS 05 - ROBO DE MEDICAMENTO',
    'TRAMITE',
    'LIC. FERNANDO RUIZ DIAZ'
),
(
    6,
    7,
    'LOC/CHS/CHS/9200006/2026',
    DATE '2026-02-05',
    4,
    2,
    '{"tipo_persona":"MORAL","empresa":"OOAD CHIAPAS - COORDINACION DE INFORMATICA"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"ALBERTO","apellido_paterno":"MORALES","apellido_materno":"GOMEZ"}'::jsonb,
    DATE '2026-02-06',
    'Solicitar dictamen técnico sobre extracción de información reservada.',
    DATE '2026-03-01',
    'FORMULACION DE IMPUTACION',
    NULL,
    NULL,
    NULL,
    'DEMO PENAL CHS 06 - REVELACION DE INFORMACION INTERNA',
    'TRAMITE',
    'LIC. FERNANDO RUIZ DIAZ'
),
(
    7,
    1,
    'FED/AGS/AGS/9200007/2026',
    DATE '2026-01-18',
    10,
    1,
    '{"tipo_persona":"MORAL","empresa":"OOAD AGUASCALIENTES - SUBDELEGACION ADMINISTRATIVA"}'::jsonb,
    '{"tipo_persona":"MORAL","empresa":"SERVICIOS DEL CENTRO BAJIO S.A. DE C.V."}'::jsonb,
    DATE '2026-01-19',
    'Revisar documentación contractual y soporte del área de adquisiciones.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DEMO PENAL AGS 07 - DEFRAUDACION POR PROVEEDOR',
    'TRAMITE',
    'LIC. ANA MARTINEZ SOLIS'
),
(
    8,
    1,
    'LOC/AGS/AGS/9200008/2026',
    DATE '2026-02-14',
    7,
    3,
    '{"tipo_persona":"MORAL","empresa":"OOAD AGUASCALIENTES - CONSERVACION"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"DAVID","apellido_paterno":"SALAZAR","apellido_materno":"MEJIA"}'::jsonb,
    DATE '2026-02-15',
    NULL,
    DATE '2026-03-08',
    'SENTENCIA ABSOLUTORIA',
    'DESFAVORABLE',
    DATE '2026-04-25',
    DATE '2026-04-25',
    'DEMO PENAL AGS 08 - DANOS A EQUIPO INSTITUCIONAL',
    'CONCLUIDO',
    'LIC. ANA MARTINEZ SOLIS'
),
(
    9,
    43,
    'FED/DFN/DFN/9200009/2026',
    DATE '2026-01-25',
    16,
    2,
    '{"tipo_persona":"MORAL","empresa":"OOAD D.F. NORTE - ADMINISTRACION CENTRALIZADA"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"RAUL","apellido_paterno":"PEREZ","apellido_materno":"ROJAS"}'::jsonb,
    DATE '2026-01-26',
    'Coordinar mesa de trabajo con contraloría y recabar reportes financieros.',
    DATE '2026-03-12',
    'VINCULADO A PROCESO',
    NULL,
    NULL,
    NULL,
    'DEMO PENAL DFN 09 - USO DE DOCUMENTOS FALSOS',
    'TRAMITE',
    'LIC. RICARDO MONREAL AVILA'
),
(
    10,
    43,
    'LOC/DFN/DFN/9200010/2026',
    DATE '2026-02-11',
    28,
    1,
    '{"tipo_persona":"MORAL","empresa":"OOAD D.F. NORTE - HGR NO. 2"}'::jsonb,
    '{"tipo_persona":"FISICA","nombres":"JOSE","apellido_paterno":"VALLE","apellido_materno":"CRUZ"}'::jsonb,
    DATE '2026-02-12',
    'Solicitar ampliación de entrevistas y resguardo de material videográfico.',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    'DEMO PENAL DFN 10 - ROBO CON VIOLENCIA A PACIENTE',
    'TRAMITE',
    'LIC. RICARDO MONREAL AVILA'
);

DROP TABLE IF EXISTS tmp_demo_penal_insertados;
CREATE TEMP TABLE tmp_demo_penal_insertados AS
WITH base_numero AS (
    SELECT COALESCE(MAX(numero), 0) AS max_numero
    FROM expedientes_penal
),
insertados AS (
    INSERT INTO expedientes_penal (
        numero,
        delegacion_id,
        numero_expediente,
        fecha_inicio,
        delito_id,
        denunciante,
        probable_responsable,
        fecha_conocimiento_amp,
        estado_procesal_id,
        acciones_pendientes,
        fecha_judicializacion,
        determinacion_judicial,
        sentencia,
        fecha_sentencia,
        fecha_conclusion,
        dato_relevante,
        estatus,
        abogado_responsable,
        fecha_creacion,
        fecha_actualizacion,
        activo,
        deleted_at,
        deleted_by
    )
    SELECT
        (SELECT max_numero FROM base_numero) + ROW_NUMBER() OVER (ORDER BY s.orden),
        s.delegacion_id,
        s.numero_expediente,
        s.fecha_inicio,
        s.delito_id,
        s.denunciante,
        s.probable_responsable,
        s.fecha_conocimiento_amp,
        s.estado_procesal_id,
        s.acciones_pendientes,
        s.fecha_judicializacion,
        s.determinacion_judicial,
        s.sentencia,
        s.fecha_sentencia,
        s.fecha_conclusion,
        s.dato_relevante,
        s.estatus,
        s.abogado_responsable,
        NOW(),
        NOW(),
        TRUE,
        NULL,
        NULL
    FROM tmp_demo_penal_seed s
    ORDER BY s.orden
    RETURNING id, numero_expediente
)
SELECT * FROM insertados;

INSERT INTO seguimiento_penal (
    expediente_id,
    fecha_actuacion,
    tipo_actuacion,
    descripcion,
    created_at,
    activo,
    deleted_at,
    deleted_by
)
SELECT i.id, t.fecha_actuacion, t.tipo_actuacion, t.descripcion, NOW(), TRUE, NULL, NULL
FROM tmp_demo_penal_insertados i
JOIN (
    VALUES
        ('FED/CAM/CAM/9200001/2026', DATE '2026-01-09', 'DENUNCIA', 'Se presentó denuncia por faltante de insumos médicos y se abrió carpeta de investigación.'),
        ('FED/CAM/CAM/9200001/2026', DATE '2026-02-03', 'INVESTIGACION', 'Se recabaron entrevistas del personal de almacén y se solicitaron videos de vigilancia.'),
        ('LOC/CAM/CAM/9200002/2026', DATE '2026-01-13', 'QUERELLA', 'Se formalizó querella por probable fraude relacionado con contratación de servicios.'),
        ('LOC/CAM/CAM/9200002/2026', DATE '2026-02-18', 'REQUERIMIENTO', 'Se requirió información contable y soporte documental al área usuaria.'),
        ('FED/CAM/CAM/9200003/2026', DATE '2026-01-21', 'DENUNCIA', 'Se denunció falsificación de documentos clínicos y alteración de registros.'),
        ('FED/CAM/CAM/9200003/2026', DATE '2026-04-18', 'SENTENCIA', 'Se emitió resolución favorable y se tuvo por concluido el asunto.'),
        ('LOC/CAM/CAM/9200004/2026', DATE '2026-02-03', 'DENUNCIA', 'Se presentó denuncia por abuso de confianza en manejo de caja y valores.'),
        ('LOC/CAM/CAM/9200004/2026', DATE '2026-03-10', 'AUDIENCIA', 'Se formuló imputación y se fijó calendario de seguimiento procesal.'),
        ('FED/CHS/CHS/9200005/2026', DATE '2026-01-16', 'DENUNCIA', 'Se denunció robo de medicamento controlado en unidad hospitalaria.'),
        ('FED/CHS/CHS/9200005/2026', DATE '2026-03-05', 'INVESTIGACION', 'Se cuantificó el faltante y se recabaron entrevistas del personal de turno.'),
        ('LOC/CHS/CHS/9200006/2026', DATE '2026-02-06', 'DENUNCIA', 'Se denunció revelación de información interna reservada.'),
        ('LOC/CHS/CHS/9200006/2026', DATE '2026-03-01', 'FORMULACION DE IMPUTACION', 'Se presentó imputación inicial y se agregó dictamen técnico a la carpeta.'),
        ('FED/AGS/AGS/9200007/2026', DATE '2026-01-19', 'QUERELLA', 'Se promovió querella por presunta defraudación cometida por proveedor externo.'),
        ('LOC/AGS/AGS/9200008/2026', DATE '2026-04-25', 'SENTENCIA', 'Se emitió resolución definitiva y se cerró el asunto.'),
        ('FED/DFN/DFN/9200009/2026', DATE '2026-01-26', 'DENUNCIA', 'Se presentó denuncia por uso de documentos falsos ante autoridad.'),
        ('LOC/DFN/DFN/9200010/2026', DATE '2026-02-12', 'DENUNCIA', 'Se presentó denuncia por robo con violencia en área de atención.')
) AS t(numero_expediente, fecha_actuacion, tipo_actuacion, descripcion)
    ON t.numero_expediente = i.numero_expediente;

COMMIT;

-- Validaciones sugeridas:
-- 1) Conteo total de demos:
-- SELECT COUNT(*) FROM expedientes_penal WHERE dato_relevante LIKE 'DEMO PENAL%';
--
-- 2) Casos por OOAD / delegacion demo:
-- SELECT delegacion_id, COUNT(*)
-- FROM expedientes_penal
-- WHERE dato_relevante LIKE 'DEMO PENAL%'
-- GROUP BY delegacion_id
-- ORDER BY delegacion_id;
--
-- 3) La OOAD de CAMPECHE debe quedar con 4 casos:
-- SELECT id, numero_expediente, estatus
-- FROM expedientes_penal
-- WHERE delegacion_id = 4
--   AND dato_relevante LIKE 'DEMO PENAL%'
-- ORDER BY id;
