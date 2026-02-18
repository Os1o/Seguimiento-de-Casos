// =====================================================
// ADMIN-USUARIOS.JS - Panel de administración de usuarios
// =====================================================

let usuarios = [];
let editandoId = null;

function verificarSesion() {
    const usuarioStr = sessionStorage.getItem('usuario');
    if (!usuarioStr) {
        window.location.href = 'login.html';
        return null;
    }
    return JSON.parse(usuarioStr);
}

function cerrarSesion() {
    sessionStorage.removeItem('usuario');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const usuario = verificarSesion();
    if (!usuario) return;

    // Solo admin puede acceder
    if (usuario.rol !== 'admin') {
        window.location.href = 'casos.html';
        return;
    }

    document.getElementById('nombreUsuario').textContent = usuario.nombre_completo;

    // Llenar select de delegaciones en modal
    llenarDelegacionesModal();

    // Listener para cambio de rol (admin no necesita delegación)
    document.getElementById('inputRol').addEventListener('change', function() {
        const grupoDelegacion = document.getElementById('grupoDelegacion');
        const inputDelegacion = document.getElementById('inputDelegacion');
        const helpDelegacion = document.getElementById('helpDelegacion');

        if (this.value === 'admin') {
            inputDelegacion.required = false;
            inputDelegacion.value = '';
            inputDelegacion.disabled = true;
            helpDelegacion.style.display = 'block';
        } else {
            inputDelegacion.required = true;
            inputDelegacion.disabled = false;
            helpDelegacion.style.display = 'none';
        }
    });

    cargarUsuarios();
});

function llenarDelegacionesModal() {
    const select = document.getElementById('inputDelegacion');
    catalogos.delegaciones.forEach(d => {
        const option = document.createElement('option');
        option.value = d.id;
        option.textContent = d.nombre;
        select.appendChild(option);
    });
}

function cargarUsuarios() {
    const usuariosStr = localStorage.getItem('usuarios');
    usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];
    renderizarTabla();
}

function renderizarTabla() {
    const tbody = document.getElementById('tablaUsuariosBody');

    if (usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--color-text-light);">No hay usuarios registrados</td></tr>';
        return;
    }

    tbody.innerHTML = usuarios.map(u => {
        const delegacion = u.delegacion_id ? obtenerDelegacion(u.delegacion_id) : null;
        const delegNombre = delegacion ? delegacion.nombre : '<em style="color:var(--color-text-light);">Todas</em>';

        const rolesTexto = { admin: 'Administrador', editor: 'Editor', consulta: 'Consulta' };
        const rolesBadge = { admin: 'badge-rol-admin', editor: 'badge-rol-editor', consulta: 'badge-rol-consulta' };

        return `
            <tr>
                <td><strong>${u.nombre_completo}</strong></td>
                <td><code>${u.usuario}</code></td>
                <td><span class="badge-rol ${rolesBadge[u.rol] || ''}">${rolesTexto[u.rol] || u.rol}</span></td>
                <td><small>${delegNombre}</small></td>
                <td style="text-align:center;">${u.permiso_civil_mercantil ? '<span style="color:var(--color-success);">&#10003;</span>' : '<span style="color:var(--color-text-light);">&#10007;</span>'}</td>
                <td style="text-align:center;">${u.permiso_penal ? '<span style="color:var(--color-success);">&#10003;</span>' : '<span style="color:var(--color-text-light);">&#10007;</span>'}</td>
                <td style="text-align:center;">${u.activo
                    ? '<span class="badge badge-tramite">Activo</span>'
                    : '<span class="badge badge-concluido" style="background:#f5f5f5;color:#999;">Inactivo</span>'
                }</td>
                <td>
                    <div style="display:flex;gap:8px;">
                        <button class="btn-link" onclick="editarUsuario(${u.id})" style="font-size:13px;">Editar</button>
                        <button class="btn-link" onclick="toggleActivoUsuario(${u.id})" style="font-size:13px;color:${u.activo ? 'var(--color-danger)' : 'var(--color-success)'};">
                            ${u.activo ? 'Desactivar' : 'Activar'}
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// =====================================================
// MODAL
// =====================================================

function abrirModal() {
    editandoId = null;
    document.getElementById('modalTitulo').textContent = 'Nuevo Usuario';
    document.getElementById('formUsuario').reset();
    document.getElementById('inputPermisoCivil').checked = true;
    document.getElementById('inputActivo').checked = true;
    document.getElementById('inputDelegacion').disabled = false;
    document.getElementById('inputDelegacion').required = true;
    document.getElementById('helpDelegacion').style.display = 'none';
    document.getElementById('inputUsuario').disabled = false;
    document.getElementById('modalUsuario').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modalUsuario').style.display = 'none';
    editandoId = null;
}

function editarUsuario(id) {
    const u = usuarios.find(usr => usr.id === id);
    if (!u) return;

    editandoId = id;
    document.getElementById('modalTitulo').textContent = 'Editar Usuario';
    document.getElementById('inputNombre').value = u.nombre_completo;
    document.getElementById('inputUsuario').value = u.usuario;
    document.getElementById('inputUsuario').disabled = true; // No permitir cambiar username
    document.getElementById('inputPassword').value = u.password;
    document.getElementById('inputRol').value = u.rol;
    document.getElementById('inputPermisoCivil').checked = u.permiso_civil_mercantil;
    document.getElementById('inputPermisoPenal').checked = u.permiso_penal;
    document.getElementById('inputActivo').checked = u.activo;

    // Manejar delegación según rol
    if (u.rol === 'admin') {
        document.getElementById('inputDelegacion').value = '';
        document.getElementById('inputDelegacion').disabled = true;
        document.getElementById('inputDelegacion').required = false;
        document.getElementById('helpDelegacion').style.display = 'block';
    } else {
        document.getElementById('inputDelegacion').value = u.delegacion_id || '';
        document.getElementById('inputDelegacion').disabled = false;
        document.getElementById('inputDelegacion').required = true;
        document.getElementById('helpDelegacion').style.display = 'none';
    }

    document.getElementById('modalUsuario').style.display = 'flex';
}

function guardarUsuario(e) {
    e.preventDefault();

    const nombre = document.getElementById('inputNombre').value.trim();
    const usuario = document.getElementById('inputUsuario').value.trim();
    const password = document.getElementById('inputPassword').value;
    const rol = document.getElementById('inputRol').value;
    const delegacionId = document.getElementById('inputDelegacion').value;
    const permisoCivil = document.getElementById('inputPermisoCivil').checked;
    const permisoPenal = document.getElementById('inputPermisoPenal').checked;
    const activo = document.getElementById('inputActivo').checked;

    // Validar usuario único (solo al crear)
    if (!editandoId) {
        const existe = usuarios.find(u => u.usuario === usuario);
        if (existe) {
            alert('Ya existe un usuario con ese nombre de usuario');
            return;
        }
    }

    if (editandoId) {
        // Editar existente
        const idx = usuarios.findIndex(u => u.id === editandoId);
        if (idx !== -1) {
            usuarios[idx].nombre_completo = nombre;
            usuarios[idx].password = password;
            usuarios[idx].rol = rol;
            usuarios[idx].delegacion_id = rol === 'admin' ? null : parseInt(delegacionId);
            usuarios[idx].permiso_civil_mercantil = permisoCivil;
            usuarios[idx].permiso_penal = permisoPenal;
            usuarios[idx].activo = activo;
        }
    } else {
        // Crear nuevo
        const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
        usuarios.push({
            id: nuevoId,
            usuario: usuario,
            password: password,
            nombre_completo: nombre,
            rol: rol,
            delegacion_id: rol === 'admin' ? null : parseInt(delegacionId),
            permiso_civil_mercantil: permisoCivil,
            permiso_penal: permisoPenal,
            activo: activo
        });
    }

    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    cerrarModal();
    renderizarTabla();

    alert(editandoId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
}

function toggleActivoUsuario(id) {
    const u = usuarios.find(usr => usr.id === id);
    if (!u) return;

    // No permitir desactivar al propio admin
    const sesion = JSON.parse(sessionStorage.getItem('usuario'));
    if (sesion && sesion.id === id) {
        alert('No puedes desactivar tu propia cuenta');
        return;
    }

    const accion = u.activo ? 'desactivar' : 'activar';
    if (!confirm(`¿Estás seguro de ${accion} al usuario "${u.nombre_completo}"?`)) return;

    u.activo = !u.activo;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    renderizarTabla();
}
