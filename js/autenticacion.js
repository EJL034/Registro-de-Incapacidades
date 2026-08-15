/**
 * MÓDULO DE AUTENTICACIÓN
 * Manejo de sesión + control de permisos (preparado para backend)
 */

const autenticacion = (function () {
  const CLAVE_USUARIO = 'usuario_actual';
  const CLAVE_SESION = 'sesion_activa';

  // Usuarios de prueba (después se reemplazan por base de datos)
  const USUARIOS = [
    {
      id: 1,
      nombre: 'Administrador',
      email: 'admin@empresa.com',
      password: 'admin123',
      rol: 'admin'
    },
    {
      id: 2,
      nombre: 'Usuario Demo',
      email: 'usuario@empresa.com',
      password: 'user123',
      rol: 'usuario'
    }
  ];

  // Permisos por rol
  const PERMISOS = {
    admin: ['crear', 'leer', 'actualizar', 'eliminar', 'exportar', 'prorroga', 'configurar'],
    usuario: ['leer', 'crear', 'actualizar'] // el usuario normal no puede eliminar ni exportar
  };

  /**
   * Inicia sesión
   */
  function iniciarSesion(email, password) {
    const usuario = USUARIOS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!usuario) {
      return {
        exito: false,
        mensaje: 'Correo o contraseña incorrectos'
      };
    }

    const sesion = {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      fechaLogin: new Date().toISOString()
    };

    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(sesion));
    localStorage.setItem(CLAVE_SESION, 'true');

    return {
      exito: true,
      usuario: sesion
    };
  }

  /**
   * Cierra la sesión
   */
  function cerrarSesion() {
    localStorage.removeItem(CLAVE_USUARIO);
    localStorage.removeItem(CLAVE_SESION);
  }

  /**
   * Verifica si hay sesión activa
   */
  function tieneSesionActiva() {
    return localStorage.getItem(CLAVE_SESION) === 'true' &&
           localStorage.getItem(CLAVE_USUARIO) !== null;
  }

  /**
   * Obtiene el usuario actual
   */
  function obtenerUsuarioActual() {
    const data = localStorage.getItem(CLAVE_USUARIO);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Verifica si el usuario tiene un permiso específico
   */
  function tienePermiso(permiso) {
    const usuario = obtenerUsuarioActual();
    if (!usuario) return false;

    const permisosRol = PERMISOS[usuario.rol] || [];
    return permisosRol.includes(permiso);
  }

  /**
   * Verifica si es administrador
   */
  function esAdministrador() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'admin';
  }

  /**
   * Verifica si es usuario normal
   */
  function esUsuario() {
    const usuario = obtenerUsuarioActual();
    return usuario && usuario.rol === 'usuario';
  }

  // API pública
  return {
    iniciarSesion,
    cerrarSesion,
    tieneSesionActiva,
    obtenerUsuarioActual,
    tienePermiso,
    esAdministrador,
    esUsuario
  };
})();

window.autenticacion = autenticacion;