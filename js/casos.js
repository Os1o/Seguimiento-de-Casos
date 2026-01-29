// =====================================================
// CASOS.JS - Gestión de lista de casos
// =====================================================

let casosFiltrados = [];
let todosLosCasos = [];

// En js/casos.js, asegúrate de que no haya errores al leer
function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr || usuarioStr === "undefined") { // Añade validación extra
        window.location.href = 'login.html';
        return null;
    }
    try {
        return JSON.parse(usuarioStr);
    } catch (e) {
        return null; 
    }
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
    
    // Mostrar casos
    filtrarCasos();
});

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
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const delegacionId = document.getElementById('filtroDelegacion').value;
    const estatus = document.getElementById('filtroEstatus').value;
    const tipo = document.getElementById('filtroTipo').value;
    
    casosFiltrados = todosLosCasos.filter(caso => {
        // Filtro de búsqueda
        const cumpleBusqueda = !searchTerm || 
            caso.numero_expediente.toLowerCase().includes(searchTerm) ||
            (caso.actor && getActorNombre(caso.actor).toLowerCase().includes(searchTerm)) ||
            getDemandadosNombres(caso).toLowerCase().includes(searchTerm);
        
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
        const actorNombre = getActorNombre(caso.actor);
        const demandadosNombres = getDemandadosNombres(caso);
        
        return `
            <tr>
                <td><strong>${caso.numero}</strong></td>
                <td>
                    <strong>${caso.numero_expediente}</strong>
                    ${caso.acumulado_a ? '<br><small style="color: var(--color-text-light);">↳ Acumulado a #' + caso.acumulado_a + '</small>' : ''}
                </td>
                <td>${delegacion ? delegacion.nombre : 'N/A'}</td>
                <td>
                    <span style="font-weight: 600;">${caso.tipo_juicio}</span><br>
                    <small style="color: var(--color-text-light);">${caso.subtipo_juicio || ''}</small>
                </td>
                <td>${formatearFecha(caso.fecha_inicio)}</td>
                <td>${actorNombre}</td>
                <td>${demandadosNombres}</td>
                <td><strong>${caso.importe_demandado > 0 ? formatearMoneda(caso.importe_demandado) : '-'}</strong></td>
                <td>
                    <span class="badge ${getBadgeClass(caso.imss_es)}">
                        ${caso.imss_es}
                    </span>
                </td>
                <td>
                    <span class="badge ${caso.estatus === 'TRAMITE' ? 'badge-tramite' : 'badge-concluido'}">
                        ${caso.estatus === 'TRAMITE' ? '⏳ Trámite' : '✓ Concluido'}
                    </span>
                </td>
                <td>
                    ${caso.juicios_acumulados && caso.juicios_acumulados.length > 0 
                        ? `<button onclick="verAcumulados(${caso.id})" class="btn-link">${caso.juicios_acumulados.length} casos</button>`
                        : '-'
                    }
                </td>
                <td>
                    <button onclick="verDetalle(${caso.id})" class="btn btn-secondary btn-icon" style="padding: 4px 12px; font-size: 12px;">
                        Ver
                    </button>
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
    // Por ahora solo mostramos un alert
    // En futuro: ir a detalle-caso.html?id=X
    const caso = todosLosCasos.find(c => c.id === casoId);
    if (!caso) return;
    
    alert(`Detalle del caso #${caso.numero_expediente}\n\n(En la versión completa esto abrirá una página con todos los detalles)`);
}