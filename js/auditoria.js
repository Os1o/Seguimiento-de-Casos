let auditoriaLogs = [];
let auditoriaPaginacion = {
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 1
};
let auditoriaCatalogos = {
    delegaciones: new Map(),
    areas: new Map(),
    organosJurisdiccionales: new Map(),
    delitos: new Map(),
    estadosProcesales: new Map(),
    prestaciones: new Map(),
    usuarios: new Map()
};

async function verificarSesionAuditoria() {
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
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo recuperar la sesión para auditoría:', error);
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

async function obtenerAuditoriaApi(filtros = {}) {
    const params = new URLSearchParams();
    params.set('limit', String(filtros.limit || auditoriaPaginacion.limit || 20));

    if (filtros.page) {
        params.set('page', String(filtros.page));
    }

    if (filtros.sin_paginacion) {
        params.set('sin_paginacion', '1');
    }

    if (filtros.modulo) {
        params.set('modulo', filtros.modulo);
    }

    if (filtros.accion) {
        params.set('accion', filtros.accion);
    }

    if (filtros.fecha_desde) {
        params.set('fecha_desde', filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
        params.set('fecha_hasta', filtros.fecha_hasta);
    }

    const response = await fetch(`api/getAuditLogs.php?${params.toString()}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar la bitácora');
    }

    return {
        logs: result.data?.logs || [],
        pagination: result.data?.pagination || {
            page: 1,
            limit: Number(params.get('limit') || 20),
            total: (result.data?.logs || []).length,
            total_pages: 1
        }
    };
}

async function cargarCatalogosAuditoria() {
    try {
        const response = await fetch('api/getCatalogs.php', {
            method: 'GET',
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (!response.ok || !result.ok) {
            throw new Error(result.message || 'No se pudieron cargar los catálogos');
        }

        const data = result.data || {};
        auditoriaCatalogos = {
            delegaciones: construirMapaCatalogo(data.delegaciones),
            areas: construirMapaCatalogo(data.areas),
            organosJurisdiccionales: construirMapaCatalogo(data.organosJurisdiccionales),
            delitos: construirMapaCatalogo(data.delitos),
            estadosProcesales: construirMapaCatalogo(data.estadosProcesales),
            prestaciones: construirMapaCatalogo(data.prestaciones),
            usuarios: await construirMapaUsuariosAuditoria()
        };
    } catch (error) {
        console.error('No se pudieron cargar los catálogos para auditoría:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesionAuditoria();
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

    document.getElementById('filtroModulo').addEventListener('change', cargarAuditoria);
    document.getElementById('filtroAccion').addEventListener('change', cargarAuditoria);
    document.getElementById('filtroFechaDesde').addEventListener('change', function () {
        sincronizarRangoFechasAuditoria();
        cargarAuditoria();
    });
    document.getElementById('filtroFechaHasta').addEventListener('change', cargarAuditoria);

    sincronizarRangoFechasAuditoria();

    try {
        await cargarCatalogosAuditoria();
        await cargarAuditoria({ showLoader: false });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function cargarAuditoria(options = {}) {
    const { showLoader = true } = options;
    auditoriaPaginacion.page = 1;
    await cargarPaginaAuditoria({ showLoader });
}

function sincronizarRangoFechasAuditoria() {
    const fechaDesde = document.getElementById('filtroFechaDesde');
    const fechaHasta = document.getElementById('filtroFechaHasta');

    if (!fechaDesde || !fechaHasta) {
        return;
    }

    fechaHasta.min = fechaDesde.value || '';

    if (fechaDesde.value && fechaHasta.value && fechaHasta.value < fechaDesde.value) {
        fechaHasta.value = '';
    }
}

async function cargarPaginaAuditoria(options = {}) {
    const { showLoader = true } = options;
    const modulo = document.getElementById('filtroModulo').value;
    const accion = document.getElementById('filtroAccion').value;
    const fechaDesde = document.getElementById('filtroFechaDesde').value;
    const fechaHasta = document.getElementById('filtroFechaHasta').value;

    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
        const tbody = document.getElementById('tablaAuditoriaBody');
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--color-danger);">La fecha inicial no puede ser mayor que la fecha final.</td></tr>';
        auditoriaLogs = [];
        auditoriaPaginacion.total = 0;
        auditoriaPaginacion.total_pages = 1;
        actualizarControlesPaginacion();
        return;
    }

    if (showLoader) {
        window.mostrarCargaBloque?.('.table-container');
    }

    try {
        const response = await obtenerAuditoriaApi({
            modulo,
            accion,
            fecha_desde: fechaDesde,
            fecha_hasta: fechaHasta,
            page: auditoriaPaginacion.page,
            limit: auditoriaPaginacion.limit
        });
        auditoriaLogs = response.logs;
        auditoriaPaginacion = {
            ...auditoriaPaginacion,
            ...(response.pagination || {})
        };
        renderizarAuditoria();
        actualizarControlesPaginacion();
    } catch (error) {
        console.error('Error al cargar bitacora:', error);
        const tbody = document.getElementById('tablaAuditoriaBody');
        tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--color-danger);">No se pudo cargar la bitácora: ${error.message}</td></tr>`;
        auditoriaPaginacion.total = 0;
        auditoriaPaginacion.total_pages = 1;
        actualizarControlesPaginacion();
    } finally {
        if (showLoader) {
            await window.ocultarCargaBloque?.('.table-container');
        }
    }
}

window.cargarAuditoria = cargarAuditoria;

async function cambiarPaginaAuditoria(delta) {
    const siguientePagina = auditoriaPaginacion.page + delta;

    if (siguientePagina < 1 || siguientePagina > (auditoriaPaginacion.total_pages || 1)) {
        return;
    }

    auditoriaPaginacion.page = siguientePagina;
    await cargarPaginaAuditoria();
}

window.cambiarPaginaAuditoria = cambiarPaginaAuditoria;

function limpiarRangoFechasAuditoria() {
    const fechaDesde = document.getElementById('filtroFechaDesde');
    const fechaHasta = document.getElementById('filtroFechaHasta');

    if (fechaDesde) {
        fechaDesde.value = '';
    }

    if (fechaHasta) {
        fechaHasta.value = '';
    }

    sincronizarRangoFechasAuditoria();

    cargarAuditoria();
}

window.limpiarRangoFechasAuditoria = limpiarRangoFechasAuditoria;

function renderizarAuditoria() {
    const tbody = document.getElementById('tablaAuditoriaBody');

    if (!auditoriaLogs.length) {
        tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--color-text-light);">No hay movimientos registrados</td></tr>';
        return;
    }

    tbody.innerHTML = auditoriaLogs.map(log => {
        const perfil = traducirRol(log.rol);
        const modulo = traducirModulo(log.modulo);
        const movimiento = traducirAccion(log.accion);
        const registro = construirRegistroVisible(log);
        const actuacion = construirActuacionVisible(log);
        const detalle = construirDetalleVisible(log);
        const jsj = log.delegacion_nombre || (log.modulo === 'AUTH' ? 'Global' : '---');

        return `
            <tr>
                <td><small>${formatearFechaHora(log.created_at)}</small></td>
                <td>
                    <strong>${escaparHtml(log.usuario_nombre || 'Sistema')}</strong><br>
                    <small style="color:var(--color-text-light);">${escaparHtml(log.usuario_login || '')}</small>
                </td>
                <td>${escaparHtml(perfil)}</td>
                <td>${escaparHtml(jsj)}</td>
                <td>${escaparHtml(modulo)}</td>
                <td>${escaparHtml(movimiento)}</td>
                <td>${registro}</td>
                <td>${actuacion}</td>
                <td>${detalle}</td>
            </tr>
        `;
    }).join('');
}

function exportarAuditoriaCsv() {
    exportarAuditoriaCsvAsync().catch(error => {
        console.error('No se pudo exportar la bitácora:', error);
        window.appAlert?.({
            title: 'No se pudo exportar la bitácora',
            message: error.message || 'Ocurrió un problema al exportar la bitácora.'
        });
    });
}

async function exportarAuditoriaCsvAsync() {
    const modulo = document.getElementById('filtroModulo').value;
    const accion = document.getElementById('filtroAccion').value;
    const fechaDesde = document.getElementById('filtroFechaDesde').value;
    const fechaHasta = document.getElementById('filtroFechaHasta').value;

    if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
        await window.appAlert?.({
            title: 'Rango de fechas inválido',
            message: 'La fecha inicial no puede ser mayor que la fecha final.'
        });
        return;
    }

    const response = await obtenerAuditoriaApi({
        modulo,
        accion,
        fecha_desde: fechaDesde,
        fecha_hasta: fechaHasta,
        sin_paginacion: true,
        limit: 5000
    });

    const logsParaExportar = response.logs || [];

    if (!logsParaExportar.length) {
        await window.appAlert?.({
            title: 'Sin movimientos para exportar',
            message: 'No hay movimientos para exportar con los filtros actuales.'
        });
        return;
    }

    const filas = logsParaExportar.map(log => ({
        fecha: formatearFechaHora(log.created_at),
        usuario_nombre: log.usuario_nombre || 'Sistema',
        usuario_login: log.usuario_login || '',
        perfil: traducirRol(log.rol),
        jsj: log.delegacion_nombre || (log.modulo === 'AUTH' ? 'Global' : '---'),
        modulo: traducirModulo(log.modulo),
        movimiento: traducirAccion(log.accion),
        registro: obtenerRegistroPlano(log),
        actuacion: obtenerActuacionPlana(log),
        detalle: obtenerDetallePlano(log)
    }));

    const encabezados = [
        'Fecha',
        'Usuario',
        'Login',
        'Perfil',
        'JSJ',
        'Modulo',
        'Movimiento',
        'Registro',
        'Actuacion',
        'Detalle'
    ];

    const lineas = [
        encabezados.join(','),
        ...filas.map(fila => ([
            fila.fecha,
            fila.usuario_nombre,
            fila.usuario_login,
            fila.perfil,
            fila.jsj,
            fila.modulo,
            fila.movimiento,
            fila.registro,
            fila.actuacion,
            fila.detalle
        ]).map(valor => escaparCsv(valor)).join(','))
    ];

    const csv = '\uFEFF' + lineas.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const enlace = document.createElement('a');
    const timestamp = obtenerMarcaArchivo();
    const sufijoFiltros = obtenerSufijoExportacion();

    enlace.href = url;
    enlace.download = `bitacora_auditoria_${sufijoFiltros}_${timestamp}.csv`;
    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
}

window.exportarAuditoriaCsv = exportarAuditoriaCsv;

function actualizarControlesPaginacion() {
    const info = document.getElementById('auditoriaPaginacionInfo');
    const btnAnterior = document.getElementById('btnPaginaAnteriorAuditoria');
    const btnSiguiente = document.getElementById('btnPaginaSiguienteAuditoria');

    if (!info || !btnAnterior || !btnSiguiente) {
        return;
    }

    const totalPaginas = Math.max(1, auditoriaPaginacion.total_pages || 1);
    const paginaActual = Math.min(Math.max(1, auditoriaPaginacion.page || 1), totalPaginas);

    info.textContent = `Pagina ${paginaActual} de ${totalPaginas} - ${auditoriaPaginacion.total || 0} registros`;
    btnAnterior.disabled = paginaActual <= 1;
    btnSiguiente.disabled = paginaActual >= totalPaginas;
}

function construirRegistroVisible(log) {
    if (log.expediente_numero_visible) {
        return `
            <strong>${escaparHtml(log.expediente_numero_visible)}</strong>
            ${log.expediente_id ? `<br><small style="color:var(--color-text-light);">ID interno: ${escaparHtml(log.expediente_id)}</small>` : ''}
        `;
    }

    if (log.expediente_id) {
        return `<strong>ID ${escaparHtml(log.expediente_id)}</strong>`;
    }

    return '<span style="color:var(--color-text-light);">No aplica</span>';
}

function construirActuacionVisible(log) {
    if (log.seguimiento_id) {
        const tipo = log.seguimiento_tipo_actuacion ? escaparHtml(log.seguimiento_tipo_actuacion) : 'Actuacion registrada';
        return `
            <strong>${tipo}</strong>
            <br><small style="color:var(--color-text-light);">Seguimiento ${escaparHtml(log.seguimiento_id)}</small>
        `;
    }

    return '<span style="color:var(--color-text-light);">No aplica</span>';
}

function construirDetalleVisible(log) {
    if (log.entidad === 'USUARIO') {
        return construirDetalleUsuario(log);
    }

    if (log.entidad === 'ACUMULACION_CIVIL') {
        return construirDetalleAcumulacion(log);
    }

    if (log.accion === 'REASIGNAR_ABOGADO') {
        return construirDetalleReasignacionAbogado(log);
    }

    const cambios = construirResumenCambiosAuditoria(log.detalles?.cambios || {});
    const entidad = traducirEntidad(log.entidad);
    const descripcion = log.descripcion || 'Movimiento registrado';
    const extras = [];

    if (log.detalles?.numero_expediente) {
        extras.push(`Expediente: ${log.detalles.numero_expediente}`);
    }

    if (log.detalles?.estatus) {
        extras.push(`Estatus actual: ${log.detalles.estatus}`);
    }

    if (cambios) {
        extras.push(cambios);
    }

    return `
        <strong>${escaparHtml(entidad)}</strong>
        <br><small style="color:var(--color-text-light);">${escaparHtml(descripcion)}</small>
        ${extras.length ? `<br><small style="color:var(--color-text-light);">${escaparHtml(extras.join(' | '))}</small>` : ''}
    `;
}

function obtenerRegistroPlano(log) {
    if (log.expediente_numero_visible) {
        return log.expediente_numero_visible;
    }

    if (log.expediente_id) {
        return `ID ${log.expediente_id}`;
    }

    return 'No aplica';
}

function obtenerActuacionPlana(log) {
    if (log.seguimiento_id) {
        const tipo = log.seguimiento_tipo_actuacion || 'Actuacion registrada';
        return `${tipo} (Seguimiento ${log.seguimiento_id})`;
    }

    return 'No aplica';
}

function obtenerDetallePlano(log) {
    if (log.entidad === 'USUARIO') {
        return construirDetalleUsuarioPlano(log);
    }

    if (log.entidad === 'ACUMULACION_CIVIL') {
        return construirDetalleAcumulacionPlano(log);
    }

    if (log.accion === 'REASIGNAR_ABOGADO') {
        return construirDetalleReasignacionAbogadoPlano(log);
    }

    const cambios = construirResumenCambiosAuditoria(log.detalles?.cambios || {});
    const entidad = traducirEntidad(log.entidad);
    const descripcion = log.descripcion || 'Movimiento registrado';
    const extras = [];

    if (log.detalles?.numero_expediente) {
        extras.push(`Expediente: ${log.detalles.numero_expediente}`);
    }

    if (log.detalles?.estatus) {
        extras.push(`Estatus actual: ${log.detalles.estatus}`);
    }

    if (cambios) {
        extras.push(cambios);
    }

    return [ `${entidad}: ${descripcion}`, ...extras ].join(' | ');
}

function construirDetalleUsuario(log) {
    const detalles = log.detalles || {};
    const usuarioObjetivo = detalles.usuario || 'Sin usuario';
    const nombreObjetivo = detalles.nombre_completo || '';
    const rol = detalles.rol ? traducirRol(detalles.rol) : null;
    const permisos = [
        detalles.permiso_civil_mercantil === true || detalles.permiso_civil_mercantil === 'true' ? 'Civil' : null,
        detalles.permiso_penal === true || detalles.permiso_penal === 'true' ? 'Penal' : null
    ].filter(Boolean);

    let resumen = '';
    if (log.accion === 'CREAR') {
        resumen = `Alta de usuario ${usuarioObjetivo}`;
    } else if (log.accion === 'EDITAR') {
        resumen = `Edicion de usuario ${usuarioObjetivo}`;
    } else {
        resumen = log.descripcion || 'Movimiento de usuario';
    }

    const extras = [];
    if (nombreObjetivo) {
        extras.push(`Nombre: ${nombreObjetivo}`);
    }
    if (rol) {
        extras.push(`Perfil: ${rol}`);
    }
    if (permisos.length) {
        extras.push(`Permisos: ${permisos.join(', ')}`);
    }

    const cambios = construirResumenCambiosUsuario(detalles.cambios || {});
    if (cambios) {
        extras.push(cambios);
    }

    return `
        <strong>${escaparHtml(resumen)}</strong>
        ${extras.length ? `<br><small style="color:var(--color-text-light);">${escaparHtml(extras.join(' | '))}</small>` : ''}
    `;
}

function construirDetalleUsuarioPlano(log) {
    const detalles = log.detalles || {};
    const usuarioObjetivo = detalles.usuario || 'Sin usuario';
    const nombreObjetivo = detalles.nombre_completo || '';
    const rol = detalles.rol ? traducirRol(detalles.rol) : null;
    const permisos = [
        detalles.permiso_civil_mercantil === true || detalles.permiso_civil_mercantil === 'true' ? 'Civil' : null,
        detalles.permiso_penal === true || detalles.permiso_penal === 'true' ? 'Penal' : null
    ].filter(Boolean);

    const partes = [];
    partes.push(log.accion === 'CREAR' ? `Alta de usuario ${usuarioObjetivo}` : `Edicion de usuario ${usuarioObjetivo}`);

    if (nombreObjetivo) {
        partes.push(`Nombre: ${nombreObjetivo}`);
    }
    if (rol) {
        partes.push(`Perfil: ${rol}`);
    }
    if (permisos.length) {
        partes.push(`Permisos: ${permisos.join(', ')}`);
    }

    const cambios = construirResumenCambiosUsuario(detalles.cambios || {});
    if (cambios) {
        partes.push(cambios);
    }

    return partes.join(' | ');
}

async function construirMapaUsuariosAuditoria() {
    const mapa = new Map();

    try {
        const response = await fetch('api/getUsers.php', {
            method: 'GET',
            credentials: 'same-origin'
        });

        const result = await response.json();
        const users = response.ok && result.ok ? (result.data?.users || []) : [];

        users.forEach(user => {
            if (user?.id !== null && user?.id !== undefined) {
                mapa.set(String(user.id), user.nombre_completo || `ID ${user.id}`);
            }
        });
    } catch (error) {
        console.error('No se pudo construir el mapa de usuarios para auditoría:', error);
    }

    return mapa;
}

function construirDetalleAcumulacion(log) {
    const detalles = log.detalles || {};
    const hijoNumero = detalles.caso_hijo_numero || (log.detalles?.numero_expediente ?? null) || 'Sin expediente';
    const padreAnterior = detalles.caso_padre_anterior_numero || (detalles.caso_padre_anterior_id ? `ID ${detalles.caso_padre_anterior_id}` : null);
    const padreNuevo = detalles.caso_padre_numero || (detalles.caso_padre_id ? `ID ${detalles.caso_padre_id}` : null);
    const tipoMovimiento = detalles.tipo_movimiento || '';

    let resumen = log.descripcion || 'Movimiento de acumulacion civil';
    if (tipoMovimiento === 'NUEVA') {
        resumen = `Acumulacion nueva del expediente ${hijoNumero}`;
    } else if (tipoMovimiento === 'CAMBIO') {
        resumen = `Cambio de acumulacion del expediente ${hijoNumero}`;
    } else if (tipoMovimiento === 'REMOCION') {
        resumen = `Remocion de acumulacion del expediente ${hijoNumero}`;
    } else if (tipoMovimiento === 'SIN_CAMBIO') {
        resumen = `Actualizacion de acumulacion del expediente ${hijoNumero}`;
    }

    const extras = [];
    if (tipoMovimiento === 'NUEVA' && padreNuevo) {
        extras.push(`Nuevo acumulado a: ${padreNuevo}`);
    } else if (tipoMovimiento === 'CAMBIO') {
        if (padreAnterior) {
            extras.push(`Anterior: ${padreAnterior}`);
        }
        if (padreNuevo) {
            extras.push(`Nuevo: ${padreNuevo}`);
        }
    } else if (tipoMovimiento === 'REMOCION' && padreAnterior) {
        extras.push(`Se removio de: ${padreAnterior}`);
    } else {
        if (padreAnterior) {
            extras.push(`Anterior: ${padreAnterior}`);
        }
        if (padreNuevo) {
            extras.push(`Nuevo: ${padreNuevo}`);
        }
    }

    return `
        <strong>${escaparHtml(resumen)}</strong>
        ${extras.length ? `<br><small style="color:var(--color-text-light);">${escaparHtml(extras.join(' | '))}</small>` : ''}
    `;
}

function construirDetalleAcumulacionPlano(log) {
    const detalles = log.detalles || {};
    const hijoNumero = detalles.caso_hijo_numero || (log.detalles?.numero_expediente ?? null) || 'Sin expediente';
    const padreAnterior = detalles.caso_padre_anterior_numero || (detalles.caso_padre_anterior_id ? `ID ${detalles.caso_padre_anterior_id}` : null);
    const padreNuevo = detalles.caso_padre_numero || (detalles.caso_padre_id ? `ID ${detalles.caso_padre_id}` : null);
    const tipoMovimiento = detalles.tipo_movimiento || '';
    const partes = [];

    if (tipoMovimiento === 'NUEVA') {
        partes.push(`Acumulacion nueva del expediente ${hijoNumero}`);
        if (padreNuevo) {
            partes.push(`Nuevo acumulado a: ${padreNuevo}`);
        }
    } else if (tipoMovimiento === 'CAMBIO') {
        partes.push(`Cambio de acumulacion del expediente ${hijoNumero}`);
        if (padreAnterior) {
            partes.push(`Anterior: ${padreAnterior}`);
        }
        if (padreNuevo) {
            partes.push(`Nuevo: ${padreNuevo}`);
        }
    } else if (tipoMovimiento === 'REMOCION') {
        partes.push(`Remocion de acumulacion del expediente ${hijoNumero}`);
        if (padreAnterior) {
            partes.push(`Se removio de: ${padreAnterior}`);
        }
    } else {
        partes.push(log.descripcion || 'Movimiento de acumulacion civil');
        if (padreAnterior) {
            partes.push(`Anterior: ${padreAnterior}`);
        }
        if (padreNuevo) {
            partes.push(`Nuevo: ${padreNuevo}`);
        }
    }

    return partes.join(' | ');
}

function construirDetalleReasignacionAbogado(log) {
    const detalles = log.detalles || {};
    const expediente = detalles.numero_expediente || log.expediente_numero_visible || 'Sin asunto';
    const abogadoAnterior = detalles.abogado_anterior_nombre || 'Sin valor';
    const abogadoNuevo = detalles.abogado_nuevo_nombre || 'Sin valor';
    const cambios = `Cambios: Abogado responsable: ${abogadoAnterior} -> ${abogadoNuevo}`;
    const extras = [
        `Asunto: ${expediente}`,
        `Anterior: ${abogadoAnterior}`,
        `Nuevo: ${abogadoNuevo}`,
    ];

    if (cambios) {
        extras.push(cambios);
    }

    return `
        <strong>Reasignacion de abogado responsable</strong>
        <br><small style="color:var(--color-text-light);">${escaparHtml(extras.join(' | '))}</small>
    `;
}

function construirDetalleReasignacionAbogadoPlano(log) {
    const detalles = log.detalles || {};
    const expediente = detalles.numero_expediente || log.expediente_numero_visible || 'Sin asunto';
    const abogadoAnterior = detalles.abogado_anterior_nombre || 'Sin valor';
    const abogadoNuevo = detalles.abogado_nuevo_nombre || 'Sin valor';
    const cambios = `Cambios: Abogado responsable: ${abogadoAnterior} -> ${abogadoNuevo}`;
    const partes = [
        'Reasignacion de abogado responsable',
        `Asunto: ${expediente}`,
        `Anterior: ${abogadoAnterior}`,
        `Nuevo: ${abogadoNuevo}`,
    ];

    if (cambios) {
        partes.push(cambios);
    }

    return partes.join(' | ');
}

function construirResumenCambiosUsuario(cambios) {
    if (!cambios || typeof cambios !== 'object') {
        return '';
    }

    const etiquetas = {
        nombre_completo: 'Nombre',
        usuario: 'Usuario',
        rol: 'Perfil',
        delegacion_id: 'JSJ',
        alcance_global: 'Alcance global',
        permiso_civil_mercantil: 'Permiso civil',
        permiso_penal: 'Permiso penal',
        es_abogado: 'Es abogado',
        es_jefe: 'Es jefe',
        activo: 'Estado',
        password: 'Password'
    };

    const partes = Object.entries(cambios)
        .map(([clave, valor]) => {
            const etiqueta = etiquetas[clave] || clave;
            const antes = formatearValorCambioAuditoria(clave, valor?.antes);
            const despues = formatearValorCambioAuditoria(clave, valor?.despues);
            return `${etiqueta}: ${antes} -> ${despues}`;
        });

    return partes.length ? `Cambios: ${partes.join('; ')}` : '';
}

function construirResumenCambiosAuditoria(cambios) {
    if (!cambios || typeof cambios !== 'object') {
        return '';
    }

    const partes = Object.entries(cambios)
        .map(([clave, valor]) => {
            const etiqueta = valor?.etiqueta || traducirCampoAuditoria(clave);
            const antes = formatearValorCambioAuditoria(clave, valor?.antes ?? valor?.anterior);
            const despues = formatearValorCambioAuditoria(clave, valor?.despues ?? valor?.nuevo);
            return `${etiqueta}: ${antes} -> ${despues}`;
        });

    return partes.length ? `Cambios: ${partes.join('; ')}` : '';
}

function normalizarValorAuditoriaUsuario(valor) {
    if (valor === null || valor === undefined || valor === '') {
        return 'Sin valor';
    }

    if (valor === true || valor === 'true') {
        return 'Si';
    }

    if (valor === false || valor === 'false') {
        return 'No';
    }

    return String(valor);
}

function formatearValorCambioAuditoria(campo, valor) {
    if (valor === null || valor === undefined || valor === '') {
        return 'Sin valor';
    }

    if (valor === true || valor === 'true') {
        return 'Si';
    }

    if (valor === false || valor === 'false') {
        return 'No';
    }

    if (Array.isArray(valor)) {
        if (!valor.length) {
            return 'Sin valor';
        }

        return valor.map(item => {
            if (item === null || item === undefined || item === '') {
                return 'Sin valor';
            }

            if (typeof item === 'object') {
                return JSON.stringify(item);
            }

            return formatearValorCatalogoAuditoria(campo, item);
        }).join(' | ');
    }

    if (typeof valor === 'object') {
        return JSON.stringify(valor);
    }

    return formatearValorCatalogoAuditoria(campo, valor);
}

function traducirCampoAuditoria(campo) {
    const mapa = {
        nombre_completo: 'Nombre',
        usuario: 'Usuario',
        rol: 'Perfil',
        delegacion_id: 'JSJ',
        alcance_global: 'Alcance global',
        permiso_civil_mercantil: 'Permiso civil',
        permiso_penal: 'Permiso penal',
        activo: 'Estado',
        password: 'Password',
        area_generadora_id: 'Area generadora',
        jurisdiccion: 'Jurisdiccion',
        tipo_juicio: 'Materia',
        subtipo_juicio: 'Tipo de procedimiento',
        sub_subtipo_juicio: 'Via',
        numero_juicio: 'Numero de asunto',
        anio: 'Ano',
        numero_expediente: 'Numero de expediente',
        organo_jurisdiccional_id: 'Tribunal / Juzgado',
        fecha_inicio: 'Fecha de inicio',
        imss_es: 'Calidad IMSS',
        actor: 'Actor',
        demandados: 'Demandados',
        codemandados: 'Codemandados',
        prestacion_principal: 'Prestacion principal',
        prestaciones_secundarias: 'Prestaciones secundarias',
        prestaciones_notas: 'Notas de prestaciones',
        importe_demandado: 'Importe demandado',
        abogado_responsable_id: 'Abogado responsable',
        pronostico: 'Pronostico',
        estatus: 'Estatus',
        fecha_vencimiento: 'Fecha de vencimiento',
        delito_id: 'Delito',
        denunciante: 'Denunciante',
        probable_responsable: 'Probable responsable',
        fecha_conocimiento_amp: 'Fecha de conocimiento AMP',
        estado_procesal_id: 'Estado procesal',
        acciones_pendientes: 'Acciones pendientes',
        fecha_judicializacion: 'Fecha de judicializacion',
        determinacion_judicial: 'Determinacion judicial',
        sentencia: 'Sentencia',
        fecha_sentencia: 'Fecha de sentencia',
        fecha_conclusion: 'Fecha de conclusion',
        dato_relevante: 'Dato relevante'
    };

    return mapa[campo] || campo;
}

function construirMapaCatalogo(items) {
    const mapa = new Map();

    if (!Array.isArray(items)) {
        return mapa;
    }

    items.forEach(item => {
        if (item && item.id !== null && item.id !== undefined) {
            mapa.set(String(item.id), item.nombre || item.estado || `ID ${item.id}`);
        }
    });

    return mapa;
}

function formatearValorCatalogoAuditoria(campo, valor) {
    const campoCatalogo = {
        delegacion_id: auditoriaCatalogos.delegaciones,
        area_generadora_id: auditoriaCatalogos.areas,
        organo_jurisdiccional_id: auditoriaCatalogos.organosJurisdiccionales,
        delito_id: auditoriaCatalogos.delitos,
        estado_procesal_id: auditoriaCatalogos.estadosProcesales,
        prestacion_principal: auditoriaCatalogos.prestaciones,
        abogado_responsable_id: auditoriaCatalogos.usuarios
    };

    const mapa = campoCatalogo[campo];
    const textoValor = String(valor);

    if (mapa instanceof Map && mapa.has(textoValor)) {
        if (campo === 'abogado_responsable_id') {
            return String(mapa.get(textoValor));
        }

        return `${mapa.get(textoValor)} (${textoValor})`;
    }

    return textoValor;
}

function traducirRol(rol) {
    const mapa = {
        admin: 'Administrador',
        editor: 'Editor',
        consulta: 'Consulta'
    };

    return mapa[String(rol || '').toLowerCase()] || (rol || '---');
}

function traducirModulo(modulo) {
    const mapa = {
        AUTH: 'Acceso',
        USUARIOS: 'Usuarios',
        CIVIL: 'Civil / Mercantil',
        PENAL: 'Penal'
    };

    return mapa[modulo] || (modulo || '---');
}

function traducirAccion(accion) {
    const mapa = {
        LOGIN: 'Inicio de sesion',
        LOGOUT: 'Cierre de sesion',
        REEMPLAZAR_SESION: 'Sesion reemplazada',
        CREAR: 'Alta',
        EDITAR: 'Edicion',
        ACTUALIZAR: 'Actualizacion',
        ELIMINAR: 'Eliminacion',
        RESTAURAR: 'Restauracion',
        ACUMULAR: 'Acumulacion',
        DESACUMULAR: 'Desacumulacion',
        REASIGNAR_ABOGADO: 'Reasignacion de abogado'
    };

    return mapa[accion] || (accion || '---');
}

function traducirEntidad(entidad) {
    const mapa = {
        SESION: 'Sesion',
        USUARIO: 'Usuario',
        EXPEDIENTE_CIVIL: 'Expediente civil',
        EXPEDIENTE_PENAL: 'Expediente penal',
        SEGUIMIENTO_CIVIL: 'Seguimiento civil',
        SEGUIMIENTO_PENAL: 'Seguimiento penal',
        ACUMULACION_CIVIL: 'Acumulacion civil'
    };

    return mapa[entidad] || (entidad || 'Registro');
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
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function escaparCsv(valor) {
    const texto = String(valor ?? '');
    return `"${texto.replaceAll('"', '""')}"`;
}

function obtenerMarcaArchivo() {
    const ahora = new Date();
    const yyyy = ahora.getFullYear();
    const mm = String(ahora.getMonth() + 1).padStart(2, '0');
    const dd = String(ahora.getDate()).padStart(2, '0');
    const hh = String(ahora.getHours()).padStart(2, '0');
    const min = String(ahora.getMinutes()).padStart(2, '0');

    return `${yyyy}${mm}${dd}_${hh}${min}`;
}

function obtenerSufijoExportacion() {
    const modulo = (document.getElementById('filtroModulo')?.value || '').trim().toLowerCase();
    const accion = (document.getElementById('filtroAccion')?.value || '').trim().toLowerCase();
    const fechaDesde = (document.getElementById('filtroFechaDesde')?.value || '').trim();
    const fechaHasta = (document.getElementById('filtroFechaHasta')?.value || '').trim();

    if (!modulo && !accion && !fechaDesde && !fechaHasta) {
        return 'completa';
    }

    const partes = [];

    if (modulo) {
        partes.push(`modulo-${normalizarNombreArchivo(modulo)}`);
    }

    if (accion) {
        partes.push(`movimiento-${normalizarNombreArchivo(accion)}`);
    }

    if (fechaDesde || fechaHasta) {
        const desde = fechaDesde ? fechaDesde.replaceAll('-', '') : 'inicio';
        const hasta = fechaHasta ? fechaHasta.replaceAll('-', '') : 'hoy';
        partes.push(`fechas-${desde}-a-${hasta}`);
    }

    return partes.join('_');
}

function normalizarNombreArchivo(valor) {
    return String(valor || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
}
