// =====================================================
// ADMIN-BAJAS.JS - Restauracion de expedientes
// =====================================================

let expedientesBaja = [];
let expedientesBajaFiltrados = [];

async function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (usuarioStr) {
        return JSON.parse(usuarioStr);
    }

    try {
        const response = await fetch('api/session.php', {
            method: 'GET',
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            const user = result.data?.user || {};
            const usuario = {
                id: user.id ?? null,
                usuario: user.usuario ?? '',
                nombre_completo: user.nombreCompleto ?? '',
                rol: user.rol ?? '',
                delegacion_id: user.delegacionId ?? null,
                alcance_global: Boolean(user.alcanceGlobal),
                permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
                permiso_penal: Boolean(user.permisoPenal),
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo recuperar la sesion desde la API:', error);
    }

    window.location.href = 'login.html';
    return null;
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

window.cerrarSesion = cerrarSesion;

async function obtenerExpedientesBajaApi(modulo = '') {
    const params = new URLSearchParams();
    if (modulo) {
        params.set('modulo', modulo);
    }

    const response = await fetch(`api/admin/getDeletedCases.php${params.toString() ? `?${params}` : ''}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudieron cargar los expedientes dados de baja') + detail);
    }

    return result.data?.cases || [];
}

async function restaurarExpedienteApi(modulo, id) {
    const endpoint = modulo === 'PENAL' ? 'api/restorePenalCase.php' : 'api/restoreCivilCase.php';
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo restaurar el expediente') + detail);
    }

    return result.data || {};
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;
    window.mostrarCargaVista?.('.container');

    if (usuario.rol !== 'admin') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        badgeRol.textContent = 'Admin';
        badgeRol.className = 'badge-rol badge-rol-admin';
    }

    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD) {
        infoOOAD.textContent = 'Todas las JSJ';
    }

    document.getElementById('busquedaExpedienteBajas')?.addEventListener('input', function () {
        aplicarFiltrosBajas();
    });

    try {
        await cargarExpedientesBaja({ showLoader: false });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function cargarExpedientesBaja(options = {}) {
    const { showLoader = true } = options;
    const modulo = document.getElementById('filtroModuloBajas')?.value || '';

    if (showLoader) {
        window.mostrarCargaBloque?.('.table-container');
    }

    try {
        expedientesBaja = await obtenerExpedientesBajaApi(modulo);
    } catch (error) {
        console.error('No se pudieron cargar los expedientes dados de baja:', error);
        expedientesBaja = [];
    } finally {
        if (showLoader) {
            await window.ocultarCargaBloque?.('.table-container');
        }
    }

    aplicarFiltrosBajas();
}

function aplicarFiltrosBajas() {
    const busqueda = (document.getElementById('busquedaExpedienteBajas')?.value || '').trim().toLowerCase();

    expedientesBajaFiltrados = expedientesBaja.filter(item => {
        if (!busqueda) {
            return true;
        }

        return String(item.numero_expediente || '').toLowerCase().includes(busqueda);
    });

    renderizarTablaBajas();
}

function renderizarTablaBajas() {
    const tbody = document.getElementById('tablaBajasBody');

    if (!expedientesBajaFiltrados.length) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:var(--color-text-light);">No hay expedientes dados de baja</td></tr>';
        return;
    }

    tbody.innerHTML = expedientesBajaFiltrados.map(item => `
        <tr>
            <td><strong>${item.modulo}</strong></td>
            <td>${item.numero_expediente || `ID ${item.id}`}</td>
            <td>${item.delegacion_nombre || '---'}</td>
            <td>${formatearFechaHora(item.deleted_at)}</td>
            <td>${item.deleted_by_nombre || '---'}</td>
            <td>
                <button class="btn-link" onclick="restaurarExpediente(${item.id}, '${item.modulo}')">Restaurar</button>
            </td>
        </tr>
    `).join('');
}

async function restaurarExpediente(id, modulo) {
    const expediente = expedientesBaja.find(item => item.id === id && item.modulo === modulo);
    const etiqueta = expediente?.numero_expediente || `ID ${id}`;

    const confirmacion = await window.appConfirm?.({
        title: 'Restaurar expediente',
        message: `¿Deseas restaurar el expediente ${etiqueta}?`,
        confirmText: 'Restaurar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) {
        return;
    }

    try {
        await restaurarExpedienteApi(modulo, id);
        await cargarExpedientesBaja();
        await window.appAlert?.({
            title: 'Restauracion completada',
            message: 'Expediente restaurado correctamente.'
        });
    } catch (error) {
        console.error('Error al restaurar expediente:', error);
        await window.appAlert?.({
            title: 'No se pudo restaurar el expediente',
            message: error.message || 'Ocurrio un problema al restaurar el expediente.'
        });
    }
}

function formatearFechaHora(valor) {
    if (!valor) return '---';

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) {
        return String(valor);
    }

    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minuto = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${hora}:${minuto}`;
}

window.cargarExpedientesBaja = cargarExpedientesBaja;
window.restaurarExpediente = restaurarExpediente;
