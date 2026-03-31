-- =====================================================
-- SCHEMA: Sistema de Seguimiento de Asuntos IMSS
-- Ejecutar en Supabase SQL Editor
-- =====================================================

-- =====================================================
-- CATÁLOGOS
-- =====================================================

-- Delegaciones (OOAD / JSJ)
CREATE TABLE IF NOT EXISTS delegaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  estado TEXT NOT NULL
);

-- Áreas generadoras (por delegación)
CREATE TABLE IF NOT EXISTS areas (
  id SERIAL PRIMARY KEY,
  delegacion_id INT NOT NULL REFERENCES delegaciones(id),
  nombre TEXT NOT NULL
);

-- Tribunales / Juzgados
CREATE TABLE IF NOT EXISTS tribunales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  delegacion_id INT REFERENCES delegaciones(id)
);

-- Prestaciones (catálogo civil/mercantil)
CREATE TABLE IF NOT EXISTS prestaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

-- Tipos de actuación (compartido civil + penal)
CREATE TABLE IF NOT EXISTS tipos_actuacion (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  modulo TEXT NOT NULL DEFAULT 'AMBOS' -- 'CIVIL', 'PENAL', 'AMBOS'
);

-- Tipos de juicio civil/mercantil
CREATE TABLE IF NOT EXISTS tipos_juicio (
  id SERIAL PRIMARY KEY,
  materia TEXT NOT NULL, -- 'CIVIL', 'MERCANTIL', 'AMPARO INDIRECTO'
  nombre TEXT NOT NULL,
  jurisdiccion TEXT, -- 'LOCAL', 'FEDERAL', 'AMBAS'
  requiere_descripcion BOOLEAN DEFAULT FALSE
);

-- Subtipos de juicio
CREATE TABLE IF NOT EXISTS subtipos_juicio (
  id SERIAL PRIMARY KEY,
  tipo_juicio_id INT NOT NULL REFERENCES tipos_juicio(id),
  nombre TEXT NOT NULL,
  jurisdiccion TEXT -- 'LOCAL', 'FEDERAL', 'AMBAS'
);

-- Delitos (catálogo penal)
CREATE TABLE IF NOT EXISTS delitos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  fuero TEXT NOT NULL DEFAULT 'COMUN' -- 'COMUN', 'FEDERAL'
);

-- Estados procesales (catálogo penal)
CREATE TABLE IF NOT EXISTS estados_procesales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  orden INT NOT NULL,
  descripcion TEXT
);

-- =====================================================
-- USUARIOS
-- =====================================================

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nombre_completo TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'consulta', -- 'admin', 'editor', 'consulta'
  delegacion_id INT REFERENCES delegaciones(id),
  permiso_civil_mercantil BOOLEAN DEFAULT TRUE,
  permiso_penal BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- EXPEDIENTES CIVIL / MERCANTIL
-- =====================================================

CREATE TABLE IF NOT EXISTS expedientes_civil (
  id SERIAL PRIMARY KEY,
  numero INT,
  delegacion_id INT NOT NULL REFERENCES delegaciones(id),
  area_generadora_id INT REFERENCES areas(id),
  jurisdiccion TEXT NOT NULL, -- 'LOCAL', 'FEDERAL'
  tipo_juicio TEXT NOT NULL, -- 'CIVIL', 'MERCANTIL', 'AMPARO INDIRECTO'
  subtipo_juicio TEXT,
  sub_subtipo_juicio TEXT,
  numero_juicio TEXT,
  anio TEXT,
  numero_expediente TEXT NOT NULL,
  acumulado_a INT REFERENCES expedientes_civil(id),
  tribunal_id INT REFERENCES tribunales(id),
  fecha_inicio DATE,
  imss_es TEXT NOT NULL DEFAULT 'DEMANDADO', -- 'ACTOR', 'DEMANDADO', 'TERCERO'
  actor JSONB, -- {tipo_persona, nombres, apellido_paterno, apellido_materno, empresa}
  demandados JSONB DEFAULT '[]'::jsonb,
  codemandados JSONB DEFAULT '[]'::jsonb,
  prestacion_principal INT REFERENCES prestaciones(id),
  prestaciones_secundarias JSONB DEFAULT '[]'::jsonb, -- array de IDs
  prestaciones_notas TEXT,
  importe_demandado NUMERIC(15,2) DEFAULT 0,
  abogado_responsable TEXT,
  pronostico TEXT DEFAULT 'SIN PRONÓSTICO', -- 'FAVORABLE', 'DESFAVORABLE', 'SIN PRONÓSTICO'
  estatus TEXT NOT NULL DEFAULT 'TRAMITE', -- 'TRAMITE', 'CONCLUIDO'
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_vencimiento DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguimiento civil (timeline de actuaciones)
CREATE TABLE IF NOT EXISTS seguimiento_civil (
  id SERIAL PRIMARY KEY,
  expediente_id INT NOT NULL REFERENCES expedientes_civil(id) ON DELETE CASCADE,
  fecha_actuacion DATE NOT NULL,
  tipo_actuacion TEXT NOT NULL,
  descripcion TEXT,
  actualizado_siij TEXT DEFAULT 'NO', -- 'SI', 'NO'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Juicios acumulados (relación many-to-many)
CREATE TABLE IF NOT EXISTS acumulados_civil (
  id SERIAL PRIMARY KEY,
  caso_padre_id INT NOT NULL REFERENCES expedientes_civil(id) ON DELETE CASCADE,
  caso_hijo_id INT NOT NULL REFERENCES expedientes_civil(id) ON DELETE CASCADE,
  UNIQUE(caso_padre_id, caso_hijo_id)
);

-- =====================================================
-- EXPEDIENTES PENAL
-- =====================================================

CREATE TABLE IF NOT EXISTS expedientes_penal (
  id SERIAL PRIMARY KEY,
  numero INT,
  delegacion_id INT NOT NULL REFERENCES delegaciones(id),
  numero_expediente TEXT NOT NULL,
  fecha_inicio DATE,
  delito_id INT REFERENCES delitos(id),
  denunciante JSONB, -- {tipo_persona, nombres, apellido_paterno, apellido_materno, empresa}
  probable_responsable JSONB, -- {tipo_persona, nombres, apellido_paterno, apellido_materno, empresa}
  fecha_conocimiento_amp DATE,
  estado_procesal_id INT REFERENCES estados_procesales(id),
  acciones_pendientes TEXT,
  fecha_judicializacion DATE,
  determinacion_judicial TEXT,
  sentencia TEXT, -- 'FAVORABLE', 'DESFAVORABLE', NULL
  fecha_sentencia DATE,
  fecha_conclusion DATE,
  dato_relevante TEXT,
  estatus TEXT NOT NULL DEFAULT 'TRAMITE', -- 'TRAMITE', 'CONCLUIDO'
  abogado_responsable TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seguimiento penal (timeline de actuaciones)
CREATE TABLE IF NOT EXISTS seguimiento_penal (
  id SERIAL PRIMARY KEY,
  expediente_id INT NOT NULL REFERENCES expedientes_penal(id) ON DELETE CASCADE,
  fecha_actuacion DATE NOT NULL,
  tipo_actuacion TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- RLS (Row Level Security) - Deshabilitado para maqueta
-- En producción se habilitaría RLS con políticas por delegación
-- =====================================================

-- Permitir acceso anónimo para la maqueta (sin auth de Supabase)
ALTER TABLE delegaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tribunales ENABLE ROW LEVEL SECURITY;
ALTER TABLE prestaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_actuacion ENABLE ROW LEVEL SECURITY;
ALTER TABLE tipos_juicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtipos_juicio ENABLE ROW LEVEL SECURITY;
ALTER TABLE delitos ENABLE ROW LEVEL SECURITY;
ALTER TABLE estados_procesales ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedientes_civil ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento_civil ENABLE ROW LEVEL SECURITY;
ALTER TABLE acumulados_civil ENABLE ROW LEVEL SECURITY;
ALTER TABLE expedientes_penal ENABLE ROW LEVEL SECURITY;
ALTER TABLE seguimiento_penal ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para anon (maqueta)
CREATE POLICY "Acceso público lectura" ON delegaciones FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON areas FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON tribunales FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON prestaciones FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON tipos_actuacion FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON tipos_juicio FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON subtipos_juicio FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON delitos FOR SELECT TO anon USING (true);
CREATE POLICY "Acceso público lectura" ON estados_procesales FOR SELECT TO anon USING (true);

CREATE POLICY "Acceso completo" ON usuarios FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo" ON expedientes_civil FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo" ON seguimiento_civil FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo" ON acumulados_civil FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo" ON expedientes_penal FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Acceso completo" ON seguimiento_penal FOR ALL TO anon USING (true) WITH CHECK (true);
