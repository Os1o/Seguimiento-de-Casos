-- =====================================================
-- DEPURACION AISLADA - MODULO PENAL TRANSACCIONAL
-- Motor esperado: PostgreSQL.
--
-- Objetivo:
--   Vaciar exclusivamente tablas de hechos, movimientos y documentos
--   del modulo Penal, reiniciando secuencias mediante TRUNCATE.
--
-- Exclusiones explicitas:
--   - Catalogos penales: penal_catalogo_etapas,
--     penal_catalogo_estatus_solicitud.
--   - Catalogos generales: delitos, delegaciones, areas.
--   - Seguridad/parametrizacion: usuarios, roles/permisos.
--   - Cualquier tabla Civil/Mercantil.
--
-- Advertencia:
--   Este script elimina datos transaccionales penales.
-- =====================================================

TRUNCATE TABLE
    penal_requerimiento_contestacion_documentos,
    penal_requerimiento_contestaciones,
    penal_requerimiento_solicitud_documentos,
    penal_requerimiento_solicitud_movimientos,
    penal_requerimiento_solicitudes,
    penal_requerimiento_documentos,
    penal_requerimientos,
    penal_actuacion_documentos,
    penal_actuaciones,
    penal_conocimiento_amp,
    penal_asunto_documentos,
    penal_probables_responsables,
    penal_denunciantes,
    penal_asuntos,
    documentos_penal,
    seguimiento_penal,
    expedientes_penal
RESTART IDENTITY CASCADE;
