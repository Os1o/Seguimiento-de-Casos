--
-- PostgreSQL database dump
--

\restrict Hkr6Z84XyrCxr9hDF0wb0AMP1YP3VoBFXNkezE3NiteSiEzdIflzXRfZM07jfwk

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-06-15 12:44:47

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 5206 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16778)
-- Name: acumulados_civil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.acumulados_civil (
    id integer NOT NULL,
    caso_padre_id integer NOT NULL,
    caso_hijo_id integer NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.acumulados_civil OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16786)
-- Name: acumulados_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.acumulados_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.acumulados_civil_id_seq OWNER TO postgres;

--
-- TOC entry 5209 (class 0 OID 0)
-- Dependencies: 224
-- Name: acumulados_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.acumulados_civil_id_seq OWNED BY public.acumulados_civil.id;


--
-- TOC entry 225 (class 1259 OID 16787)
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    id integer NOT NULL,
    delegacion_id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16795)
-- Name: areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.areas_id_seq OWNER TO postgres;

--
-- TOC entry 5212 (class 0 OID 0)
-- Dependencies: 226
-- Name: areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.areas_id_seq OWNED BY public.areas.id;


--
-- TOC entry 227 (class 1259 OID 16801)
-- Name: auditoria_eventos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditoria_eventos (
    id integer NOT NULL,
    usuario_id integer,
    usuario_nombre text NOT NULL,
    usuario_login text,
    rol text,
    delegacion_id integer,
    modulo text NOT NULL,
    accion text NOT NULL,
    entidad text NOT NULL,
    entidad_id integer,
    expediente_id integer,
    seguimiento_id integer,
    descripcion text NOT NULL,
    detalles jsonb DEFAULT '{}'::jsonb NOT NULL,
    ip_address text,
    user_agent text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.auditoria_eventos OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16816)
-- Name: auditoria_eventos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditoria_eventos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auditoria_eventos_id_seq OWNER TO postgres;

--
-- TOC entry 5215 (class 0 OID 0)
-- Dependencies: 228
-- Name: auditoria_eventos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auditoria_eventos_id_seq OWNED BY public.auditoria_eventos.id;


--
-- TOC entry 265 (class 1259 OID 17929)
-- Name: auth_rate_limits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_rate_limits (
    id bigint NOT NULL,
    scope text NOT NULL,
    identifier text NOT NULL,
    attempt_count integer DEFAULT 0 NOT NULL,
    window_started_at timestamp with time zone DEFAULT now() NOT NULL,
    blocked_until timestamp with time zone,
    last_attempt_at timestamp with time zone DEFAULT now() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT auth_rate_limits_attempt_count_check CHECK ((attempt_count >= 0)),
    CONSTRAINT auth_rate_limits_scope_check CHECK ((scope = ANY (ARRAY['ip'::text, 'usuario'::text])))
);


ALTER TABLE public.auth_rate_limits OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 17928)
-- Name: auth_rate_limits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_rate_limits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.auth_rate_limits_id_seq OWNER TO postgres;

--
-- TOC entry 5218 (class 0 OID 0)
-- Dependencies: 264
-- Name: auth_rate_limits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_rate_limits_id_seq OWNED BY public.auth_rate_limits.id;


--
-- TOC entry 229 (class 1259 OID 16817)
-- Name: delegaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delegaciones (
    id integer NOT NULL,
    nombre text NOT NULL,
    estado text NOT NULL,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.delegaciones OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16827)
-- Name: delegaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delegaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delegaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5221 (class 0 OID 0)
-- Dependencies: 230
-- Name: delegaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delegaciones_id_seq OWNED BY public.delegaciones.id;


--
-- TOC entry 231 (class 1259 OID 16828)
-- Name: delitos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.delitos (
    id integer NOT NULL,
    nombre text NOT NULL,
    fuero text DEFAULT 'COMUN'::text NOT NULL
);


ALTER TABLE public.delitos OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16837)
-- Name: delitos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.delitos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delitos_id_seq OWNER TO postgres;

--
-- TOC entry 5224 (class 0 OID 0)
-- Dependencies: 232
-- Name: delitos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.delitos_id_seq OWNED BY public.delitos.id;


--
-- TOC entry 233 (class 1259 OID 16838)
-- Name: documentos_civil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_civil (
    id integer NOT NULL,
    expediente_id integer NOT NULL,
    nombre_original text NOT NULL,
    nombre_guardado text NOT NULL,
    ruta_archivo text NOT NULL,
    mime_type text DEFAULT 'application/pdf'::text NOT NULL,
    tamano_bytes integer NOT NULL,
    usuario_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    seguimiento_id integer
);


ALTER TABLE public.documentos_civil OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16853)
-- Name: documentos_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documentos_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documentos_civil_id_seq OWNER TO postgres;

--
-- TOC entry 5227 (class 0 OID 0)
-- Dependencies: 234
-- Name: documentos_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_civil_id_seq OWNED BY public.documentos_civil.id;


--
-- TOC entry 235 (class 1259 OID 16854)
-- Name: documentos_penal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.documentos_penal (
    id integer NOT NULL,
    expediente_id integer NOT NULL,
    seguimiento_id integer,
    nombre_original text NOT NULL,
    nombre_guardado text NOT NULL,
    ruta_archivo text NOT NULL,
    mime_type text DEFAULT 'application/pdf'::text NOT NULL,
    tamano_bytes integer NOT NULL,
    usuario_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.documentos_penal OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 16869)
-- Name: documentos_penal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.documentos_penal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.documentos_penal_id_seq OWNER TO postgres;

--
-- TOC entry 5230 (class 0 OID 0)
-- Dependencies: 236
-- Name: documentos_penal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.documentos_penal_id_seq OWNED BY public.documentos_penal.id;


--
-- TOC entry 237 (class 1259 OID 16870)
-- Name: estados_procesales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estados_procesales (
    id integer NOT NULL,
    nombre text NOT NULL,
    orden integer NOT NULL,
    descripcion text
);


ALTER TABLE public.estados_procesales OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 16878)
-- Name: estados_procesales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estados_procesales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estados_procesales_id_seq OWNER TO postgres;

--
-- TOC entry 5233 (class 0 OID 0)
-- Dependencies: 238
-- Name: estados_procesales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estados_procesales_id_seq OWNED BY public.estados_procesales.id;


--
-- TOC entry 239 (class 1259 OID 16879)
-- Name: estatus_investigacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.estatus_investigacion (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.estatus_investigacion OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 16886)
-- Name: estatus_investigacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.estatus_investigacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.estatus_investigacion_id_seq OWNER TO postgres;

--
-- TOC entry 5236 (class 0 OID 0)
-- Dependencies: 240
-- Name: estatus_investigacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.estatus_investigacion_id_seq OWNED BY public.estatus_investigacion.id;


--
-- TOC entry 241 (class 1259 OID 16887)
-- Name: expedientes_civil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expedientes_civil (
    id integer NOT NULL,
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
    imss_es text DEFAULT 'DEMANDADO'::text NOT NULL,
    actor jsonb,
    demandados jsonb DEFAULT '[]'::jsonb,
    codemandados jsonb DEFAULT '[]'::jsonb,
    prestacion_principal integer,
    prestaciones_secundarias jsonb DEFAULT '[]'::jsonb,
    prestaciones_notas text,
    importe_demandado numeric(15,2) DEFAULT 0,
    pronostico text DEFAULT 'SIN PRONOSTICO'::text,
    estatus text DEFAULT 'TRAMITE'::text NOT NULL,
    fecha_creacion timestamp with time zone DEFAULT now(),
    fecha_actualizacion timestamp with time zone DEFAULT now(),
    fecha_vencimiento date,
    created_at timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by integer,
    organo_jurisdiccional_id integer,
    abogado_responsable_id integer
);


ALTER TABLE public.expedientes_civil OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 16911)
-- Name: expedientes_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expedientes_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expedientes_civil_id_seq OWNER TO postgres;

--
-- TOC entry 5239 (class 0 OID 0)
-- Dependencies: 242
-- Name: expedientes_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expedientes_civil_id_seq OWNED BY public.expedientes_civil.id;


--
-- TOC entry 243 (class 1259 OID 16912)
-- Name: expedientes_penal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.expedientes_penal (
    id integer NOT NULL,
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
    estatus text DEFAULT 'TRAMITE'::text NOT NULL,
    abogado_responsable text,
    fecha_creacion timestamp with time zone DEFAULT now(),
    fecha_actualizacion timestamp with time zone DEFAULT now(),
    created_at timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.expedientes_penal OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 16927)
-- Name: expedientes_penal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.expedientes_penal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.expedientes_penal_id_seq OWNER TO postgres;

--
-- TOC entry 5242 (class 0 OID 0)
-- Dependencies: 244
-- Name: expedientes_penal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.expedientes_penal_id_seq OWNED BY public.expedientes_penal.id;


--
-- TOC entry 245 (class 1259 OID 16928)
-- Name: organos_jurisdiccionales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organos_jurisdiccionales (
    id integer NOT NULL,
    nombre text NOT NULL,
    circuito text NOT NULL,
    tipo text,
    materia text,
    delegacion_id integer,
    modulo text DEFAULT 'CIVIL'::text NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.organos_jurisdiccionales OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 16944)
-- Name: organos_jurisdiccionales_delegaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.organos_jurisdiccionales_delegaciones (
    organo_jurisdiccional_id integer CONSTRAINT organos_jurisdiccionales_dele_organo_jurisdiccional_id_not_null NOT NULL,
    delegacion_id integer NOT NULL
);


ALTER TABLE public.organos_jurisdiccionales_delegaciones OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 16949)
-- Name: organos_jurisdiccionales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.organos_jurisdiccionales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.organos_jurisdiccionales_id_seq OWNER TO postgres;

--
-- TOC entry 5246 (class 0 OID 0)
-- Dependencies: 247
-- Name: organos_jurisdiccionales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.organos_jurisdiccionales_id_seq OWNED BY public.organos_jurisdiccionales.id;


--
-- TOC entry 248 (class 1259 OID 16950)
-- Name: prestaciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prestaciones (
    id integer NOT NULL,
    nombre text NOT NULL
);


ALTER TABLE public.prestaciones OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 16957)
-- Name: prestaciones_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prestaciones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prestaciones_id_seq OWNER TO postgres;

--
-- TOC entry 5249 (class 0 OID 0)
-- Dependencies: 249
-- Name: prestaciones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prestaciones_id_seq OWNED BY public.prestaciones.id;


--
-- TOC entry 250 (class 1259 OID 16958)
-- Name: seguimiento_civil; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimiento_civil (
    id integer NOT NULL,
    expediente_id integer NOT NULL,
    fecha_actuacion date NOT NULL,
    tipo_actuacion text NOT NULL,
    descripcion text,
    actualizado_siij text DEFAULT 'NO'::text,
    created_at timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.seguimiento_civil OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 16971)
-- Name: seguimiento_civil_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimiento_civil_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimiento_civil_id_seq OWNER TO postgres;

--
-- TOC entry 5252 (class 0 OID 0)
-- Dependencies: 251
-- Name: seguimiento_civil_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimiento_civil_id_seq OWNED BY public.seguimiento_civil.id;


--
-- TOC entry 252 (class 1259 OID 16972)
-- Name: seguimiento_penal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.seguimiento_penal (
    id integer NOT NULL,
    expediente_id integer NOT NULL,
    fecha_actuacion date NOT NULL,
    tipo_actuacion text NOT NULL,
    descripcion text,
    created_at timestamp with time zone DEFAULT now(),
    activo boolean DEFAULT true NOT NULL,
    deleted_at timestamp with time zone,
    deleted_by integer
);


ALTER TABLE public.seguimiento_penal OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 16984)
-- Name: seguimiento_penal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.seguimiento_penal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.seguimiento_penal_id_seq OWNER TO postgres;

--
-- TOC entry 5255 (class 0 OID 0)
-- Dependencies: 253
-- Name: seguimiento_penal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.seguimiento_penal_id_seq OWNED BY public.seguimiento_penal.id;


--
-- TOC entry 254 (class 1259 OID 16990)
-- Name: subtipos_juicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.subtipos_juicio (
    id integer NOT NULL,
    tipo_juicio_id integer NOT NULL,
    nombre text NOT NULL,
    jurisdiccion text
);


ALTER TABLE public.subtipos_juicio OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 16998)
-- Name: subtipos_juicio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subtipos_juicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subtipos_juicio_id_seq OWNER TO postgres;

--
-- TOC entry 5258 (class 0 OID 0)
-- Dependencies: 255
-- Name: subtipos_juicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subtipos_juicio_id_seq OWNED BY public.subtipos_juicio.id;


--
-- TOC entry 256 (class 1259 OID 16999)
-- Name: tipos_actuacion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_actuacion (
    id integer NOT NULL,
    nombre text NOT NULL,
    modulo text DEFAULT 'AMBOS'::text NOT NULL
);


ALTER TABLE public.tipos_actuacion OWNER TO postgres;

--
-- TOC entry 257 (class 1259 OID 17008)
-- Name: tipos_actuacion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_actuacion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_actuacion_id_seq OWNER TO postgres;

--
-- TOC entry 5261 (class 0 OID 0)
-- Dependencies: 257
-- Name: tipos_actuacion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_actuacion_id_seq OWNED BY public.tipos_actuacion.id;


--
-- TOC entry 258 (class 1259 OID 17009)
-- Name: tipos_juicio; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tipos_juicio (
    id integer NOT NULL,
    materia text NOT NULL,
    nombre text NOT NULL,
    jurisdiccion text,
    requiere_descripcion boolean DEFAULT false
);


ALTER TABLE public.tipos_juicio OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 17018)
-- Name: tipos_juicio_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tipos_juicio_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tipos_juicio_id_seq OWNER TO postgres;

--
-- TOC entry 5264 (class 0 OID 0)
-- Dependencies: 259
-- Name: tipos_juicio_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tipos_juicio_id_seq OWNED BY public.tipos_juicio.id;


--
-- TOC entry 260 (class 1259 OID 17019)
-- Name: tribunales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tribunales (
    id integer NOT NULL,
    nombre text NOT NULL,
    delegacion_id integer,
    organo_jurisdiccional_id integer,
    circuito text,
    tipo text,
    materia text,
    activo boolean DEFAULT true NOT NULL
);


ALTER TABLE public.tribunales OWNER TO postgres;

--
-- TOC entry 261 (class 1259 OID 17028)
-- Name: tribunales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tribunales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tribunales_id_seq OWNER TO postgres;

--
-- TOC entry 5267 (class 0 OID 0)
-- Dependencies: 261
-- Name: tribunales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tribunales_id_seq OWNED BY public.tribunales.id;


--
-- TOC entry 262 (class 1259 OID 17029)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    usuario text NOT NULL,
    password text NOT NULL,
    nombre_completo text NOT NULL,
    rol text DEFAULT 'consulta'::text NOT NULL,
    delegacion_id integer,
    permiso_civil_mercantil boolean DEFAULT true,
    permiso_penal boolean DEFAULT false,
    activo boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    alcance_global boolean DEFAULT false NOT NULL,
    sesion_token_activa text,
    sesion_actualizada_at timestamp with time zone,
    es_abogado boolean DEFAULT false,
    es_jefe boolean DEFAULT false
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 17046)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 5270 (class 0 OID 0)
-- Dependencies: 263
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4866 (class 2604 OID 17047)
-- Name: acumulados_civil id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acumulados_civil ALTER COLUMN id SET DEFAULT nextval('public.acumulados_civil_id_seq'::regclass);


--
-- TOC entry 4868 (class 2604 OID 17048)
-- Name: areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas ALTER COLUMN id SET DEFAULT nextval('public.areas_id_seq'::regclass);


--
-- TOC entry 4869 (class 2604 OID 17049)
-- Name: auditoria_eventos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_eventos ALTER COLUMN id SET DEFAULT nextval('public.auditoria_eventos_id_seq'::regclass);


--
-- TOC entry 4931 (class 2604 OID 17932)
-- Name: auth_rate_limits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_rate_limits ALTER COLUMN id SET DEFAULT nextval('public.auth_rate_limits_id_seq'::regclass);


--
-- TOC entry 4872 (class 2604 OID 17050)
-- Name: delegaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delegaciones ALTER COLUMN id SET DEFAULT nextval('public.delegaciones_id_seq'::regclass);


--
-- TOC entry 4874 (class 2604 OID 17051)
-- Name: delitos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delitos ALTER COLUMN id SET DEFAULT nextval('public.delitos_id_seq'::regclass);


--
-- TOC entry 4876 (class 2604 OID 17052)
-- Name: documentos_civil id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_civil ALTER COLUMN id SET DEFAULT nextval('public.documentos_civil_id_seq'::regclass);


--
-- TOC entry 4879 (class 2604 OID 17053)
-- Name: documentos_penal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_penal ALTER COLUMN id SET DEFAULT nextval('public.documentos_penal_id_seq'::regclass);


--
-- TOC entry 4882 (class 2604 OID 17054)
-- Name: estados_procesales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_procesales ALTER COLUMN id SET DEFAULT nextval('public.estados_procesales_id_seq'::regclass);


--
-- TOC entry 4883 (class 2604 OID 17055)
-- Name: estatus_investigacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_investigacion ALTER COLUMN id SET DEFAULT nextval('public.estatus_investigacion_id_seq'::regclass);


--
-- TOC entry 4884 (class 2604 OID 17056)
-- Name: expedientes_civil id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil ALTER COLUMN id SET DEFAULT nextval('public.expedientes_civil_id_seq'::regclass);


--
-- TOC entry 4896 (class 2604 OID 17057)
-- Name: expedientes_penal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal ALTER COLUMN id SET DEFAULT nextval('public.expedientes_penal_id_seq'::regclass);


--
-- TOC entry 4902 (class 2604 OID 17058)
-- Name: organos_jurisdiccionales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales ALTER COLUMN id SET DEFAULT nextval('public.organos_jurisdiccionales_id_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 17059)
-- Name: prestaciones id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestaciones ALTER COLUMN id SET DEFAULT nextval('public.prestaciones_id_seq'::regclass);


--
-- TOC entry 4908 (class 2604 OID 17060)
-- Name: seguimiento_civil id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_civil ALTER COLUMN id SET DEFAULT nextval('public.seguimiento_civil_id_seq'::regclass);


--
-- TOC entry 4912 (class 2604 OID 17061)
-- Name: seguimiento_penal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_penal ALTER COLUMN id SET DEFAULT nextval('public.seguimiento_penal_id_seq'::regclass);


--
-- TOC entry 4915 (class 2604 OID 17062)
-- Name: subtipos_juicio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtipos_juicio ALTER COLUMN id SET DEFAULT nextval('public.subtipos_juicio_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 17063)
-- Name: tipos_actuacion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_actuacion ALTER COLUMN id SET DEFAULT nextval('public.tipos_actuacion_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 17064)
-- Name: tipos_juicio id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_juicio ALTER COLUMN id SET DEFAULT nextval('public.tipos_juicio_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 17065)
-- Name: tribunales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribunales ALTER COLUMN id SET DEFAULT nextval('public.tribunales_id_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 17066)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4940 (class 2606 OID 17068)
-- Name: acumulados_civil acumulados_civil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acumulados_civil
    ADD CONSTRAINT acumulados_civil_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 17070)
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 17072)
-- Name: auditoria_eventos auditoria_eventos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_eventos
    ADD CONSTRAINT auditoria_eventos_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 17951)
-- Name: auth_rate_limits auth_rate_limits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_rate_limits
    ADD CONSTRAINT auth_rate_limits_pkey PRIMARY KEY (id);


--
-- TOC entry 4954 (class 2606 OID 17074)
-- Name: delegaciones delegaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delegaciones
    ADD CONSTRAINT delegaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4956 (class 2606 OID 17076)
-- Name: delitos delitos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.delitos
    ADD CONSTRAINT delitos_pkey PRIMARY KEY (id);


--
-- TOC entry 4958 (class 2606 OID 17078)
-- Name: documentos_civil documentos_civil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_civil
    ADD CONSTRAINT documentos_civil_pkey PRIMARY KEY (id);


--
-- TOC entry 4963 (class 2606 OID 17080)
-- Name: documentos_penal documentos_penal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_penal
    ADD CONSTRAINT documentos_penal_pkey PRIMARY KEY (id);


--
-- TOC entry 4968 (class 2606 OID 17082)
-- Name: estados_procesales estados_procesales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estados_procesales
    ADD CONSTRAINT estados_procesales_pkey PRIMARY KEY (id);


--
-- TOC entry 4970 (class 2606 OID 17084)
-- Name: estatus_investigacion estatus_investigacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.estatus_investigacion
    ADD CONSTRAINT estatus_investigacion_pkey PRIMARY KEY (id);


--
-- TOC entry 4972 (class 2606 OID 17086)
-- Name: expedientes_civil expedientes_civil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 17088)
-- Name: expedientes_penal expedientes_penal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal
    ADD CONSTRAINT expedientes_penal_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 17090)
-- Name: organos_jurisdiccionales_delegaciones organos_jurisdiccionales_delegaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales_delegaciones
    ADD CONSTRAINT organos_jurisdiccionales_delegaciones_pkey PRIMARY KEY (organo_jurisdiccional_id, delegacion_id);


--
-- TOC entry 4984 (class 2606 OID 17092)
-- Name: organos_jurisdiccionales organos_jurisdiccionales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales
    ADD CONSTRAINT organos_jurisdiccionales_pkey PRIMARY KEY (id);


--
-- TOC entry 4990 (class 2606 OID 17094)
-- Name: prestaciones prestaciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prestaciones
    ADD CONSTRAINT prestaciones_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 17096)
-- Name: seguimiento_civil seguimiento_civil_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_civil
    ADD CONSTRAINT seguimiento_civil_pkey PRIMARY KEY (id);


--
-- TOC entry 4996 (class 2606 OID 17098)
-- Name: seguimiento_penal seguimiento_penal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_penal
    ADD CONSTRAINT seguimiento_penal_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 17100)
-- Name: subtipos_juicio subtipos_juicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtipos_juicio
    ADD CONSTRAINT subtipos_juicio_pkey PRIMARY KEY (id);


--
-- TOC entry 5000 (class 2606 OID 17102)
-- Name: tipos_actuacion tipos_actuacion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_actuacion
    ADD CONSTRAINT tipos_actuacion_pkey PRIMARY KEY (id);


--
-- TOC entry 5002 (class 2606 OID 17104)
-- Name: tipos_juicio tipos_juicio_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tipos_juicio
    ADD CONSTRAINT tipos_juicio_pkey PRIMARY KEY (id);


--
-- TOC entry 5006 (class 2606 OID 17106)
-- Name: tribunales tribunales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribunales
    ADD CONSTRAINT tribunales_pkey PRIMARY KEY (id);


--
-- TOC entry 5018 (class 2606 OID 17953)
-- Name: auth_rate_limits uq_auth_rate_limits_scope_identifier; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_rate_limits
    ADD CONSTRAINT uq_auth_rate_limits_scope_identifier UNIQUE (scope, identifier);


--
-- TOC entry 5010 (class 2606 OID 17108)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 5012 (class 2606 OID 17110)
-- Name: usuarios usuarios_usuario_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_usuario_key UNIQUE (usuario);


--
-- TOC entry 4941 (class 1259 OID 17111)
-- Name: idx_acumulados_civil_hijo_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acumulados_civil_hijo_activo ON public.acumulados_civil USING btree (caso_hijo_id, activo);


--
-- TOC entry 4942 (class 1259 OID 17112)
-- Name: idx_acumulados_civil_padre_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_acumulados_civil_padre_activo ON public.acumulados_civil USING btree (caso_padre_id, activo);


--
-- TOC entry 4948 (class 1259 OID 17113)
-- Name: idx_auditoria_eventos_accion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_eventos_accion ON public.auditoria_eventos USING btree (accion);


--
-- TOC entry 4949 (class 1259 OID 17114)
-- Name: idx_auditoria_eventos_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_eventos_created_at ON public.auditoria_eventos USING btree (created_at DESC);


--
-- TOC entry 4950 (class 1259 OID 17115)
-- Name: idx_auditoria_eventos_expediente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_eventos_expediente_id ON public.auditoria_eventos USING btree (expediente_id);


--
-- TOC entry 4951 (class 1259 OID 17116)
-- Name: idx_auditoria_eventos_modulo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_eventos_modulo ON public.auditoria_eventos USING btree (modulo);


--
-- TOC entry 4952 (class 1259 OID 17117)
-- Name: idx_auditoria_eventos_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_auditoria_eventos_usuario_id ON public.auditoria_eventos USING btree (usuario_id);


--
-- TOC entry 4959 (class 1259 OID 17118)
-- Name: idx_documentos_civil_expediente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documentos_civil_expediente_id ON public.documentos_civil USING btree (expediente_id);


--
-- TOC entry 4960 (class 1259 OID 17119)
-- Name: idx_documentos_civil_seguimiento_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documentos_civil_seguimiento_id ON public.documentos_civil USING btree (seguimiento_id);


--
-- TOC entry 4964 (class 1259 OID 17120)
-- Name: idx_documentos_penal_expediente_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documentos_penal_expediente_id ON public.documentos_penal USING btree (expediente_id);


--
-- TOC entry 4965 (class 1259 OID 17121)
-- Name: idx_documentos_penal_seguimiento_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_documentos_penal_seguimiento_id ON public.documentos_penal USING btree (seguimiento_id);


--
-- TOC entry 4973 (class 1259 OID 17122)
-- Name: idx_expedientes_civil_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expedientes_civil_activo ON public.expedientes_civil USING btree (activo);


--
-- TOC entry 4978 (class 1259 OID 17123)
-- Name: idx_expedientes_penal_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_expedientes_penal_activo ON public.expedientes_penal USING btree (activo);


--
-- TOC entry 4991 (class 1259 OID 17124)
-- Name: idx_seguimiento_civil_expediente_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_civil_expediente_activo ON public.seguimiento_civil USING btree (expediente_id, activo);


--
-- TOC entry 4994 (class 1259 OID 17125)
-- Name: idx_seguimiento_penal_expediente_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_seguimiento_penal_expediente_activo ON public.seguimiento_penal USING btree (expediente_id, activo);


--
-- TOC entry 5008 (class 1259 OID 17126)
-- Name: idx_usuarios_sesion_token_activa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_usuarios_sesion_token_activa ON public.usuarios USING btree (sesion_token_activa);


--
-- TOC entry 5015 (class 1259 OID 17955)
-- Name: ix_auth_rate_limits_blocked_until; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_auth_rate_limits_blocked_until ON public.auth_rate_limits USING btree (blocked_until);


--
-- TOC entry 5016 (class 1259 OID 17954)
-- Name: ix_auth_rate_limits_scope_identifier; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_auth_rate_limits_scope_identifier ON public.auth_rate_limits USING btree (scope, identifier);


--
-- TOC entry 4974 (class 1259 OID 17893)
-- Name: ix_expedientes_civil_organo_jurisdiccional; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_expedientes_civil_organo_jurisdiccional ON public.expedientes_civil USING btree (organo_jurisdiccional_id);


--
-- TOC entry 4980 (class 1259 OID 17127)
-- Name: ix_organos_jurisdiccionales_circuito; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_organos_jurisdiccionales_circuito ON public.organos_jurisdiccionales USING btree (circuito);


--
-- TOC entry 4981 (class 1259 OID 17128)
-- Name: ix_organos_jurisdiccionales_delegacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_organos_jurisdiccionales_delegacion ON public.organos_jurisdiccionales USING btree (delegacion_id);


--
-- TOC entry 4986 (class 1259 OID 17129)
-- Name: ix_organos_jurisdiccionales_delegaciones_delegacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_organos_jurisdiccionales_delegaciones_delegacion ON public.organos_jurisdiccionales_delegaciones USING btree (delegacion_id);


--
-- TOC entry 4982 (class 1259 OID 17130)
-- Name: ix_organos_jurisdiccionales_modulo_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_organos_jurisdiccionales_modulo_activo ON public.organos_jurisdiccionales USING btree (modulo, activo);


--
-- TOC entry 5003 (class 1259 OID 17131)
-- Name: ix_tribunales_delegacion_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tribunales_delegacion_activo ON public.tribunales USING btree (delegacion_id, activo);


--
-- TOC entry 5004 (class 1259 OID 17132)
-- Name: ix_tribunales_organo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_tribunales_organo ON public.tribunales USING btree (organo_jurisdiccional_id);


--
-- TOC entry 4943 (class 1259 OID 17133)
-- Name: uniq_acumulados_civil_caso_hijo_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uniq_acumulados_civil_caso_hijo_activo ON public.acumulados_civil USING btree (caso_hijo_id) WHERE (activo = true);


--
-- TOC entry 4961 (class 1259 OID 17134)
-- Name: uq_documentos_civil_seguimiento_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_documentos_civil_seguimiento_id ON public.documentos_civil USING btree (seguimiento_id) WHERE (seguimiento_id IS NOT NULL);


--
-- TOC entry 4966 (class 1259 OID 17135)
-- Name: uq_documentos_penal_seguimiento_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX uq_documentos_penal_seguimiento_id ON public.documentos_penal USING btree (seguimiento_id) WHERE (seguimiento_id IS NOT NULL);


--
-- TOC entry 4975 (class 1259 OID 17136)
-- Name: ux_expedientes_civil_numero_expediente_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_expedientes_civil_numero_expediente_activo ON public.expedientes_civil USING btree (numero_expediente) WHERE (activo = true);


--
-- TOC entry 4979 (class 1259 OID 17137)
-- Name: ux_expedientes_penal_numero_expediente_activo; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_expedientes_penal_numero_expediente_activo ON public.expedientes_penal USING btree (numero_expediente) WHERE (activo = true);


--
-- TOC entry 4985 (class 1259 OID 17138)
-- Name: ux_organos_jurisdiccionales_modulo_nombre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_organos_jurisdiccionales_modulo_nombre ON public.organos_jurisdiccionales USING btree (modulo, nombre);


--
-- TOC entry 5007 (class 1259 OID 17139)
-- Name: ux_tribunales_organo_delegacion; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ux_tribunales_organo_delegacion ON public.tribunales USING btree (organo_jurisdiccional_id, delegacion_id) WHERE (organo_jurisdiccional_id IS NOT NULL);


--
-- TOC entry 5019 (class 2606 OID 17140)
-- Name: acumulados_civil acumulados_civil_caso_hijo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acumulados_civil
    ADD CONSTRAINT acumulados_civil_caso_hijo_id_fkey FOREIGN KEY (caso_hijo_id) REFERENCES public.expedientes_civil(id) ON DELETE CASCADE;


--
-- TOC entry 5020 (class 2606 OID 17145)
-- Name: acumulados_civil acumulados_civil_caso_padre_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acumulados_civil
    ADD CONSTRAINT acumulados_civil_caso_padre_id_fkey FOREIGN KEY (caso_padre_id) REFERENCES public.expedientes_civil(id) ON DELETE CASCADE;


--
-- TOC entry 5021 (class 2606 OID 17150)
-- Name: acumulados_civil acumulados_civil_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.acumulados_civil
    ADD CONSTRAINT acumulados_civil_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.usuarios(id);


--
-- TOC entry 5022 (class 2606 OID 17155)
-- Name: areas areas_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id);


--
-- TOC entry 5023 (class 2606 OID 17160)
-- Name: auditoria_eventos auditoria_eventos_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_eventos
    ADD CONSTRAINT auditoria_eventos_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id) ON DELETE SET NULL;


--
-- TOC entry 5024 (class 2606 OID 17165)
-- Name: auditoria_eventos auditoria_eventos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auditoria_eventos
    ADD CONSTRAINT auditoria_eventos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5025 (class 2606 OID 17170)
-- Name: documentos_civil documentos_civil_expediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_civil
    ADD CONSTRAINT documentos_civil_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_civil(id) ON DELETE CASCADE;


--
-- TOC entry 5026 (class 2606 OID 17175)
-- Name: documentos_civil documentos_civil_seguimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_civil
    ADD CONSTRAINT documentos_civil_seguimiento_id_fkey FOREIGN KEY (seguimiento_id) REFERENCES public.seguimiento_civil(id) ON DELETE CASCADE;


--
-- TOC entry 5027 (class 2606 OID 17180)
-- Name: documentos_civil documentos_civil_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_civil
    ADD CONSTRAINT documentos_civil_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5028 (class 2606 OID 17185)
-- Name: documentos_penal documentos_penal_expediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_penal
    ADD CONSTRAINT documentos_penal_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_penal(id) ON DELETE CASCADE;


--
-- TOC entry 5029 (class 2606 OID 17190)
-- Name: documentos_penal documentos_penal_seguimiento_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_penal
    ADD CONSTRAINT documentos_penal_seguimiento_id_fkey FOREIGN KEY (seguimiento_id) REFERENCES public.seguimiento_penal(id) ON DELETE CASCADE;


--
-- TOC entry 5030 (class 2606 OID 17195)
-- Name: documentos_penal documentos_penal_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.documentos_penal
    ADD CONSTRAINT documentos_penal_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE SET NULL;


--
-- TOC entry 5031 (class 2606 OID 18009)
-- Name: expedientes_civil expedientes_civil_abogado_responsable_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_abogado_responsable_id_fkey FOREIGN KEY (abogado_responsable_id) REFERENCES public.usuarios(id);


--
-- TOC entry 5032 (class 2606 OID 17200)
-- Name: expedientes_civil expedientes_civil_acumulado_a_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_acumulado_a_fkey FOREIGN KEY (acumulado_a) REFERENCES public.expedientes_civil(id);


--
-- TOC entry 5033 (class 2606 OID 17205)
-- Name: expedientes_civil expedientes_civil_area_generadora_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_area_generadora_id_fkey FOREIGN KEY (area_generadora_id) REFERENCES public.areas(id);


--
-- TOC entry 5034 (class 2606 OID 17210)
-- Name: expedientes_civil expedientes_civil_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id);


--
-- TOC entry 5035 (class 2606 OID 17215)
-- Name: expedientes_civil expedientes_civil_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.usuarios(id);


--
-- TOC entry 5036 (class 2606 OID 17888)
-- Name: expedientes_civil expedientes_civil_organo_jurisdiccional_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_organo_jurisdiccional_id_fkey FOREIGN KEY (organo_jurisdiccional_id) REFERENCES public.organos_jurisdiccionales(id);


--
-- TOC entry 5037 (class 2606 OID 17220)
-- Name: expedientes_civil expedientes_civil_prestacion_principal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_prestacion_principal_fkey FOREIGN KEY (prestacion_principal) REFERENCES public.prestaciones(id);


--
-- TOC entry 5038 (class 2606 OID 17225)
-- Name: expedientes_civil expedientes_civil_tribunal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_civil
    ADD CONSTRAINT expedientes_civil_tribunal_id_fkey FOREIGN KEY (tribunal_id) REFERENCES public.tribunales(id);


--
-- TOC entry 5039 (class 2606 OID 17230)
-- Name: expedientes_penal expedientes_penal_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal
    ADD CONSTRAINT expedientes_penal_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id);


--
-- TOC entry 5040 (class 2606 OID 17235)
-- Name: expedientes_penal expedientes_penal_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal
    ADD CONSTRAINT expedientes_penal_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.usuarios(id);


--
-- TOC entry 5041 (class 2606 OID 17240)
-- Name: expedientes_penal expedientes_penal_delito_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal
    ADD CONSTRAINT expedientes_penal_delito_id_fkey FOREIGN KEY (delito_id) REFERENCES public.delitos(id);


--
-- TOC entry 5042 (class 2606 OID 17245)
-- Name: expedientes_penal expedientes_penal_estado_procesal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.expedientes_penal
    ADD CONSTRAINT expedientes_penal_estado_procesal_id_fkey FOREIGN KEY (estado_procesal_id) REFERENCES public.estados_procesales(id);


--
-- TOC entry 5044 (class 2606 OID 17250)
-- Name: organos_jurisdiccionales_delegaciones organos_jurisdiccionales_delegaci_organo_jurisdiccional_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales_delegaciones
    ADD CONSTRAINT organos_jurisdiccionales_delegaci_organo_jurisdiccional_id_fkey FOREIGN KEY (organo_jurisdiccional_id) REFERENCES public.organos_jurisdiccionales(id) ON DELETE CASCADE;


--
-- TOC entry 5043 (class 2606 OID 17255)
-- Name: organos_jurisdiccionales organos_jurisdiccionales_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales
    ADD CONSTRAINT organos_jurisdiccionales_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id) ON DELETE SET NULL;


--
-- TOC entry 5045 (class 2606 OID 17260)
-- Name: organos_jurisdiccionales_delegaciones organos_jurisdiccionales_delegaciones_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.organos_jurisdiccionales_delegaciones
    ADD CONSTRAINT organos_jurisdiccionales_delegaciones_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id) ON DELETE CASCADE;


--
-- TOC entry 5046 (class 2606 OID 17265)
-- Name: seguimiento_civil seguimiento_civil_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_civil
    ADD CONSTRAINT seguimiento_civil_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.usuarios(id);


--
-- TOC entry 5047 (class 2606 OID 17270)
-- Name: seguimiento_civil seguimiento_civil_expediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_civil
    ADD CONSTRAINT seguimiento_civil_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_civil(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 17275)
-- Name: seguimiento_penal seguimiento_penal_deleted_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_penal
    ADD CONSTRAINT seguimiento_penal_deleted_by_fkey FOREIGN KEY (deleted_by) REFERENCES public.usuarios(id);


--
-- TOC entry 5049 (class 2606 OID 17280)
-- Name: seguimiento_penal seguimiento_penal_expediente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.seguimiento_penal
    ADD CONSTRAINT seguimiento_penal_expediente_id_fkey FOREIGN KEY (expediente_id) REFERENCES public.expedientes_penal(id) ON DELETE CASCADE;


--
-- TOC entry 5050 (class 2606 OID 17285)
-- Name: subtipos_juicio subtipos_juicio_tipo_juicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.subtipos_juicio
    ADD CONSTRAINT subtipos_juicio_tipo_juicio_id_fkey FOREIGN KEY (tipo_juicio_id) REFERENCES public.tipos_juicio(id);


--
-- TOC entry 5051 (class 2606 OID 17290)
-- Name: tribunales tribunales_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribunales
    ADD CONSTRAINT tribunales_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id);


--
-- TOC entry 5052 (class 2606 OID 17295)
-- Name: tribunales tribunales_organo_jurisdiccional_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tribunales
    ADD CONSTRAINT tribunales_organo_jurisdiccional_id_fkey FOREIGN KEY (organo_jurisdiccional_id) REFERENCES public.organos_jurisdiccionales(id);


--
-- TOC entry 5053 (class 2606 OID 17300)
-- Name: usuarios usuarios_delegacion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_delegacion_id_fkey FOREIGN KEY (delegacion_id) REFERENCES public.delegaciones(id);


--
-- TOC entry 5207 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO app_seguimiento;


--
-- TOC entry 5208 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE acumulados_civil; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.acumulados_civil TO app_seguimiento;


--
-- TOC entry 5210 (class 0 OID 0)
-- Dependencies: 224
-- Name: SEQUENCE acumulados_civil_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.acumulados_civil_id_seq TO app_seguimiento;


--
-- TOC entry 5211 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE areas; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.areas TO app_seguimiento;


--
-- TOC entry 5213 (class 0 OID 0)
-- Dependencies: 226
-- Name: SEQUENCE areas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.areas_id_seq TO app_seguimiento;


--
-- TOC entry 5214 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE auditoria_eventos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.auditoria_eventos TO app_seguimiento;


--
-- TOC entry 5216 (class 0 OID 0)
-- Dependencies: 228
-- Name: SEQUENCE auditoria_eventos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.auditoria_eventos_id_seq TO app_seguimiento;


--
-- TOC entry 5217 (class 0 OID 0)
-- Dependencies: 265
-- Name: TABLE auth_rate_limits; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.auth_rate_limits TO app_seguimiento;


--
-- TOC entry 5219 (class 0 OID 0)
-- Dependencies: 264
-- Name: SEQUENCE auth_rate_limits_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.auth_rate_limits_id_seq TO app_seguimiento;


--
-- TOC entry 5220 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE delegaciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.delegaciones TO app_seguimiento;


--
-- TOC entry 5222 (class 0 OID 0)
-- Dependencies: 230
-- Name: SEQUENCE delegaciones_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.delegaciones_id_seq TO app_seguimiento;


--
-- TOC entry 5223 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE delitos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.delitos TO app_seguimiento;


--
-- TOC entry 5225 (class 0 OID 0)
-- Dependencies: 232
-- Name: SEQUENCE delitos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.delitos_id_seq TO app_seguimiento;


--
-- TOC entry 5226 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE documentos_civil; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.documentos_civil TO app_seguimiento;


--
-- TOC entry 5228 (class 0 OID 0)
-- Dependencies: 234
-- Name: SEQUENCE documentos_civil_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.documentos_civil_id_seq TO app_seguimiento;


--
-- TOC entry 5229 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE documentos_penal; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.documentos_penal TO app_seguimiento;


--
-- TOC entry 5231 (class 0 OID 0)
-- Dependencies: 236
-- Name: SEQUENCE documentos_penal_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.documentos_penal_id_seq TO app_seguimiento;


--
-- TOC entry 5232 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE estados_procesales; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.estados_procesales TO app_seguimiento;


--
-- TOC entry 5234 (class 0 OID 0)
-- Dependencies: 238
-- Name: SEQUENCE estados_procesales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.estados_procesales_id_seq TO app_seguimiento;


--
-- TOC entry 5235 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE estatus_investigacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.estatus_investigacion TO app_seguimiento;


--
-- TOC entry 5237 (class 0 OID 0)
-- Dependencies: 240
-- Name: SEQUENCE estatus_investigacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.estatus_investigacion_id_seq TO app_seguimiento;


--
-- TOC entry 5238 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE expedientes_civil; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.expedientes_civil TO app_seguimiento;


--
-- TOC entry 5240 (class 0 OID 0)
-- Dependencies: 242
-- Name: SEQUENCE expedientes_civil_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.expedientes_civil_id_seq TO app_seguimiento;


--
-- TOC entry 5241 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE expedientes_penal; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.expedientes_penal TO app_seguimiento;


--
-- TOC entry 5243 (class 0 OID 0)
-- Dependencies: 244
-- Name: SEQUENCE expedientes_penal_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.expedientes_penal_id_seq TO app_seguimiento;


--
-- TOC entry 5244 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE organos_jurisdiccionales; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.organos_jurisdiccionales TO app_seguimiento;


--
-- TOC entry 5245 (class 0 OID 0)
-- Dependencies: 246
-- Name: TABLE organos_jurisdiccionales_delegaciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.organos_jurisdiccionales_delegaciones TO app_seguimiento;


--
-- TOC entry 5247 (class 0 OID 0)
-- Dependencies: 247
-- Name: SEQUENCE organos_jurisdiccionales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.organos_jurisdiccionales_id_seq TO app_seguimiento;


--
-- TOC entry 5248 (class 0 OID 0)
-- Dependencies: 248
-- Name: TABLE prestaciones; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.prestaciones TO app_seguimiento;


--
-- TOC entry 5250 (class 0 OID 0)
-- Dependencies: 249
-- Name: SEQUENCE prestaciones_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.prestaciones_id_seq TO app_seguimiento;


--
-- TOC entry 5251 (class 0 OID 0)
-- Dependencies: 250
-- Name: TABLE seguimiento_civil; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.seguimiento_civil TO app_seguimiento;


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 251
-- Name: SEQUENCE seguimiento_civil_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seguimiento_civil_id_seq TO app_seguimiento;


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 252
-- Name: TABLE seguimiento_penal; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.seguimiento_penal TO app_seguimiento;


--
-- TOC entry 5256 (class 0 OID 0)
-- Dependencies: 253
-- Name: SEQUENCE seguimiento_penal_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.seguimiento_penal_id_seq TO app_seguimiento;


--
-- TOC entry 5257 (class 0 OID 0)
-- Dependencies: 254
-- Name: TABLE subtipos_juicio; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.subtipos_juicio TO app_seguimiento;


--
-- TOC entry 5259 (class 0 OID 0)
-- Dependencies: 255
-- Name: SEQUENCE subtipos_juicio_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.subtipos_juicio_id_seq TO app_seguimiento;


--
-- TOC entry 5260 (class 0 OID 0)
-- Dependencies: 256
-- Name: TABLE tipos_actuacion; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tipos_actuacion TO app_seguimiento;


--
-- TOC entry 5262 (class 0 OID 0)
-- Dependencies: 257
-- Name: SEQUENCE tipos_actuacion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipos_actuacion_id_seq TO app_seguimiento;


--
-- TOC entry 5263 (class 0 OID 0)
-- Dependencies: 258
-- Name: TABLE tipos_juicio; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tipos_juicio TO app_seguimiento;


--
-- TOC entry 5265 (class 0 OID 0)
-- Dependencies: 259
-- Name: SEQUENCE tipos_juicio_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tipos_juicio_id_seq TO app_seguimiento;


--
-- TOC entry 5266 (class 0 OID 0)
-- Dependencies: 260
-- Name: TABLE tribunales; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tribunales TO app_seguimiento;


--
-- TOC entry 5268 (class 0 OID 0)
-- Dependencies: 261
-- Name: SEQUENCE tribunales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.tribunales_id_seq TO app_seguimiento;


--
-- TOC entry 5269 (class 0 OID 0)
-- Dependencies: 262
-- Name: TABLE usuarios; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.usuarios TO app_seguimiento;


--
-- TOC entry 5271 (class 0 OID 0)
-- Dependencies: 263
-- Name: SEQUENCE usuarios_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.usuarios_id_seq TO app_seguimiento;


--
-- TOC entry 2161 (class 826 OID 17338)
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO app_seguimiento;


--
-- TOC entry 2162 (class 826 OID 17339)
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO app_seguimiento;


--
-- TOC entry 2160 (class 826 OID 17337)
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES TO app_seguimiento;


-- Completed on 2026-06-15 12:44:50

--
-- PostgreSQL database dump complete
--

\unrestrict Hkr6Z84XyrCxr9hDF0wb0AMP1YP3VoBFXNkezE3NiteSiEzdIflzXRfZM07jfwk

