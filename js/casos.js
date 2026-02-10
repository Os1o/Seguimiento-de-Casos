// =====================================================
// CASOS.JS - Gestión de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];

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

document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const usuario = verificarSesion();
    if (!usuario) return;
    
    // Mostrar nombre de usuario
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;
    
    // Cargar casos (fake o localStorage)
    cargarCasos();
    
    // Llenar filtros
    llenarFiltros();
    
    // Event listeners para filtros y búsqueda
    document.getElementById('searchInput').addEventListener('input', filtrarCasos);
    document.getElementById('filtroDelegacion').addEventListener('change', filtrarCasos);
    document.getElementById('filtroEstatus').addEventListener('change', filtrarCasos);
    document.getElementById('filtroTipo').addEventListener('change', filtrarCasos);
    document.getElementById('filtroJurisdiccion').addEventListener('change', filtrarCasos);
    document.getElementById('filtroPosicionIMSS').addEventListener('change', filtrarCasos);
    // fechaDesde / fechaHasta - COMENTADO, se usará en otra funcionalidad
    // document.getElementById('fechaDesde').addEventListener('change', filtrarCasos);
    // document.getElementById('fechaHasta').addEventListener('change', filtrarCasos);
    
    // Mostrar casos
    filtrarCasos();
});

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filtroDelegacion').value = '';
    document.getElementById('filtroEstatus').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroJurisdiccion').value = '';
    document.getElementById('filtroPosicionIMSS').value = '';
    // Ocultar todos los selects de filtro
    document.querySelectorAll('.filtro-select').forEach(s => {
        s.style.display = 'none';
        s.closest('th').querySelector('.filtro-btn').classList.remove('filtro-activo');
    });
    // document.getElementById('fechaDesde').value = '';
    // document.getElementById('fechaHasta').value = '';
    filtrarCasos();
}

function cargarCasos() {
    // Intentar cargar casos del localStorage
    const casosGuardados = localStorage.getItem('casos');
    
    if (casosGuardados) {
        todosLosCasos = JSON.parse(casosGuardados);
    } else {
        // Usar casos fake
        todosLosCasos = [...casosFake];
        // Guardar en localStorage para persistencia
        localStorage.setItem('casos', JSON.stringify(todosLosCasos));
    }
}

function llenarFiltros() {
    const selectDelegacion = document.getElementById('filtroDelegacion');
    
    catalogos.delegaciones.forEach(deleg => {
        const option = document.createElement('option');
        option.value = deleg.id;
        option.textContent = deleg.nombre;
        selectDelegacion.appendChild(option);
    });
}

function toggleFiltro(id) {
    const select = document.getElementById(id);
    const btn = select.closest('th').querySelector('.filtro-btn');
    const visible = select.style.display !== 'none';
    
    // Cerrar todos los demás
    document.querySelectorAll('.filtro-select').forEach(s => s.style.display = 'none');
    
    // Abrir/cerrar el actual
    if (!visible) {
        select.style.display = 'block';
        select.focus();
    }
}

function filtrarCasos() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    const delegacionId = document.getElementById('filtroDelegacion').value;
    const estatus = document.getElementById('filtroEstatus').value;
    const tipo = document.getElementById('filtroTipo').value;
    const jurisdiccion = document.getElementById('filtroJurisdiccion').value;
    const posicionIMSS = document.getElementById('filtroPosicionIMSS').value;
    // const fechaDesde = document.getElementById('fechaDesde').value;
    // const fechaHasta = document.getElementById('fechaHasta').value;
    
    // Marcar botones con filtro activo
    const filtros = { filtroDelegacion: delegacionId, filtroEstatus: estatus, filtroTipo: tipo, filtroJurisdiccion: jurisdiccion, filtroPosicionIMSS: posicionIMSS };
    Object.entries(filtros).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) {
            const btn = el.closest('th') && el.closest('th').querySelector('.filtro-btn');
            if (btn) btn.classList.toggle('filtro-activo', !!val);
        }
    });
    
    casosFiltrados = todosLosCasos.filter(caso => {
        let cumpleBusqueda = true;
        if (searchTerm) {
            const expediente = (caso.numero_expediente || '').toLowerCase();
            const actorNombre = getActorNombre(caso.actor).toLowerCase();
            const demandadosNombre = getDemandadosNombres(caso).toLowerCase();
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
        let cumpleFechaDesde = true;
        if (fechaDesde) cumpleFechaDesde = caso.fecha_inicio >= fechaDesde;
        let cumpleFechaHasta = true;
        if (fechaHasta) cumpleFechaHasta = caso.fecha_inicio <= fechaHasta;
        */
        
        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo && cumpleJurisdiccion && cumplePosicionIMSS;
    });
    
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
        return;
    }
    
    mensajeVacio.style.display = 'none';
    
    tbody.innerHTML = casosFiltrados.map(caso => {
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
                                ✏️ Editar datos
                            </div>
                            <div class="menu-item" onclick="actualizarSeguimiento(${caso.id})">
                                📝 Actualizar seguimiento
                            </div>
                            <div class="menu-item danger" onclick="confirmarEliminar(${caso.id})">
                                🗑️ Eliminar
                            </div>
                        </div>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function getActorNombre(actor) {
    if (!actor) return 'IMSS';
    if (actor.tipo_persona === 'FISICA') {
        return `${actor.nombres} ${actor.apellido_paterno} ${actor.apellido_materno}`;
    }
    return actor.empresa;
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
    switch(imssEs) {
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
    // Cerrar otros menús abiertos
    document.querySelectorAll('.menu-dropdown').forEach(menu => {
        if (menu.id !== `menu-${casoId}`) {
            menu.classList.remove('show');
        }
    });
    
    // Toggle este menú
    const menu = document.getElementById(`menu-${casoId}`);
    menu.classList.toggle('show');
}

function editarCaso(casoId) {
    // Cerrar menú
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');
    
    // Redirigir a formulario de edición
    window.location.href = `nuevo-caso.html?editar=${casoId}`;
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
document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-container')) {
        document.querySelectorAll('.menu-dropdown').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});