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
        alert('No se especifico un asunto.');
        window.location.href = 'penal.html';
        return;
    }

    try {
        const [, casoCargado] = await Promise.all([
            cargarCatalogos(),
            obtenerCasoPenal(casoId)
        ]);
        casoActual = casoCargado;
    } catch (err) {
        console.warn('No se pudieron cargar todos los datos desde Supabase, usando fallback:', err);
        try { await cargarCatalogos(); } catch (e) { console.warn('Supabase no disponible'); }
        try {
            casoActual = await obtenerCasoPenal(casoId);
        } catch (errorCaso) {
            console.warn('No se pudo cargar desde Supabase, usando cache local:', errorCaso);
            const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
            casoActual = casos.find(c => c.id === casoId);
        }
    }
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
    cargarEstatusInvestigacion();
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
        ? '<span class="badge badge-warning">En Tramite</span>'
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
            'Ejecucion', 'Notificacion', 'Pericial', 'Promocion', 'Pruebas',
            'Recurso', 'Sentencia', 'Sobreseimiento', 'Suspension', 'Vista',
            'Denuncia', 'Querella', 'Investigacion', 'Vinculacion a proceso',
            'Medida cautelar', 'Auto de apertura a juicio oral', 'Juicio oral',
            'Reparacion del dano', 'Acuerdo reparatorio', 'Criterio de oportunidad'
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
    let estados;

    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        estados = catalogosDB.estadosProcesales;
    } else {
        estados = [
            { id: 1, nombre: 'Etapa de investigacion' },
            { id: 2, nombre: 'Etapa intermedia o etapa de preparacion a juicio' },
            { id: 3, nombre: 'Etapa de juicio oral' }
        ];
    }

    estados.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

function cargarEstatusInvestigacion() {
    const select = document.getElementById('nuevoEstatusJSJ');
    if (!select) return;

    let estatus;
    if (catalogosCargados && catalogosDB.estatusInvestigacion && catalogosDB.estatusInvestigacion.length > 0) {
        estatus = catalogosDB.estatusInvestigacion;
    } else {
        estatus = [
            { id: 1, nombre: 'ACUERDO REPARATORIO' },
            { id: 2, nombre: 'EN TRAMITE' },
            { id: 3, nombre: 'CONCLUIDO' },
            { id: 4, nombre: 'INCOMPETENCIA' },
            { id: 5, nombre: 'NO EJERCICIO DE LA ACCION PENAL' },
            { id: 6, nombre: 'SE SENALA NUEVA FECHA PARA AUDIENCIA DE JUICIO ORAL' },
            { id: 7, nombre: 'CAUSA PENAL' }
        ];
    }

    estatus.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.nombre;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

async function guardarActuacion() {
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

    try {
        await agregarSeguimientoPenal(casoActual.id, nuevaActuacion);

        const actualizaciones = {};
        const nuevoEstatusJSJ = document.getElementById('nuevoEstatusJSJ').value;
        if (nuevoEstatusJSJ) actualizaciones.estatus_investigacion_jsj = nuevoEstatusJSJ;

        const nuevoEstadoProcesal = document.getElementById('nuevoEstadoProcesal').value;
        if (nuevoEstadoProcesal) actualizaciones.estado_procesal_id = parseInt(nuevoEstadoProcesal);

        const nuevoEstatus = document.getElementById('nuevoEstatus').value;
        if (nuevoEstatus) actualizaciones.estatus = nuevoEstatus;

        if (Object.keys(actualizaciones).length > 0) {
            casoActual = { ...casoActual, ...actualizaciones };
            const casoGuardado = await guardarCasoPenal(casoActual);
            upsertCacheCasoPenal({ ...casoActual, ...casoGuardado });
        }

        casoActual.seguimiento = nuevaActuacion;
        casoActual.seguimientos = [nuevaActuacion, ...(casoActual.seguimientos || [])];
        upsertCacheCasoPenal(casoActual);

        alert('Actuacion guardada correctamente.');
        window.location.href = `detalleCasoPenal.html?id=${casoActual.id}`;
    } catch (err) {
        console.error('Error al guardar actuacion:', err);
        alert('Error al guardar la actuacion: ' + err.message);
    }
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
        1: 'ABUSO DE CONFIANZA', 5: 'COHECHO', 7: 'DANOS', 13: 'FALSIFICACION DE DOCUMENTOS',
        17: 'FRAUDE', 20: 'HOMICIDIO POR OMISION EN AGRAVIO', 22: 'LESIONES', 27: 'ROBO',
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
        1: 'Etapa de investigacion',
        2: 'Etapa intermedia o etapa de preparacion a juicio',
        3: 'Etapa de juicio oral'
    };
    return estados[id] || null;
}
