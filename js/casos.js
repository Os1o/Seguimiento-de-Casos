// =====================================================
// CASOS.JS - Gestión de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;
let usuarioActual = null;
let filtroPronosticoDona = ''; // Filtro activo desde click en la dona
let estatusAutoSetByDona = false; // Indica si el filtro de estatus fue auto-asignado por click en la dona
window.hoveredDonaSegment = -1; // Índice del segmento de dona actualmente bajo hover

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(usuarioStr);
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function () {
    // Verificar sesión
    const usuario = verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;

    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Mostrar badge de rol
    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    // Mostrar JSJ del usuario
    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD && usuario.delegacion_id) {
        const deleg = obtenerDelegacion(usuario.delegacion_id);
        if (deleg) infoOOAD.textContent = deleg.nombre;
    } else if (infoOOAD && (usuario.rol === 'admin' || !usuario.delegacion_id)) {
        infoOOAD.textContent = 'Todas las JSJ';
    }

    // Mostrar/ocultar enlace de admin
    const linkAdmin = document.getElementById('linkAdmin');
    if (linkAdmin && usuario.rol === 'admin') {
        linkAdmin.style.display = '';
    }

    // Ocultar botón "Nuevo Registro" para rol consulta
    if (usuario.rol === 'consulta') {
        const btnNuevo = document.getElementById('btnNuevoRegistro');
        if (btnNuevo) btnNuevo.style.display = 'none';
    }

    // Ocultar pestaña Penal si no tiene permiso
    if (!usuario.permiso_penal && usuario.rol !== 'admin') {
        const linkPenal = document.getElementById('linkPenal');
        if (linkPenal) linkPenal.style.display = 'none';
    }

    // Ocultar filtro de delegación para usuarios con JSJ fija (ya está filtrado por su JSJ)
    // Si no tiene delegacion_id (ej. consulta global), dejar el filtro visible
    if (usuario.rol !== 'admin' && usuario.delegacion_id) {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">JSJ</span>';
        }
    }

    // Cargar casos (fake o localStorage)
    cargarCasos();

    // Inicializar click en dona
    inicializarClickDona();

    // Filtros ahora son reactivos (se calculan dinámicamente en toggleFiltro)

    // Event listeners para búsqueda
    document.getElementById('searchInput').addEventListener('input', filtrarCasos);

    // Mostrar casos
    filtrarCasos();
});

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';

    // Resetear flag de auto-set por dona
    estatusAutoSetByDona = false;

    // Resetear estado
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');

    // Restaurar etiquetas de botones
    document.querySelectorAll('.filtro-btn-custom').forEach(btn => {
        btn.innerHTML = `<span class="filtro-btn-nombre">${btn.dataset.nombre} <span class="filtro-flecha">&#9660;</span></span>`;
        btn.classList.remove('filtro-activo');
    });

    cerrarTodosLosFiltros();
    filtrarCasos();
}


function cargarCasos() {
    const casosGuardados = localStorage.getItem('casos');
    let todosLosCasosSinFiltro;

    if (casosGuardados) {
        todosLosCasosSinFiltro = JSON.parse(casosGuardados);
    } else {
        todosLosCasosSinFiltro = (typeof casosFake !== 'undefined' ? [...casosFake] : []);
    }

    // Asegurar que todos los casos tengan fecha_actualizacion
    todosLosCasosSinFiltro.forEach(caso => {
        if (!caso.fecha_actualizacion) {
            caso.fecha_actualizacion = caso.fecha_creacion || new Date().toISOString();
        }
    });

    // Guardar en localStorage con las fechas asignadas
    localStorage.setItem('casos', JSON.stringify(todosLosCasosSinFiltro));

    // Filtrar por JSJ del usuario (si no es admin)
    if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        todosLosCasos = todosLosCasosSinFiltro.filter(c => c.delegacion_id === usuarioActual.delegacion_id);
    } else {
        todosLosCasos = todosLosCasosSinFiltro;
    }

    // Ordenar por fecha_actualizacion descendente (más reciente primero)
    todosLosCasos.sort((a, b) => new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion));

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

// Opciones de cada filtro
const opcionesFiltros = {
    filtroDelegacion: [], // Se llena dinámicamente
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

    // Calcular posición del botón en pantalla (fixed, sin scroll)
    const rect = boton.getBoundingClientRect();
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';

    // FILTROS REACTIVOS: calcular opciones disponibles según los otros filtros activos
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
            const pron = caso.pronostico || (caso.seguimiento && caso.seguimiento.pronostico) || null;
            if (filtroPronosticoDona === 'FAVORABLE') cumplePronostico = pron === 'FAVORABLE';
            else if (filtroPronosticoDona === 'DESFAVORABLE') cumplePronostico = pron === 'DESFAVORABLE';
            else if (filtroPronosticoDona === 'SIN_PRONOSTICO') cumplePronostico = !pron;
        }

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS && cumplePronostico;
    });

    // Extraer valores únicos con conteo para el filtro actual
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
        btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span><span class="filtro-valor-badge">${etiqueta}</span>`;
        btn.classList.add('filtro-activo');
    } else {
        btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span>`;
        btn.classList.remove('filtro-activo');
    }

    cerrarTodosLosFiltros();
    filtrarCasos();
}

// Clic afuera cierra el panel
document.addEventListener('click', function (e) {
    if (!e.target.closest('.th-filtrable') && !e.target.closest('#filtroPanel')) {
        cerrarTodosLosFiltros();
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
            // Protecciones añadidas: ( ... || '')
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const actorNombre = (getActorNombre(caso) || '').toLowerCase();
            const demandadosNombre = (getDemandadosNombres(caso) || '').toLowerCase();

            cumpleBusqueda = expediente.includes(searchTerm) ||
                actorNombre.includes(searchTerm) ||
                demandadosNombre.includes(searchTerm);
        }

        const cumpleDelegacion = !delegacionId || caso.delegacion_id == delegacionId;
        const cumpleEstatus = !estatus || caso.estatus === estatus;
        const cumpleTipo = !tipo || caso.tipo_juicio === tipo;
        const cumpleJurisdiccion = !jurisdiccion || caso.jurisdiccion === jurisdiccion;
        const cumplePosicionIMSS = !posicionIMSS || caso.imss_es === posicionIMSS;

        // Filtro de pronóstico (desde click en dona)
        let cumplePronostico = true;
        if (filtroPronosticoDona) {
            const pron = caso.pronostico || (caso.seguimiento && caso.seguimiento.pronostico) || null;
            if (filtroPronosticoDona === 'FAVORABLE') cumplePronostico = pron === 'FAVORABLE';
            else if (filtroPronosticoDona === 'DESFAVORABLE') cumplePronostico = pron === 'DESFAVORABLE';
            else if (filtroPronosticoDona === 'SIN_PRONOSTICO') cumplePronostico = !pron;
        }

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS && cumplePronostico;
    });

    // Ordenar por fecha_actualizacion descendente (más reciente primero)
    casosFiltrados.sort((a, b) => {
        const fechaA = a.fecha_actualizacion || a.fecha_creacion || '';
        const fechaB = b.fecha_actualizacion || b.fecha_creacion || '';
        return new Date(fechaB) - new Date(fechaA);
    });

    paginaActual = 1;
    actualizarEstadisticas();
    renderizarTabla();
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

    // Calcular página
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

        // Tribunal con prefijo de jurisdicción (sin color)
        const tribunal = catalogos.tribunales.find(t => t.id === caso.tribunal_id);
        const prefJurisdiccion = caso.jurisdiccion === 'FEDERAL' ? '<small class="tag-jurisdiccion">(F)</small>' : '<small class="tag-jurisdiccion">(L)</small>';
        const tribunalNombre = tribunal ? `${prefJurisdiccion} ${tribunal.nombre}` : '-';

        // Badge estatus compacto con tooltip
        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge-mini badge-mini-tramite" title="En Trámite">T</span>'
            : '<span class="badge-mini badge-mini-concluido" title="Concluido">C</span>';

        return `
            <tr>
                <td><small>${delegacion ? delegacion.nombre : 'N/A'}</small></td>
                <td>${badgeEstatus}</td>
                <td>
                    <a href="#" class="expediente-link" onclick="verDetalle(${caso.id}); return false;">
                        <strong>${caso.numero_expediente}</strong>
                    </a>
                    ${caso.acumulado_a ? '<br><small style="color: var(--color-text-light);">↳ ' + obtenerNumeroExpediente(caso.acumulado_a) + '</small>' : ''}
                </td>
                <td>
                    <span style="font-weight: 600;">${caso.tipo_juicio}</span><br>
                    <small style="color: var(--color-text-light);">${caso.subtipo_juicio || ''}${caso.sub_subtipo_juicio ? ' - ' + caso.sub_subtipo_juicio : ''}</small>
                </td>
                <td>${tribunalNombre}</td>
                <td>${formatearFecha(caso.fecha_inicio)}</td>
                <td>${actorNombre}</td>
                <td>${demandadosNombres}</td>
                <td>${codemandadosNombres}</td>
                <td><small>${getPrestacionesTexto(caso)}</small></td>
                <td><strong>${caso.importe_demandado > 0 ? formatearMoneda(caso.importe_demandado) : 'Sin cuantía'}</strong></td>
                <td>
                    <span class="badge ${getBadgeClass(caso.imss_es)}">
                        ${caso.imss_es}
                    </span>
                </td>
                <td>
                    ${caso.juicios_acumulados && caso.juicios_acumulados.length > 0
                ? `<button onclick="verAcumulados(${caso.id})" class="btn-link">${caso.juicios_acumulados.length} casos</button>`
                : '-'
            }
                </td>
                <td><small>${formatearFechaRelativa(caso.fecha_actualizacion || caso.fecha_creacion)}</small></td>
                <td class="td-sticky-right">
                    <div class="menu-container" id="menu-container-${caso.id}">
                        <button class="menu-trigger" onclick="toggleMenu(${caso.id})" id="menu-trigger-${caso.id}">
                            ⋮
                        </button>
                        <div class="menu-dropdown" id="menu-${caso.id}">
                            <div class="menu-item" onclick="verDetalle(${caso.id})">
                                Ver detalle
                            </div>
                            ${usuarioActual && usuarioActual.rol === 'admin' ? `
                            <div class="menu-item" onclick="editarCaso(${caso.id})">
                                Editar datos
                            </div>` : ''}
                            ${usuarioActual && usuarioActual.rol !== 'consulta' ? `
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                Actualizar seguimiento
                            </div>
                            <div class="menu-item" onclick="abrirModalAcumular(${caso.id})">
                                Acumular
                            </div>` : ''}
                            ${usuarioActual && usuarioActual.rol === 'admin' ? `
                            <div class="menu-item danger" onclick="confirmarEliminar(${caso.id})">
                                Eliminar
                            </div>` : ''}
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');

    // Renderizar controles de paginación
    renderizarPaginacion(totalPaginas);
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
    contenedor.innerHTML = `
        <span class="paginacion-info">Mostrando ${inicio}–${fin} de ${casosFiltrados.length} registros</span>
        <div class="paginacion-controles">
            <button class="paginacion-btn" onclick="irAPagina(1)" ${paginaActual === 1 ? 'disabled' : ''}>«</button>
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>‹ Anterior</button>
            <span class="paginacion-pagina">Página ${paginaActual} de ${totalPaginas}</span>
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>Siguiente ›</button>
            <button class="paginacion-btn" onclick="irAPagina(${totalPaginas})" ${paginaActual === totalPaginas ? 'disabled' : ''}>»</button>
        </div>
    `;
}

function irAPagina(pagina) {
    const totalPaginas = Math.ceil(casosFiltrados.length / REGISTROS_POR_PAGINA);
    if (pagina < 1 || pagina > totalPaginas) return;
    paginaActual = pagina;
    renderizarTabla();
    document.querySelector('.table-container').scrollTop = 0;
}

function getActorNombre(actorOrCaso) {
    // Compatibilidad: acepta un caso o un actor directamente
    let actores;
    if (actorOrCaso && actorOrCaso.imss_es) {
        // Es un caso
        if (actorOrCaso.imss_es === 'ACTOR') return 'IMSS';
        actores = actorOrCaso.actores || (actorOrCaso.actor ? [actorOrCaso.actor] : []);
    } else if (actorOrCaso && actorOrCaso.tipo_persona) {
        actores = [actorOrCaso];
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

function getActorNombreConTipo(caso) {
    if (caso.imss_es === 'ACTOR') return 'IMSS';

    const actores = caso.actores || (caso.actor ? [caso.actor] : []);
    if (actores.length === 0) return 'N/A';

    return actores.map(a => {
        const nombre = a.tipo_persona === 'FISICA'
            ? `${a.nombres} ${a.apellido_paterno}`
            : a.empresa;
        const tipo = a.tipo_persona === 'FISICA' ? 'F' : 'M';
        return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
    }).join('<br>');
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

    if (!caso.demandados || caso.demandados.length === 0) return 'N/A';

    return caso.demandados.map(d => {
        const nombre = d.tipo_persona === 'FISICA'
            ? `${d.nombres} ${d.apellido_paterno}`
            : d.empresa;
        const tipo = d.tipo_persona === 'FISICA' ? 'F' : 'M';
        return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
    }).join('<br>');
}

function getCodemandadosNombresConTipo(caso) {
    if (!caso.codemandados || caso.codemandados.length === 0) return 'N/A';

    return caso.codemandados.map(c => {
        const nombre = c.tipo_persona === 'FISICA'
            ? `${c.nombres} ${c.apellido_paterno}`
            : c.empresa;
        const tipo = c.tipo_persona === 'FISICA' ? 'F' : 'M';
        return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
    }).join('<br>');
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
                <div>Actor: ${getActorNombre(c)}</div>
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
// ACUMULACIÓN desde menú de 3 puntos
// =====================================================
let casoAcumularId = null;

function abrirModalAcumular(casoId) {
    cerrarTodosLosMenus();
    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : [];
    const caso = casos.find(c => c.id === casoId);
    if (!caso) return;

    casoAcumularId = casoId;
    document.getElementById('acumularExpediente').textContent = caso.numero_expediente;
    document.getElementById('acumularMateria').textContent = caso.tipo_juicio;

    const deleg = obtenerDelegacion(caso.delegacion_id);
    document.getElementById('acumularJSJ').textContent = deleg ? deleg.nombre : '---';

    // Limpiar búsqueda y resultados
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

    // Si ya está acumulado, mostrar el caso padre
    if (caso.acumulado_a) {
        const casoPadre = casos.find(c => c.id === caso.acumulado_a);
        if (casoPadre) {
            document.getElementById('inputBuscarAcumular').value = casoPadre.numero_expediente;
            buscarExpedientesAcumular();
        }
    }

    document.getElementById('modalAcumular').style.display = 'flex';
}

function buscarExpedientesAcumular() {
    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : [];
    const caso = casos.find(c => c.id === casoAcumularId);
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

    const resultados = casos.filter(c =>
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
        const actorNombre = getActorNombre(c) || 'N/A';
        const delegNombre = obtenerDelegacion(c.delegacion_id);
        const isSelected = parseInt(seleccionadoActual) === c.id;
        return `
            <div onclick="seleccionarCasoAcumular(${c.id})"
                 style="padding: 10px 12px; cursor: pointer; border-bottom: 1px solid var(--color-border); ${isSelected ? 'background: #e8f5e9;' : ''}"
                 onmouseover="this.style.background='${isSelected ? '#c8e6c9' : '#f5f5f5'}'"
                 onmouseout="this.style.background='${isSelected ? '#e8f5e9' : ''}'">
                <div style="font-weight: 600; font-size: 14px;">${c.numero_expediente}</div>
                <div style="font-size: 12px; color: var(--color-text-light);">${actorNombre} · ${delegNombre ? delegNombre.nombre : ''}</div>
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
    // Re-renderizar para mostrar selección
    buscarExpedientesAcumular();
}

function cerrarModalAcumular() {
    document.getElementById('modalAcumular').style.display = 'none';
    casoAcumularId = null;
}

function guardarAcumulacion() {
    if (!casoAcumularId) return;

    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    const caso = casos.find(c => c.id === casoAcumularId);
    if (!caso) return;

    const acumuladoAnterior = caso.acumulado_a;
    const nuevoAcumuladoA = document.getElementById('selectAcumularA').value
        ? parseInt(document.getElementById('selectAcumularA').value)
        : null;

    // Actualizar acumulación
    caso.acumulado_a = nuevoAcumuladoA;
    caso.fecha_actualizacion = new Date().toISOString();

    // Cambiar estatus
    if (nuevoAcumuladoA) {
        caso.estatus = 'CONCLUIDO';
    } else if (acumuladoAnterior && !nuevoAcumuladoA) {
        caso.estatus = 'TRAMITE';
    }

    // Quitar del padre anterior si cambió
    if (acumuladoAnterior && acumuladoAnterior !== nuevoAcumuladoA) {
        const padreAnterior = casos.find(c => c.id === acumuladoAnterior);
        if (padreAnterior && padreAnterior.juicios_acumulados) {
            padreAnterior.juicios_acumulados = padreAnterior.juicios_acumulados.filter(id => id !== casoAcumularId);
        }
    }

    // Agregar al nuevo padre
    if (nuevoAcumuladoA) {
        const padreNuevo = casos.find(c => c.id === nuevoAcumuladoA);
        if (padreNuevo) {
            if (!padreNuevo.juicios_acumulados) padreNuevo.juicios_acumulados = [];
            if (!padreNuevo.juicios_acumulados.includes(casoAcumularId)) {
                padreNuevo.juicios_acumulados.push(casoAcumularId);
            }
        }
    }

    localStorage.setItem('casos', JSON.stringify(casos));
    cerrarModalAcumular();
    cargarCasos();
    alert('Acumulación actualizada correctamente');
}

function verDetalle(casoId) {
    // Redirigir a página de detalle
    window.location.href = `detalleCaso.html?id=${casoId}`;
}

function toggleMenu(casoId) {
    // Cerrar todos los demás menús y regresarlos a su contenedor
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

    // Mover el menú al body para escapar del stacking context del sticky
    document.body.appendChild(menu);
    menu.classList.add('show');

    // Obtener posición del botón relativa al viewport
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
    // Cerrar menú
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;

    // VALIDAR: No se puede eliminar si tiene casos acumulados
    if (caso.juicios_acumulados && caso.juicios_acumulados.length > 0) {
        alert(`⚠️ No se puede eliminar\n\nEl expediente ${caso.numero_expediente} tiene ${caso.juicios_acumulados.length} asunto(s) acumulado(s).\n\nDebe desacumularlos primero.`);
        return;
    }

    // Confirmar eliminación
    if (!confirm(`⚠️ Confirmar eliminación\n\n¿Está seguro de eliminar el expediente ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    // Trabajar con TODOS los casos del localStorage (no solo los filtrados por JSJ)
    const casosStr = localStorage.getItem('casos');
    let todosCasosGlobal = casosStr ? JSON.parse(casosStr) : [];

    // Si el caso está acumulado a otro, quitarlo del array del padre
    if (caso.acumulado_a) {
        const casoPadre = todosCasosGlobal.find(c => c.id === caso.acumulado_a);
        if (casoPadre && casoPadre.juicios_acumulados) {
            casoPadre.juicios_acumulados = casoPadre.juicios_acumulados.filter(id => id !== casoId);
        }
    }

    // Eliminar del array global
    todosCasosGlobal = todosCasosGlobal.filter(c => c.id !== casoId);
    localStorage.setItem('casos', JSON.stringify(todosCasosGlobal));

    // También eliminar del array local filtrado
    todosLosCasos = todosLosCasos.filter(c => c.id !== casoId);

    // Refrescar tabla
    filtrarCasos();
    actualizarContadores();

    alert('Asunto eliminado exitosamente');
}


// Función para cerrar todos los menús y regresarlos a su contenedor
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

// Cerrar menús al hacer clic fuera
document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-container') && !e.target.closest('.menu-dropdown')) {
        cerrarTodosLosMenus();
    }
});

// Cerrar menús al hacer scroll (porque son position: fixed)
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
        const pron = c.pronostico || (c.seguimiento && c.seguimiento.pronostico) || null;
        if (pron === 'FAVORABLE') favorable++;
        else if (pron === 'DESFAVORABLE') desfavorable++;
        else sinPronostico++;
    });

    // Guardar datos de segmentos para hacer la dona clickeable
    window.datosDonaSegmentos = [];

    const datos = [
        { label: 'Favorable', valor: favorable, color: '#2e7d32' },
        { label: 'Desfavorable', valor: desfavorable, color: '#d32f2f' },
        { label: 'Sin Pronóstico', valor: sinPronostico, color: '#9e9e9e' }
    ];

    const totalDatos = favorable + desfavorable + sinPronostico;

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
            const centerLabel = estadoFiltros.filtroEstatus === 'CONCLUIDO' ? 'concluidos' : 'trámites';
            fitText(centerLabel, 9, false);
            ctx.fillText(centerLabel, center, center + 10);
        }
    }

    // Actualizar etiqueta dinámica de la gráfica según filtro de estatus
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
            indicador.innerHTML = `Filtrando: <strong>${labelFiltro}</strong> <button onclick="limpiarFiltroDona()" style="border:none;background:none;color:var(--color-danger);cursor:pointer;font-weight:bold;">✕</button>`;
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

        // Solo aceptar click en el área de la dona (incluye zona de crecimiento)
        if (dist < innerRadius || dist > radius + 5) return;

        // Calcular ángulo del click
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

        // Solo re-renderizar si cambió el segmento hovered
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
    // Toggle: si ya está seleccionado, limpiar
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
    // Si el estatus fue auto-asignado por la dona, limpiarlo también
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
    const elActivos = document.getElementById('casosActivos');
    const elConcluidos = document.getElementById('casosConcluidos');

    if (elTotal) elTotal.textContent = total;
    if (elActivos) elActivos.textContent = activos;
    if (elConcluidos) elConcluidos.textContent = concluidos;
}

// =====================================================
// ACTIVIDAD RECIENTE
// =====================================================

/**
 * Formatea una fecha como tiempo relativo ("hace 2 horas", "hace 3 días", etc.)
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
    if (diffSemanas < 4) return `Hace ${diffSemanas} sem`;
    if (diffMeses < 12) return `Hace ${diffMeses} mes${diffMeses > 1 ? 'es' : ''}`;
    return formatearFecha(fechaStr);
}

/**
 * Determina si un caso fue editado (su fecha_actualizacion difiere de fecha_creacion)
 */
function fueEditado(caso) {
    if (!caso.fecha_actualizacion || !caso.fecha_creacion) return false;
    // Considerar "editado" si hay más de 1 minuto de diferencia
    const diff = Math.abs(new Date(caso.fecha_actualizacion) - new Date(caso.fecha_creacion));
    return diff > 60000;
}

/**
 * Renderiza la sección de "Actividad Reciente" con los 5 últimos casos nuevos/editados
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

    // Tomar los últimos 5
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
        const actorNombre = getActorNombre(caso) || 'IMSS';

        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge-mini badge-mini-tramite" title="En Trámite">T</span>'
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
                        <span>${caso.tipo_juicio} · ${actorNombre}</span>
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