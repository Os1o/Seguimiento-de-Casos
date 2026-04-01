// =====================================================
// ACTUALIZAR-CASO.JS - Actualizacion de seguimiento
// =====================================================

let casoActual = null;
let usuarioActualAct = null;
const MAX_PDF_SIZE = 500 * 1024;
const MAX_LOCALSTORAGE_MB = 4.5;

document.addEventListener('DOMContentLoaded', async function () {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioStr);
    usuarioActualAct = usuario;

    if (usuario.rol === 'consulta') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    const urlParams = new URLSearchParams(window.location.search);
    const casoId = parseInt(urlParams.get('id'));

    if (!casoId) {
        alert('No se especifico un asunto');
        window.location.href = 'casos.html';
        return;
    }

    await cargarCaso(casoId);
    configurarEventListeners();
});

async function cargarCaso(casoId) {
    try {
        casoActual = await obtenerCasoCivil(casoId);
    } catch (err) {
        console.warn('No se pudo cargar desde Supabase, usando cache local:', err);
        const casosStr = localStorage.getItem('casos');
        const casos = casosStr ? JSON.parse(casosStr) : [];
        casoActual = casos.find(c => c.id === casoId);
    }

    if (!casoActual) {
        alert('Asunto no encontrado');
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('linkDetalle').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('btnCancelar').href = `detalleCaso.html?id=${casoActual.id}`;
    document.getElementById('numExpediente').textContent = casoActual.numero_expediente;

    llenarFormulario();
}

function llenarFormulario() {
    const seg = casoActual.seguimiento || {};

    document.getElementById('folioExpediente').value = casoActual.numero_expediente;

    if (seg.fecha_actuacion) {
        let fecha = seg.fecha_actuacion;
        if (typeof fecha === 'string' && fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaActuacion').value = fecha;
    }

    if (seg.tipo_actuacion) {
        document.getElementById('tipoActuacion').value = seg.tipo_actuacion;
    }

    if (casoActual.fecha_vencimiento) {
        let fecha = casoActual.fecha_vencimiento;
        if (typeof fecha === 'string' && fecha.includes('T')) fecha = fecha.split('T')[0];
        document.getElementById('fechaVencimiento').value = fecha;
    }

    if (seg.descripcion) {
        document.getElementById('descripcionActuacion').value = seg.descripcion;
    }

    renderizarDocumentos();
}

function configurarEventListeners() {
    document.getElementById('inputPDF').addEventListener('change', validarPDF);
    document.getElementById('formActualizar').addEventListener('submit', guardarActualizacion);
}

function obtenerTamanoLocalStorage() {
    let total = 0;
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            total += localStorage[key].length * 2;
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

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        errorDiv.textContent = 'Solo se permiten archivos PDF';
        errorDiv.style.display = 'block';
        input.value = '';
        return;
    }

    if (file.size > MAX_PDF_SIZE) {
        const sizeKB = Math.round(file.size / 1024);
        errorDiv.textContent = `El archivo pesa ${sizeKB} KB. El maximo permitido es 500 KB.`;
        errorDiv.style.display = 'block';
        input.value = '';
        return;
    }

    const estimatedSize = file.size * 1.37;
    const usedBytes = obtenerTamanoLocalStorage();
    const maxBytes = MAX_LOCALSTORAGE_MB * 1024 * 1024;
    const availableBytes = maxBytes - usedBytes;

    if (estimatedSize > availableBytes) {
        const availableKB = Math.round(availableBytes / 1024);
        errorDiv.textContent = `No hay espacio suficiente en el almacenamiento local. Disponible: ~${availableKB} KB.`;
        errorDiv.style.display = 'block';
        input.value = '';
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
            <span style="font-size: 18px;">PDF</span>
            <div style="flex: 1;">
                <strong style="font-size: 13px;">${doc.nombre}</strong>
                <small style="color: var(--color-text-light); display: block;">${Math.round((doc.tamano || doc.tamaño || 0) / 1024)} KB · ${doc.fecha || ''}</small>
            </div>
            <button type="button" onclick="verDocumento(${index})" class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;">Ver</button>
            <button type="button" onclick="eliminarDocumento(${index})" class="btn" style="padding: 4px 10px; font-size: 12px; background: var(--color-danger); color: white;">X</button>
        </div>
    `).join('');
}

function verDocumento(index) {
    const docs = casoActual.documentos || [];
    if (!docs[index] || !docs[index].data) return;

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
    guardarCasoEnCacheLocal();
    renderizarDocumentos();
}

async function guardarActualizacion(e) {
    e.preventDefault();

    const fechaActuacion = document.getElementById('fechaActuacion').value;
    const tipoActuacion = document.getElementById('tipoActuacion').value;
    const descripcion = (document.getElementById('descripcionActuacion').value || '').toUpperCase() || null;
    const fechaVencimiento = document.getElementById('fechaVencimiento').value || null;

    const nuevaActuacion = {
        fecha_actuacion: fechaActuacion,
        tipo_actuacion: tipoActuacion,
        descripcion,
        actualizado_siij: 'NO'
    };

    casoActual.seguimiento = nuevaActuacion;
    casoActual.fecha_vencimiento = fechaVencimiento;
    casoActual.fecha_actualizacion = new Date().toISOString();

    const inputPDF = document.getElementById('inputPDF');
    const file = inputPDF.files && inputPDF.files[0];

    if (file) {
        try {
            const base64 = await leerArchivoComoDataURL(file);
            if (!casoActual.documentos) casoActual.documentos = [];
            casoActual.documentos.push({
                nombre: file.name,
                tamano: file.size,
                fecha: new Date().toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' }),
                data: base64
            });
        } catch (err) {
            alert('Error al leer el archivo PDF');
            return;
        }
    }

    await guardarEnSupabaseYCache(nuevaActuacion);
}

function leerArchivoComoDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = event => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

async function guardarEnSupabaseYCache(nuevaActuacion) {
    try {
        const resultado = await actualizarSeguimientoCasoCivil(
            casoActual.id,
            nuevaActuacion,
            casoActual.fecha_vencimiento
        );

        casoActual = {
            ...casoActual,
            ...(resultado.expediente || {}),
            seguimiento: resultado.actuacion || nuevaActuacion,
            seguimientos: [resultado.actuacion || nuevaActuacion].concat(casoActual.seguimientos || [])
        };
        guardarCasoEnCacheLocal();

        alert('Seguimiento actualizado correctamente');
        window.location.href = `detalleCaso.html?id=${casoActual.id}`;
    } catch (err) {
        console.error('Error al guardar seguimiento civil:', err);
        alert('No se pudo guardar el seguimiento: ' + err.message);
    }
}

function guardarCasoEnCacheLocal() {
    const casos = JSON.parse(localStorage.getItem('casos') || '[]');
    const index = casos.findIndex(c => c.id === casoActual.id);
    if (index !== -1) {
        casos[index] = { ...casos[index], ...casoActual };
    } else {
        casos.unshift(casoActual);
    }
    localStorage.setItem('casos', JSON.stringify(casos));
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}
