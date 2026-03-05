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
    setTextoSeguro('nombreUsuario', usuario.nombre_completo);

    // Ocultar botones de acción según rol
    if (usuario.rol === 'consulta') {
        const btnEditar = document.getElementById('btnEditar');
        const btnActualizar = document.getElementById('btnActualizar');
        if (btnEditar) btnEditar.style.display = 'none';
        if (btnActualizar) btnActualizar.style.display = 'none';
    } else if (usuario.rol === 'editor') {
        const btnEditar = document.getElementById('btnEditar');
        if (btnEditar) btnEditar.style.display = 'none';
    }

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
        alert('No se especificó un asunto');
        window.location.href = 'casos.html';
        return;
    }

    const casosGuardados = localStorage.getItem('casos');
    const casos = casosGuardados ? JSON.parse(casosGuardados) : casosFake;

    casoActual = casos.find(c => c.id === casoId);

    if (!casoActual) {
        alert('Asunto no encontrado');
        window.location.href = 'casos.html';
        return;
    }

    renderizarCaso();
}

// === FUNCIÓN AUXILIAR: Setear texto con null check ===
function setTextoSeguro(id, texto) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = texto || '---';
    }
}

// === FUNCIÓN AUXILIAR: Setear HTML con null check ===
function setHtmlSeguro(id, html) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = html || '---';
    }
}

function renderizarCaso() {
    if (!casoActual) return;

    // === HEADER ===
    setTextoSeguro('numeroExpediente', casoActual.numero_expediente);
    setTextoSeguro('breadcrumbExpediente', casoActual.numero_expediente);

    const badgeEstatus = document.getElementById('badgeEstatus');
    if (badgeEstatus) {
        badgeEstatus.textContent = casoActual.estatus === 'TRAMITE' ? 'En Tramite' : 'Concluido';
        badgeEstatus.className = 'badge-estatus ' + (casoActual.estatus === 'TRAMITE' ? 'badge-tramite' : 'badge-concluido');
    }

    // Fecha creación
    if (casoActual.fecha_creacion) {
        const fecha = new Date(casoActual.fecha_creacion);
        const ddC = String(fecha.getDate()).padStart(2, '0');
        const mmC = String(fecha.getMonth() + 1).padStart(2, '0');
        const yyyyC = fecha.getFullYear();
        const hhC = String(fecha.getHours()).padStart(2, '0');
        const minC = String(fecha.getMinutes()).padStart(2, '0');
        setTextoSeguro('fechaCreacion', `${ddC}/${mmC}/${yyyyC} ${hhC}:${minC}`);
    }

    // Fecha actualización (CON NULL CHECK - ESTO ERA EL ERROR)
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

    // Tipo de juicio completo
    let tipoCompleto = casoActual.tipo_juicio || '';
    if (casoActual.subtipo_juicio) tipoCompleto += ' - ' + casoActual.subtipo_juicio;
    if (casoActual.sub_subtipo_juicio) tipoCompleto += ' - ' + casoActual.sub_subtipo_juicio;
    tipoCompleto += casoActual.jurisdiccion === 'FEDERAL' ? ' (Federal)' : ' (Local)';
    setTextoSeguro('tipoJuicio', tipoCompleto || '---');

    if (typeof catalogos !== 'undefined') {
        const tribunal = catalogos.tribunales?.find(t => t.id === casoActual.tribunal_id);
        setTextoSeguro('tribunal', tribunal?.nombre || '---');
    } else {
        setTextoSeguro('tribunal', casoActual.tribunal || '---');
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
            importeElem.innerHTML = '<span class="info-value-importe">$' + casoActual.importe_demandado.toLocaleString('es-MX', { minimumFractionDigits: 2 }) + ' MXN</span>';
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
    const abogado = casoActual.abogado_responsable || (casoActual.seguimiento?.abogado_responsable) || null;
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
    renderizarSeguimiento();

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
    
    // Validación básica de elementos
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

function renderizarSeguimiento() {
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
            tipoElem.innerHTML = `<span class="timeline-type">${seg.tipo_actuacion}</span>`;
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
    const docsContainer = document.getElementById('documentosAdjuntos');
    if (docsContainer && casoActual.documentos && Array.isArray(casoActual.documentos) && casoActual.documentos.length > 0) {
        docsContainer.innerHTML = casoActual.documentos.map((doc, i) => {
            const ext = (doc.nombre || '').split('.').pop()?.toUpperCase() || 'PDF';
            return `
                <div class="documento-item" onclick="abrirPDF(${i}); return false;" style="cursor: pointer;">
                    <span class="documento-icon">${ext}</span>
                    <span>${doc.nombre || 'Documento'}</span>
                </div>
            `;
        }).join('');
    }
}

function verificarBotonActualizar() {
    // La actualización siempre puede recibir nuevos datos
}

function volver() {
    window.location.href = 'casos.html';
}

function editarDatos() {
    if (casoActual?.id) {
        window.location.href = `editarCaso.html?id=${casoActual.id}`;
    }
}

function abrirActualizacion() {
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
            alert('No se pudo abrir el documento');
        }
    }
}

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