// =====================================================
// DETALLE CASO PENAL
// =====================================================

let usuarioActual = null;
let casoActual = null;

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) { window.location.href = 'login.html'; return null; }
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

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Obtener ID del caso
    const params = new URLSearchParams(window.location.search);
    const casoId = parseInt(params.get('id'));
    if (!casoId) {
        alert('No se especificó un asunto.');
        window.location.href = 'penal.html';
        return;
    }

    try { await cargarCatalogos(); } catch (e) { console.warn('Supabase no disponible'); }

    // Cargar caso desde Supabase
    try {
        casoActual = await obtenerCasoPenal(casoId);
    } catch (err) {
        console.warn('No se pudo cargar desde Supabase, usando cache local:', err);
        const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
        casoActual = casos.find(c => c.id === casoId);
    }

    if (!casoActual) {
        alert('Asunto no encontrado.');
        window.location.href = 'penal.html';
        return;
    }

    // Botones de acción según rol
    if (usuarioActual.rol === 'consulta') {
        document.getElementById('btnEditar').style.display = 'none';
        document.getElementById('btnActualizar').style.display = 'none';
        document.getElementById('btnEliminar').style.display = 'none';
    } else if (usuarioActual.rol !== 'admin') {
        document.getElementById('btnEditar').style.display = 'none';
        document.getElementById('btnEliminar').style.display = 'none';
    }

    renderizarDetalle();
});

function renderizarDetalle() {
    const caso = casoActual;

    // Breadcrumb y tarjeta principal
    document.getElementById('breadcrumbExpediente').textContent = caso.numero_expediente;
    document.getElementById('numeroExpediente').textContent = caso.numero_expediente;

    // Fechas de registro
    document.getElementById('fechaCreacion').textContent = formatearFecha(caso.fecha_creacion || caso.fecha_inicio);
    if (caso.fecha_actualizacion) {
        document.getElementById('fechaActualizacionInfo').style.display = '';
        document.getElementById('fechaActualizacion').textContent = formatearFecha(caso.fecha_actualizacion);
    }

    // Badge estatus
    const badgeEstatus = document.getElementById('badgeEstatus');
    if (caso.estatus === 'TRAMITE') {
        badgeEstatus.textContent = 'En Trámite';
        badgeEstatus.className = 'badge-estatus badge-warning';
    } else {
        badgeEstatus.textContent = 'Concluido';
        badgeEstatus.className = 'badge-estatus badge-success';
    }

    // Sección 1: Datos del registro
    const delegacion = obtenerDelegacion(caso.delegacion_id);
    document.getElementById('delegacion').textContent = delegacion ? delegacion.nombre : '---';
    document.getElementById('fechaInicio').textContent = formatearFecha(caso.fecha_inicio);

    const delitoNombre = obtenerNombreDelitoLocal(caso.delito_id);
    document.getElementById('delito').textContent = delitoNombre || '---';

    document.getElementById('abogadoResponsable').textContent = caso.abogado_responsable || '';
    if (!caso.abogado_responsable) {
        document.getElementById('abogadoResponsable').innerHTML = '<span class="info-vacio">Sin asignar</span>';
    }

    // Partes
    document.getElementById('denunciante').textContent = getPersonaNombreLocal(caso.denunciante);
    document.getElementById('probableResponsable').textContent = getPersonaNombreLocal(caso.probable_responsable);

    // Sección 2: Estatus investigación y estado procesal
    document.getElementById('estatusInvestigacionJSJ').textContent = caso.estatus_investigacion_jsj || '---';

    const estadoProcesal = obtenerNombreEstadoProcesalLocal(caso.estado_procesal_id);
    document.getElementById('estadoProcesal').textContent = estadoProcesal || '---';
    document.getElementById('fechaConocimientoAmp').textContent = formatearFecha(caso.fecha_conocimiento_amp);
    document.getElementById('fechaJudicializacion').textContent = formatearFecha(caso.fecha_judicializacion);
    document.getElementById('determinacionJudicial').textContent = caso.determinacion_judicial || '---';

    if (caso.acciones_pendientes) {
        document.getElementById('accionesPendientes').textContent = caso.acciones_pendientes;
    }

    // Sección 3: Sentencia y conclusión
    if (caso.sentencia) {
        const badgeSentencia = caso.sentencia === 'FAVORABLE'
            ? '<span class="badge badge-success">Favorable</span>'
            : '<span class="badge badge-danger">Desfavorable</span>';
        document.getElementById('sentencia').innerHTML = badgeSentencia;
    } else {
        document.getElementById('sentencia').innerHTML = '<span class="info-vacio">Sin sentencia</span>';
    }
    document.getElementById('fechaSentencia').textContent = formatearFecha(caso.fecha_sentencia);
    document.getElementById('fechaConclusion').textContent = formatearFecha(caso.fecha_conclusion);

    if (caso.dato_relevante) {
        document.getElementById('datoRelevante').textContent = caso.dato_relevante;
    }

    // Sección 4: Seguimiento
    const seg = caso.seguimiento;
    if (seg && seg.fecha_actuacion) {
        document.getElementById('fechaActuacion').textContent = formatearFecha(seg.fecha_actuacion);
        document.getElementById('tipoActuacion').textContent = seg.tipo_actuacion || '---';
        document.getElementById('descripcionActuacion').textContent = seg.descripcion || '---';
    }

    renderizarTimeline();
}

function renderizarTimeline() {
    const container = document.getElementById('timeline');
    let seguimientos = casoActual.seguimientos || [];
    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-light); text-align: center; padding: 20px;">Sin actuaciones registradas</p>';
        return;
    }

    seguimientos.sort((a, b) => new Date(b.fecha_actuacion) - new Date(a.fecha_actuacion));

    container.innerHTML = seguimientos.map(seg => `
        <div class="timeline-item">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <span class="timeline-date">${formatearFecha(seg.fecha_actuacion)}</span>
                    <span class="timeline-type">${seg.tipo_actuacion || ''}</span>
                </div>
                <div class="timeline-desc">${seg.descripcion || ''}</div>
            </div>
        </div>
    `).join('');
}

// =====================================================
// ACCIONES
// =====================================================

function editarDatos() {
    window.location.href = `editarCasoPenal.html?id=${casoActual.id}`;
}

function abrirActualizacion() {
    window.location.href = `actualizarCasoPenal.html?id=${casoActual.id}`;
}

async function eliminarCaso() {
    if (!confirm('¿Estás seguro de que deseas eliminar este asunto? Esta acción no se puede deshacer.')) return;

    try {
        await eliminarCasoPenal(casoActual.id);
        eliminarCacheCasoPenal(casoActual.id);
        alert('Asunto eliminado.');
        window.location.href = 'penal.html';
    } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar el asunto: ' + err.message);
    }
}

// =====================================================
// HELPERS
// =====================================================

function getPersonaNombreLocal(persona) {
    if (!persona) return '---';
    if (typeof persona === 'string') {
        try { return getPersonaNombreLocal(JSON.parse(persona)); } catch (e) { return '---'; }
    }
    if (persona.tipo_persona === 'FISICA') {
        return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || '---';
    }
    if (persona.tipo_persona === 'MORAL') {
        return persona.empresa || '---';
    }
    return '---';
}

function obtenerNombreDelitoLocal(id) {
    if (!id) return null;
    if (catalogosCargados && catalogosDB.delitos.length > 0) {
        const d = catalogosDB.delitos.find(d => d.id === id);
        return d ? d.nombre : null;
    }
    const delitos = {
        1: 'ABUSO DE CONFIANZA', 5: 'COHECHO', 7: 'DAÑOS', 13: 'FALSIFICACIÓN DE DOCUMENTOS',
        17: 'FRAUDE', 20: 'HOMICIDIO POR OMISIÓN EN AGRAVIO', 22: 'LESIONES', 27: 'ROBO',
        35: 'SUPLANTACION DE IDENTIDAD'
    };
    return delitos[id] || null;
}

function obtenerNombreEstadoProcesalLocal(id) {
    if (!id) return null;
    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        const e = catalogosDB.estadosProcesales.find(e => e.id === id);
        return e ? e.nombre : null;
    }
    const estados = {
        1: 'Etapa de investigación',
        2: 'Etapa intermedia o etapa de preparación a juicio',
        3: 'Etapa de juicio oral'
    };
    return estados[id] || null;
}
