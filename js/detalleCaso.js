// =====================================================
// DETALLE DEL CASO
// =====================================================

let casoActual = null;
let usuarioActual = null;
let historialExpandido = false;
const MAX_ACTUALIZACIONES_VISIBLES = 5;
let catalogos = {
    delegaciones: [],
    areas: {},
    organosJurisdiccionales: [],
    prestaciones: [],
    abogadosResponsables: []
};

function obtenerDelegacionCivilDetalle(id) {
    if (!id) return null;
    return (catalogos.delegaciones || []).find(delegacion => delegacion.id == id) || null;
}

function actualizarHeaderCivilDetalle(usuario) {
    if (!usuario) return;

    setTextoSeguro('nombreUsuario', usuario.nombre_completo);

    const badgeRol = document.getElementById('badgeRol');
    if (badgeRol) {
        const rolesTexto = { admin: 'Admin', jefe: 'Jefe', editor: 'Editor', consulta: 'Consulta' };
        badgeRol.textContent = rolesTexto[usuario.rol] || usuario.rol || '';
        badgeRol.className = 'badge-rol badge-rol-' + (usuario.rol || '');
    }

    const infoOOAD = document.getElementById('infoOOAD');
    if (infoOOAD) {
        if (usuario.delegacion_id) {
            const delegacion = obtenerDelegacionCivilDetalle(usuario.delegacion_id);
            infoOOAD.textContent = delegacion?.nombre || 'Todas las JSJ';
        } else {
            infoOOAD.textContent = 'Todas las JSJ';
        }
    }
}

function puedeReasignarAbogadoCivil(usuario, caso = casoActual) {
    if (!usuario || !caso) {
        return false;
    }

    if (usuario.rol === 'admin') {
        return true;
    }

    if (usuario.rol !== 'editor' || !Boolean(usuario.es_jefe)) {
        return false;
    }

    return parseInt(usuario.delegacion_id, 10) === parseInt(caso.delegacion_id, 10);
}

function agruparPorClave(items, key) {
    return (items || []).reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }

        acc[groupKey].push(item);
        return acc;
    }, {});
}

async function cargarCatalogosDetalle() {
    const response = await fetch('api/getCatalogs.php', {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los catalogos');
    }

    const data = result.data || {};
    catalogos = {
        delegaciones: data.delegaciones || [],
        areas: agruparPorClave(data.areas || [], 'delegacion_id'),
        organosJurisdiccionales: data.organosJurisdiccionales || [],
        prestaciones: data.prestaciones || [],
        abogadosResponsables: data.abogadosResponsables || []
    };

    window.catalogos = catalogos;
}

async function obtenerCasoCivilDetalle(id) {
    const response = await fetch(`api/getCivilCase.php?id=${encodeURIComponent(id)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo cargar el caso');
    }

    return result.data?.case || null;
}

async function obtenerDocumentosCivilApi(expedienteId) {
    const response = await fetch(`api/getCivilDocuments.php?expediente_id=${encodeURIComponent(expedienteId)}`, {
        method: 'GET',
        credentials: 'same-origin'
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudieron cargar los documentos');
    }

    return result.data?.documentos || [];
}

async function eliminarSeguimientoCivilApi(id) {
    const response = await fetch('api/deleteCivilTracking.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({ id })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo eliminar el seguimiento');
    }

    return result.data || {};
}

async function refrescarSesionDetalleCivil() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }

    const usuarioLocal = JSON.parse(usuarioStr);

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
                alcance_global: Boolean(user.alcanceGlobal),
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
        console.error('No se pudo refrescar la sesion del detalle civil:', error);
    }

    return usuarioLocal;
}

async function reasignarAbogadoCivilApi(caseId, abogadoResponsableId) {
    const response = await fetch('api/reassignCivilLawyer.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
            case_id: caseId,
            abogado_responsable_id: abogadoResponsableId
        })
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
        throw new Error(result.message || 'No se pudo reasignar el abogado');
    }

    return result.data || {};
}

function formatearTamanoArchivo(bytes) {
    if (!bytes || Number.isNaN(Number(bytes))) {
        return '0 KB';
    }

    const size = Number(bytes);

    if (size >= 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.max(1, Math.round(size / 1024))} KB`;
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

// Verificar sesion
document.addEventListener('DOMContentLoaded', async function () {
    const usuario = await refrescarSesionDetalleCivil();
    if (!usuario) return;
    usuarioActual = usuario;
    actualizarHeaderCivilDetalle(usuario);
    window.mostrarCargaVista?.('.container');

    if (!usuario.permiso_civil_mercantil && usuario.rol !== 'admin') {
        window.location.href = usuario.permiso_penal ? 'penal.html' : 'login.html';
        return;
    }

    // Ocultar botones de accion según rol
    if (usuario.rol === 'consulta') {
        const btnEditar = document.getElementById('btnEditar');
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnEditar) btnEditar.style.display = 'none';
        if (btnActualizar) btnActualizar.style.display = 'none';
    } else if (usuario.rol === 'editor') {
        const btnEditar = document.getElementById('btnEditar');
        if (btnEditar) btnEditar.style.display = 'none';
    }

    try {
        try {
            await cargarCatalogosDetalle();
            actualizarHeaderCivilDetalle(usuario);
        } catch (err) {
            console.warn('No se pudieron cargar catalogos desde la API local:', err);
            window.catalogos = { delegaciones: [], areas: {}, organosJurisdiccionales: [], prestaciones: [], abogadosResponsables: [] };
        }

        await cargarDetalleCaso();
        configurarControlesReasignacionAbogado();
    } finally {
        await window.ocultarCargaVista?.('.container');
    }
});

async function cerrarSesion() {
    try {
        await fetch('api/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Error al cerrar sesion:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}

window.cerrarSesion = cerrarSesion;

async function cargarDetalleCaso() {
    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        await window.appAlert?.({
            title: 'Asunto no disponible',
            message: 'No se especificó un asunto.'
        });
        window.location.href = 'casos.html';
        return;
    }

    try {
        casoActual = await obtenerCasoCivilDetalle(casoId);
    } catch (err) {
        console.warn('No se pudo cargar desde la API local, usando cache local:', err);
        const casosGuardados = localStorage.getItem('casos');
        const casos = casosGuardados ? JSON.parse(casosGuardados) : (typeof casosFake !== 'undefined' ? casosFake : []);
        casoActual = casos.find(c => c.id === casoId);
    }

    if (!casoActual) {
        await window.appAlert?.({
            title: 'Asunto no encontrado',
            message: 'No se encontró el asunto solicitado.'
        });
        window.location.href = 'casos.html';
        return;
    }

    await renderizarCaso();
}

// === FUNCION AUXILIAR: Setear texto con null check ===
function setTextoSeguro(id, texto) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = texto || '---';
    }
}

// === FUNCION AUXILIAR: Setear HTML con null check ===
function setHtmlSeguro(id, html) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = html || '---';
    }
}

function obtenerNumeroPadreAcumulacion() {
    if (!casoActual?.acumulado_a) {
        return null;
    }

    const casosGuardados = localStorage.getItem('casos');
    const casos = casosGuardados ? JSON.parse(casosGuardados) : (typeof casosFake !== 'undefined' ? casosFake : []);
    const casoPadre = casos.find(c => c.id === casoActual.acumulado_a);

    return casoPadre?.numero_expediente || `ID ${casoActual.acumulado_a}`;
}

function esCasoAcumulado() {
    return Boolean(casoActual?.acumulado_a);
}

function actualizarBloqueoPorAcumulacion() {
    const estaAcumulado = esCasoAcumulado();
    const btnEditar = document.getElementById('btnEditar');
    const btnActualizar = document.getElementById('btnActualizar');
    const alerta = document.getElementById('caseAccumulationAlert');
    const alertaTexto = document.getElementById('caseAccumulationAlertText');

    if (estaAcumulado) {
        const numeroPadre = obtenerNumeroPadreAcumulacion();

        if (btnEditar) btnEditar.style.display = 'none';
        if (btnActualizar) btnActualizar.style.display = 'none';

        if (alerta && alertaTexto) {
            alertaTexto.textContent = `Este asunto esta acumulado al expediente ${numeroPadre}. No puede editarse ni actualizarse mientras permanezca acumulado.`;
            alerta.style.display = 'block';
        }

        return;
    }

    if (alerta) {
        alerta.style.display = 'none';
    }

    if (usuarioActual?.rol === 'consulta') {
        if (btnEditar) btnEditar.style.display = 'none';
        if (btnActualizar) btnActualizar.style.display = 'none';
        return;
    }

    if (usuarioActual?.rol === 'editor') {
        if (btnEditar) btnEditar.style.display = 'none';
    }
}

function configurarControlesReasignacionAbogado() {
    const acciones = document.getElementById('responsableActions');
    const boton = document.getElementById('btnReasignarAbogado');
    const guardar = document.getElementById('btnGuardarReasignacionAbogado');
    const modal = document.getElementById('modalReasignarAbogado');

    if (!acciones || !boton || !guardar || !modal) {
        return;
    }

    acciones.style.display = puedeReasignarAbogadoCivil(usuarioActual, casoActual) ? 'block' : 'none';

    if (!boton.dataset.bound) {
        boton.addEventListener('click', abrirModalReasignarAbogado);
        boton.dataset.bound = 'true';
    }

    if (!guardar.dataset.bound) {
        guardar.addEventListener('click', guardarReasignacionAbogado);
        guardar.dataset.bound = 'true';
    }

    if (!modal.dataset.bound) {
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                cerrarModalReasignarAbogado();
            }
        });
        modal.dataset.bound = 'true';
    }
}

function llenarOpcionesReasignacionAbogado() {
    const select = document.getElementById('selectReasignarAbogado');
    if (!select) {
        return;
    }

    const abogados = Array.isArray(catalogos.abogadosResponsables) ? catalogos.abogadosResponsables : [];
    const abogadosDisponibles = usuarioActual?.rol === 'admin'
        ? abogados
        : abogados.filter(abogado => parseInt(abogado.delegacion_id, 10) === parseInt(usuarioActual?.delegacion_id, 10));

    select.innerHTML = '<option value="">Seleccione...</option>';

    abogadosDisponibles.forEach(abogado => {
        const option = document.createElement('option');
        option.value = String(abogado.id);
        option.textContent = abogado.nombre_completo;
        select.appendChild(option);
    });

    if (casoActual?.abogado_responsable_id) {
        select.value = String(casoActual.abogado_responsable_id);
    }
}

function abrirModalReasignarAbogado() {
    if (!puedeReasignarAbogadoCivil(usuarioActual, casoActual)) {
        return;
    }

    setTextoSeguro('reasignarNumeroAsunto', casoActual?.numero_expediente || '---');
    setTextoSeguro('reasignarAbogadoActual', casoActual?.abogado_responsable_nombre || 'Sin asignar');
    llenarOpcionesReasignacionAbogado();

    const modal = document.getElementById('modalReasignarAbogado');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function cerrarModalReasignarAbogado() {
    const modal = document.getElementById('modalReasignarAbogado');
    if (modal) {
        modal.style.display = 'none';
    }
}

async function guardarReasignacionAbogado() {
    if (!casoActual?.id) {
        return;
    }

    const select = document.getElementById('selectReasignarAbogado');
    const botonGuardar = document.getElementById('btnGuardarReasignacionAbogado');
    const nuevoId = parseInt(select?.value || '', 10);

    if (!nuevoId) {
        await window.appAlert?.({
            title: 'Seleccion requerida',
            message: 'Selecciona un abogado responsable.'
        });
        return;
    }

    if (nuevoId === parseInt(casoActual.abogado_responsable_id || 0, 10)) {
        cerrarModalReasignarAbogado();
        return;
    }

    try {
        if (botonGuardar) {
            botonGuardar.disabled = true;
        }

        await reasignarAbogadoCivilApi(casoActual.id, nuevoId);
        cerrarModalReasignarAbogado();
        await cargarDetalleCaso();
        configurarControlesReasignacionAbogado();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'El abogado responsable fue reasignado correctamente.'
        });
    } catch (error) {
        console.error('No se pudo reasignar el abogado responsable:', error);
        await window.appAlert?.({
            title: 'No se pudo reasignar',
            message: error.message || 'Ocurrio un error al reasignar el abogado responsable.'
        });
    } finally {
        if (botonGuardar) {
            botonGuardar.disabled = false;
        }
    }
}

async function renderizarCaso() {
    if (!casoActual) return;

    // === HEADER ===
    setTextoSeguro('numeroExpediente', casoActual.numero_expediente);
    setTextoSeguro('breadcrumbExpediente', casoActual.numero_expediente);

    const badgeEstatus = document.getElementById('badgeEstatus');
    if (badgeEstatus) {
        badgeEstatus.textContent = casoActual.estatus === 'TRAMITE' ? 'En Tramite' : 'Concluido';
        badgeEstatus.className = 'badge-estatus ' + (casoActual.estatus === 'TRAMITE' ? 'badge-tramite' : 'badge-concluido');
    }

    actualizarBloqueoPorAcumulacion();

    // Fecha creacion
    if (casoActual.fecha_creacion) {
        const fecha = new Date(casoActual.fecha_creacion);
        const ddC = String(fecha.getDate()).padStart(2, '0');
        const mmC = String(fecha.getMonth() + 1).padStart(2, '0');
        const yyyyC = fecha.getFullYear();
        const hhC = String(fecha.getHours()).padStart(2, '0');
        const minC = String(fecha.getMinutes()).padStart(2, '0');
        setTextoSeguro('fechaCreacion', `${ddC}/${mmC}/${yyyyC} ${hhC}:${minC}`);
    }

    // Fecha actualizacion (CON NULL CHECK - ESTO ERA EL ERROR)
    const fechaActInfo = document.getElementById('fechaActualizacionInfo');
    const fechaAct = document.getElementById('fechaActualizacion');
    
    if (fechaActInfo && fechaAct && casoActual.fecha_actualizacion && casoActual.fecha_actualizacion !== casoActual.fecha_creacion) {
        const fa = new Date(casoActual.fecha_actualizacion);
        const ddA = String(fa.getDate()).padStart(2, '0');
        const mmA = String(fa.getMonth() + 1).padStart(2, '0');
        const yyyyA = fa.getFullYear();
        const hhA = String(fa.getHours()).padStart(2, '0');
        const minA = String(fa.getMinutes()).padStart(2, '0');
        fechaAct.textContent = `${ddA}/${mmA}/${yyyyA} ${hhA}:${minA}`;
        fechaActInfo.style.display = 'inline';
    } else if (fechaActInfo) {
        fechaActInfo.style.display = 'none';
    }

    // === DATOS DEL REGISTRO ===
    if (typeof catalogos !== 'undefined') {
        const delegacion = catalogos.delegaciones?.find(d => d.id === casoActual.delegacion_id);
        setTextoSeguro('delegacion', delegacion?.nombre || '---');

        const areas = catalogos.areas?.[casoActual.delegacion_id] || [];
        const area = areas.find(a => a.id === casoActual.area_generadora_id);
        setTextoSeguro('area', area?.nombre || '---');
    } else {
        setTextoSeguro('delegacion', casoActual.delegacion || '---');
        setTextoSeguro('area', casoActual.area_generadora || '---');
    }

    setTextoSeguro('jurisdiccion', casoActual.jurisdiccion || '---');

    setTextoSeguro('materia', casoActual.tipo_juicio || '---');
    setTextoSeguro('tipoProcedimiento', casoActual.subtipo_juicio || '---');
    setTextoSeguro('viaProcedimiento', casoActual.sub_subtipo_juicio || '---');

    if (typeof catalogos !== 'undefined') {
        const organo = catalogos.organosJurisdiccionales?.find(t => t.id === casoActual.organo_jurisdiccional_id);
        setTextoSeguro('tribunal', casoActual.organo_jurisdiccional_nombre || organo?.nombre || '---');
        setTextoSeguro('circuitoTribunal', casoActual.organo_jurisdiccional_circuito || organo?.circuito || '---');
    } else {
        setTextoSeguro('tribunal', casoActual.organo_jurisdiccional_nombre || '---');
        setTextoSeguro('circuitoTribunal', '---');
    }

    setTextoSeguro('fechaInicio', formatearFecha(casoActual.fecha_inicio));
    setTextoSeguro('imssEs', casoActual.imss_es || '---');

    // === PRESTACIONES (Compatibilidad + Nuevo formato tabla) ===
    const prestacionesBody = document.getElementById('prestacionesBody');
    const prestacionesCount = document.getElementById('prestacionesCount');
    
    if (prestacionesBody) {
        const principalId = casoActual.prestacion_principal || null;
        const secundariasIds = casoActual.prestaciones_secundarias || [];
        let prestacionesRender = [];

        // Modelo nuevo: principal + secundarias
        if (principalId && typeof catalogos !== 'undefined') {
            const principal = catalogos.prestaciones?.find(p => p.id === principalId);
            if (principal) {
                prestacionesRender.push({ tipo: 'principal', descripcion: principal.nombre });
            }
        }

        if (secundariasIds.length > 0 && typeof catalogos !== 'undefined') {
            secundariasIds.forEach(id => {
                const p = catalogos.prestaciones?.find(pr => pr.id === id);
                if (p) {
                    prestacionesRender.push({ tipo: 'secundaria', descripcion: p.nombre });
                }
            });
        }

        // Fallback: modelo antiguo
        if (prestacionesRender.length === 0) {
            const prestacionesIds = obtenerPrestacionesDelCaso();
            if (prestacionesIds.length > 0 && typeof catalogos !== 'undefined') {
                prestacionesIds.forEach(id => {
                    const p = catalogos.prestaciones?.find(pr => pr.id === id);
                    if (p) {
                        prestacionesRender.push({ tipo: prestacionesRender.length === 0 ? 'principal' : 'secundaria', descripcion: p.nombre });
                    }
                });
            }
        }

        // Renderizar tabla
        if (prestacionesRender.length > 0) {
            if (prestacionesCount) {
                prestacionesCount.textContent = `(${prestacionesRender.length} prestaciones)`;
                prestacionesCount.style.display = 'inline';
            }
            prestacionesBody.innerHTML = prestacionesRender.map((p, i) => `
                <tr>
                    <td class="prestacion-num">${i + 1}</td>
                    <td><span class="prestacion-tipo ${p.tipo}">${p.tipo === 'principal' ? 'Principal' : 'Secundaria'}</span></td>
                    <td class="prestacion-desc">${p.descripcion}</td>
                </tr>
            `).join('');
        } else {
            if (prestacionesCount) prestacionesCount.style.display = 'none';
            prestacionesBody.innerHTML = `
                <tr>
                    <td class="prestacion-num">1</td>
                    <td><span class="prestacion-tipo principal">Principal</span></td>
                    <td class="prestacion-desc" id="prestacion">---</td>
                </tr>
            `;
        }
    }

    // Importe (mantener compatibilidad con tu formato)
    const importeElem = document.getElementById('importeDemandado');
    if (importeElem) {
        if (casoActual.importe_demandado === 0 || !casoActual.importe_demandado) {
            importeElem.innerHTML = '<span class="sin-cuantia">Sin cuantía</span>';
        } else {
            const importeFormateado = Number(casoActual.importe_demandado).toLocaleString('es-MX', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
            importeElem.innerHTML = '<span class="info-value-importe">$' + importeFormateado + ' MXN</span>';
        }
    }

    // Notas de prestaciones
    const notasField = document.getElementById('prestacionesNotas');
    const seccionNotas = document.getElementById('seccionNotas');
    if (notasField) {
        if (casoActual.prestaciones_notas && casoActual.prestaciones_notas.trim() !== '') {
            notasField.textContent = casoActual.prestaciones_notas;
            if (seccionNotas) seccionNotas.style.display = 'block';
        } else {
            notasField.innerHTML = '<span class="info-vacio">Sin comentarios</span>';
            if (seccionNotas) seccionNotas.style.display = 'none';
        }
    }

    // Abogado Responsable
    const abogado = casoActual.abogado_responsable_nombre || null;
    const abogadoElem = document.getElementById('abogadoResponsable');
    if (abogadoElem) {
        if (abogado) {
            abogadoElem.textContent = abogado;
            // Limpiar el span "Sin asignar" si existe
            const vacio = abogadoElem.querySelector('.info-vacio');
            if (vacio) vacio.remove();
        } else {
            abogadoElem.innerHTML = '<span class="info-vacio">Sin asignar</span>';
        }
    }
    configurarControlesReasignacionAbogado();

    // Pronóstico
    const pronostico = casoActual.pronostico || (casoActual.seguimiento?.pronostico) || null;
    const pronosticoElem = document.getElementById('pronostico');
    if (pronosticoElem) {
        if (pronostico) {
            const color = pronostico.toLowerCase().includes('favorable') ? '#10b981' : 
                         pronostico.toLowerCase().includes('desfavorable') ? '#ef4444' : '#f59e0b';
            pronosticoElem.innerHTML = `<span style="color: ${color}; font-weight: 600;">${pronostico}</span>`;
        } else {
            pronosticoElem.innerHTML = '<span class="info-vacio">Sin información</span>';
        }
    }

    // === PARTES INVOLUCRADAS (Nuevo formato compacto) ===
    
    // Actores
    const actores = obtenerActoresDelCaso();
    renderizarPartesCompactas('Actor', actores);
    
    // Demandados
    if (casoActual.demandados && Array.isArray(casoActual.demandados)) {
        renderizarPartesCompactas('Demandado', casoActual.demandados);
    }
    
    // Codemandados
    if (casoActual.codemandados && Array.isArray(casoActual.codemandados)) {
        renderizarPartesCompactas('Codemandado', casoActual.codemandados);
    }

    // === ACUMULADOS ===
    const seccionAcumulado = document.getElementById('seccionAcumulado');
    if (casoActual.acumulado_a && seccionAcumulado) {
        const casosGuardados = localStorage.getItem('casos');
        const casos = casosGuardados ? JSON.parse(casosGuardados) : (typeof casosFake !== 'undefined' ? casosFake : []);
        const casoPadre = casos.find(c => c.id === casoActual.acumulado_a);

        seccionAcumulado.style.display = 'block';
        const acumuladoElem = document.getElementById('acumuladoA');
        if (acumuladoElem) {
            if (casoPadre) {
                acumuladoElem.innerHTML = `<a href="detalleCaso.html?id=${casoPadre.id}" style="color: #621132; text-decoration: none; font-weight: 500;">${casoPadre.numero_expediente}</a>`;
            } else {
                acumuladoElem.textContent = '---';
            }
        }
    }

    // Juicios acumulados
    const seccionJuiciosAcum = document.getElementById('seccionJuiciosAcumulados');
    if (casoActual.juicios_acumulados?.length > 0 && seccionJuiciosAcum) {
        const casosGuardados = localStorage.getItem('casos');
        const casos = casosGuardados ? JSON.parse(casosGuardados) : (typeof casosFake !== 'undefined' ? casosFake : []);

        seccionJuiciosAcum.style.display = 'block';
        const casosAcumulados = casoActual.juicios_acumulados
            .map(id => casos.find(c => c.id === id))
            .filter(c => c);

        const juiciosInfo = document.getElementById('juiciosAcumuladosInfo');
        if (juiciosInfo && casosAcumulados.length > 0) {
            juiciosInfo.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                    ${casosAcumulados.map(c => `
                        <a href="detalleCaso.html?id=${c.id}" 
                           style="padding: 6px 12px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; color: #621132; text-decoration: none; font-size: 0.9rem; font-weight: 500;">
                            ${c.numero_expediente}
                        </a>
                    `).join('')}
                </div>
            `;
        }
    }

    // === SEGUIMIENTO DEL ASUNTO ===
    await renderizarSeguimiento();

    // Verificar botón actualizar
    verificarBotonActualizar();
}

// === RENDERIZAR PARTES EN FORMATO COMPACTO ===
/*function renderizarPartesCompactas(tipo, partes, imssEs) {
    const seccion = document.getElementById(`seccion${tipo}`);
    const lista = document.getElementById(`${tipo.toLowerCase()}Info`);
    const count = document.getElementById(`${tipo.toLowerCase()}Count`);
    
    if (!seccion || !lista) return;
    
    // Filtrar si el IMSS es esta parte
    const filtroImss = (tipo === 'Actor' && imssEs === 'ACTOR') || 
                       (tipo === 'Demandado' && imssEs === 'DEMANDADO');
    
    if (filtroImss || !partes || !Array.isArray(partes) || partes.length === 0) {
        seccion.style.display = 'none';
        return;
    }
    
    seccion.style.display = 'block';
    
    if (count) {
        count.textContent = partes.length;
    }
    
    lista.innerHTML = partes.map((persona, index) => {
        if (!persona) return '';
        
        const nombre = persona.tipo_persona === 'FISICA' 
            ? `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim()
            : (persona.empresa || persona.nombre || '---');
        
        const tipoBadge = persona.tipo_persona === 'FISICA' ? 'fisica' : 'moral';
        const tipoTexto = persona.tipo_persona === 'FISICA' ? 'Persona Física' : 'Persona Moral';
        
        return `
            <div class="parte-item parte-${tipo.toLowerCase()}">
                <div class="parte-info">
                    <span class="parte-num">${String(index + 1).padStart(2, '0')}</span>
                    <span class="parte-nombre">${nombre || '---'}</span>
                </div>
                <span class="parte-tipo-badge ${tipoBadge}">${tipoTexto}</span>
            </div>
        `;
    }).filter(html => html && html.trim() !== '').join('');
}*/


// === RENDERIZAR PARTES (SIN FILTRO IMSS) ===
function renderizarPartesCompactas(tipo, partes) {
    const tipoLower = tipo.toLowerCase();
    // Buscar elementos por ID singular o plural (compatibilidad con ambos HTML)
    const seccion = document.getElementById(`seccion${tipo}`) || document.getElementById(`seccion${tipo}s`);
    const lista = document.getElementById(`${tipoLower}Info`) || document.getElementById(`${tipoLower}sInfo`);
    const count = document.getElementById(`${tipoLower}Count`) || document.getElementById(`${tipoLower}sCount`);
    
    // Validacion básica de elementos
    if (!seccion || !lista) {
        console.warn(`No se encontró seccion o lista para ${tipo}`);
        return;
    }
    
    // Si no hay partes, ocultar sección
    if (!partes || !Array.isArray(partes) || partes.length === 0) {
        seccion.style.display = 'none';
        return;
    }
    
    // Mostrar sección y contador
    seccion.style.display = 'block';
    if (count) {
        count.textContent = partes.length;
    }
    
    // Generar HTML de cada parte
    lista.innerHTML = partes.map((persona, index) => {
        if (!persona) return '';
        
        // Obtener nombre según tipo de persona
        const nombre = persona.tipo_persona === 'FISICA' 
            ? `${persona.nombres || ''} ${persona.apellido_paterno || ''} ${persona.apellido_materno || ''}`.trim()
            : (persona.empresa || persona.nombre || persona.entidad || '---');
        
        const tipoBadge = persona.tipo_persona === 'FISICA' ? 'fisica' : 'moral';
        const tipoTexto = persona.tipo_persona === 'FISICA' ? 'Persona Física' : 'Persona Moral';
        
        return `
            <div class="parte-item parte-${tipo.toLowerCase()}">
                <div class="parte-info">
                    <span class="parte-num">${String(index + 1).padStart(2, '0')}</span>
                    <span class="parte-nombre">${nombre}</span>
                </div>
                <span class="parte-tipo-badge ${tipoBadge}">${tipoTexto}</span>
            </div>
        `;
    }).filter(html => html && html.trim() !== '').join('');
}


// Compatibilidad: obtener actores como array
function obtenerActoresDelCaso() {
    if (!casoActual) return [];
    
    if (casoActual.actores && Array.isArray(casoActual.actores)) {
        return casoActual.actores;
    }
    if (Array.isArray(casoActual.actor)) {
        return casoActual.actor;
    }
    if (casoActual.actor && casoActual.actor.tipo_persona) {
        return [casoActual.actor];
    }
    return [];
}

// Compatibilidad: obtener prestaciones como array de IDs
function obtenerPrestacionesDelCaso() {
    if (!casoActual) return [];
    
    if (casoActual.prestaciones_reclamadas && Array.isArray(casoActual.prestaciones_reclamadas)) {
        return casoActual.prestaciones_reclamadas;
    }
    if (casoActual.prestacion_principal) {
        const ids = [casoActual.prestacion_principal];
        if (casoActual.prestaciones_secundarias && Array.isArray(casoActual.prestaciones_secundarias)) {
            ids.push(...casoActual.prestaciones_secundarias);
        }
        return ids;
    }
    if (casoActual.prestacion_reclamada) {
        return [casoActual.prestacion_reclamada];
    }
    return [];
}

async function renderizarSeguimiento() {
    if (!casoActual) return;
    
    const seg = casoActual.seguimiento || {};

    // Fecha de actuación
    if (seg.fecha_actuacion) {
        setTextoSeguro('fechaActuacion', formatearFecha(seg.fecha_actuacion));
    }

    // Tipo de actuación
    if (seg.tipo_actuacion) {
        const tipoElem = document.getElementById('tipoActuacion');
        if (tipoElem) {
            tipoElem.textContent = seg.tipo_actuacion;
        }
    }

    // Descripción
    if (seg.descripcion) {
        const descElem = document.getElementById('descripcionActuacion');
        if (descElem) {
            descElem.textContent = seg.descripcion;
            // Remover span "Sin información" si existe
            const vacio = descElem.querySelector('.info-vacio');
            if (vacio) vacio.remove();
        }
    }

    // Próximo vencimiento
    if (casoActual.fecha_vencimiento) {
        setTextoSeguro('fechaVencimiento', formatearFecha(casoActual.fecha_vencimiento));
    }

    // Documentos adjuntos (nuevo formato)
    await renderizarTimelineCivil();
}

async function renderizarTimelineCivil() {
    const container = document.getElementById('timelineCivil');
    if (!container) return;

    let seguimientos = casoActual.seguimientos || [];
    if (seguimientos.length === 0 && casoActual.seguimiento && casoActual.seguimiento.fecha_actuacion) {
        seguimientos = [casoActual.seguimiento];
    }

    if (seguimientos.length === 0) {
        container.innerHTML = '<div class="timeline-empty">Sin actualizaciones registradas</div>';
        return;
    }

    let documentosPorSeguimiento = {};

    try {
        const documentos = await obtenerDocumentosCivilApi(casoActual.id);
        documentosPorSeguimiento = agruparDocumentosPorSeguimiento(documentos);
    } catch (error) {
        console.error('Error al cargar documentos del detalle:', error);
    }

    const seguimientosOrdenados = [...seguimientos]
        .sort((a, b) => {
            const fechaA = new Date(a.fecha_actuacion);
            const fechaB = new Date(b.fecha_actuacion);
            const diferencia = fechaA - fechaB;

            if (diferencia !== 0) {
                return diferencia;
            }

            return (a.id ?? 0) - (b.id ?? 0);
        })
        .map((seguimiento, index) => ({
            ...seguimiento,
            numeroActualizacion: index + 1
        }))
        .reverse();

    const visibles = historialExpandido
        ? seguimientosOrdenados
        : seguimientosOrdenados.slice(0, MAX_ACTUALIZACIONES_VISIBLES);
    const restantes = seguimientosOrdenados.length - visibles.length;

    container.innerHTML = visibles.map((seguimiento, index) => {
        const documentos = documentosPorSeguimiento[seguimiento.id] || [];
        const documento = documentos[0] || null;

        return `
            <div class="timeline-item ${index === visibles.length - 1 ? 'is-last' : ''}">
                <div class="timeline-rail" aria-hidden="true">
                    <span class="timeline-dot"></span>
                </div>
                <div class="timeline-card">
                    <div class="timeline-top timeline-top-swap">
                        <div class="timeline-meta timeline-meta-stack">
                            <span class="timeline-date-pill">${formatearFecha(seguimiento.fecha_actuacion)}</span>
                            <span class="timeline-step">Actualizacion ${seguimiento.numeroActualizacion}</span>
                        </div>
                        <span class="timeline-type-chip">${seguimiento.tipo_actuacion || 'Sin tipo'}</span>
                    </div>
                    <div class="timeline-desc">${seguimiento.descripcion || 'Sin descripcion registrada.'}</div>
                    ${(documento || usuarioActual?.rol !== 'consulta') ? `
                        <div class="timeline-card-actions timeline-card-actions-between">
                            ${documento ? `
                            <a class="timeline-doc-link" href="${window.construirUrlApiConToken?.(`api/downloadCivilDocument.php?id=${documento.id}`) || `api/downloadCivilDocument.php?id=${documento.id}`}" target="_blank">
                                Ver PDF
                            </a>
                            <span class="timeline-doc-meta">${documento.nombre_original} · ${formatearTamanoArchivo(documento.tamano_bytes)}</span>
                            ` : ''}
                            ${usuarioActual?.rol !== 'consulta' ? `
                            <button type="button" class="timeline-delete-btn" onclick="confirmarEliminarSeguimientoCivilDetalle(${seguimiento.id})">
                                Eliminar
                            </button>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }).join('');

    if (seguimientosOrdenados.length > MAX_ACTUALIZACIONES_VISIBLES) {
        container.innerHTML += `
            <div class="timeline-actions">
                <button type="button" class="timeline-toggle-btn" onclick="toggleHistorialCivilDetalle()">
                    ${historialExpandido ? 'Mostrar menos' : `Mostrar ${restantes} mas`}
                </button>
            </div>
        `;
    }
}

function toggleHistorialCivilDetalle() {
    historialExpandido = !historialExpandido;
    renderizarTimelineCivil();
}

async function confirmarEliminarSeguimientoCivilDetalle(trackingId) {
    if (!trackingId) return;

    const confirmacion = await window.appConfirm?.({
        title: 'Eliminar actualización',
        message: '¿Deseas eliminar esta actualización? Si tiene PDF ligado, también se eliminará.',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
    });
    if (!confirmacion) {
        return;
    }

    try {
        await eliminarSeguimientoCivilApi(trackingId);
        await cargarDetalleCaso();
        await window.appAlert?.({
            title: 'Cambio guardado',
            message: 'Actualización eliminada correctamente.'
        });
    } catch (error) {
        console.error('Error al eliminar seguimiento civil:', error);
        await window.appAlert?.({
            title: 'No se pudo eliminar la actualización',
            message: error.message || 'Ocurrió un error al eliminar la actualización.'
        });
    }
}

window.confirmarEliminarSeguimientoCivilDetalle = confirmarEliminarSeguimientoCivilDetalle;

function verificarBotonActualizar() {
    // La actualizacion siempre puede recibir nuevos datos
}

function volver() {
    window.location.href = 'casos.html';
}

function editarDatos() {
    if (esCasoAcumulado()) {
        window.appAlert?.({
            title: 'Asunto acumulado',
            message: `Este asunto esta acumulado al expediente ${obtenerNumeroPadreAcumulacion()}. Debe desacumularse primero.`
        });
        return;
    }

    if (casoActual?.id) {
        window.location.href = `editarCaso.html?id=${casoActual.id}`;
    }
}

function abrirActualizacion() {
    if (esCasoAcumulado()) {
        window.appAlert?.({
            title: 'Asunto acumulado',
            message: `Este asunto esta acumulado al expediente ${obtenerNumeroPadreAcumulacion()}. Debe desacumularse primero.`
        });
        return;
    }

    if (casoActual?.id) {
        window.location.href = `actualizarCaso.html?id=${casoActual.id}`;
    }
}

function abrirPDF(index) {
    if (!casoActual || !casoActual.documentos || !casoActual.documentos[index]) return;
    
    const doc = casoActual.documentos[index];
    
    // Si tiene URL directa
    if (doc.url) {
        window.open(doc.url, '_blank');
        return;
    }
    
    // Si tiene data URL (base64)
    if (doc.data) {
        try {
            const byteString = atob(doc.data.split(',')[1]);
            const mimeType = doc.data.split(',')[0].split(':')[1].split(';')[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeType });
            const blobUrl = URL.createObjectURL(blob);
            window.open(blobUrl, '_blank');
        } catch (e) {
            console.error('Error al abrir PDF:', e);
            window.appAlert?.({
                title: 'No se pudo abrir el documento',
                message: 'Intenta de nuevo en unos momentos.'
            });
        }
    }
}

window.cerrarModalReasignarAbogado = cerrarModalReasignarAbogado;

function formatearFecha(fecha) {
    if (!fecha) return '---';
    
    const soloFecha = typeof fecha === 'string' ? fecha.split('T')[0] : null;
    let d;
    
    if (soloFecha && /^\d{4}-\d{2}-\d{2}$/.test(soloFecha)) {
        const [año, mes, dia] = soloFecha.split('-').map(Number);
        d = new Date(año, mes - 1, dia);
    } else {
        d = new Date(fecha);
    }
    
    if (isNaN(d.getTime())) return fecha;
    
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}


