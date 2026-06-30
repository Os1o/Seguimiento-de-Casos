# Entrega de Proyecto por Vacaciones

## 1. Resumen ejecutivo

El proyecto es un **sistema interno para seguimiento de asuntos jurídicos del IMSS**, dividido en dos módulos principales:

- **Civil / Mercantil**
- **Penal**

El sistema permite registrar asuntos, actualizarlos, adjuntar documentos PDF, controlar usuarios con permisos por módulo, mantener bitácora de movimientos relevantes y operar sobre una base de datos local PostgreSQL con un servidor Apache + PHP.

En este momento el sistema se encuentra **funcional en servidor**, con estructura operativa, respaldo preparado y reglas principales de negocio ya implementadas.

---

## 2. Objetivo funcional del sistema

El sistema fue construido para:

- registrar expedientes/asuntos jurídicos
- consultar su información detallada
- actualizar seguimiento procesal
- adjuntar documentación en PDF
- administrar usuarios y permisos
- auditar acciones relevantes
- controlar expedientes dados de baja lógicamente
- restaurar expedientes eliminados lógicamente

Adicionalmente, en el módulo civil se integró lógica para:

- **acumulación de asuntos**
- catálogo real de **órganos jurisdiccionales**
- control de actualización para asuntos acumulados

---

## 3. Arquitectura técnica

### Backend

- **PHP** como backend principal
- Endpoints organizados bajo `api/`
- Lógica separada por módulos:
  - `api/civil/`
  - `api/penal/`
  - `api/users/`
  - `api/auth/`
  - `api/admin/`

### Frontend

- HTML + CSS + JavaScript vanilla
- Pantallas separadas por flujo:
  - alta
  - edición
  - detalle
  - actualización
  - administración

### Base de datos

- **PostgreSQL**
- Base principal:
  - `seguimiento_juicios`
- Usuario recomendado de la app:
  - `app_seguimiento`

### Servidor web

- **Apache 2.4**
- PHP cargado como módulo de Apache

---

## 4. Estructura del servidor

### Código público

- `C:/servidor/www/AplicativoLocal`

Aquí vive:

- `api/`
- `css/`
- `js/`
- archivos `.html`

### Configuración privada

- `C:/servidor/appdata/seguimiento_juicios/config/private-config.php`

Aquí se definen:

- `APP_BASE_PATH`
- `APP_STORAGE_PATH`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `APP_DEBUG`

### Storage real

- `D:/seguimiento_juicios/storage`

Subcarpetas clave:

- `D:/seguimiento_juicios/storage/documentos/civil`
- `D:/seguimiento_juicios/storage/documentos/penal`

### Backups

- `D:/seguimiento_juicios/backups/bd`
- `D:/seguimiento_juicios/backups/documentos`

Scripts de respaldo:

- `D:/seguimiento_juicios/backups/backup_bd.bat`
- `D:/seguimiento_juicios/backups/backup_documentos.bat`

Actualmente las tareas del Programador de tareas están **creadas pero deshabilitadas**, listas para habilitarse cuando se decida operar con respaldos automáticos.

---

## 5. Configuración de Apache

Archivo principal:

- `C:/Apache24/conf/httpd.conf`

Puntos importantes:

- `DocumentRoot` apunta a:
  - `C:/servidor/www/AplicativoLocal`
- variable de entorno cargada:
  - `APP_PRIVATE_CONFIG=C:/servidor/appdata/seguimiento_juicios/config/private-config.php`

Logs principales:

- `C:/Apache24/logs/error_log`
- `C:/Apache24/logs/access_log`

---

## 6. Seguridad y operación

### Configuración sensible fuera del webroot

La configuración privada no vive dentro de la carpeta pública del sistema.  
Esto evita exponer credenciales de base de datos y rutas internas.

### Storage fuera del webroot

Los documentos PDF no se sirven directamente desde la carpeta pública, sino desde `storage` fuera del webroot y se entregan mediante API.

### Usuario de base de datos

La aplicación ya puede trabajar con un usuario dedicado:

- `app_seguimiento`

### HTTPS

Se dejó configurado **HTTPS con certificado autofirmado** para cifrado interno.

Importante:

- la conexión ya puede ir cifrada
- el navegador mostrará advertencia porque el certificado es autofirmado
- si se desea una experiencia sin advertencia, en el futuro se requerirá un certificado confiable y preferentemente un nombre interno de host

### Sesiones

El sistema cuenta con control de sesión y cierre por sustitución de sesión activa.

Esto significa que:

- si la misma cuenta inicia sesión en otro equipo o navegador
- la sesión anterior puede invalidarse

---

## 7. Módulos y funciones principales

## 7.1. Módulo Civil / Mercantil

Funciones principales:

- alta de asuntos civiles
- edición de datos del asunto
- detalle completo del asunto
- actualización de seguimiento
- carga de PDF ligados a seguimiento
- descarga de PDF
- baja lógica
- restauración desde panel de eliminados
- acumulación de asuntos
- visualización de historial
- filtros y búsqueda

### Catálogo jurisdiccional

Civil ya trabaja con el catálogo real de:

- `organos_jurisdiccionales`

con relación a delegaciones mediante:

- `organos_jurisdiccionales_delegaciones`

Se conservaron elementos legacy por seguridad y compatibilidad, pero el catálogo real ya está integrado.

### Regla de acumulación

Cuando un asunto civil se acumula como hijo:

- se marca como concluido
- no debe seguir recibiendo edición normal
- no debe recibir seguimiento mientras permanezca acumulado

Ya se reforzó la lógica para que no dependa solo de la interfaz.

## 7.2. Módulo Penal

Funciones principales:

- alta de asuntos penales
- edición de datos
- detalle de asunto
- actualización de seguimiento
- carga y descarga de PDF
- baja lógica
- restauración
- filtros y consulta

## 7.3. Administración de usuarios

Funciones principales:

- alta de usuarios
- edición de usuarios
- activación / desactivación
- rol:
  - admin
  - editor
  - consulta
- permisos por módulo:
  - civil / mercantil
  - penal
- alcance por delegación o global según perfil

## 7.4. Bitácora / Auditoría

El sistema registra eventos relevantes como:

- inicio y cierre de sesión
- creación y edición de expedientes
- seguimientos
- acumulaciones
- cambios en usuarios
- eliminaciones y restauraciones

Esto permite trazabilidad operativa.

## 7.5. Dados de baja / restauración

No se hace eliminación destructiva de expedientes como operación normal.  
Se usa **baja lógica** y existe vista de recuperación para civil y penal.

---

## 8. Catálogos y reglas relevantes

El sistema maneja catálogos para:

- delegaciones
- áreas generadoras
- órganos jurisdiccionales
- prestaciones
- tipos de actuación
- tipos y subtipos de juicio
- delitos
- estados procesales

En civil, el catálogo de tribunal/juzgado fue sustituido funcionalmente por el catálogo real de órganos jurisdiccionales.

Además, se mejoró la experiencia de usuario con:

- select buscable embebido en catálogos largos
- apertura del selector de fecha al hacer clic en el campo

---

## 9. Estado actual del proyecto

### Estado general

El sistema se encuentra en un punto **usable y operativo**, con despliegue funcional y pruebas principales ya realizadas.

### Lo que ya está resuelto

- login y sesiones
- administración de usuarios
- módulo civil operativo
- módulo penal operativo
- bitácora
- baja lógica
- restauración
- carga y descarga de documentos
- integración de catálogo real de órganos jurisdiccionales
- acumulación de asuntos civiles
- separación de configuración privada
- storage fuera del webroot
- scripts de respaldo listos

### Ajustes recientes relevantes

- protección de asuntos acumulados para impedir edición/seguimiento indebido
- mejora visual para identificar asuntos acumulados
- integración de HTTPS autofirmado

---

## 10. Riesgos o consideraciones conocidas

- El HTTPS actual es **autofirmado**, por lo que mostrará advertencia en navegador.
- Hay tablas legacy conservadas por compatibilidad; no deben eliminarse sin migración controlada.
- Las tareas de backup están listas pero **aún deshabilitadas**.
- Si se hacen pruebas con `APP_DEBUG=true`, debe volver a dejarse en `false`.

---

## 11. Operación básica recomendada

Después de cualquier cambio importante conviene validar:

- login
- civil
- penal
- usuarios
- bitácora
- dados de baja
- subida de PDF civil
- descarga de PDF civil
- subida de PDF penal
- descarga de PDF penal

---

## 12. Si algo falla

### Si falla login

Revisar:

- `private-config.php`
- credenciales de BD
- `C:/Apache24/logs/error_log`

### Si fallan documentos

Revisar:

- `APP_STORAGE_PATH`
- permisos en `D:/seguimiento_juicios/storage`
- existencia de carpetas:
  - `civil`
  - `penal`

### Si falla la BD

Revisar:

- conectividad a PostgreSQL
- usuario `app_seguimiento`
- secuencias si hubo restauraciones o inserts manuales

---

## 13. Recomendaciones para continuidad

- habilitar respaldos automáticos cuando se defina la operación formal
- mantener pruebas breves después de cambios
- no borrar tablas legacy sin revisar dependencias
- si se quiere HTTPS sin advertencias, migrar a certificado confiable y nombre interno de host

---

## 14. Conclusión

El sistema ya cubre la operación principal esperada para seguimiento jurídico civil y penal, con control de usuarios, documentos, auditoría, baja lógica y restauración.  
La infraestructura base ya está montada y funcional en servidor, con separación razonable entre código público, configuración sensible y almacenamiento documental.

En resumen:

- el proyecto está **usable**
- el despliegue está **estable**
- y la continuidad operativa es viable con la documentación y rutas aquí descritas

