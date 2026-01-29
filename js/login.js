// =====================================================
// LOGIN.JS - Funcionalidad de inicio de sesión
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    // Verificar si ya hay sesión activa
    const sesionActiva = localStorage.getItem('usuario');
    if (sesionActiva) {
        // Si ya hay sesión, redirigir a casos
        window.location.href = 'casos.html';
        return;
    }
    
    // Manejar submit del formulario
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;
        
        // Validar campos
        if (!usuario || !password) {
            alert('Por favor completa todos los campos');
            return;
        }
        
        // FAKE LOGIN - En la maqueta, cualquier usuario funciona
        // En producción, esto haría una petición al backend
        realizarLogin(usuario, password);
    });
});

function realizarLogin(usuario, password) {
    // Simular delay de petición al servidor
    const btnSubmit = document.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.textContent = 'Iniciando sesión...';
    
    setTimeout(() => {
        // DATOS FAKE - Siempre acepta el login
        // Usar el usuario fake de datos-fake.js
        const usuarioData = {
            ...usuarioFake,
            usuario: usuario // Usar el usuario que ingresó
        };
        
        // Guardar en localStorage (simula sesión)
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        
        // Redirigir a la página de casos
        window.location.href = 'casos.html';
    }, 800);
}

// Función para cerrar sesión (se usa en otras páginas)
function cerrarSesion() {
    localStorage.removeItem('usuario');
    window.location.href = 'login.html';
}