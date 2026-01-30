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
    document.getElementById('filtroPosicionIMSS').addEventListener('change', filtrarCasos);
    document.getElementById('fechaDesde').addEventListener('change', filtrarCasos);
    document.getElementById('fechaHasta').addEventListener('change', filtrarCasos);
    
    // Mostrar casos
    filtrarCasos();
});

function limpiarFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filtroDelegacion').value = '';
    document.getElementById('filtroEstatus').value = '';
    document.getElementById('filtroTipo').value = '';
    document.getElementById('filtroPosicionIMSS').value = '';
    document.getElementById('fechaDesde').value = '';
    document.getElementById('fechaHasta').value = '';
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

function filtrarCasos() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const delegacionId = document.getElementById('filtroDelegacion').value;
    const estatus = document.getElementById('filtroEstatus').value;
    const tipo = document.getElementById('filtroTipo').value;
    
    casosFiltrados = todosLosCasos.filter(caso => {
        // 1. Obtener valores seguros (si es null, usamos string vacío)
        const expediente = (caso.numero_expediente || '').toLowerCase();
        const actor = getActorNombre(caso.actor).toLowerCase();
        const demandados = getDemandadosNombres(caso).toLowerCase();

        // Filtro de búsqueda (Buscador ahora es a prueba de fallos)
        const cumpleBusqueda = !searchTerm || 
            expediente.includes(searchTerm) ||
            actor.includes(searchTerm) ||
            demandados.includes(searchTerm);
        
        // Filtro de delegación
        const cumpleDelegacion = !delegacionId || caso.delegacion_id == delegacionId;
        
        // Filtro de estatus
        const cumpleEstatus = !estatus || caso.estatus === estatus;
        
        // Filtro de tipo
        const cumpleTipo = !tipo || caso.tipo_juicio === tipo;
        
        return cumpleBusqueda && cumpleDelegacion && cumpleEstatus && cumpleTipo;
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
        
        // Color del número según estatus
        const claseNumero = caso.estatus === 'CONCLUIDO' ? 'numero-concluido' : 'numero-tramite';
        
        return `
            <tr>
                <td><strong class="${claseNumero}">${caso.numero}</strong></td>
                <td>
                    <a href="#" class="expediente-link" onclick="verDetalle(${caso.id}); return false;">
                        <strong>${caso.numero_expediente}</strong>
                    </a>
                    ${caso.acumulado_a ? '<br><small style="color: var(--color-text-light);">↳ Acumulado a ' + obtenerNumeroExpediente(caso.acumulado_a) + '</small>' : ''}
                </td>
                <td>${delegacion ? delegacion.nombre : 'N/A'}</td>
                <td>
                    <span style="font-weight: 600;">${caso.tipo_juicio}</span><br>
                    <small style="color: var(--color-text-light);">${caso.subtipo_juicio || ''}${caso.sub_subtipo_juicio ? ' - ' + caso.sub_subtipo_juicio : ''}</small>
                </td>
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
                                Editar
                            </div>
                            <div class="menu-item danger" onclick="eliminarCaso(${caso.id})">
                                Eliminar
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
    
    // Verificamos que existan las propiedades antes de usarlas
    if (actor.tipo_persona === 'FISICA') {
        const nombreCompleto = `${actor.nombres || ''} ${actor.apellido_paterno || ''} ${actor.apellido_materno || ''}`;
        return nombreCompleto.trim() || 'Nombre desconocido';
    }
    
    // Si es MORAL, devolvemos la empresa o un texto por defecto
    return actor.empresa || 'Empresa desconocida';
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
            const nombre = `${d.nombres || ''} ${d.apellido_paterno || ''}`;
            return nombre.trim();
        }
        return d.empresa || 'Empresa S/N';
    }).join(', '); // El .join siempre devuelve string, así que es seguro
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
                <strong style="color: var(--color-primary);">${c.numero_expediente}</strong>
                <span class="badge badge-concluido">Concluido</span>
            </div>
            <div style="font-size: 14px; color: var(--color-text-light);">
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
    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;
    
    // Por ahora muestra un alert con info básica
    // En futuro: ir a detalle-caso.html?id=X
    const delegacion = obtenerDelegacion(caso.delegacion_id);
    const prestacion = catalogos.prestaciones.find(p => p.id === caso.prestacion_reclamada);
    
    let detalle = `EXPEDIENTE: ${caso.numero_expediente}\n`;
    detalle += `DELEGACIÓN: ${delegacion ? delegacion.nombre : 'N/A'}\n`;
    detalle += `TIPO: ${caso.tipo_juicio} - ${caso.subtipo_juicio}\n`;
    detalle += `FECHA INICIO: ${formatearFecha(caso.fecha_inicio)}\n`;
    detalle += `ACTOR: ${getActorNombre(caso.actor)}\n`;
    detalle += `DEMANDADO: ${getDemandadosNombres(caso)}\n`;
    detalle += `IMPORTE: ${caso.importe_demandado > 0 ? formatearMoneda(caso.importe_demandado) : 'Sin cuantía'}\n`;
    detalle += `PRESTACIÓN: ${prestacion ? prestacion.nombre : 'N/A'}\n`;
    detalle += `IMSS ES: ${caso.imss_es}\n`;
    detalle += `ESTATUS: ${caso.estatus}`;
    
    alert(detalle);
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
    
    // Por ahora solo alert
    // En futuro: ir a editar-caso.html?id=X
    alert(`Editar caso #${casoId}\n\n(En la versión completa esto abrirá el formulario de edición)`);
}

function eliminarCaso(casoId) {
    // Cerrar menú
    const menu = document.getElementById(`menu-${casoId}`);
    if (menu) menu.classList.remove('show');
    
    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;
    
    if (!confirm(`¿Estás seguro de eliminar el caso ${caso.numero_expediente}?\n\nEsta acción no se puede deshacer.`)) {
        return;
    }
    
    // Eliminar del array
    todosLosCasos = todosLosCasos.filter(c => c.id !== casoId);
    
    // Actualizar localStorage
    localStorage.setItem('casos', JSON.stringify(todosLosCasos));
    
    // Refrescar tabla
    filtrarCasos();
    
    alert('Caso eliminado exitosamente');
}

// Cerrar menús al hacer clic fuera
document.addEventListener('click', function(e) {
    if (!e.target.closest('.menu-container')) {
        document.querySelectorAll('.menu-dropdown').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});