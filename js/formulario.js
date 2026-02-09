// =====================================================
// FORMULARIO.JS - Lógica completa (Creación y Edición)
// =====================================================

let contadorDemandados = 0;
let contadorCodemandados = 0;
let casoEditando = null; // Variable global para saber si editamos

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

document.addEventListener('DOMContentLoaded', function() {
    const usuario = verificarSesion();
    if (!usuario) return;
    
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;
    
    inicializarFormulario();
    configurarEventListeners();
    
    // DETECTAR MODO EDICIÓN
    const urlParams = new URLSearchParams(window.location.search);
    const casoId = urlParams.get('id'); // Buscamos ?id=123 en la URL
    
    if (casoId) {
        cargarDatosEdicion(parseInt(casoId));
    }
});

// ==========================================
// FUNCIÓN PRINCIPAL DE CARGA DE EDICIÓN
// ==========================================
function cargarDatosEdicion(id) {
    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : (typeof casosFake !== 'undefined' ? casosFake : []);
    casoEditando = casos.find(c => c.id === id);

    if (!casoEditando) {
        alert("Caso no encontrado");
        window.location.href = 'casos.html';
        return;
    }

    // Cambiar textos visuales
    document.querySelector('.page-title').textContent = `Editar Caso #${casoEditando.numero_expediente || id}`;
    document.querySelector('.btn-success').textContent = "Actualizar Caso";

    // 1. Delegación y Área
    document.getElementById('delegacion').value = casoEditando.delegacion_id;
    // Disparamos evento manual para llenar el select de Áreas
    document.getElementById('delegacion').dispatchEvent(new Event('change'));
    document.getElementById('area').value = casoEditando.area_generadora_id;

    // 2. Jurisdicción
    const radioJurisdiccion = document.querySelector(`input[name="jurisdiccion"][value="${casoEditando.jurisdiccion}"]`);
    if (radioJurisdiccion) {
        radioJurisdiccion.checked = true;
        radioJurisdiccion.dispatchEvent(new Event('change'));
    }

    // Llenar inputs de expediente
    if (casoEditando.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoEditando.numero_juicio_local || casoEditando.numero_expediente;
    } else {
        document.getElementById('numeroFederal').value = casoEditando.numero_juicio;
        document.getElementById('añoFederal').value = casoEditando.año;
    }

    // 3. Tipo de Juicio (Cascada)
    document.getElementById('tipoJuicio').value = casoEditando.tipo_juicio;
    document.getElementById('tipoJuicio').dispatchEvent(new Event('change')); // Carga subtipos

    // Seleccionar Subtipo por Texto
    const selectSubtipo = document.getElementById('subtipoJuicio');
    if (casoEditando.subtipo_juicio) {
        Array.from(selectSubtipo.options).forEach(opt => {
            if (opt.text === casoEditando.subtipo_juicio) selectSubtipo.value = opt.value;
        });
        selectSubtipo.dispatchEvent(new Event('change')); // Carga sub-subtipos
    }

    // 4. Posición IMSS
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoEditando.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        actualizarSeccionesPersonas(); // Función extraída abajo
    }

    // 5. ACTOR (Aquí estaba el error)
    if (casoEditando.imss_es !== 'ACTOR' && casoEditando.actor) {
        // Usamos el name correcto: actorTipo
        const radioActor = document.querySelector(`input[name="actorTipo"][value="${casoEditando.actor.tipo_persona}"]`);
        if (radioActor) {
            radioActor.checked = true;
            actualizarCamposActor(); // Llamada a la función corregida

            if (casoEditando.actor.tipo_persona === 'FISICA') {
                document.getElementById('actorNombres').value = casoEditando.actor.nombres || '';
                document.getElementById('actorPaterno').value = casoEditando.actor.apellido_paterno || '';
                document.getElementById('actorMaterno').value = casoEditando.actor.apellido_materno || '';
            } else {
                document.getElementById('actorEmpresa').value = casoEditando.actor.empresa || '';
            }
        }
    }

    // 6. DEMANDADOS
    if (casoEditando.imss_es !== 'DEMANDADO' && casoEditando.demandados) {
        document.getElementById('listaDemandados').innerHTML = '';
        contadorDemandados = 0;
        
        casoEditando.demandados.forEach(dem => {
            agregarDemandado(); // Crea el HTML al instante
            const id = `demandado_${contadorDemandados}`;
            
            const radioTipo = document.querySelector(`input[name="${id}_tipo"][value="${dem.tipo_persona}"]`);
            if (radioTipo) {
                radioTipo.checked = true;
                cambiarTipoDemandado(id, dem.tipo_persona);
                
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

    // 7. Prestaciones y montos
    document.getElementById('prestacionReclamada').value = casoEditando.prestacion_reclamada;
    document.getElementById('prestacionesNotas').value = casoEditando.prestaciones_notas || '';
    document.getElementById('importeDemandado').value = casoEditando.importe_demandado || 0;
    document.getElementById('fechaInicio').value = casoEditando.fecha_inicio;
}

// ==========================================
// FUNCIONES AUXILIARES (Refactorizadas)
// ==========================================

function actualizarCamposActor() {
    // CORRECCIÓN: Usamos 'actorTipo' que es el name real en el HTML
    const tipoSeleccionado = document.querySelector('input[name="actorTipo"]:checked')?.value;
    
    const seccionFisica = document.getElementById('actorFisicaCampos');
    const seccionMoral = document.getElementById('actorMoralCampos');
    
    if (tipoSeleccionado === 'FISICA') {
        seccionFisica.style.display = 'block';
        seccionMoral.style.display = 'none';
    } else if (tipoSeleccionado === 'MORAL') {
        seccionFisica.style.display = 'none';
        seccionMoral.style.display = 'block';
    } else {
        seccionFisica.style.display = 'none';
        seccionMoral.style.display = 'none';
    }
}

function actualizarSeccionesPersonas() {
    const valor = document.querySelector('input[name="imssEs"]:checked')?.value;
    if (!valor) return;

    const seccionActor = document.getElementById('seccionActor');
    seccionActor.style.display = (valor !== 'ACTOR') ? 'block' : 'none';
    
    const seccionDemandados = document.getElementById('seccionDemandados');
    seccionDemandados.style.display = (valor !== 'DEMANDADO') ? 'block' : 'none';
}

function inicializarFormulario() {
    llenarDelegaciones();
    llenarTribunales();
    llenarPrestaciones();
    cargarCasosParaAcumular();
}

function configurarEventListeners() {
    // Delegación -> Área
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
    });

    // Jurisdicción
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const esLocal = this.value === 'LOCAL';
            document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
            document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
        });
    });

    // Validaciones números
    document.getElementById('numeroFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
    document.getElementById('añoFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    // Tipo Juicio -> Subtipos
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const tipo = this.value;
        const selectSubtipo = document.getElementById('subtipoJuicio');
        selectSubtipo.innerHTML = '<option value="">Seleccione...</option>';
        if (tipo && catalogos.tiposJuicio[tipo]) {
            selectSubtipo.disabled = false;
            catalogos.tiposJuicio[tipo].forEach(st => {
                const option = document.createElement('option');
                option.value = st.id;
                option.textContent = st.nombre;
                option.dataset.subtipos = JSON.stringify(st.subtipos || []);
                selectSubtipo.appendChild(option);
            });
        } else {
            selectSubtipo.disabled = true;
        }
        document.getElementById('grupSubsubtipo').style.display = 'none';
        actualizarCasosAcumulables();
    });

    // Subtipo -> Sub-subtipos
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const subtipos = selectedOption ? JSON.parse(selectedOption.dataset.subtipos || '[]') : [];
        const grupoSubsub = document.getElementById('grupSubsubtipo');
        const selectSubsub = document.getElementById('subsubtipoJuicio');
        if (subtipos.length > 0) {
            grupoSubsub.style.display = 'block';
            selectSubsub.innerHTML = '<option value="">Ninguno</option>';
            subtipos.forEach(ss => {
                const opt = document.createElement('option');
                opt.value = ss.id;
                opt.textContent = ss.nombre;
                selectSubsub.appendChild(opt);
            });
        } else {
            grupoSubsub.style.display = 'none';
        }
    });

    // IMSS Es -> Mostrar/Ocultar Secciones
    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', actualizarSeccionesPersonas);
    });

    // Actor Tipo -> Mostrar/Ocultar Campos
    document.querySelectorAll('input[name="actorTipo"]').forEach(radio => {
        radio.addEventListener('change', actualizarCamposActor);
    });

    // Submit
    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCaso);
}

// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================
function guardarCaso(e) {
    e.preventDefault();
    const caso = construirObjetoCaso();
    if (!validarCaso(caso)) return;

    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : [];

    if (casoEditando) {
        // ACTUALIZAR
        const index = casos.findIndex(c => c.id === casoEditando.id);
        if (index !== -1) {
            caso.id = casoEditando.id; // Mantener ID original
            caso.numero = casoEditando.numero;
            caso.fecha_creacion = casoEditando.fecha_creacion;
            casos[index] = caso;
            alert('✅ Caso actualizado correctamente');
        }
    } else {
        // CREAR NUEVO
        caso.id = casos.length > 0 ? Math.max(...casos.map(c => c.id)) + 1 : 1;
        caso.numero = casos.length + 1;
        caso.fecha_creacion = new Date().toISOString();
        casos.push(caso);
        alert('✅ Caso creado exitosamente');
    }

    localStorage.setItem('casos', JSON.stringify(casos));
    window.location.href = 'casos.html';
}

// ... (Las funciones construirObjetoCaso, llenarDelegaciones, etc. se mantienen igual, 
// solo asegúrate de copiar también las funciones agregarDemandado, cambiarTipoDemandado del archivo anterior si faltan)

// Asegúrate de incluir estas funciones al final si no las tienes:
function agregarDemandado() {
    contadorDemandados++;
    const id = `demandado_${contadorDemandados}`;
    // ... (Tu código HTML de demandado aquí) ...
    // NOTA: Usa el mismo HTML que tenías, es correcto.
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
                    <div class="form-group"><label class="form-label">Nombres</label><input type="text" id="${id}_nombres" class="form-input"></div>
                    <div class="form-group"><label class="form-label">A. Paterno</label><input type="text" id="${id}_paterno" class="form-input"></div>
                    <div class="form-group"><label class="form-label">A. Materno</label><input type="text" id="${id}_materno" class="form-input"></div>
                </div>
            </div>
            <div id="${id}_moral_campos" style="display: none;">
                <div class="form-group"><label class="form-label">Empresa</label><input type="text" id="${id}_empresa" class="form-input"></div>
            </div>
        </div>`;
    document.getElementById('listaDemandados').insertAdjacentHTML('beforeend', html);
}

function eliminarDemandado(id) { document.getElementById(id).remove(); }
function cambiarTipoDemandado(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

function agregarCodemandado() {
    // Misma lógica que demandado pero con contadorCodemandados
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
                    <div class="form-group"><label class="form-label">Nombres</label><input type="text" id="${id}_nombres" class="form-input"></div>
                    <div class="form-group"><label class="form-label">A. Paterno</label><input type="text" id="${id}_paterno" class="form-input"></div>
                    <div class="form-group"><label class="form-label">A. Materno</label><input type="text" id="${id}_materno" class="form-input"></div>
                </div>
            </div>
            <div id="${id}_moral_campos" style="display: none;">
                <div class="form-group"><label class="form-label">Empresa</label><input type="text" id="${id}_empresa" class="form-input"></div>
            </div>
        </div>`;
    document.getElementById('listaCodemandados').insertAdjacentHTML('beforeend', html);
}
function eliminarCodemandado(id) { document.getElementById(id).remove(); }
function cambiarTipoCodemandado(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

function construirObjetoCaso() {
    // Copia tu función construirObjetoCaso existente aquí tal cual estaba
    // ...
    const jurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked').value;
    const esLocal = jurisdiccion === 'LOCAL';
    
    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = document.getElementById('numeroLocal').value;
    } else {
        const num = document.getElementById('numeroFederal').value;
        const año = document.getElementById('añoFederal').value;
        numeroExpediente = `${num}/${año}`;
    }
    
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
    
    // Prestación (solo una)
    const prestacionId = parseInt(document.getElementById('prestacionReclamada').value);
    
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
        acumulado_a: document.getElementById('acumuladoA').value ? parseInt(document.getElementById('acumuladoA').value) : null,
        tribunal_id: parseInt(document.getElementById('tribunal').value),
        fecha_inicio: document.getElementById('fechaInicio').value,
        imss_es: imssEs,
        actor: actor,
        demandados: demandados,
        codemandados: codemandados,
        prestacion_reclamada: prestacionId,
        prestaciones_notas: document.getElementById('prestacionesNotas').value,
        importe_demandado: parseFloat(document.getElementById('importeDemandado').value) || 0,
        estatus: document.getElementById('acumuladoA').value ? 'CONCLUIDO' : 'TRAMITE',
        juicios_acumulados: []
    };
    
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

function validarCaso(caso) {
    if (!caso.prestacion_reclamada) {
        alert('Debe seleccionar una prestación reclamada');
        return false;
    }
    return true;
}
function llenarDelegaciones() { /* ... tu código ... */ const select = document.getElementById('delegacion'); catalogos.delegaciones.forEach(d => { const option = document.createElement('option'); option.value = d.id; option.textContent = d.nombre; select.appendChild(option); }); }
function llenarTribunales() { /* ... tu código ... */ const select = document.getElementById('tribunal'); catalogos.tribunales.forEach(t => { const option = document.createElement('option'); option.value = t.id; option.textContent = t.nombre; select.appendChild(option); }); }
function llenarPrestaciones() { /* ... tu código ... */ const select = document.getElementById('prestacionReclamada'); catalogos.prestaciones.forEach(p => { const option = document.createElement('option'); option.value = p.id; option.textContent = p.nombre; select.appendChild(option); }); }
function cargarCasosParaAcumular() { actualizarCasosAcumulables(); }
function actualizarCasosAcumulables() { /* ... tu código ... */ const select = document.getElementById('acumuladoA'); const tipoJuicioActual = document.getElementById('tipoJuicio').value; select.innerHTML = '<option value="">No está acumulado</option>'; const casosStr = localStorage.getItem('casos'); if (!casosStr) return; const casos = JSON.parse(casosStr); casos.filter(c => { const cumpleEstatus = c.estatus === 'TRAMITE' && !c.acumulado_a; const cumpleMateria = !tipoJuicioActual || c.tipo_juicio === tipoJuicioActual; return cumpleEstatus && cumpleMateria; }).sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio)).forEach(c => { const option = document.createElement('option'); option.value = c.id; option.textContent = `${c.numero_expediente} - ${c.tipo_juicio} - ${formatearFecha(c.fecha_inicio)}`; select.appendChild(option); }); }