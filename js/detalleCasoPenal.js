// =====================================================
// DETALLE CASO PENAL
// =====================================================

let usuarioActual = null;
let casoActual = null;
let mascActual = null;
let historialExpandido = false;
const MAX_ACTUACIONES_VISIBLES = 5;

let catalogos = {
    delegaciones: [],
    delitos: [],
    estadosProcesales: [],
    abogadosResponsables: []
};

function getEl(id) {
    return document.getElementById(id);
}

function setText(id, value, fallback = '---') {
    const el = getEl(id);
    if (!el) return;
    el.textContent = value === null || value === undefined || value === '' ? fallback : value;
}

function setHTML(id, html) {
    const el = getEl(id);
    if (!el) return;
    el.innerHTML = html;
}

function penalDetalleBool(value) {
    return value === true || value === 't' || value === 'true' || value === '1' || value === 1;
}

async function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (usuarioStr) {
        return JSON.parse(usuarioStr);
    }

    try {
        const response = await fetch('api/session.php', {
            method: 'GET',
            credentials: 'same-origin'
        });

        const result = await response.json();

        if (response.ok && result.ok) {
            const user = result.data?.user || {};
            const usuario = {
                id: user.id ?? null,
                usuario: user.usuario ?? '',
                nombre_completo: user.nombreCompleto ?? '',
                rol: user.rol ?? '',
                delegacion_id: user.delegacionId ?? null,
                permiso_civil_mercantil: Boolean(user.permisoCivilMercantil),
                permiso_penal: Boolean(user.permisoPenal),
                es_abogado: Boolean(user.esAbogado),
                es_jefe: Boolean(user.esJefe),
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo recuperar la sesión desde la API:', error);
    }

    window.location.href = 'login.html';
    return null;
}

async function cerrarSesion() {
    try {
        await fetch('api/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

window.cerrarSesion = cerrarSesion;

async function cargarCatalogosPenalDetalle() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catálogos');
    }

    const data = result.data || {};

    catalogos = {
        delegaciones: data.delegaciones || [],
        delitos: data.delitos || [],
        estadosProcesales: data.estadosProcesales || [],
        abogadosResponsables: []
    };
}

function usuarioPuedeReasignarAbogadoPenal() {
    if (!usuarioActual || !casoActual) {
        return false;
    }

    if (usuarioActual.rol === 'admin') {
        return true;
    }

    return usuarioActual.rol === 'editor'
        && Boolean(usuarioActual.es_jefe || usuarioActual.esJefe)
        && Number(usuarioActual.delegacion_id || 0) === Number(casoActual.delegacion_id || 0);
}

async function cargarAbogadosResponsablesPenalDetalle() {
    if ((catalogos.abogadosResponsables || []).length > 0) {
        return catalogos.abogadosResponsables;
    }

    const response = await fetch('api/penal/getNewCaseCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los abogados responsables');
    }

    catalogos.abogadosResponsables = result.data?.abogadosResponsables || [];
    return catalogos.abogadosResponsables;
}

async function reasignarAbogadoPenalApi(caseId, abogadoResponsableId) {
    const response = await fetch('api/reassignPenalLawyer.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            case_id: caseId,
            abogado_responsable_id: abogadoResponsableId
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo reasignar el abogado responsable');
    }

    return result.data || {};
}

async function obtenerCasoPenalDetalle(id) {
    const response = await fetch(`api/getPenalCase.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el asunto penal');
    }

    return result.data?.case || null;
}

async function obtenerMascPenalDetalle(id) {
    const response = await fetch(`api/getPenalMasc.php?asunto_id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el MASC');
    }

    return result.data?.masc || null;
}

async function reabrirCarpetaPenalApi(id) {
    const response = await fetch('api/reopenPenalCase.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ asunto_id: id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo reabrir la carpeta penal');
    }

    return result.data || {};
}

async function obtenerDocumentosPenalApi(expedienteId) {
    const response = await fetch(`api/getPenalDocuments.php?expediente_id=${encodeURIComponent(expedienteId)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los documentos');
    }

    return result.data?.documentos || [];
}

async function eliminarCasoPenalApi(id) {
    const response = await fetch('api/deletePenalCase.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo eliminar el asunto penal');
    }

    return result.data || {};
}

async function eliminarSeguimientoPenalApi(id) {
    const response = await fetch('api/deletePenalTracking.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo eliminar la actuación penal');
    }

    return result.data || {};
}

function formatearTamanoArchivo(bytes) {
    if (!bytes || Number.isNaN(Number(bytes))) return '0 KB';
    const size = Number(bytes);
    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }
    return `${Math.max(1, Math.round(size / 1024))} KB`;
}

function formatearFecha(valor) {
    if (!valor) return '---';
    const fechaTexto = String(valor).trim();
    const matchFechaLocal = fechaTexto.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (matchFechaLocal) {
        const [, anio, mes, dia] = matchFechaLocal;
        const fechaLocal = new Date(Number(anio), Number(mes) - 1, Number(dia));
        return fechaLocal.toLocaleDateString('es-MX');
    }

    const fecha = new Date(valor);
    if (Number.isNaN(fecha.getTime())) return String(valor);
    return fecha.toLocaleDateString('es-MX');
}

function formatearCuantia(valor, sinCuantificar) {
    if (sinCuantificar) return 'Sin cuantificar';
    if (valor === null || valor === undefined || valor === '') return '---';
    const numero = Number(valor);
    if (Number.isNaN(numero)) return String(valor);
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN',
        maximumFractionDigits: 2
    }).format(numero);
}

function obtenerListaNormalizada(valor) {
    if (!valor) return [];
    if (Array.isArray(valor)) return valor;

    if (typeof valor === 'string') {
        try {
            const parseado = JSON.parse(valor);
            return Array.isArray(parseado) ? parseado : [];
        } catch (error) {
            return valor.trim() ? [valor.trim()] : [];
        }
    }

    return [];
}

function obtenerDelegacion(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(item => item.id == id) || null;
}

function obtenerNombreDelitoLocal(id) {
    if (!id) return '';
    const delito = (catalogos.delitos || []).find(item => item.id == id);
    return delito?.nombre || '';
}

function getPersonaNombreLocal(persona) {
    if (!persona) return '---';

    if (typeof persona === 'string') {
        try {
            return getPersonaNombreLocal(JSON.parse(persona));
        } catch (error) {
            return persona.trim() || '---';
        }
    }

    if (persona.tipo_persona === 'FISICA') {
        return `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim() || '---';
    }

    if (persona.tipo_persona === 'MORAL') {
        return persona.empresa || '---';
    }

    if (persona.nombre) return persona.nombre;
    if (persona.texto) return persona.texto;

    return '---';
}

function renderizarDenunciantesDetalle(caso) {
    const contenedor = getEl('denunciantesLista');
    if (!contenedor) return;

    const denunciantes = obtenerListaNormalizada(caso.denunciantes);

    if (denunciantes.length > 0) {
        contenedor.innerHTML = denunciantes.map((item) => `
            <div class="documento-item">
                <span class="material-symbols-outlined">person</span>
                <span>${item?.nombre || item?.texto || item || '---'}</span>
            </div>
        `).join('');
        return;
    }

    const legacy = getPersonaNombreLocal(caso.denunciante);
    contenedor.innerHTML = legacy && legacy !== '---'
        ? `<div class="documento-item"><span class="material-symbols-outlined">person</span><span>${legacy}</span></div>`
        : '<div class="empty-text">Sin denunciantes registrados.</div>';
}

function obtenerProbablesResponsablesDetalle(caso) {
    const responsables = obtenerListaNormalizada(caso.probables_responsables);
    if (responsables.length > 0) {
        return responsables.map((item) => item?.nombre || item?.texto || item || '---').join(', ');
    }

    return getPersonaNombreLocal(caso.probable_responsable);
}

function construirResumenRequerimientos(caso) {
    const total = Number(caso.total_requerimientos || 0);
    const seguimiento = Number(caso.requerimientos_seguimiento || 0);
    const contestacion = Number(caso.requerimientos_contestacion || 0);

    if (total <= 0) {
        return 'La carpeta no cuenta con requerimientos ministeriales registrados.';
    }

    return `La carpeta cuenta con ${total} requerimiento(s) ministerial(es), ${seguimiento} en seguimiento interno y ${contestacion} en contestación final.`;
}

function agruparDocumentosPorSeguimiento(documentos) {
    return (documentos || []).reduce((acc, documento) => {
        const seguimientoId = documento.seguimiento_id || 0;
        if (!acc[seguimientoId]) {
            acc[seguimientoId] = [];
        }
        acc[seguimientoId].push(documento);
        return acc;
    }, {});
}

document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await verificarSesion();
    if (!usuario) return;

    usuarioActual = usuario;
    window.mostrarCargaVista?.('.container');

    setText('nombreUsuario', usuario.nombre_completo);

    const badgeRol = getEl('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol;
        badgeRol.className = 'badge-rol badge-rol-' + usuario.rol;
    }

    const infoOOAD = getEl('infoOOAD');
    if (infoOOAD) {
        infoOOAD.textContent = 'Todas las JSJ';
    }

    const linkAdmin = getEl('linkAdmin');
    if (linkAdmin && usuario.rol === 'admin') {
        linkAdmin.style.display = '';
    }

    const params = new URLSearchParams(window.location.search);
    const casoId = parseInt(params.get('id'), 10);

    if (!casoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto.'
        });
        window.location.href = 'penal.html';
        return;
    }

    try {
        await cargarCatalogosPenalDetalle();
        casoActual = await obtenerCasoPenalDetalle(casoId);
        mascActual = await obtenerMascPenalDetalle(casoId);

        if (!casoActual) {
            await window.appAlert?.({
                title: 'Asunto no encontrado',
                message: 'No se encontró el asunto solicitado.'
            });
            window.location.href = 'penal.html';
            return;
        }

        const btnRegistroAmp = getEl('btnRegistroAmp');
        const btnActualizar = getEl('btnActualizar');
        const btnEliminar = getEl('btnEliminar');
        const btnReabrirCarpetaPenal = getEl('btnReabrirCarpetaPenal');
        const btnReasignarAbogadoPenal = getEl('btnReasignarAbogadoPenal');

        if (usuarioActual.rol === 'consulta') {
            if (btnRegistroAmp) btnRegistroAmp.style.display = 'none';
            if (btnActualizar) btnActualizar.style.display = 'none';
            if (btnEliminar) btnEliminar.style.display = 'none';
        } else if (usuarioActual.rol !== 'admin') {
            if (btnEliminar) btnEliminar.style.display = 'none';
        }

        btnReabrirCarpetaPenal?.addEventListener('click', confirmarReabrirCarpetaPenal);
        btnReasignarAbogadoPenal?.addEventListener('click', abrirModalReasignarAbogadoPenal);
        getEl('btnGuardarReasignarAbogadoPenal')?.addEventListener('click', guardarReasignacionAbogadoPenal);
        getEl('btnCancelarReasignarAbogadoPenal')?.addEventListener('click', cerrarModalReasignarAbogadoPenal);
        getEl('btnCerrarReasignarAbogadoPenal')?.addEventListener('click', cerrarModalReasignarAbogadoPenal);
        getEl('modalReasignarAbogadoPenal')?.addEventListener('click', (event) => {
            if (event.target === event.currentTarget) {
                cerrarModalReasignarAbogadoPenal();
            }
        });

        await renderizarDetalle();
    } catch (error) {
        console.error('No se pudo cargar el detalle penal:', error);
        await window.appAlert?.({
            title: 'No se pudo cargar el asunto',
            message: error.message || 'Ocurrió un problema al cargar el asunto penal.'
        });
        window.location.href = 'penal.html';
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function renderizarDetalle() {
    const caso = casoActual;
    const numeroCarpeta = caso.numero_expediente || caso.numero_carpeta || '---';
    const delegacion = obtenerDelegacion(caso.delegacion_id);
    const linkRequerimientos = getEl('btnVerRequerimientosPenal');
    const btnRequerimientos = getEl('btnRequerimientos');
    const btnRegistroAmp = getEl('btnRegistroAmp');
    const btnActualizar = getEl('btnActualizar');
    const btnEditarDatosPenal = getEl('btnEditarDatosPenal');
    const btnMascPenal = getEl('btnMascPenal');
    const btnReabrirCarpetaPenal = getEl('btnReabrirCarpetaPenal');
    const btnReasignarAbogadoPenal = getEl('btnReasignarAbogadoPenal');

    setText('breadcrumbExpediente', numeroCarpeta);
    setText('numeroExpediente', numeroCarpeta);
    setText('numeroExpedienteDetalle', numeroCarpeta);
    setText('fechaCreacion', formatearFecha(caso.fecha_creacion || caso.fecha_inicio));

    if (caso.fecha_actualizacion) {
        const fechaActualizacionInfo = getEl('fechaActualizacionInfo');
        if (fechaActualizacionInfo) fechaActualizacionInfo.style.display = '';
        setText('fechaActualizacion', formatearFecha(caso.fecha_actualizacion));
    }

    const badgeEstatus = getEl('badgeEstatus');
    if (badgeEstatus) {
        if (caso.estatus === 'TRAMITE') {
            badgeEstatus.textContent = 'En trámite';
            badgeEstatus.className = 'badge-estatus badge-warning';
        } else {
            badgeEstatus.textContent = 'Concluido';
            badgeEstatus.className = 'badge-estatus badge-success';
        }
    }

    if (caso.id) {
        const hrefRequerimientos = `listadoRequerimientosPenal.html?id=${encodeURIComponent(caso.id)}`;
        const hrefRegistroAmp = `actualizarCasoPenal.html?id=${encodeURIComponent(caso.id)}`;
        const hrefActuacion = `registroActuacionPenal.html?id=${encodeURIComponent(caso.id)}`;
        const hrefEditarDatos = `editarCasoPenal.html?id=${encodeURIComponent(caso.id)}`;
        const tieneConocimientoAmp = Boolean(caso.fecha_conocimiento_amp || caso.fecha_conocimiento_fiscal);
        const puedeEditar = usuarioActual && usuarioActual.rol !== 'consulta';
        const esAdmin = usuarioActual?.rol === 'admin';
        const puedeEditarAmp = usuarioActual && (!tieneConocimientoAmp || esAdmin) && usuarioActual.rol !== 'consulta';
        const estatusConcluido = String(caso.estatus || caso.estatus_general || '').toUpperCase() === 'CONCLUIDO';
        const tieneMasc = Boolean(mascActual?.id);

        if (linkRequerimientos) linkRequerimientos.href = hrefRequerimientos;
        if (btnRequerimientos) btnRequerimientos.href = hrefRequerimientos;
        if (btnEditarDatosPenal) {
            btnEditarDatosPenal.href = hrefEditarDatos;
            btnEditarDatosPenal.style.display = esAdmin ? '' : 'none';
        }
        if (btnRegistroAmp) {
            btnRegistroAmp.href = hrefRegistroAmp;
            btnRegistroAmp.style.display = puedeEditarAmp ? '' : 'none';
        }
        if (btnActualizar) {
            btnActualizar.href = hrefActuacion;
            btnActualizar.style.display = puedeEditar && tieneConocimientoAmp && !estatusConcluido ? '' : 'none';
        }
        if (btnMascPenal) {
            btnMascPenal.href = `mascPenal.html?id=${encodeURIComponent(caso.id)}`;
            btnMascPenal.textContent = 'MASC';
            btnMascPenal.style.display = (tieneMasc && esAdmin) || (!tieneMasc && puedeEditar && !estatusConcluido) ? '' : 'none';
        }
        if (btnReabrirCarpetaPenal) {
            btnReabrirCarpetaPenal.style.display = esAdmin && estatusConcluido ? '' : 'none';
        }
        if (btnReasignarAbogadoPenal) {
            btnReasignarAbogadoPenal.style.display = usuarioPuedeReasignarAbogadoPenal() ? '' : 'none';
        }
    }

    setText('delegacion', delegacion ? delegacion.nombre : '---');
    setText('fechaInicio', formatearFecha(caso.fecha_inicio || caso.fecha_presentacion_denuncia));
    setText('delito', obtenerNombreDelitoLocal(caso.delito_id) || caso.delito_nombre || '---');
    setText('categoriaDelito', caso.categoria_delito_nombre || '---');
    setText('areaGeneradora', caso.area_generadora_nombre || caso.area_generadora || caso.lugar_hechos || '---');
    setText('abogadoResponsable', caso.abogado_responsable || caso.abogado_responsable_nombre || '---');
    setText('cuantia', formatearCuantia(caso.cuantia, caso.sin_cuantificar));
    setText('hechosDenunciante', caso.hechos_denunciante || '---');

    renderizarDenunciantesDetalle(caso);
    setText('coadyuvancia', caso.es_coadyuvancia ? 'Sí' : 'No');
    setText('probableResponsable', obtenerProbablesResponsablesDetalle(caso));
    setText('datoRelevante', caso.dato_relevante || '---');

    setText('estatusActualDetalle', caso.estatus ? caso.estatus.replaceAll('_', ' ') : '---');
    setText('fechaConocimientoAmp', formatearFecha(caso.fecha_conocimiento_amp));
    setText('fechaJudicializacion', formatearFecha(caso.fecha_judicializacion));
    setText('determinacionJudicial', caso.determinacion_judicial || '---');
    setText('resumenRequerimientosPenal', construirResumenRequerimientos(caso));
    renderizarMascPenalDetalle();

    const seguimiento = caso.seguimiento;
    if (seguimiento && seguimiento.fecha_actuacion) {
        setText('fechaActuacion', formatearFecha(seguimiento.fecha_actuacion));
        setText('tipoActuacion', seguimiento.tipo_actuacion || '---');
        setText('faseActuacion', seguimiento.fase_nombre || '---');
        setText('descripcionActuacion', seguimiento.descripcion || '---');
    } else {
        setHTML('ultimaActuacionCard', `
            <div class="actuacion-desc-grupo">
                <span class="actuacion-label">Última actuación registrada</span>
                <div class="actuacion-desc">Sin actuaciones registradas.</div>
            </div>
        `);
    }

    await Promise.all([
        renderizarTimeline(),
        renderizarDocumentosPenalDetalle()
    ]);
}

function renderizarMascPenalDetalle() {
    const seccion = getEl('seccionMascPenal');
    if (!seccion) return;

    if (!mascActual?.id) {
        seccion.style.display = 'none';
        return;
    }

    seccion.style.display = '';
    setText('mascFechaConvenio', formatearFecha(mascActual.fecha_convenio));
    setText('mascCierraCarpeta', penalDetalleBool(mascActual.cierra_carpeta) ? 'Si' : 'No');
    setText('mascFechaActualizacion', formatearFecha(mascActual.updated_at || mascActual.created_at));
    setText('mascDescripcion', mascActual.descripcion || '---');
}

async function abrirModalReasignarAbogadoPenal() {
    if (!usuarioPuedeReasignarAbogadoPenal()) {
        return;
    }

    try {
        const abogados = await cargarAbogadosResponsablesPenalDetalle();
        const select = getEl('selectReasignarAbogadoPenal');
        const actual = getEl('reasignarAbogadoActualPenal');

        if (actual) {
            actual.value = casoActual?.abogado_responsable || casoActual?.abogado_responsable_nombre || 'Sin asignar';
        }

        if (select) {
            select.innerHTML = '<option value="">Seleccione...</option>';
            abogados.forEach((abogado) => {
                const option = document.createElement('option');
                option.value = String(abogado.id);
                option.textContent = abogado.nombre_completo || abogado.usuario || `Usuario ${abogado.id}`;
                select.appendChild(option);
            });
            select.value = casoActual?.abogado_responsable_id ? String(casoActual.abogado_responsable_id) : '';
        }

        const modal = getEl('modalReasignarAbogadoPenal');
        if (modal) {
            modal.style.display = 'flex';
        }
    } catch (error) {
        console.error('No se pudieron cargar abogados penales:', error);
        await window.appAlert?.({
            title: 'No se pudo cargar el catálogo',
            message: error.message || 'No se pudieron cargar los abogados responsables.'
        });
    }
}

function cerrarModalReasignarAbogadoPenal() {
    const modal = getEl('modalReasignarAbogadoPenal');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function guardarReasignacionAbogadoPenal() {
    const select = getEl('selectReasignarAbogadoPenal');
    const abogadoId = parseInt(select?.value || '', 10);

    if (!casoActual?.id || !abogadoId) {
        await window.appAlert?.({
            title: 'Datos incompletos',
            message: 'Selecciona el nuevo abogado responsable.'
        });
        return;
    }

    if (abogadoId === parseInt(casoActual.abogado_responsable_id || 0, 10)) {
        cerrarModalReasignarAbogadoPenal();
        return;
    }

    try {
        await reasignarAbogadoPenalApi(casoActual.id, abogadoId);
        cerrarModalReasignarAbogadoPenal();
        await window.appAlert?.({
            title: 'Cambios guardados',
            message: 'El abogado responsable se reasignó correctamente.'
        });
        casoActual = await obtenerCasoPenalDetalle(casoActual.id);
        await renderizarDetalle();
    } catch (error) {
        console.error('No se pudo reasignar abogado penal:', error);
        await window.appAlert?.({
            title: 'No se pudo reasignar',
            message: error.message || 'No se pudo reasignar el abogado responsable.'
        });
    }
}

async function renderizarTimeline() {
    const container = getEl('timeline');
    if (!container) return;

    let seguimientos = casoActual.seguimientos || [];

    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Sin actuaciones registradas</div>';
        return;
    }

    let documentosPorSeguimiento = {};

    try {
        const documentos = await obtenerDocumentosPenalApi(casoActual.id);
        documentosPorSeguimiento = agruparDocumentosPorSeguimiento(documentos);
    } catch (error) {
        console.error('Error al cargar documentos del detalle penal:', error);
    }

    const seguimientosOrdenCronologico = [...seguimientos]
        .sort((a, b) => {
            const fechaA = new Date(a.fecha_actuacion);
            const fechaB = new Date(b.fecha_actuacion);
            const diferencia = fechaA - fechaB;
            if (diferencia !== 0) return diferencia;
            return (a.id ?? 0) - (b.id ?? 0);
        })
        .map((seguimiento, index) => ({
            ...seguimiento,
            numeroActuacion: index + 1
        }))
        .reverse();

    const visibles = historialExpandido
        ? seguimientosOrdenCronologico
        : seguimientosOrdenCronologico.slice(0, MAX_ACTUACIONES_VISIBLES);
    const restantes = seguimientosOrdenCronologico.length - visibles.length;

    container.innerHTML = visibles.map((seguimiento, index) => {
        const documento = (documentosPorSeguimiento[seguimiento.id] || [])[0] || null;
        const esActuacionCierre = seguimiento.es_actuacion_cierre === true || seguimiento.es_actuacion_cierre === 't' || seguimiento.es_actuacion_cierre === '1';
        const puedeEliminarActuacion = usuarioActual?.rol !== 'consulta' && !esActuacionCierre;

        return `
            <div class="timeline-item ${index === visibles.length - 1 ? 'is-last' : ''}">
                <div class="timeline-rail" aria-hidden="true">
                    <span class="timeline-dot"></span>
                </div>
                <div class="timeline-card">
                    <div class="timeline-top timeline-top-swap">
                        <div class="timeline-meta timeline-meta-stack">
                            <span class="timeline-date-pill">${formatearFecha(seguimiento.fecha_actuacion)}</span>
                            <span class="timeline-step">Actuación ${seguimiento.numeroActuacion}</span>
                        </div>
                        <div class="timeline-chip-group">
                            <span class="timeline-type-chip">${seguimiento.tipo_actuacion || 'Sin tipo'}</span>
                            ${seguimiento.fase_nombre ? `<span class="timeline-phase-chip">${seguimiento.fase_nombre}</span>` : ''}
                            ${esActuacionCierre ? '<span class="timeline-close-chip">Cierre</span>' : ''}
                        </div>
                    </div>
                    <div class="timeline-desc">${seguimiento.descripcion || 'Sin descripción registrada.'}</div>
                    ${(documento || puedeEliminarActuacion) ? `
                    <div class="timeline-card-actions timeline-card-actions-between">
                        ${documento ? `
                        <a class="timeline-doc-link" href="${window.construirUrlApiConToken?.(`api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(documento.documento_tipo || '')}`) || `api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(documento.documento_tipo || '')}`}" target="_blank" rel="noopener noreferrer">
                            Ver PDF
                        </a>
                        <span class="timeline-doc-meta">${documento.nombre_original} - ${formatearTamanoArchivo(documento.tamano_bytes)}</span>
                        ` : ''}
                        ${puedeEliminarActuacion ? `
                        <button type="button" class="timeline-delete-btn" onclick="confirmarEliminarSeguimientoPenalDetalle(${seguimiento.id})">
                            Eliminar
                        </button>
                        ` : ''}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (seguimientosOrdenCronologico.length > MAX_ACTUACIONES_VISIBLES) {
        container.innerHTML += `
            <div class="timeline-actions">
                <button type="button" class="timeline-toggle-btn" onclick="toggleHistorialPenalDetalle()">
                    ${historialExpandido ? 'Mostrar menos' : `Mostrar ${restantes} más`}
                </button>
            </div>
        `;
    }
}

async function renderizarDocumentosPenalDetalle() {
    const container = getEl('listaDocumentosPenalDetalle');
    if (!container || !casoActual?.id) return;

    try {
        const documentos = await obtenerDocumentosPenalApi(casoActual.id);

        if (documentos.length === 0) {
            container.innerHTML = '<p class="empty-text">No hay documentos ligados a este asunto.</p>';
            return;
        }

        const grupos = ordenarDocumentosPenal(documentos).reduce((acumulado, documento) => {
            const grupo = clasificarGrupoDocumentoPenal(documento);
            if (!acumulado[grupo]) acumulado[grupo] = [];
            acumulado[grupo].push(documento);
            return acumulado;
        }, {});

        container.innerHTML = ['inicial', 'actuaciones', 'requerimientos', 'otros']
            .filter((grupo) => grupos[grupo]?.length)
            .map((grupo) => `
                <section class="documentos-grupo-penal">
                    <div class="documentos-grupo-header">
                        <h3>${obtenerTituloGrupoDocumentoPenal(grupo)}</h3>
                        <span>${grupos[grupo].length} documento${grupos[grupo].length === 1 ? '' : 's'}</span>
                    </div>
                    <div class="documentos-grupo-lista">
                        ${grupos[grupo].map(renderizarItemDocumentoPenal).join('')}
                    </div>
                </section>
            `)
            .join('');
    } catch (error) {
        console.error('Error al cargar documentos penales del detalle:', error);
        container.innerHTML = '<p class="empty-text" style="color: var(--color-danger);">No se pudieron cargar los documentos.</p>';
    }
}

function clasificarGrupoDocumentoPenal(documento) {
    const tipo = String(documento.documento_tipo || '').toUpperCase();

    if (tipo === 'ASUNTO') return 'inicial';
    if (tipo === 'ACTUACION') return 'actuaciones';
    if (tipo.startsWith('REQUERIMIENTO')) return 'requerimientos';

    return 'otros';
}

function obtenerTituloGrupoDocumentoPenal(grupo) {
    const titulos = {
        inicial: 'Documento inicial',
        actuaciones: 'Actuaciones',
        requerimientos: 'Requerimientos ministeriales',
        otros: 'Otros documentos'
    };

    return titulos[grupo] || titulos.otros;
}

function obtenerEtiquetaTipoDocumentoPenal(documento) {
    const tipo = String(documento.documento_tipo || '').toUpperCase();
    const etiquetas = {
        ASUNTO: 'Documento inicial',
        ACTUACION: 'Actuacion penal',
        REQUERIMIENTO_INICIAL: 'Requerimiento inicial de fiscalia',
        REQUERIMIENTO_INTERNO: 'Requerimiento interno',
        REQUERIMIENTO_SOLICITUD: 'Documento de solicitud',
        REQUERIMIENTO_CONTESTACION_ENVIADA: 'Contestacion enviada',
        REQUERIMIENTO_RESPUESTA_FISCALIA: 'Respuesta de fiscalia',
        REQUERIMIENTO_CONTESTACION: 'Contestacion final',
        REQUERIMIENTO: 'Requerimiento ministerial'
    };

    return etiquetas[tipo] || 'Documento penal';
}

function ordenarDocumentosPenal(documentos) {
    return [...(documentos || [])].sort((a, b) => {
        const fechaA = new Date(a.created_at || 0).getTime();
        const fechaB = new Date(b.created_at || 0).getTime();

        if (fechaA !== fechaB) return fechaB - fechaA;

        return Number(b.id || 0) - Number(a.id || 0);
    });
}

function construirUrlDocumentoPenal(documento) {
    const url = `api/downloadPenalDocument.php?id=${documento.id}&tipo=${encodeURIComponent(documento.documento_tipo || '')}`;
    return window.construirUrlApiConToken?.(url) || url;
}

function renderizarItemDocumentoPenal(documento) {
    return `
        <div class="documento-item documento-item-detalle-penal">
            <div class="documento-info">
                <span class="documento-nombre">${documento.nombre_original || 'Documento PDF'}</span>
                <span class="documento-meta">
                    ${obtenerEtiquetaTipoDocumentoPenal(documento)}
                    ${documento.created_at ? ` - ${formatearFecha(documento.created_at)}` : ''}
                    ${documento.tamano_bytes ? ` - ${formatearTamanoArchivo(documento.tamano_bytes)}` : ''}
                </span>
            </div>
            <a class="btn btn-secondary" href="${construirUrlDocumentoPenal(documento)}" target="_blank" rel="noopener noreferrer">
                Ver PDF
            </a>
        </div>
    `;
}

function toggleHistorialPenalDetalle() {
    historialExpandido = !historialExpandido;
    renderizarTimeline();
}

async function confirmarEliminarSeguimientoPenalDetalle(trackingId) {
    if (!trackingId) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar actuación',
        message: '¿Deseas eliminar esta actuación del historial?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) return;

    try {
        await eliminarSeguimientoPenalApi(trackingId);
        const casoRecargado = await obtenerCasoPenalDetalle(casoActual.id);
        if (casoRecargado) {
            casoActual = casoRecargado;
            await renderizarDetalle();
        }
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Actuación eliminada correctamente.'
        });
    } catch (error) {
        console.error('Error al eliminar actuación penal:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar la actuación',
            message: error.message || 'Ocurrió un problema al eliminar la actuación.'
        });
    }
}

window.confirmarEliminarSeguimientoPenalDetalle = confirmarEliminarSeguimientoPenalDetalle;
window.toggleHistorialPenalDetalle = toggleHistorialPenalDetalle;

async function confirmarReabrirCarpetaPenal() {
    if (!casoActual?.id) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Reabrir carpeta penal',
        message: '¿Estás seguro de reabrir esta carpeta? Regresará a TRÁMITE y permitirá nuevas actuaciones. La actuación de cierre permanecerá en el historial.',
        confirmText: 'Reabrir',
        cancelText: 'Cancelar'
    });

    if (!confirmacion) return;

    try {
        await reabrirCarpetaPenalApi(casoActual.id);
        casoActual = await obtenerCasoPenalDetalle(casoActual.id);
        mascActual = await obtenerMascPenalDetalle(casoActual.id);
        await renderizarDetalle();
        await window.appAlert?.({
            title: 'Carpeta reabierta',
            message: 'La carpeta penal regresó a trámite correctamente.'
        });
    } catch (error) {
        console.error('Error al reabrir carpeta penal:', error);
        await window.appAlert?.({
            title: 'No se pudo reabrir',
            message: error.message || 'Ocurrió un problema al reabrir la carpeta penal.'
        });
    }
}

function eliminarCaso() {
    window.appConfirm?.({
        title: 'Eliminar asunto',
        message: '¿Estás seguro de que deseas eliminar este asunto? Esta acción no se puede deshacer.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    }).then(confirmacion => {
        if (!confirmacion) return;

        return eliminarCasoPenalApi(casoActual.id)
            .then(async () => {
                await window.appAlert?.({
                    title: 'Cambio guardado',
                    message: 'Asunto eliminado.'
                });
                window.location.href = 'penal.html';
            })
            .catch(async error => {
                console.error('Error al eliminar asunto penal:', error);
                await window.appAlert?.({
                    title: 'No se pudo eliminar el asunto',
                    message: error.message || 'Ocurrió un problema al eliminar el asunto.'
                });
            });
    });
}

window.eliminarCaso = eliminarCaso;
