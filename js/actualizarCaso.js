// =====================================================
// ACTUALIZAR-CASO.JS - Actualizacion de seguimiento
// =====================================================

let casoActual = null;

document.addEventListener('DOMContentLoaded', function() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);

    // Proteger ruta: consulta no puede actualizar
    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        alert('No se especificó un asunto');
        window.location.href = 'casos.html';
        return;
    }

    cargarCaso(casoId);
    configurarEventListeners();
});

function cargarCaso(casoId) {
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert('Asunto no encontrado');
        window.location.href = 'casos.html';
        return;
    }

    // Actualizar links de navegacion
    document.getElementById('linkDetalle').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('btnCancelar').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('numExpediente').textContent = casoActual.numero_expediente;

    // Cargar casos acumulables
    cargarCasosAcumulables(casos);

    // Llenar con datos existentes
    llenarFormulario();
}

function cargarCasosAcumulables(casos) {
    const select = document.getElementById('acumuladoA');

    // Obtener fecha de inicio del caso actual para comparar
    const fechaActual = casoActual.fecha_inicio ? new Date(casoActual.fecha_inicio) : null;
    // Obtener materia (tipo_juicio) del caso actual: CIVIL o MERCANTIL
    const materiaActual = casoActual.tipo_juicio;

    // Filtrar: solo casos en TRAMITE, no acumulados, no el caso actual,
    // misma materia (Civil/Mercantil) y con fecha de inicio mas vieja
    const acumulables = casos.filter(c =>
        c.id !== casoActual.id &&
        c.estatus === 'TRAMITE' &&
        !c.acumulado_a &&
        c.tipo_juicio === materiaActual &&
        fechaActual && c.fecha_inicio && new Date(c.fecha_inicio) < fechaActual
    );

    acumulables.forEach(c => {
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = `${c.numero_expediente} - ${getNombreActor(c)}`;
        select.appendChild(option);
    });
}

function getNombreActor(caso) {
    // Compatibilidad con nuevo formato (actores array) y viejo (actor objeto)
    const actores = caso.actores || (caso.actor ? [caso.actor] : []);
    if (caso.imss_es === 'ACTOR') return 'IMSS';
    if (actores.length === 0) return 'N/A';

    const actor = actores[0];
    if (actor.tipo_persona === 'FISICA') {
        return `${actor.nombres} ${actor.apellido_paterno}`;
    }
    return actor.empresa || 'N/A';
}

function llenarFormulario() {
    const seg = casoActual.seguimiento || {};

    // Sentencia
    if (seg.sentencia) {
        document.getElementById('sentencia').value = seg.sentencia;
    }

    // Importe de sentencia
    if (seg.importe_sentencia !== null && seg.importe_sentencia !== undefined) {
        if (seg.importe_sentencia === 0) {
            document.getElementById('sinCuantiaSentencia').checked = true;
            document.getElementById('importeSentencia').disabled = true;
            document.getElementById('importeSentencia').placeholder = 'Sin cuantia';
        } else {
            const formateado = seg.importe_sentencia.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            document.getElementById('importeSentencia').value = formateado;
        }
    }

    // Estado procesal
    if (seg.ultimo_estado_procesal) {
        document.getElementById('ultimoEstadoProcesal').value = seg.ultimo_estado_procesal;
    }

    if (seg.fecha_estado_procesal) {
        let fecha = seg.fecha_estado_procesal;
        if (fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaEstadoProcesal').value = fecha;
    }

    // Observaciones
    if (seg.observaciones) {
        document.getElementById('observaciones').value = seg.observaciones;
    }

    // Acumulado a
    if (casoActual.acumulado_a) {
        document.getElementById('acumuladoA').value = casoActual.acumulado_a;
    }

    // Fecha de vencimiento
    if (casoActual.fecha_vencimiento) {
        let fecha = casoActual.fecha_vencimiento;
        if (fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaVencimiento').value = fecha;
    }
}

function configurarEventListeners() {
    // Checkbox sin cuantia sentencia
    document.getElementById('sinCuantiaSentencia').addEventListener('change', function() {
        const importeInput = document.getElementById('importeSentencia');
        if (this.checked) {
            importeInput.value = '';
            importeInput.disabled = true;
            importeInput.placeholder = 'Sin cuantia';
        } else {
            importeInput.disabled = false;
            importeInput.placeholder = '0.00';
        }
    });

    // Formato de importe sentencia
    document.getElementById('importeSentencia').addEventListener('input', function() {
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

    // Submit
    document.getElementById('formActualizar').addEventListener('submit', guardarActualizacion);
}

function guardarActualizacion(e) {
    e.preventDefault();

    // Construir objeto de seguimiento
    const sentencia = document.getElementById('sentencia').value || null;

    const sinCuantiaSentencia = document.getElementById('sinCuantiaSentencia').checked;
    let importeSentencia = null;
    if (sinCuantiaSentencia) {
        importeSentencia = 0;
    } else {
        const valorImporte = document.getElementById('importeSentencia').value.replace(/,/g, '');
        importeSentencia = valorImporte ? parseFloat(valorImporte) : null;
    }

    const ultimoEstadoProcesal = document.getElementById('ultimoEstadoProcesal').value || null;
    const fechaEstadoProcesal = document.getElementById('fechaEstadoProcesal').value || null;
    const observaciones = document.getElementById('observaciones').value || null;
    const acumuladoA = document.getElementById('acumuladoA').value ? parseInt(document.getElementById('acumuladoA').value) : null;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value || null;

    // Actualizar seguimiento
    casoActual.seguimiento = casoActual.seguimiento || {};
    casoActual.seguimiento.sentencia = sentencia;
    casoActual.seguimiento.importe_sentencia = importeSentencia;
    casoActual.seguimiento.ultimo_estado_procesal = ultimoEstadoProcesal;
    casoActual.seguimiento.fecha_estado_procesal = fechaEstadoProcesal;
    casoActual.seguimiento.observaciones = observaciones;

    // Acumulacion
    const acumuladoAnterior = casoActual.acumulado_a;
    casoActual.acumulado_a = acumuladoA;
    casoActual.fecha_vencimiento = fechaVencimiento;
    casoActual.fecha_actualizacion = new Date().toISOString();

    // Si se acumulo, cambiar estatus a CONCLUIDO
    if (acumuladoA) {
        casoActual.estatus = 'CONCLUIDO';
    } else if (acumuladoAnterior && !acumuladoA) {
        // Si se quito la acumulacion, volver a TRAMITE
        casoActual.estatus = 'TRAMITE';
    }

    // Guardar en localStorage
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    const index = casos.findIndex(c => c.id === casoActual.id);
    if (index !== -1) {
        casos[index] = casoActual;

        // Actualizar juicios_acumulados del caso padre
        if (acumuladoAnterior && acumuladoAnterior !== acumuladoA) {
            // Quitar del padre anterior
            const padreAnterior = casos.find(c => c.id === acumuladoAnterior);
            if (padreAnterior && padreAnterior.juicios_acumulados) {
                padreAnterior.juicios_acumulados = padreAnterior.juicios_acumulados.filter(id => id !== casoActual.id);
            }
        }

        if (acumuladoA) {
            // Agregar al nuevo padre
            const padreNuevo = casos.find(c => c.id === acumuladoA);
            if (padreNuevo) {
                if (!padreNuevo.juicios_acumulados) padreNuevo.juicios_acumulados = [];
                if (!padreNuevo.juicios_acumulados.includes(casoActual.id)) {
                    padreNuevo.juicios_acumulados.push(casoActual.id);
                }
            }
        }

        localStorage.setItem('casos', JSON.stringify(casos));
        alert('Seguimiento actualizado correctamente');
        window.location.href = `detalleCaso.html?id=${casoActual.id}`;
    } else {
        alert('Error: No se encontró el asunto');
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
