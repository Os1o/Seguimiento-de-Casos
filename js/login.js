document.addEventListener('DOMContentLoaded', async function () {
    const loginForm = document.getElementById('loginForm');
    mostrarMensajeSesionExpirada();

    await verificarSesionActiva();

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;

        ocultarError();

        if (!usuario || !password) {
            mostrarError('Por favor completa todos los campos');
            return;
        }

        await realizarLogin(usuario, password);
    });
});

function mostrarMensajeSesionExpirada() {
    const mensaje = sessionStorage.getItem('session_expired_message');
    if (!mensaje) {
        return;
    }

    sessionStorage.removeItem('session_expired_message');
    mostrarError(mensaje);
}

async function verificarSesionActiva() {
    const usuarioSesion = sessionStorage.getItem('usuario');
    if (!usuarioSesion) {
        return;
    }

    try {
        const response = await fetch('api/session.php', {
            method: 'GET',
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            const user = result.data?.user || {};

            sessionStorage.setItem('usuario', JSON.stringify({
                id: user.id ?? null,
                usuario: user.usuario ?? '',
                nombre_completo: user.nombreCompleto ?? '',
                rol: user.rol ?? '',
                delegacion_id: user.delegacionId ?? null,
                alcance_global: Boolean(user.alcanceGlobal),
                permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
                permiso_penal: Boolean(user.permisoPenal),
                es_abogado: Boolean(user.esAbogado),
                es_jefe: Boolean(user.esJefe),
                session_token: user.sessionToken ?? ''
            }));

            window.location.href = 'casos.html';
        }
    } catch (error) {
        console.error('No se pudo verificar la sesion activa:', error);
    }
}

async function realizarLogin(usuario, password) {
    const btnSubmit = document.querySelector('button[type="submit"]');

    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Iniciando sesion...';

    try {
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                usuario,
                password
            })
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            mostrarError(result.message || 'No fue posible iniciar sesion');
            return;
        }

        const user = result.data?.user || {};

        sessionStorage.setItem('usuario', JSON.stringify({
            id: user.id ?? null,
            usuario: user.usuario ?? '',
            nombre_completo: user.nombreCompleto ?? '',
            rol: user.rol ?? '',
            delegacion_id: user.delegacionId ?? null,
            alcance_global: Boolean(user.alcanceGlobal),
            permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
            permiso_penal: Boolean(user.permisoPenal),
            es_abogado: Boolean(user.esAbogado),
            es_jefe: Boolean(user.esJefe),
            session_token: user.sessionToken ?? ''
        }));

        window.location.href = 'casos.html';
    } catch (error) {
        console.error('Error durante login:', error);
        mostrarError('No fue posible iniciar sesion. Verifica la conexion con la API local.');
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
        return;
    }

    alert(mensaje);
}

function ocultarError() {
    const errorMsg = document.getElementById('loginError');

    if (errorMsg) {
        errorMsg.textContent = '';
        errorMsg.style.display = 'none';
    }
}

async function cerrarSesion() {
    try {
        await fetch('api/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}
