# Sistema de Gestión de Juicios - Frontend

Maqueta funcional del sistema de seguimiento de casos civiles y mercantiles.

## 📦 Archivos Incluidos

```
sistema-juicios-frontend/
├── index.html              (redirige a login)
├── login.html              (pantalla de acceso)
├── css/
│   └── styles.css         (estilos completos)
└── js/
    ├── datos-fake.js      (10 casos + catálogos)
    └── login.js           (lógica de login)
```

## 🚀 Cómo usar

### Opción 1: Abrir localmente
1. Descarga la carpeta completa
2. Abre `index.html` en tu navegador
3. Login con cualquier usuario/contraseña

### Opción 2: Subir a Netlify
1. Ve a https://netlify.com
2. Arrastra la carpeta completa
3. ¡Listo! Te da una URL pública

## 👤 Credenciales (Demo)

**Usuario:** cualquiera  
**Contraseña:** cualquiera

(En esta maqueta, cualquier usuario/password funciona)

## ✅ Lo que está LISTO

- ✅ Login funcional con diseño limpio
- ✅ Estilos gubernamentales (vino #621132)
- ✅ 10 casos fake con datos completos
- ✅ Catálogos completos
- ✅ Estructura de 14 campos

## ⏳ Lo que FALTA (próxima entrega)

- ⏳ Página de lista/tabla de casos
- ⏳ Formulario de nuevo caso (14 campos)
- ⏳ Lógica de acumulación de casos
- ⏳ Filtros y búsqueda

## 📝 Notas

- Esto es una **maqueta funcional** solo frontend
- Los datos se guardan en `localStorage` del navegador
- No requiere backend ni base de datos
- Perfecto para mostrar cómo se verá el sistema

## 🔄 Migración futura

Cuando tengas el backend listo:
1. Copiar esta carpeta a `/public` en Node.js
2. Cambiar `localStorage` por `fetch('/api/...')`
3. Listo

---

**Autor:** Oscar  
**Fecha:** Enero 2026  
**Versión:** 1.0 - Maqueta Login