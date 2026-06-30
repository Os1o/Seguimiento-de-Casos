document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.app-header[data-header-variant="modern"]').forEach(renderizarHeaderListadoModerno);
    transformarListadosModernos();
});

function obtenerUsuarioHeaderModerno() {
    try {
        const usuario = sessionStorage.getItem('usuario');
        return usuario ? JSON.parse(usuario) : null;
    } catch (error) {
        console.error('No se pudo leer la sesion para el header moderno:', error);
        return null;
    }
}

function obtenerInicialesHeaderModerno(nombreCompleto, usuarioFallback = '') {
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

function iconoInicioHeader() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 10.8 12 4l8 6.8V20a1 1 0 0 1-1 1h-4.8v-6.2H9.8V21H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/><path d="M8.7 21v-5.2h6.6V21" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"/></svg>';
}

function iconoEngraneHeader() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="m10.1 4.4.5-1.4h2.8l.5 1.4 1.9.8 1.3-.6 2 2-1.1 2.3.4 1.7 1.3 1v2.8l-1.3 1-.4 1.7 1.1 2.3-2 2-1.3-.6-1.9.8-.5 1.4h-2.8l-.5-1.4-1.9-.8-1.3.6-2-2 1.1-2.3-.4-1.7-1.3-1v-2.8l1.3-1 .4-1.7-1.1-2.3 2-2 1.3.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.1" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
}

function iconoSalirHeader() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M10 16l4-4-4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 12H4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
}

function iconoFolderCard() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M4 7.5a1.5 1.5 0 0 1 1.5-1.5h4l1.6 1.8H18.5A1.5 1.5 0 0 1 20 9.3v7.2a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 16.5z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>';
}

function iconoPendingCard() {
    return '<svg viewBox="0 0 24 24" focusable="false"><path d="M8 5h8m-7 3h6m-9 3h12m-9 3h6m-8 4h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v10a4 4 0 0 0 4 4Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function iconoCheckCard() {
    return '<svg viewBox="0 0 24 24" focusable="false"><circle cx="12" cy="12" r="8.4" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="m8.6 12 2.1 2.2 4.7-4.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function transformarListadosModernos() {
    const header = document.querySelector('.app-header[data-header-variant="modern"]');
    if (!header) {
        return;
    }

    const moduloActual = header.dataset.module || '';
    const pageTitle = document.querySelector('.page-title');
    const pageSubtitle = document.querySelector('.page-subtitle');
    const nuevoBtn = document.getElementById('btnNuevoRegistro');

    if (moduloActual === 'Civil / Mercantil') {
        if (pageTitle) pageTitle.textContent = 'Resumen de Asuntos Judiciales';
        if (pageSubtitle) pageSubtitle.textContent = 'Métricas clave y estado de trámites activos en el sistema.';
  if (nuevoBtn) nuevoBtn.textContent = '+ Nuevo Registro';
    }

    if (moduloActual === 'Penal') {
    if (nuevoBtn) nuevoBtn.textContent = '+ Nuevo Registro';
    }

    transformarMetricCards(moduloActual);
}

function transformarMetricCards(moduloActual) {
    const cards = document.querySelectorAll('.dashboard-row .contador-card');
    if (cards.length < 4) {
        return;
    }

    const etiquetas = moduloActual === 'Penal'
        ? {
            pronosticoTitulo: 'Sentencia de Asuntos',
            pronosticoId: 'sentenciaResumen'
        }
        : {
            pronosticoTitulo: 'Pronóstico',
            pronosticoId: 'pronosticoResumen'
        };

    cards[0].classList.add('modern-metric-card');
    cards[0].innerHTML = `
        <div class="metric-topline">Total Expedientes</div>
        <div class="metric-content">
            <div class="metric-copy">
                <div class="contador-numero" id="totalCasos" style="color: var(--color-secondary);">0</div>
                <div class="metric-subtext" id="totalCasosExtra">Sin registros</div>
            </div>
            <span class="metric-icon" aria-hidden="true">${iconoFolderCard()}</span>
        </div>
    `;

    cards[1].classList.add('modern-metric-card');
    cards[1].innerHTML = `
        <div class="metric-topline">En Trámite</div>
        <div class="metric-content">
            <div class="metric-copy">
                <div class="contador-numero" id="casosTramite" style="color: var(--color-warning);">0</div>
                <div class="metric-subtext metric-subtext-strong" id="casosTramiteExtra">0% del total</div>
            </div>
            <span class="metric-icon" aria-hidden="true">${iconoPendingCard()}</span>
        </div>
    `;

    cards[2].classList.add('modern-metric-card');
    cards[2].innerHTML = `
        <div class="metric-topline">Concluidos</div>
        <div class="metric-content">
            <div class="metric-copy">
                <div class="contador-numero" id="casosConcluidos" style="color: var(--color-success);">0</div>
                <div class="metric-subtext" id="casosConcluidosExtra">Histórico</div>
            </div>
            <span class="metric-icon metric-icon-muted" aria-hidden="true">${iconoCheckCard()}</span>
        </div>
    `;

    const graficaTitulo = cards[3].querySelector('.grafica-label')?.textContent?.trim() || etiquetas.pronosticoTitulo;
    const canvas = cards[3].querySelector('canvas');
    const legendId = moduloActual === 'Penal' ? 'leyendaSentencia' : 'leyendaPronostico';
    const canvasId = moduloActual === 'Penal' ? 'chartSentencia' : 'chartPronostico';

    cards[3].classList.add('modern-metric-card');
    cards[3].innerHTML = `
        <div class="metric-topline">${graficaTitulo}</div>
        <div class="grafica-dona-row">
            <canvas id="${canvasId}" width="110" height="110"></canvas>
            <div class="grafica-sidecopy">
                <div class="metric-forecast-text" id="${etiquetas.pronosticoId}">Sin datos disponibles</div>
                <div class="grafica-leyenda" id="${legendId}"></div>
            </div>
        </div>
    `;

    if (canvas) {
        const nuevoCanvas = cards[3].querySelector('canvas');
        if (nuevoCanvas) {
            nuevoCanvas.width = canvas.width;
            nuevoCanvas.height = canvas.height;
        }
    }
}

function renderizarHeaderListadoModerno(header) {
    const usuario = obtenerUsuarioHeaderModerno();
    const homeHref = header.dataset.homeHref || 'casos.html';
    const backHref = header.dataset.backHref || '';
    const showAdminLink = header.dataset.adminLink === 'true';
    const moduloActual = header.dataset.module || '';
    const esVistaPrincipal = header.dataset.mainView === 'true';
    const puedeVerCivil = !usuario || usuario.rol === 'admin' || Boolean(usuario.permiso_civil_mercantil);
    const puedeVerPenal = !usuario || usuario.rol === 'admin' || Boolean(usuario.permiso_penal);
    const mostrarInicio = !esVistaPrincipal;
    const destinoInicio = backHref || homeHref || 'casos.html';
    const nombreUsuario = usuario?.nombre_completo || 'Usuario';
    const rolUsuario = usuario?.rol || '';
    const iniciales = obtenerInicialesHeaderModerno(usuario?.nombre_completo, usuario?.usuario);

    const enlaces = [];
    if (mostrarInicio) {
        enlaces.push(`
            <a href="${destinoInicio}" class="header-primary-link ${moduloActual === 'Inicio' ? 'is-active' : ''}">
                <span class="header-primary-icon" aria-hidden="true">${iconoInicioHeader()}</span>
                <span>Inicio</span>
            </a>
        `);
    }

    if (puedeVerCivil) {
        enlaces.push(`<a href="casos.html" class="header-primary-link ${moduloActual === 'Civil / Mercantil' ? 'is-active' : ''}"><span>Civil / Mercantil</span></a>`);
    }

    if (puedeVerPenal) {
        enlaces.push(`<a href="penal.html" class="header-primary-link ${moduloActual === 'Penal' ? 'is-active' : ''}"><span>Penal</span></a>`);
    }

    const adminControl = showAdminLink ? `
        <div id="linkAdmin" class="header-admin-menu header-admin-menu-modern" style="display:none;">
            <button type="button" id="linkAdminTrigger" class="header-utility-button" aria-expanded="false" aria-haspopup="true" aria-label="Administración">
                ${iconoEngraneHeader()}
            </button>
            <div id="adminDropdown" class="header-admin-dropdown header-admin-dropdown-modern" role="menu">
                <a href="adminUsuarios.html" class="header-admin-item" role="menuitem">Usuarios</a>
                <a href="auditoria.html" class="header-admin-item" role="menuitem">Bitácora</a>
                <a href="adminBajas.html" class="header-admin-item" role="menuitem">Dados de baja</a>
            </div>
        </div>
    ` : '';

    header.innerHTML = `
        <div class="app-header-inner app-header-inner-modern">
            <div class="header-brand-modern">
                <a href="${homeHref}" class="header-brand-link">Dirección Jurídica</a>
            </div>
            <nav class="header-primary-nav" aria-label="Navegación principal">
                ${enlaces.join('')}
            </nav>
            <div class="header-utility-zone">
                ${adminControl}
                <div class="header-session-panel">
                    <div class="header-session-meta">
                        <small id="infoOOAD" class="info-ooad"></small>
                        <span id="badgeRol" class="badge-rol"></span>
                    </div>
                    <div class="header-avatar-menu">
                        <button type="button" class="header-avatar-button" aria-label="Perfil del usuario">
                            <span id="inicialesUsuario" class="header-avatar-initials">${iniciales}</span>
                        </button>
                        <div class="header-user-tooltip" aria-hidden="true">
                            <strong id="nombreUsuario" class="header-user-tooltip-name">${nombreUsuario}</strong>
                            <small class="header-user-tooltip-role">${rolUsuario}</small>
                        </div>
                    </div>
                </div>
                <button class="header-utility-button header-logout-button-modern" type="button" data-action="logout" aria-label="Cerrar sesión">
                    ${iconoSalirHeader()}
                </button>
            </div>
        </div>
    `;

    const linkAdmin = header.querySelector('#linkAdmin');
    if (linkAdmin && usuario?.rol === 'admin') {
        linkAdmin.style.display = '';
    }

    const adminTrigger = header.querySelector('#linkAdminTrigger');
    const adminDropdown = header.querySelector('#adminDropdown');

    if (adminTrigger && adminDropdown) {
        adminTrigger.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const abierto = adminDropdown.classList.toggle('show');
            adminTrigger.setAttribute('aria-expanded', abierto ? 'true' : 'false');
        });

        document.addEventListener('click', function (event) {
            if (!linkAdmin || !adminDropdown.classList.contains('show')) {
                return;
            }

            if (!linkAdmin.contains(event.target)) {
                adminDropdown.classList.remove('show');
                adminTrigger.setAttribute('aria-expanded', 'false');
            }
        });
    }

    const logoutButton = header.querySelector('[data-action="logout"]');
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
                console.error('Error al cerrar sesión desde el header moderno:', error);
            } finally {
                sessionStorage.removeItem('usuario');
                window.location.href = 'login.html';
            }
        });
    }
}
