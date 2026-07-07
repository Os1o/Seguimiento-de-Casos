// =====================================================
// FORMULARIO PENAL - Nuevo caso penal
// =====================================================

let usuarioActual = null;
let catalogos = {
    delegaciones: [],
    delitos: [],
    categoriasDelito: [],
    areas: []
};
let limitadorDatoRelevantePenal = null;
let limitadorHechosVictimaPenal = null;
let contadorDenuncianteRelacionado = 0;
let contadorDenunciantePrincipal = 0;
let contadorProbableResponsable = 0;
const AREA_GENERADORA_ADD_VALUE = '__agregar_area_generadora_penal__';
const DELITO_ADD_VALUE = '__agregar_delito_penal__';
const SIN_CATEGORIA_DELITO_VALUE = '__sin_categoria__';

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

function actualizarInfoOOADFormularioPenal() {
    const infoOOAD = document.getElementById('infoOOAD');
    if (!infoOOAD || !usuarioActual) return;

    if (usuarioActual.delegacion_id) {
        const delegacion = (catalogos.delegaciones || []).find(item => item.id == usuarioActual.delegacion_id);
        if (delegacion) {
            infoOOAD.textContent = delegacion.nombre;
            return;
        }
    }

    infoOOAD.textContent = 'Todas las JSJ';
}

async function cargarCatalogosPenalFormulario() {
    const [catalogosResponse, areasResponse] = await Promise.all([
        fetch('api/penal/getNewCaseCatalogs.php', {
            method: 'GET',
            credentials: 'same-origin'
        }),
        fetch('api/penal/catalogs/getAreasGeneradoras.php', {
            method: 'GET',
            credentials: 'same-origin'
        })
    ]);

    const result = await catalogosResponse.json();
    const areasResult = await areasResponse.json();

    if (!catalogosResponse.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catálogos');
    }

    if (!areasResponse.ok || !areasResult.ok) {
        throw new Error(areasResult.message || 'No se pudieron cargar las áreas generadoras penales');
    }

    const data = result.data || {};
    const areasData = areasResult.data || {};

    catalogos = {
        delegaciones: data.delegaciones || [],
        delitos: data.delitos || [],
        categoriasDelito: data.categorias_delito || [],
        areas: areasData.areas || []
    };
}

async function guardarDelitoPenalApi(categoriaId, nombre) {
    const response = await fetch('api/penal/catalogs/saveDelito.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            categoria_id: categoriaId,
            nombre
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar el delito') + detail);
    }

    return result.data?.delito || null;
}

function usuarioPuedeAgregarDelitoPenal() {
    return ['admin', 'editor'].includes(String(usuarioActual?.rol || '').toLowerCase());
}

async function guardarAreaGeneradoraPenalApi(delegacionId, nombre) {
    const response = await fetch('api/penal/catalogs/saveAreaGeneradora.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            delegacion_id: delegacionId,
            nombre
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar el área generadora penal') + detail);
    }

    return result.data?.area || null;
}

function usuarioPuedeAgregarAreaGeneradoraPenal() {
    return ['admin', 'editor'].includes(String(usuarioActual?.rol || '').toLowerCase());
}

function abrirModalAreaGeneradoraPenal() {
    const delegacionId = parseInt(document.getElementById('delegacion')?.value || '', 10);

    if (!delegacionId) {
        window.appAlert?.({
            title: 'OOAD requerida',
            message: 'Selecciona una OOAD antes de agregar un área generadora.'
        });
        return;
    }

    const input = document.getElementById('nuevaAreaGeneradoraNombre');
    if (input) {
        input.value = '';
    }

    const modal = document.getElementById('modalAreaGeneradoraPenal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => input?.focus(), 50);
    }
}

function cerrarModalAreaGeneradoraPenal() {
    const modal = document.getElementById('modalAreaGeneradoraPenal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function guardarNuevaAreaGeneradoraPenal() {
    const delegacionId = parseInt(document.getElementById('delegacion')?.value || '', 10);
    const input = document.getElementById('nuevaAreaGeneradoraNombre');
    const nombre = input?.value.trim() || '';
    const boton = document.getElementById('btnGuardarAreaGeneradoraPenal');

    if (!delegacionId || !nombre) {
        await window.appAlert?.({
            title: 'Datos incompletos',
            message: 'Selecciona una OOAD y captura el nombre del área generadora.'
        });
        return;
    }

    const textoOriginal = boton?.textContent || 'Guardar';

    try {
        if (boton) {
            boton.disabled = true;
            boton.textContent = 'Guardando...';
        }

        const area = await guardarAreaGeneradoraPenalApi(delegacionId, nombre);
        if (area) {
            catalogos.areas.push(area);
            catalogos.areas.sort((a, b) => String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es', { sensitivity: 'base' }));
            cargarAreasGeneradoras(area.id);
        }

        cerrarModalAreaGeneradoraPenal();
    } catch (error) {
        await window.appAlert?.({
            title: 'No se pudo guardar',
            message: error.message || 'No se pudo guardar el área generadora penal.'
        });
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

function registrarEventosAreaGeneradoraPenal() {
    const selectArea = document.getElementById('areaGeneradora');

    selectArea?.addEventListener('change', () => {
        if (selectArea.value === AREA_GENERADORA_ADD_VALUE) {
            selectArea.value = '';
            abrirModalAreaGeneradoraPenal();
        }
    });

    document.getElementById('btnGuardarAreaGeneradoraPenal')?.addEventListener('click', guardarNuevaAreaGeneradoraPenal);
    document.getElementById('btnCancelarAreaGeneradoraPenal')?.addEventListener('click', cerrarModalAreaGeneradoraPenal);
    document.getElementById('btnCerrarAreaGeneradoraPenal')?.addEventListener('click', cerrarModalAreaGeneradoraPenal);
    document.getElementById('modalAreaGeneradoraPenal')?.addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            cerrarModalAreaGeneradoraPenal();
        }
    });
    document.getElementById('nuevaAreaGeneradoraNombre')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            guardarNuevaAreaGeneradoraPenal();
        }
    });
}

function obtenerCategoriaDelitoSeleccionada() {
    const value = document.getElementById('categoriaDelito')?.value || '';
    if (!value || value === SIN_CATEGORIA_DELITO_VALUE) {
        return null;
    }

    return (catalogos.categoriasDelito || []).find(categoria => String(categoria.id) === String(value)) || null;
}

function abrirModalDelitoPenal() {
    const categoria = obtenerCategoriaDelitoSeleccionada();

    if (!categoria?.id) {
        window.appAlert?.({
            title: 'Categoría requerida',
            message: 'Selecciona una categoría válida antes de agregar un delito.'
        });
        return;
    }

    const inputNombre = document.getElementById('nuevoDelitoNombre');
    const inputCategoria = document.getElementById('nuevoDelitoCategoriaNombre');

    if (inputNombre) {
        inputNombre.value = '';
    }

    if (inputCategoria) {
        inputCategoria.value = categoria.nombre || '';
    }

    const modal = document.getElementById('modalDelitoPenal');
    if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => inputNombre?.focus(), 50);
    }
}

function cerrarModalDelitoPenal() {
    const modal = document.getElementById('modalDelitoPenal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function guardarNuevoDelitoPenal() {
    const categoria = obtenerCategoriaDelitoSeleccionada();
    const input = document.getElementById('nuevoDelitoNombre');
    const nombre = input?.value.trim() || '';
    const boton = document.getElementById('btnGuardarDelitoPenal');

    if (!categoria?.id || !nombre) {
        await window.appAlert?.({
            title: 'Datos incompletos',
            message: 'Selecciona una categoría y captura el nombre del delito.'
        });
        return;
    }

    const textoOriginal = boton?.textContent || 'Guardar';

    try {
        if (boton) {
            boton.disabled = true;
            boton.textContent = 'Guardando...';
        }

        const delito = await guardarDelitoPenalApi(categoria.id, nombre);
        if (delito) {
            catalogos.delitos.push(delito);
            const categoriaActual = (catalogos.categoriasDelito || []).find(item => String(item.id) === String(categoria.id));
            if (categoriaActual) {
                categoriaActual.delitos = Array.isArray(categoriaActual.delitos) ? categoriaActual.delitos : [];
                categoriaActual.delitos.push(delito);
                categoriaActual.delitos.sort((a, b) => String(a.nombre || '').localeCompare(String(b.nombre || ''), 'es', { sensitivity: 'base' }));
            }
            cargarDelitos(delito.id);
        }

        cerrarModalDelitoPenal();
    } catch (error) {
        await window.appAlert?.({
            title: 'No se pudo guardar',
            message: error.message || 'No se pudo guardar el delito.'
        });
    } finally {
        if (boton) {
            boton.disabled = false;
            boton.textContent = textoOriginal;
        }
    }
}

function registrarEventosDelitoPenal() {
    const categoriaSelect = document.getElementById('categoriaDelito');
    const delitoSelect = document.getElementById('delito');

    categoriaSelect?.addEventListener('change', () => cargarDelitos());

    delitoSelect?.addEventListener('change', () => {
        if (delitoSelect.value === DELITO_ADD_VALUE) {
            delitoSelect.value = '';
            abrirModalDelitoPenal();
        }
    });

    document.getElementById('btnGuardarDelitoPenal')?.addEventListener('click', guardarNuevoDelitoPenal);
    document.getElementById('btnCancelarDelitoPenal')?.addEventListener('click', cerrarModalDelitoPenal);
    document.getElementById('btnCerrarDelitoPenal')?.addEventListener('click', cerrarModalDelitoPenal);
    document.getElementById('modalDelitoPenal')?.addEventListener('click', (event) => {
        if (event.target === event.currentTarget) {
            cerrarModalDelitoPenal();
        }
    });
    document.getElementById('nuevoDelitoNombre')?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            guardarNuevoDelitoPenal();
        }
    });
}

async function guardarCasoPenalApi(formData) {
    const response = await fetch('api/savePenalCase.php', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar el asunto penal') + detail);
    }

    return result.data?.case || null;
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;
    window.mostrarCargaVista?.('.container');

    if (usuario.rol === 'consulta' || usuario.rol === 'jefe') {
        window.location.href = 'penal.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', jefe: 'Jefe', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    actualizarInfoOOADFormularioPenal();

    try {
        try {
            await cargarCatalogosPenalFormulario();
        } catch (error) {
            console.warn('No se pudieron cargar los catálogos penales desde la API:', error);
        }

        actualizarInfoOOADFormularioPenal();

        cargarDelegaciones();
        cargarAreasGeneradoras();
        cargarCategoriasDelito();
        cargarDelitos();
        initDenuncianteMode();
        initProbableResponsableMode();
        initCuantiaMode();
        initExpedienteCompuesto();
        sincronizarFechasBasePenal();
        document.getElementById('fechaInicio')?.addEventListener('change', sincronizarFechasBasePenal);
        document.getElementById('delegacion')?.addEventListener('change', cargarAreasGeneradoras);
        registrarEventosAreaGeneradoraPenal();
        registrarEventosDelitoPenal();
        limitadorHechosVictimaPenal = window.setupExpandableTextLimiter?.({
            fieldId: 'hechosVictimaDenunciante',
            initialLimit: 1000
        }) || null;
        limitadorDatoRelevantePenal = window.setupExpandableTextLimiter?.({
            fieldId: 'datoRelevante',
            initialLimit: 500
        }) || null;

        document.getElementById('formNuevoCaso').addEventListener('submit', function (event) {
            event.preventDefault();
            guardarCaso();
        });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

function cargarDelegaciones() {
    const select = document.getElementById('delegacion');
    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    (catalogos.delegaciones || []).forEach(delegacion => {
        const option = document.createElement('option');
        option.value = delegacion.id;
        option.textContent = delegacion.nombre;
        select.appendChild(option);
    });

    if (usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        select.value = usuarioActual.delegacion_id;
        select.disabled = true;
    }
}

function obtenerEscenarioDenunciantePayload() {
    const modo = obtenerModoDenuncianteActual();

    if (modo === 'IMSS_OTRO') {
        return {
            escenario: 'COADYUVANCIA',
            coadyuvancia: true
        };
    }

    if (modo === 'OTRO') {
        return {
            escenario: 'DISTINTO_IMSS',
            coadyuvancia: false
        };
    }

    return {
        escenario: 'IMSS',
        coadyuvancia: false
    };
}

function obtenerMontoPenalNormalizado() {
    const inputMonto = document.getElementById('cuantiaMonto');
    if (!inputMonto) {
        return '';
    }

    return inputMonto.value.replace(/,/g, '').trim();
}

function cargarAreasGeneradoras(areaSeleccionada = '') {
    const selectDelegacion = document.getElementById('delegacion');
    const selectArea = document.getElementById('areaGeneradora');

    if (!selectDelegacion || !selectArea) {
        return;
    }

    const delegacionId = parseInt(selectDelegacion.value, 10);
    selectArea.innerHTML = '<option value="">Seleccione...</option>';

    if (!delegacionId) {
        selectArea.disabled = true;
        return;
    }

    const areasFiltradas = (catalogos.areas || []).filter(area => parseInt(area.delegacion_id, 10) === delegacionId);

    areasFiltradas.forEach(area => {
        const option = document.createElement('option');
        option.value = area.id;
        option.textContent = area.nombre;
        selectArea.appendChild(option);
    });

    if (usuarioPuedeAgregarAreaGeneradoraPenal()) {
        const option = document.createElement('option');
        option.value = AREA_GENERADORA_ADD_VALUE;
        option.textContent = '+ Agregar nueva área...';
        selectArea.appendChild(option);
    }

    if (areaSeleccionada) {
        selectArea.value = String(areaSeleccionada);
    }

    selectArea.disabled = false;
}

function cargarCategoriasDelito(categoriaSeleccionada = '') {
    const select = document.getElementById('categoriaDelito');
    if (!select) {
        return;
    }

    select.innerHTML = '<option value="">Seleccione...</option>';

    (catalogos.categoriasDelito || []).forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id === null ? SIN_CATEGORIA_DELITO_VALUE : String(categoria.id);
        option.textContent = categoria.nombre || '';
        select.appendChild(option);
    });

    if (categoriaSeleccionada) {
        select.value = String(categoriaSeleccionada);
    }
}

function cargarDelitos(delitoSeleccionado = '') {
    const categoriaSelect = document.getElementById('categoriaDelito');
    const select = document.getElementById('delito');
    if (!categoriaSelect || !select) {
        return;
    }

    const categoriaValue = categoriaSelect.value;
    select.innerHTML = '<option value="">Seleccione...</option>';

    if (!categoriaValue) {
        select.disabled = true;
        return;
    }

    const categoria = (catalogos.categoriasDelito || []).find(item => {
        const itemValue = item.id === null ? SIN_CATEGORIA_DELITO_VALUE : String(item.id);
        return itemValue === categoriaValue;
    });

    (categoria?.delitos || []).forEach(delito => {
        const option = document.createElement('option');
        option.value = delito.id;
        option.textContent = delito.nombre;
        select.appendChild(option);
    });

    if (usuarioPuedeAgregarDelitoPenal() && categoria?.id !== null) {
        const option = document.createElement('option');
        option.value = DELITO_ADD_VALUE;
        option.textContent = '+ Agregar nuevo delito...';
        select.appendChild(option);
    }

    if (delitoSeleccionado) {
        select.value = String(delitoSeleccionado);
    }

    select.disabled = false;
}

function crearCampoDenunciante({ tipo, id, valor = '' }) {
    const esRelacionado = tipo === 'relacionado';
    const containerId = esRelacionado ? 'listaDenuncianteRelacionados' : 'listaDenunciantesPrincipales';
    const titulo = esRelacionado ? 'Persona relacionada' : 'Denunciante principal';
    const placeholder = esRelacionado
        ? 'Nombre de la persona, empresa o institucion relacionada con la denuncia'
        : 'Nombre de la persona, empresa o institucion denunciante';
    const label = esRelacionado ? 'Nombre de persona relacionada' : 'Nombre del denunciante principal';
    const fieldId = id || `${tipo}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const html = `
        <div class="dynamic-field" id="${fieldId}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">${titulo}</span>
                <button type="button" class="btn-remove" onclick="eliminarCampoDenunciante('${fieldId}', '${tipo}')">Eliminar</button>
            </div>
            <div class="form-group">
                <label class="form-label${esRelacionado ? '' : ' required'}">${label}</label>
                <input
                    type="text"
                    class="form-input ${esRelacionado ? 'denunciante-relacionado-input' : 'denunciante-principal-input'}"
                    placeholder="${placeholder}"
                    value="${valor.replace(/"/g, '&quot;')}"
                >
            </div>
        </div>
    `;

    document.getElementById(containerId)?.insertAdjacentHTML('beforeend', html);
    renumerarCamposDenunciante(tipo);
    actualizarEstadoBotonesDenunciante(tipo);
}

function limpiarCamposDenunciante(tipo) {
    const containerId = tipo === 'relacionado' ? 'listaDenuncianteRelacionados' : 'listaDenunciantesPrincipales';
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }

    if (tipo === 'relacionado') {
        contadorDenuncianteRelacionado = 0;
    } else {
        contadorDenunciantePrincipal = 0;
    }

    renumerarCamposDenunciante(tipo);
    actualizarEstadoBotonesDenunciante(tipo);
}

function obtenerModoDenuncianteActual() {
    return document.querySelector('input[name="denuncianteModo"]:checked')?.value || 'IMSS';
}

function syncDenuncianteMode() {
    const modo = obtenerModoDenuncianteActual();
    const wrapRelacionados = document.getElementById('denuncianteRelacionadosWrap');
    const wrapPrincipales = document.getElementById('denunciantePrincipalesWrap');

    if (wrapRelacionados) {
        wrapRelacionados.style.display = modo === 'IMSS' ? '' : 'none';
    }

    if (wrapPrincipales) {
        wrapPrincipales.style.display = modo === 'IMSS' ? 'none' : '';
    }

    if (modo !== 'IMSS') {
        if (!document.querySelector('#listaDenunciantesPrincipales .denunciante-principal-input')) {
            crearCampoDenunciante({ tipo: 'principal' });
        }
    }
}

function initDenuncianteMode() {
    document.getElementById('btnAgregarDenuncianteRelacionado')?.addEventListener('click', function () {
        crearCampoDenunciante({ tipo: 'relacionado' });
    });

    document.getElementById('btnAgregarDenunciantePrincipal')?.addEventListener('click', function () {
        crearCampoDenunciante({ tipo: 'principal' });
    });

    document.querySelectorAll('input[name="denuncianteModo"]').forEach(radio => {
        radio.addEventListener('change', syncDenuncianteMode);
    });

    syncDenuncianteMode();
}

function eliminarCampoDenunciante(id, tipo) {
    const containerId = tipo === 'relacionado' ? 'listaDenuncianteRelacionados' : 'listaDenunciantesPrincipales';
    const container = document.getElementById(containerId);
    const items = container ? Array.from(container.querySelectorAll('.dynamic-field')) : [];
    const itemIndex = items.findIndex(item => item.id === id);

    if (tipo === 'principal' && itemIndex === 0) {
        const primerInput = items[0]?.querySelector('.denunciante-principal-input');
        if (primerInput) {
            primerInput.value = '';
            primerInput.focus();
        }
        renumerarCamposDenunciante(tipo);
        actualizarEstadoBotonesDenunciante(tipo);
        return;
    }

    if (tipo === 'principal' && items.length <= 1) {
        const input = document.querySelector('#listaDenunciantesPrincipales .denunciante-principal-input');
        if (input) {
            input.value = '';
            input.focus();
        }
        renumerarCamposDenunciante(tipo);
        actualizarEstadoBotonesDenunciante(tipo);
        return;
    }

    document.getElementById(id)?.remove();

    if (tipo === 'principal' && container && !container.querySelector('.denunciante-principal-input')) {
        crearCampoDenunciante({ tipo: 'principal' });
        return;
    }

    renumerarCamposDenunciante(tipo);
    actualizarEstadoBotonesDenunciante(tipo);
}

window.eliminarCampoDenunciante = eliminarCampoDenunciante;

function renumerarCamposDenunciante(tipo) {
    const containerId = tipo === 'relacionado' ? 'listaDenuncianteRelacionados' : 'listaDenunciantesPrincipales';
    const selector = type => type === 'relacionado' ? '.denunciante-relacionado-input' : '.denunciante-principal-input';
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    const items = Array.from(container.querySelectorAll('.dynamic-field'));
    const tituloBase = tipo === 'relacionado' ? 'Persona relacionada' : 'Denunciante principal';

    items.forEach((item, index) => {
        const title = item.querySelector('.dynamic-field-title');
        if (title) {
            title.textContent = `${tituloBase} ${index + 1}`;
        }
    });

    if (tipo === 'relacionado') {
        contadorDenuncianteRelacionado = items.length;
    } else {
        contadorDenunciantePrincipal = items.length;
    }
}

function actualizarEstadoBotonesDenunciante(tipo) {
    const containerId = tipo === 'relacionado' ? 'listaDenuncianteRelacionados' : 'listaDenunciantesPrincipales';
    const container = document.getElementById(containerId);
    if (!container) {
        return;
    }

    const items = Array.from(container.querySelectorAll('.dynamic-field'));
    const botones = items.map(item => item.querySelector('.btn-remove')).filter(Boolean);
    botones.forEach((boton, index) => {
        if (tipo === 'principal' && index === 0) {
            boton.textContent = 'Limpiar';
            boton.disabled = false;
            boton.style.opacity = '';
            boton.style.cursor = '';
            return;
        }

        boton.textContent = 'Eliminar';
        boton.disabled = false;
        boton.style.opacity = '';
        boton.style.cursor = '';
    });
}

function initResponsableQrrMode() {
    const checkbox = document.getElementById('responsableQrr');
    const wrap = document.getElementById('probablesResponsablesWrap');

    if (!checkbox || !wrap) {
        return;
    }

    const sync = () => {
        if (checkbox.checked) {
            wrap.style.display = 'none';
        } else {
            wrap.style.display = '';
            if (!document.querySelector('#listaProbablesResponsables .probable-responsable-input')) {
                crearCampoProbableResponsable();
            }
        }
    };

    checkbox.addEventListener('change', sync);
    sync();
}

function crearCampoProbableResponsable(valor = '') {
    const container = document.getElementById('listaProbablesResponsables');
    if (!container) {
        return;
    }

    contadorProbableResponsable += 1;
    const fieldId = `probable_responsable_${Date.now()}_${contadorProbableResponsable}`;

    const html = `
        <div class="dynamic-field" id="${fieldId}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">Probable responsable</span>
                <button type="button" class="btn-remove" onclick="eliminarCampoProbableResponsable('${fieldId}')">Eliminar</button>
            </div>
            <div class="form-group">
                <label class="form-label required">Nombre del probable responsable</label>
                <input
                    type="text"
                    class="form-input probable-responsable-input"
                    placeholder="Nombre de persona, empresa o institucion"
                    value="${valor.replace(/"/g, '&quot;')}"
                >
            </div>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', html);
    renumerarCamposProbableResponsable();
    actualizarEstadoBotonesProbableResponsable();
}

function eliminarCampoProbableResponsable(id) {
    const container = document.getElementById('listaProbablesResponsables');
    const items = container ? Array.from(container.querySelectorAll('.dynamic-field')) : [];
    const itemIndex = items.findIndex(item => item.id === id);

    if (items.length <= 1 || itemIndex === 0) {
        const primerInput = items[0]?.querySelector('.probable-responsable-input');
        if (primerInput) {
            primerInput.value = '';
            primerInput.focus();
        }
        renumerarCamposProbableResponsable();
        actualizarEstadoBotonesProbableResponsable();
        return;
    }

    document.getElementById(id)?.remove();

    if (container && !container.querySelector('.probable-responsable-input')) {
        crearCampoProbableResponsable();
        return;
    }

    renumerarCamposProbableResponsable();
    actualizarEstadoBotonesProbableResponsable();
}

window.eliminarCampoProbableResponsable = eliminarCampoProbableResponsable;

function renumerarCamposProbableResponsable() {
    const container = document.getElementById('listaProbablesResponsables');
    if (!container) {
        return;
    }

    const items = Array.from(container.querySelectorAll('.dynamic-field'));
    items.forEach((item, index) => {
        const title = item.querySelector('.dynamic-field-title');
        if (title) {
            title.textContent = `Probable responsable ${index + 1}`;
        }
    });

    contadorProbableResponsable = items.length;
}

function actualizarEstadoBotonesProbableResponsable() {
    const container = document.getElementById('listaProbablesResponsables');
    if (!container) {
        return;
    }

    const items = Array.from(container.querySelectorAll('.dynamic-field'));
    const botones = items.map(item => item.querySelector('.btn-remove')).filter(Boolean);

    botones.forEach((boton, index) => {
        if (index === 0) {
            boton.textContent = 'Limpiar';
        } else {
            boton.textContent = 'Eliminar';
        }
        boton.disabled = false;
        boton.style.opacity = '';
        boton.style.cursor = '';
    });
}

function initProbableResponsableMode() {
    document.getElementById('btnAgregarProbableResponsable')?.addEventListener('click', function () {
        crearCampoProbableResponsable();
    });

    if (!document.querySelector('#listaProbablesResponsables .probable-responsable-input')) {
        crearCampoProbableResponsable();
    }

    initResponsableQrrMode();
}

function initCuantiaMode() {
    const checkbox = document.getElementById('sinCuantificar');
    const inputMonto = document.getElementById('cuantiaMonto');

    if (!checkbox || !inputMonto) {
        return;
    }

    const sync = () => {
        if (checkbox.checked) {
            inputMonto.value = '';
            inputMonto.disabled = true;
            inputMonto.placeholder = 'Sin cuantificar';
        } else {
            inputMonto.disabled = false;
            inputMonto.placeholder = '0.00';
        }
    };

    inputMonto.addEventListener('input', function () {
        let valor = this.value.replace(/[^0-9.]/g, '');

        const partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes.slice(1).join('');
        }

        const partesFinales = valor.split('.');
        if (partesFinales[0]) {
            partesFinales[0] = partesFinales[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        this.value = partesFinales.join('.');
    });

    checkbox.addEventListener('change', sync);
    sync();
}

function initExpedienteCompuesto() {
    const campos = ['expJurisdiccion', 'expNumeroCarpeta'];

    campos.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', actualizarPreviewExpediente);
            element.addEventListener('change', actualizarPreviewExpediente);
        }
    });
}

function sanitizePenalExpedienteParts() {
    const numeroCarpetaInput = document.getElementById('expNumeroCarpeta');
    if (!numeroCarpetaInput) {
        return { numeroCarpeta: '' };
    }

    const numeroCarpeta = numeroCarpetaInput.value
        .toUpperCase()
        .replace(/[^A-Z0-9\/-]/g, '')
        .slice(0, 80);

    numeroCarpetaInput.value = numeroCarpeta;

    return { numeroCarpeta };
}

function validatePenalExpedienteParts() {
    const { numeroCarpeta } = sanitizePenalExpedienteParts();

    if (!/^[A-Z0-9\/-]{3,80}$/.test(numeroCarpeta)) {
        throw new Error('El numero de carpeta solo puede incluir letras, numeros, diagonales (/) y guiones medios (-), entre 3 y 80 caracteres.');
    }

    return { numeroCarpeta };
}

function actualizarPreviewExpediente() {
    const jurisdiccion = document.getElementById('expJurisdiccion').value;
    const { numeroCarpeta } = sanitizePenalExpedienteParts();

    const partes = [jurisdiccion, numeroCarpeta].filter(Boolean);
    const preview = document.getElementById('previewExpediente');

    if (preview) {
        preview.textContent = partes.length > 0 ? `Vista previa: ${partes.join('/')}` : 'Vista previa: ---';
    }
}

function obtenerNumeroExpediente() {
    const jurisdiccion = document.getElementById('expJurisdiccion').value;
    const { numeroCarpeta } = validatePenalExpedienteParts();

    if (!jurisdiccion || !numeroCarpeta) {
        return null;
    }

    return `${jurisdiccion}/${numeroCarpeta}`;
}

function construirDenunciantePayload() {
    const modo = obtenerModoDenuncianteActual();
    const relacionados = Array.from(document.querySelectorAll('.denunciante-relacionado-input'))
        .map(input => input.value.trim())
        .filter(Boolean);
    const principales = Array.from(document.querySelectorAll('.denunciante-principal-input'))
        .map(input => input.value.trim())
        .filter(Boolean);

    if (modo !== 'IMSS' && principales.length === 0) {
        throw new Error('Captura al menos un denunciante principal.');
    }

    if (modo === 'IMSS') {
        return [
            {
                nombre: 'Instituto Mexicano del Seguro Social',
                tipo: 'DENUNCIANTE',
                rol: 'PRINCIPAL',
                es_imss: true,
                es_coadyuvante: false
            },
            ...relacionados.map(nombre => ({
                nombre,
                tipo: 'RELACIONADO',
                rol: 'RELACIONADO',
                es_imss: false,
                es_coadyuvante: false
            }))
        ];
    }

    if (modo === 'IMSS_OTRO') {
        return [
            ...principales.map(nombre => ({
                nombre,
                tipo: 'DENUNCIANTE',
                rol: 'PRINCIPAL',
                es_imss: false,
                es_coadyuvante: false
            })),
            {
                nombre: 'Instituto Mexicano del Seguro Social',
                tipo: 'DENUNCIANTE',
                rol: 'COADYUVANTE',
                es_imss: true,
                es_coadyuvante: true
            }
        ];
    }

    return principales.map(nombre => ({
        nombre,
        tipo: 'DENUNCIANTE',
        rol: 'PRINCIPAL',
        es_imss: false,
        es_coadyuvante: false
    }));
}

function construirProbableResponsablePayload() {
    const esQrr = Boolean(document.getElementById('responsableQrr')?.checked);
    const responsables = Array.from(document.querySelectorAll('.probable-responsable-input'))
        .map(input => input.value.trim())
        .filter(Boolean);

    if (esQrr) {
        return [
            {
                nombre: 'QRR',
                tipo: 'PROBABLE_RESPONSABLE',
                rol: 'SIN_IDENTIFICAR',
                qrr: true
            }
        ];
    }

    if (responsables.length === 0) {
        throw new Error('Captura al menos un probable responsable o marca la opción de sin identificar.');
    }

    return responsables.map(nombre => ({
        nombre,
        tipo: 'PROBABLE_RESPONSABLE',
        rol: 'PRINCIPAL',
        qrr: false
    }));
}

function validarArchivoInicialPenal() {
    const input = document.getElementById('archivoInicialPenal');
    if (!input) {
        return null;
    }

    const file = input.files?.[0] || null;
    if (!file) {
        throw new Error('Adjunta el documento inicial en formato PDF.');
    }

    const maxBytes = 10 * 1024 * 1024;
    const nombre = (file.name || '').toLowerCase();
    const mime = (file.type || '').toLowerCase();
    const esPdfPorNombre = nombre.endsWith('.pdf');
    const esPdfPorMime = !mime || mime === 'application/pdf';

    if (!esPdfPorNombre || !esPdfPorMime) {
        throw new Error('El documento inicial debe ser un archivo PDF válido.');
    }

    if (file.size > maxBytes) {
        throw new Error('El documento inicial no puede exceder 10 MB.');
    }

    return file;
}

function sincronizarFechasBasePenal() {
    const fechaInicio = document.getElementById('fechaInicio');
    const fechasDependientes = [
        document.getElementById('fechaConocimientoAmp')
    ].filter(Boolean);

    if (!fechaInicio) {
        return;
    }

    const fechaBase = fechaInicio.value || '';

    fechasDependientes.forEach(input => {
        input.min = fechaBase;

        if (fechaBase && input.value && input.value < fechaBase) {
            input.value = '';
        }
    });
}

async function guardarCaso() {
    const delegacionId = parseInt(document.getElementById('delegacion').value);
    const fechaInicio = document.getElementById('fechaInicio').value;
    const delitoId = parseInt(document.getElementById('delito').value);
    const areaGeneradoraId = parseInt(document.getElementById('areaGeneradora').value, 10);
    const hechosVictimaDenunciante = document.getElementById('hechosVictimaDenunciante')?.value.trim() || '';
    const datoRelevante = document.getElementById('datoRelevante')?.value.trim() || '';
    const sinCuantificar = Boolean(document.getElementById('sinCuantificar')?.checked);
    const cuantiaMonto = obtenerMontoPenalNormalizado();
    let numeroExpediente = null;

    try {
        numeroExpediente = obtenerNumeroExpediente();
    } catch (error) {
        await window.appAlert({
            title: 'Número de expediente inválido',
            message: error.message
        });
        return;
    }

    if (!delegacionId || !numeroExpediente || !fechaInicio || !delitoId || !areaGeneradoraId) {
        await window.appAlert({
            title: 'Campos obligatorios',
            message: 'Por favor completa todos los campos requeridos.'
        });
        return;
    }

    if (!hechosVictimaDenunciante) {
        await window.appAlert({
            title: 'Campos obligatorios',
            message: 'Captura los hechos con datos de la víctima o denunciante.'
        });
        return;
    }

    if (!sinCuantificar && cuantiaMonto === '') {
        await window.appAlert({
            title: 'Cuantía obligatoria',
            message: 'Captura el monto o marca la opción sin cuantificar.'
        });
        return;
    }

    let denunciante = null;
    let probableResponsable = null;
    let archivoInicial = null;

    try {
        denunciante = construirDenunciantePayload();
        probableResponsable = construirProbableResponsablePayload();
        archivoInicial = validarArchivoInicialPenal();
    } catch (error) {
        await window.appAlert({
            title: 'Datos incompletos',
            message: error.message
        });
        return;
    }

    const escenarioDenunciante = obtenerEscenarioDenunciantePayload();
    const anioInicio = fechaInicio ? parseInt(fechaInicio.slice(0, 4), 10) : NaN;
    const formData = new FormData();
    formData.append('delegacion_id', String(delegacionId));
    formData.append('numero_carpeta', numeroExpediente);
    formData.append('anio_inicio', Number.isNaN(anioInicio) ? '' : String(anioInicio));
    formData.append('fecha_presentacion_denuncia', fechaInicio);
    formData.append('delito_id', String(delitoId));
    formData.append('area_hechos_id', String(areaGeneradoraId));
    formData.append('hechos_denunciante', hechosVictimaDenunciante);
    formData.append('dato_relevante', datoRelevante);
    formData.append('sin_cuantificar', sinCuantificar ? '1' : '0');
    formData.append('cuantia_monto', sinCuantificar ? '' : cuantiaMonto);
    formData.append('escenario_denunciante', escenarioDenunciante.escenario);
    formData.append('coadyuvancia', escenarioDenunciante.coadyuvancia ? '1' : '0');
    formData.append('denunciantes', JSON.stringify(denunciante));
    formData.append('probables_responsables', JSON.stringify(probableResponsable));
    formData.append('documento_inicial_observaciones', document.getElementById('observacionesArchivoInicialPenal')?.value.trim() || '');
    formData.append('archivo_inicial', archivoInicial);

    try {
        const casoGuardado = await guardarCasoPenalApi(formData);
        await window.appAlert({
            title: 'Cambios guardados',
            message: 'El registro se guardó correctamente.'
        });

        const casoId = casoGuardado?.id;
        if (!casoId) {
            window.location.href = 'penal.html';
            return;
        }

        const registrarRequerimientos = await window.appConfirm({
            title: 'Requerimientos ministeriales',
            message: '¿Deseas registrar requerimientos ministeriales para este caso?',
            confirmText: 'Sí',
            cancelText: 'No'
        });

        window.location.href = registrarRequerimientos
            ? `listadoRequerimientosPenal.html?id=${encodeURIComponent(casoId)}`
            : 'penal.html';
    } catch (error) {
        console.error('Error al guardar asunto penal:', error);
        await window.appAlert({
            title: 'No se pudo guardar el asunto',
            message: error.message || 'Ocurrió un problema al guardar el asunto.'
        });
    }
}

