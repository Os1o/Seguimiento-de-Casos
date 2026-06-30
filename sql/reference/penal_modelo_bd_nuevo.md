# Modelo Nuevo de BD para Penal

## Objetivo
Diseñar el módulo Penal como estructura nueva y separada del modelo legado actual (`expedientes_penal`, `seguimiento_penal`, `documentos_penal`), sin tocar todavía esas tablas.

La idea es:

- conservar Civil/Mercantil estable
- dejar Penal actual como legado temporal
- construir Penal nuevo con tablas claras, normalizadas y fáciles de extender

---

## Catálogos existentes que se reutilizan

Estas tablas ya existen y conviene reutilizarlas:

- `delegaciones`
  - En Penal se usan como OOAD
  - Aquí sí deben aparecer delegaciones con UMAE

- `areas`
  - Se usa para `Lugar de los hechos`
  - También puede reutilizarse para `Área responsable` de requerimientos internos

- `delitos`
  - Se usa para el catálogo de delito que se investiga
  - Penal puede ampliar esta tabla con nuevos delitos

- `usuarios`
  - Se usa para abogado responsable
  - Se aprovechan `es_abogado`, `es_jefe`, `delegacion_id`, `alcance_global`

- `auditoria_eventos`
  - Se mantiene para bitácora y trazabilidad

---

## Catálogos nuevos que necesita Penal

### 1. `penal_catalogo_etapas`
Para las actuaciones penales secundarias.

Ejemplos:

- Investigación inicial
- Investigación complementaria
- Judicializado
- Audiencia inicial
- Suspensión
- Archivo temporal
- No ejercicio de la acción penal
- Concluido por determinación

Campos sugeridos:

- `id`
- `nombre`
- `orden`
- `concluye_asunto`
- `activo`

### 2. `penal_catalogo_estatus_solicitud`
Para el seguimiento de cada solicitud dentro de un requerimiento.

Ejemplos:

- En trámite
- Documentación recibida
- Desahogada

Campos sugeridos:

- `id`
- `nombre`
- `orden`
- `es_terminal`
- `activo`

---

## Entidad principal

### `penal_asuntos`
Representa la carpeta penal principal.

Aquí vive solo la información estructural del alta inicial y algunos acumulados de control general.

Campos:

- `id`
- `delegacion_id`
- `numero_carpeta`
- `anio_inicio`
- `fecha_presentacion_denuncia`
- `delito_id`
- `hechos_denunciante`
- `sin_cuantificar`
- `cuantia_monto`
- `area_hechos_id`
- `dato_relevante`
- `escenario_denunciante`
- `coadyuvancia`
- `fecha_conocimiento_amp`
- `fecha_judicializacion`
- `determinacion_judicial`
- `estatus_general`
- `abogado_responsable_id`
- `created_at`
- `updated_at`
- `activo`
- `deleted_at`
- `deleted_by`

### Decisiones importantes

- `numero_carpeta` queda como texto
- `anio_inicio` queda como entero independiente
- `sin_cuantificar` y `cuantia_monto` viven juntos
- `estatus_general` se conserva como resumen alto nivel (`TRAMITE`, `CONCLUIDO`)
- `fase_actual` no se guarda aquí necesariamente; puede derivarse en backend

---

## Partes involucradas

### `penal_denunciantes`
Tabla hija de `penal_asuntos`.

Se normaliza porque puede haber:

- solo IMSS
- IMSS + otra persona
- denunciante distinto al IMSS
- coadyuvancia
- varios denunciantes en el futuro

Campos:

- `id`
- `asunto_id`
- `nombre`
- `es_imss`
- `es_principal`
- `es_coadyuvante`
- `orden`
- `created_at`

### `penal_probables_responsables`
Tabla hija de `penal_asuntos`.

Campos:

- `id`
- `asunto_id`
- `nombre`
- `es_qrr`
- `orden`
- `created_at`

### Decisiones importantes

- ambos quedan como texto libre, no catálogo
- así no dependemos de que la persona ya exista en otra tabla
- pero sí evitamos meter todo en un JSON imposible de consultar

---

## Documento inicial del asunto

### `penal_asunto_documentos`
Solo para documentos del alta inicial del asunto.

Campos:

- `id`
- `asunto_id`
- `nombre_original`
- `nombre_guardado`
- `ruta_archivo`
- `mime_type`
- `tamano_bytes`
- `observaciones`
- `usuario_id`
- `created_at`
- `activo`

Regla:

- para el alta inicial normalmente será un solo documento
- pero la tabla queda preparada por si más adelante quieren más de uno

---

## Registro de conocimiento del AMP

### `penal_conocimiento_amp`
Un registro separado porque tiene pantalla propia y traza propia.

Campos:

- `id`
- `asunto_id`
- `fecha_conocimiento_amp`
- `usuario_id`
- `created_at`
- `updated_at`

Regla:

- un asunto debe tener a lo sumo un registro vigente de conocimiento AMP

---

## Actuaciones penales

### `penal_actuaciones`
Equivalente al seguimiento secundario del asunto.

Campos:

- `id`
- `asunto_id`
- `fecha_actuacion`
- `etapa_id`
- `descripcion`
- `texto_complementario_estatus`
- `referencia_carpeta`
- `usuario_id`
- `created_at`
- `updated_at`
- `activo`
- `deleted_at`
- `deleted_by`

### `penal_actuacion_documentos`
Documentos de una actuación penal.

Campos:

- `id`
- `actuacion_id`
- `nombre_original`
- `nombre_guardado`
- `ruta_archivo`
- `mime_type`
- `tamano_bytes`
- `usuario_id`
- `created_at`
- `activo`

---

## Requerimientos ministeriales

### `penal_requerimientos`
Cabecera del requerimiento.

Representa el requerimiento inicial de fiscalía y después concentra el avance general del mismo ciclo.

Campos:

- `id`
- `asunto_id`
- `folio_referencia`
- `autoridad_emisora`
- `fecha_recepcion`
- `fecha_limite_atencion`
- `fecha_inicio_interno`
- `area_responsable_id`
- `fase_actual`
- `created_by`
- `created_at`
- `updated_at`
- `activo`

### `penal_requerimiento_documentos`
Documentos generales del requerimiento.

Se propone clasificar por tipo en lugar de hacer una tabla por cada momento.

Tipos sugeridos:

- `INICIAL_FISCALIA`
- `INTERNO_IMSS`
- `CONTESTACION_ENVIADA`
- `RESPUESTA_FISCALIA`

Campos:

- `id`
- `requerimiento_id`
- `tipo_documento`
- `nombre_original`
- `nombre_guardado`
- `ruta_archivo`
- `mime_type`
- `tamano_bytes`
- `observaciones`
- `usuario_id`
- `created_at`
- `activo`

### `penal_requerimiento_solicitudes`
Lista base de solicitudes capturadas en fase 1.

Campos:

- `id`
- `requerimiento_id`
- `numero_orden`
- `titulo`
- `descripcion`
- `created_at`
- `activo`

### `penal_requerimiento_solicitud_movimientos`
Historial real de atención/desahogo por solicitud.

Aquí vive el valor de negocio importante porque una solicitud puede tener más de un movimiento.

Campos:

- `id`
- `solicitud_id`
- `estatus_solicitud_id`
- `fecha_desahogo`
- `observaciones_documento`
- `usuario_id`
- `created_at`
- `activo`

### `penal_requerimiento_solicitud_documentos`
Documentos ligados a un movimiento de solicitud.

Campos:

- `id`
- `movimiento_id`
- `nombre_original`
- `nombre_guardado`
- `ruta_archivo`
- `mime_type`
- `tamano_bytes`
- `usuario_id`
- `created_at`
- `activo`

### `penal_requerimiento_contestaciones`
Permite varias contestaciones finales para el mismo requerimiento.

Esto es importante porque negocio ya dejó abierta la posibilidad de responder más de una vez.

Campos:

- `id`
- `requerimiento_id`
- `numero_orden`
- `fecha_envio_respuesta`
- `fecha_respuesta_fiscalia`
- `observaciones_finales`
- `usuario_id`
- `created_at`
- `activo`

### `penal_requerimiento_contestacion_documentos`
Documentos de una contestación final.

Tipos sugeridos:

- `CONTESTACION_ENVIADA`
- `RESPUESTA_FISCALIA`

Campos:

- `id`
- `contestacion_id`
- `tipo_documento`
- `nombre_original`
- `nombre_guardado`
- `ruta_archivo`
- `mime_type`
- `tamano_bytes`
- `usuario_id`
- `created_at`
- `activo`

---

## Qué tablas actuales quedan como legado

Estas no se tocan todavía, pero ya no deberían crecer:

- `expedientes_penal`
- `seguimiento_penal`
- `documentos_penal`
- `estados_procesales`
- `estatus_investigacion`

---

## Qué conserva la BD actual sin cambio

- `delegaciones`
- `areas`
- `delitos`
- `usuarios`
- `auditoria_eventos`
- `auth_rate_limits`

---

## Ventajas del modelo propuesto

- no mezcla alta inicial con seguimiento y contestación
- no depende de JSON para denunciantes o responsables
- soporta varios requerimientos por carpeta
- soporta varias solicitudes por requerimiento
- soporta varios movimientos por solicitud
- soporta varias contestaciones finales por requerimiento
- soporta historial real de seguimiento
- deja listo el terreno para exportaciones, filtros y bitácora fina

---

## Siguiente paso recomendado

Construir el DDL en SQL con nombres definitivos y constraints básicas.

Eso ya puede hacerse sin migrar datos viejos todavía.
