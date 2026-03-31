// =====================================================
// ACTUALIZAR CASO PENAL - Seguimiento
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

    if (usuario.rol === 'consulta') {
        window.location.href = 'penal.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

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

    document.getElementById('subtituloExpediente').textContent = `Expediente: ${casoActual.numero_expediente}`;
    document.getElementById('breadcrumbExpediente').textContent = `Actualizar: ${casoActual.numero_expediente}`;

    cargarResumen();
    cargarTiposActuacion();
    cargarEstadosProcesales();
    renderizarTimeline();

    // Fecha por defecto: hoy
    document.getElementById('fechaActuacion').value = new Date().toISOString().split('T')[0];

    document.getElementById('formActualizar').addEventListener('submit', function (e) {
        e.preventDefault();
        guardarActuacion();
    });
});

function cargarResumen() {
    document.getElementById('resumenExpediente').textContent = casoActual.numero_expediente;

    const delitoNombre = obtenerNombreDelitoLocal(casoActual.delito_id);
    document.getElementById('resumenDelito').textContent = delitoNombre || '---';

    const estadoProcesal = obtenerNombreEstadoProcesalLocal(casoActual.estado_procesal_id);
    document.getElementById('resumenEstadoProcesal').textContent = estadoProcesal || '---';

    const badgeEstatus = casoActual.estatus === 'TRAMITE'
        ? '<span class="badge badge-warning">En Trámite</span>'
        : '<span class="badge badge-success">Concluido</span>';
    document.getElementById('resumenEstatus').innerHTML = badgeEstatus;
}

function cargarTiposActuacion() {
    const select = document.getElementById('tipoActuacion');
    let tipos;

    if (catalogosCargados && catalogosDB.tiposActuacion.length > 0) {
        tipos = catalogosDB.tiposActuacion.filter(t => t.modulo === 'AMBOS' || t.modulo === 'PENAL');
    } else {
        tipos = [
            'Acuerdo', 'Amparo', 'Archivo', 'Audiencia', 'Desahogo',
            'Ejecución', 'Notificación', 'Pericial', 'Promoción', 'Pruebas',
            'Recurso', 'Sentencia', 'Sobreseimiento', 'Suspensión', 'Vista',
            'Denuncia', 'Querella', 'Investigación', 'Vinculación a proceso',
            'Medida cautelar', 'Auto de apertura a juicio oral', 'Juicio oral',
            'Reparación del daño', 'Acuerdo reparatorio', 'Criterio de oportunidad'
        ].map((nombre, i) => ({ id: i + 1, nombre }));
    }

    tipos.forEach(t => {
        const opt = document.createElement('option');
        opt.value = t.nombre;
        opt.textContent = t.nombre;
        select.appendChild(opt);
    });
}

function cargarEstadosProcesales() {
    const select = document.getElementById('nuevoEstadoProcesal');
    const estados = catalogosCargados && catalogosDB.estadosProcesales.length > 0 ? catalogosDB.estadosProcesales : [
        { id: 1, nombre: 'Investigación inicial' }, { id: 2, nombre: 'Investigación complementaria' },
        { id: 3, nombre: 'Etapa intermedia' }, { id: 4, nombre: 'Juicio oral' },
        { id: 5, nombre: 'Sentenciado' }, { id: 6, nombre: 'Ejecución de sentencia' },
        { id: 7, nombre: 'Recurso de apelación' }, { id: 8, nombre: 'Amparo' },
        { id: 9, nombre: 'Concluido' }
    ];

    estados.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

function guardarActuacion() {
    const fechaActuacion = document.getElementById('fechaActuacion').value;
    const tipoActuacion = document.getElementById('tipoActuacion').value;
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!fechaActuacion || !tipoActuacion || !descripcion) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    const nuevaActuacion = {
        fecha_actuacion: fechaActuacion,
        tipo_actuacion: tipoActuacion,
        descripcion: descripcion
    };

    // Actualizar caso en localStorage
    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    const idx = casos.findIndex(c => c.id === casoActual.id);
    if (idx === -1) { alert('Error: caso no encontrado.'); return; }

    // Agregar al array de seguimientos
    if (!casos[idx].seguimientos) casos[idx].seguimientos = [];
    casos[idx].seguimientos.push(nuevaActuacion);

    // Actualizar seguimiento (último)
    casos[idx].seguimiento = nuevaActuacion;
    casos[idx].fecha_actualizacion = new Date().toISOString();

    // Actualizar estado procesal si se seleccionó
    const nuevoEstadoProcesal = document.getElementById('nuevoEstadoProcesal').value;
    if (nuevoEstadoProcesal) {
        casos[idx].estado_procesal_id = parseInt(nuevoEstadoProcesal);
    }

    // Actualizar estatus si se seleccionó
    const nuevoEstatus = document.getElementById('nuevoEstatus').value;
    if (nuevoEstatus) {
        casos[idx].estatus = nuevoEstatus;
    }

    localStorage.setItem('casosPenal', JSON.stringify(casos));

    alert('Actuación guardada correctamente.');
    window.location.href = `detalleCasoPenal.html?id=${casoActual.id}`;
}

function renderizarTimeline() {
    const container = document.getElementById('timeline');
    let seguimientos = casoActual.seguimientos || [];
    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-light); text-align: center; padding: 20px;">Sin actuaciones previas</p>';
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

// Helpers locales
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
