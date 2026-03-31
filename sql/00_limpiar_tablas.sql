-- =====================================================
-- LIMPIAR TODAS LAS TABLAS
-- Copiar y pegar en Supabase SQL Editor
-- Ejecutar ANTES de volver a insertar datos
-- =====================================================

-- Primero las tablas hijas (que tienen FK), luego las padres
TRUNCATE TABLE seguimiento_penal CASCADE;
TRUNCATE TABLE seguimiento_civil CASCADE;
TRUNCATE TABLE acumulados_civil CASCADE;
TRUNCATE TABLE expedientes_penal CASCADE;
TRUNCATE TABLE expedientes_civil CASCADE;
TRUNCATE TABLE usuarios CASCADE;
TRUNCATE TABLE subtipos_juicio CASCADE;
TRUNCATE TABLE tipos_juicio CASCADE;
TRUNCATE TABLE tipos_actuacion CASCADE;
TRUNCATE TABLE prestaciones CASCADE;
TRUNCATE TABLE estados_procesales CASCADE;
TRUNCATE TABLE delitos CASCADE;
TRUNCATE TABLE tribunales CASCADE;
TRUNCATE TABLE areas CASCADE;
TRUNCATE TABLE delegaciones CASCADE;

-- Reiniciar los contadores de ID para que empiecen desde 1
ALTER SEQUENCE delegaciones_id_seq RESTART WITH 1;
ALTER SEQUENCE areas_id_seq RESTART WITH 1;
ALTER SEQUENCE tribunales_id_seq RESTART WITH 1;
ALTER SEQUENCE prestaciones_id_seq RESTART WITH 1;
ALTER SEQUENCE tipos_actuacion_id_seq RESTART WITH 1;
ALTER SEQUENCE tipos_juicio_id_seq RESTART WITH 1;
ALTER SEQUENCE subtipos_juicio_id_seq RESTART WITH 1;
ALTER SEQUENCE delitos_id_seq RESTART WITH 1;
ALTER SEQUENCE estados_procesales_id_seq RESTART WITH 1;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE expedientes_civil_id_seq RESTART WITH 1;
ALTER SEQUENCE seguimiento_civil_id_seq RESTART WITH 1;
ALTER SEQUENCE acumulados_civil_id_seq RESTART WITH 1;
ALTER SEQUENCE expedientes_penal_id_seq RESTART WITH 1;
ALTER SEQUENCE seguimiento_penal_id_seq RESTART WITH 1;
