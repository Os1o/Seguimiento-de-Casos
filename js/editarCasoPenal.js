// Edicion del registro inicial penal sobre el modelo nuevo.

const IMSS_NOMBRE = 'INSTITUTO MEXICANO DEL SEGURO SOCIAL';
const MAX_ARCHIVO_PDF = 10 * 1024 * 1024;

let catalogosPenal = {
    delegaciones: [],
    delitos: [],
    areas: []
};

let casoPenalActual = null;

const $ = (selector) => document.querySelector(selector);

function mostrarMensaje(titulo, mensaje, tipo = 'info') {
    if (typeof window.mostrarModalMensaje === 'function') {
        window.mostrarModalMensaje(titulo, mensaje, tipo);
        return;
    }

    alert(`${titulo}\n\n${mensaje}`);
}

function mostrarError(mensaje) {
    mostrarMensaje('No se pudo continuar', mensaje, 'error');
}

function mostrarExito(mensaje) {
    mostrarMensaje('Cambios guardados', mensaje, 'success');
}

function obtenerIdCaso() {
    const params = new URLSearchParams(window.location.search);
    const id = Number.parseInt(params.get('id') || '', 10);
    return Number.isFinite(id) && id > 0 ? id : null;
}

async function fetchJson(url, options = {}) {
    const response = await fetch(url, {
        credentials: 'same-origin',
        ...options
    });

    const result = await response.json();

    if (!response.ok || result.ok === false) {
        throw new Error(result.message || 'La solicitud no pudo completarse');
    }

    return result;
}

function llenarSelect(select, items, placeholder = 'Seleccione...') {
    if (!select) return;

    select.innerHTML = `<option value="">${placeholder}</option>`;
    items.forEach((item) => {
        const option = document.createElement('option');
        option.value = String(item.id);
        option.textContent = item.nombre || item.nombre_completo || item.descripcion || '';
        select.appendChild(option);
    });
}

function obtenerNumeroCarpeta() {
    const jurisdiccion = ($('#expJurisdiccion')?.value || '').trim().toUpperCase();
    const entidad = ($('#expEntidad')?.value || '').trim().toUpperCase();
    const ooad = ($('#expOoad')?.value || '').trim().toUpperCase();
    const numero = ($('#expNumero')?.value || '').trim();
    const anio = ($('#expAnio')?.value || '').trim();

    if (!jurisdiccion || !entidad || !ooad || !numero || !anio) {
        return '';
    }

    return `${jurisdiccion}/${entidad}/${ooad}/${numero}/${anio}`;
}

function actualizarPreviewExpediente() {
    const preview = $('#previewExpediente');
    if (!preview) return;

    preview.textContent = `Vista previa: ${obtenerNumeroCarpeta() || '---'}`;
}

function descomponerNumeroCarpeta(numeroCarpeta) {
    const partes = String(numeroCarpeta || '').split('/');
    if (partes.length !== 5) return;

    $('#expJurisdiccion').value = partes[0] || '';
    $('#expEntidad').value = partes[1] || '';
    $('#expOoad').value = partes[2] || '';
    $('#expNumero').value = partes[3] || '';
    $('#expAnio').value = partes[4] || '';
    actualizarPreviewExpediente();
}

function normalizarTextoInput(event) {
    const input = event.target;
    input.value = input.value.toUpperCase();
    actualizarPreviewExpediente();
}

function filtrarAreasPorDelegacion(areaSeleccionada = '') {
    const delegacionId = Number.parseInt($('#delegacion')?.value || '', 10);
    const areas = catalogosPenal.areas.filter((area) => Number(area.delegacion_id) === delegacionId);
    llenarSelect($('#areaGeneradora'), areas);

    if (areaSeleccionada) {
        $('#areaGeneradora').value = String(areaSeleccionada);
    }
}

function syncCuantia() {
    const sinCuantificar = $('#sinCuantificar')?.checked;
    const monto = $('#cuantiaMonto');
    if (!monto) return;

    monto.disabled = Boolean(sinCuantificar);
    monto.required = !sinCuantificar;

    if (sinCuantificar) {
        monto.value = '';
    }
}

function aplicarFormatoMoneda(event) {
    const input = event.target;
    const limpio = input.value.replace(/[^\d.]/g, '');
    const partes = limpio.split('.');
    const entero = partes.shift() || '';
    const decimal = partes.length > 0 ? `.${partes.join('').slice(0, 2)}` : '';
    input.value = entero + decimal;
}

function crearCampoPersona({ tipo, valor = '' }) {
    const esProbable = tipo === 'probable';
    const contenedor = esProbable
        ? $('#listaProbablesResponsables')
        : tipo === 'relacionado'
            ? $('#listaDenuncianteRelacionados')
            : $('#listaDenunciantesPrincipales');

    if (!contenedor) return null;

    const card = document.createElement('div');
    card.className = 'penal-person-card';
    card.dataset.personaTipo = tipo;

    const titulo = esProbable
        ? 'Probable responsable'
        : tipo === 'relacionado'
            ? 'Persona relacionada'
            : 'Denunciante principal';

    card.innerHTML = `
        <div class="penal-person-card-head">
            <h4></h4>
            <button type="button" class="btn btn-danger btn-sm" data-persona-remove>Eliminar</button>
        </div>
        <div class="form-group">
            <label class="form-label required">${esProbable ? 'Nombre del probable responsable' : 'Nombre'}</label>
            <input type="text" class="form-input" data-persona-nombre maxlength="150" placeholder="Nombre de la persona, empresa o institucion" required>
        </div>
    `;

    card.querySelector('[data-persona-nombre]').value = valor || '';
    card.querySelector('[data-persona-remove]').addEventListener('click', () => eliminarCampoPersona(tipo, card));
    contenedor.appendChild(card);

    renumerarPersonas(tipo);
    return card;
}

function renumerarPersonas(tipo) {
    const selector = tipo === 'probable'
        ? '#listaProbablesResponsables .penal-person-card'
        : tipo === 'relacionado'
            ? '#listaDenuncianteRelacionados .penal-person-card'
            : '#listaDenunciantesPrincipales .penal-person-card';

    document.querySelectorAll(selector).forEach((card, index) => {
        const titulo = card.querySelector('h4');
        const boton = card.querySelector('[data-persona-remove]');
        const base = tipo === 'probable'
            ? 'Probable responsable'
            : tipo === 'relacionado'
                ? 'Persona relacionada'
                : 'Denunciante principal';

        titulo.textContent = `${base} ${index + 1}`;

        if (boton) {
            boton.textContent = index === 0 ? 'Limpiar' : 'Eliminar';
        }
    });
}

function eliminarCampoPersona(tipo, card) {
    const selector = tipo === 'probable'
        ? '#listaProbablesResponsables .penal-person-card'
        : tipo === 'relacionado'
            ? '#listaDenuncianteRelacionados .penal-person-card'
            : '#listaDenunciantesPrincipales .penal-person-card';

    const cards = Array.from(document.querySelectorAll(selector));
    if (cards.length <= 1) {
        const input = card.querySelector('[data-persona-nombre]');
        if (input) input.value = '';
        return;
    }

    card.remove();
    renumerarPersonas(tipo);
}

function limpiarLista(selector) {
    const contenedor = $(selector);
    if (contenedor) contenedor.innerHTML = '';
}

function modoDenuncianteSeleccionado() {
    return document.querySelector('input[name="denuncianteModo"]:checked')?.value || 'IMSS';
}

function syncModoDenunciante() {
    const modo = modoDenuncianteSeleccionado();
    const relacionadosWrap = $('#denuncianteRelacionadosWrap');
    const principalesWrap = $('#denunciantePrincipalesWrap');
    const imssPill = $('#denuncianteImssPill');
    const escenarioPill = $('#denuncianteEscenarioPill');

    if (modo === 'IMSS') {
        relacionadosWrap.hidden = false;
        principalesWrap.hidden = true;
        imssPill.textContent = 'IMSS precargado';
        imssPill.classList.remove('is-muted');
        escenarioPill.textContent = 'Puede agregar personas relacionadas de forma opcional.';

        if (!$('#listaDenuncianteRelacionados .penal-person-card')) {
            crearCampoPersona({ tipo: 'relacionado' });
        }
        return;
    }

    relacionadosWrap.hidden = true;
    principalesWrap.hidden = false;

    if (modo === 'IMSS_OTRO') {
        imssPill.textContent = 'IMSS como coadyuvante';
        imssPill.classList.remove('is-muted');
        escenarioPill.textContent = 'Capture de 1 a N denunciantes principales. El IMSS quedara solo como coadyuvante.';
    } else {
        imssPill.textContent = 'IMSS no participa';
        imssPill.classList.add('is-muted');
        escenarioPill.textContent = 'Capture de 1 a N denunciantes principales. El IMSS no figurara en este escenario.';
    }

    if (!$('#listaDenunciantesPrincipales .penal-person-card')) {
        crearCampoPersona({ tipo: 'principal' });
    }
}

function syncQrr() {
    const qrr = $('#responsableQrr')?.checked;
    const wrap = $('#probablesResponsablesWrap');
    if (!wrap) return;

    wrap.hidden = Boolean(qrr);

    if (!qrr && !$('#listaProbablesResponsables .penal-person-card')) {
        crearCampoPersona({ tipo: 'probable' });
    }
}

function obtenerValoresPersonas(selector) {
    return Array.from(document.querySelectorAll(selector))
        .map((input) => input.value.trim().toUpperCase())
        .filter(Boolean);
}

function construirDenunciantesPayload() {
    const modo = modoDenuncianteSeleccionado();
    const denunciantes = [];

    if (modo === 'IMSS') {
        denunciantes.push({
            nombre: IMSS_NOMBRE,
            es_imss: true,
            es_coadyuvante: false,
            rol: 'PRINCIPAL'
        });

        obtenerValoresPersonas('#listaDenuncianteRelacionados [data-persona-nombre]').forEach((nombre) => {
            denunciantes.push({
                nombre,
                es_imss: false,
                es_coadyuvante: false,
                rol: 'RELACIONADO'
            });
        });
    }

    if (modo === 'IMSS_OTRO' || modo === 'OTRO') {
        const principales = obtenerValoresPersonas('#listaDenunciantesPrincipales [data-persona-nombre]');
        if (principales.length === 0) {
            throw new Error('Capture al menos un denunciante principal.');
        }

        principales.forEach((nombre) => {
            denunciantes.push({
                nombre,
                es_imss: false,
                es_coadyuvante: false,
                rol: 'PRINCIPAL'
            });
        });

        if (modo === 'IMSS_OTRO') {
            denunciantes.push({
                nombre: IMSS_NOMBRE,
                es_imss: true,
                es_coadyuvante: true,
                rol: 'COADYUVANTE'
            });
        }
    }

    return denunciantes;
}

function construirProbablesPayload() {
    if ($('#responsableQrr')?.checked) {
        return [{
            nombre: 'QUIEN RESULTE RESPONSABLE',
            qrr: true
        }];
    }

    const nombres = obtenerValoresPersonas('#listaProbablesResponsables [data-persona-nombre]');
    if (nombres.length === 0) {
        throw new Error('Capture al menos un probable responsable o marque Quien Resulte Responsable.');
    }

    return nombres.map((nombre) => ({ nombre, qrr: false }));
}

function escenarioBackend() {
    const modo = modoDenuncianteSeleccionado();
    if (modo === 'IMSS_OTRO') return 'COADYUVANCIA';
    if (modo === 'OTRO') return 'DISTINTO_IMSS';
    return 'IMSS';
}

function validarArchivoInicial() {
    const archivo = $('#archivoInicialPenal')?.files?.[0] || null;
    if (!archivo) return null;

    const nombre = archivo.name.toLowerCase();
    if (!nombre.endsWith('.pdf')) {
        throw new Error('El documento inicial debe ser PDF.');
    }

    if (archivo.type && archivo.type !== 'application/pdf') {
        throw new Error('El documento inicial debe ser PDF.');
    }

    if (archivo.size <= 0 || archivo.size > MAX_ARCHIVO_PDF) {
        throw new Error('El documento inicial no debe superar 10 MB.');
    }

    return archivo;
}

async function cargarCatalogos() {
    const result = await fetchJson('api/penal/getNewCaseCatalogs.php');
    const data = result.data || {};

    catalogosPenal = {
        delegaciones: data.delegaciones || [],
        delitos: data.delitos || [],
        areas: data.areas || []
    };

    llenarSelect($('#delegacion'), catalogosPenal.delegaciones);
    llenarSelect($('#delito'), catalogosPenal.delitos);
    llenarSelect($('#areaGeneradora'), []);
}

async function cargarCaso(id) {
    const result = await fetchJson(`api/penal/getCase.php?id=${encodeURIComponent(id)}`);
    return result.data?.case || result.data || null;
}

function poblarDenunciantes(caso) {
    limpiarLista('#listaDenuncianteRelacionados');
    limpiarLista('#listaDenunciantesPrincipales');

    const denunciantes = Array.isArray(caso.denunciantes) ? caso.denunciantes : [];
    const escenario = caso.escenario_denunciante || (caso.coadyuvancia ? 'COADYUVANCIA' : 'IMSS');
    const modo = escenario === 'COADYUVANCIA'
        ? 'IMSS_OTRO'
        : escenario === 'DISTINTO_IMSS'
            ? 'OTRO'
            : 'IMSS';

    const radio = document.querySelector(`input[name="denuncianteModo"][value="${modo}"]`);
    if (radio) radio.checked = true;

    syncModoDenunciante();

    if (modo === 'IMSS') {
        limpiarLista('#listaDenuncianteRelacionados');
        const relacionados = denunciantes.filter((item) => !item.es_imss);
        if (relacionados.length === 0) {
            crearCampoPersona({ tipo: 'relacionado' });
        } else {
            relacionados.forEach((item) => crearCampoPersona({ tipo: 'relacionado', valor: item.nombre }));
        }
        return;
    }

    limpiarLista('#listaDenunciantesPrincipales');
    const principales = denunciantes.filter((item) => !item.es_imss && (item.es_principal || item.rol === 'PRINCIPAL'));
    if (principales.length === 0) {
        crearCampoPersona({ tipo: 'principal' });
    } else {
        principales.forEach((item) => crearCampoPersona({ tipo: 'principal', valor: item.nombre }));
    }
}

function poblarProbables(caso) {
    limpiarLista('#listaProbablesResponsables');

    const probables = Array.isArray(caso.probables_responsables) ? caso.probables_responsables : [];
    const esQrr = probables.some((item) => item.es_qrr || item.qrr);

    $('#responsableQrr').checked = esQrr;
    syncQrr();

    if (esQrr) return;

    limpiarLista('#listaProbablesResponsables');
    if (probables.length === 0) {
        crearCampoPersona({ tipo: 'probable' });
    } else {
        probables.forEach((item) => crearCampoPersona({ tipo: 'probable', valor: item.nombre }));
    }
}

function poblarCaso(caso) {
    casoPenalActual = caso;
    const id = caso.id;

    const detalleUrl = `detalleCasoPenal.html?id=${encodeURIComponent(id)}`;
    $('#breadcrumbDetallePenal').href = detalleUrl;
    $('#btnCancelarEditarPenal').href = detalleUrl;
    document.querySelector('.app-header')?.setAttribute('data-back-href', detalleUrl);

    $('#delegacion').value = caso.delegacion_id || '';
    filtrarAreasPorDelegacion(caso.area_hechos_id || '');

    $('#fechaInicio').value = caso.fecha_presentacion_denuncia || caso.fecha_inicio || '';
    $('#delito').value = caso.delito_id || '';
    descomponerNumeroCarpeta(caso.numero_carpeta || caso.numero_expediente || '');

    $('#hechosVictimaDenunciante').value = caso.hechos_denunciante || '';
    $('#datoRelevante').value = caso.dato_relevante || '';
    $('#documentoInicialObservaciones').value = caso.documento_inicial_observaciones || '';

    $('#sinCuantificar').checked = Boolean(caso.sin_cuantificar);
    $('#cuantiaMonto').value = caso.cuantia_monto !== null && caso.cuantia_monto !== undefined ? String(caso.cuantia_monto) : '';
    syncCuantia();

    poblarDenunciantes(caso);
    poblarProbables(caso);
}

function validarFormularioBase() {
    const numero = obtenerNumeroCarpeta();
    if (!numero) {
        throw new Error('Capture el numero de carpeta completo.');
    }

    if (!/^(FED|LOC)\/[A-Z]{3,4}\/[A-Z]{3,4}\/\d{7}\/\d{4}$/.test(numero)) {
        throw new Error('El numero de carpeta no cumple el formato requerido.');
    }

    const hechos = $('#hechosVictimaDenunciante').value.trim();
    if (!hechos) {
        throw new Error('Capture los hechos con datos de la victima / denunciante.');
    }

    if (hechos.length > 1000) {
        throw new Error('Los hechos no pueden superar 1000 caracteres.');
    }

    const datoRelevante = $('#datoRelevante').value.trim();
    if (datoRelevante.length > 500) {
        throw new Error('El dato relevante no puede superar 500 caracteres.');
    }

    if (!$('#sinCuantificar').checked && !$('#cuantiaMonto').value.trim()) {
        throw new Error('Capture la cuantia o marque Sin cuantificar.');
    }

    validarArchivoInicial();
}

async function guardarCaso(event) {
    event.preventDefault();

    try {
        validarFormularioBase();

        const id = obtenerIdCaso();
        const numeroCarpeta = obtenerNumeroCarpeta();
        const denunciantes = construirDenunciantesPayload();
        const probables = construirProbablesPayload();
        const archivo = validarArchivoInicial();

        const formData = new FormData();
        formData.append('id', String(id));
        formData.append('delegacion_id', $('#delegacion').value);
        formData.append('numero_carpeta', numeroCarpeta);
        formData.append('anio_inicio', $('#expAnio').value);
        formData.append('fecha_presentacion_denuncia', $('#fechaInicio').value);
        formData.append('delito_id', $('#delito').value);
        formData.append('area_hechos_id', $('#areaGeneradora').value);
        formData.append('hechos_denunciante', $('#hechosVictimaDenunciante').value.trim());
        formData.append('dato_relevante', $('#datoRelevante').value.trim());
        formData.append('sin_cuantificar', $('#sinCuantificar').checked ? '1' : '0');
        formData.append('cuantia_monto', $('#sinCuantificar').checked ? '' : $('#cuantiaMonto').value.trim());
        formData.append('escenario_denunciante', escenarioBackend());
        formData.append('coadyuvancia', modoDenuncianteSeleccionado() === 'IMSS_OTRO' ? '1' : '0');
        formData.append('denunciantes', JSON.stringify(denunciantes));
        formData.append('probables_responsables', JSON.stringify(probables));
        formData.append('documento_inicial_observaciones', $('#documentoInicialObservaciones').value.trim());

        if (archivo) {
            formData.append('archivo_inicial', archivo);
        }

        await fetchJson('api/penal/updateCase.php', {
            method: 'POST',
            body: formData
        });

        mostrarExito('El asunto penal se actualizo correctamente.');

        setTimeout(() => {
            window.location.href = `detalleCasoPenal.html?id=${encodeURIComponent(id)}`;
        }, 500);
    } catch (error) {
        console.error('Error al actualizar asunto penal:', error);
        mostrarError(error.message || 'No se pudo guardar el asunto penal.');
    }
}

function registrarEventos() {
    $('#formEditarCaso')?.addEventListener('submit', guardarCaso);
    $('#delegacion')?.addEventListener('change', () => filtrarAreasPorDelegacion());
    $('#sinCuantificar')?.addEventListener('change', syncCuantia);
    $('#cuantiaMonto')?.addEventListener('input', aplicarFormatoMoneda);

    ['#expEntidad', '#expOoad'].forEach((selector) => {
        $(selector)?.addEventListener('input', normalizarTextoInput);
    });

    ['#expJurisdiccion', '#expNumero', '#expAnio'].forEach((selector) => {
        $(selector)?.addEventListener('input', actualizarPreviewExpediente);
        $(selector)?.addEventListener('change', actualizarPreviewExpediente);
    });

    document.querySelectorAll('input[name="denuncianteModo"]').forEach((radio) => {
        radio.addEventListener('change', syncModoDenunciante);
    });

    $('#btnAgregarDenuncianteRelacionado')?.addEventListener('click', () => crearCampoPersona({ tipo: 'relacionado' }));
    $('#btnAgregarDenunciantePrincipal')?.addEventListener('click', () => crearCampoPersona({ tipo: 'principal' }));
    $('#btnAgregarProbableResponsable')?.addEventListener('click', () => crearCampoPersona({ tipo: 'probable' }));
    $('#responsableQrr')?.addEventListener('change', syncQrr);
}

document.addEventListener('DOMContentLoaded', async () => {
    const id = obtenerIdCaso();
    if (!id) {
        mostrarError('No se recibio el identificador del asunto penal.');
        return;
    }

    registrarEventos();
    crearCampoPersona({ tipo: 'relacionado' });
    crearCampoPersona({ tipo: 'principal' });
    crearCampoPersona({ tipo: 'probable' });
    syncModoDenunciante();
    syncQrr();
    syncCuantia();

    try {
        await cargarCatalogos();
        const caso = await cargarCaso(id);

        if (!caso) {
            throw new Error('Caso penal no encontrado.');
        }

        poblarCaso(caso);
    } catch (error) {
        console.error('No se pudo cargar la edicion penal:', error);
        mostrarError(error.message || 'No se pudo cargar el asunto penal.');
    }
});
