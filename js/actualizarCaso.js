// =====================================================
// ACTUALIZAR-CASO.JS - Actualizacion de seguimiento con API local
// =====================================================

let casoActual = null;
let usuarioActualAct = null;
let historialExpandido = false;
const MAX_PDF_SIZE = 10 * 1024 * 1024;
const MAX_ACTUALIZACIONES_VISIBLES = 5;
let limitadorDescripcionActuacion = null;

function obtenerDelegacionCivilActualizacion(id) {
    try {
        const delegaciones = window.catalogos?.delegaciones || [];
        return delegaciones.find(delegacion => delegacion.id == id) || null;
    } catch (error) {
        return null;
    }
}

function actualizarHeaderCivilActualizacion(usuario) {
    if (!usuario) return;

    const nombreUsuarioEl = document.getElementById('nombreUsuario');
    if (nombreUsuarioEl) {
        nombreUsuarioEl.textContent = usuario.nombre_completo;
    }

    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', jefe: 'Jefe', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol || '';
        badgeRol.className = 'badge-rol badge-rol-' + (usuario.rol || '');
    }

    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD) {
        if (usuario.delegacion_id) {
            const delegacion = obtenerDelegacionCivilActualizacion(usuario.delegacion_id);
            infoOOAD.textContent = delegacion?.nombre || 'Todas las JSJ';
        } else {
            infoOOAD.textContent = 'Todas las JSJ';
        }
    }
}

function esCasoAcumuladoActualizacion() {
    return Boolean(casoActual?.acumulado_a);
}

function obtenerNumeroPadreAcumulacionActualizacion() {
    if (!casoActual?.acumulado_a) {
        return null;
    }

    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : [];
    const casoPadre = casos.find(caso => caso.id === casoActual.acumulado_a);

    return casoPadre?.numero_expediente || `ID ${casoActual.acumulado_a}`;
}

function limpiarArchivoSeleccionado() {
    const input = document.getElementById('inputPDF');
    const errorDiv = document.getElementById('errorPDF');
    const btnQuitar = document.getElementById('btnQuitarPDF');

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

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }

    return JSON.parse(usuarioStr);
}

async function cerrarSesion() {
    try {
        await fetch('api/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

window.cerrarSesion = cerrarSesion;

async function obtenerCasoCivilDetalle(id) {
    const response = await fetch(`api/getCivilCase.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el caso');
    }

    return result.data?.case || null;
}

async function agregarSeguimientoCivilApi(expedienteId, seguimiento, fechaVencimiento, estatus) {
    const response = await fetch('api/addCivilTracking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            expedienteId,
            seguimiento,
            fechaVencimiento,
            estatus
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo guardar el seguimiento');
    }

    return {
        actuacion: result.data?.tracking || null,
        expediente: result.data?.case || null
    };
}

async function subirDocumentoCivilApi(expedienteId, seguimientoId, archivo) {
    const formData = new FormData();
    formData.append('expediente_id', String(expedienteId));
    formData.append('seguimiento_id', String(seguimientoId));
    formData.append('archivo', archivo);

    const response = await fetch('api/uploadCivilDocument.php', {
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

async function obtenerDocumentosCivilApi(expedienteId) {
    const response = await fetch(`api/getCivilDocuments.php?expediente_id=${encodeURIComponent(expedienteId)}`, {
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

async function eliminarSeguimientoCivilApi(id) {
    const response = await fetch('api/deleteCivilTracking.php', {
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
        throw new Error((result.message || 'No se pudo eliminar el seguimiento') + detail);
    }

    return result.data || {};
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
    const usuario = verificarSesion();
    if (!usuario) return;

    usuarioActualAct = usuario;
    window.mostrarCargaVista?.('.container');

    if (!usuario.permiso_civil_mercantil && usuario.rol !== 'admin') {
        window.location.href = usuario.permiso_penal ? 'penal.html' : 'login.html';
        return;
    }

    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return false;
    }

    actualizarHeaderCivilActualizacion(usuario);

    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'), 10);

    if (!casoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto.'
        });
        window.location.href = 'casos.html';
        return false;
    }

    limitadorDescripcionActuacion = window.setupExpandableTextLimiter?.({
        fieldId: 'descripcionActuacion'
    }) || null;

    try {
        const puedeContinuar = await cargarCaso(casoId);
        if (!puedeContinuar) {
            return;
        }
        actualizarHeaderCivilActualizacion(usuario);
        configurarEventListeners();
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function cargarCaso(casoId) {
    try {
        casoActual = await obtenerCasoCivilDetalle(casoId);
    } catch (error) {
        console.warn('No se pudo cargar desde la API local, usando cache local:', error);
        const casosStr = localStorage.getItem('casos');
        const casos = casosStr ? JSON.parse(casosStr) : [];
        casoActual = casos.find(caso => caso.id === casoId);
    }

    if (!casoActual) {
        await window.appAlert?.({
            title: 'Asunto no encontrado',
            message: 'No se encontró el asunto solicitado.'
        });
        window.location.href = 'casos.html';
        return false;
    }

    document.getElementById('linkDetalle').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('btnCancelar').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('numExpediente').textContent = casoActual.numero_expediente;

    if (esCasoAcumuladoActualizacion()) {
        const numeroPadre = obtenerNumeroPadreAcumulacionActualizacion();
        await window.appAlert?.({
            title: 'Asunto acumulado',
            message: `Este asunto esta acumulado a ${numeroPadre} y no puede recibir seguimiento. Debe desacumularse primero.`
        });
        window.location.href = `detalleCaso.html?id=${casoActual.id}`;
        return false;
    }

    llenarFormulario();
    return true;
}

async function llenarFormulario() {
    document.getElementById('folioExpediente').value = casoActual.numero_expediente;
    document.getElementById('fechaActuacion').value = new Date().toISOString().split('T')[0];
    document.getElementById('tipoActuacion').value = '';
    document.getElementById('fechaVencimiento').value = '';
    document.getElementById('estatusAsunto').value = '';
    document.getElementById('descripcionActuacion').value = '';

    limitadorDescripcionActuacion?.refresh();
    sincronizarRangoFechasActualizacionCivil();

    await renderizarDocumentos();
    await renderizarHistorialActualizaciones();
}

function configurarEventListeners() {
    document.getElementById('fechaActuacion')?.addEventListener('change', sincronizarRangoFechasActualizacionCivil);
    document.getElementById('inputPDF').addEventListener('change', function () {
        validarPDF();
        renderizarDocumentos();
    });
    document.getElementById('btnQuitarPDF')?.addEventListener('click', function () {
        limpiarArchivoSeleccionado();
        renderizarDocumentos();
    });
    document.getElementById('formActualizar').addEventListener('submit', guardarActualizacion);
}

function sincronizarRangoFechasActualizacionCivil() {
    const fechaActuacion = document.getElementById('fechaActuacion');
    const fechaVencimiento = document.getElementById('fechaVencimiento');

    if (!fechaActuacion || !fechaVencimiento) {
        return;
    }

    fechaVencimiento.min = fechaActuacion.value || '';

    if (fechaActuacion.value && fechaVencimiento.value && fechaVencimiento.value < fechaActuacion.value) {
        fechaVencimiento.value = '';
    }
}

function validarPDF() {
    const input = document.getElementById('inputPDF');
    const errorDiv = document.getElementById('errorPDF');
    const btnQuitar = document.getElementById('btnQuitarPDF');
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
        limpiarArchivoSeleccionado();
        return;
    }

    if (file.size > MAX_PDF_SIZE) {
        const sizeMB = Math.round(file.size / (1024 * 1024));
        errorDiv.textContent = `El archivo pesa ${sizeMB} MB. El maximo permitido es 10 MB.`;
        errorDiv.style.display = 'block';
        limpiarArchivoSeleccionado();
    }
}

async function renderizarDocumentos() {
    const container = document.getElementById('listaDocumentos');
    const archivoSeleccionado = document.getElementById('inputPDF')?.files?.[0] || null;
    const btnQuitar = document.getElementById('btnQuitarPDF');

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
        const documentos = await obtenerDocumentosCivilApi(casoActual.id);
        const totalLigados = documentos.filter(documento => documento.seguimiento_id).length;

        container.innerHTML = `
            <div style="padding:10px 12px;border:1px solid var(--color-border);border-radius:8px;background:#f9fafb;color:var(--color-text-light);font-size:13px;">
                ${totalLigados > 0
                    ? `Este expediente tiene ${totalLigados} actualización(es) con documento. Revísalas en el historial inferior.`
                    : 'Todavía no hay documentos ligados a actualizaciones previas.'}
            </div>
        `;
    } catch (error) {
        console.error('Error al cargar documentos:', error);
        container.innerHTML = '<p style="color: var(--color-danger); font-size: 13px;">No se pudo preparar la vista de documentos.</p>';
    }
}

async function renderizarHistorialActualizaciones() {
    const container = document.getElementById('timelineCivil');
    if (!container) return;

    let seguimientos = casoActual.seguimientos || [];
    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Sin actualizaciones registradas</div>';
        return;
    }

    let documentosPorSeguimiento = {};

    try {
        const documentos = await obtenerDocumentosCivilApi(casoActual.id);
        documentosPorSeguimiento = agruparDocumentosPorSeguimiento(documentos);
    } catch (error) {
        console.error('No se pudieron cargar los documentos del historial civil:', error);
    }

    const seguimientosOrdenados = [...seguimientos]
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
            numeroActualizacion: index + 1
        }))
        .reverse();

    const visibles = historialExpandido
        ? seguimientosOrdenados
        : seguimientosOrdenados.slice(0, MAX_ACTUALIZACIONES_VISIBLES);
    const restantes = seguimientosOrdenados.length - visibles.length;

    container.innerHTML = visibles.map((seguimiento, index) => {
        const documentos = documentosPorSeguimiento[seguimiento.id] || [];
        const documento = documentos[0] || null;

        return `
            <div class="timeline-item ${index === visibles.length - 1 ? 'is-last' : ''}">
                <div class="timeline-rail" aria-hidden="true">
                    <span class="timeline-dot"></span>
                </div>
                <div class="timeline-card">
                    <div class="timeline-top timeline-top-swap">
                        <div class="timeline-meta timeline-meta-stack">
                            <span class="timeline-date-pill">${formatearFecha(seguimiento.fecha_actuacion)}</span>
                            <span class="timeline-step">Actualizacion ${seguimiento.numeroActualizacion}</span>
                        </div>
                        <span class="timeline-type-chip">${seguimiento.tipo_actuacion || 'Sin tipo'}</span>
                    </div>
                    <div class="timeline-desc">${seguimiento.descripcion || 'Sin descripcion registrada.'}</div>
                    ${(documento || usuarioActualAct?.rol !== 'consulta') ? `
                        <div class="timeline-card-actions timeline-card-actions-between">
                            ${documento ? `
                            <a
                                href="${window.construirUrlApiConToken?.(`api/downloadCivilDocument.php?id=${documento.id}`) || `api/downloadCivilDocument.php?id=${documento.id}`}"
                                target="_blank"
                                class="timeline-doc-link"
                            >
                                Ver PDF
                            </a>
                            <span class="timeline-doc-meta">${documento.nombre_original} · ${formatearTamanoArchivo(documento.tamano_bytes)}</span>
                            ` : ''}
                            ${usuarioActualAct?.rol !== 'consulta' ? `
                            <button type="button" class="timeline-delete-btn" onclick="confirmarEliminarSeguimientoCivil(${seguimiento.id})">
                                Eliminar
                            </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (seguimientosOrdenados.length > MAX_ACTUALIZACIONES_VISIBLES) {
        container.innerHTML += `
            <div class="timeline-actions">
                <button type="button" class="timeline-toggle-btn" onclick="toggleHistorialCivil()">
                    ${historialExpandido ? 'Mostrar menos' : `Mostrar ${restantes} mas`}
                </button>
            </div>
        `;
    }
}

function toggleHistorialCivil() {
    historialExpandido = !historialExpandido;
    renderizarHistorialActualizaciones();
}

async function confirmarEliminarSeguimientoCivil(trackingId) {
    if (!trackingId) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar actualización',
        message: '¿Deseas eliminar esta actualización? Si tiene PDF ligado, también se eliminará.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });
    if (!confirmacion) {
        return;
    }

    try {
        await eliminarSeguimientoCivilApi(trackingId);
        casoActual.seguimientos = (casoActual.seguimientos || []).filter(seguimiento => seguimiento.id !== trackingId);
        casoActual.seguimiento = casoActual.seguimientos[0] || {};
        guardarCasoEnCacheLocal();
        await renderizarDocumentos();
        await renderizarHistorialActualizaciones();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Actualización eliminada correctamente.'
        });
    } catch (error) {
        console.error('Error al eliminar seguimiento civil:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar la actualización',
            message: error.message || 'Ocurrió un problema al eliminar la actualización.'
        });
    }
}

window.confirmarEliminarSeguimientoCivil = confirmarEliminarSeguimientoCivil;

async function guardarActualizacion(event) {
    event.preventDefault();

    if (esCasoAcumuladoActualizacion()) {
        await window.appAlert?.({
            title: 'Asunto acumulado',
            message: 'Este asunto esta acumulado y no puede recibir seguimiento. Debe desacumularse primero.'
        });
        return;
    }

    const fechaActuacion = document.getElementById('fechaActuacion').value;
    const tipoActuacion = document.getElementById('tipoActuacion').value;
    const descripcion = (document.getElementById('descripcionActuacion').value || '').toUpperCase() || null;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value || null;
    const estatusAsunto = document.getElementById('estatusAsunto').value || null;

    if (fechaActuacion && fechaVencimiento && fechaVencimiento < fechaActuacion) {
        await window.appAlert?.({
            title: 'Rango de fechas inválido',
            message: 'La fecha de vencimiento no puede ser anterior a la fecha de actuación.'
        });
        return;
    }

    const nuevaActuacion = {
        fecha_actuacion: fechaActuacion,
        tipo_actuacion: tipoActuacion,
        descripcion,
        actualizado_siij: 'NO'
    };

    try {
        const resultado = await agregarSeguimientoCivilApi(
            casoActual.id,
            nuevaActuacion,
            fechaVencimiento,
            estatusAsunto
        );

        const inputPdf = document.getElementById('inputPDF');
        const archivoPdf = inputPdf?.files?.[0] || null;

        if (archivoPdf && resultado.actuacion?.id) {
            await subirDocumentoCivilApi(casoActual.id, resultado.actuacion.id, archivoPdf);
            limpiarArchivoSeleccionado();
        }

        casoActual = {
            ...casoActual,
            ...(resultado.expediente || {}),
            seguimiento: resultado.actuacion || nuevaActuacion,
            seguimientos: [resultado.actuacion || nuevaActuacion].concat(casoActual.seguimientos || [])
        };

        guardarCasoEnCacheLocal();
        await renderizarDocumentos();
        await renderizarHistorialActualizaciones();

        await window.appAlert?.({
            title: 'Cambios guardados',
            message: 'El registro se guardó correctamente.'
        });
        window.location.href = `detalleCaso.html?id=${casoActual.id}`;
    } catch (error) {
        console.error('Error al guardar seguimiento civil:', error);
        await window.appAlert?.({
            title: 'No se pudo guardar el seguimiento',
            message: error.message || 'Ocurrió un problema al guardar el seguimiento.'
        });
    }
}

function guardarCasoEnCacheLocal() {
    const casos = JSON.parse(localStorage.getItem('casos') || '[]');
    const index = casos.findIndex(caso => caso.id === casoActual.id);

    if (index !== -1) {
        casos[index] = { ...casos[index], ...casoActual };
    } else {
        casos.unshift(casoActual);
    }

    localStorage.setItem('casos', JSON.stringify(casos));
}
