// =====================================================
// ACTUALIZAR CASO PENAL - Seguimiento
// =====================================================

let usuarioActual = null;
let casoActual = null;
let historialExpandido = false;
const MAX_ACTUACIONES_VISIBLES = 5;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
let catalogos = {
    delitos: [],
    tiposActuacion: []
};
let limitadorDescripcionPenal = null;

function limpiarArchivoPenalSeleccionado() {
    const input = document.getElementById('inputPDFPenal');
    const errorDiv = document.getElementById('errorPDFPenal');
    const btnQuitar = document.getElementById('btnQuitarPDFPenal');

    if (input) {
        input.value = '';
    }

    if (errorDiv) {
        errorDiv.style.display = 'none';
        errorDiv.textContent = '';
    }

    if (btnQuitar) {
        btnQuitar.style.display = 'none';
    }
}

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

async function cargarCatalogosPenalSeguimiento() {
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
        delitos: data.delitos || [],
        tiposActuacion: (data.tiposActuacion || []).filter(item => item.modulo === 'PENAL')
    };
}

async function obtenerCasoPenalSeguimiento(id) {
    const response = await fetch(`api/getPenalCase.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el asunto penal');
    }

    return result.data?.case || null;
}

async function agregarSeguimientoPenalApi(payload) {
    const response = await fetch('api/addPenalTracking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar la actuación penal') + detail);
    }

    return result.data || {};
}

async function subirDocumentoPenalApi(expedienteId, seguimientoId, archivo) {
    const formData = new FormData();
    formData.append('expediente_id', String(expedienteId));
    formData.append('seguimiento_id', String(seguimientoId));
    formData.append('archivo', archivo);

    const response = await fetch('api/uploadPenalDocument.php', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo cargar el documento') + detail);
    }

    return result.data?.documento || null;
}

async function obtenerDocumentosPenalApi(expedienteId) {
    const response = await fetch(`api/getPenalDocuments.php?expediente_id=${encodeURIComponent(expedienteId)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudieron cargar los documentos') + detail);
    }

    return result.data?.documentos || [];
}

async function eliminarSeguimientoPenalApi(id) {
    const response = await fetch('api/deletePenalTracking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo eliminar la actuación penal') + detail);
    }

    return result.data || {};
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

function agruparDocumentosPorSeguimiento(documentos) {
    return (documentos || []).reduce((acc, documento) => {
        const seguimientoId = documento.seguimiento_id || 0;
        if (!acc[seguimientoId]) {
            acc[seguimientoId] = [];
        }

        acc[seguimientoId].push(documento);
        return acc;
    }, {});
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;
    window.mostrarCargaVista?.('.container');

    if (usuario.rol === 'consulta') {
        window.location.href = 'penal.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    const params = new URLSearchParams(window.location.search);
    const casoId = parseInt(params.get('id'), 10);

    if (!casoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto.'
        });
        window.location.href = 'penal.html';
        return;
    }

    try {
        try {
            const [, casoCargado] = await Promise.all([
                cargarCatalogosPenalSeguimiento(),
                obtenerCasoPenalSeguimiento(casoId)
            ]);

            casoActual = casoCargado;
        } catch (error) {
            console.error('No se pudieron cargar los datos del seguimiento penal:', error);
        }

        if (!casoActual) {
            const casosGuardados = JSON.parse(localStorage.getItem('casosPenal') || '[]');
            casoActual = casosGuardados.find(caso => caso.id === casoId) || null;
        }

        if (!casoActual) {
            await window.appAlert?.({
                title: 'Asunto no encontrado',
            message: 'No se encontró el asunto solicitado.'
            });
            window.location.href = 'penal.html';
            return;
        }

        document.getElementById('subtituloExpediente').textContent = `Expediente: ${casoActual.numero_expediente}`;
        document.getElementById('linkDetalle').href = `detalleCasoPenal.html?id=${casoActual.id}`;
        document.getElementById('breadcrumbExpediente').textContent = `Actualizar: ${casoActual.numero_expediente}`;

        cargarResumen();
        cargarTiposActuacion();
        await renderizarDocumentosPenal();
        await renderizarTimeline();

        limitadorDescripcionPenal = window.setupExpandableTextLimiter?.({
            fieldId: 'descripcion'
        }) || null;

        document.getElementById('fechaActuacion').value = new Date().toISOString().split('T')[0];
        document.getElementById('tipoActuacion').value = '';
        document.getElementById('estatusAsunto').value = '';
        document.getElementById('descripcion').value = '';
        limitadorDescripcionPenal?.refresh();

        document.getElementById('inputPDFPenal')?.addEventListener('change', function () {
            validarPDFPenal();
            renderizarDocumentosPenal();
        });

        document.getElementById('btnQuitarPDFPenal')?.addEventListener('click', function () {
            limpiarArchivoPenalSeleccionado();
            renderizarDocumentosPenal();
        });

        document.getElementById('formActualizar').addEventListener('submit', function (event) {
            event.preventDefault();
            guardarActuacion();
        });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

function cargarResumen() {
    document.getElementById('resumenExpediente').textContent = casoActual.numero_expediente;
    document.getElementById('resumenDelito').textContent = obtenerNombreDelitoLocal(casoActual.delito_id) || casoActual.delito_nombre || '---';
    document.getElementById('resumenEstadoProcesal').textContent = casoActual.estado_procesal_nombre || '---';

    const badgeEstatus = casoActual.estatus === 'CONCLUIDO'
        ? '<span class="badge badge-success">Concluido</span>'
        : '<span class="badge badge-warning">En Tramite</span>';

    document.getElementById('resumenEstatus').innerHTML = badgeEstatus;
}

function cargarTiposActuacion() {
    const select = document.getElementById('tipoActuacion');
    select.innerHTML = '<option value="">Seleccione...</option>';

    const tiposOrdenados = [...(catalogos.tiposActuacion || [])].sort((a, b) =>
        String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es', { sensitivity: 'base' })
    );

    tiposOrdenados.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo.nombre;
        option.textContent = tipo.nombre;
        select.appendChild(option);
    });
}

function validarPDFPenal() {
    const input = document.getElementById('inputPDFPenal');
    const errorDiv = document.getElementById('errorPDFPenal');
    const btnQuitar = document.getElementById('btnQuitarPDFPenal');

    errorDiv.style.display = 'none';

    if (!input.files || input.files.length === 0) {
        if (btnQuitar) {
            btnQuitar.style.display = 'none';
        }
        return;
    }

    const file = input.files[0];

    if (btnQuitar) {
        btnQuitar.style.display = 'inline-flex';
    }

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        errorDiv.textContent = 'Solo se permiten archivos PDF';
        errorDiv.style.display = 'block';
        limpiarArchivoPenalSeleccionado();
        return;
    }

    if (file.size > MAX_PDF_SIZE) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        errorDiv.textContent = `El archivo pesa ${sizeMB} MB. El maximo permitido es 10 MB.`;
        errorDiv.style.display = 'block';
        limpiarArchivoPenalSeleccionado();
    }
}

async function renderizarDocumentosPenal() {
    const container = document.getElementById('listaDocumentosPenal');
    if (!container || !casoActual?.id) return;

    const archivoSeleccionado = document.getElementById('inputPDFPenal')?.files?.[0] || null;
    const btnQuitar = document.getElementById('btnQuitarPDFPenal');

    if (archivoSeleccionado) {
        if (btnQuitar) {
            btnQuitar.style.display = 'inline-flex';
        }

        container.innerHTML = `
            <div style="padding:10px 12px;border:1px solid var(--color-border);border-radius:8px;background:#fff7ed;color:#9a3412;font-size:13px;">
                <strong>Archivo listo:</strong> ${archivoSeleccionado.name} (${formatearTamanoArchivo(archivoSeleccionado.size)})
            </div>
        `;
        return;
    }

    if (btnQuitar) {
        btnQuitar.style.display = 'none';
    }

    try {
        const documentos = await obtenerDocumentosPenalApi(casoActual.id);
        const totalLigados = documentos.filter(documento => documento.seguimiento_id).length;

        container.innerHTML = `
            <div style="padding:10px 12px;border:1px solid var(--color-border);border-radius:8px;background:#f9fafb;color:var(--color-text-light);font-size:13px;">
                ${totalLigados > 0
                    ? `Este expediente tiene ${totalLigados} actuación(es) con documento. Revísalas en el historial inferior.`
                    : 'Todavía no hay documentos ligados a actuaciones previas.'}
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar documentos penales:', error);
        container.innerHTML = '<p style="color: var(--color-danger); font-size: 13px;">No se pudo preparar la vista de documentos.</p>';
    }
}

async function guardarActuacion() {
    const fechaActuacion = document.getElementById('fechaActuacion').value;
    const tipoActuacion = document.getElementById('tipoActuacion').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const estatusAsunto = document.getElementById('estatusAsunto').value;
    const archivoPdf = document.getElementById('inputPDFPenal')?.files?.[0] || null;

    if (!fechaActuacion || !tipoActuacion || !descripcion) {
        await window.appAlert?.({
            title: 'Campos obligatorios',
            message: 'Por favor completa todos los campos requeridos.'
        });
        return;
    }

    const payload = {
        expedienteId: casoActual.id,
        seguimiento: {
            fecha_actuacion: fechaActuacion,
            tipo_actuacion: tipoActuacion,
            descripcion
        }
    };

    if (estatusAsunto) {
        payload.estatus = estatusAsunto;
    }

    try {
        const resultado = await agregarSeguimientoPenalApi(payload);
        const nuevaActuacion = resultado.tracking || resultado.actuacion || payload.seguimiento;

        if (archivoPdf && nuevaActuacion?.id) {
            await subirDocumentoPenalApi(casoActual.id, nuevaActuacion.id, archivoPdf);
            limpiarArchivoPenalSeleccionado();
        }

        casoActual = {
            ...casoActual,
            ...(resultado.case || resultado.expediente || {}),
            seguimiento: nuevaActuacion,
            seguimientos: [nuevaActuacion].concat(casoActual.seguimientos || [])
        };

        await renderizarDocumentosPenal();
        await renderizarTimeline();

        await window.appAlert?.({
            title: 'Cambios guardados',
            message: 'El registro se guardó correctamente.'
        });
        window.location.href = `detalleCasoPenal.html?id=${casoActual.id}`;
    } catch (error) {
        console.error('Error al guardar actuación penal:', error);
        await window.appAlert?.({
            title: 'No se pudo guardar la actuación',
            message: error.message || 'Ocurrió un problema al guardar la actuación.'
        });
    }
}

async function renderizarTimeline() {
    const container = document.getElementById('timeline');
    let seguimientos = casoActual.seguimientos || [];

    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Sin actuaciones registradas</div>';
        return;
    }

    let documentosPorSeguimiento = {};

    try {
        const documentos = await obtenerDocumentosPenalApi(casoActual.id);
        documentosPorSeguimiento = agruparDocumentosPorSeguimiento(documentos);
    } catch (error) {
        console.error('No se pudieron cargar los documentos del historial penal:', error);
    }

    const seguimientosOrdenCronologico = [...seguimientos]
        .sort((a, b) => {
            const fechaA = new Date(a.fecha_actuacion);
            const fechaB = new Date(b.fecha_actuacion);
            const diferencia = fechaA - fechaB;

            if (diferencia !== 0) {
                return diferencia;
            }

            return (a.id ?? 0) - (b.id ?? 0);
        })
        .map((seguimiento, index) => ({
            ...seguimiento,
            numeroActuacion: index + 1
        }))
        .reverse();

    const visibles = historialExpandido ? seguimientosOrdenCronologico : seguimientosOrdenCronologico.slice(0, MAX_ACTUACIONES_VISIBLES);
    const restantes = seguimientosOrdenCronologico.length - visibles.length;

    container.innerHTML = visibles.map((seguimiento, index) => {
        const documento = (documentosPorSeguimiento[seguimiento.id] || [])[0] || null;

        return `
            <div class="timeline-item ${index === visibles.length - 1 ? 'is-last' : ''}">
                <div class="timeline-rail" aria-hidden="true">
                    <span class="timeline-dot"></span>
                </div>
                <div class="timeline-card">
                    <div class="timeline-top timeline-top-swap">
                        <div class="timeline-meta timeline-meta-stack">
                            <span class="timeline-date-pill">${formatearFecha(seguimiento.fecha_actuacion)}</span>
                    <span class="timeline-step">Actuación ${seguimiento.numeroActuacion}</span>
                        </div>
                        <span class="timeline-type-chip">${seguimiento.tipo_actuacion || 'Sin tipo'}</span>
                    </div>
                    <div class="timeline-desc">${seguimiento.descripcion || 'Sin descripción registrada.'}</div>
                    ${documento || usuarioActual?.rol !== 'consulta' ? `
                    <div class="timeline-card-actions timeline-card-actions-between">
                        ${documento ? `
                        <a class="timeline-doc-link" href="${window.construirUrlApiConToken?.(`api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(documento.documento_tipo || '')}`) || `api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(documento.documento_tipo || '')}`}" target="_blank" rel="noopener noreferrer">
                            Ver PDF
                        </a>
                        <span class="timeline-doc-meta">${documento.nombre_original} - ${formatearTamanoArchivo(documento.tamano_bytes)}</span>
                        ` : ''}
                        ${usuarioActual?.rol !== 'consulta' ? `
                        <button type="button" class="timeline-delete-btn" onclick="confirmarEliminarSeguimientoPenal(${seguimiento.id})">
                            Eliminar
                        </button>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (seguimientosOrdenCronologico.length > MAX_ACTUACIONES_VISIBLES) {
        container.innerHTML += `
            <div class="timeline-actions">
                <button type="button" class="timeline-toggle-btn" onclick="toggleHistorialPenal()">
                    ${historialExpandido ? 'Mostrar menos' : `Mostrar ${restantes} más`}
                </button>
            </div>
        `;
    }
}

function toggleHistorialPenal() {
    historialExpandido = !historialExpandido;
    renderizarTimeline();
}

async function confirmarEliminarSeguimientoPenal(trackingId) {
    if (!trackingId) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar actuación',
        message: '¿Deseas eliminar esta actuación del historial?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });
    if (!confirmacion) {
        return;
    }

    try {
        await eliminarSeguimientoPenalApi(trackingId);
        casoActual.seguimientos = (casoActual.seguimientos || []).filter(seguimiento => seguimiento.id !== trackingId);
        casoActual.seguimiento = casoActual.seguimientos[0] || {};
        await renderizarDocumentosPenal();
        await renderizarTimeline();
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
window.confirmarEliminarSeguimientoPenal = confirmarEliminarSeguimientoPenal;
window.toggleHistorialPenal = toggleHistorialPenal;

function obtenerNombreDelitoLocal(id) {
    if (!id) return null;
    const delito = (catalogos.delitos || []).find(item => item.id == id);
    return delito ? delito.nombre : null;
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

