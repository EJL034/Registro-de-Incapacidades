/**
 * ARCHIVO DE CONFIGURACIÓN
 * Valores, constantes y configuración central de la aplicación
 */

// ==========================================
// INFORMACIÓN DE LA APLICACIÓN
// ==========================================

const CONFIG = {
  nombre: 'Sistema de Gestión de Incapacidades',
  version: '1.0.0',
  descripcion: 'Sistema web para gestionar boletas de incapacidad',
  autor: 'Desarrollo 2026',
  año: 2026,
  
  // ==========================================
  // CONFIGURACIÓN DE ALMACENAMIENTO
  // ==========================================
  
  almacenamiento: {
    clave_db: 'incapacidades_db',
    clave_usuario: 'usuario_actual',
    clave_sesion: 'sesion_activa',
    tipo: 'localStorage' // 'localStorage' o 'sessionStorage'
  },
  
  // ==========================================
  // CONFIGURACIÓN DE VALIDACIÓN
  // ==========================================
  
  validacion: {
    // Nombre
    nombre_minimo: 3,
    nombre_maximo: 100,
    
    // Cédula (Costa Rica)
    cedula_formato: /^\d{3}-\d{6}-\d{1}$/,
    cedula_ejemplo: '123-456789-0',
    
    // Archivo
    archivo_peso_maximo: 1024 * 1024, // 1 MB
    archivo_formatos: ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'],
    archivo_extensiones: ['pdf', 'jpg', 'jpeg', 'png', 'gif'],
    
    // Días
    dias_minimo: 1,
    dias_maximo: 365,
    
    // Boleta
    boleta_formato: /^[A-Z0-9\-]+$/,
    boleta_ejemplo: 'BOL-2026-001',
  },
  
  // ==========================================
  // CONFIGURACIÓN DE DATOS
  // ==========================================
  
  datos: {
    tipos_incapacidad: [
      'Médica',
      'Maternidad',
      'Paternidad',
      'Accidente Laboral',
      'Enfermedad Profesional'
    ],
    
    estados: [
      'Activa',
      'Finalizada',
      'Prorroga'
    ],
    
    departamentos: [
      'Recursos Humanos',
      'Operaciones',
      'Contabilidad',
      'Ventas',
      'IT',
      'Finanzas',
      'Marketing',
      'Logística'
    ]
  },
  
  // ==========================================
  // CONFIGURACIÓN DE INTERFAZ
  // ==========================================
  
  interfaz: {
    // Paginación
    registros_por_pagina: 10,
    
    // Notificaciones
    duracion_notificacion: 4000, // ms
    posicion_notificacion: 'top-right',
    
    // Animaciones
    velocidad_animacion: 300, // ms
    efectos_activados: true,
    
    // Tema
    tema_oscuro: false,
    
    // Idioma
    idioma: 'es-CR'
  },
  
  // ==========================================
  // CONFIGURACIÓN DE REPORTES
  // ==========================================
  
  reportes: {
    // Formatos soportados
    formatos: ['PDF', 'CSV', 'JSON', 'EXCEL'],
    
    // Campos a incluir en reportes
    campos_incluir: [
      'nombre',
      'cedula',
      'departamento',
      'tipo',
      'numBoleta',
      'fechaInicio',
      'fechaFin',
      'diasIncapacidad',
      'estado'
    ],
    
    // Nombre de archivo por defecto
    nombre_archivo: 'incapacidades'
  },
  
  // ==========================================
  // CONFIGURACIÓN DE API (si existe backend)
  // ==========================================
  
  api: {
    base_url: 'http://localhost:3000/api',
    timeout: 30000, // ms
    reintentos: 3,
    endpoints: {
      incapacidades: '/incapacidades',
      usuarios: '/usuarios',
      reportes: '/reportes'
    }
  },
  
  // ==========================================
  // MENSAJES DE LA APLICACIÓN
  // ==========================================
  
  mensajes: {
    exito: {
      guardado: '✅ Guardado correctamente',
      actualizado: '✏️ Actualizado correctamente',
      eliminado: '🗑️ Eliminado correctamente',
      exportado: '📤 Exportado correctamente'
    },
    
    error: {
      guardado: '❌ Error al guardar',
      actualizado: '❌ Error al actualizar',
      eliminado: '❌ Error al eliminar',
      carga: '❌ Error al cargar datos',
      validacion: '⚠️ Error de validación'
    },
    
    advertencia: {
      campos_vacios: '⚠️ Completa todos los campos requeridos',
      confirmar_eliminacion: '¿Estás seguro que deseas eliminar este registro?',
      datos_no_guardados: '⚠️ Hay cambios sin guardar'
    }
  },
  
  // ==========================================
  // PERMISOS Y ROLES (para futuro)
  // ==========================================
  
  roles: {
    admin: {
      nombre: 'Administrador',
      permisos: ['crear', 'leer', 'actualizar', 'eliminar', 'exportar', 'configurar']
    },
    gerente: {
      nombre: 'Gerente',
      permisos: ['crear', 'leer', 'actualizar', 'exportar']
    },
    usuario: {
      nombre: 'Usuario',
      permisos: ['leer']
    }
  },
  
  // ==========================================
  // INTEGRACIÓN CON SERVICIOS EXTERNOS
  // ==========================================
  
  servicios: {
    // Google Analytics (si se desea)
    analytics_id: '',
    
    // Sentry (para monitoreo de errores)
    sentry_dsn: ''
  }
};

// ==========================================
// FUNCIONES DE CONFIGURACIÓN
// ==========================================

/**
 * Obtiene un valor de configuración
 */
function obtenerConfiguracion(ruta) {
  const partes = ruta.split('.');
  let valor = CONFIG;
  
  for (const parte of partes) {
    if (valor && typeof valor === 'object' && parte in valor) {
      valor = valor[parte];
    } else {
      return undefined;
    }
  }
  
  return valor;
}

/**
 * Establece un valor de configuración
 */
function establecerConfiguracion(ruta, valor) {
  const partes = ruta.split('.');
  let obj = CONFIG;
  
  for (let i = 0; i < partes.length - 1; i++) {
    const parte = partes[i];
    if (!(parte in obj)) {
      obj[parte] = {};
    }
    obj = obj[parte];
  }
  
  obj[partes[partes.length - 1]] = valor;
}

/**
 * Valida que todos los valores de configuración sean válidos
 */
function validarConfiguracion() {
  const errores = [];
  
  // Validar almacenamiento
  if (!['localStorage', 'sessionStorage'].includes(CONFIG.almacenamiento.tipo)) {
    errores.push('Tipo de almacenamiento inválido');
  }
  
  // Validar idioma
  if (!/^[a-z]{2}-[A-Z]{2}$/.test(CONFIG.interfaz.idioma)) {
    errores.push('Formato de idioma inválido');
  }
  
  // Validar configuración de validación
  if (CONFIG.validacion.dias_minimo >= CONFIG.validacion.dias_maximo) {
    errores.push('Configuración de días inválida');
  }
  
  if (errores.length > 0) {
    console.warn('⚠️ Errores en configuración:', errores);
    return false;
  }
  
  return true;
}

/**
 * Reinicia la configuración a valores por defecto
 */
function reiniciarConfiguracion() {
  // Guardar valores actuales como respaldo
  const respaldo = localStorage.getItem('config_respaldo');
  if (!respaldo) {
    localStorage.setItem('config_respaldo', JSON.stringify(CONFIG));
  }
  
  // Reiniciar desde respaldo
  location.reload();
}

/**
 * Exporta la configuración actual
 */
function exportarConfiguracion() {
  const json = JSON.stringify(CONFIG, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `configuracion-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Importa configuración desde archivo
 */
function importarConfiguracion(archivo) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const nueva_config = JSON.parse(e.target.result);
      Object.assign(CONFIG, nueva_config);
      mostrarNotificacion('✅ Configuración importada', 'success');
      location.reload();
    } catch (error) {
      mostrarNotificacion('❌ Error al importar configuración', 'error');
    }
  };
  reader.readAsText(archivo);
}

/**
 * Obtiene el almacenamiento configurado
 */
function obtenerAlmacenamiento() {
  return CONFIG.almacenamiento.tipo === 'localStorage' ? localStorage : sessionStorage;
}

// ==========================================
// INICIALIZACIÓN
// ==========================================

// Validar configuración al cargar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', validarConfiguracion);
} else {
  validarConfiguracion();
}

// Exportar para uso global
window.CONFIG = CONFIG;
window.configuracion = {
  obtenerConfiguracion,
  establecerConfiguracion,
  validarConfiguracion,
  reiniciarConfiguracion,
  exportarConfiguracion,
  importarConfiguracion,
  obtenerAlmacenamiento
};
