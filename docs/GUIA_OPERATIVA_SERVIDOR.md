# Guia Operativa del Servidor

## Rutas principales

- Codigo publico:
  - `C:/servidor/www/AplicativoLocal`
- Configuracion privada:
  - `C:/servidor/appdata/seguimiento_juicios/config/private-config.php`
- Storage real:
  - `D:/seguimiento_juicios/storage`
- Documentos civil:
  - `D:/seguimiento_juicios/storage/documentos/civil`
- Documentos penal:
  - `D:/seguimiento_juicios/storage/documentos/penal`
- Backups BD:
  - `D:/seguimiento_juicios/backups/bd`
- Backups documentos:
  - `D:/seguimiento_juicios/backups/documentos`

## Apache

- Archivo principal:
  - `C:/Apache24/conf/httpd.conf`
- DocumentRoot actual:
  - `C:/servidor/www/AplicativoLocal`
- Variable de entorno configurada:
  - `APP_PRIVATE_CONFIG=C:/servidor/appdata/seguimiento_juicios/config/private-config.php`
- Logs de Apache:
  - `C:/Apache24/logs/error_log`
  - `C:/Apache24/logs/access_log`

## Configuracion privada

El archivo `private-config.php` debe definir:

- `APP_BASE_PATH`
- `APP_STORAGE_PATH`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `APP_DEBUG`

## Base de datos

- Base actual:
  - `seguimiento_juicios`
- Usuario recomendado de la app:
  - `app_seguimiento`

## Tareas de respaldo

- Backup BD:
  - `D:/seguimiento_juicios/backups/backup_bd.bat`
- Backup documentos:
  - `D:/seguimiento_juicios/backups/backup_documentos.bat`
- Estado actual:
  - tareas creadas en el Programador de tareas
  - actualmente deshabilitadas

## Cuando se activen los respaldos

- Habilitar tarea `Backup BD Seguimiento`
- Habilitar tarea `Backup Documentos Seguimiento`
- Probar una ejecucion manual desde el Programador

## Validacion basica despues de cambios

Probar:

- login
- civil
- penal
- usuarios
- bitacora
- dados de baja
- subir PDF civil
- descargar PDF civil
- subir PDF penal
- descargar PDF penal

## Si falla login

Revisar:

- `private-config.php`
- usuario y password de BD
- `C:/Apache24/logs/error_log`

## Si fallan documentos

Revisar:

- `APP_STORAGE_PATH`
- permisos de escritura en `D:/seguimiento_juicios/storage`
- existencia de carpetas `civil` y `penal`

## Recordatorios

- No mover ni borrar `api/config.php`
- No borrar `tribunales` ni tablas legacy sin una migracion controlada
- Mantener `APP_DEBUG=false` en operacion normal
- Si se hacen pruebas sensibles, volver a desactivar debug al terminar
