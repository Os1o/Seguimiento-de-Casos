// =====================================================
// HEADER COMPONENT - Reutilizable para todas las vistas
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.app-header').forEach(renderizarHeaderApp);
});

function renderizarHeaderApp(header) {
    const homeHref = header.dataset.homeHref || 'casos.html';
    const moduleLabel = header.dataset.module || 'Sistema de Seguimiento';
    const backHref = header.dataset.backHref || '';
    const backLabel = header.dataset.backLabel || 'Volver';
    const showSession = header.dataset.showSession !== 'false';
    const showAdminLink = header.dataset.adminLink === 'true';

    const acciones = [];
    if (backHref) {
        acciones.push(`<a href="${backHref}" class="btn-header-link">${backLabel}</a>`);
    }
    if (showAdminLink) {
        acciones.push('<a href="adminUsuarios.html" id="linkAdmin" class="btn-header-link btn-header-link-ghost" style="display:none;">Administrar Usuarios</a>');
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
        <button class="btn-logout" onclick="cerrarSesion()">Cerrar Sesion</button>
    ` : '';

    header.innerHTML = `
        <div class="app-header-inner">
            <div class="header-logo">
                <a href="${homeHref}" class="header-brand-badge" aria-label="Inicio">SJ</a>
                <div class="header-brand-copy">
                    <span class="header-kicker">Direccion Juridica</span>
                    <span class="logo-text">Gobierno de Mexico</span>
                </div>
                <span class="header-module-badge">${moduleLabel}</span>
            </div>
            <nav class="header-nav">
                <div class="header-actions">
                    ${acciones.join('')}
                </div>
                ${bloqueSesion}
            </nav>
        </div>
    `;
}
