-- =====================================================
-- SEED DATA: Catálogos + Datos Dummy
-- Ejecutar DESPUÉS de 01_schema.sql
-- =====================================================

-- =====================================================
-- OOAD (49 registros, sin duplicados)
-- =====================================================
INSERT INTO delegaciones (id, nombre, estado) VALUES
(1, 'AGUASCALIENTES', 'AGUASCALIENTES'),
(2, 'BAJA CALIFORNIA', 'BAJA CALIFORNIA'),
(3, 'BAJA CALIFORNIA SUR', 'BAJA CALIFORNIA SUR'),
(4, 'CAMPECHE', 'CAMPECHE'),
(5, 'COAHUILA', 'COAHUILA'),
(6, 'COLIMA', 'COLIMA'),
(7, 'CHIAPAS', 'CHIAPAS'),
(8, 'CHIHUAHUA', 'CHIHUAHUA'),
(9, 'DIVISION NORMATIVA', 'DIVISION NORMATIVA'),
(10, 'DURANGO', 'DURANGO'),
(11, 'GUANAJUATO', 'GUANAJUATO'),
(12, 'GUERRERO', 'GUERRERO'),
(13, 'HIDALGO', 'HIDALGO'),
(14, 'JALISCO', 'JALISCO'),
(15, 'ESTADO MEXICO ORIENTE', 'ESTADO MEXICO ORIENTE'),
(16, 'ESTADO MEXICO PONIENTE', 'ESTADO MEXICO PONIENTE'),
(17, 'MICHOACAN', 'MICHOACAN'),
(18, 'MORELOS', 'MORELOS'),
(19, 'NAYARIT', 'NAYARIT'),
(20, 'NUEVO LEON', 'NUEVO LEON'),
(21, 'OAXACA', 'OAXACA'),
(22, 'PUEBLA', 'PUEBLA'),
(23, 'QUERETARO', 'QUERETARO'),
(24, 'QUINTANA ROO', 'QUINTANA ROO'),
(25, 'SAN LUIS POTOSI', 'SAN LUIS POTOSI'),
(26, 'SINALOA', 'SINALOA'),
(27, 'SONORA', 'SONORA'),
(28, 'TABASCO', 'TABASCO'),
(29, 'TAMAULIPAS', 'TAMAULIPAS'),
(30, 'TLAXCALA', 'TLAXCALA'),
(31, 'VERACRUZ NORTE', 'VERACRUZ NORTE'),
(32, 'VERACRUZ SUR', 'VERACRUZ SUR'),
(33, 'YUCATAN', 'YUCATAN'),
(34, 'ZACATECAS', 'ZACATECAS'),
(35, 'DELEGACION 1 NOROESTE - DISTRITO FEDERAL NORTE', 'DELEGACION 1 NOROESTE - DISTRITO FEDERAL NORTE'),
(36, 'DELEGACION 2 NORESTE - DISTRITO FEDERAL NORTE', 'DELEGACION 2 NORESTE - DISTRITO FEDERAL NORTE'),
(37, 'DELEGACION 3 SUROESTE - DISTRITO FEDERAL SUR', 'DELEGACION 3 SUROESTE - DISTRITO FEDERAL SUR'),
(38, 'DELEGACION 4 SURESTE - DISTRITO FEDERAL SUR', 'DELEGACION 4 SURESTE - DISTRITO FEDERAL SUR'),
(39, 'CDMX NORTE', 'CDMX NORTE'),
(40, 'CDMX SUR', 'CDMX SUR'),
(41, 'ZONA METROPOLITANA', 'ZONA METROPOLITANA'),
(42, 'COORDINACION LABORAL', 'COORDINACION LABORAL'),
(43, 'D.F. NORTE', 'D.F. NORTE'),
(44, 'D.F. NORTE ANTERIOR', 'D.F. NORTE ANTERIOR'),
(45, 'D.F. SUR', 'D.F. SUR'),
(46, 'D.F. SUR ANTERIOR', 'D.F. SUR ANTERIOR'),
(47, 'NIVEL CENTRAL', 'NIVEL CENTRAL'),
(48, 'UMAE HE 71', 'UMAE HE 71'),
(49, 'UMAE V. DE LA FUENTE', 'UMAE V. DE LA FUENTE')
ON CONFLICT (id) DO NOTHING;

SELECT setval('delegaciones_id_seq', 49);

-- =====================================================
-- ÁREAS GENERADORAS
-- =====================================================
INSERT INTO areas (id, delegacion_id, nombre) VALUES
-- AGUASCALIENTES (id=1)
(1, 1, 'DELEGACION ESTATAL EN AGUASCALIENTES AGS.'),
(2, 1, 'UNIDAD DE MEDICINA FAMILIAR NUM. 1 AGS.'),
(3, 1, 'HOSPITAL GENERAL DE ZONA NUM. 1 AGS.'),
-- BAJA CALIFORNIA (id=2)
(4, 2, 'DELEGACION ESTATAL EN BAJA CALIFORNIA BC.'),
(5, 2, 'UNIDAD DE MEDICINA FAMILIAR NUM. 2 BC.'),
(6, 2, 'UNIDAD DE MEDICINA FAMILIAR NUM. 3 BC.'),
-- BAJA CALIFORNIA SUR (id=3)
(7, 3, 'DELEGACION ESTATAL EN BAJA CALIFORNIA SUR BCS.'),
(8, 3, 'HOSPITAL GENERAL DE ZONA/MF NUM. 1 BCS.'),
(9, 3, 'HOSPITAL GENERAL DE SUBZONA/MF NUM. 2 BCS.'),
-- CAMPECHE (id=4)
(10, 4, 'DELEGACION ESTATAL EN CAMPECHE CAM.'),
(11, 4, 'HOSPITAL GENERAL DE ZONA/MF NUM. 1 CAM.'),
(12, 4, 'UNIDAD DE MEDICINA FAMILIAR/CH NUM. 2 CAM.'),
-- COAHUILA (id=5)
(13, 5, 'DELEGACION ESTATAL EN COAHUILA COA.'),
(14, 5, 'HOSPITAL GENERAL DE ZONA NUM. 1 COA.'),
(15, 5, 'HOSPITAL GENERAL DE ZONA NUM. 2 COA.'),
-- COLIMA (id=6)
(16, 6, 'DELEGACION REGIONAL EN COLIMA COL.'),
(17, 6, 'HOSPITAL GENERAL DE ZONA NUM. 1 COL.'),
(18, 6, 'UNIDAD DE MEDICINA FAMILIAR NUM. 2 COL.'),
-- CHIAPAS (id=7)
(19, 7, 'DELEGACION ESTATAL EN CHIAPAS CHS.'),
(20, 7, 'HOSPITAL GENERAL DE ZONA/MF NUM. 1 CHS.'),
(21, 7, 'HOSPITAL GENERAL DE ZONA/MF NUM. 2 CHS.'),
-- CHIHUAHUA (id=8)
(22, 8, 'DELEGACION ESTATAL EN CHIHUAHUA CHH.'),
(23, 8, 'HOSPITAL GENERAL REGIONAL NUM. 1 CHH.'),
(24, 8, 'UNIDAD DE MEDICINA FAMILIAR NUM. 2 CHH.'),
-- DURANGO (id=10)
(25, 10, 'DELEGACION ESTATAL EN DURANGO DGO.'),
(26, 10, 'HOSPITAL GENERAL DE ZONA/MF NUM. 1 DGO.'),
(27, 10, 'HOSPITAL GENERAL DE SUBZONA NUM. 2 DGO.'),
-- GUANAJUATO (id=11)
(28, 11, 'DELEGACION ESTATAL EN GUANAJUATO GTO.'),
(29, 11, 'HOSPITAL GENERAL DE ZONA NUM. 2 GTO.'),
(30, 11, 'UNIDAD DE MEDICINA FAMILIAR NUM. 3 GTO.'),
-- GUERRERO (id=12)
(31, 12, 'DELEGACION ESTATAL EN GUERRERO GRO.'),
(32, 12, 'HOSPITAL GENERAL DE ZONA/MF NUM. 1 GRO.'),
(33, 12, 'HOSPITAL GENERAL DE ZONA NUM. 2 GRO.'),
-- ESTADO MEXICO ORIENTE (id=15)
(34, 15, 'DELEGACION ESTADO DE MEXICO ZONA ORIENTE EMO.'),
(35, 15, 'UNIDAD DE MEDICINA FAMILIAR NUM. 52 EMO.'),
(36, 15, 'HOSPITAL GENERAL DE ZONA NUM. 53 EMO.'),
-- ESTADO MEXICO PONIENTE (id=16)
(37, 16, 'DELEGACION ESTADO DE MEXICO ZONA PONIENTE EMP.'),
(38, 16, 'UNIDAD DE MEDICINA FAMILIAR NUM. 51 EMP.'),
(39, 16, 'HOSPITAL GENERAL DE ZONA/MF NUM. 58 EMP.'),
-- D.F. NORTE (id=43)
(40, 43, 'DELEGACION NORTE DEL DISTRITO FEDERAL DFN'),
(41, 43, 'UNIDAD DE MEDICINA FAMILIAR NUM. 2 DFN'),
(42, 43, 'HOSPITAL DE GINECO-OBSTETRICIA NUM. 3A DFN'),
-- D.F. SUR (id=45)
(43, 45, 'DELEGACION SUR DEL DISTRITO FEDERAL DFS'),
(44, 45, 'UNIDAD DE MEDICINA FAMILIAR NUM. 1 DFS'),
(45, 45, 'UNIDAD DE MEDICINA FAMILIAR NUM. 4 DFS')
ON CONFLICT (id) DO NOTHING;

SELECT setval('areas_id_seq', 45);

-- =====================================================
-- TRIBUNALES
-- =====================================================
INSERT INTO tribunales (id, nombre, delegacion_id) VALUES
(1, 'Juzgado Primero Civil - Tuxtla Gutiérrez', 7),
(2, 'Juzgado Segundo Mercantil - Guadalajara', 6),
(3, 'Juzgado Tercero Civil - Ecatepec', 15),
(4, 'Juzgado Cuarto Mercantil - CDMX', 43),
(5, 'Juzgado de Distrito Federal - CDMX', 43),
(6, 'Juzgado Primero Civil - Aguascalientes', 1),
(7, 'Juzgado Primero Civil - Mexicali', 2),
(8, 'Juzgado Primero Civil - La Paz', 3),
(9, 'Juzgado Primero Civil - Campeche', 4),
(10, 'Juzgado Primero Civil - Chihuahua', 8),
(11, 'Juzgado Primero Civil - Saltillo', 5),
(12, 'Juzgado Primero Civil - Colima', 6),
(13, 'Juzgado Segundo Civil - CDMX Sur', 45),
(14, 'Juzgado Primero Civil - Durango', 10),
(15, 'Juzgado Segundo Civil - Ecatepec', 15),
(16, 'Juzgado Primero Civil - Toluca', 16),
(17, 'Juzgado Primero Civil - León', 11),
(18, 'Juzgado Primero Civil - Chilpancingo', 12),
-- Tribunales penales
(19, 'Juzgado de Control - Tuxtla Gutiérrez', 7),
(20, 'Juzgado de Control - Aguascalientes', 1),
(21, 'Juzgado de Control - Mexicali', 2),
(22, 'Juzgado de Control - CDMX Norte', 43),
(23, 'Juzgado de Control - CDMX Sur', 45),
(24, 'Juzgado de Control - Saltillo', 5),
(25, 'Juzgado de Control - León', 11),
(26, 'Juzgado Penal - Chilpancingo', 12)
ON CONFLICT (id) DO NOTHING;

SELECT setval('tribunales_id_seq', 26);

-- =====================================================
-- PRESTACIONES
-- =====================================================
INSERT INTO prestaciones (id, nombre) VALUES
(1, 'Indemnización por daños y perjuicios'),
(2, 'Indemnización por reparación del daño moral'),
(3, 'Indemnización por reparación del daño moral indirecto'),
(4, 'Indemnización por daño material'),
(5, 'Recuperación de créditos hipotecarios'),
(6, 'Recuperación de préstamos para financiamiento de automóvil'),
(7, 'Recuperación por préstamos a mediano plazo'),
(8, 'Reconocimiento y pago de adeudo de cuotas obrero patronales (concurso mercantil)'),
(9, 'Arrendamientos de inmuebles, desocupación y entrega de inmueble'),
(10, 'Arrendamientos de inmuebles, pago de rentas vencidas'),
(11, 'Arrendamientos de inmuebles, formalización de contrato'),
(12, 'Reivindicación de bien inmueble'),
(13, 'Declaración judicial de la prescripción de la acción hipotecaria'),
(14, 'Declaración judicial de incumplimiento contrato de obra pública'),
(15, 'Declaración judicial de la nulidad absoluta de escritura pública'),
(16, 'Declaración judicial de terminación del contrato de arrendamiento'),
(17, 'Declaración judicial de nulidad de contrato'),
(18, 'Rescisión del mutuo con interés y garantía hipotecaria'),
(19, 'Vencimiento anticipado del contrato de mutuo con interés y garantía hipotecaria'),
(20, 'Cumplimiento forzoso de contrato'),
(21, 'Pago de intereses moratorios'),
(22, 'Pago de gastos financieros'),
(23, 'Pago de actualizaciones'),
(24, 'Pago de recargos'),
(25, 'Pago de devolución de anticipo'),
(26, 'Pago de gastos'),
(27, 'Pago de costas'),
(28, 'Pago de cuotas de recuperación'),
(29, 'Pago de honorarios profesionales'),
(30, 'Pago de facturas por adquisición de servicios profesionales'),
(31, 'Pago de facturas por adquisición de bienes'),
(32, 'Pago de cantidad garantizada en póliza de fianza por incumplimiento de contrato'),
(33, 'Pago de saldos insolutos'),
(34, 'Pago de cantidad en dinero por concepto de suerte principal consignado en el título de crédito'),
(35, 'Pago de la cantidad del cobro indebido'),
(36, 'Publicación de extractos de la sentencia'),
(37, 'Pago por reembolso de gastos médicos'),
(38, 'Nulidad de contrato de crédito y mandato irrevocable para descuento vía nómina y pago de indemnización por daño moral y daños punitivos'),
(39, 'Consignación de rentas'),
(40, 'Pago derivado de título de crédito en su modalidad de pagaré')
ON CONFLICT (id) DO NOTHING;

SELECT setval('prestaciones_id_seq', 40);

-- =====================================================
-- TIPOS DE ACTUACIÓN
-- =====================================================
INSERT INTO tipos_actuacion (id, nombre, modulo) VALUES
(1, 'Acuerdo', 'AMBOS'),
(2, 'Alegatos', 'CIVIL'),
(3, 'Amparo', 'AMBOS'),
(4, 'Archivo', 'AMBOS'),
(5, 'Audiencia', 'AMBOS'),
(6, 'Caducidad', 'CIVIL'),
(7, 'Conciliación', 'CIVIL'),
(8, 'Contestación', 'CIVIL'),
(9, 'Demanda', 'CIVIL'),
(10, 'Desahogo', 'AMBOS'),
(11, 'Ejecución', 'AMBOS'),
(12, 'Notificación', 'AMBOS'),
(13, 'Pericial', 'AMBOS'),
(14, 'Promoción', 'AMBOS'),
(15, 'Pruebas', 'AMBOS'),
(16, 'Recurso', 'AMBOS'),
(17, 'Sentencia', 'AMBOS'),
(18, 'Sobreseimiento', 'AMBOS'),
(19, 'Suspensión', 'AMBOS'),
(20, 'Vista', 'AMBOS'),
(21, 'Denuncia', 'PENAL'),
(22, 'Querella', 'PENAL'),
(23, 'Investigación', 'PENAL'),
(24, 'Vinculación a proceso', 'PENAL'),
(25, 'Medida cautelar', 'PENAL'),
(26, 'Auto de apertura a juicio oral', 'PENAL'),
(27, 'Juicio oral', 'PENAL'),
(28, 'Reparación del daño', 'PENAL'),
(29, 'Acuerdo reparatorio', 'PENAL'),
(30, 'Criterio de oportunidad', 'PENAL')
ON CONFLICT (id) DO NOTHING;

SELECT setval('tipos_actuacion_id_seq', 30);

-- =====================================================
-- TIPOS DE JUICIO (CIVIL / MERCANTIL)
-- =====================================================
INSERT INTO tipos_juicio (id, materia, nombre, jurisdiccion, requiere_descripcion) VALUES
(1, 'CIVIL', 'Ordinario Civil', NULL, false),
(2, 'CIVIL', 'Ejecutivo', 'LOCAL', false),
(3, 'CIVIL', 'Sumario', 'LOCAL', false),
(4, 'CIVIL', 'Especial', 'LOCAL', false),
(5, 'CIVIL', 'Especial Hipotecario', 'LOCAL', false),
(6, 'CIVIL', 'Agrario', 'FEDERAL', false),
(7, 'CIVIL', 'Arrendamiento', 'LOCAL', false),
(8, 'CIVIL', 'Reivindicatorio', 'LOCAL', false),
(9, 'CIVIL', 'Usucapión', 'LOCAL', false),
(10, 'CIVIL', 'Medios Preparatorios a Juicio', 'LOCAL', false),
(11, 'CIVIL', 'Jurisdicción Voluntaria', 'LOCAL', false),
(12, 'CIVIL', 'Ordinario Familiar', 'LOCAL', false),
(13, 'CIVIL', 'Oral Familiar', 'LOCAL', false),
(14, 'CIVIL', 'Otro, caso sui generis', 'AMBAS', true),
(20, 'MERCANTIL', 'Ordinario Mercantil', NULL, false),
(21, 'MERCANTIL', 'Ejecutivo', 'AMBAS', false),
(22, 'MERCANTIL', 'Especiales', 'FEDERAL', false),
(23, 'MERCANTIL', 'Otro, caso sui generis', 'AMBAS', true),
(30, 'AMPARO INDIRECTO', 'Amparo Indirecto', 'FEDERAL', false)
ON CONFLICT (id) DO NOTHING;

SELECT setval('tipos_juicio_id_seq', 30);

-- Subtipos de juicio
INSERT INTO subtipos_juicio (id, tipo_juicio_id, nombre, jurisdiccion) VALUES
(11, 1, 'Oral', 'LOCAL'),
(12, 1, 'Escrito', 'AMBAS'),
(201, 20, 'Oral', 'FEDERAL'),
(202, 20, 'Escrito', 'AMBAS'),
(221, 22, 'Concursos Mercantiles', 'FEDERAL'),
(222, 22, 'Especial de Fianzas', 'FEDERAL')
ON CONFLICT (id) DO NOTHING;

SELECT setval('subtipos_juicio_id_seq', 222);

-- =====================================================
-- DELITOS (CATÁLOGO PENAL)
-- =====================================================
INSERT INTO delitos (id, nombre, fuero) VALUES
(1, 'Robo', 'COMUN'),
(2, 'Robo calificado', 'COMUN'),
(3, 'Fraude', 'COMUN'),
(4, 'Abuso de confianza', 'COMUN'),
(5, 'Daño en propiedad ajena', 'COMUN'),
(6, 'Lesiones', 'COMUN'),
(7, 'Homicidio culposo', 'COMUN'),
(8, 'Amenazas', 'COMUN'),
(9, 'Usurpación de funciones', 'COMUN'),
(10, 'Falsificación de documentos', 'COMUN'),
(11, 'Uso de documento falso', 'COMUN'),
(12, 'Despojo', 'COMUN'),
(13, 'Extorsión', 'COMUN'),
(14, 'Delitos contra la salud', 'FEDERAL'),
(15, 'Delitos contra el patrimonio institucional', 'FEDERAL'),
(16, 'Peculado', 'FEDERAL'),
(17, 'Cohecho', 'FEDERAL'),
(18, 'Ejercicio indebido del servicio público', 'FEDERAL'),
(19, 'Uso indebido de atribuciones y facultades', 'FEDERAL'),
(20, 'Violación de sellos', 'FEDERAL')
ON CONFLICT (id) DO NOTHING;

SELECT setval('delitos_id_seq', 20);

-- =====================================================
-- ESTADOS PROCESALES (CATÁLOGO PENAL)
-- =====================================================
INSERT INTO estados_procesales (id, nombre, orden, descripcion) VALUES
(1, 'Investigación inicial', 1, 'Etapa donde el Ministerio Público recibe la denuncia o querella e inicia la investigación de los hechos.'),
(2, 'Investigación complementaria', 2, 'Fase posterior a la formulación de imputación, donde se recaban pruebas adicionales.'),
(3, 'Etapa intermedia', 3, 'Se realiza el descubrimiento probatorio y se determina la apertura a juicio oral.'),
(4, 'Juicio oral', 4, 'Desahogo de pruebas, alegatos y emisión de sentencia en audiencia pública.'),
(5, 'Sentenciado', 5, 'Se ha emitido sentencia (condenatoria o absolutoria).'),
(6, 'Ejecución de sentencia', 6, 'Cumplimiento de la sentencia dictada.'),
(7, 'Recurso de apelación', 7, 'Impugnación de la sentencia ante tribunal de alzada.'),
(8, 'Amparo', 8, 'Juicio de garantías promovido contra la resolución.'),
(9, 'Concluido', 9, 'El proceso ha terminado definitivamente.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('estados_procesales_id_seq', 9);

-- =====================================================
-- USUARIOS
-- =====================================================
INSERT INTO usuarios (id, usuario, password, nombre_completo, rol, delegacion_id, permiso_civil_mercantil, permiso_penal, activo) VALUES
(1, 'admin', 'admin123', 'Administrador General', 'admin', NULL, true, true, true),
(2, 'oscar.lopez', '1234', 'Oscar López', 'editor', 7, true, true, true),
(3, 'maria.garcia', '1234', 'María García', 'consulta', 7, true, false, true),
(4, 'carlos.ramirez', '1234', 'Carlos Ramírez', 'editor', 2, true, true, true),
(5, 'ana.martinez', '1234', 'Ana Martínez', 'editor', 1, true, false, true)
ON CONFLICT (id) DO NOTHING;

SELECT setval('usuarios_id_seq', 5);

-- =====================================================
-- EXPEDIENTES CIVIL (datos dummy)
-- =====================================================
INSERT INTO expedientes_civil (id, numero, delegacion_id, area_generadora_id, jurisdiccion, tipo_juicio, subtipo_juicio, sub_subtipo_juicio, numero_juicio, anio, numero_expediente, acumulado_a, tribunal_id, fecha_inicio, imss_es, actor, demandados, codemandados, prestacion_principal, prestaciones_secundarias, prestaciones_notas, importe_demandado, abogado_responsable, pronostico, estatus, fecha_creacion, fecha_actualizacion, fecha_vencimiento) VALUES
(1, 1, 7, 19, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', '100100', '2024', '100100/2024', NULL, 1, '2024-01-10', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"Roberto","apellido_paterno":"Gómez","apellido_materno":"Bolaños"}',
  '[]', '[{"tipo_persona":"MORAL","empresa":"Constructora del Sur S.A."}]',
  1, '[4,21]', 'Daño estructural en vivienda colindante', 500000.00, 'Lic. Fernando Ruiz Díaz', 'FAVORABLE', 'TRAMITE',
  '2024-01-10 09:00:00', '2025-02-10 14:30:00', '2025-03-15'),

(2, 2, 7, 20, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', '100101', '2024', '100101/2024', 1, 1, '2024-02-15', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"María","apellido_paterno":"Antonieta","apellido_materno":"De las Nieves"}',
  '[]', '[]', 1, '[]', 'Afectaciones por humedad en muro compartido', 150000.00, 'Lic. Fernando Ruiz Díaz', 'FAVORABLE', 'CONCLUIDO',
  '2024-02-15 10:00:00', NULL, NULL),

(3, 3, 7, 21, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', '100102', '2024', '100102/2024', 1, 1, '2024-03-01', 'TERCERO',
  '{"tipo_persona":"MORAL","empresa":"Aseguradora Chiapaneca S.A."}',
  '[{"tipo_persona":"FISICA","nombres":"Juan","apellido_paterno":"Pérez","apellido_materno":"López"}]', '[]',
  4, '[2]', 'Reclamo de póliza de seguro', 0, NULL, 'DESFAVORABLE', 'CONCLUIDO',
  '2024-03-01 11:00:00', NULL, NULL),

(4, 4, 2, 4, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-ORAL-200/2024', NULL, 2, '2024-04-05', 'ACTOR',
  '{}', '[{"tipo_persona":"MORAL","empresa":"Proveedora Médica del Norte"}]',
  '[{"tipo_persona":"FISICA","nombres":"Carlos","apellido_paterno":"Villagrán","apellido_materno":"Eslava"}]',
  3, '[20,27]', 'Incumplimiento en entrega de insumos médicos', 2500000.00, 'Lic. Adriana Soto Mendoza', 'DESFAVORABLE', 'TRAMITE',
  '2024-04-05 12:00:00', '2025-02-11 16:45:00', '2025-03-20'),

(5, 5, 2, 5, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-ORAL-250/2024', 4, 2, '2024-04-20', 'ACTOR',
  '{}', '[{"tipo_persona":"MORAL","empresa":"Proveedora Médica del Norte"}]', '[]',
  3, '[]', 'Cobro de penalizaciones contractuales', 120000.00, NULL, 'FAVORABLE', 'CONCLUIDO',
  '2024-04-20 13:00:00', NULL, NULL),

(6, 6, 1, 1, 'LOCAL', 'CIVIL', 'Especial Hipotecario', NULL, NULL, NULL, 'HIP-001/2024', NULL, 6, '2024-05-01', 'TERCERO',
  '{"tipo_persona":"MORAL","empresa":"Banco del Bajío S.A."}',
  '[{"tipo_persona":"FISICA","nombres":"Empleado","apellido_paterno":"Desconocido","apellido_materno":"N."}]', '[]',
  10, '[9]', 'Informe de descuentos vía nómina', 0, NULL, 'SIN PRONÓSTICO', 'TRAMITE',
  '2024-05-01 08:00:00', NULL, NULL),

(7, 7, 43, 40, 'FEDERAL', 'CIVIL', 'Agrario', NULL, 'AGR-999', '2024', 'AGR-999/2024', NULL, 5, '2024-05-15', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"Comisariado","apellido_paterno":"Ejidal","apellido_materno":"Tláhuac"}',
  '[]', '[]', 4, '[12]', 'Restitución de tierras de la UMF 2', 0, 'Lic. Patricia Vega Noriega', 'DESFAVORABLE', 'TRAMITE',
  '2024-05-15 09:30:00', NULL, NULL),

(8, 8, 11, 29, 'LOCAL', 'CIVIL', 'Arrendamiento', NULL, NULL, NULL, 'ARR-555/2024', NULL, 17, '2024-06-01', 'ACTOR',
  '{}', '[{"tipo_persona":"FISICA","nombres":"Luis","apellido_paterno":"Miguel","apellido_materno":"Gallego"}]', '[]',
  9, '[16]', 'Falta de pago de renta inmueble administrativo', 80000.00, 'Lic. Miguel Ángel Torres', 'FAVORABLE', 'TRAMITE',
  '2024-06-01 10:00:00', NULL, NULL),

(9, 9, 3, 7, 'LOCAL', 'CIVIL', 'Usucapión', NULL, NULL, NULL, 'USU-123/2024', NULL, 8, '2024-06-10', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"Juana","apellido_paterno":"Inés","apellido_materno":"De la Cruz"}',
  '[]', '[]', 3, '[]', 'Prescripción positiva predio almacén', 0, NULL, 'SIN PRONÓSTICO', 'TRAMITE',
  '2024-06-10 11:00:00', NULL, NULL),

(10, 10, 45, 43, 'FEDERAL', 'MERCANTIL', 'Especiales', 'Concursos Mercantiles', 'CM-777', '2024', 'CM-777/2024', NULL, 13, '2024-07-01', 'TERCERO',
  '{"tipo_persona":"MORAL","empresa":"Empresas en Quiebra S.A."}',
  '[{"tipo_persona":"MORAL","empresa":"Juez Concursal"}]', '[]',
  3, '[8,33]', 'Reconocimiento de créditos fiscales (Cuotas)', 4500000.00, 'Lic. Ricardo Monreal Ávila', 'FAVORABLE', 'TRAMITE',
  '2024-07-01 12:00:00', NULL, NULL),

(11, 11, 15, 34, 'FEDERAL', 'MERCANTIL', 'Especiales', 'Especial de Fianzas', 'FIA-888', '2024', 'FIA-888/2024', NULL, 3, '2024-07-15', 'ACTOR',
  '{}', '[{"tipo_persona":"MORAL","empresa":"Afianzadora Nacional"}]', '[]',
  3, '[32]', 'Cobro de fianza por vicios ocultos obra HGR 200', 3000000.00, 'Lic. Laura Esquivel Pérez', 'FAVORABLE', 'TRAMITE',
  '2024-07-15 10:30:00', NULL, NULL),

(12, 12, 5, 13, 'LOCAL', 'CIVIL', 'Ordinario Civil', 'Oral', NULL, NULL, 'CIV-852/2024', NULL, 11, '2024-08-01', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"Pedro","apellido_paterno":"Infante","apellido_materno":"Cruz"}',
  '[]', '[]', 5, '[2,37]', 'Demanda por supuesta mala praxis administrativa', 100000.00, 'Lic. Fernando Ruiz Díaz', 'DESFAVORABLE', 'TRAMITE',
  '2024-08-01 09:00:00', '2025-02-12 10:15:00', '2025-04-01'),

(13, 13, 6, 16, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-ESC-005/2024', NULL, 12, '2024-08-10', 'ACTOR',
  '{}', '[{"tipo_persona":"MORAL","empresa":"Seguridad Privada Colima"}]', '[]',
  9, '[]', 'Rescisión contrato seguridad por incumplimiento', 0, NULL, 'SIN PRONÓSTICO', 'TRAMITE',
  '2024-08-10 14:00:00', NULL, NULL),

(14, 14, 16, 37, 'FEDERAL', 'CIVIL', 'Otro, caso sui generis', NULL, 'OTRO-111', '2024', 'OTRO-111/2024', NULL, 16, '2024-09-01', 'DEMANDADO',
  '{"tipo_persona":"MORAL","empresa":"Sindicato Nacional"}',
  '[]', '[]', 10, '[17]', 'Nulidad de convenio administrativo', 0, NULL, 'DESFAVORABLE', 'TRAMITE',
  '2024-09-01 09:00:00', NULL, NULL),

(15, 15, 8, 22, 'LOCAL', 'CIVIL', 'Ordinario Civil', 'Oral', NULL, NULL, 'CIV-1010/2024', NULL, 10, '2024-09-15', 'ACTOR',
  '{}', '[{"tipo_persona":"FISICA","nombres":"Jorge","apellido_paterno":"Negrete","apellido_materno":"Moreno"}]', '[]',
  1, '[26]', 'Daños a vehículo oficial', 45000.00, NULL, 'FAVORABLE', 'CONCLUIDO',
  '2024-09-15 11:00:00', NULL, NULL),

(16, 16, 10, 25, 'FEDERAL', 'MERCANTIL', 'Otro, caso sui generis', NULL, 'MER-OTR-222', '2024', 'MER-OTR-222/2024', NULL, 14, '2024-10-01', 'DEMANDADO',
  '{"tipo_persona":"MORAL","empresa":"Proveedor de Limpieza S.A."}',
  '[]', '[]', 2, '[21]', 'Reclamo de intereses moratorios', 50000.00, NULL, 'SIN PRONÓSTICO', 'TRAMITE',
  '2024-10-01 12:00:00', NULL, NULL),

(17, 17, 4, 10, 'LOCAL', 'CIVIL', 'Ordinario Civil', 'Escrito', NULL, NULL, 'CIV-CAMP-09/2024', NULL, 9, '2024-10-20', 'ACTOR',
  '{}', '[{"tipo_persona":"MORAL","empresa":"Arrendadora del Golfo"}]', '[]',
  8, '[]', 'Devolución de depósito en garantía', 30000.00, 'Lic. Ana Martínez Solís', 'FAVORABLE', 'TRAMITE',
  '2024-10-20 10:00:00', NULL, NULL),

(18, 18, 12, 31, 'FEDERAL', 'CIVIL', 'Agrario', NULL, 'AGR-GRO-001', '2024', 'AGR-GRO-001/2024', NULL, 18, '2024-11-01', 'DEMANDADO',
  '{"tipo_persona":"FISICA","nombres":"Comunidad","apellido_paterno":"Indígena","apellido_materno":"Tlapa"}',
  '[]', '[]', 4, '[12]', 'Deslinde de terrenos Hospital Rural', 0, 'Lic. Patricia Vega Noriega', 'DESFAVORABLE', 'TRAMITE',
  '2024-11-01 11:00:00', '2025-02-08 17:00:00', '2025-03-01'),

(19, 19, 1, 3, 'LOCAL', 'MERCANTIL', 'Ordinario Mercantil', 'Escrito', NULL, NULL, 'MER-AGS-900/2024', NULL, 6, '2024-11-15', 'DEMANDADO',
  '{"tipo_persona":"MORAL","empresa":"Papelería del Centro"}',
  '[]', '[]', 2, '[21,27]', 'Pago de facturas rezagadas 2023', 15000.00, NULL, 'DESFAVORABLE', 'CONCLUIDO',
  '2024-11-15 12:00:00', NULL, NULL),

(20, 20, 3, 8, 'FEDERAL', 'CIVIL', 'Ordinario Civil', 'Escrito', 'CIV-BCS-777', '2024', 'CIV-BCS-777/2024', NULL, 8, '2024-12-01', 'ACTOR',
  '{}', '[{"tipo_persona":"FISICA","nombres":"Francisco","apellido_paterno":"Villa","apellido_materno":"Arango"}]',
  '[{"tipo_persona":"MORAL","empresa":"Avales Unidos S.A."}]',
  1, '[26,37]', 'Recuperación de gastos por subrogación de servicios', 85000.00, 'Lic. Adriana Soto Mendoza', 'FAVORABLE', 'TRAMITE',
  '2024-12-01 09:00:00', '2025-02-09 08:30:00', '2025-03-10')
ON CONFLICT (id) DO NOTHING;

SELECT setval('expedientes_civil_id_seq', 20);

-- Acumulados
INSERT INTO acumulados_civil (caso_padre_id, caso_hijo_id) VALUES
(1, 2), (1, 3), (4, 5)
ON CONFLICT DO NOTHING;

-- Seguimiento civil
INSERT INTO seguimiento_civil (expediente_id, fecha_actuacion, tipo_actuacion, descripcion, actualizado_siij) VALUES
(1, '2025-02-10', 'Audiencia', 'Se llevó a cabo audiencia de pruebas y alegatos. El juzgado admitió las pruebas documentales. Se fijó fecha para siguiente audiencia.', 'SI'),
(4, '2025-02-11', 'Promoción', 'Se presentó promoción solicitando prórroga para desahogo de pruebas periciales. El tribunal acordó favorablemente.', 'PENDIENTE'),
(12, '2025-02-12', 'Contestación', 'Se presentó contestación de demanda. Se opusieron excepciones de falta de legitimación activa y prescripción de la acción.', 'SI'),
(18, '2025-02-08', 'Acuerdo', 'El tribunal agrario emitió acuerdo requiriendo la presentación de documentos que acrediten la propiedad del terreno en disputa. Plazo de 10 días hábiles.', 'NO'),
(20, '2025-02-09', 'Desahogo', 'Se desahogó prueba pericial en grafoscopía. El perito ratificó su dictamen favorable. La contraparte no presentó objeciones.', 'SI');

-- =====================================================
-- EXPEDIENTES PENAL (datos dummy)
-- =====================================================
INSERT INTO expedientes_penal (id, numero, delegacion_id, numero_expediente, fecha_inicio, delito_id, denunciante, probable_responsable, fecha_conocimiento_amp, estado_procesal_id, acciones_pendientes, fecha_judicializacion, determinacion_judicial, sentencia, fecha_sentencia, fecha_conclusion, dato_relevante, estatus, abogado_responsable, fecha_creacion, fecha_actualizacion) VALUES
(1, 1, 7, 'PEN-CHS-001/2024', '2024-03-15', 1,
  '{"tipo_persona":"MORAL","empresa":"Delegación Chiapas"}',
  '{"tipo_persona":"FISICA","nombres":"Miguel","apellido_paterno":"Hernández","apellido_materno":"Cruz"}',
  '2024-03-16', 4, 'Dar seguimiento a la audiencia de juicio oral programada para el 15/04/2025',
  '2024-08-20', 'Vinculado a proceso', NULL, NULL, NULL,
  'Robo de equipo médico del almacén del HGZ No. 1', 'TRAMITE', 'Lic. Fernando Ruiz Díaz',
  '2024-03-15 09:00:00', '2025-03-01 10:00:00'),

(2, 2, 7, 'PEN-CHS-002/2024', '2024-05-10', 3,
  '{"tipo_persona":"MORAL","empresa":"Delegación Chiapas"}',
  '{"tipo_persona":"FISICA","nombres":"Laura","apellido_paterno":"Mendoza","apellido_materno":"Ruiz"}',
  '2024-05-11', 2, 'Solicitar informe pericial contable al MP',
  NULL, NULL, NULL, NULL, NULL,
  'Fraude en licitación de servicios de limpieza', 'TRAMITE', 'Lic. Patricia Vega Noriega',
  '2024-05-10 11:00:00', '2025-02-15 14:00:00'),

(3, 3, 2, 'PEN-BC-001/2024', '2024-06-01', 5,
  '{"tipo_persona":"MORAL","empresa":"Delegación Baja California"}',
  '{"tipo_persona":"FISICA","nombres":"Ricardo","apellido_paterno":"Salinas","apellido_materno":"Pliego"}',
  '2024-06-02', 5, NULL,
  '2024-09-15', 'Sentencia condenatoria', 'FAVORABLE', '2025-01-20', '2025-01-20',
  'Daño a equipo de rayos X por negligencia', 'CONCLUIDO', 'Lic. Adriana Soto Mendoza',
  '2024-06-01 10:00:00', '2025-01-20 16:00:00'),

(4, 4, 1, 'PEN-AGS-001/2024', '2024-07-20', 10,
  '{"tipo_persona":"MORAL","empresa":"Delegación Aguascalientes"}',
  '{"tipo_persona":"FISICA","nombres":"José","apellido_paterno":"García","apellido_materno":"López"}',
  '2024-07-21', 1, 'El MP solicitó ampliación de declaración del denunciante',
  NULL, NULL, NULL, NULL, NULL,
  'Presentación de recetas médicas falsas para obtener medicamentos controlados', 'TRAMITE', 'Lic. Ana Martínez Solís',
  '2024-07-20 09:30:00', '2025-02-28 11:00:00'),

(5, 5, 43, 'PEN-DFN-001/2024', '2024-08-05', 16,
  '{"tipo_persona":"MORAL","empresa":"Delegación Norte DF"}',
  '{"tipo_persona":"FISICA","nombres":"Servidor","apellido_paterno":"Público","apellido_materno":"Federal"}',
  '2024-08-06', 3, 'Audiencia de etapa intermedia programada para 20/04/2025',
  '2024-11-10', 'Vinculado a proceso', NULL, NULL, NULL,
  'Peculado de recursos destinados a mantenimiento de equipos médicos', 'TRAMITE', 'Lic. Ricardo Monreal Ávila',
  '2024-08-05 14:00:00', '2025-03-10 09:00:00'),

(6, 6, 5, 'PEN-COA-001/2024', '2024-09-12', 12,
  '{"tipo_persona":"MORAL","empresa":"Delegación Coahuila"}',
  '{"tipo_persona":"FISICA","nombres":"Grupo","apellido_paterno":"Invasor","apellido_materno":"Desconocido"}',
  '2024-09-13', 1, 'Solicitar medidas cautelares para proteger el inmueble',
  NULL, NULL, NULL, NULL, NULL,
  'Despojo de terreno aledaño a la UMF No. 5 en Torreón', 'TRAMITE', 'Lic. Fernando Ruiz Díaz',
  '2024-09-12 10:00:00', '2025-01-15 13:00:00'),

(7, 7, 11, 'PEN-GTO-001/2024', '2024-10-01', 7,
  '{"tipo_persona":"FISICA","nombres":"Familia","apellido_paterno":"del","apellido_materno":"Paciente"}',
  '{"tipo_persona":"FISICA","nombres":"Dr. Médico","apellido_paterno":"Residente","apellido_materno":"HGZ"}',
  '2024-10-02', 5, NULL,
  '2024-12-01', 'Sentencia absolutoria', 'FAVORABLE', '2025-02-10', '2025-02-10',
  'Denuncia por homicidio culposo durante intervención quirúrgica - se determinó que no hubo negligencia', 'CONCLUIDO', 'Lic. Miguel Ángel Torres',
  '2024-10-01 08:00:00', '2025-02-10 17:00:00'),

(8, 8, 7, 'PEN-CHS-003/2025', '2025-01-15', 4,
  '{"tipo_persona":"MORAL","empresa":"Delegación Chiapas"}',
  '{"tipo_persona":"FISICA","nombres":"Empleado","apellido_paterno":"Administrativo","apellido_materno":"X"}',
  '2025-01-16', 1, 'Integrar carpeta de investigación con auditoría interna',
  NULL, NULL, NULL, NULL, NULL,
  'Abuso de confianza por desvío de insumos del almacén general', 'TRAMITE', 'Lic. Fernando Ruiz Díaz',
  '2025-01-15 09:00:00', '2025-03-20 10:00:00')
ON CONFLICT (id) DO NOTHING;

SELECT setval('expedientes_penal_id_seq', 8);

-- Seguimiento penal
INSERT INTO seguimiento_penal (expediente_id, fecha_actuacion, tipo_actuacion, descripcion) VALUES
(1, '2024-03-16', 'Denuncia', 'Se presentó denuncia ante el Ministerio Público por robo de equipo médico.'),
(1, '2024-05-20', 'Investigación', 'El MP recabó videos de vigilancia y declaraciones de testigos.'),
(1, '2024-08-20', 'Vinculación a proceso', 'Juez de Control dictó auto de vinculación a proceso contra el imputado.'),
(1, '2025-03-01', 'Audiencia', 'Se programó audiencia de juicio oral para el 15/04/2025.'),
(2, '2024-05-11', 'Querella', 'Se presentó querella por fraude en proceso de licitación.'),
(2, '2024-08-15', 'Investigación', 'Se solicitó peritaje contable sobre las facturas presentadas.'),
(2, '2025-02-15', 'Promoción', 'Se promovió ante el MP la ampliación de la investigación a otros proveedores.'),
(3, '2024-06-02', 'Denuncia', 'Denuncia por daño a equipo de rayos X valorado en $2,500,000.'),
(3, '2024-09-15', 'Vinculación a proceso', 'Vinculación a proceso del imputado.'),
(3, '2025-01-20', 'Sentencia', 'Sentencia condenatoria. Se ordenó reparación del daño.'),
(4, '2024-07-21', 'Denuncia', 'Se presentó denuncia por falsificación de recetas médicas.'),
(4, '2025-02-28', 'Investigación', 'El MP solicitó ampliación de declaración del denunciante.'),
(5, '2024-08-06', 'Denuncia', 'Denuncia por peculado de recursos de mantenimiento.'),
(5, '2024-11-10', 'Vinculación a proceso', 'Auto de vinculación a proceso.'),
(5, '2025-03-10', 'Audiencia', 'Se programó audiencia de etapa intermedia para 20/04/2025.'),
(6, '2024-09-13', 'Denuncia', 'Denuncia por despojo de terreno institucional.'),
(6, '2025-01-15', 'Promoción', 'Se solicitaron medidas cautelares para protección del inmueble.'),
(7, '2024-10-02', 'Querella', 'Querella por homicidio culposo durante cirugía.'),
(7, '2024-12-01', 'Vinculación a proceso', 'Vinculación a proceso del médico residente.'),
(7, '2025-02-10', 'Sentencia', 'Sentencia absolutoria. Se determinó que no hubo negligencia médica.'),
(8, '2025-01-16', 'Denuncia', 'Denuncia por abuso de confianza y desvío de insumos.'),
(8, '2025-03-20', 'Investigación', 'Se inició auditoría interna para cuantificar el daño patrimonial.');
