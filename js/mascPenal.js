let usuarioMascActual = null;
let asuntoMascActual = null;
let mascActual = null;

function mascGet(id) {
    return document.getElementById(id);
}

function setMascText(id, value, fallback = '---') {
    const element = mascGet(id);
    if (!element) return;
    element.textContent = value === null || value === undefined || value === '' ? fallback : value;
}

function formatearFechaMasc(fecha) {
    if (!fecha) return '---';
    const base = String(fecha).split('T')[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(base)) return String(fecha);
    const [anio, mes, dia] = base.split('-');
    return `${dia}/${mes}/${anio}`;
}

async function verificarSesionMasc() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (usuarioStr) {
        return JSON.parse(usuarioStr);
    }

    const response = await fetch('api/session.php', {
        method: 'GET',
        credentials: 'same-origin'
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
        window.location.href = 'login.html';
        return null;
    }

    const user = result.data?.user || {};
    const usuario = {
        id: user.id ?? null,
        usuario: user.usuario ?? '',
        nombre_completo: user.nombreCompleto ?? '',
        rol: user.rol ?? '',
        delegacion_id: user.delegacionId ?? null,
        permiso_penal: Boolean(user.permisoPenal),
        session_token: user.sessionToken ?? ''
    };
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    return usuario;
}

async function obtenerCasoMasc(id) {
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

async function obtenerMasc(id) {
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

async function guardarMascApi(payload) {
    const response = await fetch('api/savePenalMasc.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo guardar el MASC');
    }

    return result.data || {};
}

function esCarpetaConcluida() {
    return String(asuntoMascActual?.estatus || asuntoMascActual?.estatus_general || '').toUpperCase() === 'CONCLUIDO';
}

function mascBoolean(value) {
    return value === true || value === 't' || value === 'true' || value === '1' || value === 1;
}

function actualizarContadorMasc() {
    const descripcion = mascGet('descripcionMasc')?.value || '';
    setMascText('contadorDescripcionMasc', String(descripcion.length), '0');
}

function actualizarAvisoCierreMasc() {
    const aviso = mascGet('avisoCierreMasc');
    if (!aviso) return;
    aviso.style.display = mascGet('cierraCarpetaMasc')?.value === '1' ? '' : 'none';
}

function bloquearFormularioMascSoloLectura() {
    mascGet('fechaConvenioMasc')?.setAttribute('disabled', 'disabled');
    mascGet('descripcionMasc')?.setAttribute('disabled', 'disabled');
    mascGet('cierraCarpetaMasc')?.setAttribute('disabled', 'disabled');
    const btnGuardar = mascGet('btnGuardarMasc');
    if (btnGuardar) btnGuardar.style.display = 'none';
}

function renderizarMasc() {
    const numero = asuntoMascActual?.numero_expediente || asuntoMascActual?.numero_carpeta || '---';
    const estatus = String(asuntoMascActual?.estatus || asuntoMascActual?.estatus_general || 'TRAMITE').toUpperCase();
    const detalleHref = `detalleCasoPenal.html?id=${encodeURIComponent(asuntoMascActual.id)}`;

    document.querySelector('.app-header')?.setAttribute('data-back-href', detalleHref);
    mascGet('breadcrumbDetalleMasc')?.setAttribute('href', detalleHref);
    mascGet('btnCancelarMasc')?.setAttribute('href', detalleHref);
    setMascText('mascNumeroCarpeta', numero);
    setMascText('mascEstatus', estatus === 'CONCLUIDO' ? 'Concluido' : 'En trámite');

    const fechaInput = mascGet('fechaConvenioMasc');
    if (fechaInput) {
        fechaInput.min = asuntoMascActual.fecha_presentacion_denuncia || asuntoMascActual.fecha_inicio || '';
    }

    if (mascActual?.id) {
        setMascText('tituloMascPenal', 'Ver/Editar MASC');
        mascGet('mascModoEdicionInfo')?.removeAttribute('style');
        if (fechaInput) fechaInput.value = String(mascActual.fecha_convenio || '').split('T')[0];
        const descripcion = mascGet('descripcionMasc');
        if (descripcion) descripcion.value = mascActual.descripcion || '';
        const cierra = mascGet('cierraCarpetaMasc');
        if (cierra) cierra.value = mascBoolean(mascActual.cierra_carpeta) ? '1' : '0';

        if (usuarioMascActual?.rol !== 'admin') {
            bloquearFormularioMascSoloLectura();
        }
    } else if (usuarioMascActual?.rol === 'consulta' || usuarioMascActual?.rol === 'jefe') {
        bloquearFormularioMascSoloLectura();
    }

    actualizarContadorMasc();
    actualizarAvisoCierreMasc();
}

function obtenerPayloadMasc() {
    const fechaConvenio = mascGet('fechaConvenioMasc')?.value || '';
    const descripcion = mascGet('descripcionMasc')?.value?.trim() || '';
    const cierraCarpeta = mascGet('cierraCarpetaMasc')?.value === '1';
    const fechaMinima = asuntoMascActual?.fecha_presentacion_denuncia || asuntoMascActual?.fecha_inicio || '';

    if (!fechaConvenio) {
        throw new Error('Captura la fecha del convenio MASC');
    }

    if (fechaMinima && fechaConvenio < fechaMinima) {
        throw new Error('La fecha del convenio MASC no puede ser menor a la fecha de denuncia / querella');
    }

    if (!descripcion) {
        throw new Error('Captura la descripción del convenio MASC');
    }

    if (descripcion.length > 1000) {
        throw new Error('La descripción del convenio MASC no puede exceder 1000 caracteres');
    }

    return {
        asunto_id: asuntoMascActual.id,
        fecha_convenio: fechaConvenio,
        descripcion,
        cierra_carpeta: cierraCarpeta
    };
}

async function guardarMasc(event) {
    event.preventDefault();

    try {
        const payload = obtenerPayloadMasc();

        if (payload.cierra_carpeta && !mascActual?.id) {
            const confirmacion = await window.appConfirm?.({
                title: 'Cerrar carpeta por MASC',
                message: 'Al guardar, la carpeta pasará a estatus Concluido y se generará una actuación de cierre automática.',
                confirmText: 'Guardar y cerrar',
                cancelText: 'Cancelar'
            });
            if (!confirmacion) return;
        }

        await window.mostrarCargaVista?.('.container', 'Guardando MASC...');
        await guardarMascApi(payload);
        await window.appAlert?.({
            title: 'MASC guardado',
            message: 'El MASC se guardó correctamente.'
        });
        window.location.href = `detalleCasoPenal.html?id=${encodeURIComponent(asuntoMascActual.id)}`;
    } catch (error) {
        await window.appAlert?.({
            title: 'No se pudo guardar',
            message: error.message || 'Ocurrió un problema al guardar el MASC.'
        });
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    usuarioMascActual = await verificarSesionMasc();
    if (!usuarioMascActual) return;

    const params = new URLSearchParams(window.location.search);
    const asuntoId = parseInt(params.get('id') || '', 10);

    if (!Number.isInteger(asuntoId) || asuntoId <= 0) {
        await window.appAlert?.({
            title: 'Asunto no válido',
            message: 'No se especificó un asunto penal válido.'
        });
        window.location.href = 'penal.html';
        return;
    }

    await window.mostrarCargaVista?.('.container');

    try {
        asuntoMascActual = await obtenerCasoMasc(asuntoId);
        mascActual = await obtenerMasc(asuntoId);

        if (!asuntoMascActual) {
            throw new Error('No se encontró el asunto penal');
        }

        renderizarMasc();
        mascGet('descripcionMasc')?.addEventListener('input', actualizarContadorMasc);
        mascGet('cierraCarpetaMasc')?.addEventListener('change', actualizarAvisoCierreMasc);
        mascGet('formMascPenal')?.addEventListener('submit', guardarMasc);
    } catch (error) {
        await window.appAlert?.({
            title: 'Carga fallida',
            message: error.message || 'No se pudo cargar el MASC.'
        });
        window.location.href = 'penal.html';
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});
