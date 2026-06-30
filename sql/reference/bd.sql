-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.acumulados_civil (
  id integer NOT NULL DEFAULT nextval('acumulados_civil_id_seq'::regclass),
  caso_padre_id integer NOT NULL,
  caso_hijo_id integer NOT NULL,
  CONSTRAINT acumulados_civil_pkey PRIMARY KEY (id),
  CONSTRAINT acumulados_civil_caso_padre_id_fkey FOREIGN KEY (caso_padre_id) REFERENCES public.expedientes_civil(id),
  CONSTRAINT acumulados_civil_caso_hijo_id_fkey FOREIGN KEY (caso_hijo_id) REFERENCES public.expedientes_civil(id)
);
CREATE TABLE public.areas (
  id integer NOT NULL DEFAULT nextval('areas_id_seq'::regclass),
  delegacion_id integer NOT NULL,
  nombre text NOT NULL,
  CONSTRAINT areas_pkey PRIMARY KEY (id),
  CONSTRAINT areas_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id)
);
CREATE TABLE public.delegaciones (
  id integer NOT NULL DEFAULT nextval('delegaciones_id_seq'::regclass),
  nombre text NOT NULL,
  estado text NOT NULL,
  CONSTRAINT delegaciones_pkey PRIMARY KEY (id)
);
CREATE TABLE public.delitos (
  id integer NOT NULL DEFAULT nextval('delitos_id_seq'::regclass),
  nombre text NOT NULL,
  fuero text NOT NULL DEFAULT 'COMUN'::text,
  CONSTRAINT delitos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.estados_procesales (
  id integer NOT NULL DEFAULT nextval('estados_procesales_id_seq'::regclass),
  nombre text NOT NULL,
  orden integer NOT NULL,
  descripcion text,
  CONSTRAINT estados_procesales_pkey PRIMARY KEY (id)
);
CREATE TABLE public.estatus_investigacion (
  id integer NOT NULL DEFAULT nextval('estatus_investigacion_id_seq'::regclass),
  nombre text NOT NULL,
  CONSTRAINT estatus_investigacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.expedientes_civil (
  id integer NOT NULL DEFAULT nextval('expedientes_civil_id_seq'::regclass),
  numero integer,
  delegacion_id integer NOT NULL,
  area_generadora_id integer,
  jurisdiccion text NOT NULL,
  tipo_juicio text NOT NULL,
  subtipo_juicio text,
  sub_subtipo_juicio text,
  numero_juicio text,
  anio text,
  numero_expediente text NOT NULL,
  acumulado_a integer,
  tribunal_id integer,
  fecha_inicio date,
  imss_es text NOT NULL DEFAULT 'DEMANDADO'::text,
  actor jsonb,
  demandados jsonb DEFAULT '[]'::jsonb,
  codemandados jsonb DEFAULT '[]'::jsonb,
  prestacion_principal integer,
  prestaciones_secundarias jsonb DEFAULT '[]'::jsonb,
  prestaciones_notas text,
  importe_demandado numeric DEFAULT 0,
  abogado_responsable text,
  pronostico text DEFAULT 'SIN PRONÓSTICO'::text,
  estatus text NOT NULL DEFAULT 'TRAMITE'::text,
  fecha_creacion timestamp with time zone DEFAULT now(),
  fecha_actualizacion timestamp with time zone DEFAULT now(),
  fecha_vencimiento date,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expedientes_civil_pkey PRIMARY KEY (id),
  CONSTRAINT expedientes_civil_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id),
  CONSTRAINT expedientes_civil_area_generadora_id_fkey FOREIGN KEY (area_generadora_id) REFERENCES public.areas(id),
  CONSTRAINT expedientes_civil_acumulado_a_fkey FOREIGN KEY (acumulado_a) REFERENCES public.expedientes_civil(id),
  CONSTRAINT expedientes_civil_tribunal_id_fkey FOREIGN KEY (tribunal_id) REFERENCES public.tribunales(id),
  CONSTRAINT expedientes_civil_prestacion_principal_fkey FOREIGN KEY (prestacion_principal) REFERENCES public.prestaciones(id)
);
CREATE TABLE public.expedientes_penal (
  id integer NOT NULL DEFAULT nextval('expedientes_penal_id_seq'::regclass),
  numero integer,
  delegacion_id integer NOT NULL,
  numero_expediente text NOT NULL,
  fecha_inicio date,
  delito_id integer,
  denunciante jsonb,
  probable_responsable jsonb,
  fecha_conocimiento_amp date,
  estado_procesal_id integer,
  acciones_pendientes text,
  fecha_judicializacion date,
  determinacion_judicial text,
  sentencia text,
  fecha_sentencia date,
  fecha_conclusion date,
  dato_relevante text,
  estatus text NOT NULL DEFAULT 'TRAMITE'::text,
  abogado_responsable text,
  fecha_creacion timestamp with time zone DEFAULT now(),
  fecha_actualizacion timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT expedientes_penal_pkey PRIMARY KEY (id),
  CONSTRAINT expedientes_penal_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id),
  CONSTRAINT expedientes_penal_delito_id_fkey FOREIGN KEY (delito_id) REFERENCES public.delitos(id),
  CONSTRAINT expedientes_penal_estado_procesal_id_fkey FOREIGN KEY (estado_procesal_id) REFERENCES public.estados_procesales(id)
);
CREATE TABLE public.prestaciones (
  id integer NOT NULL DEFAULT nextval('prestaciones_id_seq'::regclass),
  nombre text NOT NULL,
  CONSTRAINT prestaciones_pkey PRIMARY KEY (id)
);
CREATE TABLE public.seguimiento_civil (
  id integer NOT NULL DEFAULT nextval('seguimiento_civil_id_seq'::regclass),
  expediente_id integer NOT NULL,
  fecha_actuacion date NOT NULL,
  tipo_actuacion text NOT NULL,
  descripcion text,
  actualizado_siij text DEFAULT 'NO'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seguimiento_civil_pkey PRIMARY KEY (id),
  CONSTRAINT seguimiento_civil_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_civil(id)
);
CREATE TABLE public.seguimiento_penal (
  id integer NOT NULL DEFAULT nextval('seguimiento_penal_id_seq'::regclass),
  expediente_id integer NOT NULL,
  fecha_actuacion date NOT NULL,
  tipo_actuacion text NOT NULL,
  descripcion text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT seguimiento_penal_pkey PRIMARY KEY (id),
  CONSTRAINT seguimiento_penal_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_penal(id)
);
CREATE TABLE public.subtipos_juicio (
  id integer NOT NULL DEFAULT nextval('subtipos_juicio_id_seq'::regclass),
  tipo_juicio_id integer NOT NULL,
  nombre text NOT NULL,
  jurisdiccion text,
  CONSTRAINT subtipos_juicio_pkey PRIMARY KEY (id),
  CONSTRAINT subtipos_juicio_tipo_juicio_id_fkey FOREIGN KEY (tipo_juicio_id) REFERENCES public.tipos_juicio(id)
);
CREATE TABLE public.tipos_actuacion (
  id integer NOT NULL DEFAULT nextval('tipos_actuacion_id_seq'::regclass),
  nombre text NOT NULL,
  modulo text NOT NULL DEFAULT 'AMBOS'::text,
  CONSTRAINT tipos_actuacion_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tipos_juicio (
  id integer NOT NULL DEFAULT nextval('tipos_juicio_id_seq'::regclass),
  materia text NOT NULL,
  nombre text NOT NULL,
  jurisdiccion text,
  requiere_descripcion boolean DEFAULT false,
  CONSTRAINT tipos_juicio_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tribunales (
  id integer NOT NULL DEFAULT nextval('tribunales_id_seq'::regclass),
  nombre text NOT NULL,
  delegacion_id integer,
  CONSTRAINT tribunales_pkey PRIMARY KEY (id),
  CONSTRAINT tribunales_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id)
);
CREATE TABLE public.usuarios (
  id integer NOT NULL DEFAULT nextval('usuarios_id_seq'::regclass),
  usuario text NOT NULL UNIQUE,
  password text NOT NULL,
  nombre_completo text NOT NULL,
  rol text NOT NULL DEFAULT 'consulta'::text,
  delegacion_id integer,
  permiso_civil_mercantil boolean DEFAULT true,
  permiso_penal boolean DEFAULT false,
  activo boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id)
);
