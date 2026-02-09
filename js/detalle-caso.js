// =====================================================
// DETALLE DEL CASO
// =====================================================

let casoActual = null;


document.addEventListener('DOMContentLoaded', function () {
  const usuarioStr = sessionStorage.getItem('usuario');

  if (!usuarioStr) {
    window.location.href = 'login.html';
    return;
  }

  const usuarioObj = JSON.parse(usuarioStr);

  document.getElementById('nombreUsuario').textContent = usuarioObj.nombre_completo;

  // Cargar caso
  cargarDetalleCaso();
});

// Función para cerrar sesión
function cerrarSesion() {
  sessionStorage.removeItem('usuario');
  window.location.href = 'login.html';
}

// Cargar detalle del caso
function cargarDetalleCaso() {
  // Obtener ID del caso de URL
  const urlParams = new URLSearchParams(window.location.search);
  const casoId = parseInt(urlParams.get('id'));

  if (!casoId) {
    alert('No se especificó un caso');
    window.location.href = 'casos.html';
    return;
  }

  // Buscar caso en localStorage
  const casosGuardados = localStorage.getItem('casos');
  const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;

  casoActual = casos.find(c => c.id === casoId);

  if (!casoActual) {
    alert('Caso no encontrado');
    window.location.href = 'casos.html';
    return;
  }

  // Renderizar información
  renderizarCaso();
}

// Renderizar información del caso
function renderizarCaso() {
  // Header
  document.getElementById('numeroExpediente').textContent = casoActual.numero_expediente;

  const badgeEstatus = document.getElementById('badgeEstatus');
  badgeEstatus.textContent = casoActual.estatus === 'TRAMITE' ? 'En Trámite' : 'Concluido';
  badgeEstatus.className = 'badge-estatus ' + (casoActual.estatus === 'TRAMITE' ? 'badge-tramite' : 'badge-concluido');

  const fecha = new Date(casoActual.fecha_creacion);
  document.getElementById('fechaCreacion').textContent = fecha.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Datos del Registro
  const delegacion = catalogos.delegaciones.find(d => d.id === casoActual.delegacion_id);
  document.getElementById('delegacion').textContent = delegacion ? delegacion.nombre : '---';

  const areas = catalogos.areas[casoActual.delegacion_id] || [];
  const area = areas.find(a => a.id === casoActual.area_generadora_id);
  document.getElementById('area').textContent = area ? area.nombre : '---';

  document.getElementById('jurisdiccion').textContent = casoActual.jurisdiccion;

  // Tipo de juicio completo
  let tipoCompleto = casoActual.tipo_juicio;
  if (casoActual.subtipo_juicio) {
    tipoCompleto += ' - ' + casoActual.subtipo_juicio;
  }
  if (casoActual.sub_subtipo_juicio) {
    tipoCompleto += ' - ' + casoActual.sub_subtipo_juicio;
  }
  if (casoActual.jurisdiccion === 'FEDERAL') {
    tipoCompleto += ' (Federal)';
  } else {
    tipoCompleto += ' (Local)';
  }
  document.getElementById('tipoJuicio').textContent = tipoCompleto;

  const tribunal = catalogos.tribunales.find(t => t.id === casoActual.tribunal_id);
  document.getElementById('tribunal').textContent = tribunal ? tribunal.nombre : '---';

  const [anio, mes, dia] = casoActual.fecha_inicio.split('-');
  const fechaSegura = new Date(anio, mes - 1, dia); // Meses en JS van de 0 a 11
  document.getElementById('fechaInicio').textContent = fechaSegura.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  document.getElementById('imssEs').textContent = casoActual.imss_es;

  const prestacion = catalogos.prestaciones.find(p => p.id === casoActual.prestacion_reclamada);
  document.getElementById('prestacion').textContent = prestacion ? prestacion.nombre : '---';

  const importeElem = document.getElementById('importeDemandado');
  if (casoActual.importe_demandado === 0) {
    importeElem.innerHTML = '<span class="sin-cuantia">Sin cuantía</span>';
  } else {
    importeElem.innerHTML = '<span class="importe">$' + casoActual.importe_demandado.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + '</span>';
  }

  document.getElementById('prestacionesNotas').textContent = casoActual.prestaciones_notas || '---';

  // Actor
  if (casoActual.imss_es !== 'ACTOR' && casoActual.actor) {
    document.getElementById('seccionActor').style.display = 'block';
    document.getElementById('actorInfo').innerHTML = renderizarPersona(casoActual.actor);
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
}

// Renderizar información de persona
function renderizarPersona(persona) {
  if (!persona) return '';

  let html = '<div class="persona-card">';
  html += `<div class="persona-tipo">${persona.tipo_persona === 'FISICA' ? 'Persona Física' : 'Persona Moral'}</div>`;

  if (persona.tipo_persona === 'FISICA') {
    html += `<div class="persona-nombre">${persona.nombres} ${persona.apellido_paterno} ${persona.apellido_materno || ''}</div>`;
  } else {
    html += `<div class="persona-nombre">${persona.empresa}</div>`;
  }

  html += '</div>';
  return html;
}

// Renderizar seguimiento
function renderizarSeguimiento() {
  const seg = casoActual.seguimiento || {};

  // Pronóstico
  if (seg.pronostico) {
    document.getElementById('pronostico').innerHTML = `<strong>${seg.pronostico}</strong>`;
  }

  // Sentencia
  if (seg.sentencia) {
    document.getElementById('sentencia').innerHTML = `<strong>${seg.sentencia}</strong>`;
  }

  // Importe de sentencia
  if (seg.importe_sentencia !== null && seg.importe_sentencia !== undefined) {
    if (seg.importe_sentencia === 0) {
      document.getElementById('importeSentencia').innerHTML = '<span class="sin-cuantia">Sin cuantía</span>';
    } else {
      document.getElementById('importeSentencia').innerHTML = '<span class="importe">$' + seg.importe_sentencia.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + '</span>';
    }
  }

  // Abogado responsable
  if (seg.abogado_responsable) {
    document.getElementById('abogadoResponsable').textContent = seg.abogado_responsable;
  }

  // Último estado procesal
  if (seg.ultimo_estado_procesal) {
    document.getElementById('ultimoEstadoProcesal').textContent = seg.ultimo_estado_procesal;
  }

  // Fecha estado procesal
  if (seg.fecha_estado_procesal) {
    document.getElementById('fechaEstadoProcesal').textContent = new Date(seg.fecha_estado_procesal).toLocaleDateString('es-MX');
  }

  // Observaciones
  if (seg.observaciones) {
    document.getElementById('observaciones').textContent = seg.observaciones;
  }
}

// Volver a la lista
function volver() {
  window.location.href = 'casos.html';
}

// Editar datos del caso
function editarDatos() {
  window.location.href = `editar-caso.html?id=${casoActual.id}`;
}

// Abrir modal de seguimiento
function abrirModalSeguimiento() {
  // Por ahora redirigir a casos.html con parámetro
  // Implementaremos el modal en el siguiente paso
  alert('Función de Actualizar Seguimiento en desarrollo.\nSe implementará en el siguiente paso.');
}