document.addEventListener('DOMContentLoaded', () => {
    inicializarListadoRequerimientosPenal();
});

const LISTADO_REQUERIMIENTOS_API = 'api/penal/requerimientos/list.php';
const ELIMINAR_REQUERIMIENTO_API = 'api/penal/requerimientos/delete.php';
const RESTAURAR_REQUERIMIENTO_API = 'api/penal/requerimientos/restore.php';

let permisosListadoRequerimientos = {
    puedeEditar: false,
    puedeEliminar: false,
    puedeRestaurar: false,
};

function obtenerParametroUrl(nombre) {
    return new URLSearchParams(window.location.search).get(nombre);
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatearFecha(valor) {
    if (!valor) {
        return '--';
    }

    const fecha = String(valor).slice(0, 10);
    const partes = fecha.split('-');

    if (partes.length !== 3) {
        return fecha;
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerDocumentoPorTipo(documentos, tipo) {
    return (documentos || []).find((documento) => documento.tipo_documento === tipo) || null;
}

function crearLinkDocumento(documento) {
    if (!documento || !documento.ruta_archivo) {
        return '<strong>Sin documento registrado</strong>';
    }

    return `<strong><a href="${escaparHtml(documento.ruta_archivo)}" class="penal-req-list-inline-link" target="_blank" rel="noopener">${escaparHtml(documento.nombre_original || 'Ver documento')}</a></strong>`;
}

function renderResumenAsunto(asunto) {
    return `
        <div class="info-item">
            <span class="info-label">No. de carpeta</span>
            <span class="info-value">${escaparHtml(asunto.numero_carpeta || '--')}</span>
        </div>
        <div class="info-item">
            <span class="info-label">Delito que se investiga</span>
            <span class="info-value">${escaparHtml(asunto.delito_nombre || '--')}</span>
        </div>
        <div class="info-item">
            <span class="info-label">OOAD</span>
            <span class="info-value">${escaparHtml(asunto.delegacion_nombre || '--')}</span>
        </div>
    `;
}

function renderEstadisticas(stats) {
    return `
        <article class="card penal-req-list-stat">
            <span class="penal-req-list-stat-label">Total requerimientos</span>
            <strong class="penal-req-list-stat-value">${Number(stats.total_requerimientos || 0)}</strong>
        </article>
        <article class="card penal-req-list-stat">
            <span class="penal-req-list-stat-label">Solicitudes en tramite</span>
            <strong class="penal-req-list-stat-value">${Number(stats.solicitudes_en_tramite || 0)}</strong>
        </article>
        <article class="card penal-req-list-stat">
            <span class="penal-req-list-stat-label">Solicitudes desahogadas</span>
            <strong class="penal-req-list-stat-value">${Number(stats.solicitudes_desahogadas || 0)}</strong>
        </article>
    `;
}

function renderSolicitud(solicitud) {
    const estaDesahogada = solicitud.estatus === 'DESAHOGADA';
    const statusClass = estaDesahogada ? 'is-complete' : 'is-pending';
    const resumen = estaDesahogada
        ? 'Se recibio documentacion y cuenta con fecha de desahogo.'
        : 'Pendiente de recepcion por parte del area interna responsable.';

    return `
        <details class="penal-req-list-subcard penal-req-list-subcard-accordion">
            <summary class="penal-req-list-subcard-summary">
                <div class="penal-req-list-subcard-head">
                    <span class="penal-req-item-index">Solicitud ${String(solicitud.numero_orden || '').padStart(2, '0')}</span>
                    <span class="penal-req-list-substatus ${statusClass}">${escaparHtml(solicitud.estatus_label || 'En tramite')}</span>
                </div>
                <div class="penal-req-list-subcard-title-row">
                    <h4>${escaparHtml(solicitud.titulo || 'Solicitud sin titulo')}</h4>
                    <span class="material-symbols-outlined penal-req-list-subcard-chevron">expand_more</span>
                </div>
            </summary>
            <div class="penal-req-list-subcard-body">
                <div class="penal-req-list-subcard-detail-grid">
                    <div class="penal-req-list-subcard-detail-item">
                        <span class="penal-req-list-detail-label">Descripcion</span>
                        <strong>${escaparHtml(solicitud.descripcion || resumen)}</strong>
                    </div>
                    <div class="penal-req-list-subcard-detail-item">
                        <span class="penal-req-list-detail-label">Documento recibido</span>
                        ${crearLinkDocumento(solicitud.documento)}
                    </div>
                    <div class="penal-req-list-subcard-detail-item">
                        <span class="penal-req-list-detail-label">Fecha de desahogo</span>
                        <strong>${formatearFecha(solicitud.fecha_desahogo)}</strong>
                    </div>
                    <div class="penal-req-list-subcard-detail-item">
                        <span class="penal-req-list-detail-label">Observaciones</span>
                        <strong>${escaparHtml(solicitud.observaciones_documento || '--')}</strong>
                    </div>
                </div>
            </div>
        </details>
    `;
}

function renderSolicitudes(solicitudes) {
    if (!solicitudes || solicitudes.length === 0) {
        return `
            <div class="penal-req-list-empty-inline">
                No hay solicitudes registradas para este requerimiento.
            </div>
        `;
    }

    return solicitudes.map(renderSolicitud).join('');
}

function renderPanelInicial(requerimiento) {
    const documentoInicial = obtenerDocumentoPorTipo(requerimiento.documentos, 'INICIAL_FISCALIA');

    return `
        <section class="penal-req-phase-panel is-active" id="fase-inicial-${requerimiento.id}">
            <div class="penal-req-list-detail-grid">
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Documento inicial</span>
                    ${crearLinkDocumento(documentoInicial)}
                </div>
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Fecha de recepcion</span>
                    <strong>${formatearFecha(requerimiento.fecha_recepcion)}</strong>
                </div>
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Folio o referencia</span>
                    <strong>${escaparHtml(requerimiento.folio_referencia || '--')}</strong>
                </div>
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Solicitudes registradas</span>
                    <strong>${Number(requerimiento.solicitudes_total || 0)} solicitudes capturadas</strong>
                </div>
            </div>
        </section>
    `;
}

function renderPanelInterno(requerimiento) {
    const documentoInterno = obtenerDocumentoPorTipo(requerimiento.documentos, 'INTERNO_IMSS');

    return `
        <section class="penal-req-phase-panel" id="fase-interna-${requerimiento.id}">
            <div class="penal-req-list-detail-grid">
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Documento del requerimiento interno</span>
                    ${crearLinkDocumento(documentoInterno)}
                </div>
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Fecha de inicio</span>
                    <strong>${formatearFecha(requerimiento.fecha_inicio_interno)}</strong>
                </div>
                <div class="penal-req-list-detail-item">
                    <span class="penal-req-list-detail-label">Solicitudes en tramite</span>
                    <strong>${Number(requerimiento.solicitudes_en_tramite || 0)} pendientes por desahogar</strong>
                </div>
            </div>

            <div class="penal-req-list-subcards penal-req-list-subcards-accordion">
                ${renderSolicitudes(requerimiento.solicitudes)}
            </div>
        </section>
    `;
}

function renderPanelContestacion(requerimiento) {
    if (!requerimiento.contestaciones || requerimiento.contestaciones.length === 0) {
        return `
            <section class="penal-req-phase-panel" id="fase-contestacion-${requerimiento.id}">
                <div class="penal-req-list-empty-inline">
                    Todavia no hay contestacion final registrada.
                </div>
            </section>
        `;
    }

    const contestacionesHtml = requerimiento.contestaciones.map((contestacion) => `
        <div class="penal-req-list-detail-grid">
            <div class="penal-req-list-detail-item">
                <span class="penal-req-list-detail-label">Fecha de envio</span>
                <strong>${formatearFecha(contestacion.fecha_envio_respuesta)}</strong>
            </div>
            <div class="penal-req-list-detail-item">
                <span class="penal-req-list-detail-label">Fecha de respuesta fiscalia</span>
                <strong>${formatearFecha(contestacion.fecha_respuesta_fiscalia)}</strong>
            </div>
            <div class="penal-req-list-detail-item">
                <span class="penal-req-list-detail-label">Observaciones</span>
                <strong>${escaparHtml(contestacion.observaciones_finales || '--')}</strong>
            </div>
        </div>
    `).join('');

    return `
        <section class="penal-req-phase-panel" id="fase-contestacion-${requerimiento.id}">
            ${contestacionesHtml}
        </section>
    `;
}

function renderHistorial(requerimiento) {
    const movimientos = [];

    movimientos.push({
        fecha: requerimiento.created_at,
        tipo: 'Alta inicial',
        texto: `Se registro el requerimiento ${requerimiento.folio_referencia || ''}.`,
    });

    (requerimiento.solicitudes || []).forEach((solicitud) => {
        if (solicitud.fecha_desahogo) {
            movimientos.push({
                fecha: solicitud.fecha_desahogo,
                tipo: `Desahogo de solicitud ${String(solicitud.numero_orden || '').padStart(2, '0')}`,
                texto: solicitud.observaciones_documento || 'Se registro documentacion recibida.',
                documento: solicitud.documento,
            });
        }
    });

    const items = movimientos
        .sort((a, b) => String(b.fecha || '').localeCompare(String(a.fecha || '')))
        .map((movimiento) => `
            <article class="penal-req-list-history-item">
                <div class="penal-req-list-history-dot"></div>
                <div class="penal-req-list-history-content">
                    <div class="penal-req-list-history-topline">
                        <strong>${formatearFecha(movimiento.fecha)}</strong>
                        <span class="penal-req-list-history-type">${escaparHtml(movimiento.tipo)}</span>
                    </div>
                    <p>${escaparHtml(movimiento.texto)}</p>
                    ${movimiento.documento ? crearLinkDocumento(movimiento.documento) : ''}
                </div>
            </article>
        `).join('');

    return `
        <details class="penal-req-list-history">
            <summary class="penal-req-list-history-head">
                <div>
                    <h4>Historial del requerimiento</h4>
                    <span>Movimientos registrados</span>
                </div>
                <span class="material-symbols-outlined penal-req-list-history-chevron">expand_more</span>
            </summary>
            <div class="penal-req-list-history-timeline">
                ${items}
            </div>
        </details>
    `;
}

function obtenerClaseFase(fase) {
    if (fase === 'SEGUIMIENTO_INTERNO') {
        return 'is-phase-2';
    }

    if (fase === 'CONTESTACION_FINAL' || fase === 'CERRADO') {
        return 'is-phase-3';
    }

    return 'is-phase-1';
}

function renderRequerimiento(requerimiento) {
    const fase = requerimiento.fase_actual || 'ALTA_INICIAL';
    const faseClass = obtenerClaseFase(fase);
    const contestacionHabilitada = fase === 'CONTESTACION_FINAL' || fase === 'CERRADO' || (requerimiento.contestaciones || []).length > 0;
    const eliminado = requerimiento.eliminado === true || requerimiento.activo === false;
    const deletedMeta = eliminado
        ? `<span class="penal-req-list-card-deleted-meta">Eliminado${requerimiento.deleted_at ? `: ${formatearFecha(requerimiento.deleted_at)}` : ''}${requerimiento.deleted_by_nombre ? ` por ${escaparHtml(requerimiento.deleted_by_nombre)}` : ''}</span>`
        : '';
    const accionesHtml = eliminado
        ? (permisosListadoRequerimientos.puedeRestaurar
            ? `<button type="button" class="btn btn-secondary" data-restore-requerimiento="${Number(requerimiento.id)}">Restaurar requerimiento</button>`
            : '')
        : `
            ${permisosListadoRequerimientos.puedeEditar ? `<a href="requerimientosMinisterialesPenal.html?id=${encodeURIComponent(requerimiento.asunto_id || obtenerParametroUrl('id'))}&requerimiento_id=${encodeURIComponent(requerimiento.id)}" class="btn btn-primary">Actualizar requerimiento</a>` : ''}
            ${permisosListadoRequerimientos.puedeEliminar ? `<button type="button" class="btn btn-danger-outline" data-delete-requerimiento="${Number(requerimiento.id)}">Eliminar requerimiento</button>` : ''}
        `;

    return `
        <details class="card penal-req-list-card${eliminado ? ' is-deleted' : ''}" open>
            <summary class="penal-req-list-card-summary">
                <div class="penal-req-list-card-main">
                    <div class="penal-req-list-card-topline">
                        <span class="penal-req-list-card-folio">${escaparHtml(requerimiento.folio_referencia || `REQ-${requerimiento.id}`)}</span>
                        <span class="penal-req-list-phase-badge ${faseClass}">${escaparHtml(requerimiento.fase_actual_label || 'Alta inicial')}</span>
                        ${eliminado ? '<span class="penal-req-list-phase-badge is-deleted">Eliminado</span>' : ''}
                    </div>
                    <div class="penal-req-list-card-meta">
                        <span>${escaparHtml(requerimiento.autoridad_emisora || 'Autoridad no capturada')}</span>
                        <span>Recepcion: ${formatearFecha(requerimiento.fecha_recepcion)}</span>
                        <span>Limite: ${formatearFecha(requerimiento.fecha_limite_atencion)}</span>
                        ${deletedMeta}
                    </div>
                </div>

                <div class="penal-req-list-card-kpis">
                    <div class="penal-req-list-kpi">
                        <strong>${Number(requerimiento.solicitudes_total || 0)}</strong>
                        <span>Solicitudes</span>
                    </div>
                    <div class="penal-req-list-kpi">
                        <strong>${Number(requerimiento.solicitudes_en_tramite || 0)}</strong>
                        <span>En tramite</span>
                    </div>
                    <div class="penal-req-list-kpi">
                        <strong>${Number(requerimiento.solicitudes_desahogadas || 0)}</strong>
                        <span>Desahogadas</span>
                    </div>
                </div>

                <span class="material-symbols-outlined penal-req-list-chevron">expand_more</span>
            </summary>

            <div class="penal-req-list-card-body">
                <div class="penal-req-list-detail-grid">
                    <div class="penal-req-list-detail-item">
                        <span class="penal-req-list-detail-label">Autoridad / MP</span>
                        <strong>${escaparHtml(requerimiento.autoridad_emisora || '--')}</strong>
                    </div>
                    <div class="penal-req-list-detail-item">
                        <span class="penal-req-list-detail-label">Area responsable</span>
                        <strong>${escaparHtml(requerimiento.area_responsable_nombre || 'Sin asignar')}</strong>
                    </div>
                    <div class="penal-req-list-detail-item">
                        <span class="penal-req-list-detail-label">Fase actual</span>
                        <strong>${escaparHtml(requerimiento.fase_actual_label || '--')}</strong>
                    </div>
                </div>

                <div class="penal-req-phase-tabs" data-req-tabs>
                    <button type="button" class="penal-req-phase-tab is-active" data-target="fase-inicial-${requerimiento.id}">Registro inicial</button>
                    <button type="button" class="penal-req-phase-tab" data-target="fase-interna-${requerimiento.id}">Seguimiento interno</button>
                    <button type="button" class="penal-req-phase-tab ${contestacionHabilitada ? '' : 'is-disabled'}" data-target="fase-contestacion-${requerimiento.id}" ${contestacionHabilitada ? '' : 'disabled'}>Contestacion final</button>
                </div>

                <div class="penal-req-phase-panels">
                    ${renderPanelInicial(requerimiento)}
                    ${renderPanelInterno(requerimiento)}
                    ${renderPanelContestacion(requerimiento)}
                </div>

                ${renderHistorial(requerimiento)}

                <div class="penal-req-list-card-actions">
                    ${accionesHtml}
                </div>
            </div>
        </details>
    `;
}

function renderListaRequerimientos(requerimientos) {
    if (!requerimientos || requerimientos.length === 0) {
        return `
            <div class="card penal-req-list-empty">
                <h3>Sin requerimientos ministeriales</h3>
                <p>Este asunto todavia no tiene requerimientos registrados.</p>
            </div>
        `;
    }

    return requerimientos.map(renderRequerimiento).join('');
}

function inicializarTabsRequerimientos() {
    const tabGroups = document.querySelectorAll('[data-req-tabs]');

    tabGroups.forEach((group) => {
        const buttons = Array.from(group.querySelectorAll('.penal-req-phase-tab:not(.is-disabled)'));
        const cardBody = group.closest('.penal-req-list-card-body');
        const panels = cardBody ? Array.from(cardBody.querySelectorAll('.penal-req-phase-panel')) : [];

        const activate = (targetId) => {
            buttons.forEach((button) => {
                button.classList.toggle('is-active', button.dataset.target === targetId);
            });

            panels.forEach((panel) => {
                panel.classList.toggle('is-active', panel.id === targetId);
            });
        };

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                if (button.dataset.target) {
                    activate(button.dataset.target);
                }
            });
        });
    });
}

function mostrarErrorListado(mensaje) {
    const group = document.querySelector('.penal-req-list-group');
    if (!group) {
        return;
    }

    group.innerHTML = `
        <div class="card penal-req-list-empty">
            <h3>No se pudo cargar el listado</h3>
            <p>${escaparHtml(mensaje)}</p>
        </div>
    `;
}

async function ejecutarAccionRequerimiento(endpoint, id) {
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id }),
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
        throw new Error(data.message || 'No se pudo completar la accion.');
    }

    return data;
}

function inicializarAccionesRequerimientos(asuntoId) {
    document.querySelectorAll('[data-delete-requerimiento]').forEach((button) => {
        button.addEventListener('click', async () => {
            const id = Number(button.dataset.deleteRequerimiento || 0);
            if (!id) {
                return;
            }

            const confirmado = window.confirm('El requerimiento se ocultara del listado activo, pero podra restaurarse desde "Mostrar eliminados".\n\nDeseas continuar?');
            if (!confirmado) {
                return;
            }

            try {
                button.disabled = true;
                await ejecutarAccionRequerimiento(ELIMINAR_REQUERIMIENTO_API, id);
                await cargarListadoRequerimientos(asuntoId);
            } catch (error) {
                console.error('No se pudo eliminar el requerimiento:', error);
                window.alert(error.message || 'No se pudo eliminar el requerimiento.');
                button.disabled = false;
            }
        });
    });

    document.querySelectorAll('[data-restore-requerimiento]').forEach((button) => {
        button.addEventListener('click', async () => {
            const id = Number(button.dataset.restoreRequerimiento || 0);
            if (!id) {
                return;
            }

            try {
                button.disabled = true;
                await ejecutarAccionRequerimiento(RESTAURAR_REQUERIMIENTO_API, id);
                await cargarListadoRequerimientos(asuntoId);
            } catch (error) {
                console.error('No se pudo restaurar el requerimiento:', error);
                window.alert(error.message || 'No se pudo restaurar el requerimiento.');
                button.disabled = false;
            }
        });
    });
}

async function cargarListadoRequerimientos(asuntoId, options = {}) {
    const { showBlockLoader = false } = options;
    const summaryGrid = document.querySelector('.penal-req-summary-grid');
    const statsGrid = document.querySelector('.penal-req-list-stats');
    const group = document.querySelector('.penal-req-list-group');
    const deletedToggle = document.querySelector('#toggleEliminadosRequerimientos');
    const includeDeleted = deletedToggle?.checked === true;

    if (group) {
        group.innerHTML = `
            <div class="card penal-req-list-empty">
                <h3>Cargando requerimientos...</h3>
            </div>
        `;
    }

    if (showBlockLoader) {
        window.mostrarCargaBloque?.('.penal-req-list-group');
    }

    try {
        const response = await fetch(`${LISTADO_REQUERIMIENTOS_API}?id=${encodeURIComponent(asuntoId)}${includeDeleted ? '&include_deleted=1' : ''}`, {
            credentials: 'same-origin',
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error(data.message || 'No se pudo cargar el listado de requerimientos.');
        }

        const payload = data.data || {};
        const permisos = payload.permisos || {};

        permisosListadoRequerimientos = {
            puedeEditar: Boolean(permisos.puede_editar_requerimientos || permisos.puede_modificar_cerrados),
            puedeEliminar: Boolean(permisos.puede_eliminar_requerimientos || permisos.puede_modificar_cerrados),
            puedeRestaurar: Boolean(permisos.puede_restaurar_requerimientos || permisos.puede_modificar_cerrados),
        };

        const toggleWrap = document.querySelector('#toggleEliminadosRequerimientosWrap');
        if (toggleWrap) {
            toggleWrap.hidden = !(permisosListadoRequerimientos.puedeEliminar || permisosListadoRequerimientos.puedeRestaurar);
        }

        if (summaryGrid) {
            summaryGrid.innerHTML = renderResumenAsunto(payload.asunto || {});
        }

        if (statsGrid) {
            statsGrid.innerHTML = renderEstadisticas(payload.stats || {});
        }

        if (group) {
            group.innerHTML = renderListaRequerimientos(payload.requerimientos || []);
        }

        inicializarTabsRequerimientos();
        inicializarAccionesRequerimientos(asuntoId);
    } catch (error) {
        console.error('No se pudo cargar el listado de requerimientos:', error);
        mostrarErrorListado(error.message || 'Error inesperado.');
    } finally {
        if (showBlockLoader) {
            await window.ocultarCargaBloque?.('.penal-req-list-group');
        }
    }
}

async function inicializarListadoRequerimientosPenal() {
    const asuntoId = obtenerParametroUrl('id') || obtenerParametroUrl('asunto_id');
    const group = document.querySelector('.penal-req-list-group');
    const addButton = document.querySelector('.penal-req-list-add-btn');
    const detailBreadcrumb = document.querySelector('.breadcrumb a[href="detalleCasoPenal.html"]');

    if (group) {
        group.innerHTML = `
            <div class="card penal-req-list-empty">
                <h3>Cargando requerimientos...</h3>
            </div>
        `;
    }

    if (!asuntoId) {
        mostrarErrorListado('Falta el id del asunto en la URL.');
        return;
    }

    if (addButton) {
        addButton.href = `requerimientosMinisterialesPenal.html?id=${encodeURIComponent(asuntoId)}`;
    }

    if (detailBreadcrumb) {
        detailBreadcrumb.href = `detalleCasoPenal.html?id=${encodeURIComponent(asuntoId)}`;
    }

    const deletedToggle = document.querySelector('#toggleEliminadosRequerimientos');
    if (deletedToggle && !deletedToggle.dataset.bound) {
        deletedToggle.dataset.bound = '1';
        deletedToggle.addEventListener('change', () => {
            cargarListadoRequerimientos(asuntoId, { showBlockLoader: true });
        });
    }

    window.mostrarCargaVista?.('.container');
    try {
        await cargarListadoRequerimientos(asuntoId);
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
}
