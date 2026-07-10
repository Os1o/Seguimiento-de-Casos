let asuntoReferenciaRequerimientoPenal = null;

document.addEventListener('DOMContentLoaded', () => {
    const listInicial = document.getElementById('solicitudesInicialesList');
    const listSeguimiento = document.getElementById('seguimientoSolicitudesList');
    const btnAgregar = document.getElementById('btnAgregarSolicitudInicial');
    const btnGuardarFaseUno = document.getElementById('btnGuardarFaseUno');
    const btnGuardarFaseDos = document.getElementById('btnGuardarFaseDos');
    const btnGuardarFaseDosSalir = document.getElementById('btnGuardarFaseDosSalir');
    const btnContinuarFaseTres = document.getElementById('btnContinuarFaseTres');
    const btnGuardarFaseTres = document.getElementById('btnGuardarFaseTres');
    const btnRegresarFaseUno = document.getElementById('btnRegresarFaseUno');
    const btnRegresarFaseDos = document.getElementById('btnRegresarFaseDos');
    const fechaRecepcionFiscalia = document.getElementById('fechaRecepcionFiscalia');
    const fechaLimiteAtencionReq = document.getElementById('fechaLimiteAtencionReq');
    const fechaInicioInterno = document.getElementById('fechaInicioInterno');
    const fechaEnvioRespuestaFinal = document.getElementById('fechaEnvioRespuestaFinal');
    const fechaRespuestaFiscaliaFinal = document.getElementById('fechaRespuestaFiscaliaFinal');
    const areaResponsableReq = document.getElementById('areaResponsableReq');
    const documentoRequerimientoInterno = document.getElementById('documentoRequerimientoInterno');
    const faseDos = document.getElementById('faseSeguimientoInterno');
    const faseTres = document.getElementById('faseContestacionFinal');
    const pillTwo = document.getElementById('phasePillTwo');
    const pillThree = document.getElementById('phasePillThree');
    const urlParams = new URLSearchParams(window.location.search);
    const asuntoId = urlParams.get('id');
    const requerimientoId = urlParams.get('requerimiento_id');
    let usuarioActual = null;
    let requerimientoActual = null;
    let requerimientoGuardadoId = requerimientoId || null;
    let puedeModificarCerrados = false;
    const listadoUrl = asuntoId
        ? `listadoRequerimientosPenal.html?id=${encodeURIComponent(asuntoId)}`
        : 'listadoRequerimientosPenal.html';

    document.querySelectorAll('[data-requerimientos-list-link]').forEach((link) => {
        link.href = listadoUrl;
    });

    const mostrarCargaRequerimiento = () => window.mostrarCargaVista?.('.container');
    const ocultarCargaRequerimiento = () => window.ocultarCargaVista?.('.container');
    const mostrarAlertaRequerimiento = (titulo, mensaje) => {
        if (typeof window.appAlert === 'function') {
            return window.appAlert({
                title: titulo,
                message: mensaje,
                confirmText: 'Aceptar'
            });
        }

        window.alert(`${titulo}\n\n${mensaje}`);
        return Promise.resolve(true);
    };
    const confirmarRequerimiento = (titulo, mensaje, confirmText = 'Continuar') => {
        if (typeof window.appConfirm === 'function') {
            return window.appConfirm({
                title: titulo,
                message: mensaje,
                confirmText,
                cancelText: 'Cancelar'
            });
        }

        return Promise.resolve(window.confirm(`${titulo}\n\n${mensaje}`));
    };
    const crearErrorValidacion = (mensaje) => {
        const error = new Error(mensaje);
        error.esValidacion = true;
        return error;
    };
    const mostrarErrorRequerimiento = (error, mensajeDefault) => {
        const titulo = error?.esValidacion ? 'Datos incompletos' : 'No se pudo guardar';
        return mostrarAlertaRequerimiento(titulo, error?.message || mensajeDefault);
    };
    const tieneFechaConocimientoAmpRequerimiento = (asunto) => (
        Boolean(asunto?.fecha_conocimiento_amp || asunto?.fecha_conocimiento_fiscal)
    );
    const obtenerHoyIsoRequerimiento = () => {
        const hoy = new Date();
        const yyyy = hoy.getFullYear();
        const mm = String(hoy.getMonth() + 1).padStart(2, '0');
        const dd = String(hoy.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    };
    const obtenerFechaAmpReferencia = () => (
        asuntoReferenciaRequerimientoPenal?.fecha_conocimiento_amp
        || asuntoReferenciaRequerimientoPenal?.fecha_conocimiento_fiscal
        || ''
    );
    const bloquearAccesoRequerimientoSinAmp = async () => {
        await mostrarAlertaRequerimiento(
            'Registro AMP requerido',
            'No se puede acceder a Requerimientos sin registrar la fecha de conocimiento del AMP.'
        );
        window.location.href = 'penal.html';
    };
    const textoSinArchivo = 'SIN ARCHIVOS SELECCIONADOS';
    const usuarioEsAdmin = () => usuarioActual?.rol === 'admin';
    const tieneValorGuardado = (value) => value !== null && value !== undefined && String(value).trim() !== '';
    const obtenerUltimaContestacion = (requerimiento) => (
        Array.isArray(requerimiento?.contestaciones) && requerimiento.contestaciones.length > 0
            ? requerimiento.contestaciones[requerimiento.contestaciones.length - 1]
            : null
    );
    const bloquearCampoGuardado = (field, value) => {
        if (!field || usuarioEsAdmin() || !tieneValorGuardado(value)) {
            return;
        }

        if (field.tagName === 'SELECT' || field.type === 'file') {
            field.disabled = true;
            return;
        }

        field.readOnly = true;
    };
    const verificarSesionRequerimiento = async () => {
        const usuarioStr = sessionStorage.getItem('usuario');
        if (usuarioStr) {
            return JSON.parse(usuarioStr);
        }

        const response = await fetch('api/session.php', {
            method: 'GET',
            credentials: 'same-origin',
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
            window.location.href = 'login.html';
            return null;
        }

        const user = result.data?.user || {};
        const usuario = {
            id: user.id ?? null,
            usuario: user.usuario ?? '',
            nombre_completo: user.nombreCompleto ?? '',
            rol: user.rol ?? '',
            delegacion_id: user.delegacionId ?? null,
            permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
            permiso_penal: Boolean(user.permisoPenal),
            es_jefe: Boolean(user.esJefe),
            session_token: user.sessionToken ?? '',
        };

        sessionStorage.setItem('usuario', JSON.stringify(usuario));
        return usuario;
    };
    const obtenerDocumentoPorTipo = (documentos, tipo) => (
        Array.isArray(documentos)
            ? documentos.find((documento) => documento.tipo_documento === tipo) || null
            : null
    );
    const obtenerTipoDescargaDocumento = (documento, tipoFallback = '') => {
        const tipoExplicito = documento?.documento_tipo || '';
        if (tipoExplicito) {
            return tipoExplicito;
        }

        const tipoDocumento = documento?.tipo_documento || '';
        if (tipoDocumento === 'INICIAL_FISCALIA') {
            return 'REQUERIMIENTO_INICIAL';
        }

        if (tipoDocumento === 'INTERNO_IMSS') {
            return 'REQUERIMIENTO_INTERNO';
        }

        return tipoFallback;
    };
    const construirUrlDocumentoRequerimiento = (documento, tipoFallback = '') => {
        if (!documento?.id) {
            return '';
        }

        const tipoDocumento = obtenerTipoDescargaDocumento(documento, tipoFallback);
        const url = `api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(tipoDocumento || '')}`;
        return window.construirUrlApiConToken?.(url) || url;
    };
    const actualizarEstadoArchivo = (input, statusElement, linkElement) => {
        if (!input || !statusElement || !linkElement) {
            return;
        }

        const selectedFile = input.files?.[0] || null;
        if (selectedFile) {
            input.style.width = 'auto';
            input.style.maxWidth = '240px';
            linkElement.hidden = true;
            linkElement.removeAttribute('href');
            linkElement.textContent = '';
            statusElement.hidden = true;
            statusElement.textContent = textoSinArchivo;
            return;
        }

        const existingName = input.dataset.documentoNombre || '';
        const existingUrl = input.dataset.documentoUrl || '';
        if (existingName && existingUrl) {
            input.style.width = 'auto';
            input.style.maxWidth = '240px';
            statusElement.hidden = true;
            statusElement.textContent = textoSinArchivo;
            linkElement.hidden = false;
            linkElement.href = existingUrl;
            linkElement.textContent = existingName;
            return;
        }

        input.style.width = 'auto';
        input.style.maxWidth = '240px';
        linkElement.hidden = true;
        linkElement.removeAttribute('href');
        linkElement.textContent = '';
        statusElement.hidden = false;
        statusElement.textContent = textoSinArchivo;
    };
    const configurarEstadoArchivo = ({ input, statusElement, linkElement, documento = null, tipoDocumento = '' }) => {
        if (!input || !statusElement || !linkElement) {
            return;
        }

        input.dataset.documentoNombre = documento?.nombre_original || '';
        input.dataset.documentoUrl = construirUrlDocumentoRequerimiento(documento, tipoDocumento);

        if (!input.dataset.fileStatusBound) {
            input.dataset.fileStatusBound = '1';
            input.addEventListener('change', () => actualizarEstadoArchivo(input, statusElement, linkElement));
        }

        actualizarEstadoArchivo(input, statusElement, linkElement);
    };
    const configurarEstadoArchivoPorId = ({ inputId, statusId, linkId, documento = null, tipoDocumento = '' }) => {
        configurarEstadoArchivo({
            input: document.getElementById(inputId),
            statusElement: document.getElementById(statusId),
            linkElement: document.getElementById(linkId),
            documento,
            tipoDocumento,
        });
    };
    const mostrarDocumentosActuales = (requerimiento) => {
        const documentos = requerimiento?.documentos || [];
        const contestacion = obtenerUltimaContestacion(requerimiento);

        configurarEstadoArchivoPorId({
            inputId: 'documentoFiscaliaInicial',
            statusId: 'documentoFiscaliaInicialStatus',
            linkId: 'documentoFiscaliaInicialLink',
            documento: obtenerDocumentoPorTipo(documentos, 'INICIAL_FISCALIA'),
            tipoDocumento: 'REQUERIMIENTO_INICIAL',
        });

        configurarEstadoArchivoPorId({
            inputId: 'documentoRequerimientoInterno',
            statusId: 'documentoRequerimientoInternoStatus',
            linkId: 'documentoRequerimientoInternoLink',
            documento: obtenerDocumentoPorTipo(documentos, 'INTERNO_IMSS'),
            tipoDocumento: 'REQUERIMIENTO_INTERNO',
        });

        configurarEstadoArchivoPorId({
            inputId: 'archivoRespuestaFinal',
            statusId: 'archivoRespuestaFinalStatus',
            linkId: 'archivoRespuestaFinalLink',
            documento: contestacion?.documento_contestacion || null,
            tipoDocumento: 'REQUERIMIENTO_CONTESTACION_ENVIADA',
        });

        configurarEstadoArchivoPorId({
            inputId: 'archivoFiscaliaFinal',
            statusId: 'archivoFiscaliaFinalStatus',
            linkId: 'archivoFiscaliaFinalLink',
            documento: contestacion?.documento_respuesta_fiscalia || null,
            tipoDocumento: 'REQUERIMIENTO_RESPUESTA_FISCALIA',
        });
    };
    const inicializarEstadosArchivo = () => {
        mostrarDocumentosActuales(null);
    };
    const aplicarBloqueosCamposGuardadosFaseDosTres = (requerimiento) => {
        if (!requerimiento || usuarioEsAdmin()) {
            return;
        }

        bloquearCampoGuardado(document.getElementById('fechaInicioInterno'), requerimiento.fecha_inicio_interno);
        bloquearCampoGuardado(areaResponsableReq, requerimiento.area_responsable_id || requerimiento.area_responsable_nombre);
        bloquearCampoGuardado(
            documentoRequerimientoInterno,
            obtenerDocumentoPorTipo(requerimiento.documentos || [], 'INTERNO_IMSS')?.id
        );

        const contestacion = obtenerUltimaContestacion(requerimiento);
        if (!contestacion) {
            return;
        }

        bloquearCampoGuardado(document.getElementById('fechaEnvioRespuestaFinal'), contestacion.fecha_envio_respuesta);
        bloquearCampoGuardado(document.getElementById('archivoRespuestaFinal'), contestacion.documento_contestacion?.id);
        bloquearCampoGuardado(document.getElementById('fechaRespuestaFiscaliaFinal'), contestacion.fecha_respuesta_fiscalia);
        bloquearCampoGuardado(document.getElementById('archivoFiscaliaFinal'), contestacion.documento_respuesta_fiscalia?.id);
        bloquearCampoGuardado(document.getElementById('notaRespuestaFinal'), contestacion.observaciones_finales);
    };

    cargarReferenciaAsunto(asuntoId);
    inicializarEstadosArchivo();

    if (!listInicial || !listSeguimiento || !btnAgregar || !btnGuardarFaseUno || !btnGuardarFaseDos || !faseDos || !faseTres) {
        return;
    }

    const esModoNuevoRequerimiento = !requerimientoId;

    const asegurarBotonEliminarSolicitudInicial = (item) => {
        if (!esModoNuevoRequerimiento || !item) {
            return;
        }

        if (item.querySelector('[data-delete-solicitud-inicial]')) {
            return;
        }

        const actions = document.createElement('div');
        actions.className = 'penal-req-item-actions penal-req-item-actions-start';
        actions.innerHTML = `
            <button type="button" class="btn btn-danger-outline" data-delete-solicitud-inicial>
                Eliminar solicitud
            </button>
        `;
        item.appendChild(actions);
    };

    const actualizarBotonesEliminarSolicitudesIniciales = () => {
        if (!esModoNuevoRequerimiento) {
            return;
        }

        const items = Array.from(listInicial.querySelectorAll('[data-seed-item]'));
        const mostrarEliminar = items.length > 1;

        items.forEach((item) => {
            asegurarBotonEliminarSolicitudInicial(item);
            const button = item.querySelector('[data-delete-solicitud-inicial]');
            if (button) {
                button.hidden = !mostrarEliminar;
            }
        });
    };

    const updateSolicitudIndices = () => {
        const items = listInicial.querySelectorAll('[data-seed-item]');
        items.forEach((item, index) => {
            const badge = item.querySelector('.penal-req-item-index');
            if (badge) {
                badge.textContent = `Solicitud ${String(index + 1).padStart(2, '0')}`;
            }
        });

        actualizarBotonesEliminarSolicitudesIniciales();
    };

    const createSolicitudTemplate = () => {
        const first = listInicial.querySelector('[data-seed-item]');
        const clone = first.cloneNode(true);

        clone.querySelectorAll('input, textarea, select').forEach((field) => {
            if (field.tagName === 'SELECT') {
                field.selectedIndex = 0;
            } else {
                field.value = '';
            }
        });

        asegurarBotonEliminarSolicitudInicial(clone);
        return clone;
    };

    const syncRecepcionCardState = (card) => {
        if (!card) {
            return;
        }

        const recepcionSelect = card.querySelector('.penal-req-recepcion-select');
        const recepcionFields = card.querySelector('.penal-req-recepcion-fields');
        const docInput = card.querySelector('.penal-req-doc-input');
        const obsInput = card.querySelector('.penal-req-obs-input');
        const fechaDesahogo = card.querySelector('.penal-req-fecha-desahogo');
        const isLocked = card.dataset.locked === '1';

        if (!recepcionSelect || !recepcionFields || !docInput || !obsInput || !fechaDesahogo) {
            return;
        }

        const isRecibido = recepcionSelect.value === 'recibido';
        recepcionFields.classList.toggle('is-hidden', !isRecibido);
        obsInput.required = false;
        fechaDesahogo.required = isRecibido && !isLocked;
        docInput.required = isRecibido && card.dataset.hasDocumento !== '1' && !isLocked;
    };

    const renderSeguimientoCards = (solicitudesGuardadas = null) => {
        const items = Array.isArray(solicitudesGuardadas)
            ? solicitudesGuardadas
            : Array.from(listInicial.querySelectorAll('[data-seed-item]')).map((item, index) => ({
                titulo: item.querySelector('.req-solicitud-titulo')?.value.trim() || `Solicitud ${String(index + 1).padStart(2, '0')}`,
                descripcion: item.querySelector('.req-solicitud-descripcion')?.value.trim() || 'Sin descripcion capturada.',
            }));
        const fragment = document.createDocumentFragment();

        items.forEach((item, index) => {
            const title = item.titulo || `Solicitud ${String(index + 1).padStart(2, '0')}`;
            const description = item.descripcion || 'Sin descripcion capturada.';
            const isDesahogada = item.estatus === 'DESAHOGADA';
            const existingDocument = item.documento || null;
            const existingDocumentName = existingDocument?.nombre_original || '';
            const isLocked = isDesahogada && !puedeModificarCerrados;

            const card = document.createElement('article');
            card.className = 'penal-req-follow-card';
            if (isLocked) {
                card.classList.add('is-locked');
            }
            card.dataset.locked = isLocked ? '1' : '0';
            if (item.id) {
                card.dataset.solicitudId = String(item.id);
            }
            if (existingDocumentName) {
                card.dataset.hasDocumento = '1';
            }
            card.innerHTML = `
                <div class="penal-req-follow-head">
                    <div>
                        <span class="penal-req-item-index">Solicitud ${String(index + 1).padStart(2, '0')}</span>
                        <h4>${escapeHtml(title)}</h4>
                    </div>
                    <span class="penal-preview-chip">${isDesahogada ? 'Desahogada' : 'Seguimiento'}</span>
                </div>

                <div class="penal-req-follow-copy">
                    <strong>Solicitud registrada</strong>
                    <p>${escapeHtml(description)}</p>
                </div>

                <div class="form-grid penal-req-item-grid penal-req-status-row">
                    <div class="form-group">
                    <label class="form-label">Estatus de atencion</label>
                    <div class="penal-req-status-field">
                            <span class="penal-req-status-chip">${isDesahogada ? 'Desahogada' : 'En tramite'}</span>
                        </div>
                    </div>
                </div>

                <div class="penal-req-switch-row penal-req-switch-row-formal">
                    <div class="penal-req-switch-copy">
                        <strong>Recepcion de informacion o documentacion</strong>
                        <small>Indique si ya se recibio informacion del area para atender esta solicitud.</small>
                    </div>
                    <select class="form-select penal-req-recepcion-select">
                        <option value="pendiente">Pendiente de recepcion</option>
                        <option value="recibido">Documentacion recibida</option>
                    </select>
                </div>

                <div class="penal-req-recepcion-fields is-hidden">
                    <div class="form-grid penal-req-item-grid">
                        <div class="form-group">
                            <label class="form-label required">Documento por solicitud</label>
                            <div class="penal-file-inline" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                                <input type="file" class="form-input penal-req-doc-input" accept=".pdf,application/pdf" style="width:auto;max-width:240px;">
                                <a href="#" class="penal-req-list-inline-link penal-req-doc-link" target="_blank" rel="noopener noreferrer" hidden></a>
                                <span class="penal-req-doc-status">${textoSinArchivo}</span>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Observaciones del documento</label>
                            <input type="text" class="form-input penal-req-obs-input" placeholder="Observaciones del documento recibido">
                        </div>
                    </div>

                    <div class="form-grid penal-req-item-grid">
                        <div class="form-group penal-req-date-group">
                            <label class="form-label required">Fecha de desahogo</label>
                            <input type="date" class="form-input penal-req-fecha-desahogo">
                        </div>
                    </div>
                </div>
            `;

            fragment.appendChild(card);

            const recepcionSelect = card.querySelector('.penal-req-recepcion-select');
            const docInput = card.querySelector('.penal-req-doc-input');
            const docStatus = card.querySelector('.penal-req-doc-status');
            const docLink = card.querySelector('.penal-req-doc-link');
            const obsInput = card.querySelector('.penal-req-obs-input');
            const fechaDesahogo = card.querySelector('.penal-req-fecha-desahogo');
            configurarEstadoArchivo({
                input: docInput,
                statusElement: docStatus,
                linkElement: docLink,
                documento: existingDocument,
                tipoDocumento: 'REQUERIMIENTO_SOLICITUD',
            });

            if (isDesahogada) {
                recepcionSelect.value = 'recibido';
                obsInput.value = item.observaciones_documento || '';
                fechaDesahogo.value = item.fecha_desahogo || '';
            }

            if (isLocked) {
                recepcionSelect.disabled = true;
                docInput.disabled = true;
                obsInput.disabled = true;
                fechaDesahogo.disabled = true;
            }

            syncRecepcionCardState(card);
        });

        // Render por fragmento: reduce reflows al reconstruir solicitudes de fase 2.
        listSeguimiento.replaceChildren(fragment);
    };

    const getSolicitudesIniciales = () => {
        return Array.from(listInicial.querySelectorAll('[data-seed-item]')).map((item) => ({
            titulo: item.querySelector('.req-solicitud-titulo')?.value.trim() || '',
            descripcion: item.querySelector('.req-solicitud-descripcion')?.value.trim() || '',
        }));
    };

    const guardarFaseUnoApi = async () => {
        const folioReferencia = document.getElementById('folioReferenciaReq')?.value.trim() || '';
        const autoridadEmisora = document.getElementById('autoridadEmisora')?.value.trim() || '';
        const fechaRecepcion = document.getElementById('fechaRecepcionFiscalia')?.value || '';
        const fechaLimiteAtencion = document.getElementById('fechaLimiteAtencionReq')?.value || '';
        const documentoInicial = document.getElementById('documentoFiscaliaInicial')?.files?.[0] || null;
        const documentoInicialActual = requerimientoActual
            ? obtenerDocumentoPorTipo(requerimientoActual.documentos || [], 'INICIAL_FISCALIA')
            : null;
        const solicitudes = getSolicitudesIniciales();
        const idActual = requerimientoGuardadoId || requerimientoActual?.id || null;

        if (!asuntoId) {
            throw new Error('No se encontro el asunto penal para registrar el requerimiento');
        }

        if (!folioReferencia || !autoridadEmisora || !fechaRecepcion || !fechaLimiteAtencion || (!documentoInicial && !documentoInicialActual)) {
            throw new Error('Completa los campos obligatorios del requerimiento inicial');
        }

        const fechaAmp = obtenerFechaAmpReferencia();
        if (fechaAmp && fechaRecepcion < fechaAmp) {
            throw new Error('La fecha de recepcion no puede ser menor a la fecha de conocimiento del AMP');
        }

        if (fechaRecepcion > obtenerHoyIsoRequerimiento()) {
            throw new Error('La fecha de recepcion no puede ser posterior a hoy');
        }

        if (fechaLimiteAtencion < fechaRecepcion) {
            throw new Error('La fecha limite de atencion no puede ser menor a la fecha de recepcion');
        }

        if (solicitudes.some((solicitud) => !solicitud.titulo || !solicitud.descripcion)) {
            throw new Error('Todas las solicitudes deben tener titulo y descripcion');
        }

        const formData = new FormData();
        formData.append('asunto_id', asuntoId);
        if (idActual) {
            formData.append('requerimiento_id', String(idActual));
        }
        formData.append('folio_referencia', folioReferencia);
        formData.append('autoridad_emisora', autoridadEmisora);
        formData.append('fecha_recepcion', fechaRecepcion);
        formData.append('fecha_limite_atencion', fechaLimiteAtencion);
        formData.append('solicitudes', JSON.stringify(solicitudes));

        if (documentoInicial) {
            formData.append('documento_inicial', documentoInicial);
        }

        const response = await fetch('api/penal/requerimientos/saveInitial.php', {
            method: 'POST',
            body: formData,
        });

        const rawResponse = await response.text();
        let payload = null;

        try {
            payload = JSON.parse(rawResponse);
        } catch (error) {
            throw new Error('La API no devolvio una respuesta valida');
        }

        if (!response.ok || !payload?.ok) {
            throw new Error(payload?.message || 'No se pudo registrar el requerimiento');
        }

        return payload.data || {};
    };

    const cargarCatalogoAreasResponsables = async () => {
        if (!areaResponsableReq) {
            return;
        }

        const response = await fetch('api/penal/getNewCaseCatalogs.php', {
            credentials: 'same-origin',
        });
        const rawResponse = await response.text();
        let payload = null;

        try {
            payload = JSON.parse(rawResponse);
        } catch (error) {
            throw new Error('La API de catalogos no devolvio una respuesta valida');
        }

        if (!response.ok || !payload?.ok) {
            throw new Error(payload?.message || 'No se pudieron cargar las areas responsables');
        }

        const areas = Array.isArray(payload.data?.areas) ? payload.data.areas : [];
        areaResponsableReq.innerHTML = '<option value="">Seleccione...</option>';

        areas.forEach((area) => {
            const option = document.createElement('option');
            option.value = String(area.id);
            option.textContent = area.nombre || '';
            areaResponsableReq.appendChild(option);
        });
    };

    const cargarRequerimientoDesdeApi = async (id) => {
        if (!asuntoId || !id) {
            return null;
        }

        const response = await fetch(`api/penal/requerimientos/list.php?id=${encodeURIComponent(asuntoId)}`, {
            credentials: 'same-origin',
        });
        const data = await response.json();

        if (!response.ok && String(data.message || '').includes('fecha de conocimiento del AMP')) {
            await bloquearAccesoRequerimientoSinAmp();
            return null;
        }

        if (!response.ok || !data.ok) {
            throw new Error(data.message || 'No se pudo cargar el requerimiento');
        }

        puedeModificarCerrados = Boolean(data.data?.permisos?.puede_modificar_cerrados);

        const requerimientos = data.data?.requerimientos || [];
        return requerimientos.find((item) => String(item.id) === String(id)) || null;
    };

    const guardarFaseDosApi = async () => {
        const id = requerimientoGuardadoId || requerimientoActual?.id || null;

        if (!id) {
            throw new Error('Primero guarda el alta inicial del requerimiento');
        }

        const fechaInicioInterno = document.getElementById('fechaInicioInterno')?.value || '';
        const areaResponsableId = areaResponsableReq?.value || '';

        if (!fechaInicioInterno || !areaResponsableId) {
            throw crearErrorValidacion('Completa la fecha de inicio y el area responsable.');
        }

        const fechaRecepcion = fechaRecepcionFiscalia?.value || requerimientoActual?.fecha_recepcion || '';
        if (fechaRecepcion && fechaInicioInterno < fechaRecepcion) {
            throw crearErrorValidacion('La fecha de inicio interno no puede ser menor a la fecha de recepcion.');
        }

        if (fechaInicioInterno > obtenerHoyIsoRequerimiento()) {
            throw crearErrorValidacion('La fecha de inicio interno no puede ser posterior a hoy.');
        }

        const validation = validateFaseDos();
        if (!validation.ok) {
            throw new Error('Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
        }

        const formData = new FormData();
        formData.append('requerimiento_id', id);
        formData.append('fecha_inicio_interno', fechaInicioInterno);
        formData.append('area_responsable_id', areaResponsableId);

        const solicitudes = Array.from(listSeguimiento.querySelectorAll('.penal-req-follow-card')).map((card) => {
            if (card.dataset.locked === '1') {
                return null;
            }

            const solicitudId = card.dataset.solicitudId || '';
            const recepcionSelect = card.querySelector('.penal-req-recepcion-select');
            const obsInput = card.querySelector('.penal-req-obs-input');
            const fechaDesahogo = card.querySelector('.penal-req-fecha-desahogo');
            const docInput = card.querySelector('.penal-req-doc-input');
            const docFile = docInput?.files?.[0] || null;

            if (docFile && solicitudId) {
                formData.append(`solicitud_documento_${solicitudId}`, docFile);
            }

            return {
                id: solicitudId,
                estado_recepcion: recepcionSelect?.value || 'pendiente',
                observaciones_documento: obsInput?.value.trim() || '',
                fecha_desahogo: fechaDesahogo?.value || '',
            };
        }).filter(Boolean);

        formData.append('solicitudes', JSON.stringify(solicitudes));

        const documentoInterno = documentoRequerimientoInterno?.files?.[0] || null;
        if (documentoInterno) {
            formData.append('documento_interno', documentoInterno);
        }

        const response = await fetch('api/penal/requerimientos/savePhaseTwo.php', {
            method: 'POST',
            body: formData,
        });
        const rawResponse = await response.text();
        let payload = null;

        try {
            payload = JSON.parse(rawResponse);
        } catch (error) {
            throw new Error('La API no devolvio una respuesta valida');
        }

        if (!response.ok || !payload?.ok) {
            throw new Error(payload?.message || 'No se pudo guardar el seguimiento interno');
        }

        requerimientoGuardadoId = String(id);
        requerimientoActual = await cargarRequerimientoDesdeApi(id);

        if (requerimientoActual) {
            renderSeguimientoCards(requerimientoActual.solicitudes || []);
        }

        return {
            data: payload.data || {},
            validation,
        };
    };

    const validateFaseDos = () => {
        const cards = Array.from(listSeguimiento.querySelectorAll('.penal-req-follow-card'));
        let hasPendientes = false;

        for (const card of cards) {
            if (card.dataset.locked === '1') {
                continue;
            }

            const recepcionSelect = card.querySelector('.penal-req-recepcion-select');
            const fechaDesahogo = card.querySelector('.penal-req-fecha-desahogo');
            const docInput = card.querySelector('.penal-req-doc-input');

            if (!recepcionSelect) {
                continue;
            }

            const isRecibido = recepcionSelect.value === 'recibido';
            const hasFecha = Boolean(fechaDesahogo?.value);
            const hasExistingDoc = card.dataset.hasDocumento === '1';
            const hasNewDoc = Boolean(docInput?.files && docInput.files.length > 0);

            if (!isRecibido && !hasFecha && !hasNewDoc) {
                hasPendientes = true;
                continue;
            }

            if (!isRecibido || !hasFecha || (!hasExistingDoc && !hasNewDoc)) {
                return {
                    ok: false,
                    hasPendientes
                };
            }
        }

        return {
            ok: true,
            hasPendientes
        };
    };

    const guardarFaseTresApi = async () => {
        const id = requerimientoGuardadoId || requerimientoActual?.id || null;

        if (!id) {
            throw new Error('Primero guarda el requerimiento');
        }

        const contestacionActual = obtenerUltimaContestacion(requerimientoActual);
        const tieneDocumentoRespuestaActual = Boolean(contestacionActual?.documento_contestacion?.id);
        const tieneDocumentoFiscaliaActual = Boolean(contestacionActual?.documento_respuesta_fiscalia?.id);
        const fechaEnvio = document.getElementById('fechaEnvioRespuestaFinal')?.value || '';
        const archivoRespuesta = document.getElementById('archivoRespuestaFinal')?.files?.[0] || null;
        const fechaFiscalia = document.getElementById('fechaRespuestaFiscaliaFinal')?.value || '';
        const archivoFiscalia = document.getElementById('archivoFiscaliaFinal')?.files?.[0] || null;
        const observaciones = document.getElementById('notaRespuestaFinal')?.value.trim() || '';

        if (!fechaEnvio) {
            throw new Error('Captura la fecha de envio de la contestacion');
        }

        const fechaInicioBase = fechaInicioInterno?.value || requerimientoActual?.fecha_inicio_interno || '';
        if (fechaInicioBase && fechaEnvio < fechaInicioBase) {
            throw new Error('La fecha de envio de la contestacion no puede ser menor a la fecha de inicio interno');
        }

        if (fechaEnvio > obtenerHoyIsoRequerimiento()) {
            throw new Error('La fecha de envio de la contestacion no puede ser posterior a hoy');
        }

        if (fechaFiscalia && fechaFiscalia < fechaEnvio) {
            throw new Error('La fecha de recepcion de la respuesta de fiscalia no puede ser menor a la fecha de envio de la contestacion');
        }

        if (fechaFiscalia && fechaFiscalia > obtenerHoyIsoRequerimiento()) {
            throw new Error('La fecha de recepcion de la respuesta de fiscalia no puede ser posterior a hoy');
        }

        if (!archivoRespuesta && !tieneDocumentoRespuestaActual) {
            throw crearErrorValidacion('Adjunta el documento enviado por el IMSS.');
        }

        if ((fechaFiscalia && !archivoFiscalia && !tieneDocumentoFiscaliaActual) || (!fechaFiscalia && archivoFiscalia)) {
            throw crearErrorValidacion('La fecha y el documento de respuesta de la fiscalia deben capturarse juntos.');
        }

        const formData = new FormData();
        formData.append('requerimiento_id', id);
        formData.append('fecha_envio_respuesta', fechaEnvio);
        formData.append('observaciones_finales', observaciones);

        if (archivoRespuesta) {
            formData.append('documento_contestacion', archivoRespuesta);
        }

        if (fechaFiscalia) {
            formData.append('fecha_respuesta_fiscalia', fechaFiscalia);
        }

        if (archivoFiscalia) {
            formData.append('documento_respuesta_fiscalia', archivoFiscalia);
        }

        const response = await fetch('api/penal/requerimientos/savePhaseThree.php', {
            method: 'POST',
            body: formData,
        });
        const rawResponse = await response.text();
        let payload = null;

        try {
            payload = JSON.parse(rawResponse);
        } catch (error) {
            throw new Error('La API no devolvio una respuesta valida');
        }

        if (!response.ok || !payload?.ok) {
            throw new Error(payload?.message || 'No se pudo guardar la contestacion final');
        }

        requerimientoGuardadoId = String(id);
        requerimientoActual = await cargarRequerimientoDesdeApi(id);

        return payload.data || {};
    };

    const unlockPhase = (phaseElement, phasePill) => {
        phaseElement.classList.remove('is-locked');
        phasePill?.classList.remove('is-locked');
        phasePill?.classList.add('is-active');
    };

    const setFieldValue = (id, value) => {
        const field = document.getElementById(id);
        if (field) {
            field.value = value || '';
        }
    };

    const setSelectByTextOrValue = (id, value) => {
        const select = document.getElementById(id);
        if (!select || !value) {
            return;
        }

        const option = Array.from(select.options).find((item) => (
            item.value === String(value) || item.textContent.trim() === String(value).trim()
        ));

        if (option) {
            select.value = option.value;
        }
    };

    const setFaseUnoReadonly = () => {
        document.querySelectorAll('[data-phase="1"] input, [data-phase="1"] textarea, [data-phase="1"] select').forEach((field) => {
            field.disabled = true;
        });
        btnAgregar.style.display = 'none';
        btnGuardarFaseUno.textContent = 'Ir a seguimiento interno';
    };

    const setFaseTresReadonlyIfClosed = () => {
        aplicarBloqueosCamposGuardadosFaseDosTres(requerimientoActual);
    };

    const poblarSolicitudesIniciales = (solicitudes) => {
        const normalized = Array.isArray(solicitudes) && solicitudes.length > 0
            ? solicitudes
            : [{ titulo: '', descripcion: '' }];
        const baseTemplate = listInicial.querySelector('[data-seed-item]')?.cloneNode(true);

        if (!baseTemplate) {
            return;
        }

        listInicial.innerHTML = '';

        normalized.forEach((solicitud) => {
            const item = baseTemplate.cloneNode(true);
            const titulo = item.querySelector('.req-solicitud-titulo');
            const descripcion = item.querySelector('.req-solicitud-descripcion');

            if (titulo) {
                titulo.value = solicitud.titulo || '';
            }
            if (descripcion) {
                descripcion.value = solicitud.descripcion || '';
            }

            listInicial.appendChild(item);
        });

        updateSolicitudIndices();
    };

    const cargarModoActualizacion = async () => {
        if (!asuntoId || !requerimientoId) {
            return;
        }

        try {
            requerimientoActual = await cargarRequerimientoDesdeApi(requerimientoId);

            if (!requerimientoActual) {
                throw new Error('Requerimiento no encontrado');
            }

            requerimientoGuardadoId = String(requerimientoActual.id);

            setFieldValue('folioReferenciaReq', requerimientoActual.folio_referencia);
            setFieldValue('autoridadEmisora', requerimientoActual.autoridad_emisora);
            setFieldValue('fechaRecepcionFiscalia', requerimientoActual.fecha_recepcion);
            setFieldValue('fechaLimiteAtencionReq', requerimientoActual.fecha_limite_atencion);
            setFieldValue('fechaInicioInterno', requerimientoActual.fecha_inicio_interno);
            syncFechaLimiteMin();
            syncFechaInicioInternoRange();
            setSelectByTextOrValue('areaResponsableReq', requerimientoActual.area_responsable_nombre || requerimientoActual.area_responsable_id);
            const contestacion = obtenerUltimaContestacion(requerimientoActual);
            if (contestacion) {
                setFieldValue('fechaEnvioRespuestaFinal', contestacion.fecha_envio_respuesta);
                setFieldValue('fechaRespuestaFiscaliaFinal', contestacion.fecha_respuesta_fiscalia);
                setFieldValue('notaRespuestaFinal', contestacion.observaciones_finales);
            }
            mostrarDocumentosActuales(requerimientoActual);

            poblarSolicitudesIniciales(requerimientoActual.solicitudes || []);
            renderSeguimientoCards(requerimientoActual.solicitudes || []);
            if (!puedeModificarCerrados) {
                setFaseUnoReadonly();
            }
            unlockPhase(faseDos, pillTwo);
            if (Array.isArray(requerimientoActual.contestaciones) && requerimientoActual.contestaciones.length > 0) {
                unlockPhase(faseTres, pillThree);
                setFaseTresReadonlyIfClosed();
            }
            aplicarBloqueosCamposGuardadosFaseDosTres(requerimientoActual);
            syncFechaLimiteMin();
            syncFechaInicioInternoRange();
            syncFechasFaseTresRange();
        } catch (error) {
            console.error('No se pudo cargar el requerimiento para actualizacion:', error);
            await mostrarAlertaRequerimiento('No se pudo cargar', error.message || 'No se pudo cargar el requerimiento.');
        }
    };

    const syncFechaLimiteMin = () => {
        if (!fechaRecepcionFiscalia || !fechaLimiteAtencionReq) {
            return;
        }

        fechaRecepcionFiscalia.min = obtenerFechaAmpReferencia();
        fechaRecepcionFiscalia.max = obtenerHoyIsoRequerimiento();
        fechaLimiteAtencionReq.min = fechaRecepcionFiscalia.value || '';

        if (fechaRecepcionFiscalia.min && fechaRecepcionFiscalia.value && fechaRecepcionFiscalia.value < fechaRecepcionFiscalia.min) {
            fechaRecepcionFiscalia.value = '';
        }

        if (fechaRecepcionFiscalia.max && fechaRecepcionFiscalia.value && fechaRecepcionFiscalia.value > fechaRecepcionFiscalia.max) {
            fechaRecepcionFiscalia.value = '';
        }

        if (fechaRecepcionFiscalia.value && fechaLimiteAtencionReq.value && fechaLimiteAtencionReq.value < fechaRecepcionFiscalia.value) {
            fechaLimiteAtencionReq.value = '';
        }
    };

    const syncFechaInicioInternoRange = () => {
        if (!fechaInicioInterno) {
            return;
        }

        fechaInicioInterno.min = fechaRecepcionFiscalia?.value || '';
        fechaInicioInterno.max = obtenerHoyIsoRequerimiento();

        if (fechaInicioInterno.min && fechaInicioInterno.value && fechaInicioInterno.value < fechaInicioInterno.min) {
            fechaInicioInterno.value = '';
        }

        if (fechaInicioInterno.max && fechaInicioInterno.value && fechaInicioInterno.value > fechaInicioInterno.max) {
            fechaInicioInterno.value = '';
        }
    };

    const syncFechasFaseTresRange = () => {
        const hoy = obtenerHoyIsoRequerimiento();

        if (fechaEnvioRespuestaFinal) {
            fechaEnvioRespuestaFinal.min = fechaInicioInterno?.value || '';
            fechaEnvioRespuestaFinal.max = hoy;

            if (fechaEnvioRespuestaFinal.min && fechaEnvioRespuestaFinal.value && fechaEnvioRespuestaFinal.value < fechaEnvioRespuestaFinal.min) {
                fechaEnvioRespuestaFinal.value = '';
            }

            if (fechaEnvioRespuestaFinal.max && fechaEnvioRespuestaFinal.value && fechaEnvioRespuestaFinal.value > fechaEnvioRespuestaFinal.max) {
                fechaEnvioRespuestaFinal.value = '';
            }
        }

        if (fechaRespuestaFiscaliaFinal) {
            fechaRespuestaFiscaliaFinal.min = fechaEnvioRespuestaFinal?.value || '';
            fechaRespuestaFiscaliaFinal.max = hoy;

            if (fechaRespuestaFiscaliaFinal.min && fechaRespuestaFiscaliaFinal.value && fechaRespuestaFiscaliaFinal.value < fechaRespuestaFiscaliaFinal.min) {
                fechaRespuestaFiscaliaFinal.value = '';
            }

            if (fechaRespuestaFiscaliaFinal.max && fechaRespuestaFiscaliaFinal.value && fechaRespuestaFiscaliaFinal.value > fechaRespuestaFiscaliaFinal.max) {
                fechaRespuestaFiscaliaFinal.value = '';
            }
        }
    };

    const validateAndContinueFaseTres = async () => {
        const validation = validateFaseDos();

        if (!validation.ok) {
            await mostrarAlertaRequerimiento('Datos incompletos', 'Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        if (validation.hasPendientes) {
            const proceed = await confirmarRequerimiento(
                'Continuar a contestacion final',
                'Quedan requerimientos pendientes por desahogar. Esta seguro de que desea continuar a la contestacion final?',
                'Continuar'
            );
            if (!proceed) {
                return;
            }
        }

        unlockPhase(faseTres, pillThree);
        faseTres.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const continueFaseTres = async () => {
        const validation = validateFaseDos();

        if (!validation.ok) {
            await mostrarAlertaRequerimiento('Datos incompletos', 'Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        if (validation.hasPendientes) {
            const proceed = await confirmarRequerimiento(
                'Continuar a contestacion final',
                'Quedan requerimientos pendientes por desahogar. Esta seguro de que desea continuar a la contestacion final?',
                'Continuar'
            );
            if (!proceed) {
                return;
            }
        }

        btnContinuarFaseTres.disabled = true;
        const originalText = btnContinuarFaseTres.textContent;
        btnContinuarFaseTres.textContent = 'Guardando...';
        mostrarCargaRequerimiento();

        try {
            await guardarFaseDosApi();
            unlockPhase(faseTres, pillThree);
            faseTres.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            await mostrarErrorRequerimiento(error, 'No se pudo guardar el seguimiento interno.');
        } finally {
            await ocultarCargaRequerimiento();
            btnContinuarFaseTres.disabled = false;
            btnContinuarFaseTres.textContent = originalText;
        }
    };

    fechaRecepcionFiscalia?.addEventListener('change', () => {
        syncFechaLimiteMin();
        syncFechaInicioInternoRange();
        syncFechasFaseTresRange();
    });
    fechaLimiteAtencionReq?.addEventListener('change', syncFechaInicioInternoRange);
    fechaInicioInterno?.addEventListener('change', syncFechasFaseTresRange);
    fechaEnvioRespuestaFinal?.addEventListener('change', syncFechasFaseTresRange);
    syncFechaLimiteMin();
    syncFechaInicioInternoRange();
    syncFechasFaseTresRange();

    // Un solo listener delegado para tarjetas regeneradas de fase 2.
    listSeguimiento.addEventListener('change', (event) => {
        const target = event.target instanceof Element ? event.target : event.target?.parentElement;
        const recepcionSelect = target?.closest('.penal-req-recepcion-select');
        if (!recepcionSelect) {
            return;
        }

        syncRecepcionCardState(recepcionSelect.closest('.penal-req-follow-card'));
    });

    btnAgregar.addEventListener('click', () => {
        const clone = createSolicitudTemplate();
        listInicial.appendChild(clone);
        updateSolicitudIndices();
    });

    if (esModoNuevoRequerimiento) {
        listInicial.addEventListener('click', (event) => {
            const button = event.target.closest('[data-delete-solicitud-inicial]');
            if (!button) {
                return;
            }

            const items = Array.from(listInicial.querySelectorAll('[data-seed-item]'));
            if (items.length <= 1) {
                actualizarBotonesEliminarSolicitudesIniciales();
                return;
            }

            button.closest('[data-seed-item]')?.remove();
            updateSolicitudIndices();
        });
    }

    btnGuardarFaseUno.addEventListener('click', async () => {
        if (requerimientoActual) {
            const faseUnoEditable = usuarioEsAdmin() && !document.getElementById('folioReferenciaReq')?.disabled;

            if (faseUnoEditable) {
                btnGuardarFaseUno.disabled = true;
                const originalText = btnGuardarFaseUno.textContent;
                btnGuardarFaseUno.textContent = 'Guardando...';
                mostrarCargaRequerimiento();

                try {
                    await guardarFaseUnoApi();
                    requerimientoActual = await cargarRequerimientoDesdeApi(requerimientoActual.id);
                    mostrarDocumentosActuales(requerimientoActual);
                    renderSeguimientoCards(requerimientoActual?.solicitudes || []);
                    unlockPhase(faseDos, pillTwo);
                    faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
                } catch (error) {
                    await mostrarAlertaRequerimiento('No se pudo guardar', error.message || 'No se pudo actualizar el requerimiento inicial.');
                    return;
                } finally {
                    await ocultarCargaRequerimiento();
                    btnGuardarFaseUno.disabled = false;
                    btnGuardarFaseUno.textContent = originalText;
                }

                return;
            }

            unlockPhase(faseDos, pillTwo);
            faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        btnGuardarFaseUno.disabled = true;
        const originalText = btnGuardarFaseUno.textContent;
        btnGuardarFaseUno.textContent = 'Guardando...';
        mostrarCargaRequerimiento();

        try {
            const result = await guardarFaseUnoApi();
            requerimientoGuardadoId = result.requerimiento_id ? String(result.requerimiento_id) : null;
            requerimientoActual = requerimientoGuardadoId
                ? await cargarRequerimientoDesdeApi(requerimientoGuardadoId)
                : null;

            renderSeguimientoCards(requerimientoActual?.solicitudes || []);
            if (!puedeModificarCerrados) {
                setFaseUnoReadonly();
            }
            unlockPhase(faseDos, pillTwo);
            faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            await mostrarAlertaRequerimiento('No se pudo registrar', error.message || 'No se pudo registrar el requerimiento.');
        } finally {
            await ocultarCargaRequerimiento();
            btnGuardarFaseUno.disabled = false;
            btnGuardarFaseUno.textContent = originalText;
        }
    });

    btnRegresarFaseUno?.addEventListener('click', () => {
        listInicial.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    btnRegresarFaseDos?.addEventListener('click', () => {
        faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    btnGuardarFaseDos.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';
        mostrarCargaRequerimiento();

        try {
            await guardarFaseDosApi();
            await mostrarAlertaRequerimiento('Seguimiento guardado', 'Seguimiento interno guardado correctamente.');
        } catch (error) {
            await mostrarErrorRequerimiento(error, 'No se pudo guardar el seguimiento interno.');
        } finally {
            await ocultarCargaRequerimiento();
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    btnGuardarFaseDosSalir?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';
        mostrarCargaRequerimiento();

        try {
            await guardarFaseDosApi();
            window.location.href = listadoUrl;
        } catch (error) {
            await mostrarErrorRequerimiento(error, 'No se pudo guardar el seguimiento interno.');
        } finally {
            await ocultarCargaRequerimiento();
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    btnContinuarFaseTres?.addEventListener('click', continueFaseTres);

    btnGuardarFaseTres?.addEventListener('click', async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';
        mostrarCargaRequerimiento();

        try {
            await guardarFaseTresApi();
            window.location.href = listadoUrl;
        } catch (error) {
            await mostrarErrorRequerimiento(error, 'No se pudo guardar la contestacion final.');
        } finally {
            await ocultarCargaRequerimiento();
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    (async () => {
        mostrarCargaRequerimiento();
        try {
            usuarioActual = await verificarSesionRequerimiento();
            if (!usuarioActual) {
                return;
            }
            await cargarCatalogoAreasResponsables();

            if (requerimientoId) {
                await cargarModoActualizacion();
            } else {
                updateSolicitudIndices();
            }
        } catch (error) {
            console.error('No se pudo inicializar el modulo de requerimientos:', error);
        } finally {
            await ocultarCargaRequerimiento();
        }
    })();
});

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function cargarReferenciaAsunto(asuntoId) {
    if (!asuntoId) {
        return;
    }

    try {
        const response = await fetch(`api/penal/requerimientos/list.php?id=${encodeURIComponent(asuntoId)}`, {
            credentials: 'same-origin',
        });
        const data = await response.json();

        if (!response.ok && String(data.message || '').includes('fecha de conocimiento del AMP')) {
            await bloquearAccesoReferenciaRequerimientoSinAmp();
            return;
        }

        if (!response.ok || !data.ok) {
            throw new Error(data.message || 'No se pudo cargar la referencia del asunto');
        }

        const asunto = data.data?.asunto || {};
        asuntoReferenciaRequerimientoPenal = asunto;
        if (!Boolean(asunto?.fecha_conocimiento_amp || asunto?.fecha_conocimiento_fiscal)) {
            await bloquearAccesoReferenciaRequerimientoSinAmp();
            return;
        }

        const fechaAmp = asunto.fecha_conocimiento_amp || asunto.fecha_conocimiento_fiscal || '';
        const hoy = new Date();
        const hoyIso = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}-${String(hoy.getDate()).padStart(2, '0')}`;
        const fechaRecepcion = document.getElementById('fechaRecepcionFiscalia');
        if (fechaRecepcion) {
            fechaRecepcion.min = fechaAmp;
            fechaRecepcion.max = hoyIso;
        }

        setReferenciaText('reqRefNumeroCarpeta', asunto.numero_carpeta || '--');
        setReferenciaText('reqRefDelito', asunto.delito_nombre || '--');
        setReferenciaText('reqRefOoad', asunto.delegacion_nombre || '--');
    } catch (error) {
        console.error('No se pudo cargar la referencia del asunto penal:', error);
    }
}

async function bloquearAccesoReferenciaRequerimientoSinAmp() {
    if (typeof window.appAlert === 'function') {
        await window.appAlert({
            title: 'Registro AMP requerido',
            message: 'No se puede acceder a Requerimientos sin registrar la fecha de conocimiento del AMP.',
            confirmText: 'Aceptar'
        });
    } else {
        window.alert('Registro AMP requerido\n\nNo se puede acceder a Requerimientos sin registrar la fecha de conocimiento del AMP.');
    }

    window.location.href = 'penal.html';
}

function setReferenciaText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}
