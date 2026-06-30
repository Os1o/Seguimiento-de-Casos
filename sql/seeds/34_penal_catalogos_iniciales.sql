BEGIN;

-- =========================================================
-- SEED INICIAL - CATALOGOS NUEVOS PENAL
-- Requiere que ya exista la migración:
--   34_penal_modelo_nuevo.sql
-- =========================================================

-- =========================================================
-- CATALOGO DE ETAPAS
-- =========================================================

INSERT INTO public.penal_catalogo_etapas (nombre, orden, concluye_asunto, activo)
VALUES
    ('Registro inicial', 10, false, true),
    ('Conocimiento del AMP', 20, false, true),
    ('Investigación inicial', 30, false, true),
    ('Investigación complementaria', 40, false, true),
    ('Judicializado', 50, false, true),
    ('Audiencia inicial', 60, false, true),
    ('Etapa intermedia', 70, false, true),
    ('Juicio oral', 80, false, true),
    ('Suspensión', 90, false, true),
    ('Concluido por determinación', 100, true, true),
    ('Concluido por resolución', 110, true, true)
ON CONFLICT (nombre) DO UPDATE
SET
    orden = EXCLUDED.orden,
    concluye_asunto = EXCLUDED.concluye_asunto,
    activo = EXCLUDED.activo,
    updated_at = now();

-- =========================================================
-- CATALOGO DE ESTATUS DE SOLICITUD EN REQUERIMIENTOS
-- =========================================================

INSERT INTO public.penal_catalogo_estatus_solicitud (nombre, orden, es_terminal, activo)
VALUES
    ('En trámite', 10, false, true),
    ('Documentación recibida', 20, false, true),
    ('Desahogada', 30, true, true)
ON CONFLICT (nombre) DO UPDATE
SET
    orden = EXCLUDED.orden,
    es_terminal = EXCLUDED.es_terminal,
    activo = EXCLUDED.activo,
    updated_at = now();

COMMIT;
