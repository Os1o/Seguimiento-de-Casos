// =====================================================
// DETALLE DEL CASO
// =====================================================

let casoActual = null;

// Verificar sesion
document.addEventListener('DOMContentLoaded', function () {
    const usuarioStr = sessionStorage.getItem('usuario');

    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    cargarDetalleCaso();
});

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

function cargarDetalleCaso() {
    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        alert('No se especifico un caso');
        window.location.href = 'casos.html';
        return;
    }

    const casosGuardados = localStorage.getItem('casos');
    const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;

    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert('Caso no encontrado');
        window.location.href = 'casos.html';
        return;
    }

    renderizarCaso();
}

function renderizarCaso() {
    // Header
    document.getElementById('numeroExpediente').textContent = casoActual.numero_expediente;
    document.getElementById('breadcrumbExpediente').textContent = casoActual.numero_expediente;

    const badgeEstatus = document.getElementById('badgeEstatus');
    badgeEstatus.textContent = casoActual.estatus === 'TRAMITE' ? 'En Tramite' : 'Concluido';
    badgeEstatus.className = 'badge-estatus ' + (casoActual.estatus === 'TRAMITE' ? 'badge-tramite' : 'badge-concluido');

    const fecha = new Date(casoActual.fecha_creacion);
    document.getElementById('fechaCreacion').textContent = fecha.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Fecha de actualización (si es diferente a la de creación)
    if (casoActual.fecha_actualizacion && casoActual.fecha_actualizacion !== casoActual.fecha_creacion) {
        const fechaAct = new Date(casoActual.fecha_actualizacion);
        document.getElementById('fechaActualizacion').textContent = fechaAct.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        document.getElementById('fechaActualizacionInfo').style.display = 'inline';
    }

    // Datos del Registro
    const delegacion = catalogos.delegaciones.find(d => d.id === casoActual.delegacion_id);
    document.getElementById('delegacion').textContent = delegacion ? delegacion.nombre : '---';

    const areas = catalogos.areas[casoActual.delegacion_id] || [];
    const area = areas.find(a => a.id === casoActual.area_generadora_id);
    document.getElementById('area').textContent = area ? area.nombre : '---';

    document.getElementById('jurisdiccion').textContent = casoActual.jurisdiccion;

    // Tipo de juicio completo
    let tipoCompleto = casoActual.tipo_juicio;
    if (casoActual.subtipo_juicio) tipoCompleto += ' - ' + casoActual.subtipo_juicio;
    if (casoActual.sub_subtipo_juicio) tipoCompleto += ' - ' + casoActual.sub_subtipo_juicio;
    tipoCompleto += casoActual.jurisdiccion === 'FEDERAL' ? ' (Federal)' : ' (Local)';
    document.getElementById('tipoJuicio').textContent = tipoCompleto;

    const tribunal = catalogos.tribunales.find(t => t.id === casoActual.tribunal_id);
    document.getElementById('tribunal').textContent = tribunal ? tribunal.nombre : '---';

    document.getElementById('fechaInicio').textContent = formatearFecha(casoActual.fecha_inicio);
    document.getElementById('imssEs').textContent = casoActual.imss_es;

    // Prestaciones (compatibilidad: prestacion_reclamada int -> prestaciones_reclamadas array)
    const prestacionesIds = obtenerPrestacionesDelCaso();
    if (prestacionesIds.length > 0) {
        const nombres = prestacionesIds.map(id => {
            const p = catalogos.prestaciones.find(pr => pr.id === id);
            return p ? p.nombre : 'Desconocida';
        });
        document.getElementById('prestacion').innerHTML = nombres.map(n => `<div style="margin-bottom: 4px;">- ${n}</div>`).join('');
    } else {
        document.getElementById('prestacion').textContent = '---';
    }

    // Importe
    const importeElem = document.getElementById('importeDemandado');
    if (casoActual.importe_demandado === 0) {
        importeElem.innerHTML = '<span class="sin-cuantia">Sin cuantia</span>';
    } else {
        importeElem.innerHTML = '<span class="importe">$' + casoActual.importe_demandado.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + '</span>';
    }

    document.getElementById('prestacionesNotas').textContent = casoActual.prestaciones_notas || '---';

    // Abogado Responsable (del caso directamente o del seguimiento para compatibilidad)
    const abogado = casoActual.abogado_responsable ||
        (casoActual.seguimiento && casoActual.seguimiento.abogado_responsable) || null;
    if (abogado) {
        document.getElementById('abogadoResponsable').textContent = abogado;
    }

    // Pronostico (del caso directamente o del seguimiento para compatibilidad)
    const pronostico = casoActual.pronostico ||
        (casoActual.seguimiento && casoActual.seguimiento.pronostico) || null;
    if (pronostico) {
        document.getElementById('pronostico').innerHTML = `<strong>${pronostico}</strong>`;
    }

    // Actores (compatibilidad: actor objeto -> actores array)
    const actores = obtenerActoresDelCaso();
    if (casoActual.imss_es !== 'ACTOR' && actores.length > 0) {
        document.getElementById('seccionActor').style.display = 'block';
        document.getElementById('actorInfo').innerHTML = actores.map(a => renderizarPersona(a)).join('');
    }

    // Demandados
    if (casoActual.imss_es !== 'DEMANDADO' && casoActual.demandados && casoActual.demandados.length > 0) {
        document.getElementById('seccionDemandados').style.display = 'block';
        document.getElementById('demandadosInfo').innerHTML = casoActual.demandados.map(d => renderizarPersona(d)).join('');
    }

    // Codemandados
    if (casoActual.codemandados && casoActual.codemandados.length > 0) {
        document.getElementById('seccionCodemandados').style.display = 'block';
        document.getElementById('codemandadosInfo').innerHTML = casoActual.codemandados.map(c => renderizarPersona(c)).join('');
    }

    // Acumulado a
    if (casoActual.acumulado_a) {
        const casosGuardados = localStorage.getItem('casos');
        const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;
        const casoPadre = casos.find(c => c.id === casoActual.acumulado_a);

        document.getElementById('seccionAcumulado').style.display = 'block';
        document.getElementById('acumuladoA').innerHTML = casoPadre
            ? `<a href="detalle-caso.html?id=${casoPadre.id}" style="color: #621132; text-decoration: underline;">${casoPadre.numero_expediente}</a>`
            : '---';
    }

    // Juicios acumulados
    if (casoActual.juicios_acumulados && casoActual.juicios_acumulados.length > 0) {
        const casosGuardados = localStorage.getItem('casos');
        const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;

        document.getElementById('seccionJuiciosAcumulados').style.display = 'block';

        const casosAcumulados = casoActual.juicios_acumulados
            .map(id => casos.find(c => c.id === id))
            .filter(c => c);

        const html = `
            <div class="acumulados-list">
                <strong>Este caso tiene ${casosAcumulados.length} juicio(s) acumulado(s):</strong>
                <ul>
                    ${casosAcumulados.map(c => `
                        <li>
                            <a href="detalle-caso.html?id=${c.id}" style="color: #621132; text-decoration: underline;">
                                ${c.numero_expediente}
                            </a>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        document.getElementById('juiciosAcumuladosInfo').innerHTML = html;
    }

    // Seguimiento del Juicio
    renderizarSeguimiento();

    // Verificar si se debe deshabilitar el boton de actualizar
    verificarBotonActualizar();
}

// Compatibilidad: obtener actores como array
function obtenerActoresDelCaso() {
    if (casoActual.actores && Array.isArray(casoActual.actores)) {
        return casoActual.actores;
    }
    if (casoActual.actor && casoActual.actor.tipo_persona) {
        return [casoActual.actor];
    }
    return [];
}

// Compatibilidad: obtener prestaciones como array
function obtenerPrestacionesDelCaso() {
    if (casoActual.prestaciones_reclamadas && Array.isArray(casoActual.prestaciones_reclamadas)) {
        return casoActual.prestaciones_reclamadas;
    }
    if (casoActual.prestacion_reclamada) {
        return [casoActual.prestacion_reclamada];
    }
    return [];
}

function renderizarPersona(persona) {
    if (!persona) return '';

    let html = '<div class="persona-card">';
    html += `<div class="persona-tipo">${persona.tipo_persona === 'FISICA' ? 'Persona Fisica' : 'Persona Moral'}</div>`;

    if (persona.tipo_persona === 'FISICA') {
        html += `<div class="persona-nombre">${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno || ''}</div>`;
    } else {
        html += `<div class="persona-nombre">${persona.empresa}</div>`;
    }

    html += '</div>';
    return html;
}

function renderizarSeguimiento() {
    const seg = casoActual.seguimiento || {};

    // Sentencia
    if (seg.sentencia) {
        document.getElementById('sentencia').innerHTML = `<strong>${seg.sentencia}</strong>`;
    }

    // Importe de sentencia
    if (seg.importe_sentencia !== null && seg.importe_sentencia !== undefined) {
        if (seg.importe_sentencia === 0) {
            document.getElementById('importeSentencia').innerHTML = '<span class="sin-cuantia">Sin cuantia</span>';
        } else {
            document.getElementById('importeSentencia').innerHTML = '<span class="importe">$' + seg.importe_sentencia.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + '</span>';
        }
    }

    // Ultimo estado procesal
    if (seg.ultimo_estado_procesal) {
        document.getElementById('ultimoEstadoProcesal').textContent = seg.ultimo_estado_procesal;
    }

    // Fecha estado procesal
    if (seg.fecha_estado_procesal) {
        document.getElementById('fechaEstadoProcesal').textContent = formatearFecha(seg.fecha_estado_procesal);
    }

    // Observaciones
    if (seg.observaciones) {
        document.getElementById('observaciones').textContent = seg.observaciones;
    }

    // Fecha de vencimiento
    if (casoActual.fecha_vencimiento) {
        document.getElementById('fechaVencimiento').textContent = formatearFecha(casoActual.fecha_vencimiento);
    }
}

// Verificar si todos los campos de seguimiento estan llenos para deshabilitar boton
function verificarBotonActualizar() {
    const seg = casoActual.seguimiento || {};

    const camposCompletos =
        seg.sentencia &&
        seg.importe_sentencia !== null && seg.importe_sentencia !== undefined &&
        seg.ultimo_estado_procesal &&
        seg.fecha_estado_procesal &&
        seg.observaciones &&
        casoActual.fecha_vencimiento &&
        (casoActual.acumulado_a !== null && casoActual.acumulado_a !== undefined);

    if (camposCompletos) {
        const btn = document.getElementById('btnActualizar');
        btn.disabled = true;
        btn.style.opacity = '0.5';
        btn.style.cursor = 'not-allowed';
        btn.title = 'Todos los campos de seguimiento estan completos';
    }
}

function volver() {
    window.location.href = 'casos.html';
}

function editarDatos() {
    window.location.href = `editar-caso.html?id=${casoActual.id}`;
}

function abrirActualizacion() {
    window.location.href = `actualizar-caso.html?id=${casoActual.id}`;
}

function formatearFecha(fecha) {
    if (!fecha) return '---';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
