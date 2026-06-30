BEGIN;

ALTER TABLE public.penal_requerimientos
    ADD COLUMN IF NOT EXISTS deleted_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS deleted_by integer,
    ADD COLUMN IF NOT EXISTS restored_at timestamp with time zone,
    ADD COLUMN IF NOT EXISTS restored_by integer;

CREATE INDEX IF NOT EXISTS idx_penal_requerimientos_asunto_activo
    ON public.penal_requerimientos (asunto_id, activo, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_penal_requerimientos_deleted_at
    ON public.penal_requerimientos (deleted_at)
    WHERE activo = false;

COMMIT;
