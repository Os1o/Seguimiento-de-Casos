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

    // Cargar caso
    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert('Asunto no encontrado.');
        window.location.href = 'penal.html';
        return;
    }

    // Botones de acción según rol
    if (usuarioActual.rol === 'consulta') {
        document.getElementById('botonesAccion').style.display = 'none';
    } else {
        document.getElementById('btnEditar').href = `editarCasoPenal.html?id=${casoId}`;
        document.getElementById('btnActualizar').href = `actualizarCasoPenal.html?id=${casoId}`;

        if (usuarioActual.rol !== 'admin') {
            document.getElementById('btnEditar').style.display = 'none';
            document.getElementById('btnEliminar').style.display = 'none';
        }
    }

    renderizarDetalle();
});

function renderizarDetalle() {
    const caso = casoActual;

    // Breadcrumb y título
    document.getElementById('breadcrumbExpediente').textContent = caso.numero_expediente;
    document.getElementById('tituloExpediente').textContent = caso.numero_expediente;

    // Información general
    const delegacion = obtenerDelegacion(caso.delegacion_id);
    document.getElementById('delegacion').textContent = delegacion ? delegacion.nombre : '---';
    document.getElementById('expediente').textContent = caso.numero_expediente;
    document.getElementById('fechaInicio').textContent = formatearFecha(caso.fecha_inicio);

    const delitoNombre = obtenerNombreDelitoLocal(caso.delito_id);
    document.getElementById('delito').textContent = delitoNombre || '---';

    const badgeEstatus = caso.estatus === 'TRAMITE'
        ? '<span class="badge badge-warning">En Trámite</span>'
        : '<span class="badge badge-success">Concluido</span>';
    document.getElementById('estatus').innerHTML = badgeEstatus;

    document.getElementById('abogadoResponsable').textContent = caso.abogado_responsable || '---';

    // Partes
    document.getElementById('denunciante').textContent = getPersonaNombreLocal(caso.denunciante);
    document.getElementById('probableResponsable').textContent = getPersonaNombreLocal(caso.probable_responsable);

    // Estado procesal
    const estadoProcesal = obtenerNombreEstadoProcesalLocal(caso.estado_procesal_id);
    document.getElementById('estadoProcesal').textContent = estadoProcesal || '---';
    document.getElementById('fechaConocimientoAmp').textContent = formatearFecha(caso.fecha_conocimiento_amp);
    document.getElementById('fechaJudicializacion').textContent = formatearFecha(caso.fecha_judicializacion);
    document.getElementById('determinacionJudicial').textContent = caso.determinacion_judicial || '---';
    document.getElementById('accionesPendientes').textContent = caso.acciones_pendientes || '---';

    // Sentencia
    if (caso.sentencia) {
        const badgeSentencia = caso.sentencia === 'FAVORABLE'
            ? '<span class="badge badge-success">Favorable</span>'
            : '<span class="badge badge-danger">Desfavorable</span>';
        document.getElementById('sentencia').innerHTML = badgeSentencia;
    } else {
        document.getElementById('sentencia').textContent = 'Sin sentencia';
    }
    document.getElementById('fechaSentencia').textContent = formatearFecha(caso.fecha_sentencia);
    document.getElementById('fechaConclusion').textContent = formatearFecha(caso.fecha_conclusion);

    // Dato relevante
    document.getElementById('datoRelevante').textContent = caso.dato_relevante || '---';

    // Última actuación
    const seg = caso.seguimiento;
    if (seg && seg.fecha_actuacion) {
        document.getElementById('fechaActuacion').textContent = formatearFecha(seg.fecha_actuacion);
        document.getElementById('tipoActuacion').textContent = seg.tipo_actuacion || '---';
        document.getElementById('descripcionActuacion').textContent = seg.descripcion || '---';
    }

    // Timeline
    renderizarTimeline();
}

function renderizarTimeline() {
    const container = document.getElementById('timeline');
    // Los seguimientos pueden estar como array en caso.seguimientos o como objeto único en caso.seguimiento
    let seguimientos = casoActual.seguimientos || [];
    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-light); text-align: center; padding: 20px;">Sin actuaciones registradas</p>';
        return;
    }

    // Ordenar por fecha descendente
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

function eliminarCaso() {
    if (!confirm('¿Estás seguro de que deseas eliminar este asunto?')) return;

    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    const nuevos = casos.filter(c => c.id !== casoActual.id);
    localStorage.setItem('casosPenal', JSON.stringify(nuevos));

    alert('Asunto eliminado.');
    window.location.href = 'penal.html';
}

// Helpers locales (sin depender de supabaseService)
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

function obtenerNombreEstadoProcesalLocal(id) {
    if (!id) return null;
    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        const e = catalogosDB.estadosProcesales.find(e => e.id === id);
        return e ? e.nombre : null;
    }
    const estados = {
        1: 'Investigación inicial', 2: 'Investigación complementaria', 3: 'Etapa intermedia',
        4: 'Juicio oral', 5: 'Sentenciado', 6: 'Ejecución de sentencia',
        7: 'Recurso de apelación', 8: 'Amparo', 9: 'Concluido'
    };
    return estados[id] || null;
}
