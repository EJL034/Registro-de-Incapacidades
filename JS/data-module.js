// data-module.js - Módulo de gestión de datos de incapacidades

// Almacenamiento en localStorage
const STORAGE_KEY = 'incapacidades_db';

/**
 * Obtener todas las incapacidades
 * @returns {Array} Array de incapacidades
 */
function obtenerIncapacidades() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

/**
 * Guardar una nueva incapacidad
 * @param {Object} registro - Objeto con los datos de la incapacidad
 * @returns {Boolean} true si se guardó exitosamente
 */
function guardarIncapacidad(registro) {
  try {
    if (!registro || !registro.nombre || !registro.cedula) {
      console.error('Datos incompletos para guardar incapacidad');
      return false;
    }

    const datos = obtenerIncapacidades();
    
    // Generar ID único si no existe
    const id = registro.id || generarIdUnico();
    
    // Crear el objeto completo
    const nuevoRegistro = {
      id,
      nombre: registro.nombre,
      cedula: registro.cedula,
      departamento: registro.departamento || '',
      tipo: registro.tipo || '',
      numBoleta: registro.numBoleta || '',
      fechaInicio: registro.fechaInicio || '',
      fechaFin: registro.fechaFin || '',
      diasIncapacidad: registro.diasIncapacidad || 0,
      estado: registro.estado || 'Activa',
      urlAdjunto: registro.urlAdjunto || '',
      fechaCreacion: registro.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    datos.push(nuevoRegistro);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al guardar incapacidad:', error);
    return false;
  }
}

/**
 * Obtener una incapacidad por su ID
 * @param {String} id - ID de la incapacidad
 * @returns {Object|null} Objeto de incapacidad o null si no existe
 */
function obtenerIncapacidadPorId(id) {
  try {
    const datos = obtenerIncapacidades();
    return datos.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error al obtener incapacidad por ID:', error);
    return null;
  }
}

/**
 * Actualizar una incapacidad existente
 * @param {String} id - ID de la incapacidad a actualizar
 * @param {Object} cambios - Objeto con los cambios a aplicar
 * @returns {Boolean} true si se actualizó exitosamente
 */
function actualizarIncapacidad(id, cambios) {
  try {
    if (!id || !cambios) {
      console.error('ID o cambios no proporcionados');
      return false;
    }

    const datos = obtenerIncapacidades();
    const indice = datos.findIndex(item => item.id === id);

    if (indice === -1) {
      console.error('Incapacidad no encontrada:', id);
      return false;
    }

    // Aplicar cambios
    datos[indice] = {
      ...datos[indice],
      ...cambios,
      id, // Mantener el ID original
      fechaActualizacion: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al actualizar incapacidad:', error);
    return false;
  }
}

/**
 * Eliminar una incapacidad
 * @param {String} id - ID de la incapacidad a eliminar
 * @returns {Boolean} true si se eliminó exitosamente
 */
function eliminarIncapacidad(id) {
  try {
    if (!id) {
      console.error('ID no proporcionado');
      return false;
    }

    const datos = obtenerIncapacidades();
    const indice = datos.findIndex(item => item.id === id);

    if (indice === -1) {
      console.error('Incapacidad no encontrada:', id);
      return false;
    }

    datos.splice(indice, 1);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error('Error al eliminar incapacidad:', error);
    return false;
  }
}

/**
 * Inicializar datos de prueba
 * @returns {void}
 */
function inicializarDatosPrueba() {
  try {
    const datosPrueba = [
      {
        id: 'INC-001-2026',
        nombre: 'Juan Pérez García',
        cedula: '101-234567-8',
        departamento: 'Recursos Humanos',
        tipo: 'Médica',
        numBoleta: 'BOL-2026-001',
        fechaInicio: '2026-08-15',
        fechaFin: '2026-08-30',
        diasIncapacidad: 16,
        estado: 'Activa',
        urlAdjunto: '/documentos/certificado-001.pdf',
        fechaCreacion: '2026-08-15T09:00:00Z',
        fechaActualizacion: '2026-08-15T09:00:00Z'
      },
      {
        id: 'INC-002-2026',
        nombre: 'María López Ruiz',
        cedula: '102-345678-9',
        departamento: 'Operaciones',
        tipo: 'Maternidad',
        numBoleta: 'BOL-2026-002',
        fechaInicio: '2026-07-20',
        fechaFin: '2026-10-19',
        diasIncapacidad: 91,
        estado: 'Activa',
        urlAdjunto: '/documentos/certificado-002.pdf',
        fechaCreacion: '2026-07-20T14:30:00Z',
        fechaActualizacion: '2026-07-20T14:30:00Z'
      },
      {
        id: 'INC-003-2026',
        nombre: 'Carlos Rodríguez Díaz',
        cedula: '103-456789-0',
        departamento: 'IT',
        tipo: 'Accidente Laboral',
        numBoleta: 'BOL-2026-003',
        fechaInicio: '2026-06-01',
        fechaFin: '2026-06-20',
        diasIncapacidad: 20,
        estado: 'Finalizada',
        urlAdjunto: '/documentos/certificado-003.pdf',
        fechaCreacion: '2026-06-01T11:00:00Z',
        fechaActualizacion: '2026-06-20T15:00:00Z'
      },
      {
        id: 'INC-004-2026',
        nombre: 'Ana Martínez Soto',
        cedula: '104-567890-1',
        departamento: 'Contabilidad',
        tipo: 'Médica',
        numBoleta: 'BOL-2026-004',
        fechaInicio: '2026-08-10',
        fechaFin: '2026-08-25',
        diasIncapacidad: 16,
        estado: 'En Prórroga',
        urlAdjunto: '/documentos/certificado-004.pdf',
        fechaCreacion: '2026-08-10T10:15:00Z',
        fechaActualizacion: '2026-08-15T16:45:00Z'
      },
      {
        id: 'INC-005-2026',
        nombre: 'Roberto Fernández González',
        cedula: '105-678901-2',
        departamento: 'Ventas',
        tipo: 'Enfermedad Profesional',
        numBoleta: 'BOL-2026-005',
        fechaInicio: '2026-05-15',
        fechaFin: '2026-05-30',
        diasIncapacidad: 16,
        estado: 'Finalizada',
        urlAdjunto: '/documentos/certificado-005.pdf',
        fechaCreacion: '2026-05-15T08:00:00Z',
        fechaActualizacion: '2026-05-30T17:00:00Z'
      }
    ];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(datosPrueba));
    console.log('✅ Datos de prueba inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar datos de prueba:', error);
  }
}

/**
 * Generar un ID único para incapacidades
 * Formato: INC-NNN-YYYY
 * @returns {String} ID único generado
 */
function generarIdUnico() {
  const datos = obtenerIncapacidades();
  const anio = new Date().getFullYear();
  
  // Obtener el número siguiente
  const incapacidadesDelAnio = datos.filter(item => item.id.includes(`-${anio}`));
  const numero = String(incapacidadesDelAnio.length + 1).padStart(3, '0');
  
  return `INC-${numero}-${anio}`;
}

/**
 * Obtener estadísticas del sistema
 * @returns {Object} Objeto con estadísticas
 */
function obtenerEstadisticas() {
  try {
    const datos = obtenerIncapacidades();
    
    const stats = {
      total: datos.length,
      activas: datos.filter(d => d.estado === 'Activa').length,
      finalizadas: datos.filter(d => d.estado === 'Finalizada').length,
      prorroga: datos.filter(d => d.estado === 'En Prórroga').length,
      diasTotales: datos.reduce((sum, d) => sum + (d.diasIncapacidad || 0), 0),
      porDepartamento: {},
      porTipo: {}
    };

    // Contar por departamento
    datos.forEach(d => {
      const dept = d.departamento || 'Sin departamento';
      stats.porDepartamento[dept] = (stats.porDepartamento[dept] || 0) + 1;
    });

    // Contar por tipo
    datos.forEach(d => {
      const tipo = d.tipo || 'Sin especificar';
      stats.porTipo[tipo] = (stats.porTipo[tipo] || 0) + 1;
    });

    return stats;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      total: 0,
      activas: 0,
      finalizadas: 0,
      prorroga: 0,
      diasTotales: 0,
      porDepartamento: {},
      porTipo: {}
    };
  }
}

/**
 * Limpiar la base de datos (eliminar todos los registros)
 * @returns {void}
 */
function limpiarBaseDatos() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('✅ Base de datos limpiada correctamente');
  } catch (error) {
    console.error('Error al limpiar base de datos:', error);
  }
}

/**
 * Buscar incapacidades por criterios
 * @param {Object} criterios - Criterios de búsqueda
 * @returns {Array} Array de incapacidades que coinciden
 */
function buscarIncapacidades(criterios) {
  try {
    const datos = obtenerIncapacidades();
    
    return datos.filter(item => {
      if (criterios.nombre && !item.nombre.toLowerCase().includes(criterios.nombre.toLowerCase())) {
        return false;
      }
      if (criterios.cedula && !item.cedula.includes(criterios.cedula)) {
        return false;
      }
      if (criterios.estado && item.estado !== criterios.estado) {
        return false;
      }
      if (criterios.tipo && item.tipo !== criterios.tipo) {
        return false;
      }
      if (criterios.departamento && item.departamento !== criterios.departamento) {
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Error al buscar incapacidades:', error);
    return [];
  }
}

// Inicializar datos de prueba si no existen
document.addEventListener('DOMContentLoaded', function() {
  const datos = obtenerIncapacidades();
  if (datos.length === 0) {
    inicializarDatosPrueba();
  }
});
