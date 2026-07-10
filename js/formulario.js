// =====================================================
// FORMULARIO.JS - Logica para CREAR nuevos casos
// =====================================================

let contadorActores = 0;
let contadorDemandados = 0;
let contadorCodemandados = 0;
let usuarioActual = null;
let catalogos = {
    delegaciones: [],
    areas: {},
    organosJurisdiccionales: [],
    prestaciones: [],
    abogadosResponsables: [],
    tiposJuicio: {}
};
let limitadorPrestacionesNotas = null;

function obtenerHoyIsoCivilFormulario() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

function obtenerDelegacionCivilFormulario(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
}

function obtenerAbogadosDisponiblesFormulario(usuario, delegacionId) {
    const abogados = Array.isArray(catalogos.abogadosResponsables) ? catalogos.abogadosResponsables : [];

    if (usuario?.rol === 'admin') {
        return abogados;
    }

    const delegacionUsuario = usuario?.delegacion_id ? parseInt(usuario.delegacion_id, 10) : null;
    return abogados.filter(abogado => parseInt(abogado.delegacion_id, 10) === delegacionUsuario);
}

function llenarAbogadosResponsablesFormulario(usuario, delegacionId, abogadoSeleccionadoId = null) {
    const select = document.getElementById('abogadoResponsable');
    if (!select) return;

    const abogadosDisponibles = obtenerAbogadosDisponiblesFormulario(usuario, delegacionId);
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
    } else if (autoseleccionarSiEsUnica(select)) {
        select.dispatchEvent(new Event('change'));
    }
}

function actualizarHeaderCivilFormulario(usuario) {
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
            const delegacion = obtenerDelegacionCivilFormulario(usuario.delegacion_id);
            infoOOAD.textContent = delegacion?.nombre || 'Todas las JSJ';
        } else {
            infoOOAD.textContent = 'Todas las JSJ';
        }
    }
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
        console.error('No se pudo refrescar la sesión del formulario civil:', error);
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

    return catalogos;
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

document.addEventListener('DOMContentLoaded', async function() {
    const usuario = await verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;
    window.mostrarCargaVista?.('.container');

    if (!usuario.permiso_civil_mercantil && usuario.rol !== 'admin') {
        window.location.href = usuario.permiso_penal ? 'penal.html' : 'login.html';
        return;
    }

    // Proteger ruta: consulta no puede crear
    if (usuario.rol === 'consulta' || usuario.rol === 'jefe') {
        window.location.href = 'casos.html';
        return;
    }

    actualizarHeaderCivilFormulario(usuario);
    const fechaInicioInput = document.getElementById('fechaInicio');
    if (fechaInicioInput) {
        fechaInicioInput.max = obtenerHoyIsoCivilFormulario();
    }

    try {
        try {
            await cargarCatalogosCivilDesdeApi();
            actualizarHeaderCivilFormulario(usuario);
        } catch (err) {
            console.error('No se pudieron cargar los catalogos desde la API local:', err);
            window.catalogos = { delegaciones: [], areas: {}, organosJurisdiccionales: [], prestaciones: [], abogadosResponsables: [], tiposJuicio: {} };
        }

        configurarEventListeners(usuario);
        inicializarFormulario(usuario);
        window.initSearchableSelect?.('tribunal', {
            placeholder: 'Seleccione...',
            searchPlaceholder: 'Buscar tribunal o juzgado...'
        });
        limitadorPrestacionesNotas = window.setupExpandableTextLimiter?.({
            fieldId: 'prestacionesNotas'
        }) || null;
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

function inicializarFormulario(usuario) {
    llenarDelegaciones(usuario);
    llenarTribunales(usuario);
    llenarPrestaciones();
    llenarAbogadosResponsablesFormulario(usuario, document.getElementById('delegacion').value || usuario?.delegacion_id || null);
}

function llenarDelegaciones(usuario) {
    const select = document.getElementById('delegacion');
    catalogos.delegaciones.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = d.nombre;
        select.appendChild(option);
    });

    // Si no es admin, pre-seleccionar y bloquear JSJ
    if (usuario && usuario.rol !== 'admin' && usuario.delegacion_id) {
        select.value = usuario.delegacion_id;
        select.disabled = true;
        // Disparar change para cargar Ã¡reas
        select.dispatchEvent(new Event('change'));
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
        ? catalogos.organosJurisdiccionales.filter(t => t.delegacion_id === parseInt(filtroDeleg, 10))
        : catalogos.organosJurisdiccionales;

    organosFiltrados
        .slice()
        .sort(compararOrganosJurisdiccionales)
        .forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.nombre;
        select.appendChild(option);
    });
}

function llenarPrestaciones() {
    // Llenar select de prestaciÃ³n principal
    const selectPrincipal = document.getElementById('prestacionPrincipal');
    if (selectPrincipal) {
        selectPrincipal.innerHTML = '<option value="">Seleccione...</option>';
        catalogos.prestaciones.forEach(p => {
            const option = document.createElement('option');
            option.value = p.id;
            option.textContent = p.nombre;
            selectPrincipal.appendChild(option);
        });
    }

    // Llenar multiselect de prestaciones secundarias
    const container = document.getElementById('prestacionesOpciones');
    container.innerHTML = '';
    catalogos.prestaciones.forEach(p => {
        const div = document.createElement('div');
        div.className = 'multiselect-option';
        div.setAttribute('data-value', p.id);
        div.innerHTML = `
            <input type="checkbox" id="prestacion_${p.id}" value="${p.id}">
            <label for="prestacion_${p.id}">${p.nombre}</label>
        `;
        div.addEventListener('click', function(e) {
            if (e.target.tagName === 'INPUT') return; // checkbox handles itself
            const cb = div.querySelector('input[type="checkbox"]');
            cb.checked = !cb.checked;
            cb.dispatchEvent(new Event('change'));
        });
        div.querySelector('input').addEventListener('change', function() {
            div.classList.toggle('selected', this.checked);
            actualizarPrestacionesTags();
        });
        container.appendChild(div);
    });
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
        // Mostrar placeholder, quitar tags
        trigger.querySelectorAll('.multiselect-tags').forEach(t => t.remove());
        if (!placeholder) {
            const span = document.createElement('span');
            span.className = 'multiselect-placeholder';
            span.id = 'prestacionesPlaceholder';
            span.textContent = 'Seleccione prestaciones...';
            trigger.insertBefore(span, trigger.querySelector('.multiselect-arrow'));
        } else {
            placeholder.style.display = '';
        }
        return;
    }

    if (placeholder) placeholder.style.display = 'none';

    // Crear/actualizar tags
    let tagsContainer = trigger.querySelector('.multiselect-tags');
    if (!tagsContainer) {
        tagsContainer = document.createElement('div');
        tagsContainer.className = 'multiselect-tags';
        trigger.insertBefore(tagsContainer, trigger.querySelector('.multiselect-arrow'));
    }
    tagsContainer.innerHTML = '';

    seleccionados.forEach(cb => {
        const prest = catalogos.prestaciones.find(p => p.id === parseInt(cb.value));
        if (!prest) return;
        const tag = document.createElement('span');
        tag.className = 'multiselect-tag';
        tag.innerHTML = `${prest.nombre} <span class="multiselect-tag-remove" onclick="event.stopPropagation(); quitarPrestacion(${prest.id})">&times;</span>`;
        tagsContainer.appendChild(tag);
    });
}

function quitarPrestacion(id) {
    const cb = document.getElementById(`prestacion_${id}`);
    if (cb) {
        cb.checked = false;
        cb.dispatchEvent(new Event('change'));
    }
}

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', function(e) {
    const multiselect = document.getElementById('prestacionesMultiselect');
    if (multiselect && !multiselect.contains(e.target)) {
        document.getElementById('prestacionesDropdown').style.display = 'none';
    }
});

// Determina si un subtipo es visible segÃºn la jurisdicciÃ³n seleccionada
function subtipoVisibleParaJurisdiccion(st, jurisdiccion) {
    if (!jurisdiccion) return true; // Sin jurisdicciÃ³n seleccionada, mostrar todos

    // Si el subtipo tiene jurisdicciÃ³n directa
    if (st.jurisdiccion) {
        return st.jurisdiccion === 'AMBAS' || st.jurisdiccion === jurisdiccion;
    }

    // Si tiene sub-subtipos, mostrar si al menos uno aplica a la jurisdicciÃ³n
    if (st.subtipos && st.subtipos.length > 0) {
        return st.subtipos.some(ss => ss.jurisdiccion === 'AMBAS' || ss.jurisdiccion === jurisdiccion);
    }

    return true;
}

function configurarEventListeners(usuario) {
    // Cambio de delegacion actualiza areas y tribunales
    document.getElementById('delegacion').addEventListener('change', function() {
        const delegacionId = this.value;
        const selectArea = document.getElementById('area');
        selectArea.innerHTML = '<option value="">Seleccione...</option>';

        if (delegacionId && catalogos.areas[delegacionId]) {
            selectArea.disabled = false;
            catalogos.areas[delegacionId].forEach(a => {
                const option = document.createElement('option');
                option.value = a.id;
                option.textContent = a.nombre;
                selectArea.appendChild(option);
            });
        } else {
            selectArea.disabled = true;
        }

        // Actualizar tribunales segÃºn la delegaciÃ³n seleccionada
        llenarTribunales(usuario, delegacionId);
        llenarAbogadosResponsablesFormulario(usuario, delegacionId);
    });

    // Cambio de jurisdiccion muestra campos correspondientes
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const esLocal = this.value === 'LOCAL';
            document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
            document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';

            document.getElementById('numeroLocal').value = '';
            document.getElementById('numeroLocal').required = esLocal;
            document.getElementById('numeroFederal').value = '';
            document.getElementById('numeroFederal').required = !esLocal;
            document.getElementById('anoFederal').value = '';
            document.getElementById('anoFederal').required = !esLocal;

            // Habilitar tipo de juicio y re-filtrar subtipos
            const tipoSelect = document.getElementById('tipoJuicio');
            tipoSelect.disabled = false;
            tipoSelect.options[0].textContent = 'Seleccione...';
            if (tipoSelect.value) {
                tipoSelect.dispatchEvent(new Event('change'));
            }
        });
    });

    // Validacion solo numeros en expediente federal
    document.getElementById('numeroFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    document.getElementById('anoFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    // Cambio de tipo de juicio actualiza subtipos (filtrados por jurisdicciÃ³n)
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const tipo = this.value;
        const selectSubtipo = document.getElementById('subtipoJuicio');
        const grupoSubsub = document.getElementById('grupSubsubtipo');
        const selectSubsub = document.getElementById('subsubtipoJuicio');
        selectSubtipo.innerHTML = '<option value="">Seleccione...</option>';
        selectSubsub.innerHTML = '<option value="">Seleccione...</option>';
        selectSubsub.required = false;
        grupoSubsub.style.display = 'none';

        // Obtener jurisdicciÃ³n seleccionada
        const jurisdiccionRadio = document.querySelector('input[name="jurisdiccion"]:checked');
        const jurisdiccion = jurisdiccionRadio ? jurisdiccionRadio.value : '';

        if (tipo && catalogos.tiposJuicio[tipo]) {
            selectSubtipo.disabled = false;

            catalogos.tiposJuicio[tipo]
                .filter(st => subtipoVisibleParaJurisdiccion(st, jurisdiccion))
                .forEach(st => {
                    const option = document.createElement('option');
                    option.value = st.id;
                    option.textContent = st.nombre;
                    option.dataset.subtipos = JSON.stringify(st.subtipos || []);
                    option.dataset.jurisdiccion = st.jurisdiccion || '';
                    option.dataset.requiereDescripcion = st.requiere_descripcion || false;
                    selectSubtipo.appendChild(option);
                });

            // AMPARO INDIRECTO: siempre Federal, auto-seleccionar Ãºnico subtipo
            if (tipo === 'AMPARO INDIRECTO') {
                // Forzar jurisdicciÃ³n Federal
                const radioFederal = document.getElementById('federal');
                if (radioFederal) {
                    radioFederal.checked = true;
                    radioFederal.dispatchEvent(new Event('change'));
                }
                // Auto-seleccionar el Ãºnico subtipo
                if (selectSubtipo.options.length === 2) {
                    selectSubtipo.value = selectSubtipo.options[1].value;
                }
                // Ocultar subtipo y sub-subtipo (solo hay uno)
                const grupoSubtipo = document.getElementById('grupoSubtipo');
                if (grupoSubtipo) grupoSubtipo.style.display = 'none';
            } else {
                const grupoSubtipo = document.getElementById('grupoSubtipo');
                if (grupoSubtipo) grupoSubtipo.style.display = '';
            }

            if (autoseleccionarSiEsUnica(selectSubtipo)) {
                selectSubtipo.dispatchEvent(new Event('change'));
            }
        } else {
            selectSubtipo.disabled = true;
            const grupoSubtipo = document.getElementById('grupoSubtipo');
            if (grupoSubtipo) grupoSubtipo.style.display = '';
        }
    });

    // Cambio de subtipo puede mostrar sub-subtipos
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const subtipos = selectedOption ? JSON.parse(selectedOption.dataset.subtipos || '[]') : [];

        // Obtener jurisdiccion seleccionada
        const jurisdiccionRadio = document.querySelector('input[name="jurisdiccion"]:checked');
        const jurisdiccion = jurisdiccionRadio ? jurisdiccionRadio.value : '';

        // Filtrar sub-subtipos segÃºn jurisdicciÃ³n seleccionada
        const subtiposFiltrados = subtipos.filter(ss => {
            if (!jurisdiccion || !ss.jurisdiccion) return true;
            return ss.jurisdiccion === 'AMBAS' || ss.jurisdiccion === jurisdiccion;
        });

        const grupoSubsub = document.getElementById('grupSubsubtipo');
        const selectSubsub = document.getElementById('subsubtipoJuicio');

        if (subtiposFiltrados.length > 0) {
            grupoSubsub.style.display = 'block';
            selectSubsub.required = true;
            selectSubsub.innerHTML = '<option value="">Seleccione...</option>';
            subtiposFiltrados.forEach(ss => {
                const option = document.createElement('option');
                option.value = ss.id;
                option.textContent = ss.nombre;
                selectSubsub.appendChild(option);
            });

            autoseleccionarSiEsUnica(selectSubsub);
        } else {
            grupoSubsub.style.display = 'none';
            selectSubsub.value = '';
            selectSubsub.required = false;
        }
    });

    // Cambio de posicion IMSS muestra/oculta secciones
    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const valor = this.value;

            const seccionActor = document.getElementById('seccionActor');
            seccionActor.style.display = (valor !== 'ACTOR') ? 'block' : 'none';

            const seccionDemandados = document.getElementById('seccionDemandados');
            seccionDemandados.style.display = (valor !== 'DEMANDADO') ? 'block' : 'none';

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

    // Checkbox sin cuantia
    document.getElementById('sinCuantia').addEventListener('change', function() {
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

    // Formato de importe: solo numeros y comas
    document.getElementById('importeDemandado').addEventListener('input', function() {
        let valor = this.value.replace(/[^0-9.]/g, '');

        // Solo permitir un punto decimal
        const partes = valor.split('.');
        if (partes.length > 2) {
            valor = partes[0] + '.' + partes.slice(1).join('');
        }

        // Formatear con comas la parte entera
        if (partes[0]) {
            partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }

        this.value = partes.join('.');
    });

    // Submit del formulario
    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCaso);
}

// =====================================================
// ACTORES DINAMICOS
// =====================================================
function agregarActor() {
    contadorActores++;
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

function eliminarActor(id) {
    document.getElementById(id).remove();
}

function cambiarTipoActor(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

// =====================================================
// DEMANDADOS DINAMICOS
// =====================================================
function agregarDemandado() {
    contadorDemandados++;
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

function eliminarDemandado(id) {
    document.getElementById(id).remove();
}

function cambiarTipoDemandado(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

// =====================================================
// CODEMANDADOS DINAMICOS
// =====================================================
function agregarCodemandado() {
    contadorCodemandados++;
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

function eliminarCodemandado(id) {
    document.getElementById(id).remove();
}

function cambiarTipoCodemandado(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

// =====================================================
// GUARDAR CASO
// =====================================================
async function guardarCaso(e) {
    e.preventDefault();

    const caso = construirObjetoCaso();

    if (caso.fecha_inicio && caso.fecha_inicio > obtenerHoyIsoCivilFormulario()) {
        await window.appAlert?.({
            title: 'Fecha inválida',
            message: 'La fecha de inicio no puede ser posterior a hoy.'
        });
        return;
    }

    if (!await validarCasoCivil(caso)) {
        return;
    }

    try {
        const casoGuardado = await guardarCasoCivilApi(caso);
        const casos = JSON.parse(localStorage.getItem('casos') || '[]');
        casos.unshift({ ...caso, ...casoGuardado, seguimiento: {} });
        localStorage.setItem('casos', JSON.stringify(casos));
        await window.appAlert({
            title: 'Cambios guardados',
            message: 'El registro se guard\u00f3 correctamente.'
        });
        window.location.href = 'casos.html';
    } catch (err) {
        console.error('Error al guardar asunto civil:', err);
        await window.appAlert({
            title: 'No se pudo guardar el asunto',
            message: err.message || 'Ocurri\u00f3 un problema al guardar el asunto.'
        });
    }
}

function construirObjetoCaso() {
    const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked').value;
    const esLocal = jurisdiccion === 'LOCAL';

    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = (document.getElementById('numeroLocal').value || '').toUpperCase();
    } else {
        const num = document.getElementById('numeroFederal').value;
        const ano = document.getElementById('anoFederal').value;
        numeroExpediente = `${num}/${ano}`.toUpperCase();
    }

    const imssEs = document.querySelector('input[name="imssEs"]:checked').value;

    // Actores (array)
    let actores = [];
    if (imssEs !== 'ACTOR') {
        actores = obtenerPersonasDinamicas('actor_');
    }

    // Demandados
    let demandados = [];
    if (imssEs !== 'DEMANDADO') {
        demandados = obtenerPersonasDinamicas('demandado_');
    }

    // Codemandados
    const codemandados = obtenerPersonasDinamicas('codemandado_');

    // PrestaciÃ³n principal (single select)
    const prestacionPrincipal = parseInt(document.getElementById('prestacionPrincipal').value) || null;

    // Prestaciones secundarias (multiselect) - excluir la principal si fue seleccionada
    const prestacionesSecundarias = [];
    document.querySelectorAll('#prestacionesOpciones input[type="checkbox"]:checked').forEach(cb => {
        const val = parseInt(cb.value);
        if (val !== prestacionPrincipal) {
            prestacionesSecundarias.push(val);
        }
    });

    // Importe
    const sinCuantia = document.getElementById('sinCuantia').checked;
    let importeDemandado = 0;
    if (!sinCuantia) {
        const valorImporte = document.getElementById('importeDemandado').value.replace(/,/g, '');
        importeDemandado = parseFloat(valorImporte) || 0;
    }

    const subtipoSelect = document.getElementById('subtipoJuicio');
    const subsubtipoSelect = document.getElementById('subsubtipoJuicio');

    const caso = {
        delegacion_id: parseInt(document.getElementById('delegacion').value),
        area_generadora_id: parseInt(document.getElementById('area').value),
        jurisdiccion: jurisdiccion,
        tipo_juicio: document.getElementById('tipoJuicio').value,
        subtipo_juicio: subtipoSelect.options[subtipoSelect.selectedIndex]?.text || '',
        sub_subtipo_juicio: subsubtipoSelect.value ? subsubtipoSelect.options[subsubtipoSelect.selectedIndex].text : null,
        numero_expediente: numeroExpediente,
        acumulado_a: null,
        organo_jurisdiccional_id: parseInt(document.getElementById('tribunal').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actor: actores.length > 0 ? actores : null,
        demandados: demandados,
        codemandados: codemandados,
        prestacion_principal: prestacionPrincipal,
        prestaciones_secundarias: prestacionesSecundarias,
        prestaciones_notas: (document.getElementById('prestacionesNotas').value || '').toUpperCase() || null,
        importe_demandado: importeDemandado,
        abogado_responsable_id: parseInt(document.getElementById('abogadoResponsable').value, 10) || null,
        pronostico: document.getElementById('pronostico').value || null,
        estatus: 'TRAMITE',
        fecha_vencimiento: null
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

function obtenerPersonasDinamicas(prefijo) {
    const personas = [];
    const elementos = document.querySelectorAll(`[id^="${prefijo}"]`);
    const ids = new Set();

    elementos.forEach(el => {
        const id = el.id.split('_')[0] + '_' + el.id.split('_')[1];
        ids.add(id);
    });

    ids.forEach(id => {
        const tipoRadio = document.querySelector(`input[name="${id}_tipo"]:checked`);
        if (!tipoRadio) return;

        const tipo = tipoRadio.value;
        if (tipo === 'FISICA') {
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

function validarCaso(caso) {
    if (!caso.prestacion_principal) {
        window.appAlert({
            title: 'Prestaci\u00f3n principal requerida',
            message: 'Debe seleccionar una prestaci\u00f3n principal.'
        });
        return false;
    }

    return true;
}
async function validarCasoCivil(caso) {
    if (!caso.delegacion_id || !caso.area_generadora_id || !caso.organo_jurisdiccional_id || !caso.fecha_inicio) {
        await window.appAlert({
            title: 'Campos obligatorios',
            message: 'Completa todos los campos obligatorios.'
        });
        return false;
    }

    if (!caso.numero_expediente) {
        await window.appAlert({
            title: 'N\u00famero de expediente requerido',
            message: 'Debe capturar el n\u00famero de expediente.'
        });
        return false;
    }

    if (caso.imss_es !== 'ACTOR' && (!caso.actor || caso.actor.length === 0)) {
        await window.appAlert({
            title: 'Actor requerido',
            message: 'Debe capturar al menos un actor.'
        });
        return false;
    }

    if (caso.imss_es !== 'DEMANDADO' && (!caso.demandados || caso.demandados.length === 0)) {
        await window.appAlert({
            title: 'Demandado requerido',
            message: 'Debe capturar al menos un demandado.'
        });
        return false;
    }

    if (!caso.prestacion_principal) {
        await window.appAlert({
            title: 'Prestaci\u00f3n principal requerida',
            message: 'Debe seleccionar una prestaci\u00f3n principal.'
        });
        return false;
    }

    if (!caso.abogado_responsable_id) {
        await window.appAlert({
            title: 'Abogado responsable requerido',
            message: 'Debe seleccionar un abogado responsable.'
        });
        return false;
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

