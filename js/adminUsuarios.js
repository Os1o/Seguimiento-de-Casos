// =====================================================
// ADMIN-USUARIOS.JS - Panel de administración de usuarios
// =====================================================

let usuarios = [];
let editandoId = null;
let filtroBusquedaUsuarios = '';
let filtroRolUsuarios = '';
let paginaActualUsuarios = 1;
const USUARIOS_POR_PAGINA = 8;
let catalogos = {
    delegaciones: []
};

function normalizarUsuarioLegacy(usuario) {
    if (!usuario || typeof usuario !== 'object') {
        return usuario;
    }

    if (usuario.rol === 'jefe') {
        return {
            ...usuario,
            rol: 'consulta',
            alcance_global: true
        };
    }

    return usuario;
}

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
                es_abogado: Boolean(user.esAbogado),
                es_jefe: Boolean(user.esJefe),
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo recuperar la sesión desde la API:', error);
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
        console.error('Error al cerrar sesión:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

window.cerrarSesion = cerrarSesion;

async function cargarCatalogosAdmin() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catálogos');
    }

    catalogos.delegaciones = result.data?.delegaciones || [];
}

async function obtenerUsuariosApi() {
    const response = await fetch('api/getUsers.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los usuarios');
    }

    return (result.data?.users || []).map(normalizarUsuarioLegacy);
}

async function guardarUsuarioApi(datosUsuario) {
    const response = await fetch('api/saveUser.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(datosUsuario)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar el usuario') + detail);
    }


    return result.data?.user || null;
}

function obtenerDelegacion(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
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

    try {
        try {
            await cargarCatalogosAdmin();
        } catch (error) {
            console.warn('Catálogos: usando fallback local', error);
        }

        llenarDelegacionesModal();

        document.getElementById('inputRol').addEventListener('change', function () {
            actualizarCamposAcceso();
        });

        document.getElementById('inputAlcanceGlobal').addEventListener('change', actualizarCamposAcceso);
        document.getElementById('inputBusquedaUsuarios').addEventListener('input', manejarBusquedaUsuarios);
        document.getElementById('selectFiltroRol').addEventListener('change', manejarFiltroRolUsuarios);

        await cargarUsuarios({ showLoader: false });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

function llenarDelegacionesModal() {
    const select = document.getElementById('inputDelegacion');
    select.innerHTML = '<option value="">Todas las JSJ</option>';

    (catalogos.delegaciones || []).forEach(delegacion => {
        const option = document.createElement('option');
        option.value = delegacion.id;
        option.textContent = delegacion.nombre;
        select.appendChild(option);
    });
}

async function cargarUsuarios(options = {}) {
    const { showLoader = true } = options;

    if (showLoader) {
        window.mostrarCargaBloque?.('.table-container');
    }

    try {
        usuarios = await obtenerUsuariosApi();
    } catch (error) {
        console.error('No se pudieron cargar los usuarios desde la API:', error);
        usuarios = [];
    } finally {
        if (showLoader) {
            await window.ocultarCargaBloque?.('.table-container');
        }
    }

    renderizarTabla();
}

function normalizarTextoBusqueda(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
}

function obtenerTextoRolUsuario(rol = '') {
    const rolesTexto = {
        admin: 'Administrador',
        editor: 'Editor',
        consulta: 'Consulta'
    };

    return rolesTexto[rol] || rol || '';
}

function obtenerUsuariosFiltrados() {
    const termino = normalizarTextoBusqueda(filtroBusquedaUsuarios);

    return usuarios.filter(usuario => {
        const coincideBusqueda = !termino || [
            usuario.nombre_completo,
            usuario.usuario
        ].some(valor => normalizarTextoBusqueda(valor).includes(termino));

        const coincideRol = !filtroRolUsuarios || usuario.rol === filtroRolUsuarios;

        return coincideBusqueda && coincideRol;
    });
}

function obtenerUsuariosPaginados(usuariosFiltrados) {
    const totalPaginas = Math.max(1, Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA));
    paginaActualUsuarios = Math.min(Math.max(1, paginaActualUsuarios), totalPaginas);

    const inicio = (paginaActualUsuarios - 1) * USUARIOS_POR_PAGINA;
    const fin = inicio + USUARIOS_POR_PAGINA;

    return {
        totalPaginas,
        inicio,
        fin,
        usuariosPagina: usuariosFiltrados.slice(inicio, fin)
    };
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaUsuariosBody');
    const resumen = document.getElementById('tablaUsuariosResumen');
    const paginacion = document.getElementById('tablaUsuariosPaginacion');
    const usuariosFiltrados = obtenerUsuariosFiltrados();
    const { totalPaginas, inicio, fin, usuariosPagina } = obtenerUsuariosPaginados(usuariosFiltrados);

    if (usuariosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="admin-usuarios-empty">No hay usuarios que coincidan con los filtros aplicados</td></tr>';

        if (resumen) {
            resumen.textContent = 'Mostrando 0 de 0 usuarios registrados';
        }

        if (paginacion) {
            paginacion.innerHTML = '';
        }

        return;
    }

    tbody.innerHTML = usuariosPagina.map(usuario => {
        const delegacion = usuario.delegacion_id ? obtenerDelegacion(usuario.delegacion_id) : null;
        const delegNombre = usuario.alcance_global
            ? '<span class="admin-usuarios-jsj-global">Todas las JSJ</span>'
            : (delegacion ? delegacion.nombre : '<span class="admin-usuarios-jsj-empty">Sin JSJ</span>');

        const atributos = [
            usuario.es_abogado ? '<span class="admin-usuarios-attribute-badge">Abogado</span>' : '',
            usuario.es_jefe ? '<span class="admin-usuarios-attribute-badge">Jefe de area</span>' : ''
        ].filter(Boolean).join('');

        const civilPermitido = usuario.permiso_civil_mercantil
            ? '<span class="admin-usuarios-check admin-usuarios-check-on material-symbols-outlined" aria-label="Permitido">check_circle</span>'
            : '<span class="admin-usuarios-check admin-usuarios-check-off material-symbols-outlined" aria-label="Sin permiso">radio_button_unchecked</span>';

        const penalPermitido = usuario.permiso_penal
            ? '<span class="admin-usuarios-check admin-usuarios-check-on material-symbols-outlined" aria-label="Permitido">check_circle</span>'
            : '<span class="admin-usuarios-check admin-usuarios-check-off material-symbols-outlined" aria-label="Sin permiso">radio_button_unchecked</span>';

        const estadoBadge = usuario.activo
            ? '<span class="admin-usuarios-status-badge admin-usuarios-status-active">Activo</span>'
            : '<span class="admin-usuarios-status-badge admin-usuarios-status-inactive">Inactivo</span>';

        return `
            <tr class="admin-usuarios-row">
                <td class="admin-usuarios-cell-name"><strong>${usuario.nombre_completo}</strong></td>
                <td class="admin-usuarios-cell-user"><span class="admin-usuarios-username">${usuario.usuario}</span></td>
                <td>
                    <div class="admin-usuarios-role-stack">
                        <span class="badge-rol badge-rol-${usuario.rol || ''} admin-usuarios-role-badge">${obtenerTextoRolUsuario(usuario.rol)}</span>
                        ${atributos ? `<div class="admin-usuarios-role-attributes">${atributos}</div>` : ''}
                    </div>
                </td>
                <td class="admin-usuarios-cell-jsj">${delegNombre}</td>
                <td class="admin-usuarios-cell-check">${civilPermitido}</td>
                <td class="admin-usuarios-cell-check">${penalPermitido}</td>
                <td class="admin-usuarios-cell-status">${estadoBadge}</td>
                <td class="admin-usuarios-cell-actions">
                    <div class="admin-usuarios-actions">
                        <button class="btn-link" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn-link admin-usuarios-toggle-action ${usuario.activo ? 'is-danger' : 'is-success'}" onclick="toggleActivoUsuario(${usuario.id})">
                            ${usuario.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    if (resumen) {
        resumen.textContent = `Mostrando ${inicio + 1}-${Math.min(fin, usuariosFiltrados.length)} de ${usuariosFiltrados.length} usuarios registrados`;
    }

    if (paginacion) {
        paginacion.innerHTML = construirPaginacionUsuarios(totalPaginas);
    }
}

function construirPaginacionUsuarios(totalPaginas) {
    if (totalPaginas <= 1) {
        return '';
    }

    const botones = [];

    botones.push(`
        <button type="button" class="admin-usuarios-page-btn admin-usuarios-page-nav" ${paginaActualUsuarios === 1 ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaActualUsuarios - 1})">
            Anterior
        </button>
    `);

    for (let pagina = 1; pagina <= totalPaginas; pagina += 1) {
        botones.push(`
            <button type="button" class="admin-usuarios-page-btn admin-usuarios-page-number ${pagina === paginaActualUsuarios ? 'is-active' : ''}" onclick="cambiarPaginaUsuarios(${pagina})">
                ${pagina}
            </button>
        `);
    }

    botones.push(`
        <button type="button" class="admin-usuarios-page-btn admin-usuarios-page-nav" ${paginaActualUsuarios === totalPaginas ? 'disabled' : ''} onclick="cambiarPaginaUsuarios(${paginaActualUsuarios + 1})">
            Siguiente
        </button>
    `);

    return botones.join('');
}

function cambiarPaginaUsuarios(nuevaPagina) {
    paginaActualUsuarios = nuevaPagina;
    renderizarTabla();
}

window.cambiarPaginaUsuarios = cambiarPaginaUsuarios;

function manejarBusquedaUsuarios(event) {
    filtroBusquedaUsuarios = event.target.value || '';
    paginaActualUsuarios = 1;
    renderizarTabla();
}

function manejarFiltroRolUsuarios(event) {
    filtroRolUsuarios = event.target.value || '';
    paginaActualUsuarios = 1;
    renderizarTabla();
}

function abrirModal() {
    editandoId = null;
    document.getElementById('modalTitulo').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('inputPermisoCivil').checked = true;
    document.getElementById('inputPermisoPenal').checked = false;
    document.getElementById('inputEsAbogado').checked = false;
    document.getElementById('inputEsJefe').checked = false;
    document.getElementById('inputActivo').checked = true;
    document.getElementById('inputAlcanceGlobal').checked = false;
    document.getElementById('inputDelegacion').disabled = false;
    document.getElementById('helpDelegacion').style.display = 'none';
    document.getElementById('inputUsuario').disabled = false;
    document.getElementById('inputPassword').value = '';
    document.getElementById('inputPassword').required = true;
    actualizarCamposAcceso();
    document.getElementById('modalUsuario').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalUsuario').style.display = 'none';
    editandoId = null;
}

function editarUsuario(id) {
    const usuario = usuarios.find(item => item.id === id);
    if (!usuario) return;

    editandoId = id;
    document.getElementById('modalTitulo').textContent = 'Editar Usuario';
    document.getElementById('inputNombre').value = usuario.nombre_completo;
    document.getElementById('inputUsuario').value = usuario.usuario;
    document.getElementById('inputUsuario').disabled = true;
    document.getElementById('inputPassword').value = '';
    document.getElementById('inputPassword').required = false;
    document.getElementById('inputRol').value = usuario.rol;
    document.getElementById('inputPermisoCivil').checked = usuario.permiso_civil_mercantil;
    document.getElementById('inputPermisoPenal').checked = usuario.permiso_penal;
    document.getElementById('inputEsAbogado').checked = Boolean(usuario.es_abogado);
    document.getElementById('inputEsJefe').checked = Boolean(usuario.es_jefe);
    document.getElementById('inputActivo').checked = usuario.activo;
    document.getElementById('inputAlcanceGlobal').checked = Boolean(usuario.alcance_global);
    document.getElementById('inputDelegacion').value = usuario.delegacion_id || '';
    document.getElementById('inputDelegacion').disabled = false;
    actualizarCamposAcceso();
    document.getElementById('modalUsuario').style.display = 'flex';
}

function actualizarCamposAcceso() {
    const rol = document.getElementById('inputRol').value;
    const alcanceGlobal = document.getElementById('inputAlcanceGlobal').checked;
    const inputDelegacion = document.getElementById('inputDelegacion');
    const helpDelegacion = document.getElementById('helpDelegacion');

    if (rol === 'admin') {
        document.getElementById('inputAlcanceGlobal').checked = true;
        document.getElementById('inputAlcanceGlobal').disabled = true;
        inputDelegacion.value = '';
        inputDelegacion.disabled = true;
        helpDelegacion.style.display = 'block';
        return;
    }

    document.getElementById('inputAlcanceGlobal').disabled = rol === 'editor';

    if (rol === 'editor') {
        document.getElementById('inputAlcanceGlobal').checked = false;
    }

    const globalActivo = document.getElementById('inputAlcanceGlobal').checked;
    helpDelegacion.style.display = globalActivo ? 'block' : 'none';
    inputDelegacion.disabled = globalActivo;

    if (globalActivo) {
        inputDelegacion.value = '';
    }
}

async function guardarUsuarioForm(event) {
    event.preventDefault();

    const nombre = document.getElementById('inputNombre').value.trim();
    const usuario = document.getElementById('inputUsuario').value.trim();
    const password = document.getElementById('inputPassword').value;
    const rol = document.getElementById('inputRol').value;
    const delegacionId = document.getElementById('inputDelegacion').value;
    const alcanceGlobal = document.getElementById('inputAlcanceGlobal').checked;
    const permisoCivil = document.getElementById('inputPermisoCivil').checked;
    const permisoPenal = document.getElementById('inputPermisoPenal').checked;
    const esAbogado = document.getElementById('inputEsAbogado').checked;
    const esJefe = document.getElementById('inputEsJefe').checked;
    const activo = document.getElementById('inputActivo').checked;

    if (!editandoId) {
        const existe = usuarios.find(item => item.usuario === usuario);
        if (existe) {
            await window.appAlert?.({
                title: 'Usuario duplicado',
                message: 'Ya existe un usuario con ese nombre de usuario.'
            });
            return;
        }
    }

    const datosUsuario = {
        nombre_completo: nombre,
        usuario,
        password,
        rol,
        delegacion_id: delegacionId ? parseInt(delegacionId) : null,
        alcance_global: alcanceGlobal,
        permiso_civil_mercantil: permisoCivil,
        permiso_penal: permisoPenal,
        es_abogado: esAbogado,
        es_jefe: esJefe,
        activo
    };

    if (editandoId) {
        datosUsuario.id = editandoId;
    }

    if (datosUsuario.rol === 'admin' || datosUsuario.alcance_global) {
        datosUsuario.delegacion_id = null;
    }

    try {
        await guardarUsuarioApi(datosUsuario);
        cerrarModal();
        await cargarUsuarios();
        await window.appAlert?.({
            title: 'Cambios guardados',
            message: 'El registro se guardo correctamente.'
        });
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        await window.appAlert?.({
            title: 'No se pudo guardar el usuario',
            message: error.message || 'Ocurrio un problema al guardar el usuario.'
        });
    }
}

async function toggleActivoUsuario(id) {
    const usuario = usuarios.find(item => item.id === id);
    if (!usuario) return;

    const sesion = JSON.parse(sessionStorage.getItem('usuario') || 'null');
    if (sesion && sesion.id === id) {
        await window.appAlert?.({
            title: 'Accion no permitida',
            message: 'No puedes desactivar tu propia cuenta.'
        });
        return;
    }

    const accion = usuario.activo ? 'desactivar' : 'activar';
    const confirmacion = await window.appConfirm?.({
        title: 'Confirmar cambio de estado',
        message: `¿Estás seguro de ${accion} al usuario "${usuario.nombre_completo}"?`,
        confirmText: 'Confirmar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) {
        return;
    }

    try {
        await guardarUsuarioApi({
            id: usuario.id,
            activo: !usuario.activo
        });

        await cargarUsuarios();
    } catch (error) {
        console.error('Error al cambiar estado:', error);
        await window.appAlert?.({
            title: 'No se pudo cambiar el estado',
            message: error.message || 'Ocurrio un problema al cambiar el estado del usuario.'
        });
    }
}
