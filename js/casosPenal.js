// =====================================================
// CASOS PENAL - Gestion de lista de casos penales
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;
let usuarioActual = null;
let filtroSentenciaDona = '';
window.hoveredDonaSegment = -1;

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
        alert('No tienes permiso para acceder al modulo penal.');
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

    // Ocultar filtro de delegacion para usuarios con JSJ fija
    if (usuario.rol !== 'admin' && usuario.delegacion_id) {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">JSJ</span>';
        }
    }

    const [catalogosResult, casosResult] = await Promise.allSettled([
        cargarCatalogos(),
        cargarCasos()
    ]);

    if (catalogosResult.status === 'rejected') {
        console.warn('No se pudo conectar a Supabase para catalogos, usando datos locales');
    }

    if (casosResult.status === 'rejected') {
        console.warn('La carga principal de casos penales termino con fallback local:', casosResult.reason);
    }

    inicializarClickDona();

    // Busqueda
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
        if (!e.target.closest('.menu-container') && !e.target.closest('.menu-dropdown')) {
            document.querySelectorAll('.menu-dropdown.show').forEach(m => {
                m.classList.remove('show');
                const id = m.id.replace('menu-', '');
                const origContainer = document.getElementById(`menu-container-${id}`);
                if (origContainer && m.parentElement === document.body) {
                    origContainer.appendChild(m);
                }
            });
        }
        if (filtroAbierto && !e.target.closest('#filtroPanel') && !e.target.closest('.filtro-btn-custom')) {
            cerrarTodosLosFiltros();
        }
    });

    // Cerrar menus al hacer scroll (position: fixed)
    document.querySelector('.table-container')?.addEventListener('scroll', function () {
        document.querySelectorAll('.menu-dropdown.show').forEach(m => {
            m.classList.remove('show');
            const id = m.id.replace('menu-', '');
            const origContainer = document.getElementById(`menu-container-${id}`);
            if (origContainer && m.parentElement === document.body) {
                origContainer.appendChild(m);
            }
        });
    });
});

// =====================================================
// CARGAR CASOS
// =====================================================

async function cargarCasos() {
    let todosLosCasosSinFiltro = [];

    try {
        const filtros = {};
        if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
            filtros.delegacion_id = usuarioActual.delegacion_id;
        }
        todosLosCasosSinFiltro = await obtenerCasosPenal(filtros);
        localStorage.setItem('casosPenal', JSON.stringify(todosLosCasosSinFiltro));
    } catch (err) {
        console.warn('No se pudo cargar desde Supabase, usando cache local:', err);
        const casosGuardados = localStorage.getItem('casosPenal');
        todosLosCasosSinFiltro = casosGuardados ? JSON.parse(casosGuardados) : [];
    }

    todosLosCasosSinFiltro.forEach(caso => {
        if (!caso.fecha_actualizacion) {
            caso.fecha_actualizacion = caso.fecha_creacion || new Date().toISOString();
        }
    });

    if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        todosLosCasos = todosLosCasosSinFiltro.filter(c => c.delegacion_id === usuarioActual.delegacion_id);
    } else {
        todosLosCasos = todosLosCasosSinFiltro;
    }

    todosLosCasos.sort((a, b) => new Date(b.fecha_actualizacion) - new Date(a.fecha_actualizacion));

    llenarFiltros();
    aplicarFiltros();
    actualizarContadores();
}

// =====================================================
// CONTADORES Y GRAFICA
// =====================================================

function actualizarContadores() {
    const favorables = todosLosCasos.filter(c => c.sentencia === 'FAVORABLE');
    const desfavorables = todosLosCasos.filter(c => c.sentencia === 'DESFAVORABLE');

    document.getElementById('totalCasos').textContent = todosLosCasos.length;
    document.getElementById('casosFavorables').textContent = favorables.length;
    document.getElementById('casosDesfavorables').textContent = desfavorables.length;

    dibujarGraficaSentencia();
}

function dibujarGraficaSentencia() {
    const canvas = document.getElementById('chartSentencia');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    const growMax = 5;
    const radius = size / 2 - growMax - 2;
    const innerRadius = radius * 0.55;

    const favorables = todosLosCasos.filter(c => c.sentencia === 'FAVORABLE').length;
    const desfavorables = todosLosCasos.filter(c => c.sentencia === 'DESFAVORABLE').length;
    const sinSentencia = todosLosCasos.filter(c => !c.sentencia).length;

    // Guardar datos de segmentos para click/hover interactivo
    window.datosDonaSegmentos = [];

    const datos = [
        { label: 'Favorable', valor: favorables, color: '#065f46' },
        { label: 'Desfavorable', valor: desfavorables, color: '#991b1b' },
        { label: 'Sin sentencia', valor: sinSentencia, color: '#9ca3af' }
    ];

    const totalDatos = favorables + desfavorables + sinSentencia;

    ctx.clearRect(0, 0, size, size);

    if (totalDatos === 0) {
        ctx.fillStyle = '#e5e7eb';
        ctx.beginPath();
        ctx.arc(center, center, radius, 0, Math.PI * 2);
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2, true);
        ctx.fill();

        ctx.fillStyle = '#9ca3af';
        ctx.font = '11px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Sin datos', center, center);
    } else {
        let startAngle = -Math.PI / 2;
        let segIndex = 0;

        const segsToDraw = [];
        datos.forEach(d => {
            if (d.valor === 0) return;
            const sliceAngle = (d.valor / totalDatos) * Math.PI * 2;
            const filtroValor = d.label === 'Favorable' ? 'FAVORABLE' : d.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_SENTENCIA';
            const isSelected = filtroSentenciaDona === filtroValor;
            const isHovered = window.hoveredDonaSegment === segIndex;

            segsToDraw.push({
                label: d.label, valor: d.valor, color: d.color,
                startAngle: startAngle, endAngle: startAngle + sliceAngle,
                sliceAngle: sliceAngle, filtroValor: filtroValor,
                isSelected: isSelected, isHovered: isHovered, index: segIndex
            });

            window.datosDonaSegmentos.push({
                label: d.label, startAngle: startAngle,
                endAngle: startAngle + sliceAngle, color: d.color, valor: d.valor
            });

            startAngle += sliceAngle;
            segIndex++;
        });

        const haySeleccion = segsToDraw.some(s => s.isSelected);

        segsToDraw.forEach(seg => {
            let drawRadius = radius;
            if (seg.isSelected) drawRadius = radius + 5;
            else if (seg.isHovered) drawRadius = radius + 3;

            ctx.save();
            if (haySeleccion && !seg.isSelected) ctx.globalAlpha = 0.35;
            if (seg.isSelected) { ctx.shadowColor = seg.color; ctx.shadowBlur = 6; }

            ctx.fillStyle = seg.color;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, drawRadius, seg.startAngle, seg.endAngle);
            ctx.closePath();
            ctx.fill();

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

        // Texto adaptable al centro
        const maxTextWidth = innerRadius * 1.7;
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

        const hoveredSeg = segsToDraw.find(s => s.isHovered);
        const selectedSeg = segsToDraw.find(s => s.isSelected);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (hoveredSeg) {
            ctx.fillStyle = hoveredSeg.color;
            fitText(String(hoveredSeg.valor), 16, true);
            ctx.fillText(hoveredSeg.valor, center, center - 6);
            ctx.fillStyle = '#555';
            fitText(hoveredSeg.label, 9, false);
            ctx.fillText(hoveredSeg.label, center, center + 8);
        } else if (selectedSeg) {
            ctx.fillStyle = selectedSeg.color;
            fitText(String(selectedSeg.valor), 18, true);
            ctx.fillText(selectedSeg.valor, center, center - 6);
            ctx.fillStyle = selectedSeg.color;
            fitText(selectedSeg.label, 9, true);
            ctx.fillText(selectedSeg.label, center, center + 9);
        } else {
            ctx.fillStyle = '#333';
            fitText(String(totalDatos), 18, true);
            ctx.fillText(totalDatos, center, center - 3);
            ctx.fillStyle = '#888';
            fitText('Asuntos', 9, false);
            ctx.fillText('Asuntos', center, center + 10);
        }
    }

    // Leyenda clickeable con feedback visual
    const leyenda = document.getElementById('leyendaSentencia');
    if (leyenda) {
        const hayFiltroActivo = !!filtroSentenciaDona;
        leyenda.innerHTML = datos.map(d => {
            const filtroValor = d.label === 'Favorable' ? 'FAVORABLE' : d.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_SENTENCIA';
            const activo = filtroSentenciaDona === filtroValor;
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
    const indicador = document.getElementById('indicadorFiltroDona');
    if (filtroSentenciaDona) {
        const labelFiltro = filtroSentenciaDona === 'FAVORABLE' ? 'Favorable' : filtroSentenciaDona === 'DESFAVORABLE' ? 'Desfavorable' : 'Sin sentencia';
        if (indicador) {
            indicador.style.display = 'block';
            indicador.innerHTML = `Filtrando: <strong>${labelFiltro}</strong> <button onclick="limpiarFiltroDona()" style="border:none;background:none;color:var(--color-danger);cursor:pointer;font-weight:bold;">&#10005;</button>`;
        }
    } else {
        if (indicador) indicador.style.display = 'none';
    }
}

// Click en la dona (canvas)
function inicializarClickDona() {
    const canvas = document.getElementById('chartSentencia');
    if (!canvas) return;

    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const ctr = canvas.width / 2;
        const dx = x - ctr;
        const dy = y - ctr;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const r = canvas.width / 2 - 7;
        const ir = r * 0.55;

        if (dist < ir || dist > r + 5) return;

        let angle = Math.atan2(dy, dx);
        if (angle < -Math.PI / 2) angle += Math.PI * 2;

        const segmentos = window.datosDonaSegmentos || [];
        for (const seg of segmentos) {
            if (angle >= seg.startAngle && angle < seg.endAngle) {
                const filtroValor = seg.label === 'Favorable' ? 'FAVORABLE' : seg.label === 'Desfavorable' ? 'DESFAVORABLE' : 'SIN_SENTENCIA';
                clickDonaFiltro(filtroValor);
                break;
            }
        }
    });

    canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;

        const ctr = canvas.width / 2;
        const dx = x - ctr;
        const dy = y - ctr;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const r = canvas.width / 2 - 7;
        const ir = r * 0.55;

        let newHovered = -1;

        if (dist >= ir && dist <= r + 5) {
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

        canvas.style.cursor = newHovered >= 0 ? 'pointer' : 'default';

        if (newHovered !== window.hoveredDonaSegment) {
            window.hoveredDonaSegment = newHovered;
            dibujarGraficaSentencia();
        }
    });

    canvas.addEventListener('mouseleave', function () {
        canvas.style.cursor = 'default';
        if (window.hoveredDonaSegment !== -1) {
            window.hoveredDonaSegment = -1;
            dibujarGraficaSentencia();
        }
    });
}

function clickDonaFiltro(valor) {
    if (filtroSentenciaDona === valor) {
        filtroSentenciaDona = '';
    } else {
        filtroSentenciaDona = valor;
    }
    paginaActual = 1;
    aplicarFiltros();
}

function limpiarFiltroDona() {
    filtroSentenciaDona = '';
    paginaActual = 1;
    aplicarFiltros();
}

function obtenerNombreEstadoProcesal(id) {
    if (!id) return null;
    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        const ep = catalogosDB.estadosProcesales.find(e => e.id === id);
        return ep ? ep.nombre : null;
    }
    const estados = {
        1: 'Etapa de investigacion',
        2: 'Etapa intermedia o etapa de preparacion a juicio',
        3: 'Etapa de juicio oral'
    };
    return estados[id] || null;
}

// =====================================================
// FILTROS
// =====================================================

const estadoFiltros = {
    filtroDelegacion: '',
    filtroDelito: '',
    filtroEstatusJSJ: '',
    filtroEstadoProcesal: ''
};

const opcionesFiltros = {
    filtroDelegacion: [],
    filtroDelito: [],
    filtroEstatusJSJ: [],
    filtroEstadoProcesal: []
};

let filtroAbierto = null;

function llenarFiltros() {
    opcionesFiltros.filtroDelegacion = [];
    const delegaciones = catalogosCargados ? catalogosDB.delegaciones : [];
    delegaciones.forEach(deleg => {
        opcionesFiltros.filtroDelegacion.push({ valor: deleg.id, etiqueta: deleg.nombre });
    });

    opcionesFiltros.filtroDelito = [];
    const delitosVistos = new Set();
    todosLosCasos.forEach(c => {
        const nombre = c.delito_nombre || obtenerNombreDelito(c.delito_id);
        if (nombre && !delitosVistos.has(nombre)) {
            delitosVistos.add(nombre);
            opcionesFiltros.filtroDelito.push({ valor: nombre, etiqueta: nombre });
        }
    });

    opcionesFiltros.filtroEstatusJSJ = [];
    const estatusJSJVistos = new Set();
    todosLosCasos.forEach(c => {
        const nombre = c.estatus_investigacion_jsj;
        if (nombre && !estatusJSJVistos.has(nombre)) {
            estatusJSJVistos.add(nombre);
            opcionesFiltros.filtroEstatusJSJ.push({ valor: nombre, etiqueta: nombre });
        }
    });

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
    const delitos = {
        1: 'ABUSO DE CONFIANZA', 5: 'COHECHO', 7: 'DANOS',
        13: 'FALSIFICACION DE DOCUMENTOS', 17: 'FRAUDE', 22: 'LESIONES', 27: 'ROBO'
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

    const opciones = opcionesFiltros[id] || [];
    const opcionesConConteo = opciones.map(op => {
        const count = todosLosCasos.filter(c => {
            if (id === 'filtroDelegacion') return c.delegacion_id == op.valor;
            if (id === 'filtroEstatus') return c.estatus === op.valor;
            if (id === 'filtroDelito') {
                const nombre = c.delito_nombre || obtenerNombreDelito(c.delito_id);
                return nombre === op.valor;
            }
            if (id === 'filtroEstatusJSJ') return c.estatus_investigacion_jsj === op.valor;
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
        if (estadoFiltros.filtroDelegacion && caso.delegacion_id != estadoFiltros.filtroDelegacion) return false;

        if (estadoFiltros.filtroDelito) {
            const nombre = caso.delito_nombre || obtenerNombreDelito(caso.delito_id);
            if (nombre !== estadoFiltros.filtroDelito) return false;
        }

        if (estadoFiltros.filtroEstatusJSJ && caso.estatus_investigacion_jsj !== estadoFiltros.filtroEstatusJSJ) return false;

        if (estadoFiltros.filtroEstadoProcesal) {
            const nombre = caso.estado_procesal_nombre || obtenerNombreEstadoProcesal(caso.estado_procesal_id);
            if (nombre !== estadoFiltros.filtroEstadoProcesal) return false;
        }

        if (filtroSentenciaDona) {
            if (filtroSentenciaDona === 'SIN_SENTENCIA') {
                if (caso.sentencia) return false;
            } else {
                if (caso.sentencia !== filtroSentenciaDona) return false;
            }
        }

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
    dibujarGraficaSentencia();
}

function limpiarFiltros() {
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');
    filtroSentenciaDona = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

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

        const estatusJSJ = caso.estatus_investigacion_jsj || '---';

        const badgeSentencia = caso.sentencia
            ? `<span class="badge ${caso.sentencia === 'FAVORABLE' ? 'badge-success' : 'badge-danger'}">${caso.sentencia}</span>`
            : '<small style="color:var(--color-text-light);">---</small>';

        return `
            <tr>
                <td><small>${delegacion ? delegacion.nombre : 'N/A'}</small></td>
                <td><small>${estatusJSJ}</small></td>
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
                            &#8942;
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
        <span class="paginacion-info">Mostrando ${inicio}-${fin} de ${casosFiltrados.length} registros</span>
        <div class="paginacion-controles">
            <button class="paginacion-btn" onclick="irAPagina(1)" ${paginaActual === 1 ? 'disabled' : ''}>&#171;</button>
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>&#8249; Anterior</button>
            <span class="paginacion-pagina">Pagina ${paginaActual} de ${totalPaginas}</span>
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>Siguiente &#8250;</button>
            <button class="paginacion-btn" onclick="irAPagina(${totalPaginas})" ${paginaActual === totalPaginas ? 'disabled' : ''}>&#187;</button>
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
    if (dias < 7) return `Hace ${dias} dias`;
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

async function confirmarEliminar(id) {
    if (confirm('Estas seguro de que deseas eliminar este asunto? Esta accion no se puede deshacer.')) {
        try {
            await eliminarCasoPenal(id);
            eliminarCacheCasoPenal(id);
            await cargarCasos();
        } catch (err) {
            console.error('Error al eliminar:', err);
            alert('Error al eliminar el asunto: ' + err.message);
        }
    }
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
        menu.classList.remove('show');
        const origContainer = document.getElementById(`menu-container-${casoId}`);
        if (origContainer && menu.parentElement === document.body) {
            origContainer.appendChild(menu);
        }
        return;
    }

    // Mover al body para escapar del stacking context del sticky
    document.body.appendChild(menu);
    menu.classList.add('show');

    const rectBtn = boton.getBoundingClientRect();

    menu.style.position = 'fixed';
    menu.style.zIndex = '9999';

    const menuLeft = rectBtn.right - 150 - 10;
    menu.style.left = `${menuLeft}px`;
    menu.style.top = `${rectBtn.bottom + 4}px`;
    menu.style.bottom = '';

    requestAnimationFrame(() => {
        const rectMenu = menu.getBoundingClientRect();
        const espacioAbajo = window.innerHeight - rectBtn.bottom;

        if (espacioAbajo < rectMenu.height + 8) {
            menu.style.top = `${rectBtn.top - rectMenu.height - 4}px`;
        }
    });
}
