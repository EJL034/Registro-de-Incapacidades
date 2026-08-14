// JS/registro.js - Módulo de Control del Formulario de Registro

document.addEventListener('DOMContentLoaded', function() {
  inicializarModuloRegistro();
});

/**
 * Inicializa los eventos del módulo de registro
 */
function inicializarModuloRegistro() {
  const form = document.getElementById('form-incapacidad') || document.querySelector('form');
  const fechaInicioInput = document.getElementById('fechaInicio') || document.getElementById('formFechaInicio');
  const fechaFinInput = document.getElementById('fechaFin') || document.getElementById('formFechaFin');

  // Evento Submit del Formulario
  if (form) {
    form.addEventListener('submit', procesarEnvioFormulario);
  }

  // Evento Change en Fechas para cálculo automático
  if (fechaInicioInput && fechaFinInput) {
    fechaInicioInput.addEventListener('change', manejarCambioFechas);
    fechaFinInput.addEventListener('change', manejarCambioFechas);
  }
}

/**
 * Maneja el evento de cambio en las fechas para calcular días dinámicamente
 */
function manejarCambioFechas() {
  const fechaInicio = (document.getElementById('fechaInicio') || document.getElementById('formFechaInicio')).value;
  const fechaFin = (document.getElementById('fechaFin') || document.getElementById('formFechaFin')).value;
  const diasInput = document.getElementById('diasIncapacidad') || document.getElementById('formDias');

  if (fechaInicio && fechaFin) {
    const resultado = calcularDiasIncapacidad(fechaInicio, fechaFin);
    if (resultado.valido && diasInput) {
      diasInput.value = resultado.diasCalculados;
    } else if (diasInput) {
      diasInput.value = '';
    }
  }
}

/**
 * Procesar la captura, validación y guardado del formulario
 */
function procesarEnvioFormulario(e) {
  e.preventDefault();

  const datos = {
    nombre: (document.getElementById('nombre') || document.getElementById('formNombre'))?.value,
    cedula: (document.getElementById('cedula') || document.getElementById('formCedula'))?.value,
    departamento: (document.getElementById('departamento') || document.getElementById('formDepartamento'))?.value,
    tipo: (document.getElementById('tipo') || document.getElementById('formTipo'))?.value,
    numBoleta: (document.getElementById('numBoleta') || document.getElementById('formBoleta'))?.value,
    fechaInicio: (document.getElementById('fechaInicio') || document.getElementById('formFechaInicio'))?.value,
    fechaFin: (document.getElementById('fechaFin') || document.getElementById('formFechaFin'))?.value,
    archivo: (document.getElementById('archivo') || document.getElementById('formArchivo'))?.files[0] || null
  };

  // 1. Normalizar datos
  const datosLimpios = normalizarDatos(datos);

  // 2. Validar
  const validacion = validarFormularioRegistro(datosLimpios);

  if (!validacion.valido) {
    alert('❌ Errores en el formulario:\n\n' + validacion.errores.join('\n'));
    return;
  }

  // 3. Calcular días
  const resDias = calcularDiasIncapacidad(datosLimpios.fechaInicio, datosLimpios.fechaFin);

  // 4. Crear objeto de registro
  const nuevoRegistro = {
    ...datosLimpios,
    diasIncapacidad: resDias.diasCalculados,
    estado: 'Activa',
    urlAdjunto: datosLimpios.archivo ? `/documentos/${datosLimpios.archivo.name}` : ''
  };

  // 5. Guardar
  if (guardarIncapacidad(nuevoRegistro)) {
    alert('✅ Incapacidad registrada exitosamente.');
    limpiarFormularioRegistro();
  } else {
    alert('❌ Hubo un error al guardar la incapacidad en el sistema.');
  }
}

/**
 * Limpia los campos del formulario tras un registro exitoso
 */
function limpiarFormularioRegistro() {
  const form = document.getElementById('form-incapacidad') || document.querySelector('form');
  if (form) {
    form.reset();
  }
}