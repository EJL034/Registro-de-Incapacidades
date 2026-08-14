function mostrarOutput(elementId, titulo, contenido, tipo = 'info') {
  const output = document.getElementById(elementId);

  output.textContent = `${titulo}\n\n${contenido}`;

  output.className = `output ${tipo}`;
}


function testObtenerTodas() {

  const datos = obtenerIncapacidades();

  let contenido = `Total de registros: ${datos.length}\n\n`;

  datos.forEach((d, i) => {

    contenido += `${i + 1}. ${d.nombre} (${d.cedula}) - ${d.estado}\n`;

  });

  mostrarOutput(
    'datosOutput',
    '✅ OBTENER TODAS LAS INCAPACIDADES',
    contenido,
    'success'
  );
}


function testObtenerPorId() {

  const dato = obtenerIncapacidadPorId('INC-001-2026');

  if (dato) {

    const contenido = JSON.stringify(dato, null, 2);

    mostrarOutput(
      'datosOutput',
      '✅ OBTENER POR ID',
      contenido,
      'success'
    );

  } else {

    mostrarOutput(
      'datosOutput',
      '❌ ERROR',
      'Registro no encontrado',
      'error'
    );

  }
}


function testGuardar() {

  const nuevoRegistro = {

    nombre: 'Pedro Nuevo',

    cedula: '105-678901-2',

    departamento: 'Recursos Humanos',

    tipo: 'Médica',

    numBoleta: 'BOL-2026-TEST-' + Date.now(),

    fechaInicio: '2026-08-20',

    fechaFin: '2026-09-05',

    diasIncapacidad: 17,

    estado: 'Activa',

    urlAdjunto: '/documentos/test.pdf'

  };


  if (guardarIncapacidad(nuevoRegistro)) {

    mostrarOutput(
      'datosOutput',
      '✅ GUARDAR INCAPACIDAD',
      `Incapacidad guardada correctamente\n${JSON.stringify(nuevoRegistro, null, 2)}`,
      'success'
    );

  } else {

    mostrarOutput(
      'datosOutput',
      '❌ ERROR',
      'No se pudo guardar',
      'error'
    );

  }
}


function testActualizar() {

  const actualizado = actualizarIncapacidad(
    'INC-001-2026',
    {
      estado: 'Finalizada',
      fechaReincorporacion: '2026-08-16'
    }
  );


  if (actualizado) {

    const dato = obtenerIncapacidadPorId('INC-001-2026');

    mostrarOutput(
      'datosOutput',
      '✅ ACTUALIZAR INCAPACIDAD',
      `Estado actualizado a: ${dato.estado}\n${JSON.stringify(dato, null, 2)}`,
      'success'
    );

  } else {

    mostrarOutput(
      'datosOutput',
      '❌ ERROR',
      'No se pudo actualizar',
      'error'
    );

  }
}


function testEstadisticas() {

  const stats = obtenerEstadisticas();

  const contenido = JSON.stringify(stats, null, 2);

  mostrarOutput(
    'datosOutput',
    '✅ ESTADÍSTICAS',
    contenido,
    'success'
  );
}


function testGenerarId() {

  const id = generarIdUnico();

  const contenido =
    `ID Generado: ${id}\nFormato: INC-NNN-YYYY`;

  mostrarOutput(
    'datosOutput',
    '✅ GENERAR ID ÚNICO',
    contenido,
    'success'
  );
}


function testLimpiar() {

  if (
    confirm(
      '⚠️ ¿Realmente deseas limpiar todos los datos? ¡Esta acción NO se puede deshacer!'
    )
  ) {

    limpiarBaseDatos();

    inicializarDatosPrueba();

    mostrarOutput(
      'datosOutput',
      '⚠️ DATOS LIMPIADOS',
      'Base de datos reiniciada con datos de prueba',
      'info'
    );

  }
}


function testCalcularDias() {

  const inicio =
    document.getElementById('fechaInicio').value;

  const fin =
    document.getElementById('fechaFin').value;


  const resultado =
    calcularDiasIncapacidad(inicio, fin);


  const contenido =
    JSON.stringify(resultado, null, 2);


  const tipo =
    resultado.valido
      ? 'success'
      : 'error';


  mostrarOutput(
    'validacionOutput',
    '✅ CALCULAR DÍAS',
    contenido,
    tipo
  );
}


function testValidarBoleta() {

  const boleta =
    document.getElementById('numeroBoleta').value;


  const resultado =
    validarBoletaUnica(boleta, null);


  const contenido =
    JSON.stringify(resultado, null, 2);


  const tipo =
    resultado.valido
      ? 'success'
      : 'error';


  mostrarOutput(
    'validacionOutput',
    '✅ VALIDAR BOLETA',
    contenido,
    tipo
  );
}


function testValidarCedula() {

  const cedula =
    document.getElementById('numeroCedula').value;


  const esValida =
    validarFormatoCedula(cedula);


  const contenido = esValida

    ? `Cédula válida: ${cedula}\nFormato correcto: XXX-XXXXXX-X`

    : `Cédula inválida: ${cedula}\nFormato esperado: XXX-XXXXXX-X`;


  const tipo =
    esValida
      ? 'success'
      : 'error';


  mostrarOutput(
    'validacionOutput',
    '✅ VALIDAR CÉDULA',
    contenido,
    tipo
  );
}


function testValidarArchivo() {

  const input =
    document.getElementById('archivoInput');


  if (!input.files.length) {

    mostrarOutput(
      'validacionOutput',
      '❌ ERROR',
      'Selecciona un archivo primero',
      'error'
    );

    return;
  }


  const archivo =
    input.files[0];


  const resultado =
    validarFormatoArchivo(archivo);


  const contenido =
    JSON.stringify(resultado, null, 2);


  const tipo =
    resultado.valido
      ? 'success'
      : 'error';


  mostrarOutput(
    'validacionOutput',
    '✅ VALIDAR ARCHIVO',
    contenido,
    tipo
  );
}


function testValidarFormulario() {

  const datos = {

    nombre: 'Test Persona',

    cedula: '123-456789-0',

    departamento: 'IT',

    tipo: 'Médica',

    numBoleta: 'BOL-TEST-' + Date.now(),

    fechaInicio: '2026-08-25',

    fechaFin: '2026-09-10',

    archivo: null

  };


  const resultado =
    validarFormularioRegistro(datos);


  const contenido =
    JSON.stringify(resultado, null, 2);


  const tipo =
    resultado.valido
      ? 'success'
      : 'error';


  mostrarOutput(
    'validacionOutput',
    '✅ VALIDAR FORMULARIO',
    contenido,
    tipo
  );
}


function testRegistroCompleto() {

  const datos = {

    nombre:
      document.getElementById('formNombre').value,

    cedula:
      document.getElementById('formCedula').value,

    departamento:
      document.getElementById('formDepartamento').value,

    tipo:
      document.getElementById('formTipo').value,

    numBoleta:
      document.getElementById('formBoleta').value,

    fechaInicio:
      document.getElementById('formFechaInicio').value,

    fechaFin:
      document.getElementById('formFechaFin').value,

    archivo:
      document.getElementById('formArchivo').files[0] || null

  };


  // 1. Normalizar

  const datosLimpios =
    normalizarDatos(datos);


  // 2. Validar

  const validacion =
    validarFormularioRegistro(datosLimpios);


  let contenido = '';

  let tipo = 'success';


  if (!validacion.valido) {

    contenido =
      '❌ ERRORES ENCONTRADOS:\n\n' +
      validacion.errores.join('\n');

    tipo = 'error';

  } else {

    // 3. Calcular días

    const diasValidacion =
      calcularDiasIncapacidad(
        datosLimpios.fechaInicio,
        datosLimpios.fechaFin
      );


    // 4. Guardar

    const registro = {

      ...datosLimpios,

      diasIncapacidad:
        diasValidacion.diasCalculados,

      estado: 'Activa',

      urlAdjunto:
        '/documentos/archivo-simulado.pdf'

    };


    if (guardarIncapacidad(registro)) {

      contenido =
        '✅ INCAPACIDAD GUARDADA EXITOSAMENTE\n\n' +
        JSON.stringify(registro, null, 2);

    } else {

      contenido =
        '❌ ERROR AL GUARDAR LA INCAPACIDAD';

      tipo = 'error';

    }

  }


  mostrarOutput(
    'formularioOutput',
    '📋 REGISTRO COMPLETO',
    contenido,
    tipo
  );


  actualizarEstadisticas();
}


function actualizarEstadisticas() {

  const stats =
    obtenerEstadisticas();


  const html = `

    <div class="stat-box">

      <div class="number">
        ${stats.total}
      </div>

      <div class="label">
        Total de Registros
      </div>

    </div>


    <div class="stat-box">

      <div class="number">
        ${stats.activas}
      </div>

      <div class="label">
        Activas
      </div>

    </div>


    <div class="stat-box">

      <div class="number">
        ${stats.finalizadas}
      </div>

      <div class="label">
        Finalizadas
      </div>

    </div>


    <div class="stat-box">

      <div class="number">
        ${stats.prorroga}
      </div>

      <div class="label">
        En Prórroga
      </div>

    </div>


    <div class="stat-box">

      <div class="number">
        ${stats.diasTotales}
      </div>

      <div class="label">
        Días Acumulados
      </div>

    </div>

  `;


  document.getElementById('estadisticas').innerHTML = html;
}


// Actualizar estadísticas al cargar

window.addEventListener(
  'load',
  actualizarEstadisticas
);