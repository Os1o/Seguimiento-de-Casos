// =====================================================
// CASOS PENAL - Gestion de lista de casos penales
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];
let paginaActual = 1;
const REGISTROS_POR_PAGINA = 10;
const SEARCH_DEBOUNCE_MS = 180;
let usuarioActual = null;
let filtroSentenciaDona = '';
let ordenFechaListado = 'actualizacion';
let filtroRapidoPenal = '';
let catalogosCargados = false;
let catalogos = {
    delegaciones: [],
    delitos: [],
    estadosProcesales: []
};
let searchDebounceTimer = null;
window.hoveredDonaSegment = -1;

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

function obtenerDelegacion(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
}

function obtenerNombreDelegacionCaso(caso) {
    if (!caso || typeof caso !== 'object') {
        return 'N/A';
    }

    const nombreDirecto =
        caso.delegacion_nombre ||
        caso.delegacionNombre ||
        caso.jsj_nombre ||
        caso.jsjNombre ||
        caso.ooad_nombre ||
        caso.ooadNombre ||
        '';

    if (typeof nombreDirecto === 'string' && nombreDirecto.trim() !== '') {
        return nombreDirecto.trim();
    }

    const delegacion = obtenerDelegacion(caso.delegacion_id);
    if (delegacion?.nombre) {
        return delegacion.nombre;
    }

    return 'N/A';
}

function actualizarInfoOOADPenal() {
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

async function cargarCatalogosPenal() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catálogos');
    }

    const data = result.data || {};

    catalogos = {
        delegaciones: data.delegaciones || [],
        delitos: data.delitos || [],
        estadosProcesales: data.estadosProcesales || []
    };

    catalogosCargados = true;
    return catalogos;
}

async function obtenerCasosPenal(filtros = {}) {
    const queryParams = new URLSearchParams();

    if (filtros.delegacion_id) {
        queryParams.set('delegacion_id', filtros.delegacion_id);
    }

    const queryString = queryParams.toString();
    const url = `api/penal/getCases.php${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los asuntos penales');
    }

    return result.data?.cases || [];
}

async function eliminarCasoPenalApi(id) {
    const response = await fetch('api/deletePenalCase.php', {
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
        throw new Error(result.message || 'No se pudo eliminar el asunto penal');
    }

    return result.data || {};
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;
    window.mostrarCargaVista?.('.container');
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    const btnNuevoRegistro = document.getElementById('btnNuevoRegistro');

    if (pageTitle) pageTitle.textContent = 'Asuntos Penales';
    if (pageSubtitle) pageSubtitle.textContent = 'Gestión y seguimiento de asuntos penales';
    if (btnNuevoRegistro) btnNuevoRegistro.textContent = '+ Nuevo Registro';

    // Verificar permiso penal
    if (!usuario.permiso_penal && usuario.rol !== 'admin') {
        await window.appAlert?.({
            title: 'Acceso no permitido',
            message: 'No tienes permiso para acceder al módulo penal.'
        });
        window.location.href = 'casos.html';
        return;
    }

    if (!usuario.permiso_civil_mercantil && usuario.rol !== 'admin') {
        const linkCivil = document.getElementById('linkCivil');
        if (linkCivil) linkCivil.style.display = 'none';
    }

    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Badge de rol
    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', jefe: 'Jefe', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    actualizarInfoOOADPenal();

    // Admin link
    const linkAdmin = document.getElementById('linkAdmin');
    if (linkAdmin && usuario.rol === 'admin') linkAdmin.style.display = '';

    // Ocultar "Nuevo Registro" para consulta
    if (usuario.rol === 'consulta' || usuario.rol === 'jefe') {
        const btnNuevo = document.getElementById('btnNuevoRegistro');
        if (btnNuevo) btnNuevo.style.display = 'none';
    }

    // Ocultar filtro de delegacion para usuarios con JSJ fija
    if (usuario.rol !== 'admin' && usuario.delegacion_id) {
        const btnFiltroDelegacion = document.getElementById('btn_filtroDelegacion');
        if (btnFiltroDelegacion) {
            btnFiltroDelegacion.closest('th').innerHTML = '<span style="padding:0 10px;font-size:13px;">OOAD</span>';
        }
    }

    try {
        const [catalogosResult, casosResult] = await Promise.allSettled([
            cargarCatalogosPenal(),
            cargarCasos({ showLoader: false })
        ]);

        if (catalogosResult.status === 'rejected') {
            console.warn('No se pudieron cargar los catálogos desde la API local:', catalogosResult.reason);
        } else if (todosLosCasos.length > 0) {
            llenarFiltros();
            aplicarFiltros();
        }

        actualizarInfoOOADPenal();

        if (casosResult.status === 'rejected') {
            console.warn('La carga principal de asuntos penales termino con fallback local:', casosResult.reason);
        }

    } finally {
        await window.ocultarCargaVista?.('.container');
    }

    // Busqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            // Debounce: evita recalcular tabla, filtros y grafica por cada tecla.
            window.clearTimeout(searchDebounceTimer);
            searchDebounceTimer = window.setTimeout(() => {
                paginaActual = 1;
                aplicarFiltros();
            }, SEARCH_DEBOUNCE_MS);
        });
    }

    inicializarQuickFiltersPenal();
    actualizarResumenFiltrosToolbar();

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
            cerrarMenusPenalAbiertos();
        }
        if (filtroAbierto && !e.target.closest('#filtroPanel') && !e.target.closest('.filtro-btn-custom')) {
            cerrarTodosLosFiltros();
        }
        if (!e.target.closest('#panelResumenFiltros') && !e.target.closest('#btnResumenFiltros')) {
            cerrarResumenFiltros();
        }
    });

    // Cerrar menus al hacer scroll
    document.querySelector('.table-container')?.addEventListener('scroll', cerrarMenusPenalAbiertos);
    window.addEventListener('scroll', cerrarMenusPenalAbiertos, true);
});

// =====================================================
// CARGAR CASOS
// =====================================================

async function cargarCasos(options = {}) {
    const { showLoader = true } = options;
    let todosLosCasosSinFiltro = [];

    if (showLoader) {
        window.mostrarCargaBloque?.('.table-container');
    }

    try {
        if (sessionStorage.getItem('penalAmpCacheDirty') === '1') {
            localStorage.removeItem('casosPenal');
            sessionStorage.removeItem('penalAmpCacheDirty');
        }

        const filtros = {};
        if (usuarioActual && usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
            filtros.delegacion_id = usuarioActual.delegacion_id;
        }
        todosLosCasosSinFiltro = await obtenerCasosPenal(filtros);
        localStorage.setItem('casosPenal', JSON.stringify(todosLosCasosSinFiltro));
    } catch (err) {
        console.warn('No se pudo cargar desde la API local, usando cache local:', err);
        const casosGuardados = localStorage.getItem('casosPenal');
        todosLosCasosSinFiltro = casosGuardados ? JSON.parse(casosGuardados) : [];
    } finally {
        if (showLoader) {
            await window.ocultarCargaBloque?.('.table-container');
        }
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

    todosLosCasos.sort((a, b) => {
        const fechaA = a.fecha_actualizacion || a.fecha_creacion || 0;
        const fechaB = b.fecha_actualizacion || b.fecha_creacion || 0;
        return new Date(fechaB) - new Date(fechaA);
    });

    llenarFiltros();
    aplicarFiltros();
    actualizarContadores();
}

// =====================================================
// CONTADORES Y GRAFICA
// =====================================================

function actualizarContadores() {
    const datosFuente = casosFiltrados && casosFiltrados.length >= 0 ? casosFiltrados : todosLosCasos;
    const total = datosFuente.length;
    const tramites = datosFuente.filter(c => c.estatus === 'TRAMITE').length;
    const concluidos = datosFuente.filter(c => c.estatus === 'CONCLUIDO').length;
    const coadyuvancias = datosFuente.filter(c => esCoadyuvanciaPenal(c)).length;
    const pendientes = datosFuente.filter(c => tieneRequerimientosPendientesPenal(c)).length;
    const sinConocimientoAmp = datosFuente.filter(c => !c?.fecha_conocimiento_amp && !c?.fecha_conocimiento_fiscal).length;

    const elTotal = document.getElementById('totalCasos');
    const elTramites = document.getElementById('casosTramite');
    const elConcluidos = document.getElementById('casosConcluidos');
    const elCoadyuvancias = document.getElementById('casosCoadyuvancia');
    const elPendientes = document.getElementById('casosPendientes');
    const elSinConocimientoAmp = document.getElementById('casosSinConocimientoAmp');

    if (elTotal) elTotal.textContent = total;
    if (elTramites) elTramites.textContent = tramites;
    if (elConcluidos) elConcluidos.textContent = concluidos;
    if (elCoadyuvancias) elCoadyuvancias.textContent = coadyuvancias;
    if (elPendientes) elPendientes.textContent = pendientes;
    if (elSinConocimientoAmp) elSinConocimientoAmp.textContent = sinConocimientoAmp;
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

    const datosFuente = casosFiltrados && casosFiltrados.length >= 0 ? casosFiltrados : todosLosCasos;
    const favorables = datosFuente.filter(c => c.sentencia === 'FAVORABLE').length;
    const desfavorables = datosFuente.filter(c => c.sentencia === 'DESFAVORABLE').length;
    const sinSentencia = datosFuente.filter(c => !c.sentencia).length;

    // Guardar datos de segmentos para click/hover interactivo
    window.datosDonaSegmentos = [];

    const datos = [
        { label: 'Favorable', valor: favorables, color: '#2A5C4B' },
        { label: 'Desfavorable', valor: desfavorables, color: '#911034' },
        { label: 'Sin sentencia', valor: sinSentencia, color: '#EDF1F5' }
    ];

    const totalDatos = favorables + desfavorables + sinSentencia;
    const frame = canvas.closest('.grafica-canvas-frame');
    const centerValue = frame?.querySelector('.grafica-canvas-center-value');
    const centerLabel = frame?.querySelector('.grafica-canvas-center-label');

    if (frame) {
        if (totalDatos === 0) {
            frame.style.setProperty('--chart-visual', 'conic-gradient(#e5e7eb 0 100%)');
        } else {
            const favorablesPct = (favorables / totalDatos) * 100;
            const desfavorablesPct = (desfavorables / totalDatos) * 100;
            const sinSentenciaPct = 100 - favorablesPct - desfavorablesPct;
            frame.style.setProperty(
                '--chart-visual',
                `conic-gradient(#2A5C4B 0 ${favorablesPct}%, #911034 ${favorablesPct}% ${favorablesPct + desfavorablesPct}%, #edf1f5 ${favorablesPct + desfavorablesPct}% ${favorablesPct + desfavorablesPct + sinSentenciaPct}%)`
            );
        }
    }

    if (centerValue) {
        centerValue.textContent = String(totalDatos);
    }

    if (centerLabel) {
        centerLabel.textContent = totalDatos === 0 ? 'Sin datos' : 'Asuntos';
    }

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
    const estadoProcesal = (catalogos.estadosProcesales || []).find(item => item.id == id);
    return estadoProcesal ? estadoProcesal.nombre : null;
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
    filtroEstatus: [],
    filtroDelito: [],
    filtroEstadoProcesal: []
};

let filtroAbierto = null;
const definicionResumenFiltros = {
    filtroDelegacion: 'OOAD',
    filtroEstatus: 'Estatus',
    filtroDelito: 'Delito',
    filtroEstadoProcesal: 'Estado Procesal'
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

    if (filtroSentenciaDona) {
        const valor = filtroSentenciaDona === 'FAVORABLE'
            ? 'Favorable'
            : filtroSentenciaDona === 'DESFAVORABLE'
                ? 'Desfavorable'
                : 'Sin sentencia';

        activos.push({
            filtroId: 'filtroSentenciaDona',
            nombre: 'Sentencia',
            valor
        });
    }

    if (filtroRapidoPenal) {
        const etiquetasQuickFilter = {
            coadyuvancia: 'Coadyuvancia',
            requerimientos_pendientes: 'Con requerimientos pendientes',
            sin_amp: 'Sin conocimiento AMP'
        };

        activos.push({
            filtroId: 'filtroRapidoPenal',
            nombre: 'Métrica',
            valor: etiquetasQuickFilter[filtroRapidoPenal] || filtroRapidoPenal
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
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroDelegacion')">OOAD</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroEstatus')">Estatus</button>
            <button type="button" class="toolbar-filter-shortcut" onclick="abrirFiltroDesdeToolbar(event, 'filtroDelito')">Delito</button>
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
    if (!boton) return;
    cerrarResumenFiltros();
    toggleFiltro(filtroId, boton);
}

function cambiarOrdenFecha(event, orden) {
    event?.stopPropagation?.();
    const ordenesValidos = ['actualizacion', 'inicio_reciente', 'inicio_antiguo'];
    ordenFechaListado = ordenesValidos.includes(orden) ? orden : 'actualizacion';
    paginaActual = 1;
    actualizarResumenFiltrosToolbar();
    aplicarFiltros();
}

function llenarFiltros() {
    opcionesFiltros.filtroDelegacion = [];
    const delegaciones = catalogos.delegaciones || [];
    delegaciones.forEach(deleg => {
        opcionesFiltros.filtroDelegacion.push({ valor: deleg.id, etiqueta: deleg.nombre });
    });

    opcionesFiltros.filtroEstatus = [
        { valor: 'TRAMITE', etiqueta: 'Trámite' },
        { valor: 'CONCLUIDO', etiqueta: 'Concluido' }
    ];

    opcionesFiltros.filtroDelito = [];
    const delitosVistos = new Set();
    todosLosCasos.forEach(c => {
        const nombre = c.delito_nombre || obtenerNombreDelito(c.delito_id);
        if (nombre && !delitosVistos.has(nombre)) {
            delitosVistos.add(nombre);
            opcionesFiltros.filtroDelito.push({ valor: nombre, etiqueta: nombre });
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
    const delito = (catalogos.delitos || []).find(item => item.id == id);
    return delito ? delito.nombre : null;
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

    // Filtros cruzados: calcula opciones con todos los filtros activos excepto el abierto.
    const opcionesConConteo = calcularOpcionesDisponiblesPenal(id);

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

function cumpleFiltroRapidoPenal(caso) {
    if (!filtroRapidoPenal) {
        return true;
    }

    if (filtroRapidoPenal === 'coadyuvancia') {
        return esCoadyuvanciaPenal(caso);
    }

    if (filtroRapidoPenal === 'requerimientos_pendientes') {
        return tieneRequerimientosPendientesPenal(caso);
    }

    if (filtroRapidoPenal === 'sin_amp') {
        return !tieneFechaConocimientoAmpPenal(caso);
    }

    return true;
}

function resetBotonFiltroEstatusPenal() {
    const btn = document.getElementById('btn_filtroEstatus');
    if (!btn) {
        return;
    }

    const nombre = btn.dataset.nombre || 'Estatus';
    btn.classList.remove('filtro-activo');
    btn.innerHTML = `<span class="filtro-btn-nombre">${nombre} <span class="filtro-flecha">&#9660;</span></span>`;
}

function actualizarEstadoVisualQuickFiltersPenal() {
    document.querySelectorAll('[data-quick-filter]').forEach((card) => {
        const filtro = card.dataset.quickFilter || '';
        const activo =
            (filtro === 'estatus_tramite' && estadoFiltros.filtroEstatus === 'TRAMITE') ||
            (filtro === 'estatus_concluido' && estadoFiltros.filtroEstatus === 'CONCLUIDO') ||
            filtro === filtroRapidoPenal;

        card.classList.toggle('is-active', activo);
        card.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });
}

function aplicarQuickFilterPenal(filtro) {
    if (filtro === 'estatus_tramite' || filtro === 'estatus_concluido') {
        const estatus = filtro === 'estatus_tramite' ? 'TRAMITE' : 'CONCLUIDO';
        const etiqueta = estatus === 'TRAMITE' ? 'Trámite' : 'Concluido';
        filtroRapidoPenal = '';
        seleccionarFiltro('filtroEstatus', estadoFiltros.filtroEstatus === estatus ? '' : estatus, etiqueta);
        actualizarEstadoVisualQuickFiltersPenal();
        return;
    }

    filtroRapidoPenal = filtroRapidoPenal === filtro ? '' : filtro;

    if (filtroRapidoPenal) {
        estadoFiltros.filtroEstatus = '';
        resetBotonFiltroEstatusPenal();
    }

    cerrarTodosLosFiltros();
    actualizarEstadoVisualQuickFiltersPenal();
    actualizarResumenFiltrosToolbar();
    paginaActual = 1;
    aplicarFiltros();
}

function inicializarQuickFiltersPenal() {
    const container = document.querySelector('[data-quick-filter-container]');
    if (!container || container.dataset.quickFiltersBound === '1') {
        return;
    }

    container.dataset.quickFiltersBound = '1';
    container.addEventListener('click', (event) => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const card = target?.closest('[data-quick-filter]');
        if (!card || !container.contains(card)) {
            return;
        }

        aplicarQuickFilterPenal(card.dataset.quickFilter || '');
    });

    container.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
            return;
        }

        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const card = target?.closest('[data-quick-filter]');
        if (!card || !container.contains(card)) {
            return;
        }

        event.preventDefault();
        aplicarQuickFilterPenal(card.dataset.quickFilter || '');
    });
}

function normalizarTextoBusquedaPenal(caso) {
    return [
        caso.numero_expediente || '',
        caso.numero_carpeta || '',
        extraerNombresPenal(caso.denunciante).join(' '),
        extraerNombresPenal(caso.probable_responsable).join(' '),
        caso.dato_relevante || ''
    ].join(' ').toLowerCase();
}

function cumpleBusquedaPenal(caso, busqueda) {
    if (!busqueda) {
        return true;
    }

    return normalizarTextoBusquedaPenal(caso).includes(busqueda);
}

function cumpleFiltroSentenciaPenal(caso) {
    if (!filtroSentenciaDona) {
        return true;
    }

    if (filtroSentenciaDona === 'SIN_SENTENCIA') {
        return !caso.sentencia;
    }

    return caso.sentencia === filtroSentenciaDona;
}

function obtenerValorFiltroPenal(caso, filtroId) {
    if (filtroId === 'filtroDelegacion') {
        return {
            valor: caso.delegacion_id,
            etiqueta: obtenerNombreDelegacionCaso(caso)
        };
    }

    if (filtroId === 'filtroEstatus') {
        return {
            valor: caso.estatus,
            etiqueta: caso.estatus === 'TRAMITE' ? 'Trámite' : 'Concluido'
        };
    }

    if (filtroId === 'filtroDelito') {
        const nombre = caso.delito_nombre || obtenerNombreDelito(caso.delito_id);
        return {
            valor: nombre,
            etiqueta: nombre
        };
    }

    if (filtroId === 'filtroEstadoProcesal') {
        const nombre = caso.estado_procesal_nombre || obtenerNombreEstadoProcesal(caso.estado_procesal_id);
        return {
            valor: nombre,
            etiqueta: nombre
        };
    }

    return {
        valor: null,
        etiqueta: ''
    };
}

function cumpleFiltrosPenal(caso, filtroExcluido = '') {
    const busqueda = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

    if (!cumpleBusquedaPenal(caso, busqueda) || !cumpleFiltroSentenciaPenal(caso) || !cumpleFiltroRapidoPenal(caso)) {
        return false;
    }

    return Object.entries(estadoFiltros).every(([filtroId, valor]) => {
        if (!valor || filtroId === filtroExcluido) {
            return true;
        }

        const filtroCaso = obtenerValorFiltroPenal(caso, filtroId);
        return String(filtroCaso.valor ?? '') === String(valor);
    });
}

function calcularOpcionesDisponiblesPenal(filtroActual) {
    const conteo = new Map();

    todosLosCasos
        .filter((caso) => cumpleFiltrosPenal(caso, filtroActual))
        .forEach((caso) => {
            const { valor, etiqueta } = obtenerValorFiltroPenal(caso, filtroActual);
            if (valor === undefined || valor === null || valor === '') {
                return;
            }

            const key = String(valor);
            if (!conteo.has(key)) {
                conteo.set(key, {
                    valor,
                    etiqueta: etiqueta || String(valor),
                    count: 0
                });
            }

            conteo.get(key).count++;
        });

    return Array.from(conteo.values()).sort((a, b) => String(a.etiqueta).localeCompare(String(b.etiqueta)));
}

function seleccionarFiltro(id, valor, etiqueta) {
    estadoFiltros[id] = valor;

    const btn = document.getElementById('btn_' + id);
    if (btn) {
        const nombreColumna = btn.dataset.nombre;
        if (valor) {
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span><span class="filtro-valor-badge">${etiqueta}</span>`;
            btn.classList.add('filtro-activo');
        } else {
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombreColumna} <span class="filtro-flecha">&#9660;</span></span>`;
            btn.classList.remove('filtro-activo');
        }
    }

    cerrarTodosLosFiltros();
    actualizarResumenFiltrosToolbar();
    actualizarEstadoVisualQuickFiltersPenal();
    paginaActual = 1;
    aplicarFiltros();
}

function aplicarFiltros() {
    casosFiltrados = todosLosCasos.filter((caso) => cumpleFiltrosPenal(caso));

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

    renderizarTabla();
    dibujarGraficaSentencia();
    actualizarEstadoVisualQuickFiltersPenal();
    actualizarResumenFiltrosToolbar();
}

function limpiarFiltros() {
    Object.keys(estadoFiltros).forEach(k => estadoFiltros[k] = '');
    filtroSentenciaDona = '';
    filtroRapidoPenal = '';
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    Object.keys(estadoFiltros).forEach(id => {
        const btn = document.getElementById('btn_' + id);
        if (btn) {
            const nombre = btn.dataset.nombre;
            btn.classList.remove('filtro-activo');
            btn.innerHTML = `<span class="filtro-btn-nombre">${nombre} <span class="filtro-flecha">&#9660;</span></span>`;
        }
    });

    cerrarTodosLosFiltros();
    cerrarResumenFiltros();
    actualizarEstadoVisualQuickFiltersPenal();
    ordenFechaListado = 'actualizacion';
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
        const delegacionNombre = obtenerNombreDelegacionCaso(caso);
        const delitoNombre = caso.delito_nombre || obtenerNombreDelito(caso.delito_id) || '---';
        const denunciante = resumenDenunciantePenal(caso);
        const responsable = resumenResponsablePenal(caso);
        const anioCarpeta = obtenerAnioPenal(caso);
        const faseActual = obtenerFaseActualPenal(caso);
        const requerimientosPendientes = obtenerRequerimientosPendientesPenal(caso);
        const fechaPresentacion = obtenerFechaPresentacionPenal(caso);
        const fechaConocimientoAmp = obtenerFechaConocimientoAmpPenal(caso);
        const cuantia = obtenerCuantiaPenal(caso);
        const tieneConocimientoAmp = tieneFechaConocimientoAmpPenal(caso);
        const badgeEstatus = caso.estatus === 'TRAMITE'
            ? '<span class="badge badge-tramite penal-status-badge">En trámite</span>'
            : '<span class="badge badge-concluido penal-status-badge">Concluido</span>';
        const badgeFase = `<span class="badge badge-neutral-soft">${faseActual}</span>`;
        const badgePendientes = requerimientosPendientes === 'Sin pendientes'
            ? '<span class="badge badge-success-soft">Sin pendientes</span>'
            : `<span class="badge badge-warning-outline">${requerimientosPendientes}</span>`;
        const badgeCoadyuvancia = esCoadyuvanciaPenal(caso)
            ? '<span class="badge badge-primary-soft">Sí</span>'
            : '<span class="badge badge-neutral-soft">No</span>';

        return `
            <tr>
                <td><small>${delegacionNombre}</small></td>
                <td class="cell-center">${badgeEstatus}</td>
                <td>
                    <a href="#" class="expediente-link" onclick="verDetalle(${caso.id}); return false;">
                        <strong>${caso.numero_expediente || '---'}</strong>
                    </a>
                    <small class="expediente-meta-texto">${formatearFechaRelativa(caso.fecha_actualizacion || caso.fecha_creacion)}</small>
                </td>
                <td class="cell-center"><small>${anioCarpeta}</small></td>
                <td><small>${delitoNombre}</small></td>
                <td>${denunciante}</td>
                <td>${responsable}</td>
                <td class="cell-center"><small>${escapeHtml(cuantia)}</small></td>
                <td class="cell-center">${badgeFase}</td>
                <td class="cell-center">${badgePendientes}</td>
                <td class="cell-center"><small>${fechaPresentacion}</small></td>
                <td class="cell-center"><small>${fechaConocimientoAmp}</small></td>
                <td class="cell-center">${badgeCoadyuvancia}</td>
                <td class="td-sticky-right">
                    <div class="menu-container" id="menu-container-${caso.id}">
                        <button class="menu-trigger" onclick="toggleMenu(${caso.id})" id="menu-trigger-${caso.id}">
                            &#8942;
                        </button>
                        <div class="menu-dropdown" id="menu-${caso.id}">
                            <div class="menu-item" onclick="verDetalle(${caso.id})">
                                Ver detalle
                            </div>
                            <div class="menu-item" onclick="verRequerimientos(${caso.id})">
                                Requerimientos ministeriales
                            </div>
                            ${usuarioActual && (usuarioActual.rol === 'admin' || (usuarioActual.rol !== 'consulta' && !tieneConocimientoAmp)) ? `
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                Registro AMP
                            </div>` : ''}
                            ${usuarioActual && usuarioActual.rol !== 'consulta' && tieneConocimientoAmp ? `
                            <div class="menu-item" onclick="verActuacionesPenales(${caso.id})">
                                Actuaciones penales
                            </div>` : ''}
                            ${usuarioActual && usuarioActual.rol === 'admin' ? `
                            <div class="menu-item" onclick="editarCaso(${caso.id})">
                                Editar datos
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
    const paginasVisibles = construirPaginasVisibles(totalPaginas, paginaActual);
    const paginasHtml = paginasVisibles.map(item => {
        if (item === '...') {
            return '<span class="paginacion-ellipsis">...</span>';
        }

        return `<button class="paginacion-btn ${item === paginaActual ? 'is-active' : ''}" onclick="irAPagina(${item})">${item}</button>`;
    }).join('');

    contenedor.innerHTML = `
        <span class="paginacion-info">Mostrando ${inicio}-${fin} de ${casosFiltrados.length} asuntos</span>
        <div class="paginacion-controles">
            <button class="paginacion-btn" onclick="irAPagina(1)" ${paginaActual === 1 ? 'disabled' : ''}>&#171;</button>
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual - 1})" ${paginaActual === 1 ? 'disabled' : ''}>&#8249;</button>
            ${paginasHtml}
            <button class="paginacion-btn" onclick="irAPagina(${paginaActual + 1})" ${paginaActual === totalPaginas ? 'disabled' : ''}>&#8250;</button>
            <button class="paginacion-btn" onclick="irAPagina(${totalPaginas})" ${paginaActual === totalPaginas ? 'disabled' : ''}>&#187;</button>
            <span class="paginacion-pagina">Página ${paginaActual} de ${totalPaginas}</span>
        </div>
    `;
}

function construirPaginasVisibles(totalPaginas, pagina) {
    if (totalPaginas <= 7) {
        return Array.from({ length: totalPaginas }, (_, index) => index + 1);
    }

    const paginas = [1];
    const inicio = Math.max(2, pagina - 1);
    const fin = Math.min(totalPaginas - 1, pagina + 1);

    if (inicio > 2) paginas.push('...');

    for (let i = inicio; i <= fin; i++) {
        paginas.push(i);
    }

    if (fin < totalPaginas - 1) paginas.push('...');

    paginas.push(totalPaginas);
    return paginas;
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
    if (Array.isArray(persona)) {
        const nombres = persona
            .map(item => getPersonaNombre(item))
            .filter(nombre => nombre && nombre !== '---');
        return nombres.join(' | ') || '---';
    }
    if (persona.tipo_persona === 'FISICA') {
        return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || '---';
    }
    if (persona.tipo_persona === 'MORAL') {
        return persona.empresa || '---';
    }
    if (typeof persona === 'object') {
        const textoLibre = persona.nombre || persona.nombre_completo || persona.descripcion || persona.valor || '';
        if (String(textoLibre).trim()) {
            return String(textoLibre).trim();
        }
    }
    if (typeof persona === 'string') {
        try { return getPersonaNombre(JSON.parse(persona)); } catch (e) { return '---'; }
    }
    return '---';
}

function escapeHtml(texto) {
    return String(texto ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function obtenerAnioPenal(caso) {
    if (caso?.anio) return String(caso.anio);
    if (caso?.fecha_inicio) {
        const matchFecha = String(caso.fecha_inicio).match(/^(\d{4})/);
        if (matchFecha) return matchFecha[1];
    }
    if (caso?.numero_expediente) {
        const matchExpediente = String(caso.numero_expediente).match(/(20\d{2})/);
        if (matchExpediente) return matchExpediente[1];
    }
    return '---';
}

function obtenerFaseActualPenal(caso) {
    if (caso?.fecha_conocimiento_amp || caso?.fecha_conocimiento_fiscal) {
        return 'Seguimiento penal';
    }
    return 'Registro inicial';
}

function tieneRequerimientosPendientesPenal(caso) {
    return caso?.tiene_requerimientos_pendientes === true;
}

function obtenerRequerimientosPendientesPenal(caso) {
    return tieneRequerimientosPendientesPenal(caso) ? 'Pendientes' : 'Sin pendientes';
}

function obtenerFechaPresentacionPenal(caso) {
    return formatearFecha(
        caso?.fecha_presentacion_denuncia ||
        caso?.fecha_denuncia ||
        caso?.fecha_presentacion ||
        caso?.fecha_inicio ||
        ''
    );
}

function obtenerFechaConocimientoAmpPenal(caso) {
    return formatearFecha(caso?.fecha_conocimiento_amp || caso?.fecha_conocimiento_fiscal || '');
}

function tieneFechaConocimientoAmpPenal(caso) {
    return Boolean(caso?.fecha_conocimiento_amp || caso?.fecha_conocimiento_fiscal);
}

function obtenerCuantiaPenal(caso) {
    if (!caso || typeof caso !== 'object') {
        return 'Sin determinar';
    }

    if (caso.sin_cuantificar === true || caso.sin_cuantia === true) {
        return 'Sin cuantificar';
    }

    const candidatosTexto = [
        caso.cuantia_texto,
        caso.cuantia,
        caso.monto_texto
    ];

    for (const valor of candidatosTexto) {
        if (typeof valor === 'string' && valor.trim() !== '') {
            return valor.trim();
        }
    }

    const candidatosNumero = [
        caso.monto,
        caso.importe,
        caso.importe_demandado
    ];

    for (const valor of candidatosNumero) {
        const numero = Number(valor);
        if (!Number.isNaN(numero) && numero > 0) {
            return formatearMonedaPenal(numero);
        }
    }

    return 'Sin determinar';
}

function esCoadyuvanciaPenal(caso) {
    return Boolean(
        caso?.imss_coadyuvante === true ||
        caso?.coadyuvancia === true ||
        caso?.es_coadyuvancia === true
    );
}

function extraerNombresPenal(persona) {
    if (!persona) return [];
    if (Array.isArray(persona)) {
        return persona
            .map(item => getPersonaNombre(item))
            .filter(nombre => nombre && nombre !== '---');
    }

    const nombre = getPersonaNombre(persona);
    return nombre && nombre !== '---' ? [nombre] : [];
}

function esNombreImss(nombre) {
    const texto = String(nombre || '').toUpperCase();
    return texto.includes('INSTITUTO MEXICANO DEL SEGURO SOCIAL') || texto === 'IMSS' || texto.includes(' IMSS');
}

function resumenDenunciantePenal(caso) {
    const nombres = extraerNombresPenal(caso?.denunciante);
    if (nombres.length === 0) {
        return '<small>---</small>';
    }

    let principal = nombres[0];
    let secundario = '';
    const nombreImss = nombres.find(nombre => esNombreImss(nombre)) || 'Instituto Mexicano del Seguro Social';
    const nombresSinImss = nombres.filter(nombre => !esNombreImss(nombre));

    if (esCoadyuvanciaPenal(caso)) {
        const denunciantePrincipal = nombresSinImss[0];
        principal = denunciantePrincipal || principal;
        secundario = 'IMSS como coadyuvante';
    } else if (esNombreImss(principal) && nombresSinImss.length > 0) {
        principal = nombreImss;
        secundario = nombresSinImss.length === 1
            ? `con ${nombresSinImss[0]}`
            : `con ${nombresSinImss[0]} + ${nombresSinImss.length - 1}`;
    } else if (nombres.length > 1) {
        secundario = `+ ${nombres.length - 1} adicional${nombres.length - 1 > 1 ? 'es' : ''}`;
    }

    return `
        <div class="penal-main-cell">
            <span class="penal-main-cell-primary">${escapeHtml(principal)}</span>
            ${secundario ? `<small class="penal-main-cell-secondary">${escapeHtml(secundario)}</small>` : ''}
        </div>
    `;
}

function resumenResponsablePenal(caso) {
    const nombres = extraerNombresPenal(caso?.probable_responsable);
    let principal = nombres[0] || '---';

    if (caso?.qrr === true || String(caso?.probable_responsable || '').toUpperCase() === 'QRR') {
        principal = 'QRR';
    }

    if (principal === '---') {
        return '<small>---</small>';
    }

    const secundario = nombres.length > 1 ? `+ ${nombres.length - 1} adicional${nombres.length - 1 > 1 ? 'es' : ''}` : '';

    return `
        <div class="penal-main-cell">
            <span class="penal-main-cell-primary">${escapeHtml(principal)}</span>
            ${secundario ? `<small class="penal-main-cell-secondary">${escapeHtml(secundario)}</small>` : ''}
        </div>
    `;
}

function formatearMonedaPenal(valor) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    }).format(valor);
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

function cerrarMenusPenalAbiertos() {
    document.querySelectorAll('.menu-dropdown.show').forEach(m => {
        m.classList.remove('show');
        const id = m.id.replace('menu-', '');
        const origContainer = document.getElementById(`menu-container-${id}`);
        if (origContainer && m.parentElement === document.body) {
            origContainer.appendChild(m);
        }
    });
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

function verRequerimientos(id) {
    window.location.href = `listadoRequerimientosPenal.html?id=${id}`;
}

function verActuacionesPenales(id) {
    window.location.href = `registroActuacionPenal.html?id=${id}`;
}

async function confirmarEliminar(id) {
    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar asunto',
        message: '¿Estás seguro de que deseas eliminar este asunto? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) {
        return;
    }

    try {
        await eliminarCasoPenalApi(id);
        await cargarCasos();
    } catch (err) {
        console.error('Error al eliminar:', err);
        await window.appAlert?.({
            title: 'No se pudo eliminar el asunto',
            message: err.message || 'Ocurrió un problema al eliminar el asunto.'
        });
    }
}

function toggleMenu(casoId) {
    // Cerrar todos los demas menus y regresarlos a su contenedor
    const hayOtroMenuAbierto = Array.from(document.querySelectorAll('.menu-dropdown.show'))
        .some(m => m.id !== `menu-${casoId}`);

    if (hayOtroMenuAbierto) {
        cerrarMenusPenalAbiertos();
    }

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



