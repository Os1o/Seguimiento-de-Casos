// =====================================================
// CASOS PENAL - Gestión de lista de casos penales
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

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;

    // Verificar permiso penal
    if (!usuario.permiso_penal && usuario.rol !== 'admin') {
        alert('No tienes permiso para acceder al módulo penal.');
        window.location.href = 'casos.html';
        return;
    }

    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Badge de rol
    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    // Mostrar JSJ
    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD && usuario.delegacion_id) {
        const deleg = obtenerDelegacion(usuario.delegacion_id);
        if (deleg) infoOOAD.textContent = deleg.nombre;
    } else if (infoOOAD) {
        infoOOAD.textContent = 'Todas las JSJ';
    }

    // Admin link
    const linkAdmin = document.getElementById('linkAdmin');
    if (linkAdmin && usuario.rol === 'admin') linkAdmin.style.display = '';

    // Ocultar "Nuevo Registro" para consulta
    if (usuario.rol === 'consulta') {
        const btnNuevo = document.getElementById('btnNuevoRegistro');
        if (btnNuevo) btnNuevo.style.display = 'none';
    }

    // Ocultar filtro de delegación para usuarios con JSJ fija
    if (usuario.rol !== 'admin' && usuario.delegacion_id) {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">JSJ</span>';
        }
    }

    // Cargar catálogos y casos
    try {
        await cargarCatalogos();
    } catch (err) {
        console.warn('No se pudo conectar a Supabase, usando datos locales');
    }

    cargarCasos();
    llenarFiltros();

    // Búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            paginaActual = 1;
            aplicarFiltros();
        });
    }

    // Scroll cierra dropdown
    window.addEventListener('scroll', function (e) {
        if (!filtroAbierto) return;
        const panel = document.getElementById('filtroPanel');
        if (panel && panel.contains(e.target)) return;
        cerrarTodosLosFiltros();
    }, true);

    // Click fuera cierra menu
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.menu-container') && !e.target.closest('.menu-trigger')) {
            document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('show'));
        }
        if (filtroAbierto && !e.target.closest('#filtroPanel') && !e.target.closest('.filtro-btn-custom')) {
            cerrarTodosLosFiltros();
        }
    });
});

// =====================================================
// CARGAR CASOS
// =====================================================

function cargarCasos() {
    // Intentar cargar de localStorage (para funcionar sin Supabase)
    const casosGuardados = localStorage.getItem('casosPenal');
    let todosLosCasosSinFiltro;

    if (casosGuardados) {
        todosLosCasosSinFiltro = JSON.parse(casosGuardados);
    } else {
        // Datos dummy iniciales para funcionar sin Supabase
        todosLosCasosSinFiltro = (typeof casosPenalFake !== 'undefined' ? [...casosPenalFake] : []);
    }

    todosLosCasosSinFiltro.forEach(caso => {
        if (!caso.fecha_actualizacion) {
            caso.fecha_actualizacion = caso.fecha_creacion || new Date().toISOString();
        }
    });

    localStorage.setItem('casosPenal', JSON.stringify(todosLosCasosSinFiltro));

    // Filtrar por JSJ del usuario
    if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        todosLosCasos = todosLosCasosSinFiltro.filter(c => c.delegacion_id === usuarioActual.delegacion_id);
    } else {
        todosLosCasos = todosLosCasosSinFiltro;
    }

    todosLosCasos.sort((a, b) => new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion));

    aplicarFiltros();
    actualizarContadores();
}

// =====================================================
// CONTADORES Y GRÁFICA
// =====================================================

function actualizarContadores() {
    const enTramite = todosLosCasos.filter(c => c.estatus === 'TRAMITE');
    const concluidos = todosLosCasos.filter(c => c.estatus === 'CONCLUIDO');

    document.getElementById('totalCasos').textContent = todosLosCasos.length;
    document.getElementById('casosTramite').textContent = enTramite.length;
    document.getElementById('casosConcluidos').textContent = concluidos.length;

    dibujarGraficaEstadoProcesal(enTramite);
}

function dibujarGraficaEstadoProcesal(casosEnTramite) {
    const canvas = document.getElementById('chartEstadoProcesal');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const growMax = 5;
    const radius = size / 2 - growMax - 2;
    const innerRadius = radius * 0.55;

    // Contar por estado procesal
    const conteo = {};
    casosEnTramite.forEach(c => {
        const estado = c.estado_procesal_nombre || obtenerNombreEstadoProcesal(c.estado_procesal_id) || 'Sin estado';
        conteo[estado] = (conteo[estado] || 0) + 1;
    });

    const colores = ['#991b1b', '#b45309', '#065f46', '#1e40af', '#6b21a8', '#be185d', '#0f766e', '#854d0e', '#374151'];
    const etiquetas = Object.keys(conteo);
    const valores = Object.values(conteo);
    const total = valores.reduce((a, b) => a + b, 0);

    // Limpiar canvas
    ctx.clearRect(0, 0, size, size);

    if (total === 0) {
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = '#e5e7eb';
        ctx.fill();

        ctx.font = '11px Montserrat, sans-serif';
        ctx.fillStyle = '#9ca3af';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sin datos', center, center);
        return;
    }

    // Dibujar segmentos
    let startAngle = -Math.PI / 2;
    etiquetas.forEach((etiqueta, i) => {
        const sliceAngle = (valores[i] / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.arc(center, center, innerRadius, endAngle, startAngle, true);
        ctx.closePath();
        ctx.fillStyle = colores[i % colores.length];
        ctx.fill();

        startAngle = endAngle;
    });

    // Centro
    ctx.beginPath();
    ctx.arc(center, center, innerRadius - 1, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.font = 'bold 18px Montserrat, sans-serif';
    ctx.fillStyle = '#1a1a2e';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(total, center, center - 6);
    ctx.font = '9px Montserrat, sans-serif';
    ctx.fillStyle = '#6b7280';
    ctx.fillText('En trámite', center, center + 8);

    // Leyenda
    const leyendaContainer = document.getElementById('leyendaEstadoProcesal');
    if (leyendaContainer) {
        leyendaContainer.innerHTML = etiquetas.map((etiqueta, i) =>
            `<div class="leyenda-item">
                <span class="leyenda-color" style="background:${colores[i % colores.length]};"></span>
                <span class="leyenda-texto">${etiqueta} (${valores[i]})</span>
            </div>`
        ).join('');
    }
}

function obtenerNombreEstadoProcesal(id) {
    if (!id) return null;
    // Intentar de catálogos cargados
    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        const ep = catalogosDB.estadosProcesales.find(e => e.id === id);
        return ep ? ep.nombre : null;
    }
    // Fallback: buscar en casosPenalEstados (datos locales)
    const estados = {
        1: 'Investigación inicial', 2: 'Investigación complementaria', 3: 'Etapa intermedia',
        4: 'Juicio oral', 5: 'Sentenciado', 6: 'Ejecución de sentencia',
        7: 'Recurso de apelación', 8: 'Amparo', 9: 'Concluido'
    };
    return estados[id] || null;
}

// =====================================================
// FILTROS
// =====================================================

const estadoFiltros = {
    filtroDelegacion: '',
    filtroEstatus: '',
    filtroDelito: '',
    filtroEstadoProcesal: ''
};

const opcionesFiltros = {
    filtroDelegacion: [],
    filtroEstatus: [
        { valor: 'TRAMITE', etiqueta: 'Trámite' },
        { valor: 'CONCLUIDO', etiqueta: 'Concluido' }
    ],
    filtroDelito: [],
    filtroEstadoProcesal: []
};

let filtroAbierto = null;

function llenarFiltros() {
    opcionesFiltros.filtroDelegacion = [];
    catalogos.delegaciones.forEach(deleg => {
        opcionesFiltros.filtroDelegacion.push({ valor: deleg.id, etiqueta: deleg.nombre });
    });

    // Delitos - extraer de los casos existentes
    opcionesFiltros.filtroDelito = [];
    const delitosVistos = new Set();
    todosLosCasos.forEach(c => {
        const nombre = c.delito_nombre || obtenerNombreDelito(c.delito_id);
        if (nombre && !delitosVistos.has(nombre)) {
            delitosVistos.add(nombre);
            opcionesFiltros.filtroDelito.push({ valor: nombre, etiqueta: nombre });
        }
    });

    // Estados procesales
    opcionesFiltros.filtroEstadoProcesal = [];
    const estadosVistos = new Set();
    todosLosCasos.forEach(c => {
        const nombre = c.estado_procesal_nombre || obtenerNombreEstadoProcesal(c.estado_procesal_id);
        if (nombre && !estadosVistos.has(nombre)) {
            estadosVistos.add(nombre);
            opcionesFiltros.filtroEstadoProcesal.push({ valor: nombre, etiqueta: nombre });
        }
    });
}

function obtenerNombreDelito(id) {
    if (!id) return null;
    if (catalogosCargados && catalogosDB.delitos.length > 0) {
        const d = catalogosDB.delitos.find(d => d.id === id);
        return d ? d.nombre : null;
    }
    // Fallback datos locales
    const delitos = {
        1: 'Robo', 2: 'Robo calificado', 3: 'Fraude', 4: 'Abuso de confianza',
        5: 'Daño en propiedad ajena', 6: 'Lesiones', 7: 'Homicidio culposo',
        8: 'Amenazas', 9: 'Usurpación de funciones', 10: 'Falsificación de documentos',
        11: 'Uso de documento falso', 12: 'Despojo', 13: 'Extorsión',
        14: 'Delitos contra la salud', 15: 'Delitos contra el patrimonio institucional',
        16: 'Peculado', 17: 'Cohecho', 18: 'Ejercicio indebido del servicio público',
        19: 'Uso indebido de atribuciones y facultades', 20: 'Violación de sellos'
    };
    return delitos[id] || null;
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

    const rect = boton.getBoundingClientRect();
    panel.style.top = (rect.bottom + 4) + 'px';
    panel.style.left = rect.left + 'px';

    // Calcular opciones con conteo
    const opciones = opcionesFiltros[id] || [];
    const opcionesConConteo = opciones.map(op => {
        const count = todosLosCasos.filter(c => {
            if (id === 'filtroDelegacion') return c.delegacion_id == op.valor;
            if (id === 'filtroEstatus') return c.estatus === op.valor;
            if (id === 'filtroDelito') {
                const nombre = c.delito_nombre || obtenerNombreDelito(c.delito_id);
                return nombre === op.valor;
            }
            if (id === 'filtroEstadoProcesal') {
                const nombre = c.estado_procesal_nombre || obtenerNombreEstadoProcesal(c.estado_procesal_id);
                return nombre === op.valor;
            }
            return false;
        }).length;
        return { ...op, count };
    }).filter(op => op.count > 0);

    lista.innerHTML = '';

    const opcionTodos = document.createElement('div');
    opcionTodos.className = 'filtro-opcion filtro-opcion-todos';
    opcionTodos.textContent = 'Todos';
    opcionTodos.onclick = () => seleccionarFiltro(id, '', 'Todos');
    lista.appendChild(opcionTodos);

    opcionesConConteo.forEach(op => {
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

function seleccionarFiltro(id, valor, etiqueta) {
    estadoFiltros[id] = valor;

    // Actualizar badge del botón
    const btn = document.getElementById('btn_' + id);
    if (btn) {
        const nombreColumna = btn.dataset.nombre;
        if (valor) {
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span><span class="filtro-valor-badge">${etiqueta}</span>`;
        } else {
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span>`;
        }
    }

    cerrarTodosLosFiltros();
    paginaActual = 1;
    aplicarFiltros();
}

function aplicarFiltros() {
    const busqueda = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

    casosFiltrados = todosLosCasos.filter(caso => {
        // Filtro delegación
        if (estadoFiltros.filtroDelegacion && caso.delegacion_id != estadoFiltros.filtroDelegacion) return false;

        // Filtro estatus
        if (estadoFiltros.filtroEstatus && caso.estatus !== estadoFiltros.filtroEstatus) return false;

        // Filtro delito
        if (estadoFiltros.filtroDelito) {
            const nombre = caso.delito_nombre || obtenerNombreDelito(caso.delito_id);
            if (nombre !== estadoFiltros.filtroDelito) return false;
        }

        // Filtro estado procesal
        if (estadoFiltros.filtroEstadoProcesal) {
            const nombre = caso.estado_procesal_nombre || obtenerNombreEstadoProcesal(caso.estado_procesal_id);
            if (nombre !== estadoFiltros.filtroEstadoProcesal) return false;
        }

        // Búsqueda
        if (busqueda) {
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const denunciante = getPersonaNombre(caso.denunciante).toLowerCase();
            const responsable = getPersonaNombre(caso.probable_responsable).toLowerCase();
            const datoRel = (caso.dato_relevante || '').toLowerCase();
            if (!expediente.includes(busqueda) && !denunciante.includes(busqueda) &&
                !responsable.includes(busqueda) && !datoRel.includes(busqueda)) return false;
        }

        return true;
    });

    renderizarTabla();
}

function limpiarFiltros() {
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // Resetear botones
    Object.keys(estadoFiltros).forEach(id => {
        const btn = document.getElementById('btn_' + id);
        if (btn) {
            const nombre = btn.dataset.nombre;
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombre} <span class="filtro-flecha">&#9660;</span></span>`;
        }
    });

    paginaActual = 1;
    aplicarFiltros();
}

// =====================================================
// TABLA
// =====================================================

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
        const delitoNombre = caso.delito_nombre || obtenerNombreDelito(caso.delito_id) || '---';
        const estadoProcesal = caso.estado_procesal_nombre || obtenerNombreEstadoProcesal(caso.estado_procesal_id) || '---';
        const denunciante = getPersonaNombre(caso.denunciante);
        const responsable = getPersonaNombre(caso.probable_responsable);

        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge-mini badge-mini-tramite" title="En Trámite">T</span>'
            : '<span class="badge-mini badge-mini-concluido" title="Concluido">C</span>';

        const badgeSentencia = caso.sentencia
            ? `<span class="badge ${caso.sentencia === 'FAVORABLE' ? 'badge-success' : 'badge-danger'}">${caso.sentencia}</span>`
            : '<small style="color:var(--color-text-light);">---</small>';

        return `
            <tr>
                <td><small>${delegacion ? delegacion.nombre : 'N/A'}</small></td>
                <td>${badgeEstatus}</td>
                <td>
                    <a href="#" class="expediente-link" onclick="verDetalle(${caso.id}); return false;">
                        <strong>${caso.numero_expediente}</strong>
                    </a>
                </td>
                <td><small>${delitoNombre}</small></td>
                <td><small>${denunciante}</small></td>
                <td><small>${responsable}</small></td>
                <td><small>${estadoProcesal}</small></td>
                <td>${badgeSentencia}</td>
                <td>${formatearFecha(caso.fecha_inicio)}</td>
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

// =====================================================
// HELPERS
// =====================================================

function getPersonaNombre(persona) {
    if (!persona) return '---';
    if (persona.tipo_persona === 'FISICA') {
        return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || '---';
    }
    if (persona.tipo_persona === 'MORAL') {
        return persona.empresa || '---';
    }
    // Try to extract from JSONB string
    if (typeof persona === 'string') {
        try { return getPersonaNombre(JSON.parse(persona)); } catch (e) { return '---'; }
    }
    return '---';
}

function formatearFechaRelativa(fecha) {
    if (!fecha) return '---';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    const ahora = new Date();
    const diff = ahora - d;
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoy';
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias} días`;
    if (dias < 30) return `Hace ${Math.floor(dias / 7)} sem`;
    return formatearFecha(fecha);
}

// =====================================================
// ACCIONES
// =====================================================

function verDetalle(id) {
    window.location.href = `detalleCasoPenal.html?id=${id}`;
}

function editarCaso(id) {
    window.location.href = `editarCasoPenal.html?id=${id}`;
}

function actualizarSeguimiento(id) {
    window.location.href = `actualizarCasoPenal.html?id=${id}`;
}

function confirmarEliminar(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este asunto? Esta acción no se puede deshacer.')) {
        const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
        const nuevos = casos.filter(c => c.id !== id);
        localStorage.setItem('casosPenal', JSON.stringify(nuevos));
        cargarCasos();
    }
}

function toggleMenu(id) {
    const menu = document.getElementById('menu-' + id);
    const wasOpen = menu.classList.contains('show');

    // Cerrar todos los menús
    document.querySelectorAll('.menu-dropdown').forEach(m => m.classList.remove('show'));

    if (!wasOpen) {
        menu.classList.add('show');
    }
}
