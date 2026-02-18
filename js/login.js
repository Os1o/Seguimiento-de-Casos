// =====================================================
// LOGIN.JS - Funcionalidad de inicio de sesión
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');

    // Verificar si ya hay sesión activa
    const sesionActiva = sessionStorage.getItem('usuario');
    if (sesionActiva) {
        window.location.href = 'casos.html';
        return;
    }

    // Manejar submit del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;

        // Ocultar error previo
        if (errorMsg) errorMsg.style.display = 'none';

        // Validar campos
        if (!usuario || !password) {
            mostrarError('Por favor completa todos los campos');
            return;
        }

        realizarLogin(usuario, password);
    });
});

function realizarLogin(usuario, password) {
    const btnSubmit = document.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Iniciando sesión...';

    setTimeout(() => {
        // Obtener usuarios del localStorage
        const usuariosStr = localStorage.getItem('usuarios');
        const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

        // Buscar usuario por nombre de usuario
        const usuarioEncontrado = usuarios.find(u =>
            u.usuario === usuario && u.password === password
        );

        if (!usuarioEncontrado) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Acceder';
            mostrarError('Usuario o contraseña incorrectos');
            return;
        }

        // Verificar que esté activo
        if (!usuarioEncontrado.activo) {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Acceder';
            mostrarError('Esta cuenta se encuentra desactivada. Contacta al administrador.');
            return;
        }

        // Guardar en sessionStorage (sin password por seguridad)
        const usuarioSesion = {
            id: usuarioEncontrado.id,
            usuario: usuarioEncontrado.usuario,
            nombre_completo: usuarioEncontrado.nombre_completo,
            rol: usuarioEncontrado.rol,
            delegacion_id: usuarioEncontrado.delegacion_id,
            permiso_civil_mercantil: usuarioEncontrado.permiso_civil_mercantil,
            permiso_penal: usuarioEncontrado.permiso_penal
        };

        sessionStorage.setItem('usuario', JSON.stringify(usuarioSesion));

        // Redirigir a la página de casos
        window.location.href = 'casos.html';
    }, 500);
}

function mostrarError(mensaje) {
    const errorMsg = document.getElementById('loginError');
    if (errorMsg) {
        errorMsg.textContent = mensaje;
        errorMsg.style.display = 'block';
    } else {
        alert(mensaje);
    }
}

// Función para cerrar sesión (se usa en otras páginas)
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
