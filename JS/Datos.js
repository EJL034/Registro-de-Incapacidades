<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prueba - Sistema de Gestión de Incapacidades</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
 
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 20px;
    }
 
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
 
    header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }
 
    header h1 {
      font-size: 2em;
      margin-bottom: 10px;
    }
 
    .content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 30px;
    }
 
    .section {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 20px;
      border-left: 4px solid #667eea;
    }
 
    .section h2 {
      color: #333;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
 
    .test-button {
      display: block;
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9em;
      transition: background 0.3s;
    }
 
    .test-button:hover {
      background: #764ba2;
    }
 
    .test-button.danger {
      background: #e74c3c;
    }
 
    .test-button.danger:hover {
      background: #c0392b;
    }
 
    .test-button.success {
      background: #27ae60;
    }
 
    .test-button.success:hover {
      background: #229954;
    }
 
    .output {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 15px;
      border-radius: 5px;
      margin-top: 15px;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
 
    .output.success {
      border-left: 3px solid #27ae60;
    }
 
    .output.error {
      border-left: 3px solid #e74c3c;
    }
 
    .output.info {
      border-left: 3px solid #3498db;
    }
 
    .stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 15px;
    }
 
    .stat-box {
      background: white;
      padding: 15px;
      border-radius: 5px;
      text-align: center;
      border: 1px solid #ddd;
    }
 
    .stat-box .number {
      font-size: 2em;
      color: #667eea;
      font-weight: bold;
    }
 
    .stat-box .label {
      color: #666;
      font-size: 0.85em;
      margin-top: 5px;
    }
 
    .full-width {
      grid-column: 1 / -1;
    }
 
    input[type="text"],
    input[type="date"],
    select,
    textarea {
      width: 100%;
      padding: 8px;
      margin: 8px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
 
    label {
      display: block;
      margin-top: 10px;
      color: #333;
      font-weight: 500;
    }
 
    .form-group {
      margin-bottom: 15px;
    }
 
    .alert {
      padding: 12px;
      margin: 10px 0;
      border-radius: 4px;
      border-left: 4px solid;
    }
 
    .alert.success {
      background: #d4edda;
      border-color: #28a745;
      color: #155724;
    }
 
    .alert.error {
      background: #f8d7da;
      border-color: #dc3545;
      color: #721c24;
    }
 
    .alert.info {
      background: #d1ecf1;
      border-color: #17a2b8;
      color: #0c5460;
    }
 
    @media (max-width: 768px) {
      .content {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>🧪 Pruebas - Sistema de Gestión de Incapacidades</h1>
      <p>Módulos: Datos y Validaciones</p>
    </header>
 
    <div class="content">
      <!-- Sección 1: Datos -->
      <div class="section">
        <h2>📊 Módulo de Datos</h2>
        
        <button class="test-button success" onclick="testObtenerTodas()">
          Obtener todas las incapacidades
        </button>
        
        <button class="test-button" onclick="testObtenerPorId()">
          Obtener por ID (INC-001-2026)
        </button>
        
        <button class="test-button" onclick="testGuardar()">
          Guardar nueva incapacidad
        </button>
        
        <button class="test-button" onclick="testActualizar()">
          Actualizar (cambiar estado)
        </button>
        
        <button class="test-button" onclick="testEstadisticas()">
          Obtener estadísticas
        </button>
        
        <button class="test-button" onclick="testGenerarId()">
          Generar ID único
        </button>
 
        <button class="test-button danger" onclick="testLimpiar()">
          Limpiar datos (¡CUIDADO!)
        </button>
 
        <div id="datosOutput" class="output"></div>
      </div>
 
      <!-- Sección 2: Validaciones -->
      <div class="section">
        <h2>✅ Módulo de Validaciones</h2>
        
        <div class="form-group">
          <label>Calcular días</label>
          <input type="date" id="fechaInicio" value="2026-08-15">
          <input type="date" id="fechaFin" value="2026-08-30">
          <button class="test-button" onclick="testCalcularDias()">
            Calcular días
          </button>
        </div>
 
        <div class="form-group">
          <label>Validar boleta</label>
          <input type="text" id="numeroBoleta" placeholder="ej: BOL-2026-001" value="BOL-2026-001">
          <button class="test-button" onclick="testValidarBoleta()">
            Validar boleta única
          </button>
        </div>
 
        <div class="form-group">
          <label>Validar cédula</label>
          <input type="text" id="numeroCedula" placeholder="ej: 123-456789-0" value="101-234567-8">
          <button class="test-button" onclick="testValidarCedula()">
            Validar formato cédula
          </button>
        </div>
 
        <div class="form-group">
          <label>Validar archivo</label>
          <input type="file" id="archivoInput" accept="pdf,image/*">
          <button class="test-button" onclick="testValidarArchivo()">
            Validar archivo
          </button>
        </div>
 
        <button class="test-button" onclick="testValidarFormulario()">
          Validar formulario completo
        </button>
 
        <div id="validacionOutput" class="output"></div>
      </div>
 
      <!-- Sección 3: Formulario de Prueba -->
      <div class="section full-width">
        <h2>📝 Formulario de Registro (Prueba Completa)</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div class="form-group">
            <label>Nombre</label>
            <input type="text" id="formNombre" placeholder="Juan Pérez García" value="Roberto López">
          </div>
          
          <div class="form-group">
            <label>Cédula</label>
            <input type="text" id="formCedula" placeholder="123-456789-0" value="104-567890-1">
          </div>
          
          <div class="form-group">
            <label>Departamento</label>
            <select id="formDepartamento">
              <option value="">-- Seleccionar --</option>
              <option value="Recursos Humanos">Recursos Humanos</option>
              <option value="Operaciones">Operaciones</option>
              <option value="Contabilidad">Contabilidad</option>
              <option value="Ventas">Ventas</option>
              <option value="IT">IT</option>
              <option value="Finanzas">Finanzas</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Tipo de Incapacidad</label>
            <select id="formTipo">
              <option value="">-- Seleccionar --</option>
              <option value="Médica">Médica</option>
              <option value="Maternidad">Maternidad</option>
              <option value="Paternidad">Paternidad</option>
              <option value="Accidente Laboral">Accidente Laboral</option>
              <option value="Enfermedad Profesional">Enfermedad Profesional</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Número de Boleta</label>
            <input type="text" id="formBoleta" placeholder="BOL-2026-004" value="BOL-2026-007">
          </div>
          
          <div class="form-group">
            <label>Fecha Inicio</label>
            <input type="date" id="formFechaInicio" value="2026-08-25">
          </div>
          
          <div class="form-group">
            <label>Fecha Fin</label>
            <input type="date" id="formFechaFin" value="2026-09-10">
          </div>
          
          <div class="form-group">
            <label>Archivo Adjunto (PDF o Imagen)</label>
            <input type="file" id="formArchivo" accept="application/pdf,image/*">
          </div>
        </div>
 
        <button class="test-button success" onclick="testRegistroCompleto()">
          Validar y Guardar Completo
        </button>
 
        <div id="formularioOutput" class="output"></div>
      </div>
 
      <!-- Sección 4: Estadísticas -->
      <div class="section full-width">
        <h2>📈 Estadísticas del Sistema</h2>
        <button class="test-button" onclick="actualizarEstadisticas()">
          Actualizar Estadísticas
        </button>
        <div class="stats" id="estadisticas"></div>
      </div>
    </div>
  </div>
 
  <!-- Importar módulos -->
  <script src="js/datos.js"></script>
  <script src="js/validaciones.js"></script>
 
  <!-- Funciones de prueba -->
  <script>
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
      mostrarOutput('datosOutput', '✅ OBTENER TODAS LAS INCAPACIDADES', contenido, 'success');
    }
 
    function testObtenerPorId() {
      const dato = obtenerIncapacidadPorId('INC-001-2026');
      if (dato) {
        const contenido = JSON.stringify(dato, null, 2);
        mostrarOutput('datosOutput', '✅ OBTENER POR ID', contenido, 'success');
      } else {
        mostrarOutput('datosOutput', '❌ ERROR', 'Registro no encontrado', 'error');
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
        mostrarOutput('datosOutput', '✅ GUARDAR INCAPACIDAD', 
          `Incapacidad guardada correctamente\n${JSON.stringify(nuevoRegistro, null, 2)}`, 
          'success');
      } else {
        mostrarOutput('datosOutput', '❌ ERROR', 'No se pudo guardar', 'error');
      }
    }
 
    function testActualizar() {
      const actualizado = actualizarIncapacidad('INC-001-2026', {
        estado: 'Finalizada',
        fechaReincorporacion: '2026-08-16'
      });
 
      if (actualizado) {
        const dato = obtenerIncapacidadPorId('INC-001-2026');
        mostrarOutput('datosOutput', '✅ ACTUALIZAR INCAPACIDAD',
          `Estado actualizado a: ${dato.estado}\n${JSON.stringify(dato, null, 2)}`,
          'success');
      } else {
        mostrarOutput('datosOutput', '❌ ERROR', 'No se pudo actualizar', 'error');
      }
    }
 
    function testEstadisticas() {
      const stats = obtenerEstadisticas();
      const contenido = JSON.stringify(stats, null, 2);
      mostrarOutput('datosOutput', '✅ ESTADÍSTICAS', contenido, 'success');
    }
 
    function testGenerarId() {
      const id = generarIdUnico();
      const contenido = `ID Generado: ${id}\nFormato: INC-NNN-YYYY`;
      mostrarOutput('datosOutput', '✅ GENERAR ID ÚNICO', contenido, 'success');
    }
 
    function testLimpiar() {
      if (confirm('⚠️ ¿Realmente deseas limpiar todos los datos? ¡Esta acción NO se puede deshacer!')) {
        limpiarBaseDatos();
        inicializarDatosPrueba();
        mostrarOutput('datosOutput', '⚠️ DATOS LIMPIADOS', 'Base de datos reiniciada con datos de prueba', 'info');
      }
    }
 
    function testCalcularDias() {
      const inicio = document.getElementById('fechaInicio').value;
      const fin = document.getElementById('fechaFin').value;
      
      const resultado = calcularDiasIncapacidad(inicio, fin);
      const contenido = JSON.stringify(resultado, null, 2);
      const tipo = resultado.valido ? 'success' : 'error';
      mostrarOutput('validacionOutput', '✅ CALCULAR DÍAS', contenido, tipo);
    }
 
    function testValidarBoleta() {
      const boleta = document.getElementById('numeroBoleta').value;
      const resultado = validarBoletaUnica(boleta, null);
      const contenido = JSON.stringify(resultado, null, 2);
      const tipo = resultado.valido ? 'success' : 'error';
      mostrarOutput('validacionOutput', '✅ VALIDAR BOLETA', contenido, tipo);
    }
 
    function testValidarCedula() {
      const cedula = document.getElementById('numeroCedula').value;
      const esValida = validarFormatoCedula(cedula);
      const contenido = esValida 
        ? `Cédula válida: ${cedula}\nFormato correcto: XXX-XXXXXX-X`
        : `Cédula inválida: ${cedula}\nFormato esperado: XXX-XXXXXX-X`;
      const tipo = esValida ? 'success' : 'error';
      mostrarOutput('validacionOutput', '✅ VALIDAR CÉDULA', contenido, tipo);
    }
 
    function testValidarArchivo() {
      const input = document.getElementById('archivoInput');
      if (!input.files.length) {
        mostrarOutput('validacionOutput', '❌ ERROR', 'Selecciona un archivo primero', 'error');
        return;
      }
 
      const archivo = input.files[0];
      const resultado = validarFormatoArchivo(archivo);
      const contenido = JSON.stringify(resultado, null, 2);
      const tipo = resultado.valido ? 'success' : 'error';
      mostrarOutput('validacionOutput', '✅ VALIDAR ARCHIVO', contenido, tipo);
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
 
      const resultado = validarFormularioRegistro(datos);
      const contenido = JSON.stringify(resultado, null, 2);
      const tipo = resultado.valido ? 'success' : 'error';
      mostrarOutput('validacionOutput', '✅ VALIDAR FORMULARIO', contenido, tipo);
    }
 
    function testRegistroCompleto() {
      const datos = {
        nombre: document.getElementById('formNombre').value,
        cedula: document.getElementById('formCedula').value,
        departamento: document.getElementById('formDepartamento').value,
        tipo: document.getElementById('formTipo').value,
        numBoleta: document.getElementById('formBoleta').value,
        fechaInicio: document.getElementById('formFechaInicio').value,
        fechaFin: document.getElementById('formFechaFin').value,
        archivo: document.getElementById('formArchivo').files[0] || null
      };
 
      // 1. Normalizar
      const datosLimpios = normalizarDatos(datos);
 
      // 2. Validar
      const validacion = validarFormularioRegistro(datosLimpios);
 
      let contenido = '';
      let tipo = 'success';
 
      if (!validacion.valido) {
        contenido = '❌ ERRORES ENCONTRADOS:\n\n' + validacion.errores.join('\n');
        tipo = 'error';
      } else {
        // 3. Calcular días
        const diasValidacion = calcularDiasIncapacidad(datosLimpios.fechaInicio, datosLimpios.fechaFin);
 
        // 4. Guardar
        const registro = {
          ...datosLimpios,
          diasIncapacidad: diasValidacion.diasCalculados,
          estado: 'Activa',
          urlAdjunto: '/documentos/archivo-simulado.pdf'
        };
 
        if (guardarIncapacidad(registro)) {
          contenido = '✅ INCAPACIDAD GUARDADA EXITOSAMENTE\n\n' + JSON.stringify(registro, null, 2);
        } else {
          contenido = '❌ ERROR AL GUARDAR LA INCAPACIDAD';
          tipo = 'error';
        }
      }
 
      mostrarOutput('formularioOutput', '📋 REGISTRO COMPLETO', contenido, tipo);
      actualizarEstadisticas();
    }
 
    function actualizarEstadisticas() {
      const stats = obtenerEstadisticas();
      const html = `
        <div class="stat-box">
          <div class="number">${stats.total}</div>
          <div class="label">Total de Registros</div>
        </div>
        <div class="stat-box">
          <div class="number">${stats.activas}</div>
          <div class="label">Activas</div>
        </div>
        <div class="stat-box">
          <div class="number">${stats.finalizadas}</div>
          <div class="label">Finalizadas</div>
        </div>
        <div class="stat-box">
          <div class="number">${stats.prorroga}</div>
          <div class="label">En Prórroga</div>
        </div>
        <div class="stat-box">
          <div class="number">${stats.diasTotales}</div>
          <div class="label">Días Acumulados</div>
        </div>
      `;
      document.getElementById('estadisticas').innerHTML = html;
    }
 
    // Actualizar estadísticas al cargar
    window.addEventListener('load', actualizarEstadisticas);
  </script>
</body>
</html>