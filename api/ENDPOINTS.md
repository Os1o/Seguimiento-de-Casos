# Estructura Actual y Canonica de API

## Objetivo

Dejar una referencia clara de como esta organizada hoy la API y como debe quedar
agrupada por modulo sin romper rutas existentes en una sola pasada.

## Estado actual

Hoy los endpoints viven en `api/` como archivos sueltos.

## Agrupacion logica actual

### Auth

- `login.php`
- `logout.php`
- `session.php`

### Catalogos / sistema

- `getCatalogs.php`
- `index.php`

### Civil

- `getCivilCases.php`
- `getCivilCase.php`
- `saveCivilCase.php`
- `addCivilTracking.php`
- `deleteCivilCase.php`
- `deleteCivilTracking.php`
- `saveCivilAccumulation.php`
- `getCivilDocuments.php`
- `uploadCivilDocument.php`
- `downloadCivilDocument.php`

### Penal

- `getPenalCases.php`
- `getPenalCase.php`
- `savePenalCase.php`
- `addPenalTracking.php`
- `deletePenalCase.php`
- `deletePenalTracking.php`

### Usuarios

- `getUsers.php`
- `saveUser.php`

### Core / soporte

- `bootstrap.php`
- `config.php`
- `config.server.example.php`
- `db.php`
- `helpers.php`
- `.htaccess`

## Estructura canonica recomendada

```text
api/
├── auth/
│   ├── login.php
│   ├── logout.php
│   └── session.php
├── catalogs/
│   └── getCatalogs.php
├── civil/
│   ├── getCases.php
│   ├── getCase.php
│   ├── saveCase.php
│   ├── addTracking.php
│   ├── deleteCase.php
│   ├── deleteTracking.php
│   ├── saveAccumulation.php
│   └── documents/
│       ├── getDocuments.php
│       ├── uploadDocument.php
│       └── downloadDocument.php
├── penal/
│   ├── getCases.php
│   ├── getCase.php
│   ├── saveCase.php
│   ├── addTracking.php
│   ├── deleteCase.php
│   └── deleteTracking.php
├── users/
│   ├── getUsers.php
│   └── saveUser.php
└── core/
    ├── bootstrap.php
    ├── config.php
    ├── config.server.example.php
    ├── db.php
    └── helpers.php
```

## Reglas de nombres recomendadas

- `getCases.php`: listado
- `getCase.php`: detalle
- `saveCase.php`: alta y edicion
- `addTracking.php`: alta de seguimiento
- `deleteCase.php`: eliminacion de expediente
- `deleteTracking.php`: eliminacion de seguimiento
- `getDocuments.php`: listado de documentos
- `uploadDocument.php`: carga de documento
- `downloadDocument.php`: descarga segura de documento

## Estrategia recomendada para mover sin romper

1. Crear la estructura por carpetas.
2. Mover implementaciones reales a la estructura canonica.
3. Dejar wrappers en las rutas viejas dentro de `api/`.
4. Actualizar frontend para apuntar a las rutas nuevas.
5. Retirar wrappers cuando ya no se usen.

## Nota

No conviene mover todos los endpoints de golpe sin wrappers porque el frontend
actual todavia consume rutas planas como `api/getCivilCases.php`.
