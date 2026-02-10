// =====================================================
// EDITAR-CASO.JS - Módulo de edición de expedientes
// =====================================================

let contadorDemandados = 0;
let contadorCodemandados = 0;
let casoId = null;
let casoActual = null;

document.addEventListener('DOMContentLoaded', function() {
    // 1. Validación de sesión activa
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }
    document.getElementById('nombreUsuario').textContent = JSON.parse(usuarioStr).nombre_completo;

    // 2. Recuperar ID del caso desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        alert("No se especificó un caso para editar");
        window.location.href = 'casos.html';
        return;
    }

    // 3. Inicialización de componentes
    inicializarCatalogos();
    configurarEventListeners();

    // 4. Carga de información del registro
    cargarDatosDelCaso();
});

function inicializarCatalogos() {
    // Precarga de selectores principales desde el catálogo
    llenarSelect('delegacion', catalogos.delegaciones);
    llenarSelect('tribunal', catalogos.tribunales);
    llenarSelect('prestacionReclamada', catalogos.prestaciones);
}

function llenarSelect(id, datos) {
    const select = document.getElementById(id);
    datos.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nombre;
        select.appendChild(option);
    });
}

function cargarDatosDelCaso() {
    // Buscamos el registro en storage o datos fake
    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : (typeof casosFake !== 'undefined' ? casosFake : []);
    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert("Caso no encontrado");
        window.location.href = 'casos.html';
        return;
    }

    // --- MAPEO DE DATOS AL FORMULARIO ---

    // 1. Delegación y Área Generadora
    document.getElementById('delegacion').value = casoActual.delegacion_id;
    // Forzamos el evento change para actualizar el combo dependiente de Áreas
    document.getElementById('delegacion').dispatchEvent(new Event('change'));
    document.getElementById('area').value = casoActual.area_generadora_id;

    // 2. Jurisdicción y tipo de expediente
    const radioJur = document.querySelector(`input[name="jurisdiccion"][value="${casoActual.jurisdiccion}"]`);
    if (radioJur) {
        radioJur.checked = true;
        radioJur.dispatchEvent(new Event('change')); // Actualiza visibilidad de campos
    }

    if (casoActual.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoActual.numero_juicio_local || casoActual.numero_expediente;
    } else {
        document.getElementById('numeroFederal').value = casoActual.numero_juicio;
        document.getElementById('añoFederal').value = casoActual.año;
    }

    // 3. Clasificación del Juicio
    document.getElementById('tipoJuicio').value = casoActual.tipo_juicio;
    document.getElementById('tipoJuicio').dispatchEvent(new Event('change')); // Carga lista de subtipos

    // Selección de subtipo (Búsqueda por coincidencia de texto)
    const selectSub = document.getElementById('subtipoJuicio');
    if (casoActual.subtipo_juicio) {
        Array.from(selectSub.options).forEach(opt => {
            if (opt.text === casoActual.subtipo_juicio) selectSub.value = opt.value;
        });
        selectSub.dispatchEvent(new Event('change')); // Carga sub-subtipos si aplica
    }

    // 4. Rol del IMSS
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoActual.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        radioImss.dispatchEvent(new Event('change')); // Configura secciones visibles
    }

    // 5. Carga de datos del Actor
    if (casoActual.imss_es !== 'ACTOR' && casoActual.actor) {
        const radioActor = document.querySelector(`input[name="actorTipo"][value="${casoActual.actor.tipo_persona}"]`);
        if (radioActor) {
            radioActor.checked = true;
            radioActor.dispatchEvent(new Event('change'));

            if (casoActual.actor.tipo_persona === 'FISICA') {
                document.getElementById('actorNombres').value = casoActual.actor.nombres || '';
                document.getElementById('actorPaterno').value = casoActual.actor.apellido_paterno || '';
                document.getElementById('actorMaterno').value = casoActual.actor.apellido_materno || '';
            } else {
                document.getElementById('actorEmpresa').value = casoActual.actor.empresa || '';
            }
        }
    }

    // 6. Reconstrucción dinámica de Demandados
    document.getElementById('listaDemandados').innerHTML = '';
    if (casoActual.imss_es !== 'DEMANDADO' && casoActual.demandados) {
        casoActual.demandados.forEach(dem => {
            agregarDemandado(); // Genera el HTML del campo
            const id = `demandado_${contadorDemandados}`;
            
            const radio = document.querySelector(`input[name="${id}_tipo"][value="${dem.tipo_persona}"]`);
            if (radio) {
                radio.checked = true;
                togglePersonaCampos(id, dem.tipo_persona === 'FISICA');

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

    // 7. Reconstrucción dinámica de Codemandados
    document.getElementById('listaCodemandados').innerHTML = '';
    if (casoActual.codemandados) {
        casoActual.codemandados.forEach(cod => {
            agregarCodemandado();
            const id = `codemandado_${contadorCodemandados}`;
            
            const radio = document.querySelector(`input[name="${id}_tipo"][value="${cod.tipo_persona}"]`);
            if (radio) {
                radio.checked = true;
                togglePersonaCampos(id, cod.tipo_persona === 'FISICA');

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

    // 8. Datos generales del proceso
    document.getElementById('tribunal').value = casoActual.tribunal_id;
    document.getElementById('fechaInicio').value = casoActual.fecha_inicio;
    document.getElementById('prestacionReclamada').value = casoActual.prestacion_reclamada;
    document.getElementById('prestacionesNotas').value = casoActual.prestaciones_notas || '';
    document.getElementById('importeDemandado').value = casoActual.importe_demandado || 0;
    
    // Configuración de acumulaciones
    actualizarCasosAcumulables();
    if (casoActual.acumulado_a) {
        document.getElementById('acumuladoA').value = casoActual.acumulado_a;
    }
}

function guardarCambios(e) {
    e.preventDefault();

    const casoEditado = construirObjetoCaso();
    
    // Preservar metadatos inmutables del registro
    casoEditado.id = casoActual.id;
    casoEditado.numero = casoActual.numero;
    casoEditado.fecha_creacion = casoActual.fecha_creacion;
    
    // Preservar relaciones padre-hijo existentes
    if (casoActual.juicios_acumulados && casoActual.juicios_acumulados.length > 0) {
        casoEditado.juicios_acumulados = casoActual.juicios_acumulados;
    } else {
        casoEditado.juicios_acumulados = [];
    }
    
    // Mantener historial de seguimiento
    casoEditado.seguimiento = casoActual.seguimiento;

    // Actualización en persistencia
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    
    const index = casos.findIndex(c => c.id === casoId);
    if (index !== -1) {
        casos[index] = casoEditado;
        localStorage.setItem('casos', JSON.stringify(casos));
        alert("✅ Caso actualizado correctamente");
        window.location.href = 'casos.html';
    } else {
        alert("Error: No se pudo encontrar el caso original para sobrescribir.");
    }
}

// ==========================================
// MÉTODOS AUXILIARES Y LISTENERS
// ==========================================

function configurarEventListeners() {
    // Vinculación del submit al proceso de actualización
    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCambios);
    
    // Cascada Delegación -> Áreas
    document.getElementById('delegacion').addEventListener('change', function() {
        const id = this.value;
        const select = document.getElementById('area');
        select.innerHTML = '<option value="">Seleccione...</option>';
        if (id && catalogos.areas[id]) {
            select.disabled = false;
            catalogos.areas[id].forEach(a => {
                const opt = document.createElement('option');
                opt.value = a.id;
                opt.textContent = a.nombre;
                select.appendChild(opt);
            });
        }
    });

    // Cascada Tipo Juicio -> Subtipos
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const id = this.value;
        const select = document.getElementById('subtipoJuicio');
        select.innerHTML = '<option value="">Seleccione...</option>';
        if (id && catalogos.tiposJuicio[id]) {
            select.disabled = false;
            catalogos.tiposJuicio[id].forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.id;
                opt.textContent = t.nombre;
                opt.dataset.subtipos = JSON.stringify(t.subtipos || []);
                select.appendChild(opt);
            });
        }
        actualizarCasosAcumulables();
    });
    
    // Control visual por Jurisdicción
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(r => {
        r.addEventListener('change', function() {
            const esLocal = this.value === 'LOCAL';
            document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
            document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
        });
    });

    // Control visual por Rol del IMSS
    document.querySelectorAll('input[name="imssEs"]').forEach(r => {
        r.addEventListener('change', function() {
            const val = this.value;
            document.getElementById('seccionActor').style.display = (val !== 'ACTOR') ? 'block' : 'none';
            document.getElementById('seccionDemandados').style.display = (val !== 'DEMANDADO') ? 'block' : 'none';
        });
    });

    // Control visual Actor (Física vs Moral)
    document.querySelectorAll('input[name="actorTipo"]').forEach(r => {
        r.addEventListener('change', function() {
            const esFisica = this.value === 'FISICA';
            document.getElementById('actorFisicaCampos').style.display = esFisica ? 'block' : 'none';
            document.getElementById('actorMoralCampos').style.display = esFisica ? 'none' : 'block';
        });
    });
}

function togglePersonaCampos(id, esFisica) {
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

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
function cambiarTipoDemandado(id, tipo) { togglePersonaCampos(id, tipo === 'FISICA'); }

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
function cambiarTipoCodemandado(id, tipo) { togglePersonaCampos(id, tipo === 'FISICA'); }

function actualizarCasosAcumulables() {
    const select = document.getElementById('acumuladoA');
    const tipoJuicioActual = document.getElementById('tipoJuicio').value;
    select.innerHTML = '<option value="">No está acumulado</option>';
    
    const casosStr = localStorage.getItem('casos');
    if (!casosStr) return;
    
    const casos = JSON.parse(casosStr);
    // Filtrar casos elegibles (mismo tipo, en trámite, excluyendo el actual)
    casos.filter(c => c.estatus === 'TRAMITE' && c.id !== casoId)
         .forEach(c => {
             const option = document.createElement('option');
             option.value = c.id;
             option.textContent = `${c.numero_expediente} - ${c.tipo_juicio}`;
             select.appendChild(option);
         });
}

function construirObjetoCaso() {
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
    
    let demandados = [];
    if (imssEs !== 'DEMANDADO') {
        demandados = obtenerPersonasDinamicas('demandado_');
    }
    
    const codemandados = obtenerPersonasDinamicas('codemandado_');
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
        juicios_acumulados: [] // Se sobreescribe en guardarCambios si hay relaciones previas
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