# Kit de Soporte SQL y Operativo

## 1. Proposito del Documento
Este documento sirve como apoyo operativo para personal de respaldo no desarrollador.

Su objetivo es:
- consultar informacion clave del sistema
- ejecutar correcciones controladas y autorizadas
- validar componentes tecnicos basicos
- saber cuando una incidencia puede atenderse y cuando debe escalarse

Este documento no autoriza:
- cambios en codigo fuente
- cambios de estructura en base de datos
- restauraciones improvisadas
- cambios no documentados en Apache, PHP o PostgreSQL

## 2. Regla Previa Antes de Ejecutar Correcciones
Antes de ejecutar cualquier accion que modifique informacion:

1. revisar la fecha del ultimo respaldo disponible
2. confirmar si la consulta es de revision o de correccion
3. no ejecutar consultas no incluidas en este kit
4. si existe duda sobre el impacto, no continuar y escalar

Si la accion esta marcada como correccion con respaldo previo obligatorio:
- se debe confirmar primero el ultimo backup
- si no existe certeza, generar respaldo manual o escalar

## 3. Rutas y Ubicaciones Clave

### Proyecto publico
- `C:\servidor\www\AplicativoLocal`

### Configuracion privada
- `C:\servidor\appdata\seguimiento_juicios\config\private-config.php`

### Storage de documentos
- `D:\seguimiento_juicios\storage`

### Backups
- `D:\seguimiento_juicios\backups`

### Log principal de Apache
- `C:\Apache24\logs\error_log`

## 4. Consultas de Revision
Estas consultas no modifican informacion.

### 4.1 Revisar usuario por nombre
Para que sirve:
- confirmar estatus, rol y permisos de un usuario

Consulta:
```sql
SELECT
    id,
    usuario,
    nombre_completo,
    rol,
    delegacion_id,
    alcance_global,
    permiso_civil_mercantil,
    permiso_penal,
    activo
FROM usuarios
WHERE usuario = 'USUARIO_AQUI';
```

### 4.2 Revisar usuario por id
Para que sirve:
- validar rapidamente un registro puntual

Consulta:
```sql
SELECT
    id,
    usuario,
    nombre_completo,
    rol,
    delegacion_id,
    alcance_global,
    permiso_civil_mercantil,
    permiso_penal,
    activo
FROM usuarios
WHERE id = 1;
```

### 4.3 Revisar bloqueos de rate limit
Para que sirve:
- confirmar si un usuario o una IP fueron bloqueados por intentos de login

Consulta:
```sql
SELECT *
FROM auth_rate_limits
ORDER BY updated_at DESC;
```

### 4.4 Revisar bloqueo por usuario
Para que sirve:
- confirmar si un usuario puntual esta bloqueado

Consulta:
```sql
SELECT *
FROM auth_rate_limits
WHERE scope = 'usuario'
  AND identifier = 'USUARIO_AQUI';
```

### 4.5 Revisar bloqueo por IP
Para que sirve:
- confirmar si una IP puntual esta bloqueada

Consulta:
```sql
SELECT *
FROM auth_rate_limits
WHERE scope = 'ip'
  AND identifier = 'IP_AQUI';
```

### 4.6 Revisar secuencia de usuarios
Para que sirve:
- detectar si la secuencia de ids podria estar desfasada

Consulta:
```sql
SELECT MAX(id) AS max_id FROM usuarios;
```

Consulta complementaria:
```sql
SELECT last_value FROM public.usuarios_id_seq;
```

### 4.7 Revisar secuencia de expedientes civil
Consulta:
```sql
SELECT MAX(id) AS max_id FROM expedientes_civil;
```

Consulta complementaria:
```sql
SELECT last_value FROM public.expedientes_civil_id_seq;
```

### 4.8 Revisar secuencia de expedientes penal
Consulta:
```sql
SELECT MAX(id) AS max_id FROM expedientes_penal;
```

Consulta complementaria:
```sql
SELECT last_value FROM public.expedientes_penal_id_seq;
```

### 4.9 Revisar cantidad de registros demo civil
Consulta:
```sql
SELECT COUNT(*)
FROM expedientes_civil
WHERE numero_expediente LIKE 'DEMO-CIV-%';
```

### 4.10 Revisar cantidad de registros demo penal
Consulta:
```sql
SELECT COUNT(*)
FROM expedientes_penal
WHERE dato_relevante LIKE 'DEMO PENAL%';
```

### 4.11 Revisar reparto demo penal por delegacion
Consulta:
```sql
SELECT delegacion_id, COUNT(*)
FROM expedientes_penal
WHERE dato_relevante LIKE 'DEMO PENAL%'
GROUP BY delegacion_id
ORDER BY delegacion_id;
```

### 4.12 Revisar conteo general civil
Consulta:
```sql
SELECT COUNT(*) AS total_activos
FROM expedientes_civil
WHERE activo = TRUE;
```

### 4.13 Revisar conteo general penal
Consulta:
```sql
SELECT COUNT(*) AS total_activos
FROM expedientes_penal
WHERE activo = TRUE;
```

## 5. Consultas de Correccion Segura
Estas consultas modifican informacion de forma controlada y frecuente.

### 5.1 Desbloquear rate limit de un usuario
Usar cuando:
- un usuario quedo bloqueado por intentos de login

Consulta:
```sql
DELETE FROM auth_rate_limits
WHERE scope = 'usuario'
  AND identifier = 'USUARIO_AQUI';
```

### 5.2 Desbloquear rate limit de una IP
Consulta:
```sql
DELETE FROM auth_rate_limits
WHERE scope = 'ip'
  AND identifier = 'IP_AQUI';
```

### 5.3 Limpiar todos los bloqueos de rate limit
Usar con cuidado:
- solo cuando sea necesario desbloquear pruebas o limpiar el entorno

Consulta:
```sql
TRUNCATE TABLE auth_rate_limits RESTART IDENTITY;
```

### 5.4 Activar usuario
Consulta:
```sql
UPDATE usuarios
SET activo = TRUE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.5 Desactivar usuario
Consulta:
```sql
UPDATE usuarios
SET activo = FALSE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.6 Dar permiso civil a un usuario
Consulta:
```sql
UPDATE usuarios
SET permiso_civil_mercantil = TRUE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.7 Quitar permiso civil a un usuario
Consulta:
```sql
UPDATE usuarios
SET permiso_civil_mercantil = FALSE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.8 Dar permiso penal a un usuario
Consulta:
```sql
UPDATE usuarios
SET permiso_penal = TRUE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.9 Quitar permiso penal a un usuario
Consulta:
```sql
UPDATE usuarios
SET permiso_penal = FALSE
WHERE usuario = 'USUARIO_AQUI';
```

### 5.10 Reacomodar secuencia de usuarios
Usar cuando:
- aparezca error de llave duplicada en `usuarios`

Consulta:
```sql
SELECT setval(
    'public.usuarios_id_seq',
    COALESCE((SELECT MAX(id) FROM public.usuarios), 1),
    true
);
```

### 5.11 Reacomodar secuencia de expedientes civil
Consulta:
```sql
SELECT setval(
    'public.expedientes_civil_id_seq',
    COALESCE((SELECT MAX(id) FROM public.expedientes_civil), 1),
    true
);
```

### 5.12 Reacomodar secuencia de expedientes penal
Consulta:
```sql
SELECT setval(
    'public.expedientes_penal_id_seq',
    COALESCE((SELECT MAX(id) FROM public.expedientes_penal), 1),
    true
);
```

### 5.13 Reacomodar secuencia de seguimiento penal
Consulta:
```sql
SELECT setval(
    'public.seguimiento_penal_id_seq',
    COALESCE((SELECT MAX(id) FROM public.seguimiento_penal), 1),
    true
);
```

## 6. Consultas de Correccion con Respaldo Previo Obligatorio
Estas acciones requieren confirmar respaldo previo.

### 6.1 Limpiar bitacora completa
Usar solo si esta autorizado.

Consulta:
```sql
TRUNCATE TABLE auditoria_eventos RESTART IDENTITY;
```

### 6.2 Eliminar registros demo civil
Usar solo si ya no se necesitan para pruebas o presentaciones.

Consulta:
```sql
DELETE FROM expedientes_civil
WHERE numero_expediente LIKE 'DEMO-CIV-%';
```

### 6.3 Eliminar registros demo penal
Consulta:
```sql
DELETE FROM expedientes_penal
WHERE dato_relevante LIKE 'DEMO PENAL%';
```

### 6.4 Correcciones directas sobre expedientes
Regla:
- no ejecutar updates directos sobre expedientes civiles o penales si no existe autorizacion clara y respaldo reciente

## 7. Acciones Operativas No SQL

### 7.1 Reinicio controlado de Apache
Usar cuando:
- el sitio no responda
- se haya cambiado configuracion autorizada

Accion:
- reiniciar el servicio Apache desde servicios o panel operativo autorizado

### 7.2 Validacion de sintaxis de Apache
Usar cuando:
- Apache no levante
- se sospeche de configuracion invalida

Comando:
```bat
C:\Apache24\bin\httpd.exe -t
```

### 7.3 Validacion de PostgreSQL
Usar cuando:
- login, guardado o catalogos fallen en general

Accion:
- revisar si el servicio PostgreSQL esta iniciado
- validar acceso desde pgAdmin a la base `seguimiento_juicios`

### 7.4 Revisar configuracion privada
Validar que exista:
- `C:\servidor\appdata\seguimiento_juicios\config\private-config.php`

### 7.5 Revisar storage de documentos
Validar que exista:
- `D:\seguimiento_juicios\storage`

Validar subcarpetas:
- `D:\seguimiento_juicios\storage\documentos\civil`
- `D:\seguimiento_juicios\storage\documentos\penal`

### 7.6 Revisar log de Apache
Archivo:
- `C:\Apache24\logs\error_log`

Usar cuando:
- aparezca error 500
- Apache no levante
- algun endpoint falle sin detalle claro

## 8. Señales de Alerta para Escalar
Se debe escalar cuando ocurra cualquiera de estas situaciones:

- error 500 persistente
- Apache no levanta despues de reinicio controlado
- PostgreSQL no responde
- documentos faltantes o inconsistentes
- datos aparentemente corruptos
- fallas que afectan a varios usuarios
- necesidad de tocar codigo
- necesidad de cambiar estructura de base de datos
- necesidad de restaurar backup

## 9. Formato Sugerido para Registrar Intervencion
Cada incidencia atendida deberia registrar al menos:

- fecha
- hora
- responsable
- usuario afectado
- modulo afectado
- descripcion breve de la falla
- accion realizada
- resultado
- si fue escalado o no

## 10. Glosario Corto

### Secuencia
Contador interno de PostgreSQL que genera ids automaticos.

### Rate limit
Bloqueo temporal por demasiados intentos de login.

### Backup
Respaldo de base de datos o documentos.

### Storage
Carpeta fisica donde se almacenan documentos del sistema.

### Sesion activa
Acceso vigente del usuario dentro del sistema.
