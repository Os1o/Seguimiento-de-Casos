// =====================================================
// EDITAR CASO PENAL
// =====================================================

let usuarioActual = null;
let casoActual = null;

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

    const params = new URLSearchParams(window.location.search);
    const casoId = parseInt(params.get('id'));
    if (!casoId) {
        alert('No se especificó un asunto.');
        window.location.href = 'penal.html';
        return;
    }

    try { await cargarCatalogos(); } catch (e) { console.warn('Supabase no disponible'); }

    // Cargar caso
    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    casoActual = casos.find(c => c.id === casoId);
    if (!casoActual) {
        alert('Asunto no encontrado.');
        window.location.href = 'penal.html';
        return;
    }

    document.getElementById('subtituloExpediente').textContent = `Expediente: ${casoActual.numero_expediente}`;

    cargarDelegaciones();
    cargarDelitos();
    cargarEstadosProcesales();
    initRadioButtons();
    llenarFormulario();

    document.getElementById('formEditarCaso').addEventListener('submit', function (e) {
        e.preventDefault();
        guardarCambios();
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
    if (usuarioActual.rol !== 'admin' && usuarioActual.delegacion_id) {
        select.value = usuarioActual.delegacion_id;
        select.disabled = true;
    }
}

function cargarDelitos() {
    const select = document.getElementById('delito');
    const delitos = catalogosCargados && catalogosDB.delitos.length > 0 ? catalogosDB.delitos : [
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
    delitos.forEach(d => {
        const opt = document.createElement('option');
        opt.value = d.id;
        opt.textContent = d.nombre;
        select.appendChild(opt);
    });
}

function cargarEstadosProcesales() {
    const select = document.getElementById('estadoProcesal');
    const estados = catalogosCargados && catalogosDB.estadosProcesales.length > 0 ? catalogosDB.estadosProcesales : [
        { id: 1, nombre: 'Investigación inicial' }, { id: 2, nombre: 'Investigación complementaria' },
        { id: 3, nombre: 'Etapa intermedia' }, { id: 4, nombre: 'Juicio oral' },
        { id: 5, nombre: 'Sentenciado' }, { id: 6, nombre: 'Ejecución de sentencia' },
        { id: 7, nombre: 'Recurso de apelación' }, { id: 8, nombre: 'Amparo' },
        { id: 9, nombre: 'Concluido' }
    ];
    estados.forEach(e => {
        const opt = document.createElement('option');
        opt.value = e.id;
        opt.textContent = e.nombre;
        select.appendChild(opt);
    });
}

function initRadioButtons() {
    document.querySelectorAll('input[name="denuncianteTipo"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('denuncianteFisicaCampos').style.display = this.value === 'FISICA' ? '' : 'none';
            document.getElementById('denuncianteMoralCampos').style.display = this.value === 'MORAL' ? '' : 'none';
        });
    });
    document.querySelectorAll('input[name="responsableTipo"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('responsableFisicaCampos').style.display = this.value === 'FISICA' ? '' : 'none';
            document.getElementById('responsableMoralCampos').style.display = this.value === 'MORAL' ? '' : 'none';
        });
    });
}

function llenarFormulario() {
    const caso = casoActual;

    document.getElementById('delegacion').value = caso.delegacion_id;
    document.getElementById('numeroExpediente').value = caso.numero_expediente;
    document.getElementById('fechaInicio').value = caso.fecha_inicio || '';
    document.getElementById('delito').value = caso.delito_id || '';
    document.getElementById('fechaConocimientoAmp').value = caso.fecha_conocimiento_amp || '';
    document.getElementById('estadoProcesal').value = caso.estado_procesal_id || '';
    document.getElementById('accionesPendientes').value = caso.acciones_pendientes || '';
    document.getElementById('fechaJudicializacion').value = caso.fecha_judicializacion || '';
    document.getElementById('determinacionJudicial').value = caso.determinacion_judicial || '';
    document.getElementById('sentencia').value = caso.sentencia || '';
    document.getElementById('fechaSentencia').value = caso.fecha_sentencia || '';
    document.getElementById('fechaConclusion').value = caso.fecha_conclusion || '';
    document.getElementById('abogadoResponsable').value = caso.abogado_responsable || '';
    document.getElementById('datoRelevante').value = caso.dato_relevante || '';

    // Denunciante
    let denunciante = caso.denunciante;
    if (typeof denunciante === 'string') { try { denunciante = JSON.parse(denunciante); } catch (e) { denunciante = null; } }
    if (denunciante) {
        if (denunciante.tipo_persona === 'FISICA') {
            document.getElementById('denuncianteFisica').checked = true;
            document.getElementById('denuncianteFisicaCampos').style.display = '';
            document.getElementById('denuncianteNombres').value = denunciante.nombres || '';
            document.getElementById('denunciantePaterno').value = denunciante.apellido_paterno || '';
            document.getElementById('denuncianteMaterno').value = denunciante.apellido_materno || '';
        } else if (denunciante.tipo_persona === 'MORAL') {
            document.getElementById('denuncianteMoral').checked = true;
            document.getElementById('denuncianteMoralCampos').style.display = '';
            document.getElementById('denuncianteEmpresa').value = denunciante.empresa || '';
        }
    }

    // Probable responsable
    let responsable = caso.probable_responsable;
    if (typeof responsable === 'string') { try { responsable = JSON.parse(responsable); } catch (e) { responsable = null; } }
    if (responsable) {
        if (responsable.tipo_persona === 'FISICA') {
            document.getElementById('responsableFisica').checked = true;
            document.getElementById('responsableFisicaCampos').style.display = '';
            document.getElementById('responsableNombres').value = responsable.nombres || '';
            document.getElementById('responsablePaterno').value = responsable.apellido_paterno || '';
            document.getElementById('responsableMaterno').value = responsable.apellido_materno || '';
        } else if (responsable.tipo_persona === 'MORAL') {
            document.getElementById('responsableMoral').checked = true;
            document.getElementById('responsableMoralCampos').style.display = '';
            document.getElementById('responsableEmpresa').value = responsable.empresa || '';
        }
    }
}

function guardarCambios() {
    const delegacionId = parseInt(document.getElementById('delegacion').value);
    const numeroExpediente = document.getElementById('numeroExpediente').value.trim();
    const fechaInicio = document.getElementById('fechaInicio').value;
    const delitoId = parseInt(document.getElementById('delito').value);
    const estadoProcesalId = parseInt(document.getElementById('estadoProcesal').value);

    if (!delegacionId || !numeroExpediente || !fechaInicio || !delitoId || !estadoProcesalId) {
        alert('Por favor completa todos los campos requeridos.');
        return;
    }

    // Denunciante
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
        denunciante = { tipo_persona: 'MORAL', empresa: document.getElementById('denuncianteEmpresa').value.trim() };
    }

    // Responsable
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
        probableResponsable = { tipo_persona: 'MORAL', empresa: document.getElementById('responsableEmpresa').value.trim() };
    }

    // Actualizar caso
    const casos = JSON.parse(localStorage.getItem('casosPenal') || '[]');
    const idx = casos.findIndex(c => c.id === casoActual.id);
    if (idx === -1) { alert('Error: caso no encontrado.'); return; }

    casos[idx] = {
        ...casos[idx],
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
        abogado_responsable: document.getElementById('abogadoResponsable').value.trim() || null,
        estatus: document.getElementById('fechaConclusion').value ? 'CONCLUIDO' : casos[idx].estatus,
        fecha_actualizacion: new Date().toISOString()
    };

    localStorage.setItem('casosPenal', JSON.stringify(casos));
    alert('Cambios guardados correctamente.');
    window.location.href = `detalleCasoPenal.html?id=${casoActual.id}`;
}
