# Manual de Contingencias y Soporte Operativo

## Objetivo
Este documento sirve como guia de apoyo para personal de respaldo no desarrollador.

Su objetivo es:
- atender incidencias operativas comunes
- evitar intervenciones riesgosas en codigo o configuracion
- definir cuando una falla puede corregirse y cuando debe escalarse

## Perfil del Personal de Respaldo
El personal de respaldo puede operar el sistema a nivel funcional y de soporte basico-avanzado, pero no debe realizar mantenimiento de desarrollo.

Esto significa que si puede:
- revisar accesos, permisos y estatus de usuarios
- validar si Apache y PostgreSQL estan respondiendo
- ejecutar consultas SQL autorizadas
- reiniciar servicios cuando el procedimiento lo indique
- revisar documentos, rutas y configuracion documentada

Esto significa que no debe:
- editar archivos `.php`, `.js`, `.html` o `.css`
- cambiar reglas de negocio
- modificar estructura de base de datos
- improvisar cambios en configuracion de Apache, PHP o PostgreSQL
- restaurar respaldos sin autorizacion

## Regla General Antes de Corregir
Antes de ejecutar cualquier consulta que modifique informacion:

1. revisar la fecha del ultimo respaldo disponible
2. si existe duda sobre la consulta, no ejecutarla
3. si la consulta puede afectar datos sensibles, generar respaldo manual previo o escalar

## Clasificacion de Incidentes

### Incidentes que el personal de respaldo si puede resolver
- usuario bloqueado por intentos de login
- permisos incorrectos de un usuario
- usuario activo o inactivo
- secuencia desfasada en una tabla
- validacion de existencia fisica de documentos
- reinicio controlado de Apache
- verificacion de servicio de PostgreSQL
- confirmacion de rutas clave del sistema

### Incidentes que pueden diagnosticar y despues escalar
- no deja iniciar sesion
- no carga civil o penal
- no sube PDF
- no descarga PDF
- error 500
- sesiones que se cierran inesperadamente
- acceso incorrecto a modulos

### Incidentes que deben escalarse de inmediato
- Apache no levanta despues de un reinicio controlado
- PostgreSQL no responde
- perdida de documentos
- datos borrados o corruptos
- necesidad de modificar codigo
- necesidad de cambiar estructura de base de datos
- restauracion de respaldos
- fallas generalizadas que afectan a todos los usuarios

## Incidentes y Respuesta Operativa

### 1. No deja iniciar sesion
Sintoma:
- el usuario no puede entrar al sistema

Que revisar:
- que el usuario y la contraseña sean correctos
- que el usuario este activo
- que no este bloqueado por rate limit
- que Apache responda
- que PostgreSQL responda

Solucion permitida:
- validar estatus del usuario
- desbloquear rate limit si aplica
- pedir nuevo intento de inicio de sesion

Escalar si:
- el problema afecta a varios usuarios
- el login sigue fallando despues de validar usuario y bloqueo
- aparece error 500

### 2. Usuario bloqueado por intentos de login
Sintoma:
- el sistema indica demasiados intentos o no deja volver a intentar

Que revisar:
- registro en tabla `auth_rate_limits`

Solucion permitida:
- limpiar el bloqueo del usuario o de la IP con consultas autorizadas

Escalar si:
- el bloqueo reaparece sin razon clara
- el problema afecta a varios usuarios o varias IP

### 3. No carga modulo civil o penal
Sintoma:
- la pagina abre pero redirige mal
- el usuario no ve informacion
- el usuario entra a un modulo que no le corresponde

Que revisar:
- sesion activa
- permisos del usuario
- modulo permitido al usuario

Solucion permitida:
- validar `permiso_civil_mercantil`
- validar `permiso_penal`
- pedir cierre e inicio de sesion nuevamente

Escalar si:
- el usuario tiene permisos correctos y aun asi el problema continua
- el problema se repite con varios usuarios

### 4. No deja guardar usuario nuevo
Sintoma:
- al crear usuario aparece error

Que revisar:
- secuencia de tabla `usuarios`
- permisos del usuario de base de datos de la aplicacion

Solucion permitida:
- revisar secuencia
- reacomodar secuencia si esta desfasada

Escalar si:
- el error no corresponde a secuencia
- afecta tambien otras operaciones de guardado

### 5. No sube PDF
Sintoma:
- falla al adjuntar documento

Que revisar:
- que el archivo sea PDF real
- que no exceda el tamaño permitido
- que la ruta de `storage` exista
- que Apache/PHP tengan permisos de escritura

Solucion permitida:
- pedir nuevo archivo si el actual no es valido
- confirmar ruta y permisos documentados

Escalar si:
- el problema afecta a varios usuarios
- ningun archivo sube aunque sea valido

### 6. No descarga o no aparece documento
Sintoma:
- el documento no abre
- el sistema no encuentra el archivo

Que revisar:
- existencia fisica del archivo en `storage`
- nombre o ruta guardada
- respuesta del endpoint del documento

Solucion permitida:
- validar si el archivo existe en disco
- confirmar que el expediente tiene documento asociado

Escalar si:
- hay perdida de archivo
- hay inconsistencia entre base de datos y disco

### 7. Error 500
Sintoma:
- el navegador muestra error 500
- una operacion falla sin detalle visible

Que revisar:
- respuesta de la peticion en navegador
- `error_log` de Apache
- si el problema es de login, guardado, documentos o permisos

Solucion permitida:
- diagnosticar el punto exacto donde falla
- activar temporalmente modo debug solo si el procedimiento lo autoriza

Escalar si:
- el error persiste
- el error toca varias funciones
- la causa requiere cambios de codigo

### 8. Sesion expirada o cierre por inactividad
Sintoma:
- el sistema regresa a login
- muestra mensaje de sesion expirada

Que revisar:
- si hubo 10 minutos de inactividad
- si la cuenta inicio sesion en otro navegador o equipo

Solucion permitida:
- pedir nuevo inicio de sesion
- confirmar si hubo reemplazo de sesion

Escalar si:
- ocurre de forma constante sin explicacion
- afecta a varios usuarios

### 9. Apache no responde
Sintoma:
- la aplicacion no abre
- el navegador no carga el sitio

Que revisar:
- si el servicio Apache esta iniciado
- si hay cambios recientes en configuracion

Solucion permitida:
- reinicio controlado de Apache

Escalar si:
- Apache no levanta despues del reinicio
- hay error de configuracion

### 10. PostgreSQL no responde
Sintoma:
- login falla
- catalogos no cargan
- guardados fallan en toda la aplicacion

Que revisar:
- si el servicio PostgreSQL esta iniciado
- si la base de datos responde en `pgAdmin`

Solucion permitida:
- validar servicio
- documentar el alcance del problema

Escalar si:
- el servicio no responde
- hay riesgo de perdida de datos

## Checklist Rapido de Atencion de Incidentes
Usar este checklist cuando se reporte una falla:

1. confirmar fecha y hora del incidente
2. identificar si afecta a un usuario o a varios
3. identificar si afecta civil, penal, login, usuarios o documentos
4. revisar si Apache responde
5. revisar si PostgreSQL responde
6. revisar si el usuario tiene permisos correctos
7. revisar si existe bloqueo por intentos de login
8. revisar si hay error 500
9. aplicar solo soluciones autorizadas
10. si no se corrige, escalar

## Limites de Intervencion
No se debe intervenir directamente en codigo porque:
- el sistema ya esta en produccion
- una modificacion sin conocimiento tecnico puede agravar la falla
- la logica del sistema incluye validaciones, compatibilidades y reglas de negocio no evidentes a simple vista
- el codigo fuente no es la herramienta correcta para soporte operativo no desarrollador

El objetivo del relevo operativo no es programar el sistema, sino:
- diagnosticar fallas comunes
- ejecutar correcciones controladas
- mantener continuidad basica del servicio
- escalar correctamente cuando el problema exceda el soporte permitido

## Criterio para Jefatura
No se recomienda capacitar al personal de respaldo en todo el codigo fuente porque eso no garantiza una mejor respuesta operativa y si aumenta el riesgo de cambios incorrectos en produccion.

La alternativa recomendada es:
- manual de contingencias
- kit de consultas autorizadas
- checklist de atencion de incidentes
- criterios claros de escalamiento

Este enfoque reduce dependencia tecnica innecesaria y protege la estabilidad del sistema.
