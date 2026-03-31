// =====================================================
// FORMULARIO PENAL - Nuevo caso penal
// =====================================================

let usuarioActual = null;

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) { window.location.href = 'login.html'; return null; }
    return JSON.parse(usuarioStr);
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = verificarSesion();
    if (!usuario) return;
    usuarioActual = usuario;

    if (usuario.rol === 'consulta') {
        window.location.href = 'penal.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Cargar catálogos
    try { await cargarCatalogos(); } catch (e) { console.warn('Supabase no disponible, usando datos locales'); }

    cargarDelegaciones();
    cargarDelitos();
    cargarEstadosProcesales();
    initRadioButtons();

    // Submit
    document.getElementById('formNuevoCaso').addEventListener('submit', function (e) {
        e.preventDefault();
        guardarCaso();
    });
});

function cargarDelegaciones() {
    const select = document.getElementById('delegacion');
    const delegaciones = catalogosCargados ? catalogosDB.delegaciones : catalogos.delegaciones;

    delegaciones.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.nombre;
        select.appendChild(opt);
    });

    // Pre-seleccionar y bloquear si no es admin
    if (usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        select.value = usuarioActual.delegacion_id;
        select.disabled = true;
    }
}

function cargarDelitos() {
    const select = document.getElementById('delito');
    let delitos;

    if (catalogosCargados && catalogosDB.delitos.length > 0) {
        delitos = catalogosDB.delitos;
    } else {
        // Fallback
        delitos = [
            { id: 1, nombre: 'Robo' }, { id: 2, nombre: 'Robo calificado' },
            { id: 3, nombre: 'Fraude' }, { id: 4, nombre: 'Abuso de confianza' },
            { id: 5, nombre: 'Daño en propiedad ajena' }, { id: 6, nombre: 'Lesiones' },
            { id: 7, nombre: 'Homicidio culposo' }, { id: 8, nombre: 'Amenazas' },
            { id: 9, nombre: 'Usurpación de funciones' }, { id: 10, nombre: 'Falsificación de documentos' },
            { id: 11, nombre: 'Uso de documento falso' }, { id: 12, nombre: 'Despojo' },
            { id: 13, nombre: 'Extorsión' }, { id: 14, nombre: 'Delitos contra la salud' },
            { id: 15, nombre: 'Delitos contra el patrimonio institucional' },
            { id: 16, nombre: 'Peculado' }, { id: 17, nombre: 'Cohecho' },
            { id: 18, nombre: 'Ejercicio indebido del servicio público' },
            { id: 19, nombre: 'Uso indebido de atribuciones y facultades' },
            { id: 20, nombre: 'Violación de sellos' }
        ];
    }

    delitos.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.nombre;
        select.appendChild(opt);
    });
}

function cargarEstadosProcesales() {
    const select = document.getElementById('estadoProcesal');
    let estados;

    if (catalogosCargados && catalogosDB.estadosProcesales.length > 0) {
        estados = catalogosDB.estadosProcesales;
    } else {
        estados = [
            { id: 1, nombre: 'Investigación inicial' }, { id: 2, nombre: 'Investigación complementaria' },
            { id: 3, nombre: 'Etapa intermedia' }, { id: 4, nombre: 'Juicio oral' },
            { id: 5, nombre: 'Sentenciado' }, { id: 6, nombre: 'Ejecución de sentencia' },
            { id: 7, nombre: 'Recurso de apelación' }, { id: 8, nombre: 'Amparo' },
            { id: 9, nombre: 'Concluido' }
        ];
    }

    estados.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

function initRadioButtons() {
    // Denunciante
    document.querySelectorAll('input[name="denuncianteTipo"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('denuncianteFisicaCampos').style.display = this.value === 'FISICA' ? '' : 'none';
            document.getElementById('denuncianteMoralCampos').style.display = this.value === 'MORAL' ? '' : 'none';
        });
    });

    // Probable Responsable
    document.querySelectorAll('input[name="responsableTipo"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('responsableFisicaCampos').style.display = this.value === 'FISICA' ? '' : 'none';
            document.getElementById('responsableMoralCampos').style.display = this.value === 'MORAL' ? '' : 'none';
        });
    });
}

function guardarCaso() {
    const delegacionId = parseInt(document.getElementById('delegacion').value);
    const numeroExpediente = document.getElementById('numeroExpediente').value.trim();
    const fechaInicio = document.getElementById('fechaInicio').value;
    const delitoId = parseInt(document.getElementById('delito').value);
    const estadoProcesalId = parseInt(document.getElementById('estadoProcesal').value);

    if (!delegacionId || !numeroExpediente || !fechaInicio || !delitoId || !estadoProcesalId) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    // Construir denunciante
    const denuncianteTipo = document.querySelector('input[name="denuncianteTipo"]:checked')?.value;
    let denunciante = null;
    if (denuncianteTipo === 'FISICA') {
        denunciante = {
            tipo_persona: 'FISICA',
            nombres: document.getElementById('denuncianteNombres').value.trim(),
            apellido_paterno: document.getElementById('denunciantePaterno').value.trim(),
            apellido_materno: document.getElementById('denuncianteMaterno').value.trim()
        };
    } else if (denuncianteTipo === 'MORAL') {
        denunciante = {
            tipo_persona: 'MORAL',
            empresa: document.getElementById('denuncianteEmpresa').value.trim()
        };
    }

    // Construir probable responsable
    const responsableTipo = document.querySelector('input[name="responsableTipo"]:checked')?.value;
    let probableResponsable = null;
    if (responsableTipo === 'FISICA') {
        probableResponsable = {
            tipo_persona: 'FISICA',
            nombres: document.getElementById('responsableNombres').value.trim(),
            apellido_paterno: document.getElementById('responsablePaterno').value.trim(),
            apellido_materno: document.getElementById('responsableMaterno').value.trim()
        };
    } else if (responsableTipo === 'MORAL') {
        probableResponsable = {
            tipo_persona: 'MORAL',
            empresa: document.getElementById('responsableEmpresa').value.trim()
        };
    }

    // Cargar casos existentes
    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    const maxId = casos.reduce((max, c) => Math.max(max, c.id || 0), 0);
    const maxNumero = casos.reduce((max, c) => Math.max(max, c.numero || 0), 0);

    const nuevoCaso = {
        id: maxId + 1,
        numero: maxNumero + 1,
        delegacion_id: delegacionId,
        numero_expediente: numeroExpediente,
        fecha_inicio: fechaInicio,
        delito_id: delitoId,
        denunciante: denunciante,
        probable_responsable: probableResponsable,
        fecha_conocimiento_amp: document.getElementById('fechaConocimientoAmp').value || null,
        estado_procesal_id: estadoProcesalId,
        acciones_pendientes: document.getElementById('accionesPendientes').value.trim() || null,
        fecha_judicializacion: document.getElementById('fechaJudicializacion').value || null,
        determinacion_judicial: document.getElementById('determinacionJudicial').value.trim() || null,
        sentencia: document.getElementById('sentencia').value || null,
        fecha_sentencia: document.getElementById('fechaSentencia').value || null,
        fecha_conclusion: document.getElementById('fechaConclusion').value || null,
        dato_relevante: document.getElementById('datoRelevante').value.trim() || null,
        estatus: document.getElementById('fechaConclusion').value ? 'CONCLUIDO' : 'TRAMITE',
        abogado_responsable: document.getElementById('abogadoResponsable').value.trim() || null,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        seguimiento: {}
    };

    casos.push(nuevoCaso);
    localStorage.setItem('casosPenal', JSON.stringify(casos));

    alert('Asunto penal guardado correctamente.');
    window.location.href = 'penal.html';
}
