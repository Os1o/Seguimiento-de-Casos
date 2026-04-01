// =====================================================
// LOGIN.JS - Funcionalidad de inicio de sesion
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginError');

    const sesionActiva = sessionStorage.getItem('usuario');
    if (sesionActiva) {
        window.location.href = 'casos.html';
        return;
    }

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;

        if (errorMsg) errorMsg.style.display = 'none';

        if (!usuario || !password) {
            mostrarError('Por favor completa todos los campos');
            return;
        }

        realizarLogin(usuario, password);
    });
});

async function realizarLogin(usuario, password) {
    const btnSubmit = document.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Iniciando sesion...';

    try {
        let usuarioEncontrado = null;

        if (typeof buscarUsuario === 'function') {
            usuarioEncontrado = await buscarUsuario(usuario, password);
        }

        if (!usuarioEncontrado) {
            const usuariosStr = localStorage.getItem('usuarios');
            const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];
            usuarioEncontrado = usuarios.find(u =>
                u.usuario === usuario && u.password === password
            );
        }

        if (!usuarioEncontrado) {
            mostrarError('Usuario o contrasena incorrectos');
            return;
        }

        if (!usuarioEncontrado.activo) {
            mostrarError('Esta cuenta se encuentra desactivada. Contacta al administrador.');
            return;
        }

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
        window.location.href = 'casos.html';
    } catch (error) {
        console.error('Error durante login:', error);
        mostrarError('No fue posible iniciar sesion. Revisa la conexion con Supabase.');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Acceder';
    }
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

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
