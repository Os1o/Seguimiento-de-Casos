// =====================================================
// FORMULARIO.JS - Logica para CREAR nuevos casos
// =====================================================

let contadorActores = 0;
let contadorDemandados = 0;
let contadorCodemandados = 0;

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
});

function inicializarFormulario() {
    llenarDelegaciones();
    llenarTribunales();
    llenarPrestaciones();
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

function configurarEventListeners() {
    // Cambio de delegacion actualiza areas
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
        });
    });

    // Validacion solo numeros en expediente federal
    document.getElementById('numeroFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 6);
    });

    document.getElementById('anoFederal').addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '').slice(0, 4);
    });

    // Cambio de tipo de juicio actualiza subtipos
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
function guardarCaso(e) {
    e.preventDefault();

    const caso = construirObjetoCaso();

    if (!validarCaso(caso)) {
        return;
    }

    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    // MODO CREACION
    caso.id = casos.length > 0 ? Math.max(...casos.map(c => c.id)) + 1 : 1;
    caso.numero = casos.length + 1;
    caso.fecha_creacion = new Date().toISOString();
    caso.fecha_actualizacion = new Date().toISOString();

    // Campos de seguimiento vacios (se llenan en actualizar-caso)
    caso.seguimiento = {
        sentencia: null,
        importe_sentencia: null,
        observaciones: null,
        fecha_estado_procesal: null,
        ultimo_estado_procesal: null
    };

    casos.push(caso);
    localStorage.setItem('casos', JSON.stringify(casos));
    alert('Caso guardado exitosamente');

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
        actores: actores,
        demandados: demandados,
        codemandados: codemandados,
        prestaciones_reclamadas: prestacionesSeleccionadas,
        prestaciones_notas: document.getElementById('prestacionesNotas').value,
        importe_demandado: importeDemandado,
        abogado_responsable: document.getElementById('abogadoResponsable').value || null,
        pronostico: document.getElementById('pronostico').value || null,
        estatus: 'TRAMITE',
        juicios_acumulados: [],
        fecha_vencimiento: null
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
    if (!caso.prestaciones_reclamadas || caso.prestaciones_reclamadas.length === 0) {
        alert('Debe seleccionar al menos una prestacion reclamada');
        return false;
    }

    return true;
}
