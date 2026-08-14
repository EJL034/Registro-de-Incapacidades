/**
 * MÓDULO DE PERSISTENCIA Y DATOS
 * Gestiona la lectura, escritura y manipulación de datos de incapacidades en localStorage
 */

const CLAVE_DB = 'incapacidades_db';

/**
 * Obtiene todas las incapacidades del almacenamiento local
 * @returns {Array} Arreglo de objetos con registros de incapacidades
 */
function obtenerIncapacidades() {
  try {
    const datos = localStorage.getItem(CLAVE_DB);
    if (!datos) {
      inicializarDatosPrueba();
      return obtenerIncapacidades();
    }
    return JSON.parse(datos);
  } catch (error) {
    console.error('Error al obtener incapacidades:', error);
    return [];
  }
}

/**
 * Guarda una nueva incapacidad en el almacenamiento
 * @param {Object} registro - Objeto con datos de la incapacidad
 * @param {string} registro.id - Identificador único (ej: generado con UUID)
 * @param {string} registro.nombre - Nombre completo del trabajador
 * @param {string} registro.cedula - Número de cédula
 * @param {string} registro.departamento - Departamento del trabajador
 * @param {string} registro.tipo - Tipo de incapacidad (ej: 'Médica', 'Maternidad')
 * @param {string} registro.numBoleta - Número de comprobante
 * @param {string} registro.fechaInicio - Fecha inicio (formato: YYYY-MM-DD)
 * @param {string} registro.fechaFin - Fecha fin (formato: YYYY-MM-DD)
 * @param {string} registro.diasIncapacidad - Cantidad de días
 * @param {string} registro.estado - Estado actual (ej: 'Activa', 'Finalizada', 'Prorroga')
 * @param {string} registro.urlAdjunto - URL o ruta del archivo adjunto
 * @param {string} registro.fechaRegistro - Fecha de creación del registro
 * @returns {boolean} true si se guardó correctamente
 */
function guardarIncapacidad(registro) {
  try {
    const incapacidades = obtenerIncapacidades();
    
    // Validar que el registro tenga ID
    if (!registro.id) {
      registro.id = generarIdUnico();
    }
    
    // Agregar fecha de registro si no existe
    if (!registro.fechaRegistro) {
      registro.fechaRegistro = new Date().toISOString();
    }
    
    incapacidades.push(registro);
    localStorage.setItem(CLAVE_DB, JSON.stringify(incapacidades));
    
    console.log(`Incapacidad guardada: ${registro.id}`);
    return true;
  } catch (error) {
    console.error('Error al guardar incapacidad:', error);
    return false;
  }
}

/**
 * Obtiene una incapacidad específica por su ID
 * @param {string} id - Identificador único de la incapacidad
 * @returns {Object|null} Objeto incapacidad o null si no existe
 */
function obtenerIncapacidadPorId(id) {
  try {
    const incapacidades = obtenerIncapacidades();
    return incapacidades.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error al obtener incapacidad por ID:', error);
    return null;
  }
}

/**
 * Actualiza los datos de una incapacidad existente
 * @param {string} id - Identificador único de la incapacidad
 * @param {Object} datosActualizados - Propiedades a actualizar
 * @returns {boolean} true si la actualización fue exitosa
 */
function actualizarIncapacidad(id, datosActualizados) {
  try {
    const incapacidades = obtenerIncapacidades();
    const index = incapacidades.findIndex(item => item.id === id);
    
    if (index === -1) {
      console.warn(`No se encontró incapacidad con ID: ${id}`);
      return false;
    }
    
    // Mantener la fecha de registro original
    const fechaRegistroOriginal = incapacidades[index].fechaRegistro;
    
    // Realizar la actualización
    incapacidades[index] = {
      ...incapacidades[index],
      ...datosActualizados,
      fechaRegistro: fechaRegistroOriginal, // Preservar fecha original
      fechaActualizacion: new Date().toISOString() // Agregar timestamp de actualización
    };
    
    localStorage.setItem(CLAVE_DB, JSON.stringify(incapacidades));
    console.log(`Incapacidad actualizada: ${id}`);
    return true;
  } catch (error) {
    console.error('Error al actualizar incapacidad:', error);
    return false;
  }
}

/**
 * Elimina una incapacidad del almacenamiento
 * @param {string} id - Identificador único de la incapacidad a eliminar
 * @returns {boolean} true si la eliminación fue exitosa
 */
function eliminarIncapacidad(id) {
  try {
    const incapacidades = obtenerIncapacidades();
    const index = incapacidades.findIndex(item => item.id === id);
    
    if (index === -1) {
      console.warn(`No se encontró incapacidad con ID: ${id}`);
      return false;
    }
    
    const registroEliminado = incapacidades.splice(index, 1);
    localStorage.setItem(CLAVE_DB, JSON.stringify(incapacidades));
    
    console.log(`Incapacidad eliminada: ${id}`);
    return true;
  } catch (error) {
    console.error('Error al eliminar incapacidad:', error);
    return false;
  }
}

/**
 * Inicializa la base de datos con registros de prueba
 * Solo se ejecuta si localStorage está vacío
 */
function inicializarDatosPrueba() {
  try {
    // Verificar si ya hay datos
    const datosExistentes = localStorage.getItem(CLAVE_DB);
    if (datosExistentes) {
      return;
    }
    
    const datosPrueba = [
      {
        id: 'INC-001-2026',
        nombre: 'María García López',
        cedula: '101-234567-8',
        departamento: 'Recursos Humanos',
        tipo: 'Médica',
        numBoleta: 'BOL-2026-001',
        fechaInicio: '2026-08-01',
        fechaFin: '2026-08-15',
        diasIncapacidad: 15,
        estado: 'Activa',
        urlAdjunto: '/documentos/boleta_001.pdf',
        fechaRegistro: new Date('2026-08-01').toISOString(),
        observaciones: 'Cirugía menor, reposo recomendado'
      },
      {
        id: 'INC-002-2026',
        nombre: 'Juan Carlos Rodríguez',
        cedula: '102-345678-9',
        departamento: 'Operaciones',
        tipo: 'Maternidad',
        numBoleta: 'BOL-2026-002',
        fechaInicio: '2026-07-15',
        fechaFin: '2026-09-15',
        diasIncapacidad: 63,
        estado: 'Finalizada',
        urlAdjunto: '/documentos/boleta_002.pdf',
        fechaRegistro: new Date('2026-07-15').toISOString(),
        observaciones: 'Licencia por maternidad completada'
      },
      {
        id: 'INC-003-2026',
        nombre: 'Sandra Mendoza Vargas',
        cedula: '103-456789-0',
        departamento: 'Contabilidad',
        tipo: 'Accidente Laboral',
        numBoleta: 'BOL-2026-003',
        fechaInicio: '2026-08-10',
        fechaFin: '2026-08-25',
        diasIncapacidad: 16,
        estado: 'Prorroga',
        urlAdjunto: '/documentos/boleta_003.pdf',
        fechaRegistro: new Date('2026-08-10').toISOString(),
        observaciones: 'Prorroga solicitada por médico',
        fechaActualizacion: new Date('2026-08-20').toISOString()
      }
    ];
    
    localStorage.setItem(CLAVE_DB, JSON.stringify(datosPrueba));
    console.log('Base de datos inicializada con datos de prueba');
  } catch (error) {
    console.error('Error al inicializar datos de prueba:', error);
  }
}

/**
 * Genera un ID único para nuevos registros
 * Formato: INC-NNN-YYYY donde NNN es secuencial y YYYY es el año
 * @returns {string} ID único
 */
function generarIdUnico() {
  try {
    const incapacidades = JSON.parse(localStorage.getItem(CLAVE_DB)) || [];
    const anio = new Date().getFullYear();
    
    // Obtener el número más alto del año actual
    const registrosAnio = incapacidades.filter(reg => reg.id.includes(`-${anio}`));
    const numeros = registrosAnio.map(reg => {
      const match = reg.id.match(/INC-(\d+)-/);
      return match ? parseInt(match[1]) : 0;
    });
    
    const proximoNumero = Math.max(...numeros, 0) + 1;
    return `INC-${String(proximoNumero).padStart(3, '0')}-${anio}`;
  } catch (error) {
    console.error('Error al generar ID único:', error);
    return `INC-TEMP-${Date.now()}`;
  }
}

/**
 * Limpia completamente la base de datos (uso solo en desarrollo/pruebas)
 * @returns {boolean} true si se limpió correctamente
 */
function limpiarBaseDatos() {
  try {
    localStorage.removeItem(CLAVE_DB);
    console.warn('Base de datos limpiada completamente');
    return true;
  } catch (error) {
    console.error('Error al limpiar base de datos:', error);
    return false;
  }
}

/**
 * Obtiene estadísticas de las incapacidades registradas
 * @returns {Object} Objeto con estadísticas
 */
function obtenerEstadisticas() {
  try {
    const incapacidades = obtenerIncapacidades();
    
    return {
      total: incapacidades.length,
      activas: incapacidades.filter(i => i.estado === 'Activa').length,
      finalizadas: incapacidades.filter(i => i.estado === 'Finalizada').length,
      prorroga: incapacidades.filter(i => i.estado === 'Prorroga').length,
      diasTotales: incapacidades.reduce((suma, i) => suma + (parseInt(i.diasIncapacidad) || 0), 0)
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {};
  }
}
