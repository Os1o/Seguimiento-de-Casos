// =====================================================
// EDITAR-CASO.JS - Edicion de casos
// =====================================================

let casoActual = null;
let contadorActores = 0;
let contadorDemandados = 0;
let contadorCodemandados = 0;

// =====================================================
// INICIALIZACION
// =====================================================
let usuarioActualEdit = null;

document.addEventListener('DOMContentLoaded', function() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    usuarioActualEdit = usuario;

    // Proteger ruta: consulta no puede editar
    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        alert('No se especificó un asunto para editar');
        window.location.href = 'casos.html';
        return;
    }

    cargarCaso(casoId);
    inicializarFormulario(usuario);
    configurarEventListeners(usuario);
});

// =====================================================
// CARGAR CASO
// =====================================================
function cargarCaso(casoId) {
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert('Asunto no encontrado');
        window.location.href = 'casos.html';
        return;
    }

    setTimeout(() => {
        llenarFormulario();
    }, 200);
}

// =====================================================
// INICIALIZAR FORMULARIO
// =====================================================
function inicializarFormulario(usuario) {
    llenarDelegaciones(usuario);
    llenarTribunales(usuario);
    llenarPrestaciones();
}

function llenarDelegaciones(usuario) {
    const select = document.getElementById('delegacion');
    select.innerHTML = '<option value="">Seleccione...</option>';
    catalogos.delegaciones.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = d.nombre;
        select.appendChild(option);
    });

    // Si no es admin, bloquear OOAD
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
    const container = document.getElementById('prestacionesCheckboxes');
    container.innerHTML = '';
    catalogos.prestaciones.forEach(p => {
        const div = document.createElement('div');
        div.className = 'form-checkbox';
        div.innerHTML = `
            <input type="checkbox" id="prestacion_${p.id}" name="prestaciones" value="${p.id}">
            <label for="prestacion_${p.id}">${p.nombre}</label>
        `;
        container.appendChild(div);
    });
}

// =====================================================
// LLENAR FORMULARIO CON DATOS DEL CASO
// =====================================================
function llenarFormulario() {
    if (!casoActual) return;

    // 1. DELEGACION Y AREA
    document.getElementById('delegacion').value = casoActual.delegacion_id;
    cargarAreas(casoActual.delegacion_id, () => {
        document.getElementById('area').value = casoActual.area_generadora_id;
    });

    // 2. JURISDICCION
    const radioJur = document.querySelector(`input[name="jurisdiccion"][value="${casoActual.jurisdiccion}"]`);
    if (radioJur) {
        radioJur.checked = true;
        mostrarCamposJurisdiccion(casoActual.jurisdiccion);
    }

    // 3. NUMERO DE EXPEDIENTE
    if (casoActual.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoActual.numero_juicio_local || casoActual.numero_expediente;
    } else {
        document.getElementById('numeroFederal').value = casoActual.numero_juicio || '';
        document.getElementById('anoFederal').value = casoActual.ano || casoActual['año'] || '';
    }

    // 4. TIPO Y SUBTIPO DE JUICIO (habilitar porque ya tiene jurisdicción)
    const tipoSelect = document.getElementById('tipoJuicio');
    tipoSelect.disabled = false;
    tipoSelect.options[0].textContent = 'Seleccione...';
    tipoSelect.value = casoActual.tipo_juicio;
    cargarSubtipos(casoActual.tipo_juicio, casoActual.jurisdiccion);

    // Ocultar subtipo si es Amparo Indirecto
    if (casoActual.tipo_juicio === 'AMPARO INDIRECTO') {
        const grupoSubtipo = document.getElementById('grupoSubtipo');
        if (grupoSubtipo) grupoSubtipo.style.display = 'none';
    }

    setTimeout(() => {
        const selectSub = document.getElementById('subtipoJuicio');
        for (let i = 0; i < selectSub.options.length; i++) {
            if (selectSub.options[i].text === casoActual.subtipo_juicio) {
                selectSub.value = selectSub.options[i].value;
                break;
            }
        }

        if (casoActual.sub_subtipo_juicio) {
            cargarSubsubtipos(selectSub.value);
            setTimeout(() => {
                const selectSubsub = document.getElementById('subsubtipoJuicio');
                for (let i = 0; i < selectSubsub.options.length; i++) {
                    if (selectSubsub.options[i].text === casoActual.sub_subtipo_juicio) {
                        selectSubsub.value = selectSubsub.options[i].value;
                        break;
                    }
                }
            }, 50);
        }
    }, 100);

    // 5. TRIBUNAL Y FECHA
    document.getElementById('tribunal').value = casoActual.tribunal_id;

    let fechaInicio = casoActual.fecha_inicio;
    if (fechaInicio.includes('T')) {
        fechaInicio = fechaInicio.split('T')[0];
    }
    document.getElementById('fechaInicio').value = fechaInicio;

    // 6. IMSS ES
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoActual.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        mostrarSeccionesSegunIMSS(casoActual.imss_es);
    }

    // 7. ACTORES (compatibilidad: actor objeto -> actores array)
    const actores = obtenerActoresDelCaso();
    if (casoActual.imss_es !== 'ACTOR' && actores.length > 0) {
        actores.forEach(act => {
            agregarActor();
            const id = `actor_${contadorActores}`;

            const radio = document.querySelector(`input[name="${id}_tipo"][value="${act.tipo_persona}"]`);
            if (radio) {
                radio.checked = true;
                mostrarCamposPersona(id, act.tipo_persona);

                if (act.tipo_persona === 'FISICA') {
                    document.getElementById(`${id}_nombres`).value = act.nombres || '';
                    document.getElementById(`${id}_paterno`).value = act.apellido_paterno || '';
                    document.getElementById(`${id}_materno`).value = act.apellido_materno || '';
                } else {
                    document.getElementById(`${id}_empresa`).value = act.empresa || '';
                }
            }
        });
    }

    // 8. DEMANDADOS
    if (casoActual.imss_es !== 'DEMANDADO' && casoActual.demandados && casoActual.demandados.length > 0) {
        casoActual.demandados.forEach(dem => {
            agregarDemandado();
            const id = `demandado_${contadorDemandados}`;

            const radio = document.querySelector(`input[name="${id}_tipo"][value="${dem.tipo_persona}"]`);
            if (radio) {
                radio.checked = true;
                mostrarCamposPersona(id, dem.tipo_persona);

                if (dem.tipo_persona === 'FISICA') {
                    document.getElementById(`${id}_nombres`).value = dem.nombres || '';
                    document.getElementById(`${id}_paterno`).value = dem.apellido_paterno || '';
                    document.getElementById(`${id}_materno`).value = dem.apellido_materno || '';
                } else {
                    document.getElementById(`${id}_empresa`).value = dem.empresa || '';
                }
            }
        });
    }

    // 9. CODEMANDADOS
    if (casoActual.codemandados && casoActual.codemandados.length > 0) {
        casoActual.codemandados.forEach(cod => {
            agregarCodemandado();
            const id = `codemandado_${contadorCodemandados}`;

            const radio = document.querySelector(`input[name="${id}_tipo"][value="${cod.tipo_persona}"]`);
            if (radio) {
                radio.checked = true;
                mostrarCamposPersona(id, cod.tipo_persona);

                if (cod.tipo_persona === 'FISICA') {
                    document.getElementById(`${id}_nombres`).value = cod.nombres || '';
                    document.getElementById(`${id}_paterno`).value = cod.apellido_paterno || '';
                    document.getElementById(`${id}_materno`).value = cod.apellido_materno || '';
                } else {
                    document.getElementById(`${id}_empresa`).value = cod.empresa || '';
                }
            }
        });
    }

    // 10. PRESTACIONES (compatibilidad: prestacion_reclamada -> prestaciones_reclamadas)
    const prestaciones = obtenerPrestacionesDelCaso();
    prestaciones.forEach(pId => {
        const cb = document.getElementById(`prestacion_${pId}`);
        if (cb) cb.checked = true;
    });
    document.getElementById('prestacionesNotas').value = casoActual.prestaciones_notas || '';

    // 11. IMPORTE
    if (casoActual.importe_demandado === 0) {
        document.getElementById('sinCuantia').checked = true;
        document.getElementById('importeDemandado').disabled = true;
        document.getElementById('importeDemandado').placeholder = 'Sin cuantia';
    } else {
        const formateado = casoActual.importe_demandado.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        document.getElementById('importeDemandado').value = formateado;
    }

    // 12. ABOGADO Y PRONOSTICO
    document.getElementById('abogadoResponsable').value = casoActual.abogado_responsable ||
        (casoActual.seguimiento && casoActual.seguimiento.abogado_responsable) || '';
    document.getElementById('pronostico').value = casoActual.pronostico ||
        (casoActual.seguimiento && casoActual.seguimiento.pronostico) || '';
}

// Compatibilidad: obtener actores como array
function obtenerActoresDelCaso() {
    if (casoActual.actores && Array.isArray(casoActual.actores)) {
        return casoActual.actores;
    }
    if (casoActual.actor && casoActual.actor.tipo_persona) {
        return [casoActual.actor];
    }
    return [];
}

// Compatibilidad: obtener prestaciones como array
function obtenerPrestacionesDelCaso() {
    if (casoActual.prestaciones_reclamadas && Array.isArray(casoActual.prestaciones_reclamadas)) {
        return casoActual.prestaciones_reclamadas;
    }
    if (casoActual.prestacion_reclamada) {
        return [casoActual.prestacion_reclamada];
    }
    return [];
}

// =====================================================
// FUNCIONES AUXILIARES DE CARGA
// =====================================================
function cargarAreas(delegacionId, callback) {
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

        if (callback) {
            setTimeout(callback, 50);
        }
    } else {
        selectArea.disabled = true;
    }
}

// Determina si un subtipo es visible según la jurisdicción seleccionada
function subtipoVisibleParaJurisdiccion(st, jurisdiccion) {
    if (!jurisdiccion) return true;

    if (st.jurisdiccion) {
        return st.jurisdiccion === 'AMBAS' || st.jurisdiccion === jurisdiccion;
    }

    if (st.subtipos && st.subtipos.length > 0) {
        return st.subtipos.some(ss => ss.jurisdiccion === 'AMBAS' || ss.jurisdiccion === jurisdiccion);
    }

    return true;
}

function cargarSubtipos(tipoJuicio, jurisdiccion) {
    const selectSub = document.getElementById('subtipoJuicio');
    selectSub.innerHTML = '<option value="">Seleccione...</option>';

    if (tipoJuicio && catalogos.tiposJuicio[tipoJuicio]) {
        selectSub.disabled = false;
        catalogos.tiposJuicio[tipoJuicio]
            .filter(st => subtipoVisibleParaJurisdiccion(st, jurisdiccion))
            .forEach(st => {
                const option = document.createElement('option');
                option.value = st.id;
                option.textContent = st.nombre;
                option.dataset.subtipos = JSON.stringify(st.subtipos || []);
                selectSub.appendChild(option);
            });
    } else {
        selectSub.disabled = true;
    }
}

function cargarSubsubtipos(subtipoId) {
    const selectSub = document.getElementById('subtipoJuicio');
    const selectedOption = selectSub.options[selectSub.selectedIndex];

    if (!selectedOption) return;

    const subtipos = JSON.parse(selectedOption.dataset.subtipos || '[]');

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
}

function mostrarCamposJurisdiccion(jurisdiccion) {
    const esLocal = jurisdiccion === 'LOCAL';
    document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
    document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
}

function mostrarSeccionesSegunIMSS(imssEs) {
    document.getElementById('seccionActor').style.display = (imssEs !== 'ACTOR') ? 'block' : 'none';
    document.getElementById('seccionDemandados').style.display = (imssEs !== 'DEMANDADO') ? 'block' : 'none';
}

function mostrarCamposPersona(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

// =====================================================
// EVENT LISTENERS
// =====================================================
function configurarEventListeners(usuario) {
    document.getElementById('delegacion').addEventListener('change', function() {
        cargarAreas(this.value);
        // Actualizar tribunales según la delegación seleccionada
        llenarTribunales(usuario, this.value);
    });

    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarCamposJurisdiccion(this.value);

            // Habilitar tipo de juicio y re-filtrar subtipos
            const tipoSelect = document.getElementById('tipoJuicio');
            tipoSelect.disabled = false;
            tipoSelect.options[0].textContent = 'Seleccione...';
            if (tipoSelect.value) {
                cargarSubtipos(tipoSelect.value, this.value);
                document.getElementById('grupSubsubtipo').style.display = 'none';
            }
        });
    });

    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const tipo = this.value;
        const jurisdiccionRadio = document.querySelector('input[name="jurisdiccion"]:checked');
        const jurisdiccion = jurisdiccionRadio ? jurisdiccionRadio.value : '';

        cargarSubtipos(tipo, jurisdiccion);
        document.getElementById('grupSubsubtipo').style.display = 'none';

        // AMPARO INDIRECTO: siempre Federal, auto-seleccionar único subtipo
        if (tipo === 'AMPARO INDIRECTO') {
            const radioFederal = document.getElementById('federal');
            if (radioFederal) {
                radioFederal.checked = true;
                mostrarCamposJurisdiccion('FEDERAL');
            }
            // Re-cargar con jurisdicción FEDERAL
            cargarSubtipos(tipo, 'FEDERAL');
            const selectSubtipo = document.getElementById('subtipoJuicio');
            if (selectSubtipo.options.length === 2) {
                selectSubtipo.value = selectSubtipo.options[1].value;
            }
            const grupoSubtipo = document.getElementById('grupoSubtipo');
            if (grupoSubtipo) grupoSubtipo.style.display = 'none';
        } else {
            const grupoSubtipo = document.getElementById('grupoSubtipo');
            if (grupoSubtipo) grupoSubtipo.style.display = '';
        }
    });

    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        cargarSubsubtipos(this.value);
    });

    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarSeccionesSegunIMSS(this.value);
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

    // Formato de importe
    document.getElementById('importeDemandado').addEventListener('input', function() {
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

function eliminarActor(id) { document.getElementById(id).remove(); }
function cambiarTipoActor(id, tipo) { mostrarCamposPersona(id, tipo); }

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

function eliminarDemandado(id) { document.getElementById(id).remove(); }
function cambiarTipoDemandado(id, tipo) { mostrarCamposPersona(id, tipo); }

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

function eliminarCodemandado(id) { document.getElementById(id).remove(); }
function cambiarTipoCodemandado(id, tipo) { mostrarCamposPersona(id, tipo); }

// =====================================================
// GUARDAR CAMBIOS
// =====================================================
function guardarCambios(e) {
    e.preventDefault();

    const casoEditado = construirObjetoCaso();

    // Validar
    if (!casoEditado.prestaciones_reclamadas || casoEditado.prestaciones_reclamadas.length === 0) {
        alert('Debe seleccionar al menos una prestacion reclamada');
        return;
    }

    // Preservar datos inmutables
    casoEditado.id = casoActual.id;
    casoEditado.numero = casoActual.numero;
    casoEditado.fecha_creacion = casoActual.fecha_creacion;
    casoEditado.fecha_actualizacion = new Date().toISOString();
    casoEditado.seguimiento = casoActual.seguimiento || {};
    casoEditado.juicios_acumulados = casoActual.juicios_acumulados || [];
    casoEditado.acumulado_a = casoActual.acumulado_a || null;
    casoEditado.estatus = casoActual.estatus || 'TRAMITE';
    casoEditado.fecha_vencimiento = casoActual.fecha_vencimiento || null;

    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    const index = casos.findIndex(c => c.id === casoActual.id);
    if (index !== -1) {
        casos[index] = casoEditado;
        localStorage.setItem('casos', JSON.stringify(casos));
        alert('Asunto actualizado correctamente');
        window.location.href = 'casos.html';
    } else {
        alert('Error: No se encontró el asunto');
    }
}

// =====================================================
// CONSTRUIR OBJETO DEL CASO
// =====================================================
function construirObjetoCaso() {
    const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked').value;
    const esLocal = jurisdiccion === 'LOCAL';

    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = document.getElementById('numeroLocal').value;
    } else {
        const num = document.getElementById('numeroFederal').value;
        const ano = document.getElementById('anoFederal').value;
        numeroExpediente = `${num}/${ano}`;
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

    // Prestaciones (array de IDs)
    const prestacionesSeleccionadas = [];
    document.querySelectorAll('input[name="prestaciones"]:checked').forEach(cb => {
        prestacionesSeleccionadas.push(parseInt(cb.value));
    });

    // Importe
    const sinCuantia = document.getElementById('sinCuantia').checked;
    let importeDemandado = 0;
    if (!sinCuantia) {
        const valorImporte = document.getElementById('importeDemandado').value.replace(/,/g, '');
        importeDemandado = parseFloat(valorImporte) || 0;
    }

    const selectSubtipo = document.getElementById('subtipoJuicio');
    const selectSubsubtipo = document.getElementById('subsubtipoJuicio');

    const caso = {
        delegacion_id: parseInt(document.getElementById('delegacion').value),
        area_generadora_id: parseInt(document.getElementById('area').value),
        jurisdiccion: jurisdiccion,
        tipo_juicio: document.getElementById('tipoJuicio').value,
        subtipo_juicio: selectSubtipo.options[selectSubtipo.selectedIndex]?.text || '',
        sub_subtipo_juicio: selectSubsubtipo.value ? selectSubsubtipo.options[selectSubsubtipo.selectedIndex].text : null,
        numero_expediente: numeroExpediente,
        tribunal_id: parseInt(document.getElementById('tribunal').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actores: actores,
        demandados: demandados,
        codemandados: codemandados,
        prestaciones_reclamadas: prestacionesSeleccionadas,
        prestaciones_notas: document.getElementById('prestacionesNotas').value,
        importe_demandado: importeDemandado,
        abogado_responsable: document.getElementById('abogadoResponsable').value || null,
        pronostico: document.getElementById('pronostico').value || null
    };

    if (esLocal) {
        caso.numero_juicio_local = document.getElementById('numeroLocal').value;
    } else {
        caso.numero_juicio = document.getElementById('numeroFederal').value;
        caso.ano = document.getElementById('anoFederal').value;
    }

    return caso;
}

function obtenerPersonasDinamicas(prefijo) {
    const personas = [];
    const elementos = document.querySelectorAll(`[id^="${prefijo}"]`);
    const ids = new Set();

    elementos.forEach(el => {
        const parts = el.id.split('_');
        if (parts.length >= 2) {
            const id = `${parts[0]}_${parts[1]}`;
            ids.add(id);
        }
    });

    ids.forEach(id => {
        const tipoRadio = document.querySelector(`input[name="${id}_tipo"]:checked`);
        if (!tipoRadio) return;

        const tipo = tipoRadio.value;
        if (tipo === 'FISICA') {
            personas.push({
                tipo_persona: 'FISICA',
                nombres: document.getElementById(`${id}_nombres`).value,
                apellido_paterno: document.getElementById(`${id}_paterno`).value,
                apellido_materno: document.getElementById(`${id}_materno`).value
            });
        } else {
            personas.push({
                tipo_persona: 'MORAL',
                empresa: document.getElementById(`${id}_empresa`).value
            });
        }
    });

    return personas;
}

// =====================================================
// CERRAR SESION
// =====================================================
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
