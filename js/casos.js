// =====================================================
// CASOS.JS - Gestión de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;

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

    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Cargar casos (fake o localStorage)
    cargarCasos();

    // Llenar filtros
    llenarFiltros();

    // Event listeners para búsqueda
    document.getElementById('searchInput').addEventListener('input', filtrarCasos);
    // Los filtros de columna usan seleccionarFiltro() directamente (dropdown personalizado)

    // Mostrar casos
    filtrarCasos();
});

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';

    // Resetear estado
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');

    // Restaurar etiquetas de botones
    document.querySelectorAll('.filtro-btn-custom').forEach(btn => {
        btn.innerHTML = `${btn.dataset.nombre} ▾`;
        btn.classList.remove('filtro-activo');
    });

    cerrarTodosLosFiltros();
    filtrarCasos();
}


function cargarCasos() {
    const casosGuardados = localStorage.getItem('casos');
    
    if (casosGuardados) {
        todosLosCasos = JSON.parse(casosGuardados);
        
        todosLosCasos.sort((a, b) => b.id - a.id); 
    } else {
        // Si no hay localStorage, usamos los fake y también los ordenamos
        todosLosCasos = (typeof casosFake !== 'undefined' ? casosFake : []);
        todosLosCasos.sort((a, b) => b.id - a.id);
        // Guardamos esta carga inicial ordenada
        localStorage.setItem('casos', JSON.stringify(todosLosCasos));
    }

    // Inicializar la tabla
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
        { valor: 'MERCANTIL', etiqueta: 'Mercantil' }
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

    // Calcular posición del botón en la pantalla
    const rect = boton.getBoundingClientRect();
    panel.style.top = (rect.bottom + window.scrollY + 4) + 'px';
    panel.style.left = (rect.left + window.scrollX) + 'px';

    // Construir opciones
    lista.innerHTML = '';

    const opcionTodos = document.createElement('div');
    opcionTodos.className = 'filtro-opcion filtro-opcion-todos';
    opcionTodos.textContent = 'Todos';
    opcionTodos.onclick = () => seleccionarFiltro(id, '', 'Todos');
    lista.appendChild(opcionTodos);

    opcionesFiltros[id].forEach(op => {
        const item = document.createElement('div');
        item.className = 'filtro-opcion';
        if (estadoFiltros[id] === op.valor) item.classList.add('filtro-opcion-seleccionada');
        item.textContent = op.etiqueta;
        item.onclick = () => seleccionarFiltro(id, op.valor, op.etiqueta);
        lista.appendChild(item);
    });

    panel.style.display = 'block';
    filtroAbierto = id;
}

function seleccionarFiltro(filtroId, valor, etiqueta) {
    estadoFiltros[filtroId] = valor;

    const btn = document.getElementById('btn_' + filtroId);
    const nombreColumna = btn.dataset.nombre;
    if (valor) {
        btn.innerHTML = `${nombreColumna} <span class="filtro-valor-badge">${etiqueta}</span> &#9660;`;
        btn.classList.add('filtro-activo');
    } else {
        btn.innerHTML = `${nombreColumna} &#9660;`;
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

function filtrarCasos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const { filtroDelegacion: delegacionId, filtroEstatus: estatus, filtroTipo: tipo, filtroJurisdiccion: jurisdiccion, filtroPosicionIMSS: posicionIMSS } = estadoFiltros;

    casosFiltrados = todosLosCasos.filter(caso => {
        let cumpleBusqueda = true;
        if (searchTerm) {
            // Protecciones añadidas: ( ... || '')
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const actorNombre = (getActorNombre(caso.actor) || '').toLowerCase();
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

        /* FILTRO FECHAS - COMENTADO, se usará en otra funcionalidad
        let cumpleFechaDesde = !fechaDesde || caso.fecha_inicio >= fechaDesde;
        let cumpleFechaHasta = !fechaHasta || caso.fecha_inicio <= fechaHasta;
        */

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS;
    });

    // Ordenar por fecha_actualizacion descendente (más reciente primero)
    casosFiltrados.sort((a, b) => new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion));

    paginaActual = 1;
    actualizarEstadisticas();
    renderizarTabla();
}

function actualizarEstadisticas() {
    const total = todosLosCasos.length;
    const tramite = todosLosCasos.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = todosLosCasos.filter(c => c.estatus === 'CONCLUIDO').length;

    document.getElementById('totalCasos').textContent = total;
    document.getElementById('casosTramite').textContent = tramite;
    document.getElementById('casosConcluidos').textContent = concluidos;
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
        const actorNombre = getActorNombreConTipo(caso.actor);
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
                <td>
                    <div class="menu-container">
                        <button class="menu-trigger" onclick="toggleMenu(${caso.id})" id="menu-trigger-${caso.id}">
                            ⋮
                        </button>
                        <div class="menu-dropdown" id="menu-${caso.id}">
                            <div class="menu-item" onclick="editarCaso(${caso.id})">
                                Editar datos
                            </div>
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                Actualizar seguimiento
                            </div>
                            <div class="menu-item danger" onclick="confirmarEliminar(${caso.id})">
                                Eliminar
                            </div>
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

function getActorNombre(actor) {
    if (!actor) return 'IMSS';

    if (actor.tipo_persona === 'FISICA') {
        // Usamos || '' para evitar que se imprima "undefined" si falta algún apellido
        return `${actor.nombres || ''} ${actor.apellido_paterno || ''} ${actor.apellido_materno || ''}`.trim();
    }

    // Si no hay empresa, devolvemos una cadena vacía en lugar de undefined
    return actor.empresa || '';
}

function getActorNombreConTipo(actor) {
    if (!actor) return 'IMSS';
    const nombre = actor.tipo_persona === 'FISICA'
        ? `${actor.nombres} ${actor.apellido_paterno}`
        : actor.empresa;
    const tipo = actor.tipo_persona === 'FISICA' ? 'F' : 'M';
    return `${nombre} <small style="color: var(--color-text-light);">(${tipo})</small>`;
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
                <a href="detalle-caso.html?id=${c.id}" class="expediente-link" style="font-weight: 700;">
                    ${c.numero_expediente}
                </a>
                <span class="badge-mini badge-mini-concluido" title="Concluido">C</span>
            </div>
            <div style="font-size: 13px; color: var(--color-text-light);">
                <div>Actor: ${getActorNombre(c.actor)}</div>
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

function verDetalle(casoId) {
    // Redirigir a página de detalle
    window.location.href = `detalle-caso.html?id=${casoId}`;
}

function toggleMenu(casoId) {
    document.querySelectorAll('.menu-dropdown').forEach(menu => {
        if (menu.id !== `menu-${casoId}`) {
            menu.classList.remove('show');
            menu.style.top = '';
            menu.style.bottom = '';
        }
    });
    
    const menu = document.getElementById(`menu-${casoId}`);
    const boton = document.getElementById(`menu-trigger-${casoId}`);
    
    menu.classList.toggle('show');
    
    if (menu.classList.contains('show')) {
        const rect = boton.getBoundingClientRect();
        const espacioAbajo = window.innerHeight - rect.bottom;
        
        const alturaMenuEstimada = 300; 

        if (espacioAbajo < alturaMenuEstimada) {
            menu.style.top = 'auto';
            menu.style.bottom = '100%'; 
            menu.style.marginBottom = '4px'; 
        } else {
            menu.style.top = ''; 
            menu.style.bottom = '';
            menu.style.marginBottom = '';
        }
    }
}

function editarCaso(casoId) {
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');
    
    // CAMBIO: Usar '?id=' en lugar de '?editar='
    window.location.href = `editar-caso.html?id=${casoId}`;
}

function actualizarSeguimiento(casoId) {
    // Cerrar menú
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    // Por ahora alert, implementaremos modal después
    alert(`Actualizar seguimiento del caso #${casoId}\n\n(Función en desarrollo - siguiente paso)`);
}

function confirmarEliminar(casoId) {
    // Cerrar menú
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');

    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;

    // VALIDAR: No se puede eliminar si tiene casos acumulados
    if (caso.juicios_acumulados && caso.juicios_acumulados.length > 0) {
        alert(`⚠️ No se puede eliminar\n\nEl expediente ${caso.numero_expediente} tiene ${caso.juicios_acumulados.length} caso(s) acumulado(s).\n\nDebe desacumularlos primero.`);
        return;
    }

    // Confirmar eliminación
    if (!confirm(`⚠️ Confirmar eliminación\n\n¿Está seguro de eliminar el expediente ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    // Si el caso está acumulado a otro, quitarlo del array del padre
    if (caso.acumulado_a) {
        const casoPadre = todosLosCasos.find(c => c.id === caso.acumulado_a);
        if (casoPadre && casoPadre.juicios_acumulados) {
            casoPadre.juicios_acumulados = casoPadre.juicios_acumulados.filter(id => id !== casoId);
        }
    }

    // Eliminar del array
    todosLosCasos = todosLosCasos.filter(c => c.id !== casoId);

    // Actualizar localStorage
    localStorage.setItem('casos', JSON.stringify(todosLosCasos));

    // Refrescar tabla
    filtrarCasos();

    alert('✓ Caso eliminado exitosamente');
}


// Cerrar menús al hacer clic fuera
document.addEventListener('click', function (e) {
    if (!e.target.closest('.menu-container')) {
        document.querySelectorAll('.menu-dropdown').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});