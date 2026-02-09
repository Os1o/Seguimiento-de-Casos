// =====================================================
// FORMULARIO.JS - Lógica completa del formulario
// =====================================================

let contadorDemandados = 0;
let contadorCodemandados = 0;
let casoEditando = null; // Caso actual si estamos editando

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
    
    // Verificar si estamos en modo edición
    const urlParams = new URLSearchParams(window.location.search);
    const casoId = urlParams.get('editar');
    
    if (casoId) {
        cargarDatosParaEdicion(parseInt(casoId));
    }
});

function cargarDatosParaEdicion(casoId) {
    // Obtener casos de localStorage
    const casosGuardados = localStorage.getItem('casos');
    const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;
    
    casoEditando = casos.find(c => c.id === casoId);
    
    if (!casoEditando) {
        alert('Caso no encontrado');
        window.location.href = 'casos.html';
        return;
    }
    
    // Cambiar título de la página
    document.querySelector('.page-title').textContent = `Editar Caso: ${casoEditando.numero_expediente}`;
    document.querySelector('.page-subtitle').textContent = 'Modifique los datos necesarios';
    
    // Cambiar botón de guardar
    const btnGuardar = document.querySelector('button[type="submit"]');
    if (btnGuardar) {
        btnGuardar.textContent = 'Guardar Cambios';
    }
    
    // Llenar campos con datos del caso
    llenarFormularioConDatos();
}

function llenarFormularioConDatos() {
    if (!casoEditando) return;
    
    // 1. Delegación y Área
    document.getElementById('delegacion').value = casoEditando.delegacion_id;
    
    // Cargar áreas de la delegación seleccionada
    const selectArea = document.getElementById('area');
    selectArea.innerHTML = '<option value="">Seleccione...</option>';
    if (catalogos.areas[casoEditando.delegacion_id]) {
        selectArea.disabled = false;
        catalogos.areas[casoEditando.delegacion_id].forEach(a => {
            const option = document.createElement('option');
            option.value = a.id;
            option.textContent = a.nombre;
            selectArea.appendChild(option);
        });
        selectArea.value = casoEditando.area_generadora_id;
    }
    
    // 2. Jurisdicción
    const radioJurisdiccion = document.querySelector(`input[name="jurisdiccion"][value="${casoEditando.jurisdiccion}"]`);
    if (radioJurisdiccion) {
        radioJurisdiccion.checked = true;
        const esLocal = casoEditando.jurisdiccion === 'LOCAL';
        document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
        document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
    }
    
    // 3. Tipo de Juicio
    document.getElementById('tipoJuicio').value = casoEditando.tipo_juicio;
    
    // Cargar subtipos
    const selectSubtipo = document.getElementById('subtipoJuicio');
    selectSubtipo.innerHTML = '<option value="">Seleccione...</option>';
    const tiposJuicio = catalogos.tiposJuicio[casoEditando.tipo_juicio];
    if (tiposJuicio) {
        selectSubtipo.disabled = false;
        tiposJuicio.forEach(tipo => {
            const option = document.createElement('option');
            option.value = tipo.nombre;
            option.textContent = tipo.nombre;
            selectSubtipo.appendChild(option);
        });
        selectSubtipo.value = casoEditando.subtipo_juicio;
    }
    
    // 4. Número de expediente
    if (casoEditando.jurisdiccion === 'FEDERAL') {
        document.getElementById('numeroFederal').value = casoEditando.numero_juicio;
        document.getElementById('añoFederal').value = casoEditando.año;
    } else {
        document.getElementById('numeroLocal').value = casoEditando.numero_juicio_local || casoEditando.numero_expediente;
    }
    
    // 5. Acumulado
    if (casoEditando.acumulado_a) {
        document.getElementById('acumuladoA').value = casoEditando.acumulado_a;
    }
    
    // 6. Tribunal y Fecha
    document.getElementById('tribunal').value = casoEditando.tribunal_id;
    document.getElementById('fechaInicio').value = casoEditando.fecha_inicio;
    
    // 7. IMSS es
    const radioImss = document.querySelector(`input[name="imssEs"][value="${casoEditando.imss_es}"]`);
    if (radioImss) {
        radioImss.checked = true;
        actualizarSeccionesPersonas();
    }
    
    // 8. Actor (si aplica)
    if (casoEditando.imss_es !== 'ACTOR' && casoEditando.actor) {
        const radioActorTipo = document.querySelector(`input[name="actorTipo"][value="${casoEditando.actor.tipo_persona}"]`);
        if (radioActorTipo) {
            radioActorTipo.checked = true;
            actualizarCamposActor();
            
            if (casoEditando.actor.tipo_persona === 'FISICA') {
                document.getElementById('actorNombres').value = casoEditando.actor.nombres || '';
                document.getElementById('actorPaterno').value = casoEditando.actor.apellido_paterno || '';
                document.getElementById('actorMaterno').value = casoEditando.actor.apellido_materno || '';
            } else {
                document.getElementById('actorEmpresa').value = casoEditando.actor.empresa || '';
            }
        }
    }
    
    // 9. Demandados (si aplica)
    if (casoEditando.imss_es !== 'DEMANDADO' && casoEditando.demandados && casoEditando.demandados.length > 0) {
        casoEditando.demandados.forEach((dem, index) => {
            agregarDemandado();
            const id = `demandado_${contadorDemandados}`;
            
            const radioDemTipo = document.querySelector(`input[name="${id}_tipo"][value="${dem.tipo_persona}"]`);
            if (radioDemTipo) {
                radioDemTipo.checked = true;
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
    
    // 10. Codemandados (si existen)
    if (casoEditando.codemandados && casoEditando.codemandados.length > 0) {
        casoEditando.codemandados.forEach((codem, index) => {
            agregarCodemandado();
            const id = `codemandado_${contadorCodemandados}`;
            
            const radioCodemTipo = document.querySelector(`input[name="${id}_tipo"][value="${codem.tipo_persona}"]`);
            if (radioCodemTipo) {
                radioCodemTipo.checked = true;
                cambiarTipoCodemandado(id, codem.tipo_persona);
                
                if (codem.tipo_persona === 'FISICA') {
                    document.getElementById(`${id}_nombres`).value = codem.nombres || '';
                    document.getElementById(`${id}_paterno`).value = codem.apellido_paterno || '';
                    document.getElementById(`${id}_materno`).value = codem.apellido_materno || '';
                } else {
                    document.getElementById(`${id}_empresa`).value = codem.empresa || '';
                }
            }
        });
    }
    
    // 11. Prestación, Notas e Importe
    document.getElementById('prestacionReclamada').value = casoEditando.prestacion_reclamada;
    document.getElementById('prestacionesNotas').value = casoEditando.prestaciones_notas || '';
    document.getElementById('importeDemandado').value = casoEditando.importe_demandado || 0;
}


function inicializarFormulario() {
    llenarDelegaciones();
    llenarTribunales();
    llenarPrestaciones();
    cargarCasosParaAcumular();
}

function llenarDelegaciones() {
    const select = document.getElementById('delegacion');
    catalogos.delegaciones.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = d.nombre;
        select.appendChild(option);
    });
}

function llenarTribunales() {
    const select = document.getElementById('tribunal');
    catalogos.tribunales.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = t.nombre;
        select.appendChild(option);
    });
}

function llenarPrestaciones() {
    const select = document.getElementById('prestacionReclamada');
    catalogos.prestaciones.forEach(p => {
        const option = document.createElement('option');
        option.value = p.id;
        option.textContent = p.nombre;
        select.appendChild(option);
    });
}

function cargarCasosParaAcumular() {
    actualizarCasosAcumulables();
}

function actualizarCasosAcumulables() {
    const select = document.getElementById('acumuladoA');
    const tipoJuicioActual = document.getElementById('tipoJuicio').value;
    
    // Limpiar select
    select.innerHTML = '<option value="">No está acumulado</option>';
    
    const casosStr = localStorage.getItem('casos');
    if (!casosStr) return;
    
    const casos = JSON.parse(casosStr);
    
    // Filtrar solo casos en TRAMITE, no acumulados, y de la misma materia
    casos
        .filter(c => {
            const cumpleEstatus = c.estatus === 'TRAMITE' && !c.acumulado_a;
            const cumpleMateria = !tipoJuicioActual || c.tipo_juicio === tipoJuicioActual;
            return cumpleEstatus && cumpleMateria;
        })
        .sort((a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio))
        .forEach(c => {
            const option = document.createElement('option');
            option.value = c.id;
            option.textContent = `${c.numero_expediente} - ${c.tipo_juicio} - ${formatearFecha(c.fecha_inicio)}`;
            select.appendChild(option);
        });
}

// Funciones auxiliares para mostrar/ocultar campos según tipo de persona
function actualizarCamposActor() {
    const tipoSeleccionado = document.querySelector('input[name="tipoPersonaActor"]:checked')?.value;
    const seccionFisica = document.getElementById('actorFisicaCampos');
    const seccionMoral = document.getElementById('actorMoralCampos');
    
    if (tipoSeleccionado === 'FISICA') {
        seccionFisica.style.display = 'block';
        seccionMoral.style.display = 'none';
    } else if (tipoSeleccionado === 'MORAL') {
        seccionFisica.style.display = 'none';
        seccionMoral.style.display = 'block';
    }
}

function actualizarCamposDemandado(numero) {
    const tipoSeleccionado = document.querySelector(`input[name="tipoPersonaDemandado${numero}"]:checked`)?.value;
    const seccionFisica = document.getElementById(`demandadoFisicaCampos${numero}`);
    const seccionMoral = document.getElementById(`demandadoMoralCampos${numero}`);
    
    if (seccionFisica && seccionMoral) {
        if (tipoSeleccionado === 'FISICA') {
            seccionFisica.style.display = 'block';
            seccionMoral.style.display = 'none';
        } else if (tipoSeleccionado === 'MORAL') {
            seccionFisica.style.display = 'none';
            seccionMoral.style.display = 'block';
        }
    }
}

function actualizarCamposCodemandado(numero) {
    const tipoSeleccionado = document.querySelector(`input[name="tipoPersonaCodemandado${numero}"]:checked`)?.value;
    const seccionFisica = document.getElementById(`codemandadoFisicaCampos${numero}`);
    const seccionMoral = document.getElementById(`codemandadoMoralCampos${numero}`);
    
    if (seccionFisica && seccionMoral) {
        if (tipoSeleccionado === 'FISICA') {
            seccionFisica.style.display = 'block';
            seccionMoral.style.display = 'none';
        } else if (tipoSeleccionado === 'MORAL') {
            seccionFisica.style.display = 'none';
            seccionMoral.style.display = 'block';
        }
    }
}

function actualizarSeccionesPersonas() {
    const imssEs = document.getElementById('imss_es').value;
    const seccionActor = document.getElementById('seccionActor');
    const seccionDemandados = document.getElementById('seccionDemandados');
    
    if (imssEs === 'ACTOR') {
        seccionActor.style.display = 'none';
        seccionDemandados.style.display = 'block';
    } else if (imssEs === 'DEMANDADO') {
        seccionActor.style.display = 'block';
        seccionDemandados.style.display = 'none';
    } else {
        seccionActor.style.display = 'block';
        seccionDemandados.style.display = 'block';
    }
}

function configurarEventListeners() {
    // Cambio de delegación actualiza áreas
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
    
    // Cambio de jurisdicción muestra campos correspondientes
    document.querySelectorAll('input[name="jurisdiccion"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const esLocal = this.value === 'LOCAL';
            document.getElementById('campoLocal').style.display = esLocal ? 'block' : 'none';
            document.getElementById('campoFederal').style.display = esLocal ? 'none' : 'block';
            
            // Reset campos
            document.getElementById('numeroLocal').value = '';
            document.getElementById('numeroLocal').required = esLocal;
            document.getElementById('numeroFederal').value = '';
            document.getElementById('numeroFederal').required = !esLocal;
            document.getElementById('añoFederal').value = '';
            document.getElementById('añoFederal').required = !esLocal;
        });
    });
    
    // Validación solo números en expediente federal
    document.getElementById('numeroFederal').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });
    
    document.getElementById('añoFederal').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });
    
    // Cambio de tipo de juicio actualiza subtipos Y casos acumulables
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
                option.dataset.jurisdiccion = st.jurisdiccion || '';
                option.dataset.requiereDescripcion = st.requiere_descripcion || false;
                selectSubtipo.appendChild(option);
            });
        } else {
            selectSubtipo.disabled = true;
        }
        
        document.getElementById('grupSubsubtipo').style.display = 'none';
        
        // Actualizar casos acumulables según materia
        actualizarCasosAcumulables();
    });
    
    // Cambio de subtipo puede mostrar sub-subtipos
    document.getElementById('subtipoJuicio').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const subtipos = selectedOption ? JSON.parse(selectedOption.dataset.subtipos || '[]') : [];
        
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
    });
    
    // Cambio de posición IMSS muestra/oculta secciones
    document.querySelectorAll('input[name="imssEs"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const valor = this.value;
            
            // Mostrar/ocultar sección Actor
            const seccionActor = document.getElementById('seccionActor');
            seccionActor.style.display = (valor !== 'ACTOR') ? 'block' : 'none';
            
            // Mostrar/ocultar sección Demandados
            const seccionDemandados = document.getElementById('seccionDemandados');
            seccionDemandados.style.display = (valor !== 'DEMANDADO') ? 'block' : 'none';
            
            // Limpiar si se ocultan
            if (valor === 'ACTOR') {
                document.querySelectorAll('input[name="actorTipo"]').forEach(r => r.checked = false);
                document.getElementById('actorFisicaCampos').style.display = 'none';
                document.getElementById('actorMoralCampos').style.display = 'none';
            }
            
            if (valor === 'DEMANDADO') {
                document.getElementById('listaDemandados').innerHTML = '';
                contadorDemandados = 0;
            }
        });
    });
    
    // Cambio de tipo de persona Actor
    document.querySelectorAll('input[name="actorTipo"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const esFisica = this.value === 'FISICA';
            document.getElementById('actorFisicaCampos').style.display = esFisica ? 'block' : 'none';
            document.getElementById('actorMoralCampos').style.display = esFisica ? 'none' : 'block';
            
            // Limpiar campos
            document.getElementById('actorNombres').value = '';
            document.getElementById('actorPaterno').value = '';
            document.getElementById('actorMaterno').value = '';
            document.getElementById('actorEmpresa').value = '';
        });
    });
    
    // Submit del formulario
    document.getElementById('formNuevoCaso').addEventListener('submit', guardarCaso);
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

function agregarCodemandado() {
    contadorCodemandados++;
    const id = `codemandado_${contadorCodemandados}`;
    
    const html = `
        <div class="dynamic-field" id="${id}">
            <div class="dynamic-field-header">
                <span class="dynamic-field-title">Codemandado ${contadorCodemandados}</span>
                ${contadorCodemandados > 1 ? `<button type="button" class="btn-remove" onclick="eliminarCodemandado('${id}')">Eliminar</button>` : ''}
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
    
    document.getElementById('listaCodemandados').insertAdjacentHTML('beforeend', html);
}

function eliminarCodemandado(id) {
    document.getElementById(id).remove();
    contadorCodemandados--;
}

function cambiarTipoCodemandado(id, tipo) {
    const esFisica = tipo === 'FISICA';
    document.getElementById(`${id}_fisica_campos`).style.display = esFisica ? 'block' : 'none';
    document.getElementById(`${id}_moral_campos`).style.display = esFisica ? 'none' : 'block';
}

function guardarCaso(e) {
    e.preventDefault();
    
    // Construir objeto del caso
    const caso = construirObjetoCaso();
    
    // Validar
    if (!validarCaso(caso)) {
        return;
    }
    
    // Guardar en localStorage
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    
    if (casoEditando) {
        // MODO EDICIÓN: Actualizar caso existente
        caso.id = casoEditando.id;
        caso.numero = casoEditando.numero;
        caso.fecha_creacion = casoEditando.fecha_creacion;
        caso.seguimiento = casoEditando.seguimiento; // Mantener datos de seguimiento
        
        // Encontrar índice del caso y reemplazarlo
        const index = casos.findIndex(c => c.id === caso.id);
        if (index !== -1) {
            casos[index] = caso;
        }
        
        // Si cambió la acumulación, actualizar referencias
        if (caso.acumulado_a !== casoEditando.acumulado_a) {
            // Quitar del caso anterior si tenía
            if (casoEditando.acumulado_a) {
                const casoAnterior = casos.find(c => c.id === casoEditando.acumulado_a);
                if (casoAnterior && casoAnterior.juicios_acumulados) {
                    casoAnterior.juicios_acumulados = casoAnterior.juicios_acumulados.filter(id => id !== caso.id);
                }
            }
            
            // Agregar al nuevo caso acumulador
            if (caso.acumulado_a) {
                const casoNuevo = casos.find(c => c.id === caso.acumulado_a);
                if (casoNuevo) {
                    if (!casoNuevo.juicios_acumulados) {
                        casoNuevo.juicios_acumulados = [];
                    }
                    if (!casoNuevo.juicios_acumulados.includes(caso.id)) {
                        casoNuevo.juicios_acumulados.push(caso.id);
                    }
                }
            }
        }
        
        localStorage.setItem('casos', JSON.stringify(casos));
        alert('✅ Caso actualizado exitosamente');
        
    } else {
        // MODO CREACIÓN: Crear nuevo caso
        caso.id = casos.length > 0 ? Math.max(...casos.map(c => c.id)) + 1 : 1;
        caso.numero = casos.length + 1;
        caso.fecha_creacion = new Date().toISOString();
        
        // Agregar campos de seguimiento vacíos
        caso.seguimiento = {
            pronostico: null,
            sentencia: null,
            importe_sentencia: null,
            observaciones: null,
            fecha_estado_procesal: null,
            ultimo_estado_procesal: null,
            abogado_responsable: null
        };
        
        // Si se acumula a otro caso, actualizar ese caso
        if (caso.acumulado_a) {
            const casoAcumulador = casos.find(c => c.id === caso.acumulado_a);
            if (casoAcumulador) {
                if (!casoAcumulador.juicios_acumulados) {
                    casoAcumulador.juicios_acumulados = [];
                }
                casoAcumulador.juicios_acumulados.push(caso.id);
            }
        }
        
        casos.push(caso);
        localStorage.setItem('casos', JSON.stringify(casos));
        alert('✅ Caso guardado exitosamente');
    }
    
    window.location.href = 'casos.html';
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
    // Validar prestación
    if (!caso.prestacion_reclamada) {
        alert('Debe seleccionar una prestación reclamada');
        return false;
    }
    
    return true;
}