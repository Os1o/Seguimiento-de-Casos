// =====================================================
// CASOS.JS - Gestion de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;
const RESUMIR_PERSONAS_EN_LISTADOS = true;
const MAX_PERSONAS_EN_LISTADOS = 2;
let usuarioActual = null;
let catalogosCargados = false;
let skeletonCivilActivo = false;
let catalogos = {
    delegaciones: [],
    areas: {},
    organosJurisdiccionales: [],
    prestaciones: [],
    tiposActuacion: [],
    tiposJuicio: {},
    subtiposJuicio: {}
};

function crearTablaSkeletonCivil(rows = 6) {
    const skeletonRows = Array.from({ length: rows }).map(() => `
        <div class="civil-table-skeleton-row">
            <span class="civil-skeleton-block civil-skeleton-xs"></span>
            <span class="civil-skeleton-block civil-skeleton-xs"></span>
            <span class="civil-skeleton-block civil-skeleton-md"></span>
            <span class="civil-skeleton-block civil-skeleton-sm"></span>
            <span class="civil-skeleton-block civil-skeleton-lg"></span>
            <span class="civil-skeleton-block civil-skeleton-sm"></span>
            <span class="civil-skeleton-block civil-skeleton-md"></span>
            <span class="civil-skeleton-block civil-skeleton-md"></span>
        </div>
    `).join('');

    return `
        <div class="civil-table-skeleton-inner">
            ${skeletonRows}
        </div>
    `;
}

function crearSkeletonCivilSiNoExiste() {
    document.querySelectorAll('.dashboard-row .contador-card:not(.grafica-card)').forEach(card => {
        if (card.querySelector('.civil-card-skeleton')) return;

        const skeleton = document.createElement('div');
        skeleton.className = 'civil-card-skeleton';
        skeleton.setAttribute('aria-hidden', 'true');
        skeleton.innerHTML = `
            <span class="civil-skeleton-block civil-skeleton-num"></span>
            <span class="civil-skeleton-block civil-skeleton-label"></span>
        `;
        card.appendChild(skeleton);
    });

    const graficaCard = document.querySelector('.dashboard-row .grafica-card');
    if (graficaCard && !graficaCard.querySelector('.civil-graph-skeleton')) {
        const skeleton = document.createElement('div');
        skeleton.className = 'civil-graph-skeleton';
        skeleton.setAttribute('aria-hidden', 'true');
        skeleton.innerHTML = `
            <span class="civil-skeleton-block civil-skeleton-graph-title"></span>
            <div class="civil-graph-skeleton-body">
                <span class="civil-graph-skeleton-ring"></span>
                <div class="civil-graph-skeleton-lines">
                    <span class="civil-skeleton-block civil-skeleton-line"></span>
                    <span class="civil-skeleton-block civil-skeleton-line"></span>
                    <span class="civil-skeleton-block civil-skeleton-line"></span>
                </div>
            </div>
        `;
        graficaCard.appendChild(skeleton);
    }

    const tableContainer = document.querySelector('.table-container');
    if (tableContainer && !tableContainer.querySelector('.civil-table-skeleton')) {
        const skeleton = document.createElement('div');
        skeleton.className = 'civil-table-skeleton';
        skeleton.setAttribute('aria-hidden', 'true');
        skeleton.innerHTML = crearTablaSkeletonCivil();
        tableContainer.appendChild(skeleton);
    }
}

let sincronizandoScrollTablaCivil = false;

function usuarioPuedeExportarCivil(usuario) {
    if (!usuario) return false;
    return usuario.rol === 'admin' || Boolean(usuario.permiso_civil_mercantil);
}

function inicializarBotonExportarReporteCivil() {
    const primeraCard = document.querySelector('.dashboard-row .contador-card:not(.grafica-card)');
    if (!primeraCard) {
        return false;
    }

    primeraCard.classList.add('has-export-button');

    let boton = document.getElementById('btnExportarReporteCivil');
    if (!boton) {
        boton = document.createElement('button');
        boton.type = 'button';
        boton.id = 'btnExportarReporteCivil';
        boton.className = 'metric-export-button';
        boton.innerHTML = `
            <span>Exportar Reporte</span>
            <span class="material-symbols-outlined" aria-hidden="true">download</span>
        `;
        boton.addEventListener('click', exportarReporteCivilCsv);
        primeraCard.appendChild(boton);
    } else if (boton.parentElement !== primeraCard) {
        primeraCard.appendChild(boton);
    }

    boton.hidden = !usuarioPuedeExportarCivil(usuarioActual);
    return true;
}

function programarBotonExportarReporteCivil(intentosRestantes = 12) {
    if (inicializarBotonExportarReporteCivil() || intentosRestantes <= 0) {
        return;
    }

    window.setTimeout(() => {
        programarBotonExportarReporteCivil(intentosRestantes - 1);
    }, 120);
}

function exportarReporteCivilCsv() {
    if (!usuarioPuedeExportarCivil(usuarioActual)) {
        return;
    }

    const url = typeof window.construirUrlApiConToken === 'function'
        ? window.construirUrlApiConToken('api/civil/exportCasesCsv.php')
        : 'api/civil/exportCasesCsv.php';

    window.location.href = url;
}

function actualizarScrollSuperiorCivil() {
    const tableContainer = document.querySelector('.table-container');
    const topScroll = document.getElementById('tablaCasosScrollTop');
    const topScrollInner = document.getElementById('tablaCasosScrollTopInner');

    if (!tableContainer || !topScroll || !topScrollInner) {
        return;
    }

    const requiereScrollHorizontal = tableContainer.scrollWidth > tableContainer.clientWidth + 4;
    topScroll.classList.toggle('is-active', requiereScrollHorizontal);
    topScrollInner.style.width = `${tableContainer.scrollWidth}px`;

    if (!requiereScrollHorizontal) {
        topScroll.scrollLeft = 0;
    }
}

function vincularScrollSuperiorCivil() {
    const tableContainer = document.querySelector('.table-container');
    const topScroll = document.getElementById('tablaCasosScrollTop');

    if (!tableContainer || !topScroll || topScroll.dataset.bound === 'true') {
        actualizarScrollSuperiorCivil();
        return;
    }

    topScroll.dataset.bound = 'true';

    topScroll.addEventListener('scroll', function () {
        if (sincronizandoScrollTablaCivil) return;
        sincronizandoScrollTablaCivil = true;
        tableContainer.scrollLeft = topScroll.scrollLeft;
        sincronizandoScrollTablaCivil = false;
    });

    tableContainer.addEventListener('scroll', function () {
        if (sincronizandoScrollTablaCivil) return;
        sincronizandoScrollTablaCivil = true;
        topScroll.scrollLeft = tableContainer.scrollLeft;
        sincronizandoScrollTablaCivil = false;
    });

    window.addEventListener('resize', actualizarScrollSuperiorCivil);
    actualizarScrollSuperiorCivil();
}

function setSkeletonCivilActivo(activo) {
    skeletonCivilActivo = Boolean(activo);
    crearSkeletonCivilSiNoExiste();

    document.querySelectorAll('.dashboard-row .contador-card:not(.grafica-card)').forEach(card => {
        card.classList.toggle('is-loading', skeletonCivilActivo);
    });

    const graficaCard = document.querySelector('.dashboard-row .grafica-card');
    if (graficaCard) {
        graficaCard.classList.toggle('is-loading', skeletonCivilActivo);
    }

    const tableContainer = document.querySelector('.table-container');
    if (tableContainer) {
        tableContainer.classList.toggle('is-loading', skeletonCivilActivo);
    }

    const paginacion = document.getElementById('paginacion');
    if (paginacion && skeletonCivilActivo) {
        paginacion.style.display = 'none';
    }

    const mensajeVacio = document.getElementById('mensajeVacio');
    if (mensajeVacio && skeletonCivilActivo) {
        mensajeVacio.style.display = 'none';
    }
}

function mostrarOverlayCargaCivil() {
    window.mostrarCargaVista?.('.container');
}

async function ocultarOverlayCargaCivil() {
    await window.ocultarCargaVista?.('.container');
}

function agruparPorClave(items, key) {
    return (items || []).reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }

        acc[groupKey].push(item);
        return acc;
    }, {});
}

async function cargarCatalogos() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catalogos');
    }

    const data = result.data || {};

    catalogos = {
        delegaciones: data.delegaciones || [],
        areas: agruparPorClave(data.areas || [], 'delegacion_id'),
        organosJurisdiccionales: data.organosJurisdiccionales || [],
        prestaciones: data.prestaciones || [],
        tiposActuacion: data.tiposActuacion || [],
        tiposJuicio: agruparPorClave(data.tiposJuicio || [], 'materia'),
        subtiposJuicio: agruparPorClave(data.subtiposJuicio || [], 'tipo_juicio_id')
    };

    window.catalogos = catalogos;
    catalogosCargados = true;

    return catalogos;
}

async function obtenerCasosCivil(filtros = {}) {
    const queryParams = new URLSearchParams();

    if (filtros.delegacion_id) {
        queryParams.set('delegacion_id', filtros.delegacion_id);
    }

    const queryString = queryParams.toString();
    const url = `api/getCivilCases.php${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los casos civiles');
    }

    return result.data?.cases || [];
}

async function guardarAcumulacionCivilApi(casoPadreId, casoHijoId) {
    const response = await fetch('api/saveCivilAccumulation.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            casoPadreId,
            casoHijoId
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo guardar la acumulacion');
    }

    return result.data || {};
}

async function confirmarEliminar(casoId) {
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;

    if (caso.juicios_acumulados && caso.juicios_acumulados.length > 0) {
        await window.appAlert?.({
            title: 'No se puede eliminar',
            message: `El expediente ${caso.numero_expediente} tiene ${caso.juicios_acumulados.length} asunto(s) acumulado(s).\n\nDebe desacumularlos primero.`
        });
        return;
    }

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar expediente',
        message: `¿Estás seguro de eliminar el expediente ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) {
        return;
    }

    try {
        await eliminarCasoCivilApi(casoId);
        await cargarCasos();
        filtrarCasos();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Asunto eliminado exitosamente.'
        });
    } catch (error) {
        console.error('Error al eliminar caso:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar el asunto',
            message: error.message || 'Ocurrió un problema al eliminar el asunto.'
        });
    }
}
async function eliminarCasoCivilApi(id) {
    const response = await fetch('api/deleteCivilCase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            id
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo eliminar el caso');
    }

    return result.data || {};
}

function obtenerDelegacion(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
}

function actualizarInfoOOADCivil() {
    const infoOOAD = document.getElementById('infoOOAD');
    if (!infoOOAD || !usuarioActual) return;

    if (usuarioActual.delegacion_id) {
        const delegacion = obtenerDelegacion(usuarioActual.delegacion_id);
        if (delegacion) {
            infoOOAD.textContent = delegacion.nombre;
            return;
        }
    }

    infoOOAD.textContent = 'Todas las JSJ';
}

function obtenerNumeroExpedienteAcumulado(casoPadreId) {
    if (!casoPadreId) return 'Sin referencia';

    const casoPadre = todosLosCasos.find(caso => caso.id === casoPadreId);
    return casoPadre?.numero_expediente || obtenerNumeroExpediente(casoPadreId);
}

function formatearFecha(fecha) {
    if (!fecha) return '---';

    const fechaBase = typeof fecha === 'string' ? fecha.split('T')[0] : fecha;
    let dateValue;

    if (typeof fechaBase === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fechaBase)) {
        const [anio, mes, dia] = fechaBase.split('-').map(Number);
        dateValue = new Date(anio, mes - 1, dia);
    } else {
        dateValue = new Date(fecha);
    }

    if (Number.isNaN(dateValue.getTime())) {
        return String(fecha);
    }

    const dia = String(dateValue.getDate()).padStart(2, '0');
    const mes = String(dateValue.getMonth() + 1).padStart(2, '0');
    const anio = dateValue.getFullYear();

    return `${dia}/${mes}/${anio}`;
}
let filtroPronosticoDona = ''; // Filtro activo desde click en la dona
let estatusAutoSetByDona = false; // Indica si el filtro de estatus fue auto-asignado por click en la dona
window.hoveredDonaSegment = -1; // Indice del segmento de dona actualmente bajo hover

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

function sincronizarCatalogos() {
    if (!catalogosCargados) return;
    window.catalogos = catalogos;
}

document.addEventListener('DOMContentLoaded', async function () {
    // Verificar sesion
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;
    programarBotonExportarReporteCivil();
    mostrarOverlayCargaCivil();

    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    const btnNuevoRegistro = document.getElementById('btnNuevoRegistro');
    const tablaHeaders = document.querySelectorAll('#tablaCasos thead th');

    if (pageTitle) pageTitle.textContent = 'Asuntos Civiles, Mercantiles y Procedimientos Especiales';
    if (pageSubtitle) pageSubtitle.textContent = 'Gestión y seguimiento de asuntos';
    if (btnNuevoRegistro) btnNuevoRegistro.textContent = '+ Nuevo Registro';
    if (tablaHeaders.length >= 14) {
        tablaHeaders[2].textContent = 'Num. asunto';
        tablaHeaders[5].innerHTML = '<span>Fecha<br>inicio</span>';
        tablaHeaders[5].classList.add('th-break-header');
        tablaHeaders[8].textContent = 'Codemandado';
        tablaHeaders[8].classList.remove('th-break-header');
        tablaHeaders[9].innerHTML = '<span>Prestación<br>principal</span>';
        tablaHeaders[9].classList.add('th-break-header');
    }
    prepararMarcoGraficaDashboard('chartPronostico');
    vincularScrollSuperiorCivil();

    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Mostrar badge de rol
    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', jefe: 'Jefe', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    actualizarInfoOOADCivil();

    // Mostrar/ocultar enlace de admin
    const linkAdmin = document.getElementById('linkAdmin');
    if (linkAdmin && usuario.rol === 'admin') {
        linkAdmin.style.display = '';
    }

    // Ocultar boton "Nuevo Registro" para rol consulta
    if (usuario.rol === 'consulta' || usuario.rol === 'jefe') {
        const btnNuevo = document.getElementById('btnNuevoRegistro');
        if (btnNuevo) btnNuevo.style.display = 'none';
    }

    if (!usuario.permiso_civil_mercantil && usuario.rol !== 'admin') {
        window.location.href = usuario.permiso_penal ? 'penal.html' : 'login.html';
        return;
    }

    // Ocultar pestaÃ±a Penal si no tiene permiso
    if (!usuario.permiso_penal && usuario.rol !== 'admin') {
        const linkPenal = document.getElementById('linkPenal');
        if (linkPenal) linkPenal.style.display = 'none';
    }

    // Ocultar filtro de delegacion para usuarios con JSJ fija (ya esta filtrado por su JSJ)
    // Si no tiene delegacion_id (ej. consulta global), dejar el filtro visible
    if (usuario.rol !== 'admin' && usuario.delegacion_id) {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">JSJ</span>';
        }
    }

    const [catalogosResult, casosResult] = await Promise.allSettled([
        cargarCatalogos(),
        cargarCasos({ showLoader: false })
    ]);

    if (catalogosResult.status === 'fulfilled') {
        sincronizarCatalogos();
        actualizarInfoOOADCivil();
    } else {
        console.warn('No se pudo cargar catalogos desde la API local, usando datos vacios');
        if (typeof window.catalogos === 'undefined') {
            window.catalogos = {
                delegaciones: [],
                areas: {},
                organosJurisdiccionales: [],
                prestaciones: [],
                tiposJuicio: {},
                subtiposJuicio: {}
            };
        }
    }

    if (casosResult.status === 'rejected') {
        console.warn('La carga principal de casos termino con fallback local:', casosResult.reason);
    }

    await ocultarOverlayCargaCivil();

    // Inicializar click en dona
    inicializarClickDona();

    // Filtros ahora son reactivos (se calculan dinamicamente en toggleFiltro)

    // Event listeners para busqueda
    document.getElementById('searchInput').addEventListener('input', filtrarCasos);
    actualizarResumenFiltrosToolbar();

    // Mostrar casos
    filtrarCasos();
});

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';

    // Resetear filtro de pronostico aplicado desde la dona
    filtroPronosticoDona = '';

    // Resetear flag de auto-set por dona
    estatusAutoSetByDona = false;

    // Resetear estado
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');
    ordenFechaListado = 'actualizacion';

    // Restaurar etiquetas de botones
    document.querySelectorAll('.filtro-btn-custom').forEach(btn => {
        btn.innerHTML = `<span class="filtro-btn-nombre">${btn.dataset.nombre} <span class="filtro-flecha">&#9660;</span></span>`;
        btn.classList.remove('filtro-activo');
    });

    cerrarTodosLosFiltros();
    cerrarResumenFiltros();
    filtrarCasos();
}


async function cargarCasos(options = {}) {
    const { showLoader = true } = options;
    let todosLosCasosSinFiltro = [];

    if (showLoader) {
        window.mostrarCargaBloque?.('.table-container');
    }

    try {
        const filtros = {};
        if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
            filtros.delegacion_id = usuarioActual.delegacion_id;
        }
        todosLosCasosSinFiltro = await obtenerCasosCivil(filtros);
        localStorage.setItem('casos', JSON.stringify(todosLosCasosSinFiltro));
    } catch (err) {
        console.warn('No se pudo cargar casos desde la API local, usando cache local:', err);
        const casosGuardados = localStorage.getItem('casos');
        todosLosCasosSinFiltro = casosGuardados ? JSON.parse(casosGuardados) : [];
    } finally {
        if (showLoader) {
            await window.ocultarCargaBloque?.('.table-container');
        }
    }

    // Asegurar que todos los casos tengan fecha_actualizacion
    todosLosCasosSinFiltro.forEach(caso => {
        if (!caso.fecha_actualizacion) {
            caso.fecha_actualizacion = caso.fecha_creacion || new Date().toISOString();
        }
    });

    // Filtrar por JSJ del usuario (si no es admin)
    if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        todosLosCasos = todosLosCasosSinFiltro.filter(c => c.delegacion_id === usuarioActual.delegacion_id);
    } else {
        todosLosCasos = todosLosCasosSinFiltro;
    }

    // Orden normal del listado: ultima actualizacion descendente
    todosLosCasos.sort((a, b) => {
        const fechaA = a.fecha_actualizacion || a.fecha_creacion || 0;
        const fechaB = b.fecha_actualizacion || b.fecha_creacion || 0;
        return new Date(fechaB) - new Date(fechaA);
    });

    opcionesFiltros.filtroDelegacion = [];
    llenarFiltros();

    // Renderizar actividad reciente y tabla
    renderizarActividadReciente();
    renderizarTabla(todosLosCasos);
    actualizarContadores();
}

function llenarFiltros() {
    catalogos.delegaciones.forEach(deleg => {
        opcionesFiltros.filtroDelegacion.push({ valor: deleg.id, etiqueta: deleg.nombre });
    });
}

// Estado de filtros (dropdown personalizado)
const estadoFiltros = {
    filtroDelegacion: '',
    filtroEstatus: '',
    filtroTipo: '',
    filtroJurisdiccion: '',
    filtroPosicionIMSS: ''
};
let ordenFechaListado = 'actualizacion';

// Opciones de cada filtro
const opcionesFiltros = {
    filtroDelegacion: [], // Se llena dinamicamente
    filtroEstatus: [
        { valor: 'TRAMITE', etiqueta: 'Trámite' },
        { valor: 'CONCLUIDO', etiqueta: 'Concluido' }
    ],
    filtroTipo: [
        { valor: 'CIVIL', etiqueta: 'Civil' },
        { valor: 'MERCANTIL', etiqueta: 'Mercantil' },
        { valor: 'AMPARO INDIRECTO', etiqueta: 'Amparo Indirecto' }
    ],
    filtroJurisdiccion: [
        { valor: 'LOCAL', etiqueta: 'Local' },
        { valor: 'FEDERAL', etiqueta: 'Federal' }
    ],
    filtroPosicionIMSS: [
        { valor: 'ACTOR', etiqueta: 'Actor' },
        { valor: 'DEMANDADO', etiqueta: 'Demandado' },
        { valor: 'TERCERO', etiqueta: 'Tercero' }
    ]
};

let filtroAbierto = null;
const definicionResumenFiltros = {
    filtroDelegacion: 'JSJ',
    filtroEstatus: 'Estatus',
    filtroTipo: 'Materia',
    filtroJurisdiccion: 'Tribunal / Juzgado',
    filtroPosicionIMSS: 'Calidad IMSS'
};

function obtenerResumenFiltrosActivos() {
    const activos = [];

    Object.entries(estadoFiltros).forEach(([filtroId, valor]) => {
        if (!valor) return;

        const boton = document.getElementById('btn_' + filtroId);
        const badge = boton?.querySelector('.filtro-valor-badge');
        const opcion = (opcionesFiltros[filtroId] || []).find(item => String(item.valor) === String(valor));
        activos.push({
            filtroId,
            nombre: definicionResumenFiltros[filtroId] || boton?.dataset.nombre || filtroId,
            valor: badge?.textContent?.trim() || opcion?.etiqueta || String(valor)
        });
    });

    if (filtroPronosticoDona) {
        const valor = filtroPronosticoDona === 'FAVORABLE'
            ? 'Favorable'
            : filtroPronosticoDona === 'DESFAVORABLE'
                ? 'Desfavorable'
                : 'Sin Pronóstico';

        activos.push({
            filtroId: 'filtroPronosticoDona',
            nombre: 'Pronóstico',
            valor
        });
    }

    return activos;
}

function renderizarPanelResumenFiltros() {
    const panel = document.getElementById('panelResumenFiltros');
    if (!panel) return;

    const activos = obtenerResumenFiltrosActivos();
    const chipsHtml = activos.length
        ? activos.map(item => `<span class="toolbar-filter-chip"><strong>${item.nombre}:</strong> ${item.valor}</span>`).join('')
        : '<p class="toolbar-filter-empty">Sin filtros activos.</p>';

    panel.innerHTML = `
        <div class="toolbar-filter-panel-header">
            <p class="toolbar-filter-panel-title">Filtros</p>
            <p class="toolbar-filter-panel-help">Usa estos accesos rápidos para abrir los filtros reales de la tabla.</p>
        </div>
        <div class="toolbar-filter-chip-list">${chipsHtml}</div>
        <div class="toolbar-filter-shortcuts">
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroDelegacion')">JSJ</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroEstatus')">Estatus</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroTipo')">Materia</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroJurisdiccion')">Tribunal</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroPosicionIMSS')">Calidad IMSS</button>
        </div>
        <div class="toolbar-filter-order">
            <span class="toolbar-filter-order-label">Orden</span>
            <div class="toolbar-filter-order-actions">
                <button type="button" class="toolbar-filter-order-btn ${ordenFechaListado === 'actualizacion' ? 'is-active' : ''}" onclick="cambiarOrdenFecha(event, 'actualizacion')">Última actualización</button>
                <button type="button" class="toolbar-filter-order-btn ${ordenFechaListado === 'inicio_reciente' ? 'is-active' : ''}" onclick="cambiarOrdenFecha(event, 'inicio_reciente')">Fecha de inicio: más reciente</button>
                <button type="button" class="toolbar-filter-order-btn ${ordenFechaListado === 'inicio_antiguo' ? 'is-active' : ''}" onclick="cambiarOrdenFecha(event, 'inicio_antiguo')">Fecha de inicio: más antiguo</button>
            </div>
        </div>
    `;
}

function actualizarResumenFiltrosToolbar() {
    const badge = document.getElementById('badgeResumenFiltros');
    const boton = document.getElementById('btnResumenFiltros');
    if (!badge || !boton) return;

    const activos = obtenerResumenFiltrosActivos();
    badge.textContent = activos.length;
    badge.hidden = activos.length === 0;
    boton.classList.toggle('has-active-filters', activos.length > 0);

    renderizarPanelResumenFiltros();
}

function toggleResumenFiltros(event) {
    event?.stopPropagation?.();
    const panel = document.getElementById('panelResumenFiltros');
    if (!panel) return;

    const vaAMostrar = panel.hidden;
    cerrarTodosLosFiltros();

    if (!vaAMostrar) {
        cerrarResumenFiltros();
        return;
    }

    renderizarPanelResumenFiltros();
    panel.hidden = false;
}

function cerrarResumenFiltros() {
    const panel = document.getElementById('panelResumenFiltros');
    if (panel) panel.hidden = true;
}

function abrirFiltroDesdeToolbar(event, filtroId) {
    event?.stopPropagation?.();
    const boton = document.getElementById('btn_' + filtroId);
    cerrarResumenFiltros();
    if (!boton) return;
    toggleFiltro(filtroId, boton);
}

function cambiarOrdenFecha(event, orden) {
    event?.stopPropagation?.();
    const ordenesValidos = ['actualizacion', 'inicio_reciente', 'inicio_antiguo'];
    ordenFechaListado = ordenesValidos.includes(orden) ? orden : 'actualizacion';
    renderizarPanelResumenFiltros();
    filtrarCasos();
}

function cerrarTodosLosFiltros() {
    const panel = document.getElementById('filtroPanel');
    if (panel) panel.style.display = 'none';
    filtroAbierto = null;
}

function toggleFiltro(id, boton) {
    if (filtroAbierto === id) {
        cerrarTodosLosFiltros();
        return;
    }

    const panel = document.getElementById('filtroPanel');
    const lista = document.getElementById('filtroPanelLista');

    // Calcular posicion del boton en pantalla (fixed, sin scroll)
    const rect = boton.getBoundingClientRect();
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';

    // FILTROS REACTIVOS: calcular opciones disponibles segÃºn los otros filtros activos
    const opcionesDisponibles = calcularOpcionesDisponibles(id);

    // Construir opciones
    lista.innerHTML = '';

    const opcionTodos = document.createElement('div');
    opcionTodos.className = 'filtro-opcion filtro-opcion-todos';
    opcionTodos.textContent = 'Todos';
    opcionTodos.onclick = () => seleccionarFiltro(id, '', 'Todos');
    lista.appendChild(opcionTodos);

    opcionesDisponibles.forEach(op => {
        const item = document.createElement('div');
        item.className = 'filtro-opcion';
        if (estadoFiltros[id] == op.valor) item.classList.add('filtro-opcion-seleccionada');
        item.textContent = op.etiqueta + ' (' + op.count + ')';
        item.onclick = () => seleccionarFiltro(id, op.valor, op.etiqueta);
        lista.appendChild(item);
    });

    panel.style.display = 'block';
    filtroAbierto = id;
}

function calcularOpcionesDisponibles(filtroActual) {
    // Filtrar casos con todos los filtros EXCEPTO el filtro actual
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();

    const casosBase = todosLosCasos.filter(caso => {
        // Busqueda
        let cumpleBusqueda = true;
        if (searchTerm) {
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const actorNombre = (getActorNombre(caso) || '').toLowerCase();
            const demandadosNombre = (getDemandadosNombres(caso) || '').toLowerCase();
            cumpleBusqueda = expediente.includes(searchTerm) || actorNombre.includes(searchTerm) || demandadosNombre.includes(searchTerm);
        }

        // Aplicar todos los filtros EXCEPTO el filtro actual
        const cumpleDelegacion = filtroActual === 'filtroDelegacion' || !estadoFiltros.filtroDelegacion || caso.delegacion_id == estadoFiltros.filtroDelegacion;
        const cumpleEstatus = filtroActual === 'filtroEstatus' || !estadoFiltros.filtroEstatus || caso.estatus === estadoFiltros.filtroEstatus;
        const cumpleTipo = filtroActual === 'filtroTipo' || !estadoFiltros.filtroTipo || caso.tipo_juicio === estadoFiltros.filtroTipo;
        const cumpleJurisdiccion = filtroActual === 'filtroJurisdiccion' || !estadoFiltros.filtroJurisdiccion || caso.jurisdiccion === estadoFiltros.filtroJurisdiccion;
        const cumplePosicionIMSS = filtroActual === 'filtroPosicionIMSS' || !estadoFiltros.filtroPosicionIMSS || caso.imss_es === estadoFiltros.filtroPosicionIMSS;

        let cumplePronostico = true;
        if (filtroPronosticoDona) {
            const pron = normalizarPronostico(caso.pronostico || (caso.seguimiento && caso.seguimiento.pronostico));
            cumplePronostico = pron === filtroPronosticoDona;
        }

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS && cumplePronostico;
    });

    // Extraer valores unicos con conteo para el filtro actual
    const conteo = {};

    casosBase.forEach(caso => {
        let valor, etiqueta;

        switch (filtroActual) {
            case 'filtroDelegacion':
                valor = caso.delegacion_id;
                const deleg = obtenerDelegacion(caso.delegacion_id);
                etiqueta = deleg ? deleg.nombre : 'Desconocida';
                break;
            case 'filtroEstatus':
                valor = caso.estatus;
                etiqueta = caso.estatus === 'TRAMITE' ? 'Trámite' : 'Concluido';
                break;
            case 'filtroTipo':
                valor = caso.tipo_juicio;
                etiqueta = caso.tipo_juicio;
                break;
            case 'filtroJurisdiccion':
                valor = caso.jurisdiccion;
                etiqueta = caso.jurisdiccion === 'LOCAL' ? 'Local' : 'Federal';
                break;
            case 'filtroPosicionIMSS':
                valor = caso.imss_es;
                etiqueta = caso.imss_es === 'ACTOR' ? 'Actor' : caso.imss_es === 'DEMANDADO' ? 'Demandado' : 'Tercero';
                break;
        }

        if (valor !== undefined && valor !== null) {
            if (!conteo[valor]) {
                conteo[valor] = { valor, etiqueta, count: 0 };
            }
            conteo[valor].count++;
        }
    });

    return Object.values(conteo).sort((a, b) => {
        if (typeof a.etiqueta === 'string' && typeof b.etiqueta === 'string') {
            return a.etiqueta.localeCompare(b.etiqueta);
        }
        return 0;
    });
}

function seleccionarFiltro(filtroId, valor, etiqueta) {
    estadoFiltros[filtroId] = valor;

    const btn = document.getElementById('btn_' + filtroId);
    const nombreColumna = btn.dataset.nombre;
    if (valor) {
        btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span>`;
        btn.classList.add('filtro-activo');
    } else {
        btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span>`;
        btn.classList.remove('filtro-activo');
    }

    cerrarTodosLosFiltros();
    actualizarResumenFiltrosToolbar();
    filtrarCasos();
}

// Clic afuera cierra el panel
document.addEventListener('click', function (e) {
    if (!e.target.closest('.th-filtrable') && !e.target.closest('#filtroPanel')) {
        cerrarTodosLosFiltros();
    }
    if (!e.target.closest('#panelResumenFiltros') && !e.target.closest('#btnResumenFiltros')) {
        cerrarResumenFiltros();
    }
});

// ESC cierra panel y modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        cerrarTodosLosFiltros();
        cerrarModalAcumulados();
    }
});

// Scroll cierra el panel de filtros (excepto scroll dentro del propio dropdown)
window.addEventListener('scroll', function (e) {
    if (!filtroAbierto) return;
    const panel = document.getElementById('filtroPanel');
    if (panel && panel.contains(e.target)) return; // scroll dentro del dropdown, ignorar
    cerrarTodosLosFiltros();
}, true);

function filtrarCasos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const { filtroDelegacion: delegacionId, filtroEstatus: estatus, filtroTipo: tipo, filtroJurisdiccion: jurisdiccion, filtroPosicionIMSS: posicionIMSS } = estadoFiltros;

    casosFiltrados = todosLosCasos.filter(caso => {
        let cumpleBusqueda = true;
        if (searchTerm) {
            // Protecciones anadidas: ( ... || '')
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const actorNombre = (getActorNombre(caso) || '').toLowerCase();
            const demandadosNombre = (getDemandadosNombres(caso) || '').toLowerCase();
            const tribunalNombre = obtenerTextoBusquedaTribunal(caso).toLowerCase();

            cumpleBusqueda = expediente.includes(searchTerm) ||
                actorNombre.includes(searchTerm) ||
                demandadosNombre.includes(searchTerm) ||
                tribunalNombre.includes(searchTerm);
        }

        const cumpleDelegacion = !delegacionId || caso.delegacion_id == delegacionId;
        const cumpleEstatus = !estatus || caso.estatus === estatus;
        const cumpleTipo = !tipo || caso.tipo_juicio === tipo;
        const cumpleJurisdiccion = !jurisdiccion || caso.jurisdiccion === jurisdiccion;
        const cumplePosicionIMSS = !posicionIMSS || caso.imss_es === posicionIMSS;

        // Filtro de pronostico (desde click en dona)
        let cumplePronostico = true;
        if (filtroPronosticoDona) {
            const pron = normalizarPronostico(caso.pronostico || (caso.seguimiento && caso.seguimiento.pronostico));
            cumplePronostico = pron === filtroPronosticoDona;
        }

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS && cumplePronostico;
    });

    // Orden normal: ultima actualizacion. Opcionalmente, fecha de inicio.
    casosFiltrados.sort((a, b) => {
        const fechaActualizacionA = a.fecha_actualizacion || a.fecha_creacion || '';
        const fechaActualizacionB = b.fecha_actualizacion || b.fecha_creacion || '';
        const fechaInicioA = a.fecha_inicio || fechaActualizacionA;
        const fechaInicioB = b.fecha_inicio || fechaActualizacionB;

        if (ordenFechaListado === 'inicio_antiguo') {
            return new Date(fechaInicioA) - new Date(fechaInicioB);
        }

        if (ordenFechaListado === 'inicio_reciente') {
            return new Date(fechaInicioB) - new Date(fechaInicioA);
        }

        return new Date(fechaActualizacionB) - new Date(fechaActualizacionA);
    });

    paginaActual = 1;
    actualizarEstadisticas();
    renderizarTabla();
    actualizarResumenFiltrosToolbar();
}

function obtenerTextoBusquedaTribunal(caso) {
    const organo = catalogos.organosJurisdiccionales.find(t => t.id === caso.organo_jurisdiccional_id);
    return (caso.organo_jurisdiccional_nombre || organo?.nombre || '').toString();
}

function actualizarEstadisticas() {
    // Usar casosFiltrados para que el dashboard reaccione a los filtros de tabla
    const datos = casosFiltrados && casosFiltrados.length >= 0 ? casosFiltrados : todosLosCasos;
    const total = datos.length;
    const tramite = datos.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = datos.filter(c => c.estatus === 'CONCLUIDO').length;

    document.getElementById('totalCasos').textContent = total;
    document.getElementById('casosTramite').textContent = tramite;
    document.getElementById('casosConcluidos').textContent = concluidos;

    // Renderizar grafica de pronostico (solo tramites de los filtrados)
    renderizarGraficaPronostico();
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaCasosBody');
    const mensajeVacio = document.getElementById('mensajeVacio');

    if (casosFiltrados.length === 0) {
        tbody.innerHTML = '';
        mensajeVacio.style.display = 'block';
        document.getElementById('paginacion').style.display = 'none';
        return;
    }

    mensajeVacio.style.display = 'none';

    const totalPaginas = Math.ceil(casosFiltrados.length / REGISTROS_POR_PAGINA);
    if (paginaActual > totalPaginas) paginaActual = totalPaginas;
    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA;
    const fin = inicio + REGISTROS_POR_PAGINA;
    const casosPagina = casosFiltrados.slice(inicio, fin);

    tbody.innerHTML = casosPagina.map(caso => {
        const delegacion = obtenerDelegacion(caso.delegacion_id);
        const actorNombre = getActorNombreConTipo(caso);
        const demandadosNombres = getDemandadosNombresConTipo(caso);
        const codemandadosNombres = getCodemandadosNombresConTipo(caso);
        const esAcumulado = Boolean(caso.acumulado_a);
        const expedientePadreNumero = esAcumulado ? obtenerNumeroExpedienteAcumulado(caso.acumulado_a) : null;
        const metaExpediente = formatearFechaRelativa(caso.fecha_actualizacion || caso.fecha_creacion);
        const acumuladosHtml = esAcumulado
            ? `<small class="acumulado-inline-text">Acum. a<\/small><small class="acumulado-inline-expediente">${expedientePadreNumero || '-'}<\/small>`
            : (caso.juicios_acumulados && caso.juicios_acumulados.length > 0
                ? `<button onclick="verAcumulados(${caso.id})" class="btn-link">${caso.juicios_acumulados.length} asuntos<\/button>`
                : '-');

        const organo = catalogos.organosJurisdiccionales.find(t => t.id === caso.organo_jurisdiccional_id);
        const prefJurisdiccion = caso.jurisdiccion === 'FEDERAL'
            ? '<small class="tag-jurisdiccion">(F)<\/small>'
            : '<small class="tag-jurisdiccion">(L)<\/small>';
        const tribunalBase = caso.organo_jurisdiccional_nombre || organo?.nombre || '-';
        const tribunalNombre = tribunalBase !== '-' ? `${prefJurisdiccion} ${tribunalBase}` : '-';

        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge-mini badge-mini-tramite" title="En Trámite">T<\/span>'
            : '<span class="badge-mini badge-mini-concluido" title="Concluido">C<\/span>';

        return `
            <tr>
                <td><small>${delegacion ? delegacion.nombre : 'N/A'}<\/small><\/td>
                <td>${badgeEstatus}<\/td>
                <td>
                    <a href="#" class="expediente-link" onclick="verDetalle(${caso.id}); return false;">
                        <strong>${caso.numero_expediente}<\/strong>
                    <\/a>
                    <small class="expediente-meta-texto">${metaExpediente}<\/small>
                <\/td>
                <td>
                    <span style="font-weight: 600;">${caso.tipo_juicio}<\/span><br>
                    <small style="color: var(--color-text-light);">${caso.subtipo_juicio || ''}${caso.sub_subtipo_juicio ? ' - ' + caso.sub_subtipo_juicio : ''}<\/small>
                <\/td>
                <td>${tribunalNombre}<\/td>
                <td>${formatearFecha(caso.fecha_inicio)}<\/td>
                <td>${actorNombre}<\/td>
                <td>${demandadosNombres}<\/td>
                <td>${codemandadosNombres}<\/td>
                <td><small>${getPrestacionesTexto(caso)}<\/small><\/td>
                <td><strong>${caso.importe_demandado > 0 ? formatearMoneda(caso.importe_demandado) : 'Sin cuantia'}<\/strong><\/td>
                <td>
                    <span class="badge ${getBadgeClass(caso.imss_es)}">
                        ${caso.imss_es}
                    <\/span>
                <\/td>
                <td>${acumuladosHtml}<\/td>
                <td class="td-sticky-right">
                    <div class="menu-container" id="menu-container-${caso.id}">
                        <button class="menu-trigger" onclick="toggleMenu(${caso.id})" id="menu-trigger-${caso.id}">
                            &#8942;
                        <\/button>
                        <div class="menu-dropdown" id="menu-${caso.id}">
                            <div class="menu-item" onclick="verDetalle(${caso.id})">
                                Ver detalle
                            <\/div>
                            ${usuarioActual && usuarioActual.rol === 'admin' && !esAcumulado ? `
                            <div class="menu-item" onclick="editarCaso(${caso.id})">
                                Editar datos
                            <\/div>` : ''}
                            ${usuarioActual && usuarioActual.rol !== 'consulta' && !esAcumulado ? `
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                Actualizar seguimiento
                            <\/div>` : ''}
                            ${usuarioActual && usuarioActual.rol !== 'consulta' ? `
                            <div class="menu-item" onclick="abrirModalAcumular(${caso.id})">
                                ${esAcumulado ? 'Gestionar acumulacion' : 'Acumular'}
                            <\/div>` : ''}
                            ${usuarioActual && usuarioActual.rol === 'admin' ? `
                            <div class="menu-item danger" onclick="confirmarEliminar(${caso.id})">
                                Eliminar
                            <\/div>` : ''}
                        <\/div>
                    <\/div>
                <\/td>
            <\/tr>
        `;
    }).join('');

    renderizarPaginacion(totalPaginas);
    actualizarScrollSuperiorCivil();
}

function renderizarPaginacion(totalPaginas) {
    const contenedor = document.getElementById('paginacion');
    const inicio = (paginaActual - 1) * REGISTROS_POR_PAGINA + 1;
    const fin = Math.min(paginaActual * REGISTROS_POR_PAGINA, casosFiltrados.length);

    if (totalPaginas <= 1) {
        contenedor.style.display = 'none';
        return;
    }

    contenedor.style.display = 'flex';
    const paginasVisibles = construirPaginasVisibles(totalPaginas, paginaActual);

    contenedor.innerHTML = `
        <span class="paginacion-info">Mostrando ${inicio}-${fin} de ${casosFiltrados.length} asuntos</span>
        <div class="paginacion-controles">
            <button class="paginacion-btn paginacion-btn-icon" onclick="irAPagina(1)" ${paginaActual === 1 ? 'disabled' : ''} aria-label="Primera pagina">&laquo;</button>
            <button class="paginacion-btn paginacion-btn-icon" onclick="irAPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''} aria-label="Pagina anterior">&lsaquo;</button>
            <div class="paginacion-paginas">
                ${paginasVisibles.map(pagina => `
                    ${pagina === '...'
                        ? `<span class="paginacion-ellipsis">...</span>`
                        : `<button
                            class="paginacion-btn ${pagina === paginaActual ? 'is-active' : 'is-page'}"
                            onclick="irAPagina(${pagina})"
                            aria-current="${pagina === paginaActual ? 'page' : 'false'}"
                        >${pagina}</button>`}
                `).join('')}
            </div>
            <span class="paginacion-pagina">Página ${paginaActual} de ${totalPaginas}</span>
            <button class="paginacion-btn paginacion-btn-icon" onclick="irAPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''} aria-label="Página siguiente">&rsaquo;</button>
            <button class="paginacion-btn paginacion-btn-icon" onclick="irAPagina(${totalPaginas})" ${paginaActual === totalPaginas ? 'disabled' : ''} aria-label="Última página">&raquo;</button>
            <label class="paginacion-jump">
                <span>Ir a</span>
                <input
                    id="paginacionInput"
                    type="number"
                    min="1"
                    max="${totalPaginas}"
                    value="${paginaActual}"
                    onkeydown="if (event.key === 'Enter') irAPaginaDesdeInput(${totalPaginas})"
                >
            </label>
        </div>
    `;
}

function construirPaginasVisibles(totalPaginas, paginaActualActual) {
    const paginas = new Set([1, totalPaginas, paginaActualActual - 1, paginaActualActual, paginaActualActual + 1]);

    if (paginaActualActual <= 3) {
        paginas.add(2);
        paginas.add(3);
    }

    if (paginaActualActual >= totalPaginas - 2) {
        paginas.add(totalPaginas - 1);
        paginas.add(totalPaginas - 2);
    }

    const ordenadas = Array.from(paginas)
        .filter(p => p >= 1 && p <= totalPaginas)
        .sort((a, b) => a - b);

    const resultado = [];
    for (let i = 0; i < ordenadas.length; i++) {
        const actual = ordenadas[i];
        const anterior = ordenadas[i - 1];

        if (i > 0 && actual - anterior > 1) {
            resultado.push('...');
        }

        resultado.push(actual);
    }

    return resultado;
}

function irAPagina(pagina) {
    const totalPaginas = Math.ceil(casosFiltrados.length / REGISTROS_POR_PAGINA);
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderizarTabla();
    document.querySelector('.table-container').scrollTop = 0;
    document.querySelector('.table-container').scrollLeft = 0;
}

function irAPaginaDesdeInput(totalPaginas) {
    const input = document.getElementById('paginacionInput');
    if (!input) return;

    const paginaDestino = Number.parseInt(input.value, 10);
    if (!Number.isFinite(paginaDestino)) return;

    if (paginaDestino < 1) {
        irAPagina(1);
        return;
    }

    if (paginaDestino > totalPaginas) {
        irAPagina(totalPaginas);
        return;
    }

    irAPagina(paginaDestino);
}

function getActorNombre(actorOrCaso) {
    // Compatibilidad: acepta un caso o un actor directamente
    let actores;
    if (actorOrCaso && actorOrCaso.imss_es) {
        // Es un caso
        if (actorOrCaso.imss_es === 'ACTOR') return 'IMSS';
        actores = obtenerActoresNormalizados(actorOrCaso);
    } else if (actorOrCaso && actorOrCaso.tipo_persona) {
        actores = [actorOrCaso];
    } else if (Array.isArray(actorOrCaso)) {
        actores = actorOrCaso;
    } else {
        return 'IMSS';
    }

    if (actores.length === 0) return 'N/A';

    return actores.map(a => {
        if (a.tipo_persona === 'FISICA') {
            return `${a.nombres || ''} ${a.apellido_paterno || ''} ${a.apellido_materno || ''}`.trim();
        }
        return a.empresa || '';
    }).join(', ');
}

function normalizarPronostico(valor) {
    const pronostico = (valor || '')
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();

    if (!pronostico || pronostico === 'SIN PRONOSTICO') return 'SIN_PRONOSTICO';
    if (pronostico === 'FAVORABLE') return 'FAVORABLE';
    if (pronostico === 'DESFAVORABLE') return 'DESFAVORABLE';
    return pronostico;
}

function getActorNombreConTipo(caso) {
    if (caso.imss_es === 'ACTOR') return 'IMSS';

    return resumirPersonasConTipo(obtenerActoresNormalizados(caso));
}

function getActorNombreResumen(caso) {
    if (caso.imss_es === 'ACTOR') return 'IMSS';
    return resumirPersonasTexto(obtenerActoresNormalizados(caso));
}

function getDemandadosNombres(caso) {
    if (caso.imss_es === 'DEMANDADO') return 'IMSS';

    if (!caso.demandados || caso.demandados.length === 0) return 'N/A';

    return caso.demandados.map(d => {
        if (d.tipo_persona === 'FISICA') {
            return `${d.nombres} ${d.apellido_paterno}`;
        }
        return d.empresa;
    }).join(', ');
}

function getDemandadosNombresConTipo(caso) {
    if (caso.imss_es === 'DEMANDADO') return 'IMSS';

    return resumirPersonasConTipo(caso.demandados || []);
}

function getCodemandadosNombresConTipo(caso) {
    return resumirPersonasConTipo(caso.codemandados || []);
}

function getDemandadosNombresResumen(caso) {
    if (caso.imss_es === 'DEMANDADO') return 'IMSS';
    return resumirPersonasTexto(caso.demandados || []);
}

function getCodemandadosNombresResumen(caso) {
    return resumirPersonasTexto(caso.codemandados || []);
}

function obtenerActoresNormalizados(caso) {
    if (!caso) return [];
    if (Array.isArray(caso.actores)) return caso.actores;
    if (Array.isArray(caso.actor)) return caso.actor;
    if (caso.actor && caso.actor.tipo_persona) return [caso.actor];
    return [];
}

function obtenerNombreCortoPersona(persona) {
    if (!persona) return '';
    if (persona.tipo_persona === 'FISICA') {
        return `${persona.nombres || ''} ${persona.apellido_paterno || ''}`.trim();
    }
    return (persona.empresa || persona.nombre || '').trim();
}

function resumirPersonasTexto(personas) {
    if (!personas || personas.length === 0) return 'N/A';

    if (!RESUMIR_PERSONAS_EN_LISTADOS) {
        return personas.map(persona => obtenerNombreCortoPersona(persona) || 'N/A').join(', ');
    }

    const visibles = personas
        .slice(0, MAX_PERSONAS_EN_LISTADOS)
        .map(persona => obtenerNombreCortoPersona(persona) || 'N/A');

    const extras = personas.length - visibles.length;
    if (extras > 0) {
        visibles.push(`+${extras}`);
    }

    return visibles.join(', ');
}

function resumirPersonasConTipo(personas) {
    if (!personas || personas.length === 0) return 'N/A';

    if (!RESUMIR_PERSONAS_EN_LISTADOS) {
        return personas
            .map(persona => {
                const nombre = obtenerNombreCortoPersona(persona) || 'N/A';
                const tipo = persona.tipo_persona === 'FISICA' ? 'F' : 'M';
                return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
            })
            .join('<br>');
    }

    const visibles = personas
        .slice(0, MAX_PERSONAS_EN_LISTADOS)
        .map(persona => {
            const nombre = obtenerNombreCortoPersona(persona) || 'N/A';
            const tipo = persona.tipo_persona === 'FISICA' ? 'F' : 'M';
            return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
        });

    const extras = personas.length - visibles.length;
    if (extras > 0) {
        visibles.push(`<small style="color: var(--color-text-light); font-weight: 600;">+${extras}</small>`);
    }

    return visibles.join('<br>');
}

function getCodemandadosNombres(caso) {
    if (!caso.codemandados || caso.codemandados.length === 0) return '';

    return caso.codemandados.map(c => {
        if (c.tipo_persona === 'FISICA') {
            return `${c.nombres} ${c.apellido_paterno}`;
        }
        return c.empresa;
    }).join(', ');
}

function getPrestacionesTexto(caso) {
    // Nuevo modelo: prestacion_principal + prestaciones_secundarias
    let principalId = caso.prestacion_principal || null;
    let numSecundarias = 0;

    if (principalId) {
        numSecundarias = (caso.prestaciones_secundarias && caso.prestaciones_secundarias.length) || 0;
    } else if (caso.prestaciones_reclamadas && Array.isArray(caso.prestaciones_reclamadas)) {
        // Fallback formato anterior
        principalId = caso.prestaciones_reclamadas[0];
        numSecundarias = caso.prestaciones_reclamadas.length - 1;
    } else if (caso.prestacion_reclamada) {
        principalId = caso.prestacion_reclamada;
    }

    if (!principalId) return '-';

    const principal = catalogos.prestaciones.find(p => p.id === principalId);
    const nombrePrincipal = principal ? principal.nombre : 'Desconocida';

    if (numSecundarias > 0) {
        return `${nombrePrincipal} <span style="color: var(--color-text-light);">+${numSecundarias}</span>`;
    }
    return nombrePrincipal;
}

function obtenerNumeroExpediente(casoId) {
    const caso = todosLosCasos.find(c => c.id === casoId);
    return caso ? caso.numero_expediente : casoId;
}

function getBadgeClass(imssEs) {
    switch (imssEs) {
        case 'ACTOR': return 'badge-actor';
        case 'DEMANDADO': return 'badge-demandado';
        case 'TERCERO': return 'badge-tercero';
        default: return '';
    }
}

function verAcumulados(casoId) {
    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso || !caso.juicios_acumulados || caso.juicios_acumulados.length === 0) return;

    const casosAcumulados = caso.juicios_acumulados
        .map(id => todosLosCasos.find(c => c.id === id))
        .filter(Boolean);

    const html = casosAcumulados.map(c => `
        <div style="padding: 12px; border: 1px solid var(--color-border); border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <a href="detalleCaso.html?id=${c.id}" class="expediente-link" style="font-weight: 700;">
                    ${c.numero_expediente}
                </a>
                <span class="badge-mini badge-mini-concluido" title="Concluido">C</span>
            </div>
            <div style="font-size: 13px; color: var(--color-text-light);">
                <div>Actor: ${getActorNombreResumen(c)}</div>
                <div>Fecha: ${formatearFecha(c.fecha_inicio)}</div>
                <div>Importe: ${c.importe_demandado > 0 ? formatearMoneda(c.importe_demandado) : '-'}</div>
            </div>
        </div>
    `).join('');

    document.getElementById('listaAcumulados').innerHTML = html;
    document.getElementById('modalAcumulados').style.display = 'flex';
}

function cerrarModalAcumulados() {
    document.getElementById('modalAcumulados').style.display = 'none';
}

// =====================================================
// ACUMULACION desde menu de 3 puntos
// =====================================================
let casoAcumularId = null;

function abrirModalAcumular(casoId) {
    cerrarTodosLosMenus();
    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;

    casoAcumularId = casoId;
    document.getElementById('acumularExpediente').textContent = caso.numero_expediente;
    document.getElementById('acumularMateria').textContent = caso.tipo_juicio;

    const deleg = obtenerDelegacion(caso.delegacion_id);
    document.getElementById('acumularJSJ').textContent = deleg ? deleg.nombre : '---';

    // Limpiar busqueda y resultados
    document.getElementById('inputBuscarAcumular').value = '';
    document.getElementById('selectAcumularA').value = caso.acumulado_a || '';
    document.getElementById('resultadosAcumular').innerHTML = '<div style="padding: 12px; color: var(--color-text-light); text-align: center; font-size: 13px;">Escriba para buscar expedientes</div>';

    // Filtro JSJ: solo para admin
    const jsjFilterGroup = document.getElementById('acumularJSJFilterGroup');
    const selectJSJ = document.getElementById('selectAcumularJSJ');
    if (usuarioActual && usuarioActual.rol === 'admin') {
        jsjFilterGroup.style.display = 'block';
        selectJSJ.innerHTML = '<option value="">Todas las JSJ</option>';
        catalogos.delegaciones.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.id;
            opt.textContent = d.nombre;
            selectJSJ.appendChild(opt);
        });
        // Pre-seleccionar la JSJ del caso actual
        selectJSJ.value = caso.delegacion_id;
    } else {
        jsjFilterGroup.style.display = 'none';
    }

    // Si ya esta acumulado, mostrar el caso padre
    if (caso.acumulado_a) {
        const casoPadre = todosLosCasos.find(c => c.id === caso.acumulado_a);
        if (casoPadre) {
            document.getElementById('inputBuscarAcumular').value = casoPadre.numero_expediente;
            buscarExpedientesAcumular();
        }
    }

    document.getElementById('modalAcumular').style.display = 'flex';
}

function buscarExpedientesAcumular() {
    const caso = todosLosCasos.find(c => c.id === casoAcumularId);
    if (!caso) return;

    const termino = document.getElementById('inputBuscarAcumular').value.trim().toLowerCase();
    const contenedor = document.getElementById('resultadosAcumular');
    const hiddenInput = document.getElementById('selectAcumularA');

    if (termino.length < 2) {
        contenedor.innerHTML = '<div style="padding: 12px; color: var(--color-text-light); text-align: center; font-size: 13px;">Escriba al menos 2 caracteres</div>';
        return;
    }

    const fechaActual = caso.fecha_inicio ? new Date(caso.fecha_inicio) : null;
    const materiaActual = caso.tipo_juicio;

    // Determinar JSJ para filtrar
    let jsjFiltro = null;
    if (usuarioActual && usuarioActual.rol === 'admin') {
        const selectJSJ = document.getElementById('selectAcumularJSJ');
        jsjFiltro = selectJSJ.value ? parseInt(selectJSJ.value) : null;
    } else if (usuarioActual && usuarioActual.delegacion_id) {
        jsjFiltro = usuarioActual.delegacion_id;
    }

    const resultados = todosLosCasos.filter(c =>
        c.id !== caso.id &&
        c.estatus === 'TRAMITE' &&
        !c.acumulado_a &&
        c.tipo_juicio === materiaActual &&
        (!jsjFiltro || c.delegacion_id === jsjFiltro) &&
        fechaActual && c.fecha_inicio && new Date(c.fecha_inicio) < fechaActual &&
        (c.numero_expediente || '').toLowerCase().includes(termino)
    );

    if (resultados.length === 0) {
        contenedor.innerHTML = '<div style="padding: 12px; color: var(--color-text-light); text-align: center; font-size: 13px;">No se encontraron expedientes</div>';
        return;
    }

    const seleccionadoActual = hiddenInput.value;

    contenedor.innerHTML = resultados.slice(0, 10).map(c => {
        const actorNombre = getActorNombreResumen(c) || 'N/A';
        const delegNombre = obtenerDelegacion(c.delegacion_id);
        const isSelected = parseInt(seleccionadoActual) === c.id;
        return `
            <div onclick="seleccionarCasoAcumular(${c.id})"
                 style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid var(--color-border); ${isSelected ? 'background: #e8f5e9;' : ''}"
                 onmouseover="this.style.background='${isSelected ? '#c8e6c9' : '#f5f5f5'}'"
                 onmouseout="this.style.background='${isSelected ? '#e8f5e9' : ''}'">
                <div style="font-weight: 600; font-size: 14px;">${c.numero_expediente}</div>
                <div style="font-size: 12px; color: var(--color-text-light);">${actorNombre} - ${delegNombre ? delegNombre.nombre : ''}</div>
            </div>
        `;
    }).join('');
}

function seleccionarCasoAcumular(casoId) {
    const hiddenInput = document.getElementById('selectAcumularA');
    if (parseInt(hiddenInput.value) === casoId) {
        // Deseleccionar
        hiddenInput.value = '';
    } else {
        hiddenInput.value = casoId;
    }
    // Re-renderizar para mostrar seleccion
    buscarExpedientesAcumular();
}

function cerrarModalAcumular() {
    document.getElementById('modalAcumular').style.display = 'none';
    casoAcumularId = null;
}


async function guardarAcumulacion() {
    if (!casoAcumularId) return;

    const caso = todosLosCasos.find(c => c.id === casoAcumularId);
    if (!caso) return;

    const nuevoAcumuladoA = document.getElementById('selectAcumularA').value
        ? parseInt(document.getElementById('selectAcumularA').value)
        : null;

    if (nuevoAcumuladoA && caso.juicios_acumulados && caso.juicios_acumulados.length > 0) {
        await window.appAlert?.({
            title: 'No se puede acumular',
            message: [
                `El expediente ${caso.numero_expediente} ya acumula ${caso.juicios_acumulados.length} asunto(s).`,
                'Primero debe liberar esas acumulaciones.'
            ]
        });
        return;
    }

    try {
        await guardarAcumulacionCivilApi(nuevoAcumuladoA, casoAcumularId);
        cerrarModalAcumular();
        await cargarCasos();
        filtrarCasos();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: nuevoAcumuladoA
                ? 'Acumulacion actualizada correctamente.'
                : 'Acumulacion removida correctamente.'
        });
    } catch (error) {
        console.error('Error al guardar acumulacion:', error);
        await window.appAlert?.({
            title: 'No se pudo guardar la acumulación',
            message: error.message || 'Ocurrió un problema al guardar el cambio.'
        });
    }
}

function verDetalle(casoId) {
    // Redirigir a pagina de detalle
    window.location.href = `detalleCaso.html?id=${casoId}`;
}

function toggleMenu(casoId) {
    // Cerrar todos los demas menus y regresarlos a su contenedor
    document.querySelectorAll('.menu-dropdown.show').forEach(m => {
        if (m.id !== `menu-${casoId}`) {
            m.classList.remove('show');
            const origContainer = document.getElementById(`menu-container-${m.id.replace('menu-', '')}`);
            if (origContainer && m.parentElement === document.body) {
                origContainer.appendChild(m);
            }
        }
    });

    const menu = document.getElementById(`menu-${casoId}`);
    const boton = document.getElementById(`menu-trigger-${casoId}`);
    const isOpen = menu.classList.contains('show');

    if (isOpen) {
        // Cerrar y regresar al contenedor original
        menu.classList.remove('show');
        const origContainer = document.getElementById(`menu-container-${casoId}`);
        if (origContainer && menu.parentElement === document.body) {
            origContainer.appendChild(menu);
        }
        return;
    }

    // Mover el menu al body para escapar del stacking context del sticky
    document.body.appendChild(menu);
    menu.classList.add('show');

    // Obtener posicion del boton relativa al viewport
    const rectBtn = boton.getBoundingClientRect();

    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';

    const menuLeft = rectBtn.right - 150 - 10;
    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${rectBtn.bottom + 4}px`;
    menu.style.bottom = '';

    // Esperar render para medir y ajustar si se sale por abajo
    requestAnimationFrame(() => {
        const rectMenu = menu.getBoundingClientRect();
        const espacioAbajo = window.innerHeight - rectBtn.bottom;

        if (espacioAbajo < rectMenu.height + 8) {
            menu.style.top = `${rectBtn.top - rectMenu.height - 4}px`;
        }
    });
}

function editarCaso(casoId) {
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');
    
    // CAMBIO: Usar '?id=' en lugar de '?editar='
    window.location.href = `editarCaso.html?id=${casoId}`;
}

function actualizarSeguimiento(casoId) {
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    window.location.href = `actualizarCaso.html?id=${casoId}`;
}

function confirmarEliminar(casoId) {
    return window.confirmarEliminar(casoId);
}
// Funcion para cerrar todos los menus y regresarlos a su contenedor
function cerrarTodosLosMenus() {
    document.querySelectorAll('.menu-dropdown.show').forEach(m => {
        m.classList.remove('show');
        const id = m.id.replace('menu-', '');
        const origContainer = document.getElementById(`menu-container-${id}`);
        if (origContainer && m.parentElement === document.body) {
            origContainer.appendChild(m);
        }
    });
}

// Cerrar menus al hacer clic fuera
document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-container') && !e.target.closest('.menu-dropdown')) {
        cerrarTodosLosMenus();
    }
});

// Cerrar menus al hacer scroll (porque son position: fixed)
document.querySelector('.table-container')?.addEventListener('scroll', function () {
    cerrarTodosLosMenus();
});
window.addEventListener('scroll', function () {
    cerrarTodosLosMenus();
});

// =====================================================
// GRAFICA DE PRONOSTICO (DONA - Canvas puro)
// =====================================================
function renderizarGraficaPronostico() {
    const canvas = document.getElementById('chartPronostico');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const growMax = 5; // px que crece el segmento seleccionado
    const radius = size / 2 - growMax - 2; // radio base con margen para crecimiento
    const innerRadius = radius * 0.58;

    // Contar pronosticos: si hay filtro de estatus activo, usar todos los filtrados (ya vienen filtrados por estatus).
    // Si no hay filtro de estatus, filtrar solo TRAMITE como comportamiento por defecto.
    const datosFuente = casosFiltrados && casosFiltrados.length >= 0 ? casosFiltrados : todosLosCasos;
    const tramites = estadoFiltros.filtroEstatus ? datosFuente : datosFuente.filter(c => c.estatus === 'TRAMITE');
    let favorable = 0;
    let desfavorable = 0;
    let sinPronostico = 0;

    tramites.forEach(c => {
        const pron = normalizarPronostico(c.pronostico || (c.seguimiento && c.seguimiento.pronostico));
        if (pron === 'FAVORABLE') favorable++;
        else if (pron === 'DESFAVORABLE') desfavorable++;
        else sinPronostico++;
    });

    // Guardar datos de segmentos para hacer la dona clickeable
    window.datosDonaSegmentos = [];

    const datos = [
        { label: 'Favorable', valor: favorable, color: '#2A5C4B' },
        { label: 'Desfavorable', valor: desfavorable, color: '#911034' },
        { label: 'Sin Pronóstico', valor: sinPronostico, color: '#EDF1F5' }
    ];

    const totalDatos = favorable + desfavorable + sinPronostico;
    const frame = canvas.closest('.grafica-canvas-frame');
    const centerValue = frame?.querySelector('.grafica-canvas-center-value');
    const centerLabel = frame?.querySelector('.grafica-canvas-center-label');

    if (frame) {
        if (totalDatos === 0) {
            frame.style.setProperty('--chart-visual', 'conic-gradient(#e5e7eb 0 100%)');
        } else {
            const favorablePct = (favorable / totalDatos) * 100;
            const desfavorablePct = (desfavorable / totalDatos) * 100;
            const sinPronosticoPct = 100 - favorablePct - desfavorablePct;
            frame.style.setProperty(
                '--chart-visual',
                `conic-gradient(#2A5C4B 0 ${favorablePct}%, #911034 ${favorablePct}% ${favorablePct + desfavorablePct}%, #edf1f5 ${favorablePct + desfavorablePct}% ${favorablePct + desfavorablePct + sinPronosticoPct}%)`
            );
        }
    }

    if (centerValue) {
        centerValue.textContent = String(totalDatos);
    }

    if (centerLabel) {
        centerLabel.textContent = totalDatos === 0
            ? 'Sin datos'
            : (estadoFiltros.filtroEstatus === 'CONCLUIDO' ? 'concluidos' : 'tramites');
    }

    // Limpiar canvas
    ctx.clearRect(0, 0, size, size);

    if (totalDatos === 0) {
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = '#999';
        ctx.font = '11px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Sin datos', center, center + 4);
    } else {
        let startAngle = -Math.PI / 2;
        let segIndex = 0;

        // Primera pasada: construir segmentos y dibujar segmentos normales
        const segsToDraw = [];
        datos.forEach(d => {
            if (d.valor === 0) return;
            const sliceAngle = (d.valor / totalDatos) * Math.PI * 2;
            const filtroValor = d.label === 'Favorable' ? 'FAVORABLE' : d.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_PRONOSTICO';
            const isSelected = filtroPronosticoDona === filtroValor;
            const isHovered = window.hoveredDonaSegment === segIndex;

            segsToDraw.push({
                label: d.label,
                valor: d.valor,
                color: d.color,
                startAngle: startAngle,
                endAngle: startAngle + sliceAngle,
                sliceAngle: sliceAngle,
                filtroValor: filtroValor,
                isSelected: isSelected,
                isHovered: isHovered,
                index: segIndex
            });

            // Guardar segmento para click/hover interactivo
            window.datosDonaSegmentos.push({
                label: d.label,
                startAngle: startAngle,
                endAngle: startAngle + sliceAngle,
                color: d.color,
                valor: d.valor
            });

            startAngle += sliceAngle;
            segIndex++;
        });

        // Determinar si hay algun segmento seleccionado para atenuar los demas
        const haySeleccion = segsToDraw.some(s => s.isSelected);

        // Dibujar cada segmento: seleccionado/hover crece en radio (no se desplaza)
        segsToDraw.forEach(seg => {
            let drawRadius = radius;

            if (seg.isSelected) {
                drawRadius = radius + 5;
            } else if (seg.isHovered) {
                drawRadius = radius + 3;
            }

            ctx.save();

            // Atenuar segmentos no seleccionados cuando hay seleccion activa
            if (haySeleccion && !seg.isSelected) {
                ctx.globalAlpha = 0.35;
            }

            // Sombra sutil para segmento seleccionado
            if (seg.isSelected) {
                ctx.shadowColor = seg.color;
                ctx.shadowBlur = 6;
            }

            ctx.fillStyle = seg.color;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, drawRadius, seg.startAngle, seg.endAngle);
            ctx.closePath();
            ctx.fill();

            // Borde blanco para segmento seleccionado
            if (seg.isSelected) {
                ctx.shadowBlur = 0;
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(center, center);
                ctx.arc(center, center, drawRadius, seg.startAngle, seg.endAngle);
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        });

        // Recortar centro (dona)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Funcion auxiliar: dibujar texto que quepa en el centro
        const maxTextWidth = innerRadius * 1.7; // ancho maximo disponible
        function fitText(text, baseFontSize, bold) {
            let fontSize = baseFontSize;
            const prefix = bold ? 'bold ' : '';
            while (fontSize > 5) {
                ctx.font = prefix + fontSize + 'px Montserrat, sans-serif';
                if (ctx.measureText(text).width <= maxTextWidth) break;
                fontSize--;
            }
            return fontSize;
        }

        // Centro de la dona: prioridad hover > seleccion > default
        const hoveredSeg = segsToDraw.find(s => s.isHovered);
        const selectedSeg = segsToDraw.find(s => s.isSelected);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (hoveredSeg) {
            // Hover: valor + etiqueta del segmento con su color
            ctx.fillStyle = hoveredSeg.color;
            fitText(String(hoveredSeg.valor), 16, true);
            ctx.fillText(hoveredSeg.valor, center, center - 6);

            ctx.fillStyle = '#555';
            fitText(hoveredSeg.label, 9, false);
            ctx.fillText(hoveredSeg.label, center, center + 8);
        } else if (selectedSeg) {
            // Seleccion activa: valor + etiqueta del segmento seleccionado
            ctx.fillStyle = selectedSeg.color;
            fitText(String(selectedSeg.valor), 18, true);
            ctx.fillText(selectedSeg.valor, center, center - 6);

            ctx.fillStyle = selectedSeg.color;
            fitText(selectedSeg.label, 9, true);
            ctx.fillText(selectedSeg.label, center, center + 9);
        } else {
            // Default: total general
            ctx.fillStyle = '#333';
            fitText(String(totalDatos), 18, true);
            ctx.fillText(totalDatos, center, center - 3);

            ctx.fillStyle = '#888';
            const centerLabel = estadoFiltros.filtroEstatus === 'CONCLUIDO' ? 'concluidos' : 'tramites';
            fitText(centerLabel, 9, false);
            ctx.fillText(centerLabel, center, center + 10);
        }
    }

    // Actualizar etiqueta dinÃ¡mica de la grafica segÃºn filtro de estatus
    const graficaLabel = document.querySelector('.grafica-label');
    if (graficaLabel) {
        if (estadoFiltros.filtroEstatus === 'CONCLUIDO') {
            graficaLabel.textContent = 'Pronóstico de Asuntos Concluidos';
        } else {
            graficaLabel.textContent = 'Pronóstico de Asuntos en Trámite';
        }
    }

    // Leyenda (clickeable con feedback visual fuerte)
    const leyenda = document.getElementById('leyendaPronostico');
    if (leyenda) {
        const hayFiltroActivo = !!filtroPronosticoDona;
        leyenda.innerHTML = datos.map(d => {
            const filtroValor = d.label === 'Favorable' ? 'FAVORABLE' : d.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_PRONOSTICO';
            const activo = filtroPronosticoDona === filtroValor;
            const inactivo = hayFiltroActivo && !activo;

            let estiloItem = 'cursor: pointer; padding: 4px 8px; border-radius: 6px; transition: all 0.2s;';
            if (activo) {
                estiloItem += ` font-weight: bold; text-decoration: underline; background: ${d.color}22; border-left: 3px solid ${d.color};`;
            } else if (inactivo) {
                estiloItem += ' opacity: 0.4;';
            }

            const estiloTexto = activo ? `color: ${d.color}; font-weight: bold;` : '';
            const estiloValor = activo ? `color: ${d.color}; font-weight: bold; font-size: 1.05em;` : '';

            return `
            <div class="leyenda-item ${activo ? 'leyenda-activa' : ''}" style="${estiloItem}" onclick="clickDonaFiltro('${filtroValor}')">
                <span class="leyenda-color" style="background: ${d.color}; ${activo ? 'transform: scale(1.3); box-shadow: 0 0 4px ' + d.color + ';' : ''}"></span>
                <span class="leyenda-texto" style="${estiloTexto}">${d.label}</span>
                <span class="leyenda-valor" style="${estiloValor}">${d.valor}</span>
            </div>
        `;
        }).join('');
    }

    // Indicador de filtro activo
    if (filtroPronosticoDona) {
        const labelFiltro = filtroPronosticoDona === 'FAVORABLE' ? 'Favorable' : filtroPronosticoDona === 'DESFAVORABLE' ? 'Desfavorable' : 'Sin Pronóstico';
        const indicador = document.getElementById('indicadorFiltroDona');
        if (indicador) {
            indicador.style.display = 'block';
            indicador.innerHTML = `Filtrando: <strong>${labelFiltro}</strong> <button onclick="limpiarFiltroDona()" style="border:none;background:none;color:var(--color-danger);cursor:pointer;font-weight:bold;">[x]</button>`;
        }
    } else {
        const indicador = document.getElementById('indicadorFiltroDona');
        if (indicador) indicador.style.display = 'none';
    }
}

// Click en la dona (canvas)
function inicializarClickDona() {
    const canvas = document.getElementById('chartPronostico');
    if (!canvas) return;

    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const center = canvas.width / 2;
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = canvas.width / 2 - 7;
        const innerRadius = radius * 0.58;

        // Solo aceptar click en el area de la dona (incluye zona de crecimiento)
        if (dist < innerRadius || dist > radius + 5) return;

        // Calcular angulo del click
        let angle = Math.atan2(dy, dx);
        if (angle < -Math.PI / 2) angle += Math.PI * 2;

        // Buscar segmento
        const segmentos = window.datosDonaSegmentos || [];
        for (const seg of segmentos) {
            if (angle >= seg.startAngle && angle < seg.endAngle) {
                const filtroValor = seg.label === 'Favorable' ? 'FAVORABLE' : seg.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_PRONOSTICO';
                clickDonaFiltro(filtroValor);
                break;
            }
        }
    });

    // Hover: detectar segmento bajo el mouse y re-renderizar con efecto visual
    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const center = canvas.width / 2;
        const dx = x - center;
        const dy = y - center;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = canvas.width / 2 - 7;
        const innerRadius = radius * 0.58;

        let newHovered = -1;

        if (dist >= innerRadius && dist <= radius + 5) {
            let angle = Math.atan2(dy, dx);
            if (angle < -Math.PI / 2) angle += Math.PI * 2;

            const segmentos = window.datosDonaSegmentos || [];
            for (let i = 0; i < segmentos.length; i++) {
                if (angle >= segmentos[i].startAngle && angle < segmentos[i].endAngle) {
                    newHovered = i;
                    break;
                }
            }
        }

        // Actualizar cursor
        canvas.style.cursor = newHovered >= 0 ? 'pointer' : 'default';

        // Solo re-renderizar si cambiÃ³ el segmento hovered
        if (newHovered !== window.hoveredDonaSegment) {
            window.hoveredDonaSegment = newHovered;
            renderizarGraficaPronostico();
        }
    });

    // Resetear hover al salir del canvas
    canvas.addEventListener('mouseleave', function () {
        canvas.style.cursor = 'default';
        if (window.hoveredDonaSegment !== -1) {
            window.hoveredDonaSegment = -1;
            renderizarGraficaPronostico();
        }
    });
}

function clickDonaFiltro(valor) {
    // Toggle: si ya estÃ¡ seleccionado, limpiar
    if (filtroPronosticoDona === valor) {
        filtroPronosticoDona = '';
        // Si el estatus fue auto-asignado por la dona, limpiarlo al desactivar el filtro de dona
        if (estatusAutoSetByDona) {
            estatusAutoSetByDona = false;
            seleccionarFiltro('filtroEstatus', '', '');
            return; // seleccionarFiltro ya llama a filtrarCasos
        }
    } else {
        filtroPronosticoDona = valor;
        // Si no hay filtro de estatus activo, auto-asignar TRAMITE para contexto
        if (!estadoFiltros.filtroEstatus) {
            estatusAutoSetByDona = true;
            seleccionarFiltro('filtroEstatus', 'TRAMITE', 'Trámite');
            return; // seleccionarFiltro ya llama a filtrarCasos
        }
    }
    filtrarCasos();
}

function limpiarFiltroDona() {
    filtroPronosticoDona = '';
    // Si el estatus fue auto-asignado por la dona, limpiarlo tambiÃ©n
    if (estatusAutoSetByDona) {
        estatusAutoSetByDona = false;
        seleccionarFiltro('filtroEstatus', '', '');
        return; // seleccionarFiltro ya llama a filtrarCasos
    }
    filtrarCasos();
}

function actualizarContadores() {
    const datosFuente = casosFiltrados && casosFiltrados.length >= 0 ? casosFiltrados : todosLosCasos;
    const total = datosFuente.length;
    const activos = datosFuente.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = datosFuente.filter(c => c.estatus === 'CONCLUIDO').length;

    // Validamos que existan los elementos antes de asignarles valor para evitar errores
    const elTotal = document.getElementById('totalCasos');
    const elActivos = document.getElementById('casosTramite');
    const elConcluidos = document.getElementById('casosConcluidos');

    if (elTotal) elTotal.textContent = total;
    if (elActivos) elActivos.textContent = activos;
    if (elConcluidos) elConcluidos.textContent = concluidos;
}

// =====================================================
// ACTIVIDAD RECIENTE
// =====================================================

/**
 * Formatea una fecha como tiempo relativo ("hace 2 horas", "hace 3 dÃ­as", etc.)
 */
function formatearFechaRelativa(fechaStr) {
    if (!fechaStr) return '-';

    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHoras = Math.floor(diffMs / 3600000);
    const diffDias = Math.floor(diffMs / 86400000);
    const diffSemanas = Math.floor(diffDias / 7);
    const diffMeses = Math.floor(diffDias / 30);

    if (diffMin < 1) return 'Justo ahora';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHoras < 24) return `Hace ${diffHoras}h`;
    if (diffDias === 1) return 'Ayer';
    if (diffDias < 7) return `Hace ${diffDias} días`;
    if (diffMeses < 1) return `Hace ${Math.max(diffSemanas, 1)} sem`;
    if (diffMeses < 12) return `Hace ${diffMeses} mes${diffMeses > 1 ? 'es' : ''}`;
    return formatearFecha(fechaStr);
}

function formatearMoneda(valor) {
    const numero = Number(valor);
    if (!Number.isFinite(numero)) return '$0.00';

    return numero.toLocaleString('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

/**
 * Determina si un caso fue editado (su fecha_actualizacion difiere de fecha_creacion)
 */
function fueEditado(caso) {
    if (!caso.fecha_actualizacion || !caso.fecha_creacion) return false;
    // Considerar "editado" si hay mas de 1 minuto de diferencia
    const diff = Math.abs(new Date(caso.fecha_actualizacion) - new Date(caso.fecha_creacion));
    return diff > 60000;
}

/**
 * Renderiza la seccion de "Actividad Reciente" con los 5 Ãºltimos casos nuevos/editados
 */
function renderizarActividadReciente() {
    const contenedor = document.getElementById('actividadReciente');
    if (!contenedor) return;

    // Ordenar todos los casos por fecha_actualizacion descendente
    const casosOrdenados = [...todosLosCasos].sort((a, b) => {
        const fechaA = a.fecha_actualizacion || a.fecha_creacion || '';
        const fechaB = b.fecha_actualizacion || b.fecha_creacion || '';
        return new Date(fechaB) - new Date(fechaA);
    });

    // Tomar los Ãºltimos 5
    const recientes = casosOrdenados.slice(0, 5);

    if (recientes.length === 0) {
        contenedor.innerHTML = '<p style="color: var(--color-text-light); text-align: center;">Sin actividad reciente</p>';
        return;
    }

    contenedor.innerHTML = recientes.map(caso => {
        const editado = fueEditado(caso);
        const tipoActividad = editado ? 'Editado' : 'Nuevo';
        const iconoActividad = editado ? '' : '';
        const claseActividad = editado ? 'actividad-editado' : 'actividad-nuevo';
        const fechaRelativa = formatearFechaRelativa(caso.fecha_actualizacion || caso.fecha_creacion);
        const actorNombre = getActorNombreResumen(caso) || 'IMSS';

        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge-mini badge-mini-tramite" title="En Tramite">T</span>'
            : '<span class="badge-mini badge-mini-concluido" title="Concluido">C</span>';

        return `
            <div class="actividad-item ${claseActividad}" onclick="verDetalle(${caso.id})" style="cursor: pointer;">
                <div class="actividad-icono">${iconoActividad}</div>
                <div class="actividad-contenido">
                    <div class="actividad-header">
                        <strong>${caso.numero_expediente}</strong>
                        ${badgeEstatus}
                    </div>
                    <div class="actividad-detalle">
                        <span>${caso.tipo_juicio} Â· ${actorNombre}</span>
                    </div>
                </div>
                <div class="actividad-meta">
                    <span class="actividad-tipo-badge ${claseActividad}-badge">${tipoActividad}</span>
                    <span class="actividad-tiempo">${fechaRelativa}</span>
                </div>
            </div>
        `;
    }).join('');
}

window.confirmarEliminar = async function (casoId) {
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;

    if (caso.juicios_acumulados && caso.juicios_acumulados.length > 0) {
        await window.appAlert?.({
            title: 'No se puede eliminar',
            message: `El expediente ${caso.numero_expediente} tiene ${caso.juicios_acumulados.length} asunto(s) acumulado(s).\n\nDebe desacumularlos primero.`
        });
        return;
    }

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar expediente',
        message: `¿Estás seguro de eliminar el expediente ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) {
        return;
    }

    try {
        await eliminarCasoCivilApi(casoId);
        await cargarCasos();
        filtrarCasos();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Asunto eliminado exitosamente.'
        });
    } catch (error) {
        console.error('Error al eliminar caso:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar el asunto',
            message: error.message || 'Ocurrió un problema al eliminar el asunto.'
        });
    }
};












