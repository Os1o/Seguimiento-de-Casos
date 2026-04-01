-- =====================================================
-- SEED DUMMY CIVIL / MERCANTIL
-- Ejecutar DESPUES de 01_schema.sql y 02_seed.sql
-- Crea 15 expedientes adicionales de prueba para civil/mercantil
-- =====================================================

INSERT INTO expedientes_civil (
  id, numero, delegacion_id, area_generadora_id, jurisdiccion, tipo_juicio,
  subtipo_juicio, sub_subtipo_juicio, numero_juicio, anio, numero_expediente,
  acumulado_a, tribunal_id, fecha_inicio, imss_es, actor, demandados, codemandados,
  prestacion_principal, prestaciones_secundarias, prestaciones_notas, importe_demandado,
  abogado_responsable, pronostico, estatus, fecha_creacion, fecha_actualizacion, fecha_vencimiento
) VALUES
(101, 101, 1, 1, 'LOCAL', 'CIVIL', 'Ordinario Civil', 'Oral', NULL, NULL, 'CIV-AGS-101/2025',
  NULL, 6, '2025-01-08', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"MARIO","apellido_paterno":"ALVAREZ","apellido_materno":"ROJAS"},{"tipo_persona":"MORAL","empresa":"CLINICA DEL CENTRO SC"}]'::jsonb,
  '[]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"LUIS","apellido_paterno":"MEJIA","apellido_materno":"TORRES"}]'::jsonb,
  1, '[21,27]'::jsonb, 'Reclamacion por danos en inmueble arrendado para consulta externa.', 185000.00,
  'LIC. ANA MARTINEZ SOLIS', 'FAVORABLE', 'TRAMITE', '2025-01-08 09:00:00', '2025-02-14 12:30:00', '2025-04-10'),

(102, 102, 2, 4, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-BC-102/2025',
  NULL, 7, '2025-01-12', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"SUMINISTROS MEDICOS DEL PACIFICO SA DE CV"},{"tipo_persona":"FISICA","nombres":"ELENA","apellido_paterno":"SERRANO","apellido_materno":"MORA"}]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"AFIANZADORA DEL NORTE SA"}]'::jsonb,
  31, '[27,33]'::jsonb, 'Cobro de facturas por adquisicion de bienes y accesorios hospitalarios.', 642500.00,
  'LIC. ADRIANA SOTO MENDOZA', 'FAVORABLE', 'TRAMITE', '2025-01-12 10:15:00', '2025-02-18 11:10:00', '2025-04-22'),

(103, 103, 3, 7, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', '103/2025', '2025', '103/2025',
  NULL, 8, '2025-01-15', 'TERCERO',
  '[{"tipo_persona":"MORAL","empresa":"ASEGURADORA DEL MAR SA DE CV"}]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"RAMON","apellido_paterno":"ORTEGA","apellido_materno":"LUNA"}]'::jsonb,
  '[]'::jsonb,
  4, '[37]'::jsonb, 'Reembolso de gastos medicos derivados de siniestro vehicular.', 98500.00,
  'LIC. PATRICIA VEGA NORIEGA', 'SIN PRONOSTICO', 'TRAMITE', '2025-01-15 08:45:00', '2025-02-20 15:00:00', '2025-05-03'),

(104, 104, 4, 10, 'LOCAL', 'CIVIL', 'Arrendamiento', NULL, NULL, NULL, 'ARR-CAM-104/2025',
  NULL, 9, '2025-01-20', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"ARRENDADORA DEL GOLFO SA DE CV"},{"tipo_persona":"FISICA","nombres":"JORGE","apellido_paterno":"PALACIOS","apellido_materno":"CRUZ"}]'::jsonb,
  '[]'::jsonb,
  9, '[10,16]'::jsonb, 'Desocupacion, entrega del inmueble y pago de rentas vencidas de bodega delegacional.', 214000.00,
  'LIC. ANA MARTINEZ SOLIS', 'FAVORABLE', 'TRAMITE', '2025-01-20 11:20:00', '2025-02-21 09:30:00', '2025-04-28'),

(105, 105, 5, 13, 'LOCAL', 'CIVIL', 'Especial Hipotecario', NULL, NULL, NULL, 'HIP-COA-105/2025',
  NULL, 11, '2025-01-23', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"ROSA","apellido_paterno":"CARRILLO","apellido_materno":"VEGA"},{"tipo_persona":"FISICA","nombres":"FERNANDO","apellido_paterno":"CARRILLO","apellido_materno":"VEGA"}]'::jsonb,
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"FINANCIERA HIPOTECARIA DEL NORTE SA DE CV"}]'::jsonb,
  18, '[19,21]'::jsonb, 'Defensa en juicio hipotecario relacionado con vivienda adjudicada.', 0.00,
  'LIC. FERNANDO RUIZ DIAZ', 'DESFAVORABLE', 'TRAMITE', '2025-01-23 09:40:00', '2025-02-22 16:20:00', '2025-05-12'),

(106, 106, 6, 16, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-COL-106/2025',
  NULL, 2, '2025-01-28', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"SERVICIOS INTEGRALES DE VIGILANCIA SA DE CV"}]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"ALMA","apellido_paterno":"DELGADO","apellido_materno":"RAMIREZ"}]'::jsonb,
  20, '[27]'::jsonb, 'Cumplimiento forzoso de contrato de seguridad privada.', 356000.00,
  'LIC. MIGUEL ANGEL TORRES', 'FAVORABLE', 'TRAMITE', '2025-01-28 14:10:00', '2025-02-24 13:45:00', '2025-04-30'),

(107, 107, 7, 19, 'FEDERAL', 'CIVIL', 'Agrario', NULL, 'AGR-107', '2025', 'AGR-107/2025',
  NULL, 1, '2025-02-03', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"MATEO","apellido_paterno":"LOPEZ","apellido_materno":"GIRON"}]'::jsonb,
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"COMISARIADO EJIDAL NUEVA ESPERANZA"}]'::jsonb,
  12, '[4]'::jsonb, 'Controversia por posesion de terreno utilizado para unidad medica rural.', 0.00,
  'LIC. OSCAR LOPEZ LAN', 'DESFAVORABLE', 'TRAMITE', '2025-02-03 08:30:00', '2025-02-25 17:00:00', '2025-05-15'),

(108, 108, 8, 22, 'LOCAL', 'CIVIL', 'Ordinario Civil', 'Oral', NULL, NULL, 'CIV-CHH-108/2025',
  NULL, 10, '2025-02-07', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"SERGIO","apellido_paterno":"NAVARRO","apellido_materno":"DIAZ"},{"tipo_persona":"MORAL","empresa":"TALLERES DEL NORTE SA"}]'::jsonb,
  '[]'::jsonb,
  1, '[26]'::jsonb, 'Reparacion de danos a ambulancia institucional y pago de gastos.', 127500.00,
  'LIC. LAURA ESQUIVEL PEREZ', 'FAVORABLE', 'TRAMITE', '2025-02-07 10:05:00', '2025-02-26 11:35:00', '2025-05-06'),

(109, 109, 10, 25, 'FEDERAL', 'MERCANTIL', 'Especiales', 'Especial de Fianzas', 'FIA-109', '2025', 'FIA-109/2025',
  NULL, 14, '2025-02-10', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"AFIANZADORA CORPORATIVA MEXICANA SA DE CV"}]'::jsonb,
  '[]'::jsonb,
  32, '[27,33]'::jsonb, 'Cobro de poliza de fianza por incumplimiento de contrato de mantenimiento.', 890000.00,
  'LIC. RICARDO MONREAL AVILA', 'FAVORABLE', 'TRAMITE', '2025-02-10 12:00:00', '2025-02-27 10:50:00', '2025-05-20'),

(110, 110, 11, 28, 'LOCAL', 'CIVIL', 'Arrendamiento', NULL, NULL, NULL, 'ARR-GTO-110/2025',
  NULL, 17, '2025-02-12', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"CARLOS","apellido_paterno":"MENA","apellido_materno":"LOZANO"},{"tipo_persona":"MORAL","empresa":"OPERADORA DE INMUEBLES DEL BAJIO"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  10, '[27]'::jsonb, 'Controversia por rentas, gastos y desocupacion de oficina administrativa.', 76000.00,
  'LIC. MIGUEL ANGEL TORRES', 'SIN PRONOSTICO', 'TRAMITE', '2025-02-12 09:10:00', '2025-02-28 15:25:00', '2025-05-08'),

(111, 111, 12, 31, 'FEDERAL', 'CIVIL', 'Agrario', NULL, 'AGR-111', '2025', 'AGR-111/2025',
  NULL, 18, '2025-02-14', 'TERCERO',
  '[{"tipo_persona":"MORAL","empresa":"ASEGURADORA REGIONAL DEL SUR"}]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"JUAN","apellido_paterno":"MORALES","apellido_materno":"TENORIO"}]'::jsonb,
  '[]'::jsonb,
  4, '[12]'::jsonb, 'Intervencion de tercero por afectacion a poliza y deslinde de responsabilidad.', 0.00,
  'LIC. PATRICIA VEGA NORIEGA', 'DESFAVORABLE', 'TRAMITE', '2025-02-14 13:00:00', '2025-03-01 09:40:00', '2025-05-28'),

(112, 112, 15, 34, 'FEDERAL', 'MERCANTIL', 'Especiales', 'Concursos Mercantiles', 'CM-112', '2025', 'CM-112/2025',
  NULL, 3, '2025-02-18', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"CONSTRUCTORA MEXIQUENSE SA DE CV"},{"tipo_persona":"MORAL","empresa":"DESARROLLOS ORIENTE SA DE CV"}]'::jsonb,
  '[]'::jsonb,
  8, '[33,24]'::jsonb, 'Reconocimiento y pago de adeudo de cuotas obrero patronales en concurso mercantil.', 1485000.00,
  'LIC. ADRIANA SOTO MENDOZA', 'FAVORABLE', 'TRAMITE', '2025-02-18 10:20:00', '2025-03-03 16:00:00', '2025-06-02'),

(113, 113, 16, 37, 'LOCAL', 'CIVIL', 'Usucapion', NULL, NULL, NULL, 'USU-113/2025',
  NULL, 16, '2025-02-21', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"AURELIA","apellido_paterno":"VARGAS","apellido_materno":"RAMOS"}]'::jsonb,
  '[]'::jsonb,
  '[{"tipo_persona":"FISICA","nombres":"RAUL","apellido_paterno":"ESPINOZA","apellido_materno":"LEON"}]'::jsonb,
  12, '[15]'::jsonb, 'Reivindicacion y nulidad de escritura respecto de terreno de estacionamiento.', 0.00,
  'LIC. FERNANDO RUIZ DIAZ', 'DESFAVORABLE', 'TRAMITE', '2025-02-21 08:55:00', '2025-03-04 12:10:00', '2025-05-21'),

(114, 114, 43, 40, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', '114/2025', '2025', '114/2025',
  NULL, 5, '2025-02-24', 'DEMANDADO',
  '[{"tipo_persona":"FISICA","nombres":"PATRICIA","apellido_paterno":"SALAS","apellido_materno":"RODRIGUEZ"},{"tipo_persona":"MORAL","empresa":"SERVICIOS HOSPITALARIOS INTEGRALES SA DE CV"}]'::jsonb,
  '[]'::jsonb,
  '[]'::jsonb,
  2, '[36]'::jsonb, 'Reclamacion por dano moral y publicacion de extractos de sentencia.', 450000.00,
  'LIC. OSCAR LOPEZ LAN', 'SIN PRONOSTICO', 'TRAMITE', '2025-02-24 11:40:00', '2025-03-05 14:40:00', '2025-06-05'),

(115, 115, 45, 43, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-DFS-115/2025',
  NULL, 13, '2025-02-27', 'ACTOR',
  '[]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"LOGISTICA FARMACEUTICA DEL CENTRO SA DE CV"},{"tipo_persona":"FISICA","nombres":"GABRIEL","apellido_paterno":"MARTINEZ","apellido_materno":"SOTO"}]'::jsonb,
  '[{"tipo_persona":"MORAL","empresa":"AVALES UNIDOS SA DE CV"}]'::jsonb,
  40, '[21,27]'::jsonb, 'Cobro de pagares por suministro de medicamentos y costas procesales.', 973200.00,
  'LIC. LAURA ESQUIVEL PEREZ', 'FAVORABLE', 'TRAMITE', '2025-02-27 09:25:00', '2025-03-06 10:55:00', '2025-06-10')
ON CONFLICT (id) DO NOTHING;

INSERT INTO seguimiento_civil (
  expediente_id, fecha_actuacion, tipo_actuacion, descripcion, actualizado_siij
) VALUES
(101, '2025-02-14', 'Audiencia', 'Se celebro audiencia preliminar y se admitieron documentales ofrecidas por ambas partes.', 'SI'),
(102, '2025-02-18', 'Promocion', 'Se presento promocion para requerir pago de facturas y exhibicion de ordenes de compra.', 'NO'),
(103, '2025-02-20', 'Acuerdo', 'El juzgado tuvo por admitida la intervencion del tercero y reservo fecha para audiencia.', 'NO'),
(104, '2025-02-21', 'Notificacion', 'Se notifico emplazamiento a la demandada principal y al obligado solidario.', 'SI'),
(105, '2025-02-22', 'Contestacion', 'La parte actora dio contestacion a excepciones y solicito apertura a periodo probatorio.', 'NO'),
(106, '2025-02-24', 'Conciliacion', 'Se celebro junta de conciliacion sin que las partes llegaran a convenio.', 'NO'),
(107, '2025-02-25', 'Acuerdo', 'El tribunal agrario requirio planos, certificados parcelarios y acta de asamblea ejidal.', 'SI'),
(108, '2025-02-26', 'Pericial', 'Se admitio pericial mecanica para cuantificar danos de la unidad institucional.', 'NO'),
(109, '2025-02-27', 'Demanda', 'Se ratifico demanda ejecutiva y se pidio requerimiento de pago a la afianzadora.', 'SI'),
(110, '2025-02-28', 'Audiencia', 'Se fijo fecha para desahogo de pruebas confesional y testimonial.', 'NO'),
(111, '2025-03-01', 'Desahogo', 'Se desahogo inspeccion ocular y se ordeno emitir dictamen topografico complementario.', 'NO'),
(112, '2025-03-03', 'Promocion', 'Se presento credito a reconocer dentro del concurso mercantil con soporte documental.', 'SI'),
(113, '2025-03-04', 'Pruebas', 'Se ofrecieron pruebas documentales y testimonial respecto de la posesion pacifica del inmueble.', 'NO'),
(114, '2025-03-05', 'Amparo', 'La contraparte promovio amparo indirecto contra auto admisorio; se rindio informe previo.', 'NO'),
(115, '2025-03-06', 'Ejecucion', 'Se solicito requerimiento de pago y embargo precautorio en via ejecutiva mercantil.', 'SI')
ON CONFLICT DO NOTHING;

SELECT setval('expedientes_civil_id_seq', GREATEST((SELECT COALESCE(MAX(id), 1) FROM expedientes_civil), 115));
SELECT setval('seguimiento_civil_id_seq', (SELECT COALESCE(MAX(id), 1) FROM seguimiento_civil));
