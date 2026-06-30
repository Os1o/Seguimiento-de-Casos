-- =====================================================
-- SCHEMA LOCAL POSTGRESQL
-- Basado en bd.sql, adaptado para ejecucion local
-- sin dependencias de Supabase/RLS.
-- =====================================================

CREATE TABLE IF NOT EXISTS public.delegaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  estado TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.areas (
  id SERIAL PRIMARY KEY,
  delegacion_id INT NOT NULL REFERENCES public.delegaciones(id),
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tribunales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  delegacion_id INT REFERENCES public.delegaciones(id)
);

CREATE TABLE IF NOT EXISTS public.prestaciones (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.tipos_actuacion (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  modulo TEXT NOT NULL DEFAULT 'AMBOS'
);

CREATE TABLE IF NOT EXISTS public.tipos_juicio (
  id SERIAL PRIMARY KEY,
  materia TEXT NOT NULL,
  nombre TEXT NOT NULL,
  jurisdiccion TEXT,
  requiere_descripcion BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.subtipos_juicio (
  id SERIAL PRIMARY KEY,
  tipo_juicio_id INT NOT NULL REFERENCES public.tipos_juicio(id),
  nombre TEXT NOT NULL,
  jurisdiccion TEXT
);

CREATE TABLE IF NOT EXISTS public.delitos (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  fuero TEXT NOT NULL DEFAULT 'COMUN'
);

CREATE TABLE IF NOT EXISTS public.estados_procesales (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL,
  orden INT NOT NULL,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS public.estatus_investigacion (
  id SERIAL PRIMARY KEY,
  nombre TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.usuarios (
  id SERIAL PRIMARY KEY,
  usuario TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  nombre_completo TEXT NOT NULL,
  rol TEXT NOT NULL DEFAULT 'consulta',
  delegacion_id INT REFERENCES public.delegaciones(id),
  permiso_civil_mercantil BOOLEAN DEFAULT TRUE,
  permiso_penal BOOLEAN DEFAULT FALSE,
  alcance_global BOOLEAN DEFAULT FALSE,
  es_abogado BOOLEAN DEFAULT FALSE,
  es_jefe BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.expedientes_civil (
  id SERIAL PRIMARY KEY,
  numero INT,
  delegacion_id INT NOT NULL REFERENCES public.delegaciones(id),
  area_generadora_id INT REFERENCES public.areas(id),
  jurisdiccion TEXT NOT NULL,
  tipo_juicio TEXT NOT NULL,
  subtipo_juicio TEXT,
  sub_subtipo_juicio TEXT,
  numero_juicio TEXT,
  anio TEXT,
  numero_expediente TEXT NOT NULL,
  acumulado_a INT REFERENCES public.expedientes_civil(id),
  tribunal_id INT REFERENCES public.tribunales(id),
  fecha_inicio DATE,
  imss_es TEXT NOT NULL DEFAULT 'DEMANDADO',
  actor JSONB,
  demandados JSONB DEFAULT '[]'::jsonb,
  codemandados JSONB DEFAULT '[]'::jsonb,
  prestacion_principal INT REFERENCES public.prestaciones(id),
  prestaciones_secundarias JSONB DEFAULT '[]'::jsonb,
  prestaciones_notas TEXT,
  importe_demandado NUMERIC(15,2) DEFAULT 0,
  abogado_responsable_id INT REFERENCES public.usuarios(id),
  pronostico TEXT DEFAULT 'SIN PRONOSTICO',
  estatus TEXT NOT NULL DEFAULT 'TRAMITE',
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_vencimiento DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seguimiento_civil (
  id SERIAL PRIMARY KEY,
  expediente_id INT NOT NULL REFERENCES public.expedientes_civil(id) ON DELETE CASCADE,
  fecha_actuacion DATE NOT NULL,
  tipo_actuacion TEXT NOT NULL,
  descripcion TEXT,
  actualizado_siij TEXT DEFAULT 'NO',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.acumulados_civil (
  id SERIAL PRIMARY KEY,
  caso_padre_id INT NOT NULL REFERENCES public.expedientes_civil(id) ON DELETE CASCADE,
  caso_hijo_id INT NOT NULL REFERENCES public.expedientes_civil(id) ON DELETE CASCADE,
  UNIQUE(caso_padre_id, caso_hijo_id)
);

CREATE TABLE IF NOT EXISTS public.expedientes_penal (
  id SERIAL PRIMARY KEY,
  numero INT,
  delegacion_id INT NOT NULL REFERENCES public.delegaciones(id),
  numero_expediente TEXT NOT NULL,
  fecha_inicio DATE,
  delito_id INT REFERENCES public.delitos(id),
  denunciante JSONB,
  probable_responsable JSONB,
  fecha_conocimiento_amp DATE,
  estado_procesal_id INT REFERENCES public.estados_procesales(id),
  acciones_pendientes TEXT,
  fecha_judicializacion DATE,
  determinacion_judicial TEXT,
  sentencia TEXT,
  fecha_sentencia DATE,
  fecha_conclusion DATE,
  dato_relevante TEXT,
  estatus TEXT NOT NULL DEFAULT 'TRAMITE',
  abogado_responsable TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.seguimiento_penal (
  id SERIAL PRIMARY KEY,
  expediente_id INT NOT NULL REFERENCES public.expedientes_penal(id) ON DELETE CASCADE,
  fecha_actuacion DATE NOT NULL,
  tipo_actuacion TEXT NOT NULL,
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
