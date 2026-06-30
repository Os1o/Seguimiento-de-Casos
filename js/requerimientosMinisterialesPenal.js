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
    const areaResponsableReq = document.getElementById('areaResponsableReq');
    const documentoRequerimientoInterno = document.getElementById('documentoRequerimientoInterno');
    const faseDos = document.getElementById('faseSeguimientoInterno');
    const faseTres = document.getElementById('faseContestacionFinal');
    const pillTwo = document.getElementById('phasePillTwo');
    const pillThree = document.getElementById('phasePillThree');
    const urlParams = new URLSearchParams(window.location.search);
    const asuntoId = urlParams.get('id');
    const requerimientoId = urlParams.get('requerimiento_id');
    let requerimientoActual = null;
    let requerimientoGuardadoId = requerimientoId || null;
    let puedeModificarCerrados = false;
    const listadoUrl = asuntoId
        ? `listadoRequerimientosPenal.html?id=${encodeURIComponent(asuntoId)}`
        : 'listadoRequerimientosPenal.html';

    document.querySelectorAll('[data-requerimientos-list-link]').forEach((link) => {
        link.href = listadoUrl;
    });

    cargarReferenciaAsunto(asuntoId);

    if (!listInicial || !listSeguimiento || !btnAgregar || !btnGuardarFaseUno || !btnGuardarFaseDos || !faseDos || !faseTres) {
        return;
    }

    const updateSolicitudIndices = () => {
        const items = listInicial.querySelectorAll('[data-seed-item]');
        items.forEach((item, index) => {
            const badge = item.querySelector('.penal-req-item-index');
            if (badge) {
                badge.textContent = `Solicitud ${String(index + 1).padStart(2, '0')}`;
            }
        });
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

        return clone;
    };

    const renderSeguimientoCards = (solicitudesGuardadas = null) => {
        const items = Array.isArray(solicitudesGuardadas)
            ? solicitudesGuardadas
            : Array.from(listInicial.querySelectorAll('[data-seed-item]')).map((item, index) => ({
                titulo: item.querySelector('.req-solicitud-titulo')?.value.trim() || `Solicitud ${String(index + 1).padStart(2, '0')}`,
                descripcion: item.querySelector('.req-solicitud-descripcion')?.value.trim() || 'Sin descripcion capturada.',
            }));
        listSeguimiento.innerHTML = '';

        items.forEach((item, index) => {
            const title = item.titulo || `Solicitud ${String(index + 1).padStart(2, '0')}`;
            const description = item.descripcion || 'Sin descripcion capturada.';
            const isDesahogada = item.estatus === 'DESAHOGADA';
            const existingDocumentName = item.documento?.nombre_original || '';
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
                            <input type="file" class="form-input penal-req-doc-input" accept=".pdf,application/pdf">
                            ${existingDocumentName ? `<small class="form-help">Documento actual: ${escapeHtml(existingDocumentName)}</small>` : ''}
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

            listSeguimiento.appendChild(card);

            const recepcionSelect = card.querySelector('.penal-req-recepcion-select');
            const recepcionFields = card.querySelector('.penal-req-recepcion-fields');
            const docInput = card.querySelector('.penal-req-doc-input');
            const obsInput = card.querySelector('.penal-req-obs-input');
            const fechaDesahogo = card.querySelector('.penal-req-fecha-desahogo');

            if (isDesahogada) {
                recepcionSelect.value = 'recibido';
                obsInput.value = item.observaciones_documento || '';
                fechaDesahogo.value = item.fecha_desahogo || '';
            }

            const syncRecepcionState = () => {
                const isRecibido = recepcionSelect.value === 'recibido';
                recepcionFields.classList.toggle('is-hidden', !isRecibido);
                obsInput.required = false;
                fechaDesahogo.required = isRecibido && !isLocked;
                docInput.required = isRecibido && card.dataset.hasDocumento !== '1' && !isLocked;
            };

            if (isLocked) {
                recepcionSelect.disabled = true;
                docInput.disabled = true;
                obsInput.disabled = true;
                fechaDesahogo.disabled = true;
            }

            recepcionSelect.addEventListener('change', syncRecepcionState);
            syncRecepcionState();
        });
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
        const solicitudes = getSolicitudesIniciales();

        if (!asuntoId) {
            throw new Error('No se encontro el asunto penal para registrar el requerimiento');
        }

        if (!folioReferencia || !autoridadEmisora || !fechaRecepcion || !fechaLimiteAtencion || !documentoInicial) {
            throw new Error('Completa los campos obligatorios del requerimiento inicial');
        }

        if (fechaLimiteAtencion < fechaRecepcion) {
            throw new Error('La fecha limite de atencion no puede ser menor a la fecha de recepcion');
        }

        if (solicitudes.some((solicitud) => !solicitud.titulo || !solicitud.descripcion)) {
            throw new Error('Todas las solicitudes deben tener titulo y descripcion');
        }

        const formData = new FormData();
        formData.append('asunto_id', asuntoId);
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
            throw new Error('Completa la fecha de inicio y el area responsable');
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

        const fechaEnvio = document.getElementById('fechaEnvioRespuestaFinal')?.value || '';
        const archivoRespuesta = document.getElementById('archivoRespuestaFinal')?.files?.[0] || null;
        const fechaFiscalia = document.getElementById('fechaRespuestaFiscaliaFinal')?.value || '';
        const archivoFiscalia = document.getElementById('archivoFiscaliaFinal')?.files?.[0] || null;
        const observaciones = document.getElementById('notaRespuestaFinal')?.value.trim() || '';

        if (!fechaEnvio) {
            throw new Error('Captura la fecha de envio de la contestacion');
        }

        if (!archivoRespuesta) {
            throw new Error('Adjunta el documento enviado por el IMSS');
        }

        if ((fechaFiscalia && !archivoFiscalia) || (!fechaFiscalia && archivoFiscalia)) {
            throw new Error('La fecha y el documento de respuesta de la fiscalia deben capturarse juntos');
        }

        const formData = new FormData();
        formData.append('requerimiento_id', id);
        formData.append('fecha_envio_respuesta', fechaEnvio);
        formData.append('observaciones_finales', observaciones);
        formData.append('documento_contestacion', archivoRespuesta);

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
        const hasContestacion = Array.isArray(requerimientoActual?.contestaciones)
            && requerimientoActual.contestaciones.length > 0;

        if (!hasContestacion || puedeModificarCerrados) {
            return;
        }

        document.querySelectorAll('[data-phase="3"] input, [data-phase="3"] textarea, [data-phase="3"] select').forEach((field) => {
            field.disabled = true;
        });

        if (btnGuardarFaseTres) {
            btnGuardarFaseTres.disabled = true;
            btnGuardarFaseTres.textContent = 'Contestacion registrada';
        }
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
            setSelectByTextOrValue('areaResponsableReq', requerimientoActual.area_responsable_nombre || requerimientoActual.area_responsable_id);

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
        } catch (error) {
            console.error('No se pudo cargar el requerimiento para actualizacion:', error);
            window.alert(error.message || 'No se pudo cargar el requerimiento');
        }
    };

    const syncFechaLimiteMin = () => {
        if (!fechaRecepcionFiscalia || !fechaLimiteAtencionReq) {
            return;
        }

        fechaLimiteAtencionReq.min = fechaRecepcionFiscalia.value || '';

        if (fechaRecepcionFiscalia.value && fechaLimiteAtencionReq.value && fechaLimiteAtencionReq.value < fechaRecepcionFiscalia.value) {
            fechaLimiteAtencionReq.value = '';
        }
    };

    const validateAndContinueFaseTres = () => {
        const validation = validateFaseDos();

        if (!validation.ok) {
            window.alert('Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        if (validation.hasPendientes) {
            const proceed = window.confirm('Quedan requerimientos pendientes por desahogar. ¿Esta seguro de que desea continuar a la contestacion final?');
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
            window.alert('Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        if (validation.hasPendientes) {
            const proceed = window.confirm('Quedan requerimientos pendientes por desahogar. ¿Esta seguro de que desea continuar a la contestacion final?');
            if (!proceed) {
                return;
            }
        }

        btnContinuarFaseTres.disabled = true;
        const originalText = btnContinuarFaseTres.textContent;
        btnContinuarFaseTres.textContent = 'Guardando...';

        try {
            await guardarFaseDosApi();
            unlockPhase(faseTres, pillThree);
            faseTres.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (error) {
            window.alert(error.message || 'No se pudo guardar el seguimiento interno');
        } finally {
            btnContinuarFaseTres.disabled = false;
            btnContinuarFaseTres.textContent = originalText;
        }
    };

    fechaRecepcionFiscalia?.addEventListener('change', syncFechaLimiteMin);
    syncFechaLimiteMin();

    btnAgregar.addEventListener('click', () => {
        const clone = createSolicitudTemplate();
        listInicial.appendChild(clone);
        updateSolicitudIndices();
    });

    btnGuardarFaseUno.addEventListener('click', async () => {
        if (requerimientoActual) {
            unlockPhase(faseDos, pillTwo);
            faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
        }

        btnGuardarFaseUno.disabled = true;
        const originalText = btnGuardarFaseUno.textContent;
        btnGuardarFaseUno.textContent = 'Guardando...';

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
            window.alert(error.message || 'No se pudo registrar el requerimiento');
        } finally {
            btnGuardarFaseUno.disabled = false;
            btnGuardarFaseUno.textContent = originalText;
        }
    });

    btnGuardarFaseDos.addEventListener('click', () => {
        const validation = validateFaseDos();

        if (!validation.ok) {
            window.alert('Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        window.alert('Seguimiento validado. El guardado definitivo de la fase 2 se conectara en el siguiente paso.');
        return;

        if (validation.hasPendientes) {
            const proceed = window.confirm('Quedan requerimientos pendientes por desahogar. ¿Esta seguro de que desea continuar a la contestacion final?');
            if (!proceed) {
                return;
            }
        }

        unlockPhase(faseTres, pillThree);
        faseTres.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    btnGuardarFaseDosSalir?.addEventListener('click', () => {
        const validation = validateFaseDos();

        if (!validation.ok) {
            window.alert('Complete los datos obligatorios de todas las solicitudes que ya fueron marcadas con documentacion recibida.');
            return;
        }

        window.alert('Seguimiento validado. El guardado definitivo de la fase 2 se conectara en el siguiente paso.');
    });

    btnContinuarFaseTres?.addEventListener('click', continueFaseTres);

    btnRegresarFaseUno?.addEventListener('click', () => {
        listInicial.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    btnRegresarFaseDos?.addEventListener('click', () => {
        faseDos.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    const replaceButtonHandler = (button, handler) => {
        if (!button || !button.parentNode) {
            return null;
        }

        const clone = button.cloneNode(true);
        button.parentNode.replaceChild(clone, button);
        clone.addEventListener('click', handler);
        return clone;
    };

    replaceButtonHandler(btnGuardarFaseDos, async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';

        try {
            await guardarFaseDosApi();
            window.alert('Seguimiento interno guardado correctamente.');
        } catch (error) {
            window.alert(error.message || 'No se pudo guardar el seguimiento interno');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    replaceButtonHandler(btnGuardarFaseDosSalir, async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';

        try {
            await guardarFaseDosApi();
            window.location.href = listadoUrl;
        } catch (error) {
            window.alert(error.message || 'No se pudo guardar el seguimiento interno');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    replaceButtonHandler(btnContinuarFaseTres, continueFaseTres);

    replaceButtonHandler(btnGuardarFaseTres, async (event) => {
        const button = event.currentTarget;
        button.disabled = true;
        const originalText = button.textContent;
        button.textContent = 'Guardando...';

        try {
            await guardarFaseTresApi();
            window.location.href = listadoUrl;
        } catch (error) {
            window.alert(error.message || 'No se pudo guardar la contestacion final');
        } finally {
            button.disabled = false;
            button.textContent = originalText;
        }
    });

    (async () => {
        try {
            await cargarCatalogoAreasResponsables();

            if (requerimientoId) {
                await cargarModoActualizacion();
            } else {
                updateSolicitudIndices();
            }
        } catch (error) {
            console.error('No se pudo inicializar el modulo de requerimientos:', error);
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

        if (!response.ok || !data.ok) {
            throw new Error(data.message || 'No se pudo cargar la referencia del asunto');
        }

        const asunto = data.data?.asunto || {};
        setReferenciaText('reqRefNumeroCarpeta', asunto.numero_carpeta || '--');
        setReferenciaText('reqRefDelito', asunto.delito_nombre || '--');
        setReferenciaText('reqRefOoad', asunto.delegacion_nombre || '--');
    } catch (error) {
        console.error('No se pudo cargar la referencia del asunto penal:', error);
    }
}

function setReferenciaText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}
