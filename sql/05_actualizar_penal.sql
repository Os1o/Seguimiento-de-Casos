-- =====================================================
-- ACTUALIZACIÓN PENAL: nuevos catálogos + nueva columna
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- 1. Agregar columna "estatus_investigacion_jsj" a expedientes_penal
ALTER TABLE expedientes_penal
ADD COLUMN IF NOT EXISTS estatus_investigacion_jsj TEXT;

-- 2. Limpiar catálogos anteriores de delitos y estados procesales
TRUNCATE TABLE delitos CASCADE;
TRUNCATE TABLE estados_procesales CASCADE;
ALTER SEQUENCE delitos_id_seq RESTART WITH 1;
ALTER SEQUENCE estados_procesales_id_seq RESTART WITH 1;

-- 3. Crear tabla para estatus de investigación JSJ (catálogo nuevo)
CREATE TABLE IF NOT EXISTS estatus_investigacion (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- RLS para la nueva tabla
ALTER TABLE estatus_investigacion ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Acceso público lectura" ON estatus_investigacion FOR SELECT TO anon USING (true);

-- 4. Insertar catálogo ESTATUS DE INVESTIGACION JSJ (7 valores)
INSERT INTO estatus_investigacion (id, nombre) VALUES
(1, 'ACUERDO REPARATORIO'),
(2, 'EN TRÁMITE'),
(3, 'CONCLUIDO'),
(4, 'INCOMPETENCIA'),
(5, 'NO EJERCICIO DE LA ACCIÓN PENAL'),
(6, 'SE SEÑALA NUEVA FECHA PARA AUDIENCIA DE JUICIO ORAL'),
(7, 'CAUSA PENAL');

SELECT setval('estatus_investigacion_id_seq', 7);

-- 5. Insertar catálogo DELITOS reales (34 valores)
INSERT INTO delitos (id, nombre, fuero) VALUES
(1, 'ABUSO DE CONFIANZA', 'COMUN'),
(2, 'ACCESO ILICITO A SISTEMAS DE INFORMATICA', 'COMUN'),
(3, 'AMENAZAS Y PORTACIÓN DE ARMA DE FUEGO', 'COMUN'),
(4, 'ART. 211-BIS CP REVELAR COMUNICACIÓN INTERNA RESERVADA', 'COMUN'),
(5, 'COHECHO', 'COMUN'),
(6, 'DAÑO EN PROPIEDAD PRIVADA', 'COMUN'),
(7, 'DAÑOS', 'COMUN'),
(8, 'DAÑOS DOLOSOS', 'COMUN'),
(9, 'DAÑOS EN REJA', 'COMUN'),
(10, 'DEFRAUDACIÓN', 'COMUN'),
(11, 'FALSEDAD ANTE AUTORIDAD', 'COMUN'),
(12, 'FALSIFICACION DE DOC.', 'COMUN'),
(13, 'FALSIFICACIÓN DE DOCUMENTOS', 'COMUN'),
(14, 'FALSIFICACION DE DOCUMENTOS Y FRAUDE', 'COMUN'),
(15, 'FALSIFICACION Y USO DE DOCUMENTOS FALSOS Y ALTERADOS', 'COMUN'),
(16, 'FALSIFICACION Y USO DE DOCUMENTOS. USURPACION DE IDENTIDAD', 'COMUN'),
(17, 'FRAUDE', 'COMUN'),
(18, 'FRAUDE ESPECÍFICO', 'COMUN'),
(19, 'FRAUDE PENSIÓN POR VIUDEZ', 'COMUN'),
(20, 'HOMICIDIO POR OMISIÓN EN AGRAVIO', 'COMUN'),
(21, 'HOSTIGAMIENTO SEXUAL', 'COMUN'),
(22, 'LESIONES', 'COMUN'),
(23, 'LESIONES DOLOSAS Y OMISION DE CUIDADO', 'COMUN'),
(24, 'RESPONSABILIDAD PROFESIONAL', 'COMUN'),
(25, 'RESPONSABILIDAD PROFESIONAL (ABANDONO DE TRABAJO)', 'COMUN'),
(26, 'RESPONSABILIDAD PROFESIONAL HOMICIDIO POR OMISION', 'COMUN'),
(27, 'ROBO', 'COMUN'),
(28, 'ROBO CON VIOLENCIA', 'COMUN'),
(29, 'ROBO DE CRANEOTOMO EN QUIROFANO CENTRAL DEL H.G.R. 1', 'COMUN'),
(30, 'ROBO DE MEDICAMENTO', 'COMUN'),
(31, 'ROBO DE MICROONDAS', 'COMUN'),
(32, 'ROBO EN LUGAR CERRADO', 'COMUN'),
(33, 'ROBO EN LUGAR CERRADO Y DAÑOS', 'COMUN'),
(34, 'ROBO/ABUSO DE CONFIANZA', 'COMUN'),
(35, 'SUPLANTACION DE IDENTIDAD', 'COMUN');

SELECT setval('delitos_id_seq', 35);

-- 6. Insertar catálogo ESTADO PROCESAL (3 valores)
INSERT INTO estados_procesales (id, nombre, orden, descripcion) VALUES
(1, 'Etapa de investigación', 1, 'Etapa donde se investigan los hechos delictivos.'),
(2, 'Etapa intermedia o etapa de preparación a juicio', 2, 'Fase de preparación y descubrimiento probatorio previo al juicio.'),
(3, 'Etapa de juicio oral', 3, 'Desahogo de pruebas, alegatos y emisión de sentencia en audiencia pública.');

SELECT setval('estados_procesales_id_seq', 3);

-- 7. Actualizar datos dummy penales para usar los nuevos catálogos
UPDATE expedientes_penal SET delito_id = 27, estatus_investigacion_jsj = 'EN TRÁMITE' WHERE id = 1;
UPDATE expedientes_penal SET delito_id = 17, estatus_investigacion_jsj = 'EN TRÁMITE' WHERE id = 2;
UPDATE expedientes_penal SET delito_id = 7, estatus_investigacion_jsj = 'CONCLUIDO' WHERE id = 3;
UPDATE expedientes_penal SET delito_id = 13, estatus_investigacion_jsj = 'EN TRÁMITE' WHERE id = 4;
UPDATE expedientes_penal SET delito_id = 5, estatus_investigacion_jsj = 'CAUSA PENAL' WHERE id = 5;
UPDATE expedientes_penal SET delito_id = 7, estatus_investigacion_jsj = 'EN TRÁMITE' WHERE id = 6;
UPDATE expedientes_penal SET delito_id = 20, estatus_investigacion_jsj = 'CONCLUIDO' WHERE id = 7;
UPDATE expedientes_penal SET delito_id = 1, estatus_investigacion_jsj = 'EN TRÁMITE' WHERE id = 8;

-- Actualizar estado_procesal_id para que use los nuevos IDs (1, 2 o 3)
UPDATE expedientes_penal SET estado_procesal_id = 3 WHERE id = 1; -- Juicio oral
UPDATE expedientes_penal SET estado_procesal_id = 1 WHERE id = 2; -- Investigación
UPDATE expedientes_penal SET estado_procesal_id = 3 WHERE id = 3; -- Juicio oral (concluido)
UPDATE expedientes_penal SET estado_procesal_id = 1 WHERE id = 4; -- Investigación
UPDATE expedientes_penal SET estado_procesal_id = 2 WHERE id = 5; -- Intermedia
UPDATE expedientes_penal SET estado_procesal_id = 1 WHERE id = 6; -- Investigación
UPDATE expedientes_penal SET estado_procesal_id = 3 WHERE id = 7; -- Juicio oral (concluido)
UPDATE expedientes_penal SET estado_procesal_id = 1 WHERE id = 8; -- Investigación
