// =====================================================
// FORMULARIO.JS - Logica para CREAR nuevos casos
// =====================================================

let contadorActores = 0;
let contadorDemandados = 0;
let contadorCodemandados = 0;
let usuarioActual = null;

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(usuarioStr);
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

function sincronizarCatalogosCivil() {
    const tiposJuicio = {};

    Object.entries(catalogosDB.tiposJuicio || {}).forEach(([materia, tipos]) => {
        tiposJuicio[materia] = (tipos || []).map(tipo => ({
            ...tipo,
            subtipos: catalogosDB.subtiposJuicio[tipo.id] || []
        }));
    });

    window.catalogos = {
        delegaciones: catalogosDB.delegaciones || [],
        areas: catalogosDB.areas || {},
        tribunales: catalogosDB.tribunales || [],
        prestaciones: catalogosDB.prestaciones || [],
        tiposJuicio
    };
}

document.addEventListener('DOMContentLoaded', async function() {
    const usuario = verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;

    // Proteger ruta: consulta no puede crear
    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    try {
        await cargarCatalogos();
        sincronizarCatalogosCivil();
    } catch (err) {
        console.error('No se pudieron cargar los catalogos desde Supabase:', err);
        window.catalogos = { delegaciones: [], areas: {}, tribunales: [], prestaciones: [], tiposJuicio: {} };
    }

    configurarEventListeners(usuario);
    inicializarFormulario(usuario);
});

function inicializarFormulario(usuario) {
    llenarDelegaciones(usuario);
    llenarTribunales(usuario);
    llenarPrestaciones();
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
        // Disparar change para cargar áreas
        select.dispatchEvent(new Event('change'));
    }
}

function llenarTribunales(usuario, delegacionId) {
    const select = document.getElementById('tribunal');
    select.innerHTML = '<option value="">Seleccione...</option>';

    // Determinar por cuál delegación filtrar
    let filtroDeleg = delegacionId || null;
    if (!filtroDeleg && usuario && usuario.rol !== 'admin' && usuario.delegacion_id) {
        filtroDeleg = usuario.delegacion_id;
    }

    const tribunalesFiltrados = filtroDeleg
        ? catalogos.tribunales.filter(t => t.delegacion_id === parseInt(filtroDeleg))
        : catalogos.tribunales;

    tribunalesFiltrados.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.nombre;
        select.appendChild(option);
    });
}

function llenarPrestaciones() {
    // Llenar select de prestación principal
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
        tag.innerHTML = `${prest.nombre} <span class="multiselect-tag-remove" onclick="event.stopPropagation(); quitarPrestacion(${prest.id})">✕</span>`;
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

// Determina si un subtipo es visible según la jurisdicción seleccionada
function subtipoVisibleParaJurisdiccion(st, jurisdiccion) {
    if (!jurisdiccion) return true; // Sin jurisdicción seleccionada, mostrar todos

    // Si el subtipo tiene jurisdicción directa
    if (st.jurisdiccion) {
        return st.jurisdiccion === 'AMBAS' || st.jurisdiccion === jurisdiccion;
    }

    // Si tiene sub-subtipos, mostrar si al menos uno aplica a la jurisdicción
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

        // Actualizar tribunales según la delegación seleccionada
        llenarTribunales(usuario, delegacionId);
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

    // Cambio de tipo de juicio actualiza subtipos (filtrados por jurisdicción)
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const tipo = this.value;
        const selectSubtipo = document.getElementById('subtipoJuicio');
        selectSubtipo.innerHTML = '<option value="">Seleccione...</option>';

        // Obtener jurisdicción seleccionada
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

            // AMPARO INDIRECTO: siempre Federal, auto-seleccionar único subtipo
            if (tipo === 'AMPARO INDIRECTO') {
                // Forzar jurisdicción Federal
                const radioFederal = document.getElementById('federal');
                if (radioFederal) {
                    radioFederal.checked = true;
                    radioFederal.dispatchEvent(new Event('change'));
                }
                // Auto-seleccionar el único subtipo
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
        } else {
            selectSubtipo.disabled = true;
            const grupoSubtipo = document.getElementById('grupoSubtipo');
            if (grupoSubtipo) grupoSubtipo.style.display = '';
        }

        document.getElementById('grupSubsubtipo').style.display = 'none';
    });

    // Cambio de subtipo puede mostrar sub-subtipos
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const subtipos = selectedOption ? JSON.parse(selectedOption.dataset.subtipos || '[]') : [];

        // Obtener jurisdiccion seleccionada
        const jurisdiccionRadio = document.querySelector('input[name="jurisdiccion"]:checked');
        const jurisdiccion = jurisdiccionRadio ? jurisdiccionRadio.value : '';

        // Filtrar sub-subtipos según jurisdicción seleccionada
        const subtiposFiltrados = subtipos.filter(ss => {
            if (!jurisdiccion || !ss.jurisdiccion) return true;
            return ss.jurisdiccion === 'AMBAS' || ss.jurisdiccion === jurisdiccion;
        });

        const grupoSubsub = document.getElementById('grupSubsubtipo');
        const selectSubsub = document.getElementById('subsubtipoJuicio');

        if (subtiposFiltrados.length > 0) {
            grupoSubsub.style.display = 'block';
            selectSubsub.innerHTML = '<option value="">Ninguno</option>';
            subtiposFiltrados.forEach(ss => {
                const option = document.createElement('option');
                option.value = ss.id;
                option.textContent = ss.nombre;
                selectSubsub.appendChild(option);
            });
        } else {
            grupoSubsub.style.display = 'none';
            selectSubsub.value = '';
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

    if (!validarCasoSupabase(caso)) {
        return;
    }

    try {
        const casoGuardado = await guardarCasoCivil(caso);
        const casos = JSON.parse(localStorage.getItem('casos') || '[]');
        casos.unshift({ ...caso, ...casoGuardado, seguimiento: {} });
        localStorage.setItem('casos', JSON.stringify(casos));
        alert('Asunto guardado exitosamente');
        window.location.href = 'casos.html';
    } catch (err) {
        console.error('Error al guardar asunto civil:', err);
        alert('No se pudo guardar el asunto: ' + err.message);
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

    // Prestación principal (single select)
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
        tribunal_id: parseInt(document.getElementById('tribunal').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actor: actores[0] || null,
        demandados: demandados,
        codemandados: codemandados,
        prestacion_principal: prestacionPrincipal,
        prestaciones_secundarias: prestacionesSecundarias,
        prestaciones_notas: (document.getElementById('prestacionesNotas').value || '').toUpperCase() || null,
        importe_demandado: importeDemandado,
        abogado_responsable: (document.getElementById('abogadoResponsable').value || '').toUpperCase() || null,
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
        alert('Debe seleccionar una prestación principal');
        return false;
    }

    return true;
}
function validarCasoSupabase(caso) {
    if (!caso.delegacion_id || !caso.area_generadora_id || !caso.tribunal_id || !caso.fecha_inicio) {
        alert('Completa todos los campos obligatorios');
        return false;
    }

    if (!caso.numero_expediente) {
        alert('Debe capturar el numero de expediente');
        return false;
    }

    if (caso.imss_es !== 'ACTOR' && !caso.actor) {
        alert('Debe capturar al menos un actor');
        return false;
    }

    if (caso.imss_es !== 'DEMANDADO' && (!caso.demandados || caso.demandados.length === 0)) {
        alert('Debe capturar al menos un demandado');
        return false;
    }

    if (!caso.prestacion_principal) {
        alert('Debe seleccionar una prestacion principal');
        return false;
    }

    return true;
}
