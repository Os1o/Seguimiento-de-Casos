// =====================================================
// EDITAR-CASO.JS - Versión Final (Áreas y Fechas Locales)
// =====================================================

let contadorDemandados = 0;
let contadorCodemandados = 0;
let casoId = null;
let casoActual = null;

document.addEventListener('DOMContentLoaded', function() {
    // 1. Verificar sesión
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }
    const usuario = JSON.parse(usuarioStr);
    const elNombre = document.getElementById('nombreUsuario');
    if(elNombre) elNombre.textContent = usuario.nombre_completo;

    // 2. Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    casoId = parseInt(urlParams.get('id'), 10);

    if (!casoId || isNaN(casoId)) {
        alert("Error: No se especificó un caso válido para editar.");
        window.location.href = 'casos.html';
        return;
    }

    // 3. Inicializar componentes
    inicializarCatalogos();
    configurarEventListeners();

    // 4. Cargar datos
    cargarDatosDelCaso();
});

function inicializarCatalogos() {
    if (typeof catalogos === 'undefined') return;
    llenarSelect('delegacion', catalogos.delegaciones);
    llenarSelect('tribunal', catalogos.tribunales);
    llenarSelect('prestacionReclamada', catalogos.prestaciones);
}

function llenarSelect(id, datos) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '<option value="">Seleccione...</option>';
    datos.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nombre;
        select.appendChild(option);
    });
}

// Función auxiliar para cargar áreas
function cargarAreas(delegacionId) {
    const selectArea = document.getElementById('area');
    selectArea.innerHTML = '<option value="">Seleccione...</option>';
    
    if (delegacionId && catalogos && catalogos.areas[delegacionId]) {
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

function cargarDatosDelCaso() {
    const casosStr = localStorage.getItem('casos');
    const casos = casosStr ? JSON.parse(casosStr) : (typeof casosFake !== 'undefined' ? casosFake : []);
    
    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert("Caso no encontrado.");
        window.location.href = 'casos.html';
        return;
    }

    // --- 1. Delegación y Área (CORREGIDO) ---
    const selectDelegacion = document.getElementById('delegacion');
    if (selectDelegacion) {
        selectDelegacion.value = casoActual.delegacion_id || "";
        
        // Cargar las opciones del área basada en la delegación
        cargarAreas(selectDelegacion.value);
        
        // SELECCIÓN SEGURA DEL ÁREA:
        const selectArea = document.getElementById('area');
        if (selectArea && casoActual.area_generadora_id) {
            // Convertimos a string para asegurar que coincida con el value del option
            const areaIdString = String(casoActual.area_generadora_id);
            selectArea.value = areaIdString;
            
            // Verificación extra: si falló (sigue vacío), intentamos forzarlo
            if (!selectArea.value) {
                // A veces el value es number, probamos parsear
                selectArea.value = parseInt(casoActual.area_generadora_id);
            }
        }
    }

    // --- 2. Jurisdicción ---
    const radioJur = document.querySelector(`input[name="jurisdiccion"][value="${casoActual.jurisdiccion}"]`);
    if (radioJur) {
        radioJur.checked = true;
        radioJur.dispatchEvent(new Event('change'));
    }

    if (casoActual.jurisdiccion === 'LOCAL') {
        document.getElementById('numeroLocal').value = casoActual.numero_juicio_local || casoActual.numero_expediente || '';
    } else {
        document.getElementById('numeroFederal').value = casoActual.numero_juicio || '';
        document.getElementById('añoFederal').value = casoActual.año || '';
    }

    // --- 3. Tipo, Subtipo y Terciarios ---
    const selectTipo = document.getElementById('tipoJuicio');
    if (selectTipo) {
        selectTipo.value = casoActual.tipo_juicio || "";
        selectTipo.dispatchEvent(new Event('change')); 

        const selectSub = document.getElementById('subtipoJuicio');
        if (casoActual.subtipo_juicio && selectSub) {
            Array.from(selectSub.options).forEach(opt => {
                if (opt.text === casoActual.subtipo_juicio) selectSub.value = opt.value;
            });
            selectSub.dispatchEvent(new Event('change'));

            const selectSubsub = document.getElementById('subsubtipoJuicio');
            if (casoActual.sub_subtipo_juicio && selectSubsub) {
                Array.from(selectSubsub.options).forEach(opt => {
                    if (opt.text === casoActual.sub_subtipo_juicio) selectSubsub.value = opt.value;
                });
            }
        }
    }

    // --- 4. Fecha de Inicio (CORREGIDO - ZONA HORARIA) ---
    if (casoActual.fecha_inicio) {
        let fechaParaInput = '';
        
        // Si la fecha tiene formato largo (con hora), hay que convertirla a LOCAL
        if (casoActual.fecha_inicio.includes('T')) {
            const fechaObj = new Date(casoActual.fecha_inicio);
            // Esto usa TU zona horaria (México) para calcular el día
            const year = fechaObj.getFullYear();
            const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
            const day = String(fechaObj.getDate()).padStart(2, '0');
            fechaParaInput = `${year}-${month}-${day}`;
        } else {
            // Si ya viene simple (YYYY-MM-DD), la usamos tal cual
            fechaParaInput = casoActual.fecha_inicio;
        }
        
        document.getElementById('fechaInicio').value = fechaParaInput;
    }

    // --- 5. Posición IMSS ---
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoActual.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        radioImss.dispatchEvent(new Event('change')); 
    }

    // --- 6. Actor ---
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

    // --- 7. Demandados ---
    const containerDemandados = document.getElementById('listaDemandados');
    if (containerDemandados) {
        containerDemandados.innerHTML = '';
        if (casoActual.imss_es !== 'DEMANDADO' && casoActual.demandados) {
            casoActual.demandados.forEach(dem => {
                agregarDemandado(); 
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
    }

    // --- 8. Codemandados ---
    const containerCodemandados = document.getElementById('listaCodemandados');
    if (containerCodemandados) {
        containerCodemandados.innerHTML = '';
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
    }

    // --- 9. Otros datos ---
    document.getElementById('tribunal').value = casoActual.tribunal_id || "";
    document.getElementById('prestacionReclamada').value = casoActual.prestacion_reclamada || "";
    document.getElementById('prestacionesNotas').value = casoActual.prestaciones_notas || '';
    document.getElementById('importeDemandado').value = casoActual.importe_demandado || 0;
    
    actualizarCasosAcumulables();
    if (casoActual.acumulado_a) {
        document.getElementById('acumuladoA').value = casoActual.acumulado_a;
    }
}

function guardarCambios(e) {
    e.preventDefault();

    try {
        const casoEditado = construirObjetoCaso();
        
        // Preservar datos originales
        casoEditado.id = casoActual.id;
        casoEditado.numero = casoActual.numero;
        casoEditado.fecha_creacion = casoActual.fecha_creacion;
        
        if (casoActual.juicios_acumulados && casoActual.juicios_acumulados.length > 0) {
            casoEditado.juicios_acumulados = casoActual.juicios_acumulados;
        } else {
            casoEditado.juicios_acumulados = [];
        }
        
        casoEditado.seguimiento = casoActual.seguimiento;

        // Guardar
        const casosStr = localStorage.getItem('casos');
        let casos = casosStr ? JSON.parse(casosStr) : [];
        
        const index = casos.findIndex(c => c.id === casoId);
        if (index !== -1) {
            casos[index] = casoEditado;
            localStorage.setItem('casos', JSON.stringify(casos));
            alert("✅ Caso actualizado correctamente");
            window.location.href = 'casos.html';
        } else {
            alert("Error: No se pudo encontrar el caso original.");
        }
    } catch (error) {
        console.error(error);
        alert("Error al guardar: " + error.message);
    }
}

function construirObjetoCaso() {
    // Validaciones
    const radioJurisdiccion = document.querySelector('input[name="jurisdiccion"]:checked');
    if (!radioJurisdiccion) throw new Error("Seleccione una jurisdicción");
    const jurisdiccion = radioJurisdiccion.value;
    const esLocal = jurisdiccion === 'LOCAL';
    
    let numeroExpediente;
    if (esLocal) {
        numeroExpediente = document.getElementById('numeroLocal').value;
    } else {
        const num = document.getElementById('numeroFederal').value;
        const año = document.getElementById('añoFederal').value;
        numeroExpediente = `${num}/${año}`;
    }
    
    const radioImss = document.querySelector('input[name="imssEs"]:checked');
    if (!radioImss) throw new Error("Seleccione el rol del IMSS");
    const imssEs = radioImss.value;
    
    let actor = null;
    if (imssEs !== 'ACTOR') {
        const actorTipoRadio = document.querySelector('input[name="actorTipo"]:checked');
        if (actorTipoRadio) {
            const actorTipo = actorTipoRadio.value;
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
    }
    
    let demandados = [];
    if (imssEs !== 'DEMANDADO') {
        demandados = obtenerPersonasDinamicas('demandado_');
    }
    
    const codemandados = obtenerPersonasDinamicas('codemandado_');
    const valArea = document.getElementById('area').value;
    const valPrestacion = document.getElementById('prestacionReclamada').value;
    const valTribunal = document.getElementById('tribunal').value;
    const valAcumulado = document.getElementById('acumuladoA').value;
    const subtipoSelect = document.getElementById('subtipoJuicio');
    const subsubtipoSelect = document.getElementById('subsubtipoJuicio');
    
    const caso = {
        delegacion_id: parseInt(document.getElementById('delegacion').value) || null,
        area_generadora_id: valArea ? parseInt(valArea) : null,
        jurisdiccion: jurisdiccion,
        tipo_juicio: document.getElementById('tipoJuicio').value,
        subtipo_juicio: subtipoSelect.options[subtipoSelect.selectedIndex]?.text || '',
        sub_subtipo_juicio: subsubtipoSelect && subsubtipoSelect.value ? subsubtipoSelect.options[subsubtipoSelect.selectedIndex].text : null,
        numero_expediente: numeroExpediente,
        acumulado_a: valAcumulado ? parseInt(valAcumulado) : null,
        tribunal_id: valTribunal ? parseInt(valTribunal) : null,
        fecha_inicio: document.getElementById('fechaInicio').value, // Esto guarda string simple, evitando problemas futuros
        imss_es: imssEs,
        actor: actor,
        demandados: demandados,
        codemandados: codemandados,
        prestacion_reclamada: valPrestacion ? parseInt(valPrestacion) : null,
        prestaciones_notas: document.getElementById('prestacionesNotas').value,
        importe_demandado: parseFloat(document.getElementById('importeDemandado').value) || 0,
        estatus: valAcumulado ? 'CONCLUIDO' : 'TRAMITE',
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

// ==========================================
// CONFIGURACIÓN DE EVENTOS
// ==========================================

function configurarEventListeners() {
    const form = document.getElementById('formNuevoCaso');
    if (form) form.addEventListener('submit', guardarCambios);
    
    // Delegación -> Área
    document.getElementById('delegacion').addEventListener('change', function() {
        // Al cambiar, recargamos el select de áreas
        cargarAreas(this.value);
    });

    // Tipo -> Subtipo
    document.getElementById('tipoJuicio').addEventListener('change', function() {
        const id = this.value;
        const select = document.getElementById('subtipoJuicio');
        select.innerHTML = '<option value="">Seleccione...</option>';
        
        const selectSubSub = document.getElementById('subsubtipoJuicio');
        if (selectSubSub) {
            selectSubSub.innerHTML = '<option value="">Ninguno</option>';
            document.getElementById('grupSubsubtipo').style.display = 'none';
        }

        if (id && catalogos && catalogos.tiposJuicio[id]) {
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
    
    // Subtipo -> Sub-subtipo
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const subtipos = selectedOption && selectedOption.dataset.subtipos ? JSON.parse(selectedOption.dataset.subtipos) : [];
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
            selectSubsub.value = '';
        }
    });

    // Listeners visuales
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(r => {
        r.addEventListener('change', function() {
            const esLocal = this.value === 'LOCAL';
            const fed = document.getElementById('campoFederal');
            const loc = document.getElementById('campoLocal');
            if(fed) fed.style.display = esLocal ? 'none' : 'block';
            if(loc) loc.style.display = esLocal ? 'block' : 'none';
        });
    });

    document.querySelectorAll('input[name="imssEs"]').forEach(r => {
        r.addEventListener('change', function() {
            const val = this.value;
            const secActor = document.getElementById('seccionActor');
            const secDem = document.getElementById('seccionDemandados');
            if(secActor) secActor.style.display = (val !== 'ACTOR') ? 'block' : 'none';
            if(secDem) secDem.style.display = (val !== 'DEMANDADO') ? 'block' : 'none';
        });
    });

    document.querySelectorAll('input[name="actorTipo"]').forEach(r => {
        r.addEventListener('change', function() {
            const esFisica = this.value === 'FISICA';
            const campFis = document.getElementById('actorFisicaCampos');
            const campMor = document.getElementById('actorMoralCampos');
            if(campFis) campFis.style.display = esFisica ? 'block' : 'none';
            if(campMor) campMor.style.display = esFisica ? 'none' : 'block';
        });
    });
}

function togglePersonaCampos(id, esFisica) {
    const f = document.getElementById(`${id}_fisica_campos`);
    const m = document.getElementById(`${id}_moral_campos`);
    if(f) f.style.display = esFisica ? 'block' : 'none';
    if(m) m.style.display = esFisica ? 'none' : 'block';
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
    const lista = document.getElementById('listaDemandados');
    if(lista) lista.insertAdjacentHTML('beforeend', html);
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
    const lista = document.getElementById('listaCodemandados');
    if(lista) lista.insertAdjacentHTML('beforeend', html);
}
function eliminarCodemandado(id) { document.getElementById(id).remove(); }
function cambiarTipoCodemandado(id, tipo) { togglePersonaCampos(id, tipo === 'FISICA'); }

function obtenerPersonasDinamicas(prefijo) {
    const personas = [];
    const elementos = document.querySelectorAll(`[id^="${prefijo}"]`);
    const ids = new Set();
    elementos.forEach(el => {
        const partes = el.id.split('_');
        if(partes.length >= 2) ids.add(`${partes[0]}_${partes[1]}`);
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

function actualizarCasosAcumulables() {
    const select = document.getElementById('acumuladoA');
    if(!select) return;
    select.innerHTML = '<option value="">No está acumulado</option>';
    const casosStr = localStorage.getItem('casos');
    if (!casosStr) return;
    const casos = JSON.parse(casosStr);
    casos.filter(c => c.estatus === 'TRAMITE' && c.id !== casoId)
         .forEach(c => {
             const option = document.createElement('option');
             option.value = c.id;
             option.textContent = `${c.numero_expediente} - ${c.tipo_juicio}`;
             select.appendChild(option);
         });
}