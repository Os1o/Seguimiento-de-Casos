// =====================================================
// ACTUALIZAR-CASO.JS - Actualizacion de seguimiento
// =====================================================

let casoActual = null;
let usuarioActualAct = null;
const MAX_PDF_SIZE = 500 * 1024; // 500 KB por archivo
const MAX_LOCALSTORAGE_MB = 4.5; // Limite seguro de localStorage en MB

document.addEventListener('DOMContentLoaded', function() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    usuarioActualAct = usuario;

    // Proteger ruta: consulta no puede actualizar
    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Mostrar sección exclusiva solo para admin
    if (usuario.rol === 'admin') {
        document.getElementById('seccionExclusiva').style.display = 'block';
    }

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

    // Folio (solo lectura)
    document.getElementById('folioExpediente').value = casoActual.numero_expediente;

    // Fecha de actuación
    if (seg.fecha_actuacion) {
        let fecha = seg.fecha_actuacion;
        if (fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaActuacion').value = fecha;
    }

    // Tipo de actuación
    if (seg.tipo_actuacion) {
        document.getElementById('tipoActuacion').value = seg.tipo_actuacion;
    }

    // Próximo vencimiento
    if (casoActual.fecha_vencimiento) {
        let fecha = casoActual.fecha_vencimiento;
        if (fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaVencimiento').value = fecha;
    }

    // Descripción
    if (seg.descripcion) {
        document.getElementById('descripcionActuacion').value = seg.descripcion;
    }

    // ¿Actualizado en el SIIJ? (solo admin)
    if (seg.actualizado_siij && usuarioActualAct && usuarioActualAct.rol === 'admin') {
        document.getElementById('actualizadoSIIJ').value = seg.actualizado_siij;
    }

    // Documentos existentes
    renderizarDocumentos();
}

function configurarEventListeners() {
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
    const estimatedSize = file.size * 1.37;
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
            <span style="font-size: 18px;">📄</span>
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

    // Convertir data URL a Blob para que el navegador lo pueda abrir
    const dataUrl = docs[index].data;
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeType = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeType });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
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

// =====================================================
// GUARDAR
// =====================================================

function guardarActualizacion(e) {
    e.preventDefault();

    const fechaActuacion = document.getElementById('fechaActuacion').value;
    const tipoActuacion = document.getElementById('tipoActuacion').value;
    const descripcion = document.getElementById('descripcionActuacion').value || null;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value || null;

    // Actualizar seguimiento con nuevos campos
    casoActual.seguimiento = casoActual.seguimiento || {};
    casoActual.seguimiento.fecha_actuacion = fechaActuacion;
    casoActual.seguimiento.tipo_actuacion = tipoActuacion;
    casoActual.seguimiento.descripcion = descripcion;

    // Campo exclusivo admin
    if (usuarioActualAct && usuarioActualAct.rol === 'admin') {
        casoActual.seguimiento.actualizado_siij = document.getElementById('actualizadoSIIJ').value || null;
    }

    casoActual.fecha_vencimiento = fechaVencimiento;
    casoActual.fecha_actualizacion = new Date().toISOString();

    // Procesar PDF adjunto (si hay)
    const inputPDF = document.getElementById('inputPDF');
    const file = inputPDF.files && inputPDF.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const base64 = event.target.result;

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
