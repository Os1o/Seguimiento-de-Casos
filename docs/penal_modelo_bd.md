# Penal Nuevo Modelo y Pantallas

## Estado actual

- Civil y Mercantil se consideran estables.
- Penal se considera modulo en rediseño.
- No se migran datos viejos de Penal por ahora.
- El trabajo nuevo de Penal debe montarse con estructura nueva, sin seguir cargando mas complejidad al modelo legado.

## Catalogos que Penal reutiliza

### Reutilizados tal cual

- `delitos`
- `areas`
- `usuarios`
- `delegaciones`

### Reutilizados con filtro distinto

- `delegaciones`
  - Civil / Mercantil: usar como JSJ y excluir UMAE
  - Penal: usar como OOAD e incluir UMAE

- `areas`
  - Civil / Mercantil: area generadora
  - Penal: lugar de los hechos y area responsable interna para requerimientos

## Catalogos nuevos que Penal necesitara

- `penal_etapas_catalogo`
- `penal_estatus_solicitud_catalogo`
- `penal_estatus_requerimiento_catalogo`
- posible futuro `penal_autoridades_catalogo`

## Modulos funcionales de Penal

1. Registro inicial o nuevo asunto penal
2. Actualizacion inicial
3. Actualizaciones secundarias
4. Requerimientos ministeriales
5. Detalle del asunto penal
6. Exportacion futura

---

## Tabla principal recomendada

La tabla principal de Penal no debe intentar mostrar todo el Excel operativo. Debe mostrar el resumen suficiente para localizar, filtrar y abrir el asunto.

### Columnas recomendadas

1. OOAD
2. No. de carpeta
3. Ano
4. Delito que se investiga
5. Denunciante principal
6. Probable responsable principal
7. Etapa actual
8. Fecha de presentacion de denuncia / querella
9. Fecha de conocimiento del AMP / Fiscal
10. Abogado responsable
11. Requerimientos abiertos
12. Ultima actualizacion
13. Acciones

### Reglas de despliegue

- `Denunciante principal`
  - si solo existe uno, mostrar ese
  - si existen varios, mostrar el primero y un indicador tipo `+N`

- `Probable responsable principal`
  - si solo existe uno, mostrar ese
  - si existen varios, mostrar el primero y un indicador tipo `+N`
  - si aplica QRR, mostrar `QRR`

- `Requerimientos abiertos`
  - mostrar numero de solicitudes pendientes de desahogo
  - si no hay requerimientos, mostrar `0` o `-`

- `Ultima actualizacion`
  - debe venir de la ultima actualizacion secundaria registrada
  - si aun no existe actualizacion secundaria, usar la fecha mas reciente del asunto disponible

### Lo que no recomiendo poner en la tabla principal

- Hechos completos
- Datos relevantes completos
- Todas las fechas judiciales
- Determinacion judicial completa
- Notas del jefe
- Desglose completo de requerimientos

Eso debe vivir en el detalle.

---

## Pantallas exactas por modulo

## Registro inicial

### Bloque 1. Base del asunto

- OOAD
- No. de carpeta
- Fecha de presentacion de la denuncia / querella
- Delito que se investiga
- Hechos con datos de la victima / denunciante
- Cuantia
- bandera `sin cuantificar`
- Lugar de los hechos
- Datos relevantes
- bandera `es_coadyuvancia`

### Bloque 2. Denunciantes

- lista de 1 a N denunciantes
- campo de texto libre por registro
- IMSS precargado como primer valor sugerido
- posibilidad de agregar mas denunciantes manuales

### Bloque 3. Probables responsables

- lista de 1 a N probables responsables
- campo de texto libre por registro
- bandera por elemento para `QRR`

### Bloque 4. Documento inicial

- un solo archivo
- observaciones opcionales del archivo inicial

### Bloque 5. Asignacion de abogado

- abogado responsable
- por defecto:
  - si quien registra es abogado editor, queda preasignado y bloqueado
  - si es admin o jefe editor, puede escoger abogado

### Bloque 6. Notas iniciales

- observaciones internas iniciales
- comentario breve de arranque del asunto

### Salida del guardado

Despues de guardar, mostrar modal:

`¿Existen acciones pendientes a realizar?`

- Si responde `Si`, abrir flujo de requerimientos ministeriales
- Si responde `No`, regresar a tabla principal

---

## Actualizacion inicial

### Bloque 7. Primer dato procesal

- Fecha de conocimiento del AMP / Fiscal

### Regla

- no puede ser menor a la fecha de presentacion de la denuncia / querella

---

## Actualizaciones secundarias

### Bloque 8. Actualizacion posterior

- Fecha de actuacion
- Etapa
- Descripcion de lo sucedido
- documento opcional

### Reglas

- pueden existir multiples actualizaciones
- una actualizacion puede existir sin requerimiento ministerial
- este flujo es independiente del flujo de requerimientos

---

## Requerimientos ministeriales

## Estructura general

Un asunto penal puede tener:

- 0 a N requerimientos ministeriales
- cada requerimiento ministerial puede tener 1 a N solicitudes

## Requerimiento ministerial padre

### Bloque 9. Requerimiento inicial de Fiscalia

- Fecha de recepcion por el IMSS
- Fecha interna de registro del requerimiento
- Autoridad / Fiscalia / MP emisor
- Folio o referencia
- Fecha limite de atencion
- observaciones generales

### Bloque 10. Requerimiento interno al area

- Fecha de inicio de solicitud al area
- Fecha interna de registro de este paso
- Area responsable
- observaciones generales

## Solicitudes internas por requerimiento

### Bloque 11. Solicitudes del requerimiento

Cada requerimiento padre puede contener 1 a N solicitudes:

- Titulo o nombre corto de la solicitud
- Descripcion de lo solicitado
- Fecha de inicio
- Estatus de la solicitud
- bandera `recibio_documentacion`
- Observaciones del desahogo
- Fecha de desahogo
- Fecha interna de registro de desahogo

### Bloque 12. Documento por solicitud

- un archivo por solicitud
- solo aparece o se habilita cuando `recibio_documentacion = si`

## Contestacion final del requerimiento

### Bloque 13. Respuesta final

- Fecha de envio de respuesta final
- Fecha de respuesta final de la Fiscalia
- Observaciones finales
- archivo de respuesta enviada
- archivo de respuesta final recibida
- fecha interna de registro

### Criterio funcional

- esta respuesta final cuelga del requerimiento, no del asunto completo

---

## Detalle del asunto penal

El detalle debe priorizar lectura operativa, no solo captura.

## Bloque 14. Encabezado del asunto

- No. de carpeta
- OOAD
- abogado responsable
- etapa actual
- fecha de presentacion de denuncia / querella
- fecha de conocimiento AMP / Fiscal
- indicador de coadyuvancia
- ultima actualizacion

## Bloque 15. Resumen juridico

- Delito que se investiga
- cuantia o sin cuantificar
- lugar de los hechos
- datos relevantes

## Bloque 16. Hechos

- texto completo de hechos con datos de la victima / denunciante

## Bloque 17. Denunciantes

- listado completo de denunciantes
- marcar si uno de ellos es IMSS

## Bloque 18. Probables responsables

- listado completo de probables responsables
- marcar si aplica QRR

## Bloque 19. Documento inicial

- archivo inicial
- observaciones del archivo

## Bloque 20. Seguimiento procesal

- fecha de conocimiento AMP / Fiscal
- historial de actualizaciones secundarias
- etapa actual
- documento asociado a cada actualizacion

## Bloque 21. Requerimientos ministeriales

Listado de requerimientos del asunto, con resumen por tarjeta o acordeon:

- autoridad emisora
- folio o referencia
- fecha de recepcion
- fecha limite
- estado general del requerimiento
- total de solicitudes
- solicitudes pendientes

## Bloque 22. Solicitudes por requerimiento

Dentro de cada requerimiento:

- titulo de solicitud
- descripcion
- estatus
- si ya fue desahogada
- fecha de desahogo
- archivo de soporte

## Bloque 23. Respuesta final del requerimiento

- fecha de envio
- archivo enviado
- fecha de respuesta final
- archivo de respuesta final
- observaciones

## Bloque 24. Bitacora operativa del asunto

- altas
- actualizaciones
- cambios de etapa
- requerimientos
- desahogos
- reasignacion de abogado

## Bloque 25. Acciones

- editar asunto
- registrar actualizacion inicial
- registrar actualizacion secundaria
- crear requerimiento ministerial
- reasignar abogado
- descargar documento(s)

---

## Reglas de negocio importantes ya acordadas

- Penal usa `OOAD`, no `JSJ` en la interfaz
- Penal si debe mostrar UMAE en delegaciones
- Civil no debe mostrar UMAE
- Lugar de los hechos reutiliza catalogo `areas`
- el denunciante y el probable responsable deben modelarse como 1 a N
- en Penal no conviene seguir usando JSON para eso
- el requerimiento ministerial es independiente de las actualizaciones procesales
- una carpeta puede existir sin requerimientos
- la fecha de conocimiento del AMP / Fiscal es un paso aparte del registro inicial
- los datos viejos de Penal no se migran todavia al nuevo modelo

---

## Orden recomendado de implementacion

1. Diseñar pantalla de tabla principal Penal nueva
2. Diseñar pantalla de detalle Penal nueva
3. Crear DDL nuevo de tablas Penal
4. Construir nuevo registro inicial
5. Construir actualizacion inicial
6. Construir actualizaciones secundarias
7. Construir requerimientos ministeriales
8. Construir exportacion
9. Revisar migracion o convivencia con legado

---

## Pendientes por confirmar con negocio

- nombres exactos del catalogo de etapas
- nombres exactos del catalogo de estatus de solicitud
- si la autoridad emisora quedara como texto libre o catalogo
- si la respuesta final siempre la sube el area o podria subirla Juridica
- si en detalle conviene mostrar metricas resumidas de requerimientos
