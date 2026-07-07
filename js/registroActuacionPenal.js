let usuarioActual = null;
let asuntoActual = null;
let catalogoEtapasPenal = [];
let catalogoFasesActuacionPenal = [];
let historialActuacionesPenal = [];

const MAX_PDF_SIZE = 10 * 1024 * 1024;

async function verificarSesionActuacionPenal() {
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
        console.error('No se pudo recuperar la sesión:', error);
    }

    window.location.href = 'login.html';
    return null;
}

async function cargarDatosActuacionPenal(asuntoId) {
    const response = await fetch(`api/getPenalActuationCase.php?id=${encodeURIComponent(asuntoId)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los datos del asunto penal');
    }

    return result.data || {};
}

function llenarResumenActuacionPenal(asunto) {
    const numero = document.getElementById('resumenNumeroCarpeta');
    const delito = document.getElementById('resumenDelito');
    const estatus = document.getElementById('resumenEstatus');
    const breadcrumb = document.getElementById('breadcrumbExpediente');

    if (numero) numero.textContent = asunto.numero_carpeta || '---';
    if (delito) delito.textContent = asunto.delito_nombre || '---';
    if (estatus) estatus.textContent = asunto.estatus_general || 'TRAMITE';
    if (breadcrumb) breadcrumb.textContent = `Actuación: ${asunto.numero_carpeta || '---'}`;

    const linkDetalle = document.getElementById('breadcrumbDetalleAsunto');
    if (linkDetalle) {
        linkDetalle.href = `detalleCasoPenal.html?id=${asunto.id}`;
    }

    const btnCancelar = document.querySelector('.penal-act-actions a.btn-secondary');
    if (btnCancelar) {
        btnCancelar.href = `detalleCasoPenal.html?id=${asunto.id}`;
    }

    const linkReq = document.querySelector('.penal-act-actions a[href*="listadoRequerimientosPenal"]');
    if (linkReq) {
        linkReq.href = `listadoRequerimientosPenal.html?id=${asunto.id}`;
    }
}

function cargarEtapasPenales(etapas) {
    catalogoEtapasPenal = Array.isArray(etapas) ? etapas : [];
    const select = document.getElementById('etapaActuacionPenal');

    if (!select) return;

    select.innerHTML = '<option value="">Seleccione...</option>';

    catalogoEtapasPenal.forEach(etapa => {
        const option = document.createElement('option');
        option.value = etapa.id;
        option.textContent = etapa.nombre;
        select.appendChild(option);
    });

    resetFasesActuacionPenal();
}

function resetFasesActuacionPenal(message = 'Seleccione una etapa...') {
    catalogoFasesActuacionPenal = [];
    const select = document.getElementById('faseActuacionPenal');

    if (!select) return;

    select.innerHTML = `<option value="">${escapeHtml(message)}</option>`;
    select.value = '';
    select.disabled = true;
}

function cargarFasesActuacionPenal(fases) {
    catalogoFasesActuacionPenal = Array.isArray(fases) ? fases : [];
    const select = document.getElementById('faseActuacionPenal');

    if (!select) return;

    if (catalogoFasesActuacionPenal.length === 0) {
        resetFasesActuacionPenal('Sin fases disponibles');
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    catalogoFasesActuacionPenal.forEach(fase => {
        const option = document.createElement('option');
        option.value = fase.id;
        option.textContent = fase.nombre;
        select.appendChild(option);
    });

    select.disabled = false;
}

async function cargarFasesPorEtapa(etapaId) {
    resetFasesActuacionPenal('Cargando fases...');

    if (!etapaId) {
        resetFasesActuacionPenal();
        return;
    }

    const response = await fetch(`api/getFasesByEtapa.php?etapa_id=${encodeURIComponent(etapaId)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar las fases de la etapa');
    }

    cargarFasesActuacionPenal(result.data?.fases || []);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatearFechaPenal(fecha) {
    if (!fecha) return '---';

    const base = typeof fecha === 'string' ? fecha.split('T')[0] : fecha;
    let dateValue;

    if (typeof base === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(base)) {
        const [anio, mes, dia] = base.split('-').map(Number);
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

function validarFechaIso(fecha) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ''));
}

function syncFechaActuacionMin() {
    const inputFecha = document.getElementById('fechaActuacionSecundaria');
    const fechaPresentacion = asuntoActual?.fecha_presentacion_denuncia || '';

    if (!inputFecha) {
        return;
    }

    inputFecha.min = validarFechaIso(fechaPresentacion) ? fechaPresentacion : '';

    if (inputFecha.min && inputFecha.value && inputFecha.value < inputFecha.min) {
        inputFecha.value = '';
    }
}

function formatearTamanoArchivo(bytes) {
    if (!bytes || Number.isNaN(Number(bytes))) {
        return '0 KB';
    }

    const size = Number(bytes);
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function renderizarHistorialActuacionesPenal(historial) {
    const container = document.getElementById('historialActuacionesPenal');
    if (!container) return;

    if (!Array.isArray(historial) || historial.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Sin actuaciones registradas</div>';
        return;
    }

    const historialOrdenado = [...historial].sort((a, b) => {
        const fechaA = new Date(a.fecha_actuacion || a.created_at || 0);
        const fechaB = new Date(b.fecha_actuacion || b.created_at || 0);
        const diff = fechaB - fechaA;
        if (diff !== 0) return diff;
        return (Number(b.id) || 0) - (Number(a.id) || 0);
    });

    container.innerHTML = historialOrdenado.map((item, index) => {
        const documentos = Array.isArray(item.documentos) ? item.documentos : [];
        const documento = documentos[0] || null;
        const complemento = item.texto_complementario_estatus
            ? `<div class="timeline-doc-meta">Complemento: ${escapeHtml(item.texto_complementario_estatus)}</div>`
            : '';
        const referencia = item.referencia_carpeta
            ? `<div class="timeline-doc-meta">Referencia: ${escapeHtml(item.referencia_carpeta)}</div>`
            : '';
        const fase = item.fase_nombre
            ? `<div class="timeline-doc-meta">Fase: ${escapeHtml(item.fase_nombre)}</div>`
            : '';
        const usuario = item.usuario_nombre
            ? `<div class="timeline-doc-meta">Registró: ${escapeHtml(item.usuario_nombre)}</div>`
            : '';
        const botonEliminar = item.id
            ? `<button type="button" class="timeline-delete-btn" onclick="confirmarEliminarActuacionPenal(${Number(item.id)})">Eliminar</button>`
            : '';
        const documentoHtml = documento
            ? `
                <div class="timeline-card-actions timeline-card-actions-between">
                    <a class="timeline-doc-link" href="${window.construirUrlApiConToken?.(`api/downloadPenalActuationDocument.php?id=${documento.id}`) || `api/downloadPenalActuationDocument.php?id=${documento.id}`}" target="_blank" rel="noopener noreferrer">
                        Ver PDF
                    </a>
                    <span class="timeline-doc-meta">${escapeHtml(documento.nombre_original || 'Documento PDF')} - ${formatearTamanoArchivo(documento.tamano_bytes)}</span>
                    ${botonEliminar}
                </div>
            `
            : (botonEliminar
                ? `
                    <div class="timeline-card-actions timeline-card-actions-end">
                        ${botonEliminar}
                    </div>
                `
                : '');

        return `
            <div class="timeline-item ${index === historialOrdenado.length - 1 ? 'is-last' : ''}">
                <div class="timeline-rail" aria-hidden="true">
                    <span class="timeline-dot"></span>
                </div>
                <div class="timeline-card">
                    <div class="timeline-top timeline-top-swap">
                        <div class="timeline-meta timeline-meta-stack">
                            <span class="timeline-date-pill">${formatearFechaPenal(item.fecha_actuacion)}</span>
                            <span class="timeline-step">Actuación ${historialOrdenado.length - index}</span>
                        </div>
                        <span class="timeline-type-chip">${escapeHtml(item.etapa_nombre || 'Sin etapa')}</span>
                    </div>
                    <div class="timeline-desc">${escapeHtml(item.descripcion || 'Sin descripción registrada.')}</div>
                    ${complemento}
                    ${referencia}
                    ${fase}
                    ${usuario}
                    ${documentoHtml}
                </div>
            </div>
        `;
    }).join('');
}

function validarArchivoActuacionPenal() {
    const input = document.getElementById('archivoActuacionPenal');
    const archivo = input?.files?.[0] || null;

    if (!archivo) {
        return true;
    }

    if (!archivo.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('El documento de la actuación debe ser un PDF');
    }

    if (archivo.size > MAX_PDF_SIZE) {
        throw new Error('El documento de la actuación no puede exceder 10 MB');
    }

    return true;
}

function obtenerPayloadActuacionPenal() {
    const fecha = document.getElementById('fechaActuacionSecundaria')?.value?.trim() || '';
    const etapaId = parseInt(document.getElementById('etapaActuacionPenal')?.value || '', 10);
    const faseValue = document.getElementById('faseActuacionPenal')?.value || '';
    const faseId = faseValue ? parseInt(faseValue, 10) : null;
    const descripcion = document.getElementById('descripcionActuacionPenal')?.value?.trim() || '';

    if (!fecha) {
        throw new Error('La fecha de actuación es obligatoria');
    }

    if (!Number.isInteger(etapaId) || etapaId <= 0) {
        throw new Error('Debes seleccionar una etapa');
    }

    if (faseId !== null && (!Number.isInteger(faseId) || faseId <= 0)) {
        throw new Error('La fase seleccionada no es valida');
    }

    if (!descripcion) {
        throw new Error('La descripción de lo sucedido es obligatoria');
    }

    if (descripcion.length > 500) {
        throw new Error('La descripción no puede exceder 500 caracteres');
    }

    validarArchivoActuacionPenal();

    return {
        asunto_id: asuntoActual.id,
        fecha_actuacion: fecha,
        etapa_id: etapaId,
        fase_id: faseId,
        descripcion: descripcion
    };
}

async function guardarActuacionPenalApi(formData) {
    const response = await fetch('api/savePenalActuation.php', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar la actuación penal') + detail);
    }

    return result.data || {};
}

async function eliminarActuacionPenalApi(id) {
    const response = await fetch('api/penal/deleteTracking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo eliminar la actuación penal');
    }

    return result.data || {};
}

async function guardarActuacionPenal(event) {
    event.preventDefault();

    try {
        const payload = obtenerPayloadActuacionPenal();
        const formData = new FormData();

        formData.append('asunto_id', String(payload.asunto_id));
        formData.append('fecha_actuacion', payload.fecha_actuacion);
        formData.append('etapa_id', String(payload.etapa_id));
        if (payload.fase_id) {
            formData.append('fase_id', String(payload.fase_id));
        }
        formData.append('descripcion', payload.descripcion);

        const archivo = document.getElementById('archivoActuacionPenal')?.files?.[0] || null;
        if (archivo) {
            formData.append('archivo_actuacion', archivo);
        }

        const resultado = await guardarActuacionPenalApi(formData);

        await window.appAlert?.({
            title: 'Actuación registrada',
            message: 'La actuación penal se guardó correctamente.'
        });

        window.location.href = `detalleCasoPenal.html?id=${resultado.asunto?.id || asuntoActual.id}`;
    } catch (error) {
        console.error('Error al guardar actuación penal:', error);
        await window.appAlert?.({
            title: 'No se pudo guardar',
            message: error.message || 'Ocurrió un error al guardar la actuación penal.'
        });
    }
}

async function recargarActuacionPenalActual() {
    if (!asuntoActual?.id) return;

    const data = await cargarDatosActuacionPenal(asuntoActual.id);
    asuntoActual = data.case || asuntoActual;
    historialActuacionesPenal = Array.isArray(data.history) ? data.history : [];

    llenarResumenActuacionPenal(asuntoActual);
    cargarEtapasPenales(data.etapas || []);
    renderizarHistorialActuacionesPenal(historialActuacionesPenal);
}

async function confirmarEliminarActuacionPenal(actuacionId) {
    if (!actuacionId) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar actuación',
        message: '¿Deseas eliminar esta actuación del historial?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) return;

    try {
        await eliminarActuacionPenalApi(actuacionId);
        await recargarActuacionPenalActual();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Actuación eliminada correctamente.'
        });
    } catch (error) {
        console.error('Error al eliminar actuación penal:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar la actuación',
            message: error.message || 'Ocurrió un problema al eliminar la actuación.'
        });
    }
}

window.confirmarEliminarActuacionPenal = confirmarEliminarActuacionPenal;

async function manejarCambioEtapaActuacionPenal(event) {
    const etapaId = event.target.value;

    try {
        await cargarFasesPorEtapa(etapaId);
    } catch (error) {
        resetFasesActuacionPenal('No se pudieron cargar fases');
        await window.appAlert?.({
            title: 'Fases no disponibles',
            message: error.message || 'No se pudieron cargar las fases de la etapa seleccionada.'
        });
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    usuarioActual = await verificarSesionActuacionPenal();
    if (!usuarioActual) return;

    if (usuarioActual.rol === 'consulta') {
        window.location.href = 'penal.html';
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const asuntoId = parseInt(params.get('id') || '', 10);

    if (!Number.isInteger(asuntoId) || asuntoId <= 0) {
        await window.appAlert?.({
            title: 'Asunto no válido',
            message: 'No se especificó un asunto penal válido.'
        });
        window.location.href = 'penal.html';
        return;
    }

    await window.mostrarCargaVista?.('.container');

    try {
        const data = await cargarDatosActuacionPenal(asuntoId);
        asuntoActual = data.case || null;
        historialActuacionesPenal = Array.isArray(data.history) ? data.history : [];

        if (!asuntoActual) {
            throw new Error('No se encontró el asunto penal');
        }

        llenarResumenActuacionPenal(asuntoActual);
        cargarEtapasPenales(data.etapas || []);
        renderizarHistorialActuacionesPenal(historialActuacionesPenal);
        document.getElementById('etapaActuacionPenal')?.addEventListener('change', manejarCambioEtapaActuacionPenal);

        const fechaInput = document.getElementById('fechaActuacionSecundaria');
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
            syncFechaActuacionMin();
        }

        document.getElementById('formRegistroActuacionPenal')?.addEventListener('submit', guardarActuacionPenal);
    } catch (error) {
        console.error('Error al cargar actuación penal:', error);
        await window.appAlert?.({
            title: 'Carga fallida',
            message: error.message || 'No se pudo cargar la vista de actuación penal.'
        });
        window.location.href = 'penal.html';
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});
