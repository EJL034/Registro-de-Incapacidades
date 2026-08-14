// js/validaciones.js

// Calcular días de diferencia entre fecha inicio y fin
function calcularDiasIncapacidad(fechaInicioStr, fechaFinStr) {
  if (!fechaInicioStr || !fechaFinStr) {
    return { valido: false, mensaje: 'Ambas fechas son requeridas', diasCalculados: 0 };
  }

  const inicio = new Date(fechaInicioStr);
  const fin = new Date(fechaFinStr);

  if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
    return { valido: false, mensaje: 'Formato de fecha inválido', diasCalculados: 0 };
  }

  if (fin < inicio) {
    return { valido: false, mensaje: 'La fecha final no puede ser anterior a la de inicio', diasCalculados: 0 };
  }

  // Cálculo en milisegundos a días (incluyendo el día de inicio)
  const diffTime = Math.abs(fin - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return { valido: true, mensaje: 'Cálculo correcto', diasCalculados: diffDays };
}

// Validar que el número de boleta no esté repetido
function validarBoletaUnica(numBoleta, idExcluir = null) {
  if (!numBoleta || numBoleta.trim() === '') {
    return { valido: false, mensaje: 'El número de boleta es obligatorio' };
  }

  const lista = obtenerIncapacidades();
  const existe = lista.some(item => item.numBoleta.toLowerCase() === numBoleta.trim().toLowerCase() && item.id !== idExcluir);

  if (existe) {
    return { valido: false, mensaje: 'El número de boleta ya existe en el sistema' };
  }

  return { valido: true, mensaje: 'Boleta disponible' };
}

// Validar formato de cédula (ej. XXX-XXXXXX-X o 9 dígitos)
function validarFormatoCedula(cedula) {
  if (!cedula) return false;
  const regexCedula = /^[0-9]{3}-[0-9]{6}-[0-9]{1}$|^[0-9]{9,12}$/;
  return regexCedula.test(cedula.trim());
}

// Validar formato de archivo adjunto (PDF o Imágenes)
function validarFormatoArchivo(archivo) {
  if (!archivo) {
    return { valido: false, mensaje: 'Debe adjuntar un archivo' };
  }

  const tiposPermitidos = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (!tiposPermitidos.includes(archivo.type)) {
    return { valido: false, mensaje: 'Tipo de archivo no permitido. Solo PDF o Imágenes (JPG/PNG).' };
  }

  // Límite de tamaño: 5 MB
  const maxBytes = 5 * 1024 * 1024;
  if (archivo.size > maxBytes) {
    return { valido: false, mensaje: 'El archivo excede el tamaño máximo permitido de 5MB.' };
  }

  return { valido: true, mensaje: 'Archivo válido' };
}

// Normalizar y limpiar datos de entradas
function normalizarDatos(datos) {
  return {
    ...datos,
    nombre: datos.nombre ? datos.nombre.trim() : '',
    cedula: datos.cedula ? datos.cedula.trim() : '',
    numBoleta: datos.numBoleta ? datos.numBoleta.trim() : '',
    departamento: datos.departamento ? datos.departamento.trim() : '',
    tipo: datos.tipo ? datos.tipo.trim() : ''
  };
}

// Validar formulario completo de registro
function validarFormularioRegistro(datos) {
  const errores = [];

  if (!datos.nombre || datos.nombre.length < 3) {
    errores.push('El nombre debe tener al menos 3 caracteres.');
  }

  if (!validarFormatoCedula(datos.cedula)) {
    errores.push('El formato de la cédula es inválido.');
  }

  if (!datos.departamento) {
    errores.push('Debe seleccionar un departamento.');
  }

  if (!datos.tipo) {
    errores.push('Debe seleccionar el tipo de incapacidad.');
  }

  const resBoleta = validarBoletaUnica(datos.numBoleta, datos.id || null);
  if (!resBoleta.valido) {
    errores.push(resBoleta.mensaje);
  }

  const resDias = calcularDiasIncapacidad(datos.fechaInicio, datos.fechaFin);
  if (!resDias.valido) {
    errores.push(resDias.mensaje);
  }

  return {
    valido: errores.length === 0,
    errores: errores
  };
}