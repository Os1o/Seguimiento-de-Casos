// =====================================================
// HEADER COMPONENT - Reutilizable para todas las vistas
// =====================================================

const APP_SESSION_STORAGE_USER_KEY = 'usuario';

instalarFetchConTokenSesion();

if (debeForzarLoginPorSesionLocalAusente()) {
    cerrarSesionServidorPorSesionLocalAusente();
    window.location.replace('login.html');
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.app-header').forEach(renderizarHeaderApp);
    validarSesionActivaEnCarga();
    inicializarControlSesionInactiva();
    inicializarDatePickerClickToOpen();
});

const APP_SESSION_TIMEOUT_MS = 10 * 60 * 1000;
const APP_SESSION_HEARTBEAT_MS = 4 * 60 * 1000;
const APP_VIEW_LOADING_MIN_MS = 350;
const APP_BLOCK_LOADING_MIN_MS = 420;
let appSessionLastInteraction = Date.now();
let appSessionLastHeartbeat = 0;
let appSessionLogoutInProgress = false;
let appSessionIdleTimer = null;
let appSessionHeartbeatTimer = null;
let appSessionInactivityControlInitialized = false;
let appViewLoadingStartedAt = 0;
let appDialogActivo = null;
const appBlockLoadingStartedAt = new WeakMap();

function asegurarAssetHead(tagName, atributos = {}) {
    const selector = Object.entries(atributos)
        .map(([key, value]) => `[${key}="${String(value).replace(/"/g, '\\"')}"]`)
        .join('');

    let elemento = document.head.querySelector(`${tagName}${selector}`);
    if (elemento) {
        return elemento;
    }

    elemento = document.createElement(tagName);
    Object.entries(atributos).forEach(([key, value]) => {
        elemento.setAttribute(key, value);
    });
    document.head.appendChild(elemento);
    return elemento;
}

function asegurarAssetsHeaderModerno() {
    if (document.body) {
        document.body.classList.add('modern-header-page');
    }

    asegurarAssetHead('link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' });
    asegurarAssetHead('link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' });
    asegurarAssetHead('link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;600;700&display=swap'
    });
    asegurarAssetHead('link', {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
    });

    const rutaNormalizada = (window.location.pathname || '').replace(/\\/g, '/').toLowerCase();
    const profundidad = (rutaNormalizada.match(/\//g) || []).length;
    const hrefEstilos = profundidad > 1 ? 'css/stylesNew.css' : 'css/stylesNew.css';
    asegurarAssetHead('link', { rel: 'stylesheet', href: hrefEstilos });
}

function iconoHeaderModernoInicio() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-4.8v-6.2H9.8V21H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8.7 21v-5.2h6.6V21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>';
}

function iconoHeaderModernoEngrane() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.02 7.02 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.58.22-1.12.53-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.41 1.05.72 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.58-.22 1.13-.53 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>';
}

function iconoHeaderModernoUsuarios() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M16.5 19.5v-1.2a3.3 3.3 0 0 0-3.3-3.3H8.8a3.3 3.3 0 0 0-3.3 3.3v1.2" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><circle cx="11" cy="8.5" r="3.1" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M18 9.4a2.4 2.4 0 0 1 0 4.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
}

function iconoHeaderModernoBitacora() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M7 5.5h10a1.5 1.5 0 0 1 1.5 1.5v11A1.5 1.5 0 0 1 17 19.5H7A1.5 1.5 0 0 1 5.5 18V7A1.5 1.5 0 0 1 7 5.5Z" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8.5 9.2 2.3 2.3 4.7-4.7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 15.3h7" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
}

function iconoHeaderModernoBajas() {
    return '<svg viewBox="0 0 24 24" focusable="false"><circle cx="10.5" cy="8.2" r="3.2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M4.8 18.8a5.8 5.8 0 0 1 11.4 0" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m16.7 7.3 4.3 4.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="m21 7.3-4.3 4.3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
}

function iconoHeaderModernoSalir() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 16l4-4-4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12H4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
}

function inicializarDatePickerClickToOpen() {
    if (window.__appDatePickerClickInstalled) {
        return;
    }

    document.addEventListener('click', function (event) {
        const input = event.target instanceof Element
            ? event.target.closest('input[type="date"]')
            : null;

        if (!input || input.disabled || input.readOnly) {
            return;
        }

        if (typeof input.showPicker === 'function') {
            try {
                input.showPicker();
            } catch (error) {
                console.error('No se pudo abrir el selector de fecha:', error);
            }
        }
    });

    window.__appDatePickerClickInstalled = true;
}

function instalarFetchConTokenSesion() {
    if (typeof window.fetch !== 'function' || window.__appFetchTokenInstalled) {
        return;
    }

    const originalFetch = window.fetch.bind(window);

    window.fetch = function (input, init = {}) {
        const requestUrl = typeof input === 'string'
            ? input
            : (input && typeof input.url === 'string' ? input.url : '');

        if (!requestUrl.includes('api/')) {
            return originalFetch(input, init);
        }

        let sessionToken = '';

        try {
            const usuarioStr = sessionStorage.getItem(APP_SESSION_STORAGE_USER_KEY);
            if (usuarioStr) {
                const usuario = JSON.parse(usuarioStr);
                sessionToken = typeof usuario?.session_token === 'string' ? usuario.session_token : '';
            }
        } catch (error) {
            console.error('No se pudo leer el token de sesion del navegador:', error);
        }

        const ejecutarFetch = (requestInit) =>
            originalFetch(input, requestInit).then(async (response) => {
                if (response.status === 401 && !window.location.pathname.toLowerCase().endsWith('/login.html')) {
                    let mensajeSesion = 'Tu sesión ya no es valida. Vuelve a iniciar sesión.';

                    try {
                        const payload = await response.clone().json();
                        if (payload && typeof payload.message === 'string' && payload.message.trim() !== '') {
                            if (payload.message.includes('reemplazada')) {
                                mensajeSesion = 'Tu sesión se cerro porque esta cuenta inicio sesión en otro navegador o equipo.';
                            } else {
                                mensajeSesion = payload.message;
                            }
                        }
                    } catch (error) {
                        console.error('No se pudo leer el mensaje de sesion expirada:', error);
                    }

                    sessionStorage.removeItem(APP_SESSION_STORAGE_USER_KEY);
                    sessionStorage.setItem('session_expired_message', mensajeSesion);
                    window.location.href = 'login.html';
                }

                return response;
            });

        if (!sessionToken) {
            return ejecutarFetch(init);
        }

        const headers = new Headers(
            init.headers || (input instanceof Request ? input.headers : undefined)
        );
        headers.set('X-App-Session-Token', sessionToken);

        return ejecutarFetch({
            ...init,
            headers
        });
    };

    window.__appFetchTokenInstalled = true;
}

function construirUrlApiConToken(url) {
    const urlBase = String(url || '');
    if (!urlBase) {
        return urlBase;
    }

    try {
        const usuarioStr = sessionStorage.getItem(APP_SESSION_STORAGE_USER_KEY);
        if (!usuarioStr) {
            return urlBase;
        }

        const usuario = JSON.parse(usuarioStr);
        const sessionToken = typeof usuario?.session_token === 'string' ? usuario.session_token.trim() : '';
        if (!sessionToken) {
            return urlBase;
        }

        const absoluteUrl = new URL(urlBase, window.location.href);
        absoluteUrl.searchParams.set('app_session_token', sessionToken);
        return absoluteUrl.toString();
    } catch (error) {
        console.error('No se pudo construir la URL autenticada:', error);
        return urlBase;
    }
}

window.construirUrlApiConToken = construirUrlApiConToken;

function asegurarOverlayCargaVista(hostSelector = '.container') {
    const host = typeof hostSelector === 'string'
        ? document.querySelector(hostSelector)
        : hostSelector;

    if (!host) {
        return null;
    }

    host.classList.add('view-loading-host');

    let overlay = host.querySelector('.view-loading-overlay');
    if (overlay) {
        return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'view-loading-overlay';
    if (host === document.body) {
        overlay.classList.add('view-loading-overlay-fullscreen');
    }
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="view-loading-card">
            <span class="view-loading-spinner" aria-hidden="true"></span>
            <span class="view-loading-text">Cargando vista</span>
        </div>
    `;

    host.appendChild(overlay);
    return overlay;
}

window.mostrarCargaVista = function (hostSelector = '.container') {
    const overlay = asegurarOverlayCargaVista(hostSelector);
    if (!overlay) {
        return;
    }

    appViewLoadingStartedAt = Date.now();
    overlay.classList.add('is-visible');
};

window.ocultarCargaVista = async function (hostSelector = '.container') {
    const overlay = asegurarOverlayCargaVista(hostSelector);
    if (!overlay) {
        return;
    }

    const tiempoVisible = Date.now() - appViewLoadingStartedAt;
    const restante = Math.max(0, APP_VIEW_LOADING_MIN_MS - tiempoVisible);

    if (restante > 0) {
        await new Promise(resolve => setTimeout(resolve, restante));
    }

    overlay.classList.remove('is-visible');
};

function asegurarOverlayCargaBloque(hostSelector = '.table-container') {
    const host = typeof hostSelector === 'string'
        ? document.querySelector(hostSelector)
        : hostSelector;

    if (!host) {
        return null;
    }

    host.classList.add('block-loading-host');

    let overlay = host.querySelector('.block-loading-overlay');
    if (overlay) {
        return overlay;
    }

    overlay = document.createElement('div');
    overlay.className = 'block-loading-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
        <div class="block-loading-card">
            <span class="view-loading-spinner" aria-hidden="true"></span>
            <span class="block-loading-text">Actualizando tabla</span>
        </div>
    `;

    host.appendChild(overlay);
    return overlay;
}

window.mostrarCargaBloque = function (hostSelector = '.table-container') {
    const overlay = asegurarOverlayCargaBloque(hostSelector);
    if (!overlay) {
        return;
    }

    appBlockLoadingStartedAt.set(overlay, Date.now());
    overlay.classList.add('is-visible');
};

window.ocultarCargaBloque = async function (hostSelector = '.table-container') {
    const overlay = asegurarOverlayCargaBloque(hostSelector);
    if (!overlay) {
        return;
    }

    const startedAt = appBlockLoadingStartedAt.get(overlay) || 0;
    const tiempoVisible = startedAt > 0 ? (Date.now() - startedAt) : APP_BLOCK_LOADING_MIN_MS;
    const restante = Math.max(0, APP_BLOCK_LOADING_MIN_MS - tiempoVisible);

    if (restante > 0) {
        await new Promise(resolve => setTimeout(resolve, restante));
    }

    overlay.classList.remove('is-visible');
};

function asegurarDialogoAplicacion() {
    if (appDialogActivo) {
        return appDialogActivo;
    }

    const overlay = document.createElement('div');
    overlay.className = 'app-dialog-overlay';
    overlay.setAttribute('aria-hidden', 'true');

    const dialog = document.createElement('div');
    dialog.className = 'app-dialog';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    const title = document.createElement('h3');
    title.className = 'app-dialog-title';

    const body = document.createElement('div');
    body.className = 'app-dialog-body';

    const actions = document.createElement('div');
    actions.className = 'app-dialog-actions';

    dialog.appendChild(title);
    dialog.appendChild(body);
    dialog.appendChild(actions);
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);

    appDialogActivo = { overlay, dialog, title, body, actions };
    return appDialogActivo;
}

function limpiarDialogoAplicacion() {
    if (!appDialogActivo) {
        return;
    }

    appDialogActivo.title.textContent = '';
    appDialogActivo.body.innerHTML = '';
    appDialogActivo.actions.innerHTML = '';
    appDialogActivo.overlay.classList.remove('is-visible');
    appDialogActivo.overlay.setAttribute('aria-hidden', 'true');
}

function llenarDialogoMensaje(bodyNode, message) {
    const texto = Array.isArray(message) ? message.join('\n\n') : String(message || '');
    const bloques = texto.split(/\n\s*\n/).map(item => item.trim()).filter(Boolean);

    if (bloques.length === 0) {
        const parrafo = document.createElement('p');
        parrafo.textContent = '';
        bodyNode.appendChild(parrafo);
        return;
    }

    bloques.forEach(bloque => {
        const parrafo = document.createElement('p');
        parrafo.textContent = bloque;
        bodyNode.appendChild(parrafo);
    });
}

window.appAlert = function ({ title = 'Aviso', message = '', confirmText = 'Aceptar' } = {}) {
    const modal = asegurarDialogoAplicacion();

    return new Promise(resolve => {
        limpiarDialogoAplicacion();
        modal.title.textContent = title;
        llenarDialogoMensaje(modal.body, message);

        const botonAceptar = document.createElement('button');
        botonAceptar.type = 'button';
        botonAceptar.className = 'btn btn-primary app-dialog-btn-primary';
        botonAceptar.textContent = confirmText;
        botonAceptar.addEventListener('click', function () {
            limpiarDialogoAplicacion();
            resolve(true);
        });

        modal.actions.appendChild(botonAceptar);
        modal.overlay.classList.add('is-visible');
        modal.overlay.setAttribute('aria-hidden', 'false');
        botonAceptar.focus();
    });
};

window.appConfirm = function ({
    title = 'Confirmar',
    message = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar'
} = {}) {
    const modal = asegurarDialogoAplicacion();

    return new Promise(resolve => {
        const cerrar = function (resultado) {
            limpiarDialogoAplicacion();
            resolve(resultado);
        };

        limpiarDialogoAplicacion();
        modal.title.textContent = title;
        llenarDialogoMensaje(modal.body, message);

        const botonCancelar = document.createElement('button');
        botonCancelar.type = 'button';
        botonCancelar.className = 'btn btn-secondary';
        botonCancelar.textContent = cancelText;
        botonCancelar.addEventListener('click', function () {
            cerrar(false);
        });

        const botonAceptar = document.createElement('button');
        botonAceptar.type = 'button';
        botonAceptar.className = 'btn btn-primary app-dialog-btn-primary';
        botonAceptar.textContent = confirmText;
        botonAceptar.addEventListener('click', function () {
            cerrar(true);
        });

        modal.overlay.onclick = function (event) {
            if (event.target === modal.overlay) {
                cerrar(false);
            }
        };

        modal.actions.appendChild(botonCancelar);
        modal.actions.appendChild(botonAceptar);
        modal.overlay.classList.add('is-visible');
        modal.overlay.setAttribute('aria-hidden', 'false');
        botonAceptar.focus();
    });
};

function debeForzarLoginPorSesionLocalAusente() {
    const header = document.querySelector('.app-header');
    if (!header || header.dataset.showSession === 'false') {
        return false;
    }

    if (window.location.pathname.toLowerCase().endsWith('/login.html')) {
        return false;
    }

    const usuarioSesion = sessionStorage.getItem(APP_SESSION_STORAGE_USER_KEY);
    return !usuarioSesion;
}

function cerrarSesionServidorPorSesionLocalAusente() {
    try {
        if (navigator.sendBeacon) {
            navigator.sendBeacon('api/logoutBeacon.php', new Blob([], { type: 'text/plain' }));
            return;
        }
    } catch (error) {
        console.error('No se pudo notificar el cierre de sesion al servidor:', error);
    }

    fetch('api/logoutBeacon.php', {
        method: 'POST',
        credentials: 'same-origin',
        keepalive: true
    }).catch(error => {
        console.error('No se pudo cerrar la sesion del servidor:', error);
    });
}

function validarSesionActivaEnCarga() {
    const header = document.querySelector('.app-header');
    if (!header || header.dataset.showSession === 'false') {
        return;
    }

    const usuarioSesion = sessionStorage.getItem(APP_SESSION_STORAGE_USER_KEY);
    if (!usuarioSesion) {
        return;
    }

    fetch('api/session.php', {
        method: 'GET',
        credentials: 'same-origin'
    }).catch(error => {
        console.error('No se pudo validar la sesion al cargar la pagina:', error);
    });
}

function obtenerUsuarioSesionHeader() {
    try {
        const usuarioSesion = sessionStorage.getItem(APP_SESSION_STORAGE_USER_KEY);
        return usuarioSesion ? JSON.parse(usuarioSesion) : null;
    } catch (error) {
        console.error('No se pudo leer la sesion para el header:', error);
        return null;
    }
}

function obtenerInicialesHeader(nombreCompleto, usuarioFallback = '') {
    const fuente = String(nombreCompleto || usuarioFallback || '').trim();
    if (!fuente) {
        return 'SJ';
    }

    const partes = fuente.split(/\s+/).filter(Boolean);
    if (partes.length === 1) {
        return partes[0].slice(0, 2).toUpperCase();
    }

    return `${partes[0][0] || ''}${partes[1][0] || ''}`.toUpperCase();
}

function formatearRolHeader(rol = '') {
    const rolNormalizado = String(rol || '').trim().toLowerCase();
    const etiquetas = {
        admin: 'ADMIN',
        editor: 'EDITOR',
        consulta: 'CONSULTA'
    };

    return etiquetas[rolNormalizado] || String(rol || '').trim().toUpperCase();
}

function usuarioEsJefeHeader(usuario = null) {
    return Boolean(usuario?.esJefe || usuario?.es_jefe);
}

function usuarioEsAbogadoHeader(usuario = null) {
    return Boolean(usuario?.esAbogado || usuario?.es_abogado);
}

function construirBadgesSecundariosHeader(usuario = null) {
    const badges = [];

    if (usuarioEsJefeHeader(usuario)) {
        badges.push('<span class="header-modern-attribute-badge">JEFE DE AREA</span>');
    }

    if (usuarioEsAbogadoHeader(usuario)) {
        badges.push('<span class="header-modern-attribute-badge">ABOGADO</span>');
    }

    return badges.join('');
}

function prepararMarcoGraficaDashboard(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        return;
    }

    const parent = canvas.parentElement;
    if (!parent || parent.classList.contains('grafica-canvas-frame')) {
        return;
    }

    const frame = document.createElement('div');
    frame.className = 'grafica-canvas-frame';
    canvas.parentNode.insertBefore(frame, canvas);
    frame.appendChild(canvas);

    const center = document.createElement('div');
    center.className = 'grafica-canvas-center';
    center.innerHTML = `
        <strong class="grafica-canvas-center-value">0</strong>
        <small class="grafica-canvas-center-label">Sin datos</small>
    `;
    frame.appendChild(center);
}

function trazarRectanguloRedondeado(ctx, x, y, width, height, radius) {
    const safeRadius = Math.max(0, Math.min(radius, width / 2, height / 2));
    ctx.beginPath();
    ctx.moveTo(x + safeRadius, y);
    ctx.lineTo(x + width - safeRadius, y);
    ctx.arcTo(x + width, y, x + width, y + safeRadius, safeRadius);
    ctx.lineTo(x + width, y + height - safeRadius);
    ctx.arcTo(x + width, y + height, x + width - safeRadius, y + height, safeRadius);
    ctx.lineTo(x + safeRadius, y + height);
    ctx.arcTo(x, y + height, x, y + height - safeRadius, safeRadius);
    ctx.lineTo(x, y + safeRadius);
    ctx.arcTo(x, y, x + safeRadius, y, safeRadius);
    ctx.closePath();
}

function renderizarHeaderApp(header) {
    if (header.dataset.headerVariant === 'modern') {
        renderizarHeaderAppModerno(header);
        return;
    }

    const homeHref = header.dataset.homeHref || 'casos.html';
    const backHref = header.dataset.backHref || '';
    const backLabel = header.dataset.backLabel || 'Volver';
    const showSession = header.dataset.showSession !== 'false';
    const showAdminLink = header.dataset.adminLink === 'true';

    const acciones = [];
    if (backHref) {
        acciones.push(`<a href="${backHref}" class="btn-header-link btn-header-link-back">${backLabel}</a>`);
    }
    if (showAdminLink) {
        acciones.push(`
            <div id="linkAdmin" class="header-admin-menu" style="display:none;">
                <button type="button" id="linkAdminTrigger" class="btn-header-link btn-header-link-ghost header-admin-trigger" aria-expanded="false" aria-haspopup="true">
                    Administración
                    <span class="header-admin-caret">&#9662;</span>
                </button>
                <div id="adminDropdown" class="header-admin-dropdown" role="menu">
                    <a href="adminUsuarios.html" class="header-admin-item" role="menuitem">Usuarios</a>
                    <a href="auditoria.html" class="header-admin-item" role="menuitem">Bitácora</a>
                    <a href="adminBajas.html" class="header-admin-item" role="menuitem">Dados de baja</a>
                </div>
            </div>
        `);
    }

    const bloqueSesion = showSession ? `
        <div class="header-user">
            <div class="header-user-main">
                <span id="nombreUsuario" class="header-user-name">Usuario</span>
                <div class="header-user-meta">
                    <span id="badgeRol" class="badge-rol"></span>
                    <small id="infoOOAD" class="info-ooad"></small>
                </div>
            </div>
        </div>
        <button class="btn-logout" type="button" data-action="logout">Salir</button>
    ` : '';

    header.innerHTML = `
        <div class="app-header-inner">
            <div class="header-side header-side-left">
                <a href="${homeHref}" class="header-icon-button header-home-button" aria-label="Inicio">SJ</a>
                <div class="header-brand-block">
                    <span class="header-brand-kicker">Dirección Juridica</span>
                </div>
            </div>
            <nav class="header-nav">
                <div class="header-actions">
                    ${acciones.join('')}
                </div>
                ${bloqueSesion}
            </nav>
        </div>
    `;

    const logoutButton = header.querySelector('[data-action="logout"]');
    const adminMenuContainer = header.querySelector('#linkAdmin');
    const adminTrigger = header.querySelector('#linkAdminTrigger');
    const adminDropdown = header.querySelector('#adminDropdown');

    if (adminTrigger && adminDropdown) {
        adminTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            const isOpen = adminDropdown.classList.toggle('show');
            adminTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function (event) {
            if (!adminMenuContainer || !adminDropdown.classList.contains('show')) {
                return;
            }

            if (!adminMenuContainer.contains(event.target)) {
                adminDropdown.classList.remove('show');
                adminTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async function () {
            const confirmacion = await window.appConfirm?.({
                title: 'Cerrar sesión',
                message: '¿Deseas cerrar tu sesión ahora?',
                confirmText: 'Salir',
                cancelText: 'Cancelar'
            });

            if (!confirmacion) {
                return;
            }

            if (typeof window.cerrarSesion === 'function') {
                await window.cerrarSesion();
                return;
            }

            try {
                await fetch('api/logout.php', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
            } catch (error) {
                console.error('Error al cerrar sesion desde el header:', error);
            } finally {
                sessionStorage.removeItem('usuario');
                window.location.href = 'login.html';
            }
        });
    }
}

function renderizarHeaderAppModerno(header) {
    asegurarAssetsHeaderModerno();

    const homeHref = header.dataset.homeHref || 'casos.html';
    const showAdminLink = header.dataset.adminLink === 'true';
    const moduloActual = header.dataset.module || '';
    const esVistaPrincipal = header.dataset.mainView === 'true';
    const mostrarNavegacionModulos = header.dataset.showModuleNav !== 'false';
    const mostrarBreadcrumbInterno = !esVistaPrincipal && header.dataset.breadcrumbInHeader !== 'false';
    const usuario = obtenerUsuarioSesionHeader();
    const nombreUsuario = usuario?.nombre_completo || 'Usuario';
    const iniciales = obtenerInicialesHeader(usuario?.nombre_completo, usuario?.usuario);
    const textoRol = formatearRolHeader(usuario?.rol);
    const badgesSecundarios = construirBadgesSecundariosHeader(usuario);
    const puedeVerCivil = !usuario || usuario.rol === 'admin' || Boolean(usuario.permiso_civil_mercantil);
    const puedeVerPenal = !usuario || usuario.rol === 'admin' || Boolean(usuario.permiso_penal);

    const enlaces = [];
    if (!esVistaPrincipal) {
        enlaces.push(`
            <a href="${homeHref}" class="header-modern-link ${moduloActual === 'Inicio' ? 'is-active' : ''}">
                <span class="header-modern-link-icon header-modern-svg-icon" aria-hidden="true">${iconoHeaderModernoInicio()}</span>
                <span>Inicio</span>
            </a>
        `);
    }

    if (mostrarNavegacionModulos && puedeVerCivil) {
        enlaces.push(`<a href="casos.html" class="header-modern-link ${moduloActual === 'Civil / Mercantil' ? 'is-active' : ''}"><span>Civil / Mercantil</span></a>`);
    }

    if (mostrarNavegacionModulos && puedeVerPenal) {
        enlaces.push(`<a href="penal.html" class="header-modern-link ${moduloActual === 'Penal' ? 'is-active' : ''}"><span>Penal</span></a>`);
    }

    const adminControl = showAdminLink ? `
        <div id="linkAdmin" class="header-modern-admin" style="display:none;">
            <button type="button" id="linkAdminTrigger" class="header-modern-icon-button" aria-expanded="false" aria-haspopup="true" aria-label="Administracion">
                <span class="header-modern-svg-icon" aria-hidden="true">${iconoHeaderModernoEngrane()}</span>
            </button>
            <div id="adminDropdown" class="header-modern-dropdown" role="menu">
                <a href="adminUsuarios.html" class="header-modern-dropdown-item" role="menuitem">
                    <span class="header-modern-svg-icon header-modern-dropdown-icon" aria-hidden="true">${iconoHeaderModernoUsuarios()}</span>
                    <span>Usuarios</span>
                </a>
                <a href="auditoria.html" class="header-modern-dropdown-item" role="menuitem">
                    <span class="header-modern-svg-icon header-modern-dropdown-icon" aria-hidden="true">${iconoHeaderModernoBitacora()}</span>
                    <span>Bitacora</span>
                </a>
                <a href="adminBajas.html" class="header-modern-dropdown-item" role="menuitem">
                    <span class="header-modern-svg-icon header-modern-dropdown-icon" aria-hidden="true">${iconoHeaderModernoBajas()}</span>
                    <span>Dados de baja</span>
                </a>
            </div>
        </div>
    ` : '';

    header.innerHTML = `
        <div class="header-modern-shell">
            <div class="header-modern-brand-zone">
                <a href="${homeHref}" class="header-modern-brand">Direccion Juridica</a>
                <nav class="header-modern-nav" aria-label="Navegacion principal">
                    ${enlaces.join('')}
                </nav>
            </div>
            <div class="header-modern-user-zone">
                ${adminControl}
                <div class="header-modern-divider" aria-hidden="true"></div>
                <div class="header-modern-user-meta">
                    <strong class="header-modern-user-name">${nombreUsuario}</strong>
                    <small id="infoOOAD" class="header-modern-user-location"></small>
                    <div class="header-modern-user-badges">
                        <span id="badgeRol" class="badge-rol header-modern-role-badge badge-rol-${String(usuario?.rol || '').toLowerCase()}">${textoRol}</span>
                        ${badgesSecundarios}
                    </div>
                </div>
                <div class="header-modern-avatar-wrap">
                    <button type="button" class="header-modern-avatar" aria-label="Perfil del usuario">
                        <span id="inicialesUsuario">${iniciales}</span>
                    </button>
                    <div class="header-modern-user-tooltip" aria-hidden="true">
                        <strong id="nombreUsuario" class="header-modern-user-tooltip-name">${nombreUsuario}</strong>
                    </div>
                </div>
                <button class="header-modern-logout" type="button" data-action="logout" aria-label="Cerrar sesión">
                    <span class="header-modern-svg-icon" aria-hidden="true">${iconoHeaderModernoSalir()}</span>
                </button>
            </div>
        </div>
        ${mostrarBreadcrumbInterno ? `
        <div class="header-modern-breadcrumb-bar" id="headerModernBreadcrumbBar" hidden>
            <div class="header-modern-breadcrumb-shell">
                <nav class="header-modern-breadcrumb" id="headerModernBreadcrumb" aria-label="Ruta de navegacion"></nav>
            </div>
        </div>
        ` : ''}
    `;

    const logoutButton = header.querySelector('[data-action="logout"]');
    const adminMenuContainer = header.querySelector('#linkAdmin');
    const adminTrigger = header.querySelector('#linkAdminTrigger');
    const adminDropdown = header.querySelector('#adminDropdown');

    if (adminMenuContainer && usuario?.rol === 'admin') {
        adminMenuContainer.style.display = '';
    }

    if (adminTrigger && adminDropdown) {
        adminTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const isOpen = adminDropdown.classList.toggle('show');
            adminTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        document.addEventListener('click', function (event) {
            if (!adminMenuContainer || !adminDropdown.classList.contains('show')) {
                return;
            }

            if (!adminMenuContainer.contains(event.target)) {
                adminDropdown.classList.remove('show');
                adminTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', async function () {
            const confirmacion = await window.appConfirm?.({
                title: 'Cerrar sesión',
                message: '¿Deseas cerrar tu sesión ahora?',
                confirmText: 'Salir',
                cancelText: 'Cancelar'
            });

            if (!confirmacion) {
                return;
            }

            if (typeof window.cerrarSesion === 'function') {
                await window.cerrarSesion();
                return;
            }

            try {
                await fetch('api/logout.php', {
                    method: 'GET',
                    credentials: 'same-origin'
                });
            } catch (error) {
                console.error('Error al cerrar sesión desde el header:', error);
            } finally {
                sessionStorage.removeItem('usuario');
                window.location.href = 'login.html';
            }
        });
    }

    sincronizarBreadcrumbHeaderModerno(header, homeHref);
}

function construirMarkupBreadcrumbHeader(items = []) {
    return items.map((item, index) => {
        const esUltimo = index === items.length - 1;

        return `
            ${item.href && !esUltimo
                ? `<a href="${item.href}" class="header-modern-breadcrumb-link">${item.label}</a>`
                : `<span class="header-modern-breadcrumb-current">${item.label}</span>`
            }
            ${!esUltimo ? '<span class="header-modern-breadcrumb-separator" aria-hidden="true">/</span>' : ''}
        `;
    }).join('');
}

function obtenerItemsBreadcrumbDesdePagina(homeHref = 'casos.html') {
    const source = document.querySelector('.breadcrumbs');
    if (!source) {
        return [];
    }

    const links = Array.from(source.querySelectorAll('.breadcrumb-link'));
    const current = source.querySelector('.breadcrumb-current');
    const items = [];

    links.forEach((link, index) => {
        const label = (link.textContent || '').trim();
        if (!label) {
            return;
        }

        items.push({
            label,
            href: link.getAttribute('href') || (index === 0 ? homeHref : '')
        });
    });

    const currentLabel = (current?.textContent || '').trim();
    if (currentLabel) {
        items.push({ label: currentLabel, href: '' });
    }

    return items;
}

function sincronizarBreadcrumbHeaderModerno(header, homeHref = 'casos.html') {
    const breadcrumbBar = header.querySelector('#headerModernBreadcrumbBar');
    const breadcrumbNav = header.querySelector('#headerModernBreadcrumb');
    const source = document.querySelector('.breadcrumbs');

    if (!breadcrumbBar || !breadcrumbNav || !source) {
        document.body?.classList.remove('modern-header-breadcrumb-page');
        source?.classList.remove('header-modern-breadcrumb-source');
        return;
    }

    const renderizar = () => {
        const items = obtenerItemsBreadcrumbDesdePagina(homeHref);
        if (!items.length) {
            breadcrumbBar.hidden = true;
            if (source.classList.contains('header-modern-breadcrumb-source')) {
                source.classList.remove('header-modern-breadcrumb-source');
            }
            document.body?.classList.remove('modern-header-breadcrumb-page');
            return;
        }

        breadcrumbNav.innerHTML = construirMarkupBreadcrumbHeader(items);
        breadcrumbBar.hidden = false;
        if (!source.classList.contains('header-modern-breadcrumb-source')) {
            source.classList.add('header-modern-breadcrumb-source');
        }
        document.body?.classList.add('modern-header-breadcrumb-page');
    };

    renderizar();

    if (!source.dataset.headerBreadcrumbObserved) {
        const observer = new MutationObserver(() => renderizar());
        observer.observe(source, {
            childList: true,
            subtree: true,
            characterData: true
        });
        source.dataset.headerBreadcrumbObserved = 'true';
    }
}

function inicializarControlSesionInactiva() {
    if (appSessionInactivityControlInitialized) {
        return;
    }

    const activeHeader = document.querySelector('.app-header');
    if (!activeHeader || activeHeader.dataset.showSession === 'false') {
        return;
    }

    appSessionInactivityControlInitialized = true;

    const activityEvents = ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'];
    const registrarActividad = function () {
        appSessionLastInteraction = Date.now();
        programarTimeoutSesion();
    };

    activityEvents.forEach(eventName => {
        document.addEventListener(eventName, registrarActividad, { passive: true });
    });

    programarTimeoutSesion();

    appSessionHeartbeatTimer = window.setInterval(async function () {
        if (appSessionLogoutInProgress) {
            return;
        }

        const now = Date.now();
        if ((now - appSessionLastInteraction) >= APP_SESSION_TIMEOUT_MS) {
            return;
        }

        if ((now - appSessionLastHeartbeat) < APP_SESSION_HEARTBEAT_MS) {
            return;
        }

        appSessionLastHeartbeat = now;

        try {
            const response = await fetch('api/session.php', {
                method: 'GET',
                headers: {
                    'X-Heartbeat': '1'
                },
                credentials: 'same-origin'
            });

            if (response.status === 401) {
                await cerrarSesionPorInactividad();
            }
        } catch (error) {
            console.error('No se pudo refrescar la sesion activa:', error);
        }
    }, 60000);
}

function programarTimeoutSesion() {
    if (appSessionIdleTimer) {
        window.clearTimeout(appSessionIdleTimer);
    }

    appSessionIdleTimer = window.setTimeout(async function () {
        await cerrarSesionPorInactividad();
    }, APP_SESSION_TIMEOUT_MS);
}

async function cerrarSesionPorInactividad() {
    if (appSessionLogoutInProgress) {
        return;
    }

    appSessionLogoutInProgress = true;

    if (appSessionIdleTimer) {
        window.clearTimeout(appSessionIdleTimer);
    }

    if (appSessionHeartbeatTimer) {
        window.clearInterval(appSessionHeartbeatTimer);
    }

    sessionStorage.setItem('session_expired_message', 'La sesión se cerró por 10 minutos de inactividad.');

    try {
        if (typeof window.cerrarSesion === 'function') {
            await window.cerrarSesion();
            return;
        }

        await fetch('api/logout.php', {
            method: 'GET',
            credentials: 'same-origin'
        });
    } catch (error) {
        console.error('Error al cerrar sesión por inactividad:', error);
    } finally {
        sessionStorage.removeItem('usuario');
        window.location.href = 'login.html';
    }
}
