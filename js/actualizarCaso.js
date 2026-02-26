// =====================================================
// ACTUALIZAR-CASO.JS - Actualizacion de seguimiento
// =====================================================

let casoActual = null;
const MAX_PDF_SIZE = 500 * 1024; // 500 KB por archivo
const MAX_LOCALSTORAGE_MB = 4.5; // Limite seguro de localStorage en MB

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

    // Llenar con datos existentes
    llenarFormulario();
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

    // Fecha de vencimiento
    if (casoActual.fecha_vencimiento) {
        let fecha = casoActual.fecha_vencimiento;
        if (fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaVencimiento').value = fecha;
    }

    // Documentos existentes
    renderizarDocumentos();
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

    // Validación de PDF al seleccionar archivo
    document.getElementById('inputPDF').addEventListener('change', validarPDF);

    // Submit
    document.getElementById('formActualizar').addEventListener('submit', guardarActualizacion);
}

// =====================================================
// DOCUMENTOS PDF
// =====================================================

function obtenerTamañoLocalStorage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2; // UTF-16 = 2 bytes por caracter
        }
    }
    return total;
}

function validarPDF() {
    const input = document.getElementById('inputPDF');
    const errorDiv = document.getElementById('errorPDF');
    errorDiv.style.display = 'none';

    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Validar que sea PDF
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        errorDiv.textContent = 'Solo se permiten archivos PDF';
        errorDiv.style.display = 'block';
        input.value = '';
        return;
    }

    // Validar tamaño del archivo
    if (file.size > MAX_PDF_SIZE) {
        const sizeKB = Math.round(file.size / 1024);
        errorDiv.textContent = `El archivo pesa ${sizeKB} KB. El máximo permitido es 500 KB.`;
        errorDiv.style.display = 'block';
        input.value = '';
        return;
    }

    // Validar espacio disponible en localStorage
    // Base64 aumenta el tamaño ~33%
    const estimatedSize = file.size * 1.37; // base64 overhead + JSON overhead
    const usedBytes = obtenerTamañoLocalStorage();
    const maxBytes = MAX_LOCALSTORAGE_MB * 1024 * 1024;
    const availableBytes = maxBytes - usedBytes;

    if (estimatedSize > availableBytes) {
        const availableKB = Math.round(availableBytes / 1024);
        errorDiv.textContent = `No hay espacio suficiente en el almacenamiento local. Disponible: ~${availableKB} KB. Elimine documentos existentes para liberar espacio.`;
        errorDiv.style.display = 'block';
        input.value = '';
        return;
    }
}

function renderizarDocumentos() {
    const container = document.getElementById('listaDocumentos');
    const docs = casoActual.documentos || [];

    if (docs.length === 0) {
        container.innerHTML = '<p style="color: var(--color-text-light); font-size: 13px;">No hay documentos adjuntos</p>';
        return;
    }

    container.innerHTML = docs.map((doc, index) => `
        <div style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: var(--color-bg); border-radius: 6px; margin-bottom: 6px;">
            <span style="color: var(--color-danger); font-size: 18px;">📄</span>
            <div style="flex: 1;">
                <strong style="font-size: 13px;">${doc.nombre}</strong>
                <small style="color: var(--color-text-light); display: block;">${Math.round(doc.tamaño / 1024)} KB · ${doc.fecha}</small>
            </div>
            <button type="button" onclick="verDocumento(${index})" class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;">Ver</button>
            <button type="button" onclick="eliminarDocumento(${index})" class="btn" style="padding: 4px 10px; font-size: 12px; background: var(--color-danger); color: white;">✕</button>
        </div>
    `).join('');
}

function verDocumento(index) {
    const docs = casoActual.documentos || [];
    if (!docs[index]) return;

    // Abrir PDF en nueva pestaña
    const link = document.createElement('a');
    link.href = docs[index].data;
    link.target = '_blank';
    link.click();
}

function eliminarDocumento(index) {
    if (!confirm('¿Eliminar este documento?')) return;

    if (!casoActual.documentos) return;
    casoActual.documentos.splice(index, 1);

    // Guardar inmediatamente
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];
    const idx = casos.findIndex(c => c.id === casoActual.id);
    if (idx !== -1) {
        casos[idx] = casoActual;
        localStorage.setItem('casos', JSON.stringify(casos));
    }

    renderizarDocumentos();
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
    const fechaVencimiento = document.getElementById('fechaVencimiento').value || null;

    // Actualizar seguimiento
    casoActual.seguimiento = casoActual.seguimiento || {};
    casoActual.seguimiento.sentencia = sentencia;
    casoActual.seguimiento.importe_sentencia = importeSentencia;
    casoActual.seguimiento.ultimo_estado_procesal = ultimoEstadoProcesal;
    casoActual.seguimiento.fecha_estado_procesal = fechaEstadoProcesal;
    casoActual.seguimiento.observaciones = observaciones;

    casoActual.fecha_vencimiento = fechaVencimiento;
    casoActual.fecha_actualizacion = new Date().toISOString();

    // Procesar PDF adjunto (si hay)
    const inputPDF = document.getElementById('inputPDF');
    const file = inputPDF.files && inputPDF.files[0];

    if (file) {
        // Leer como base64 y guardar
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;

            // Verificar espacio antes de guardar
            const usedBytes = obtenerTamañoLocalStorage();
            const maxBytes = MAX_LOCALSTORAGE_MB * 1024 * 1024;
            const newDataSize = base64.length * 2;

            if (usedBytes + newDataSize > maxBytes) {
                alert('Error: No hay espacio suficiente en localStorage para guardar este documento. Elimine documentos existentes.');
                return;
            }

            if (!casoActual.documentos) casoActual.documentos = [];
            casoActual.documentos.push({
                nombre: file.name,
                tamaño: file.size,
                fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' }),
                data: base64
            });

            guardarEnLocalStorage();
        };
        reader.onerror = function() {
            alert('Error al leer el archivo PDF');
        };
        reader.readAsDataURL(file);
    } else {
        guardarEnLocalStorage();
    }
}

function guardarEnLocalStorage() {
    const casosStr = localStorage.getItem('casos');
    let casos = casosStr ? JSON.parse(casosStr) : [];

    const index = casos.findIndex(c => c.id === casoActual.id);
    if (index !== -1) {
        casos[index] = casoActual;

        try {
            localStorage.setItem('casos', JSON.stringify(casos));
            alert('Seguimiento actualizado correctamente');
            window.location.href = `detalleCaso.html?id=${casoActual.id}`;
        } catch (err) {
            // QuotaExceededError
            alert('Error: No hay espacio suficiente en el almacenamiento local. Elimine documentos o datos para liberar espacio.');
        }
    } else {
        alert('Error: No se encontró el asunto');
    }
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
