/**
 * MÓDULO DE VALIDACIONES Y REGLAS DE NEGOCIO
 * Contiene la lógica pura de verificación antes de procesar o guardar datos
 */

// Constantes de validación
const PESO_MAXIMO_ARCHIVO = 1024 * 1024; // 1 MB en bytes
const FORMATOS_PERMITIDOS = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
const EXTENSIONES_PERMITIDAS = ['pdf', 'jpg', 'jpeg', 'png', 'gif'];

/**
 * Calcula la cantidad de días consecutivos entre dos fechas
 * @param {string} fechaInicio - Fecha inicial (formato: YYYY-MM-DD)
 * @param {string} fechaFin - Fecha final (formato: YYYY-MM-DD)
 * @returns {Object} Objeto con { diasCalculados, valido, mensaje }
 */
function calcularDiasIncapacidad(fechaInicio, fechaFin) {
  const resultado = {
    diasCalculados: 0,
    valido: true,
    mensaje: ''
  };

  try {
    // Validar que las fechas sean válidas
    if (!fechaInicio || !fechaFin) {
      resultado.valido = false;
      resultado.mensaje = 'Las fechas de inicio y fin son requeridas';
      return resultado;
    }

    // Convertir strings a objetos Date
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    // Validar que sean fechas válidas
    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
      resultado.valido = false;
      resultado.mensaje = 'Las fechas ingresadas no tienen un formato válido';
      return resultado;
    }

    // Validar que la fecha final no sea anterior a la inicial
    if (fin < inicio) {
      resultado.valido = false;
      resultado.mensaje = 'La fecha de fin no puede ser anterior a la fecha de inicio';
      return resultado;
    }

    // Calcular diferencia en milisegundos y convertir a días
    const diferenciaMilisegundos = fin - inicio;
    const diasCalculados = Math.floor(diferenciaMilisegundos / (1000 * 60 * 60 * 24)) + 1; // +1 incluye el día inicial

    // Validar rango de días (entre 1 y 365)
    if (diasCalculados < 1) {
      resultado.valido = false;
      resultado.mensaje = 'La incapacidad debe tener al menos 1 día';
      return resultado;
    }

    if (diasCalculados > 365) {
      resultado.valido = false;
      resultado.mensaje = 'La incapacidad no puede exceder 365 días consecutivos';
      return resultado;
    }

    resultado.diasCalculados = diasCalculados;
    resultado.mensaje = `Incapacidad válida: ${diasCalculados} día${diasCalculados > 1 ? 's' : ''}`;

    return resultado;
  } catch (error) {
    resultado.valido = false;
    resultado.mensaje = `Error al calcular días: ${error.message}`;
    return resultado;
  }
}

/**
 * Verifica que el número de boleta sea único en el sistema
 * @param {string} numBoleta - Número de comprobante a validar
 * @param {string} idActual - ID de la incapacidad actual (null para registros nuevos)
 * @returns {Object} Objeto con { unico, valido, mensaje }
 */
function validarBoletaUnica(numBoleta, idActual = null) {
  const resultado = {
    unico: true,
    valido: true,
    mensaje: ''
  };

  try {
    // Validar que el número de boleta exista
    if (!numBoleta || numBoleta.trim() === '') {
      resultado.valido = false;
      resultado.mensaje = 'El número de boleta es requerido';
      return resultado;
    }

    // Limpiar espacios en blanco
    const boletaLimpia = numBoleta.trim().toUpperCase();

    // Validar formato básico (alfanumérico con guiones permitidos)
    if (!/^[A-Z0-9\-]+$/.test(boletaLimpia)) {
      resultado.valido = false;
      resultado.mensaje = 'El número de boleta contiene caracteres inválidos';
      return resultado;
    }

    // Obtener todas las incapacidades del almacenamiento
    const incapacidades = obtenerIncapacidades();

    // Buscar si existe una boleta duplicada (excluyendo el registro actual)
    const boletaDuplicada = incapacidades.find(
      incapacidad => 
        incapacidad.numBoleta.toUpperCase() === boletaLimpia && 
        incapacidad.id !== idActual
    );

    if (boletaDuplicada) {
      resultado.unico = false;
      resultado.valido = false;
      resultado.mensaje = `El número de boleta "${boletaLimpia}" ya está registrado en el expediente ${boletaDuplicada.id}`;
      return resultado;
    }

    resultado.mensaje = 'Número de boleta válido y único';
    return resultado;
  } catch (error) {
    resultado.valido = false;
    resultado.mensaje = `Error al validar boleta: ${error.message}`;
    return resultado;
  }
}

/**
 * Valida que el formulario de registro tenga todos los campos obligatorios
 * @param {Object} datos - Objeto con los datos del formulario
 * @param {string} datos.nombre - Nombre completo del trabajador
 * @param {string} datos.cedula - Número de cédula
 * @param {string} datos.departamento - Departamento
 * @param {string} datos.tipo - Tipo de incapacidad
 * @param {string} datos.fechaInicio - Fecha inicio
 * @param {string} datos.fechaFin - Fecha fin
 * @param {string} datos.numBoleta - Número de boleta
 * @param {File} datos.archivo - Archivo adjunto
 * @param {string} datos.idActual - ID actual para actualización (opcional)
 * @returns {Object} Objeto con { valido, errores: [] }
 */
function validarFormularioRegistro(datos) {
  const resultado = {
    valido: true,
    errores: []
  };

  try {
    // Validar nombre
    if (!datos.nombre || datos.nombre.trim() === '') {
      resultado.errores.push('El nombre del trabajador es requerido');
    } else if (datos.nombre.length < 3) {
      resultado.errores.push('El nombre debe tener al menos 3 caracteres');
    } else if (datos.nombre.length > 100) {
      resultado.errores.push('El nombre no puede exceder 100 caracteres');
    }

    // Validar cédula
    if (!datos.cedula || datos.cedula.trim() === '') {
      resultado.errores.push('El número de cédula es requerido');
    } else if (!validarFormatoCedula(datos.cedula)) {
      resultado.errores.push('El formato de cédula no es válido (ej: 123-456789-0)');
    }

    // Validar departamento
    if (!datos.departamento || datos.departamento.trim() === '') {
      resultado.errores.push('El departamento es requerido');
    }

    // Validar tipo de incapacidad
    if (!datos.tipo || datos.tipo.trim() === '') {
      resultado.errores.push('El tipo de incapacidad es requerido');
    }

    // Validar número de boleta
    if (!datos.numBoleta || datos.numBoleta.trim() === '') {
      resultado.errores.push('El número de boleta es requerido');
    } else {
      const validacionBoleta = validarBoletaUnica(datos.numBoleta, datos.idActual || null);
      if (!validacionBoleta.valido) {
        resultado.errores.push(validacionBoleta.mensaje);
      }
    }

    // Validar fechas
    if (!datos.fechaInicio || !datos.fechaFin) {
      resultado.errores.push('Las fechas de inicio y fin son requeridas');
    } else {
      const validacionDias = calcularDiasIncapacidad(datos.fechaInicio, datos.fechaFin);
      if (!validacionDias.valido) {
        resultado.errores.push(validacionDias.mensaje);
      }
    }

    // Validar archivo adjunto (solo si es un registro nuevo o se proporciona nuevo archivo)
    if (datos.archivo) {
      const validacionArchivo = validarFormatoArchivo(datos.archivo);
      if (!validacionArchivo.valido) {
        resultado.errores.push(validacionArchivo.mensaje);
      }
    } else if (!datos.idActual && !datos.urlAdjunto) {
      // Si es nuevo registro, debe tener archivo
      resultado.errores.push('El archivo adjunto es requerido');
    }

    // Asignar validez general
    resultado.valido = resultado.errores.length === 0;

    return resultado;
  } catch (error) {
    resultado.valido = false;
    resultado.errores.push(`Error en validación: ${error.message}`);
    return resultado;
  }
}

/**
 * Valida el formato y peso del archivo adjunto
 * @param {File} archivo - Objeto File del archivo
 * @returns {Object} Objeto con { valido, mensaje, tamanio, tipo }
 */
function validarFormatoArchivo(archivo) {
  const resultado = {
    valido: true,
    mensaje: '',
    tamanio: 0,
    tipo: ''
  };

  try {
    // Validar que existe archivo
    if (!archivo) {
      resultado.valido = false;
      resultado.mensaje = 'No se proporcionó archivo';
      return resultado;
    }

    // Obtener información del archivo
    const tamanio = archivo.size;
    const nombre = archivo.name;
    const tipo = archivo.type;
    const extension = nombre.split('.').pop().toLowerCase();

    resultado.tamanio = tamanio;
    resultado.tipo = tipo;

    // Validar peso
    if (tamanio > PESO_MAXIMO_ARCHIVO) {
      const pesoMB = (PESO_MAXIMO_ARCHIVO / (1024 * 1024)).toFixed(1);
      resultado.valido = false;
      resultado.mensaje = `El archivo es muy pesado. Máximo permitido: ${pesoMB} MB`;
      return resultado;
    }

    // Validar tipo MIME
    if (!FORMATOS_PERMITIDOS.includes(tipo)) {
      resultado.valido = false;
      resultado.mensaje = `Tipo de archivo no permitido. Formatos válidos: PDF, JPG, PNG, GIF`;
      return resultado;
    }

    // Validar extensión como segunda capa de seguridad
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      resultado.valido = false;
      resultado.mensaje = `Extensión de archivo no permitida. Válidas: ${EXTENSIONES_PERMITIDAS.join(', ')}`;
      return resultado;
    }

    // Validaciones adicionales según tipo
    if (tipo === 'application/pdf') {
      resultado.mensaje = 'Archivo PDF válido';
    } else if (tipo.startsWith('image/')) {
      resultado.mensaje = 'Archivo imagen válido';
    }

    return resultado;
  } catch (error) {
    resultado.valido = false;
    resultado.mensaje = `Error al validar archivo: ${error.message}`;
    return resultado;
  }
}

/**
 * Valida el formato de cédula (Costa Rica: XXX-XXXXXX-X)
 * @param {string} cedula - Número de cédula
 * @returns {boolean} true si el formato es válido
 */
function validarFormatoCedula(cedula) {
  if (!cedula) return false;
  
  // Patrón: 3-6-1 dígitos separados por guiones
  const patronCedula = /^\d{3}-\d{6}-\d{1}$/;
  return patronCedula.test(cedula.trim());
}

/**
 * Valida que una fecha sea válida y no sea futura
 * @param {string} fecha - Fecha a validar (formato: YYYY-MM-DD)
 * @param {boolean} permitirFutura - Si se permiten fechas futuras
 * @returns {Object} Objeto con { valido, mensaje }
 */
function validarFecha(fecha, permitirFutura = false) {
  const resultado = {
    valido: true,
    mensaje: ''
  };

  try {
    if (!fecha) {
      resultado.valido = false;
      resultado.mensaje = 'La fecha es requerida';
      return resultado;
    }

    const fechaObj = new Date(fecha);
    if (isNaN(fechaObj.getTime())) {
      resultado.valido = false;
      resultado.mensaje = 'El formato de fecha no es válido';
      return resultado;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!permitirFutura && fechaObj > hoy) {
      resultado.valido = false;
      resultado.mensaje = 'No se pueden ingresar fechas futuras';
      return resultado;
    }

    resultado.mensaje = 'Fecha válida';
    return resultado;
  } catch (error) {
    resultado.valido = false;
    resultado.mensaje = `Error al validar fecha: ${error.message}`;
    return resultado;
  }
}

/**
 * Obtiene un resumen de todos los errores de validación
 * @param {Object} validaciones - Objeto con resultados de múltiples validaciones
 * @returns {Array} Arreglo de mensajes de error
 */
function obtenerErroresValidacion(validaciones) {
  const errores = [];

  for (const [campo, resultado] of Object.entries(validaciones)) {
    if (Array.isArray(resultado.errores)) {
      errores.push(...resultado.errores);
    } else if (resultado.mensaje && !resultado.valido) {
      errores.push(resultado.mensaje);
    }
  }

  return errores;
}

/**
 * Limpia y normaliza datos de entrada antes de guardar
 * @param {Object} datos - Objeto con datos a limpiar
 * @returns {Object} Objeto limpio y normalizado
 */
function normalizarDatos(datos) {
  return {
    nombre: (datos.nombre || '').trim(),
    cedula: (datos.cedula || '').trim().toUpperCase(),
    departamento: (datos.departamento || '').trim(),
    tipo: (datos.tipo || '').trim(),
    numBoleta: (datos.numBoleta || '').trim().toUpperCase(),
    fechaInicio: (datos.fechaInicio || '').trim(),
    fechaFin: (datos.fechaFin || '').trim(),
    estado: (datos.estado || 'Activa').trim(),
    observaciones: (datos.observaciones || '').trim()
  };
}
