let usuarioAmpActual = null;
let asuntoAmpActual = null;

function obtenerHoyIsoAmp() {
    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
}

async function verificarSesionAmp() {
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
                alcance_global: Boolean(user.alcanceGlobal),
                es_abogado: Boolean(user.esAbogado),
                es_jefe: Boolean(user.esJefe),
                session_token: user.sessionToken ?? ''
            };

            sessionStorage.setItem('usuario', JSON.stringify(usuario));
            return usuario;
        }
    } catch (error) {
        console.error('No se pudo recuperar la sesión:', error);
    }

    window.location.href = 'login.html';
    return null;
}

async function obtenerAsuntoAmp(id) {
    const response = await fetch(`api/getPenalAmpCase.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el asunto penal');
    }

    return result.data?.case || null;
}

async function guardarConocimientoAmp(payload) {
    const response = await fetch('api/savePenalAmpKnowledge.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        const detail = result.errors?.detail ? `: ${result.errors.detail}` : '';
        throw new Error((result.message || 'No se pudo guardar el registro AMP') + detail);
    }

    return result.data || {};
}

function formatearFechaVisual(fechaIso) {
    if (!fechaIso) return '---';

    const partes = String(fechaIso).split('-');
    if (partes.length !== 3) return fechaIso;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function validarFechaIso(fecha) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(fecha || ''));
}

function cargarResumenAmp() {
    document.getElementById('resumenExpediente').textContent = asuntoAmpActual?.numero_carpeta || '---';
    document.getElementById('resumenDelito').textContent = asuntoAmpActual?.delito_nombre || '---';
    document.getElementById('resumenEstatus').textContent = asuntoAmpActual?.estatus_general || '---';
}

function inicializarNavegacionAmp() {
    const linkDetalle = document.getElementById('linkDetalle');
    const breadcrumbExpediente = document.getElementById('breadcrumbExpediente');
    const btnCancelarAmp = document.getElementById('btnCancelarAmp');
    const btnIrActuacion = document.getElementById('btnIrActuacion');

    if (linkDetalle && asuntoAmpActual?.id) {
        linkDetalle.href = `detalleCasoPenal.html?id=${asuntoAmpActual.id}`;
    }

    if (btnCancelarAmp && asuntoAmpActual?.id) {
        btnCancelarAmp.href = `detalleCasoPenal.html?id=${asuntoAmpActual.id}`;
    }

    if (breadcrumbExpediente) {
        breadcrumbExpediente.textContent = `Registro AMP: ${asuntoAmpActual?.numero_carpeta || ''}`;
    }

    if (btnIrActuacion && asuntoAmpActual?.id) {
        btnIrActuacion.href = `registroActuacionPenal.html?id=${asuntoAmpActual.id}`;
    }
}

function cargarValorInicialFechaAmp() {
    const inputFecha = document.getElementById('fechaActuacion');
    if (!inputFecha) return;

    if (asuntoAmpActual?.fecha_conocimiento_amp) {
        inputFecha.value = asuntoAmpActual.fecha_conocimiento_amp;
        return;
    }

    const hoy = new Date();
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    inputFecha.value = `${yyyy}-${mm}-${dd}`;
}

function syncFechaAmpMin() {
    const inputFecha = document.getElementById('fechaActuacion');
    const fechaPresentacion = asuntoAmpActual?.fecha_presentacion_denuncia || '';

    if (!inputFecha) {
        return;
    }

    inputFecha.min = validarFechaIso(fechaPresentacion) ? fechaPresentacion : '';
    inputFecha.max = obtenerHoyIsoAmp();

    if (inputFecha.min && inputFecha.value && inputFecha.value < inputFecha.min) {
        inputFecha.value = '';
    }

    if (inputFecha.max && inputFecha.value && inputFecha.value > inputFecha.max) {
        inputFecha.value = '';
    }
}

function actualizarModoFormularioAmp() {
    const tieneFechaAmp = Boolean(asuntoAmpActual?.fecha_conocimiento_amp || asuntoAmpActual?.fecha_conocimiento_fiscal);
    const esEdicionAdmin = usuarioAmpActual?.rol === 'admin' && tieneFechaAmp;
    const tituloFormulario = document.getElementById('tituloFormularioAmp');
    const btnSubmit = document.getElementById('btnGuardarAmp');

    if (tituloFormulario) {
        tituloFormulario.textContent = esEdicionAdmin
            ? 'Editar fecha de conocimiento del AMP'
            : 'Fecha de conocimiento del AMP';
    }

    if (btnSubmit) {
        btnSubmit.textContent = esEdicionAdmin
            ? 'Actualizar fecha AMP'
            : 'Guardar registro';
    }
}

async function guardarRegistroAmp(event) {
    event.preventDefault();

    const inputFecha = document.getElementById('fechaActuacion');
    const btnSubmit = document.querySelector('#formActualizar button[type="submit"]');

    const fechaConocimientoAmp = inputFecha?.value?.trim() || '';
    const fechaPresentacion = asuntoAmpActual?.fecha_presentacion_denuncia || '';

    if (!validarFechaIso(fechaConocimientoAmp)) {
        await window.appAlert?.({
            title: 'Fecha inválida',
            message: 'Debes capturar una fecha válida de conocimiento del AMP.'
        });
        return;
    }

    if (validarFechaIso(fechaPresentacion) && fechaConocimientoAmp < fechaPresentacion) {
        await window.appAlert?.({
            title: 'Inconsistencia de Fechas',
            message: 'La fecha de conocimiento del AMP no puede ser menor a la fecha de presentación de la denuncia / querella.'
        });
        return;
    }

    if (fechaConocimientoAmp > obtenerHoyIsoAmp()) {
        await window.appAlert?.({
            title: 'Fecha invÃ¡lida',
            message: 'La fecha de conocimiento del AMP no puede ser posterior a hoy.'
        });
        return;
    }

    try {
        if (btnSubmit) {
            btnSubmit.disabled = true;
        }

        await guardarConocimientoAmp({
            asunto_id: asuntoAmpActual.id,
            fecha_conocimiento_amp: fechaConocimientoAmp
        });
        sessionStorage.setItem('penalAmpCacheDirty', '1');
        localStorage.removeItem('casosPenal');

        await window.appAlert?.({
            title: 'Registro guardado',
            message: 'La fecha de conocimiento del AMP se guardó correctamente.'
        });

        window.location.href = 'penal.html';
    } catch (error) {
        console.error('Error al guardar registro AMP:', error);

        await window.appAlert?.({
            title: 'No se pudo guardar',
            message: error.message || 'Ocurrió un error al guardar el registro AMP.'
        });
    } finally {
        if (btnSubmit) {
            btnSubmit.disabled = false;
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const usuario = await verificarSesionAmp();
    if (!usuario) return;
    usuarioAmpActual = usuario;

    const params = new URLSearchParams(window.location.search);
    const asuntoId = parseInt(params.get('id'), 10);

    if (!asuntoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto penal válido.'
        });
        window.location.href = 'penal.html';
        return;
    }

    try {
        await window.mostrarCargaVista?.('.container');

        asuntoAmpActual = await obtenerAsuntoAmp(asuntoId);

        if (!asuntoAmpActual) {
            throw new Error('No se encontró el asunto penal');
        }

        if (String(asuntoAmpActual.estatus_general || asuntoAmpActual.estatus || '').toUpperCase() === 'CONCLUIDO') {
            window.location.href = 'penal.html';
            return;
        }

        if ((asuntoAmpActual.fecha_conocimiento_amp || asuntoAmpActual.fecha_conocimiento_fiscal) && usuarioAmpActual.rol !== 'admin') {
            await window.appAlert?.({
                title: 'Registro AMP ya capturado',
                message: 'Este asunto ya tiene registrada la fecha de conocimiento del AMP.'
            });
            window.location.href = `detalleCasoPenal.html?id=${asuntoAmpActual.id}`;
            return;
        }

        cargarResumenAmp();
        inicializarNavegacionAmp();
        cargarValorInicialFechaAmp();
        syncFechaAmpMin();
        actualizarModoFormularioAmp();

        const form = document.getElementById('formActualizar');
        if (form) {
            form.addEventListener('submit', guardarRegistroAmp);
        }
    } catch (error) {
        console.error('Error al cargar módulo AMP:', error);

        await window.appAlert?.({
            title: 'No se pudo cargar',
            message: error.message || 'No se pudo cargar el registro de conocimiento del AMP.'
        });

        window.location.href = 'penal.html';
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});
