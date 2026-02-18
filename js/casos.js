// =====================================================
// CASOS.JS - Gestión de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;
let usuarioActual = null;

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

    // Mostrar OOAD del usuario
    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD && usuario.delegacion_id) {
        const deleg = obtenerDelegacion(usuario.delegacion_id);
        if (deleg) infoOOAD.textContent = deleg.nombre;
    } else if (infoOOAD && usuario.rol === 'admin') {
        infoOOAD.textContent = 'Todas las delegaciones';
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

    // Ocultar filtro de delegación para no-admin (ya está filtrado por su OOAD)
    if (usuario.rol !== 'admin') {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">OOAD/UMAE</span>';
        }
    }

    // Cargar casos (fake o localStorage)
    cargarCasos();

    // Llenar filtros
    llenarFiltros();

    // Event listeners para búsqueda
    document.getElementById('searchInput').addEventListener('input', filtrarCasos);

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

    // Filtrar por OOAD del usuario (si no es admin)
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

        /* FILTRO FECHAS - COMENTADO, se usará en otra funcionalidad
        let cumpleFechaDesde = !fechaDesde || caso.fecha_inicio >= fechaDesde;
        let cumpleFechaHasta = !fechaHasta || caso.fecha_inicio <= fechaHasta;
        */

        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS;
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
    const total = todosLosCasos.length;
    const tramite = todosLosCasos.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = todosLosCasos.filter(c => c.estatus === 'CONCLUIDO').length;

    document.getElementById('totalCasos').textContent = total;
    document.getElementById('casosTramite').textContent = tramite;
    document.getElementById('casosConcluidos').textContent = concluidos;

    // Renderizar grafica de pronostico (solo tramites)
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
                            ${usuarioActual && usuarioActual.rol !== 'consulta' ? `
                            <div class="menu-item" onclick="editarCaso(${caso.id})">
                                Editar datos
                            </div>
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                Actualizar seguimiento
                            </div>
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
    // Compatibilidad: nuevo formato (array de IDs) y viejo (un solo ID)
    let ids = [];
    if (caso.prestaciones_reclamadas && Array.isArray(caso.prestaciones_reclamadas)) {
        ids = caso.prestaciones_reclamadas;
    } else if (caso.prestacion_reclamada) {
        ids = [caso.prestacion_reclamada];
    }

    if (ids.length === 0) return '-';

    const nombres = ids.map(id => {
        const p = catalogos.prestaciones.find(pr => pr.id === id);
        return p ? p.nombre : '';
    }).filter(Boolean);

    if (nombres.length === 0) return '-';
    if (nombres.length === 1) return nombres[0];
    // Mostrar la primera y cuantas mas hay
    return `${nombres[0]} <span style="color: var(--color-text-light);">+${nombres.length - 1} más</span>`;
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
        alert(`⚠️ No se puede eliminar\n\nEl expediente ${caso.numero_expediente} tiene ${caso.juicios_acumulados.length} caso(s) acumulado(s).\n\nDebe desacumularlos primero.`);
        return;
    }

    // Confirmar eliminación
    if (!confirm(`⚠️ Confirmar eliminación\n\n¿Está seguro de eliminar el expediente ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }

    // Trabajar con TODOS los casos del localStorage (no solo los filtrados por OOAD)
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

    alert('Caso eliminado exitosamente');
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
    const radius = size / 2 - 4;
    const innerRadius = radius * 0.58;

    // Contar pronosticos solo de casos en TRAMITE
    const tramites = todosLosCasos.filter(c => c.estatus === 'TRAMITE');
    let favorable = 0;
    let desfavorable = 0;
    let sinPronostico = 0;

    tramites.forEach(c => {
        const pron = c.pronostico || (c.seguimiento && c.seguimiento.pronostico) || null;
        if (pron === 'FAVORABLE') favorable++;
        else if (pron === 'DESFAVORABLE') desfavorable++;
        else sinPronostico++;
    });

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

        datos.forEach(d => {
            if (d.valor === 0) return;
            const sliceAngle = (d.valor / totalDatos) * Math.PI * 2;

            ctx.fillStyle = d.color;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();
            ctx.fill();

            startAngle += sliceAngle;
        });

        // Recortar centro (dona)
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
        ctx.fill();

        // Numero total en el centro
        ctx.fillStyle = '#333';
        ctx.font = 'bold 18px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(totalDatos, center, center - 3);

        ctx.fillStyle = '#888';
        ctx.font = '8px Montserrat, sans-serif';
        ctx.fillText('trámites', center, center + 10);
    }

    // Leyenda
    const leyenda = document.getElementById('leyendaPronostico');
    if (leyenda) {
        leyenda.innerHTML = datos.map(d => `
            <div class="leyenda-item">
                <span class="leyenda-color" style="background: ${d.color};"></span>
                <span class="leyenda-texto">${d.label}</span>
                <span class="leyenda-valor">${d.valor}</span>
            </div>
        `).join('');
    }
}

function actualizarContadores() {
    const total = todosLosCasos.length;
    const activos = todosLosCasos.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = todosLosCasos.filter(c => c.estatus === 'CONCLUIDO').length;
    
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