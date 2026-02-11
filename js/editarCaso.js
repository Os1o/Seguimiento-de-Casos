// =====================================================
// EDITAR-CASO.JS - Edición de casos (NUEVO DESDE CERO)
// =====================================================

let casoActual = null;
let contadorDemandados = 0;
let contadorCodemandados = 0;

// =====================================================
// INICIALIZACIÓN
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    // Verificar sesión
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }
    
    const usuario = JSON.parse(usuarioStr);
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;
    
    // Obtener ID del caso desde URL
    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));
    
    if (!casoId) {
        alert('No se especificó un caso para editar');
        window.location.href = 'casos.html';
        return;
    }
    
    // Cargar caso
    cargarCaso(casoId);
    
    // Inicializar formulario
    inicializarFormulario();
    
    // Configurar event listeners
    configurarEventListeners();
});

// =====================================================
// CARGAR CASO DESDE LOCALSTORAGE
// =====================================================
function cargarCaso(casoId) {
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    
    casoActual = casos.find(c => c.id === casoId);
    
    if (!casoActual) {
        alert('Caso no encontrado');
        window.location.href = 'casos.html';
        return;
    }
    
    console.log('Caso cargado:', casoActual);
    
    // Llenar formulario después de que todo esté inicializado
    setTimeout(() => {
        llenarFormulario();
    }, 200);
}

// =====================================================
// INICIALIZAR FORMULARIO
// =====================================================
function inicializarFormulario() {
    // Llenar catálogos
    llenarDelegaciones();
    llenarTribunales();
    llenarPrestaciones();
}

function llenarDelegaciones() {
    const select = document.getElementById('delegacion');
    select.innerHTML = '<option value="">Seleccione...</option>';
    catalogos.delegaciones.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = d.nombre;
        select.appendChild(option);
    });
}

function llenarTribunales() {
    const select = document.getElementById('tribunal');
    select.innerHTML = '<option value="">Seleccione...</option>';
    catalogos.tribunales.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.nombre;
        select.appendChild(option);
    });
}

function llenarPrestaciones() {
    const select = document.getElementById('prestacionReclamada');
    select.innerHTML = '<option value="">Seleccione...</option>';
    catalogos.prestaciones.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

// =====================================================
// LLENAR FORMULARIO CON DATOS DEL CASO
// =====================================================
function llenarFormulario() {
    if (!casoActual) return;
    
    console.log('Llenando formulario...');
    
    // 1. DELEGACIÓN Y ÁREA
    document.getElementById('delegacion').value = casoActual.delegacion_id;
    cargarAreas(casoActual.delegacion_id);
    setTimeout(() => {
        document.getElementById('area').value = casoActual.area_generadora_id;
    }, 50);
    
    // 2. JURISDICCIÓN
    const radioJur = document.querySelector(`input[name="jurisdiccion"][value="${casoActual.jurisdiccion}"]`);
    if (radioJur) {
        radioJur.checked = true;
        mostrarCamposJurisdiccion(casoActual.jurisdiccion);
    }
    
    // 3. NÚMERO DE EXPEDIENTE
    if (casoActual.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoActual.numero_juicio_local || casoActual.numero_expediente;
    } else {
        document.getElementById('numeroFederal').value = casoActual.numero_juicio || '';
        document.getElementById('añoFederal').value = casoActual.año || '';
    }
    
    // 4. TIPO Y SUBTIPO DE JUICIO
    document.getElementById('tipoJuicio').value = casoActual.tipo_juicio;
    cargarSubtipos(casoActual.tipo_juicio);
    
    setTimeout(() => {
        // Buscar subtipo por texto
        const selectSub = document.getElementById('subtipoJuicio');
        for (let i = 0; i < selectSub.options.length; i++) {
            if (selectSub.options[i].text === casoActual.subtipo_juicio) {
                selectSub.value = selectSub.options[i].value;
                break;
            }
        }
        
        // Cargar sub-subtipos si existen
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
    
    // 5. ACUMULADO A
    if (casoActual.acumulado_a) {
        document.getElementById('acumuladoA').value = casoActual.acumulado_a;
    }
    
    // 6. TRIBUNAL Y FECHA
    document.getElementById('tribunal').value = casoActual.tribunal_id;
    
    // Fecha en formato correcto YYYY-MM-DD
    const fecha = casoActual.fecha_inicio.split('T')[0];
    document.getElementById('fechaInicio').value = fecha;
    
    // 7. IMSS ES
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoActual.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        mostrarSeccionesSegunIMSS(casoActual.imss_es);
    }
    
    // 8. ACTOR
    if (casoActual.imss_es !== 'ACTOR' && casoActual.actor) {
        const radioActor = document.querySelector(`input[name="actorTipo"][value="${casoActual.actor.tipo_persona}"]`);
        if (radioActor) {
            radioActor.checked = true;
            mostrarCamposActor(casoActual.actor.tipo_persona);
            
            if (casoActual.actor.tipo_persona === 'FISICA') {
                document.getElementById('actorNombres').value = casoActual.actor.nombres || '';
                document.getElementById('actorPaterno').value = casoActual.actor.apellido_paterno || '';
                document.getElementById('actorMaterno').value = casoActual.actor.apellido_materno || '';
            } else {
                document.getElementById('actorEmpresa').value = casoActual.actor.empresa || '';
            }
        }
    }
    
    // 9. DEMANDADOS
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
    
    // 10. CODEMANDADOS
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
    
    // 11. PRESTACIONES
    document.getElementById('prestacionReclamada').value = casoActual.prestacion_reclamada;
    document.getElementById('prestacionesNotas').value = casoActual.prestaciones_notas || '';
    document.getElementById('importeDemandado').value = casoActual.importe_demandado || 0;
    
    console.log('Formulario llenado completamente');
}

// =====================================================
// FUNCIONES AUXILIARES DE CARGA
// =====================================================
function cargarAreas(delegacionId) {
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
}

function cargarSubtipos(tipoJuicio) {
    const selectSub = document.getElementById('subtipoJuicio');
    selectSub.innerHTML = '<option value="">Seleccione...</option>';
    
    if (tipoJuicio && catalogos.tiposJuicio[tipoJuicio]) {
        selectSub.disabled = false;
        catalogos.tiposJuicio[tipoJuicio].forEach(st => {
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
    const grupoSubsub = document.getElementById('grupSubsubtipo');
    const selectSubsub = document.getElementById('subsubtipoJuicio');
    
    if (subtipos.length > 0) {
        grupoSubsub.style.display = 'block';
        selectSubsub.innerHTML = '<option value="">Ninguno</option>';
        subtipos.forEach(ss => {
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

function mostrarCamposActor(tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById('actorFisicaCampos').style.display = esFisica ? 'block' : 'none';
    document.getElementById('actorMoralCampos').style.display = esFisica ? 'none' : 'block';
}

function mostrarCamposPersona(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

// =====================================================
// EVENT LISTENERS
// =====================================================
function configurarEventListeners() {
    // Delegación cambia áreas
    document.getElementById('delegacion').addEventListener('change', function() {
        cargarAreas(this.value);
    });
    
    // Jurisdicción muestra campos
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarCamposJurisdiccion(this.value);
        });
    });
    
    // Tipo de juicio carga subtipos
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        cargarSubtipos(this.value);
        document.getElementById('grupSubsubtipo').style.display = 'none';
    });
    
    // Subtipo carga sub-subtipos
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        cargarSubsubtipos(this.value);
    });
    
    // IMSS es cambia secciones
    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarSeccionesSegunIMSS(this.value);
        });
    });
    
    // Actor tipo cambia campos
    document.querySelectorAll('input[name="actorTipo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            mostrarCamposActor(this.value);
        });
    });
    
    // Submit del formulario
    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCambios);
}

// =====================================================
// AGREGAR DEMANDADOS Y CODEMANDADOS
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
                        <label for="${id}_fisica">Física</label>
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
    mostrarCamposPersona(id, tipo);
}

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
                        <label for="${id}_fisica">Física</label>
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
    mostrarCamposPersona(id, tipo);
}

// =====================================================
// GUARDAR CAMBIOS
// =====================================================
function guardarCambios(e) {
    e.preventDefault();
    
    console.log('Guardando cambios...');
    
    // Construir objeto del caso
    const casoEditado = construirObjetoCaso();
    
    // Preservar datos inmutables
    casoEditado.id = casoActual.id;
    casoEditado.numero = casoActual.numero;
    casoEditado.fecha_creacion = casoActual.fecha_creacion;
    casoEditado.fecha_actualizacion = new Date().toISOString();
    casoEditado.seguimiento = casoActual.seguimiento || {};
    casoEditado.juicios_acumulados = casoActual.juicios_acumulados || [];
    
    // Guardar en localStorage
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    
    const index = casos.findIndex(c => c.id === casoActual.id);
    if (index !== -1) {
        casos[index] = casoEditado;
        localStorage.setItem('casos', JSON.stringify(casos));
        
        console.log('Caso guardado:', casoEditado);
        alert('✅ Caso actualizado correctamente');
        window.location.href = 'casos.html';
    } else {
        alert('❌ Error: No se encontró el caso');
    }
}

// =====================================================
// CONSTRUIR OBJETO DEL CASO
// =====================================================
function construirObjetoCaso() {
    const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked').value;
    const esLocal = jurisdiccion === 'LOCAL';
    
    // Número de expediente
    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = document.getElementById('numeroLocal').value;
    } else {
        const num = document.getElementById('numeroFederal').value;
        const año = document.getElementById('añoFederal').value;
        numeroExpediente = `${num}/${año}`;
    }
    
    // IMSS es
    const imssEs = document.querySelector('input[name="imssEs"]:checked').value;
    
    // Actor
    let actor = null;
    if (imssEs !== 'ACTOR') {
        const actorTipo = document.querySelector('input[name="actorTipo"]:checked')?.value;
        if (actorTipo === 'FISICA') {
            actor = {
                tipo_persona: 'FISICA',
                nombres: document.getElementById('actorNombres').value,
                apellido_paterno: document.getElementById('actorPaterno').value,
                apellido_materno: document.getElementById('actorMaterno').value
            };
        } else if (actorTipo === 'MORAL') {
            actor = {
                tipo_persona: 'MORAL',
                empresa: document.getElementById('actorEmpresa').value
            };
        }
    }
    
    // Demandados
    let demandados = [];
    if (imssEs !== 'DEMANDADO') {
        demandados = obtenerPersonasDinamicas('demandado_');
    }
    
    // Codemandados
    const codemandados = obtenerPersonasDinamicas('codemandado_');
    
    // Subtipo y sub-subtipo
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
        acumulado_a: document.getElementById('acumuladoA').value ? parseInt(document.getElementById('acumuladoA').value) : null,
        tribunal_id: parseInt(document.getElementById('tribunal').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actor: actor,
        demandados: demandados,
        codemandados: codemandados,
        prestacion_reclamada: parseInt(document.getElementById('prestacionReclamada').value),
        prestaciones_notas: document.getElementById('prestacionesNotas').value,
        importe_demandado: parseFloat(document.getElementById('importeDemandado').value) || 0,
        estatus: document.getElementById('acumuladoA').value ? 'CONCLUIDO' : 'TRAMITE'
    };
    
    // Campos específicos según jurisdicción
    if (esLocal) {
        caso.numero_juicio_local = document.getElementById('numeroLocal').value;
    } else {
        caso.numero_juicio = document.getElementById('numeroFederal').value;
        caso.año = document.getElementById('añoFederal').value;
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
// FUNCIÓN CERRAR SESIÓN
// =====================================================
function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}