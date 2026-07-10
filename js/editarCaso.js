// =====================================================
// EDITAR-CASO.JS - Edicion de casos con API local
// =====================================================

let casoActual = null;
let contadorActores = 0;
let contadorDemandados = 0;
let contadorCodemandados = 0;
let usuarioActualEdit = null;
let catalogos = {
    delegaciones: [],
    areas: {},
    organosJurisdiccionales: [],
    prestaciones: [],
    abogadosResponsables: [],
    tiposJuicio: {}
};
let limitadorPrestacionesNotasEdit = null;

function obtenerHoyIsoCivilEdicion() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function obtenerDelegacionCivilEdicion(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
}

function obtenerAbogadosDisponiblesEdicion(usuario, delegacionId) {
    const abogados = Array.isArray(catalogos.abogadosResponsables) ? catalogos.abogadosResponsables : [];

    if (usuario?.rol === 'admin') {
        return abogados;
    }

    const delegacionUsuario = usuario?.delegacion_id ? parseInt(usuario.delegacion_id, 10) : null;
    return abogados.filter(abogado => parseInt(abogado.delegacion_id, 10) === delegacionUsuario);
}

function llenarAbogadosResponsablesEdicion(usuario, delegacionId, abogadoSeleccionadoId = null) {
    const select = document.getElementById('abogadoResponsable');
    if (!select) return;

    const abogadosDisponibles = obtenerAbogadosDisponiblesEdicion(usuario, delegacionId);
    select.innerHTML = '<option value="">Seleccione...</option>';

    abogadosDisponibles.forEach(abogado => {
        const option = document.createElement('option');
        option.value = abogado.id;
        option.textContent = abogado.nombre_completo;
        select.appendChild(option);
    });

    const esAbogadoEditor = usuario?.rol === 'editor' && Boolean(usuario?.es_abogado);
    if (esAbogadoEditor) {
        select.value = usuario.id || '';
        select.disabled = true;
        return;
    }

    select.disabled = false;

    if (abogadoSeleccionadoId) {
        select.value = String(abogadoSeleccionadoId);
    } else {
        autoseleccionarSiEsUnica(select);
    }
}

function actualizarHeaderCivilEdicion(usuario) {
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
            const delegacion = obtenerDelegacionCivilEdicion(usuario.delegacion_id);
            infoOOAD.textContent = delegacion?.nombre || 'Todas las JSJ';
        } else {
            infoOOAD.textContent = 'Todas las JSJ';
        }
    }
}

function esCasoAcumuladoEdicion() {
    return Boolean(casoActual?.acumulado_a);
}

function obtenerNumeroPadreAcumulacionEdicion() {
    if (!casoActual?.acumulado_a) {
        return null;
    }

    const casosGuardados = localStorage.getItem('casos');
    const casos = casosGuardados ? JSON.parse(casosGuardados) : [];
    const casoPadre = casos.find(caso => caso.id === casoActual.acumulado_a);

    return casoPadre?.numero_expediente || `ID ${casoActual.acumulado_a}`;
}

function normalizarTextoComparacion(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
}

function seleccionarOpcionPorTexto(select, textoObjetivo) {
    if (!select || !textoObjetivo) {
        return false;
    }

    const textoNormalizado = normalizarTextoComparacion(textoObjetivo);

    for (let index = 0; index < select.options.length; index += 1) {
        const option = select.options[index];
        if (normalizarTextoComparacion(option.textContent) === textoNormalizado) {
            select.value = option.value;
            return true;
        }
    }

    return false;
}

function agruparPorClave(items, key) {
    return (items || []).reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
}

function normalizarTextoOrdenNatural(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase()
        .trim();
}

function construirClaveOrdenNaturalOrgano(nombre) {
    const ordinales = {
        PRIMER: '0001',
        PRIMERO: '0001',
        SEGUNDO: '0002',
        TERCER: '0003',
        TERCERO: '0003',
        CUARTO: '0004',
        QUINTO: '0005',
        SEXTO: '0006',
        SEPTIMO: '0007',
        OCTAVO: '0008',
        NOVENO: '0009',
        DECIMO: '0010',
        UNDECIMO: '0011',
        DUODECIMO: '0012',
        DECIMOTERCERO: '0013',
        DECIMOCUARTO: '0014',
        DECIMOQUINTO: '0015',
        DECIMOSEXTO: '0016',
        DECIMOSEPTIMO: '0017',
        DECIMOOCTAVO: '0018',
        DECIMONOVENO: '0019',
        VIGESIMO: '0020',
        TRIGESIMO: '0030'
    };

    let texto = normalizarTextoOrdenNatural(nombre);

    Object.entries(ordinales).forEach(([palabra, numero]) => {
        const patron = new RegExp(`\\b${palabra}\\b`, 'g');
        texto = texto.replace(patron, numero);
    });

    return texto;
}

function compararOrganosJurisdiccionales(a, b) {
    const claveA = construirClaveOrdenNaturalOrgano(a?.nombre);
    const claveB = construirClaveOrdenNaturalOrgano(b?.nombre);
    return claveA.localeCompare(claveB, 'es', { sensitivity: 'base' });
}

async function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }

    const usuarioLocal = JSON.parse(usuarioStr);

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
                alcance_global: Boolean(user.alcanceGlobal),
                permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
                permiso_penal: Boolean(user.permisoPenal),
                es_abogado: Boolean(user.esAbogado),
                es_jefe: Boolean(user.esJefe),
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo refrescar la sesión de edición civil:', error);
    }

    return usuarioLocal;
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

async function cargarCatalogosCivilDesdeApi() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catalogos');
    }

    const data = result.data || {};
    const tiposJuicioAgrupados = agruparPorClave(data.tiposJuicio || [], 'materia');
    const subtiposPorTipo = agruparPorClave(data.subtiposJuicio || [], 'tipo_juicio_id');

    Object.keys(tiposJuicioAgrupados).forEach(materia => {
        tiposJuicioAgrupados[materia] = tiposJuicioAgrupados[materia].map(tipo => ({
            ...tipo,
            subtipos: subtiposPorTipo[tipo.id] || []
        }));
    });

    catalogos = {
        delegaciones: data.delegaciones || [],
        areas: agruparPorClave(data.areas || [], 'delegacion_id'),
        organosJurisdiccionales: data.organosJurisdiccionales || [],
        prestaciones: data.prestaciones || [],
        abogadosResponsables: data.abogadosResponsables || [],
        tiposJuicio: tiposJuicioAgrupados
    };

    window.catalogos = catalogos;
}

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

async function guardarCasoCivilApi(caso) {
    const response = await fetch('api/saveCivilCase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(caso)
    });
    const result = await response.json();
    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo guardar el asunto');
    }
    return result.data?.case ?? null;
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActualEdit = usuario;
    window.mostrarCargaVista?.('.container');

    if (usuario.rol !== 'admin') {
        window.location.href = 'casos.html';
        return;
    }

    actualizarHeaderCivilEdicion(usuario);

    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'), 10);

    if (!casoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto para editar.'
        });
        window.location.href = 'casos.html';
        return;
    }

    try {
        try {
            const [, cargaCasoOk] = await Promise.all([
                cargarCatalogosCivilDesdeApi(),
                cargarCaso(casoId)
            ]);
            actualizarHeaderCivilEdicion(usuario);
            if (!cargaCasoOk) {
                return;
            }
        } catch (error) {
            console.error('No se pudieron cargar los datos iniciales desde la API local:', error);
            await window.appAlert?.({
                title: 'No se pudieron cargar los datos del asunto',
                message: 'Intenta de nuevo en unos momentos.'
            });
            window.location.href = 'casos.html';
            return;
        }

        inicializarFormulario(usuario);
        configurarEventListeners(usuario);
        window.initSearchableSelect?.('tribunal', {
            placeholder: 'Seleccione...',
            searchPlaceholder: 'Buscar tribunal o juzgado...'
        });
        limitadorPrestacionesNotasEdit = window.setupExpandableTextLimiter?.({
            fieldId: 'prestacionesNotas'
        }) || null;
        llenarFormulario();
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function cargarCaso(casoId) {
    casoActual = await obtenerCasoCivilDetalle(casoId);
    if (!casoActual) {
        await window.appAlert?.({
            title: 'Asunto no encontrado',
            message: 'No se encontró el asunto solicitado.'
        });
        window.location.href = 'casos.html';
        return false;
    }

    if (esCasoAcumuladoEdicion()) {
        const numeroPadre = obtenerNumeroPadreAcumulacionEdicion();
        await window.appAlert?.({
            title: 'Asunto acumulado',
            message: `Este asunto esta acumulado a ${numeroPadre} y no puede editarse. Debe desacumularse primero.`
        });
        window.location.href = `detalleCaso.html?id=${casoActual.id}`;
        return false;
    }

    return true;
}

function inicializarFormulario(usuario) {
    llenarDelegaciones(usuario);
    llenarTribunales(usuario);
    llenarPrestaciones();
    llenarAbogadosResponsablesEdicion(usuario, document.getElementById('delegacion').value || usuario?.delegacion_id || null);
}

function llenarDelegaciones(usuario) {
    const select = document.getElementById('delegacion');
    select.innerHTML = '<option value="">Seleccione...</option>';

    catalogos.delegaciones.forEach(delegacion => {
        const option = document.createElement('option');
        option.value = delegacion.id;
        option.textContent = delegacion.nombre;
        select.appendChild(option);
    });

    if (usuario && usuario.rol !== 'admin' && usuario.delegacion_id) {
        select.value = usuario.delegacion_id;
        select.disabled = true;
    }
}

function llenarTribunales(usuario, delegacionId) {
    const select = document.getElementById('tribunal');
    select.innerHTML = '<option value="">Seleccione...</option>';

    let filtroDeleg = delegacionId || null;
    if (!filtroDeleg && usuario && usuario.rol !== 'admin' && usuario.delegacion_id) {
        filtroDeleg = usuario.delegacion_id;
    }

    const organosFiltrados = filtroDeleg
        ? catalogos.organosJurisdiccionales.filter(organo => organo.delegacion_id === parseInt(filtroDeleg, 10))
        : catalogos.organosJurisdiccionales;

    organosFiltrados
        .slice()
        .sort(compararOrganosJurisdiccionales)
        .forEach(organo => {
        const option = document.createElement('option');
        option.value = organo.id;
        option.textContent = organo.nombre;
        select.appendChild(option);
    });
}

function llenarPrestaciones() {
    const selectPrincipal = document.getElementById('prestacionPrincipal');
    selectPrincipal.innerHTML = '<option value="">Seleccione...</option>';

    catalogos.prestaciones.forEach(prestacion => {
        const option = document.createElement('option');
        option.value = prestacion.id;
        option.textContent = prestacion.nombre;
        selectPrincipal.appendChild(option);
    });

    const container = document.getElementById('prestacionesOpciones');
    container.innerHTML = '';

    catalogos.prestaciones.forEach(prestacion => {
        const div = document.createElement('div');
        div.className = 'multiselect-option';
        div.setAttribute('data-value', prestacion.id);
        div.innerHTML = `
            <input type="checkbox" id="prestacion_${prestacion.id}" value="${prestacion.id}">
            <label for="prestacion_${prestacion.id}">${prestacion.nombre}</label>
        `;

        div.addEventListener('click', function (event) {
            if (event.target.tagName === 'INPUT') return;
            const checkbox = div.querySelector('input[type="checkbox"]');
            checkbox.checked = !checkbox.checked;
            checkbox.dispatchEvent(new Event('change'));
        });

        div.querySelector('input').addEventListener('change', function () {
            div.classList.toggle('selected', this.checked);
            actualizarPrestacionesTags();
        });

        container.appendChild(div);
    });
}

function cargarAreas(delegacionId, callback) {
    const selectArea = document.getElementById('area');
    selectArea.innerHTML = '<option value="">Seleccione...</option>';

    if (delegacionId && catalogos.areas[delegacionId]) {
        selectArea.disabled = false;
        catalogos.areas[delegacionId].forEach(area => {
            const option = document.createElement('option');
            option.value = area.id;
            option.textContent = area.nombre;
            selectArea.appendChild(option);
        });

        if (callback) {
            setTimeout(callback, 50);
        }
    } else {
        selectArea.disabled = true;
    }
}

function subtipoVisibleParaJurisdiccion(subtipo, jurisdiccion) {
    if (!jurisdiccion) return true;
    if (subtipo.jurisdiccion) {
        return subtipo.jurisdiccion === 'AMBAS' || subtipo.jurisdiccion === jurisdiccion;
    }
    if (subtipo.subtipos && subtipo.subtipos.length > 0) {
        return subtipo.subtipos.some(item => item.jurisdiccion === 'AMBAS' || item.jurisdiccion === jurisdiccion);
    }
    return true;
}

function obtenerOpcionesReales(select) {
    return Array.from(select.options || []).filter(option => option.value !== '');
}

function autoseleccionarSiEsUnica(select) {
    const opcionesReales = obtenerOpcionesReales(select);
    if (opcionesReales.length === 1) {
        select.value = opcionesReales[0].value;
        return true;
    }
    return false;
}

function cargarSubtipos(tipoJuicio, jurisdiccion) {
    const selectSubtipo = document.getElementById('subtipoJuicio');
    const grupoSubsub = document.getElementById('grupSubsubtipo');
    const selectSubsub = document.getElementById('subsubtipoJuicio');
    selectSubtipo.innerHTML = '<option value="">Seleccione...</option>';
    selectSubsub.innerHTML = '<option value="">Seleccione...</option>';
    selectSubsub.required = false;
    grupoSubsub.style.display = 'none';

    if (tipoJuicio && catalogos.tiposJuicio[tipoJuicio]) {
        selectSubtipo.disabled = false;
        catalogos.tiposJuicio[tipoJuicio]
            .filter(subtipo => subtipoVisibleParaJurisdiccion(subtipo, jurisdiccion))
            .forEach(subtipo => {
                const option = document.createElement('option');
                option.value = subtipo.id;
                option.textContent = subtipo.nombre;
                option.dataset.subtipos = JSON.stringify(subtipo.subtipos || []);
                option.dataset.jurisdiccion = subtipo.jurisdiccion || '';
                selectSubtipo.appendChild(option);
            });

        if (autoseleccionarSiEsUnica(selectSubtipo)) {
            cargarSubsubtipos(selectSubtipo.value);
        }
    } else {
        selectSubtipo.disabled = true;
    }
}

function cargarSubsubtipos(subtipoId) {
    const selectSubtipo = document.getElementById('subtipoJuicio');
    const selectedOption = selectSubtipo.options[selectSubtipo.selectedIndex];
    const subtipos = selectedOption ? JSON.parse(selectedOption.dataset.subtipos || '[]') : [];
    const grupoSubsub = document.getElementById('grupSubsubtipo');
    const selectSubsub = document.getElementById('subsubtipoJuicio');

    selectSubsub.innerHTML = '<option value="">Seleccione...</option>';

    if (subtipoId && subtipos.length > 0) {
        grupoSubsub.style.display = 'block';
        selectSubsub.required = true;
        subtipos.forEach(subtipo => {
            const option = document.createElement('option');
            option.value = subtipo.id;
            option.textContent = subtipo.nombre;
            selectSubsub.appendChild(option);
        });

        autoseleccionarSiEsUnica(selectSubsub);
    } else {
        grupoSubsub.style.display = 'none';
        selectSubsub.required = false;
        selectSubsub.value = '';
    }
}

function mostrarCamposPersona(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

function mostrarCamposJurisdiccion(jurisdiccion) {
    const esLocal = jurisdiccion === 'LOCAL';
    document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
    document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
    document.getElementById('numeroLocal').required = esLocal;
    document.getElementById('numeroFederal').required = !esLocal;
    document.getElementById('anoFederal').required = !esLocal;
    const tipoSelect = document.getElementById('tipoJuicio');
    tipoSelect.disabled = false;
    tipoSelect.options[0].textContent = 'Seleccione...';
}

function mostrarSeccionesSegunIMSS(valor) {
    document.getElementById('seccionActor').style.display = valor !== 'ACTOR' ? 'block' : 'none';
    document.getElementById('seccionDemandados').style.display = valor !== 'DEMANDADO' ? 'block' : 'none';
}

function llenarFormulario() {
    if (!casoActual) return;

    document.getElementById('delegacion').value = casoActual.delegacion_id;
    cargarAreas(casoActual.delegacion_id, () => {
        document.getElementById('area').value = casoActual.area_generadora_id;
    });

    const radioJurisdiccion = document.querySelector(`input[name="jurisdiccion"][value="${casoActual.jurisdiccion}"]`);
    if (radioJurisdiccion) {
        radioJurisdiccion.checked = true;
        mostrarCamposJurisdiccion(casoActual.jurisdiccion);
    }

    if (casoActual.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoActual.numero_juicio || casoActual.numero_expediente;
    } else {
        document.getElementById('numeroFederal').value = casoActual.numero_juicio || '';
        document.getElementById('anoFederal').value = casoActual.anio || '';
    }

    const tipoSelect = document.getElementById('tipoJuicio');
    tipoSelect.value = casoActual.tipo_juicio;
    cargarSubtipos(casoActual.tipo_juicio, casoActual.jurisdiccion);

    if (casoActual.tipo_juicio === 'AMPARO INDIRECTO') {
        document.getElementById('grupoSubtipo').style.display = 'none';
    }

    setTimeout(() => {
        const selectSubtipo = document.getElementById('subtipoJuicio');
        const subtipoSeleccionado = seleccionarOpcionPorTexto(selectSubtipo, casoActual.subtipo_juicio);

        if (casoActual.sub_subtipo_juicio && subtipoSeleccionado) {
            cargarSubsubtipos(selectSubtipo.value);
            setTimeout(() => {
                const selectSubsubtipo = document.getElementById('subsubtipoJuicio');
                seleccionarOpcionPorTexto(selectSubsubtipo, casoActual.sub_subtipo_juicio);
            }, 50);
        }
    }, 100);

    llenarTribunales(usuarioActualEdit, casoActual.delegacion_id);
    document.getElementById('tribunal').value = casoActual.organo_jurisdiccional_id ?? '';
    document.getElementById('tribunal').dispatchEvent(new Event('change', { bubbles: true }));
    document.getElementById('fechaInicio').value = String(casoActual.fecha_inicio || '').split('T')[0];
    document.getElementById('fechaInicio').max = obtenerHoyIsoCivilEdicion();

    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoActual.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        mostrarSeccionesSegunIMSS(casoActual.imss_es);
    }

    const actores = obtenerActoresDelCaso();
    if (casoActual.imss_es !== 'ACTOR' && actores.length > 0) {
        actores.forEach(actor => {
            agregarActor();
            const id = `actor_${contadorActores}`;
            const radio = document.querySelector(`input[name="${id}_tipo"][value="${actor.tipo_persona}"]`);
            if (!radio) return;
            radio.checked = true;
            mostrarCamposPersona(id, actor.tipo_persona);

            if (actor.tipo_persona === 'FISICA') {
                document.getElementById(`${id}_nombres`).value = actor.nombres || '';
                document.getElementById(`${id}_paterno`).value = actor.apellido_paterno || '';
                document.getElementById(`${id}_materno`).value = actor.apellido_materno || '';
            } else {
                document.getElementById(`${id}_empresa`).value = actor.empresa || '';
            }
        });
    }

    if (casoActual.imss_es !== 'DEMANDADO' && Array.isArray(casoActual.demandados)) {
        casoActual.demandados.forEach(demandado => {
            agregarDemandado();
            const id = `demandado_${contadorDemandados}`;
            const radio = document.querySelector(`input[name="${id}_tipo"][value="${demandado.tipo_persona}"]`);
            if (!radio) return;
            radio.checked = true;
            mostrarCamposPersona(id, demandado.tipo_persona);

            if (demandado.tipo_persona === 'FISICA') {
                document.getElementById(`${id}_nombres`).value = demandado.nombres || '';
                document.getElementById(`${id}_paterno`).value = demandado.apellido_paterno || '';
                document.getElementById(`${id}_materno`).value = demandado.apellido_materno || '';
            } else {
                document.getElementById(`${id}_empresa`).value = demandado.empresa || '';
            }
        });
    }

    if (Array.isArray(casoActual.codemandados)) {
        casoActual.codemandados.forEach(codemandado => {
            agregarCodemandado();
            const id = `codemandado_${contadorCodemandados}`;
            const radio = document.querySelector(`input[name="${id}_tipo"][value="${codemandado.tipo_persona}"]`);
            if (!radio) return;
            radio.checked = true;
            mostrarCamposPersona(id, codemandado.tipo_persona);

            if (codemandado.tipo_persona === 'FISICA') {
                document.getElementById(`${id}_nombres`).value = codemandado.nombres || '';
                document.getElementById(`${id}_paterno`).value = codemandado.apellido_paterno || '';
                document.getElementById(`${id}_materno`).value = codemandado.apellido_materno || '';
            } else {
                document.getElementById(`${id}_empresa`).value = codemandado.empresa || '';
            }
        });
    }

    if (casoActual.prestacion_principal) {
        document.getElementById('prestacionPrincipal').value = casoActual.prestacion_principal;
    }

    (casoActual.prestaciones_secundarias || []).forEach(prestacionId => {
        const checkbox = document.getElementById(`prestacion_${prestacionId}`);
        if (checkbox) {
            checkbox.checked = true;
            checkbox.closest('.multiselect-option')?.classList.add('selected');
        }
    });
    actualizarPrestacionesTags();

    document.getElementById('prestacionesNotas').value = casoActual.prestaciones_notas || '';
    limitadorPrestacionesNotasEdit?.refresh();

    if (Number(casoActual.importe_demandado || 0) === 0) {
        document.getElementById('sinCuantia').checked = true;
        document.getElementById('importeDemandado').disabled = true;
        document.getElementById('importeDemandado').placeholder = 'Sin cuantia';
    } else {
        document.getElementById('importeDemandado').value = Number(casoActual.importe_demandado)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    llenarAbogadosResponsablesEdicion(usuarioActualEdit, casoActual.delegacion_id, casoActual.abogado_responsable_id || null);
    document.getElementById('pronostico').value = casoActual.pronostico || '';
}

function obtenerActoresDelCaso() {
    if (!casoActual) return [];
    if (Array.isArray(casoActual.actor)) return casoActual.actor;
    if (casoActual.actor && casoActual.actor.tipo_persona) return [casoActual.actor];
    return [];
}

function configurarEventListeners(usuario) {
    document.getElementById('delegacion').addEventListener('change', function () {
        const delegacionId = this.value;
        cargarAreas(delegacionId);
        llenarTribunales(usuario, delegacionId);
        llenarAbogadosResponsablesEdicion(usuario, delegacionId);
    });

    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function () {
            mostrarCamposJurisdiccion(this.value);
            document.getElementById('tipoJuicio').dispatchEvent(new Event('change'));
        });
    });

    document.getElementById('numeroFederal').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    document.getElementById('anoFederal').addEventListener('input', function () {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    document.getElementById('tipoJuicio').addEventListener('change', function () {
        const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked')?.value || '';
        cargarSubtipos(this.value, jurisdiccion);
        document.getElementById('grupSubsubtipo').style.display = 'none';
    });

    document.getElementById('subtipoJuicio').addEventListener('change', function () {
        cargarSubsubtipos(this.value);
    });

    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', function () {
            const valor = this.value;
            mostrarSeccionesSegunIMSS(valor);

            if (valor === 'ACTOR') {
                document.getElementById('listaActores').innerHTML = '';
                contadorActores = 0;
            }

            if (valor === 'DEMANDADO') {
                document.getElementById('listaDemandados').innerHTML = '';
                contadorDemandados = 0;
            }
        });
    });

    document.getElementById('sinCuantia').addEventListener('change', function () {
        const importeInput = document.getElementById('importeDemandado');
        if (this.checked) {
            importeInput.value = '';
            importeInput.disabled = true;
            importeInput.placeholder = 'Sin cuantia';
        } else {
            importeInput.disabled = false;
            importeInput.placeholder = '0.00';
        }
    });

    document.getElementById('importeDemandado').addEventListener('input', function () {
        let valor = this.value.replace(/[^0-9.]/g, '');
        const partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes.slice(1).join('');
        }
        if (partes[0]) {
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        this.value = partes.join('.');
    });

    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCambios);
}

function toggleMultiselectPrestaciones() {
    const dropdown = document.getElementById('prestacionesDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

function actualizarPrestacionesTags() {
    const trigger = document.getElementById('prestacionesTrigger');
    const placeholder = document.getElementById('prestacionesPlaceholder');
    const seleccionados = document.querySelectorAll('#prestacionesOpciones input[type="checkbox"]:checked');

    if (seleccionados.length === 0) {
        trigger.querySelectorAll('.multiselect-tags').forEach(tag => tag.remove());
        if (placeholder) placeholder.style.display = '';
        return;
    }

    if (placeholder) placeholder.style.display = 'none';

    let tagsContainer = trigger.querySelector('.multiselect-tags');
    if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'multiselect-tags';
        trigger.insertBefore(tagsContainer, trigger.querySelector('.multiselect-arrow'));
    }

    tagsContainer.innerHTML = '';
    seleccionados.forEach(checkbox => {
        const prestacion = catalogos.prestaciones.find(item => item.id === parseInt(checkbox.value, 10));
        if (!prestacion) return;

        const tag = document.createElement('span');
        tag.className = 'multiselect-tag';
        tag.innerHTML = `${prestacion.nombre} <span class="multiselect-tag-remove" onclick="event.stopPropagation(); quitarPrestacion(${prestacion.id})">x</span>`;
        tagsContainer.appendChild(tag);
    });
}

function quitarPrestacion(id) {
    const checkbox = document.getElementById(`prestacion_${id}`);
    if (checkbox) {
        checkbox.checked = false;
        checkbox.dispatchEvent(new Event('change'));
    }
}

document.addEventListener('click', function (event) {
    const multiselect = document.getElementById('prestacionesMultiselect');
    if (multiselect && !multiselect.contains(event.target)) {
        document.getElementById('prestacionesDropdown').style.display = 'none';
    }
});

function agregarActor() {
    contadorActores += 1;
    const id = `actor_${contadorActores}`;
    const html = `
        <div class="dynamic-field" id="${id}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">Actor ${contadorActores}</span>
                <button type="button" class="btn-remove" onclick="eliminarActor('${id}')">Eliminar</button>
            </div>
            <div class="form-group">
                <label class="form-label required">Tipo de Persona</label>
                <div class="form-radio-group">
                    <div class="form-radio">
                        <input type="radio" id="${id}_fisica" name="${id}_tipo" value="FISICA" required onchange="cambiarTipoActor('${id}', 'FISICA')">
                        <label for="${id}_fisica">Fisica</label>
                    </div>
                    <div class="form-radio">
                        <input type="radio" id="${id}_moral" name="${id}_tipo" value="MORAL" onchange="cambiarTipoActor('${id}', 'MORAL')">
                        <label for="${id}_moral">Moral</label>
                    </div>
                </div>
            </div>
            <div id="${id}_fisica_campos" style="display: none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label required">Nombres</label>
                        <input type="text" id="${id}_nombres" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Apellido Paterno</label>
                        <input type="text" id="${id}_paterno" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Apellido Materno</label>
                        <input type="text" id="${id}_materno" class="form-input">
                    </div>
                </div>
            </div>
            <div id="${id}_moral_campos" style="display: none;">
                <div class="form-group">
                    <label class="form-label required">Nombre de la Empresa</label>
                    <input type="text" id="${id}_empresa" class="form-input">
                </div>
            </div>
        </div>
    `;
    document.getElementById('listaActores').insertAdjacentHTML('beforeend', html);
}

function eliminarActor(id) { document.getElementById(id)?.remove(); }
function cambiarTipoActor(id, tipo) { mostrarCamposPersona(id, tipo); }

function agregarDemandado() {
    contadorDemandados += 1;
    const id = `demandado_${contadorDemandados}`;
    const html = `
        <div class="dynamic-field" id="${id}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">Demandado ${contadorDemandados}</span>
                <button type="button" class="btn-remove" onclick="eliminarDemandado('${id}')">Eliminar</button>
            </div>
            <div class="form-group">
                <label class="form-label required">Tipo de Persona</label>
                <div class="form-radio-group">
                    <div class="form-radio">
                        <input type="radio" id="${id}_fisica" name="${id}_tipo" value="FISICA" required onchange="cambiarTipoDemandado('${id}', 'FISICA')">
                        <label for="${id}_fisica">Fisica</label>
                    </div>
                    <div class="form-radio">
                        <input type="radio" id="${id}_moral" name="${id}_tipo" value="MORAL" onchange="cambiarTipoDemandado('${id}', 'MORAL')">
                        <label for="${id}_moral">Moral</label>
                    </div>
                </div>
            </div>
            <div id="${id}_fisica_campos" style="display: none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label required">Nombres</label>
                        <input type="text" id="${id}_nombres" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Apellido Paterno</label>
                        <input type="text" id="${id}_paterno" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label required">Apellido Materno</label>
                        <input type="text" id="${id}_materno" class="form-input">
                    </div>
                </div>
            </div>
            <div id="${id}_moral_campos" style="display: none;">
                <div class="form-group">
                    <label class="form-label required">Nombre de la Empresa</label>
                    <input type="text" id="${id}_empresa" class="form-input">
                </div>
            </div>
        </div>
    `;
    document.getElementById('listaDemandados').insertAdjacentHTML('beforeend', html);
}

function eliminarDemandado(id) { document.getElementById(id)?.remove(); }
function cambiarTipoDemandado(id, tipo) { mostrarCamposPersona(id, tipo); }

function agregarCodemandado() {
    contadorCodemandados += 1;
    const id = `codemandado_${contadorCodemandados}`;
    const html = `
        <div class="dynamic-field" id="${id}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">Codemandado ${contadorCodemandados}</span>
                <button type="button" class="btn-remove" onclick="eliminarCodemandado('${id}')">Eliminar</button>
            </div>
            <div class="form-group">
                <label class="form-label required">Tipo de Persona</label>
                <div class="form-radio-group">
                    <div class="form-radio">
                        <input type="radio" id="${id}_fisica" name="${id}_tipo" value="FISICA" required onchange="cambiarTipoCodemandado('${id}', 'FISICA')">
                        <label for="${id}_fisica">Fisica</label>
                    </div>
                    <div class="form-radio">
                        <input type="radio" id="${id}_moral" name="${id}_tipo" value="MORAL" onchange="cambiarTipoCodemandado('${id}', 'MORAL')">
                        <label for="${id}_moral">Moral</label>
                    </div>
                </div>
            </div>
            <div id="${id}_fisica_campos" style="display: none;">
                <div class="form-grid">
                    <div class="form-group">
                        <label class="form-label">Nombres</label>
                        <input type="text" id="${id}_nombres" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Apellido Paterno</label>
                        <input type="text" id="${id}_paterno" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Apellido Materno</label>
                        <input type="text" id="${id}_materno" class="form-input">
                    </div>
                </div>
            </div>
            <div id="${id}_moral_campos" style="display: none;">
                <div class="form-group">
                    <label class="form-label">Nombre de la Empresa</label>
                    <input type="text" id="${id}_empresa" class="form-input">
                </div>
            </div>
        </div>
    `;
    document.getElementById('listaCodemandados').insertAdjacentHTML('beforeend', html);
}

function eliminarCodemandado(id) { document.getElementById(id)?.remove(); }
function cambiarTipoCodemandado(id, tipo) { mostrarCamposPersona(id, tipo); }

function obtenerPersonasDinamicas(prefijo) {
    const personas = [];
    const elementos = document.querySelectorAll(`[id^="${prefijo}"]`);
    const ids = new Set();

    elementos.forEach(elemento => {
        const parts = elemento.id.split('_');
        if (parts.length >= 2) {
            ids.add(`${parts[0]}_${parts[1]}`);
        }
    });

    ids.forEach(id => {
        const tipoRadio = document.querySelector(`input[name="${id}_tipo"]:checked`);
        if (!tipoRadio) return;

        if (tipoRadio.value === 'FISICA') {
            personas.push({
                tipo_persona: 'FISICA',
                nombres: (document.getElementById(`${id}_nombres`).value || '').toUpperCase(),
                apellido_paterno: (document.getElementById(`${id}_paterno`).value || '').toUpperCase(),
                apellido_materno: (document.getElementById(`${id}_materno`).value || '').toUpperCase()
            });
        } else {
            personas.push({
                tipo_persona: 'MORAL',
                empresa: (document.getElementById(`${id}_empresa`).value || '').toUpperCase()
            });
        }
    });

    return personas;
}

function construirObjetoCaso() {
    const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked').value;
    const esLocal = jurisdiccion === 'LOCAL';
    const imssEs = document.querySelector('input[name="imssEs"]:checked').value;

    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = (document.getElementById('numeroLocal').value || '').toUpperCase();
    } else {
        const numero = document.getElementById('numeroFederal').value;
        const anio = document.getElementById('anoFederal').value;
        numeroExpediente = `${numero}/${anio}`.toUpperCase();
    }

    const prestacionPrincipal = parseInt(document.getElementById('prestacionPrincipal').value, 10) || null;
    const prestacionesSecundarias = [];

    document.querySelectorAll('#prestacionesOpciones input[type="checkbox"]:checked').forEach(checkbox => {
        const value = parseInt(checkbox.value, 10);
        if (value !== prestacionPrincipal) {
            prestacionesSecundarias.push(value);
        }
    });

    const sinCuantia = document.getElementById('sinCuantia').checked;
    let importeDemandado = 0;
    if (!sinCuantia) {
        importeDemandado = parseFloat(document.getElementById('importeDemandado').value.replace(/,/g, '')) || 0;
    }

    const selectSubtipo = document.getElementById('subtipoJuicio');
    const selectSubsubtipo = document.getElementById('subsubtipoJuicio');

    const caso = {
        id: casoActual.id,
        numero: casoActual.numero,
        delegacion_id: parseInt(document.getElementById('delegacion').value, 10),
        area_generadora_id: parseInt(document.getElementById('area').value, 10),
        jurisdiccion,
        tipo_juicio: document.getElementById('tipoJuicio').value,
        subtipo_juicio: selectSubtipo.options[selectSubtipo.selectedIndex]?.text || '',
        sub_subtipo_juicio: selectSubsubtipo.value ? selectSubsubtipo.options[selectSubsubtipo.selectedIndex].text : null,
        numero_expediente: numeroExpediente,
        organo_jurisdiccional_id: parseInt(document.getElementById('tribunal').value, 10),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actor: imssEs !== 'ACTOR' ? obtenerPersonasDinamicas('actor_') : null,
        demandados: imssEs !== 'DEMANDADO' ? obtenerPersonasDinamicas('demandado_') : [],
        codemandados: obtenerPersonasDinamicas('codemandado_'),
        prestacion_principal: prestacionPrincipal,
        prestaciones_secundarias: prestacionesSecundarias,
        prestaciones_notas: (document.getElementById('prestacionesNotas').value || '').toUpperCase() || null,
        importe_demandado: importeDemandado,
        abogado_responsable_id: parseInt(document.getElementById('abogadoResponsable').value, 10) || null,
        pronostico: document.getElementById('pronostico').value || null,
        estatus: casoActual.estatus || 'TRAMITE',
        fecha_vencimiento: casoActual.fecha_vencimiento || null
    };

    if (esLocal) {
        caso.numero_juicio = document.getElementById('numeroLocal').value;
        const partesExpediente = caso.numero_expediente.split('/');
        caso.anio = partesExpediente.length > 1 ? partesExpediente[partesExpediente.length - 1] : null;
    } else {
        caso.numero_juicio = document.getElementById('numeroFederal').value;
        caso.anio = document.getElementById('anoFederal').value;
    }

    return caso;
}

async function validarCasoEdit(caso) {
    if (!caso.delegacion_id || !caso.area_generadora_id || !caso.organo_jurisdiccional_id || !caso.fecha_inicio) {
        await window.appAlert?.({
            title: 'Campos obligatorios',
            message: 'Completa todos los campos obligatorios.'
        });
        return false;
    }
    if (!caso.numero_expediente) {
        await window.appAlert?.({
            title: 'Número de expediente requerido',
            message: 'Debe capturar el número de expediente.'
        });
        return false;
    }
    if (caso.imss_es !== 'ACTOR' && (!caso.actor || caso.actor.length === 0)) {
        await window.appAlert?.({
            title: 'Actor requerido',
            message: 'Debe capturar al menos un actor.'
        });
        return false;
    }
    if (caso.imss_es !== 'DEMANDADO' && (!caso.demandados || caso.demandados.length === 0)) {
        await window.appAlert?.({
            title: 'Demandado requerido',
            message: 'Debe capturar al menos un demandado.'
        });
        return false;
    }
    if (!caso.prestacion_principal) {
        await window.appAlert?.({
            title: 'Prestación principal requerida',
            message: 'Debe seleccionar una prestación principal.'
        });
        return false;
    }
    if (!caso.abogado_responsable_id) {
        await window.appAlert?.({
            title: 'Abogado responsable requerido',
            message: 'Debe seleccionar un abogado responsable.'
        });
        return false;
    }
    if (caso.fecha_inicio && caso.fecha_inicio > obtenerHoyIsoCivilEdicion()) {
        await window.appAlert?.({
            title: 'Fecha invÃ¡lida',
            message: 'La fecha de inicio no puede ser posterior a hoy.'
        });
        return false;
    }
    return true;
}

async function guardarCambios(event) {
    event.preventDefault();

    if (esCasoAcumuladoEdicion()) {
        await window.appAlert?.({
            title: 'Asunto acumulado',
            message: `Este asunto esta acumulado a ${obtenerNumeroPadreAcumulacionEdicion()}. Debe desacumularse primero.`
        });
        return;
    }

    const casoEditado = construirObjetoCaso();
    if (!await validarCasoEdit(casoEditado)) return;

    try {
        const casoGuardado = await guardarCasoCivilApi(casoEditado);
        const casos = JSON.parse(localStorage.getItem('casos') || '[]');
        const index = casos.findIndex(caso => caso.id === casoActual.id);

        if (index !== -1) {
            casos[index] = { ...casos[index], ...casoGuardado };
        } else {
            casos.unshift(casoGuardado);
        }

        localStorage.setItem('casos', JSON.stringify(casos));
        await window.appAlert?.({
            title: 'Cambios guardados',
            message: 'El registro se guardó correctamente.'
        });
        window.location.href = 'casos.html';
    } catch (error) {
        console.error('Error al actualizar asunto civil:', error);
        await window.appAlert?.({
            title: 'No se pudo actualizar el asunto',
            message: error.message || 'Ocurrió un problema al actualizar el asunto.'
        });
    }
}
