# Estructura Final Sugerida del Servidor

## Objetivo

Dejar en el webroot solo el codigo publico de la aplicacion y mover fuera del webroot los archivos sensibles y los documentos cargados.

## Estructura recomendada

```text
C:\
└── servidor\
    ├── www\
    │   └── AplicativoLocal\
    │       ├── api\
    │       ├── css\
    │       ├── js\
    │       ├── actualizarCaso.html
    │       ├── actualizarCasoPenal.html
    │       ├── adminUsuarios.html
    │       ├── casos.html
    │       ├── detalleCaso.html
    │       ├── detalleCasoPenal.html
    │       ├── editarCaso.html
    │       ├── editarCasoPenal.html
    │       ├── index.html
    │       ├── login.html
    │       ├── nuevoCaso.html
    │       ├── nuevoCasoPenal.html
    │       └── penal.html
    └── appdata\
        └── seguimiento_juicios\
            ├── config\
            │   └── private-config.php
            ├── storage\
            │   └── documentos\
            │       ├── civil\
            │       └── penal\
            ├── logs\
            └── backups\
```

## Que va dentro del webroot

- `api/`
- `css/`
- `js/`
- los archivos `.html`

## Que va fuera del webroot

- configuracion privada
- `storage/`
- logs
- backups

## Archivo de configuracion privada

Crear este archivo fuera del webroot:

```php
<?php

declare(strict_types=1);

define('APP_BASE_PATH', 'C:/servidor/www/AplicativoLocal');
define('APP_STORAGE_PATH', 'C:/servidor/appdata/seguimiento_juicios/storage');

define('DB_HOST', 'localhost');
define('DB_PORT', '5432');
define('DB_NAME', 'seguimiento_juicios');
define('DB_USER', 'app_seguimiento');
define('DB_PASSWORD', 'CAMBIAR_ESTA_PASSWORD');

define('APP_DEBUG', false);
```

Ruta sugerida:

```text
C:\servidor\appdata\seguimiento_juicios\config\private-config.php
```

## Variable de entorno necesaria

Apache/PHP debe tener disponible esta variable de entorno:

```text
APP_PRIVATE_CONFIG=C:\servidor\appdata\seguimiento_juicios\config\private-config.php
```

## Orden recomendado para moverlo

1. Crear carpetas nuevas:
   - `C:\servidor\www\AplicativoLocal`
   - `C:\servidor\appdata\seguimiento_juicios\config`
   - `C:\servidor\appdata\seguimiento_juicios\storage`
   - `C:\servidor\appdata\seguimiento_juicios\storage\documentos`
   - `C:\servidor\appdata\seguimiento_juicios\storage\documentos\civil`
   - `C:\servidor\appdata\seguimiento_juicios\storage\documentos\penal`

2. Copiar el proyecto al webroot nuevo:
   - `C:\servidor\www\AplicativoLocal`

3. Copiar el contenido actual de `storage/documentos` a:
   - `C:\servidor\appdata\seguimiento_juicios\storage\documentos`

4. Crear `private-config.php` con rutas reales del servidor.

5. Configurar la variable `APP_PRIVATE_CONFIG`.

6. Cambiar Apache para que el `DocumentRoot` apunte a:
   - `C:/servidor/www/AplicativoLocal`

7. Reiniciar Apache.

8. Probar:
   - login
   - civil
   - penal
   - carga y descarga de PDF

## Nota importante

Mientras sigamos haciendo cambios frecuentes, se puede seguir trabajando con la copia del `Desktop`.
Cuando ya queramos dejarlo mas formal, este es el acomodo final recomendado.
