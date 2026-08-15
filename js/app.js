/**
 * MÓDULO DE INTERFAZ DE USUARIO
 * Gestiona la interacción con el DOM, eventos y actualizaciones en tiempo real
 */

// Estado global de la aplicación
const appState = {
  currentView: 'lista', // 'lista', 'registro', 'detalle', 'prorroga'
  currentId: null,
  filtro: {
    busqueda: '',
    estado: 'Todas',
    departamento: 'Todos'
  },
  modo: 'crear' // 'crear' o 'editar'
};

// ==========================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Iniciando aplicación...');
  
  actualizarInfoUsuario();
  setupEventListeners();
  cargarListaIncapacidades();
  actualizarEstadisticas();
  aplicarPermisos();
  
  console.log('✅ Aplicación lista');
});

/**
 * Aplica los permisos según el rol del usuario
 */
function aplicarPermisos() {
  const puedeEliminar = autenticacion.tienePermiso('eliminar');
  const puedeExportar = autenticacion.tienePermiso('exportar');
  const puedeCrear = autenticacion.tienePermiso('crear');
  const puedeActualizar = autenticacion.tienePermiso('actualizar');

  // Botón Nueva Incapacidad
  const btnNuevo = document.getElementById('btnNuevo');
  if (btnNuevo) {
    btnNuevo.style.display = puedeCrear ? 'inline-flex' : 'none';
  }

  // Botones de eliminar
  document.querySelectorAll('.btn-eliminar').forEach(btn => {
    btn.style.display = puedeEliminar ? 'inline-flex' : 'none';
  });

  // Botones de editar
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.style.display = puedeActualizar ? 'inline-flex' : 'none';
  });

  // Opción de exportar en el menú
  const linkExportar = document.querySelector('a[onclick*="mostrarExportarDatos"]');
  if (linkExportar) {
    linkExportar.style.display = puedeExportar ? 'flex' : 'none';
  }
}

/**
 * Actualiza la información del usuario en la navbar
 */
function actualizarInfoUsuario() {
  const usuario = autenticacion.obtenerUsuarioActual();
  if (usuario) {
    const nombreEl = document.getElementById('usuarioNombre');
    if (nombreEl) {
      nombreEl.textContent = usuario.nombre;
    }
  }
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesionUsuario() {
  if (confirm('¿Deseas cerrar sesión?')) {
    autenticacion.cerrarSesion();
    mostrarNotificacion('✅ Sesión cerrada correctamente', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 800);
  }
}

/**
 * Muestra el perfil del usuario
 */
function mostrarPerfil() {
  const usuario = autenticacion.obtenerUsuarioActual();
  if (!usuario) return;

  const modal = document.getElementById('modalConfirmacion');
  const contenido = `
    <div class="modal-header">
      <h3>👤 Mi Perfil</h3>
    </div>
    <div class="modal-body">
      <p><strong>Nombre:</strong> ${usuario.nombre}</p>
      <p><strong>Email:</strong> ${usuario.email}</p>
      <p><strong>Rol:</strong> 
        <span style="background: #667eea; color: white; padding: 3px 10px; border-radius: 12px; font-size: 0.85rem;">
          ${usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
        </span>
      </p>
      <p style="margin-top: 12px; color: #666; font-size: 0.9rem;">
        <strong>Último acceso:</strong> ${new Date(usuario.fechaLogin).toLocaleString('es-CR')}
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="cerrarModal()">Cerrar</button>
    </div>
  `;

  document.querySelector('.modal-content').innerHTML = contenido;
  modal.style.display = 'block';
}

/**
 * Muestra opción de exportar datos
 */
function mostrarExportarDatos() {
  if (!autenticacion.tienePermiso('exportar')) {
    mostrarNotificacion('⛔ No tienes permiso para exportar datos', 'error');
    return;
  }

  const opciones = `
    <div style="background: white; padding: 30px; border-radius: 12px; max-width: 400px; margin: 50px auto;">
      <h2>📤 Exportar Datos</h2>
      <p style="color: #666; margin-bottom: 20px;">Selecciona el formato de descarga:</p>
      <div style="display: grid; gap: 10px;">
        <button class="btn btn-primary" onclick="reportes.exportarJSON(); cerrarModal();">
          <i class="ti ti-json"></i> Descargar JSON
        </button>
        <button class="btn btn-primary" onclick="reportes.exportarCSV(); cerrarModal();">
          <i class="ti ti-file-spreadsheet"></i> Descargar CSV (Excel)
        </button>
        <button class="btn btn-primary" onclick="reportes.generarReportHTML(); cerrarModal();">
          <i class="ti ti-printer"></i> Imprimir Reporte
        </button>
        <button class="btn btn-secondary" onclick="cerrarModal();">
          <i class="ti ti-x"></i> Cancelar
        </button>
      </div>
    </div>
  `;
  
  const modalDiv = document.getElementById('modalConfirmacion');
  modalDiv.style.display = 'block';
  document.querySelector('.modal-content').innerHTML = opciones;
}

/**
 * Configura todos los event listeners de la aplicación
 */
function setupEventListeners() {
  // Botones principales
  document.getElementById('btnNuevo')?.addEventListener('click', mostrarFormulario);
  document.getElementById('btnGuardar')?.addEventListener('click', guardarRegistro);
  document.getElementById('btnCancelar')?.addEventListener('click', cancelarFormulario);
  document.getElementById('btnLimpiarFiltros')?.addEventListener('click', limpiarFiltros);
  
  // Filtros
  document.getElementById('inputBusqueda')?.addEventListener('input', aplicarFiltros);
  document.getElementById('selectEstado')?.addEventListener('change', aplicarFiltros);
  document.getElementById('selectDepartamento')?.addEventListener('change', aplicarFiltros);
  
  // Validación en tiempo real del formulario
  document.getElementById('inputNombre')?.addEventListener('blur', validarCampo);
  document.getElementById('inputCedula')?.addEventListener('blur', validarCampo);
  document.getElementById('inputBoleta')?.addEventListener('blur', validarCampo);
  document.getElementById('inputFechaInicio')?.addEventListener('change', validarCampo);
  document.getElementById('inputFechaFin')?.addEventListener('change', validarCampo);
  document.getElementById('inputArchivo')?.addEventListener('change', validarCampo);
  
  // Actualizar días cuando cambian fechas
  document.getElementById('inputFechaInicio')?.addEventListener('change', calcularDiasFormulario);
  document.getElementById('inputFechaFin')?.addEventListener('change', calcularDiasFormulario);
  
  // Soporte para navegación (evitar recarga de página)
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-ver-detalle')) {
      e.preventDefault();
      mostrarDetalle(e.target.dataset.id);
    }
    if (e.target.classList.contains('btn-editar')) {
      e.preventDefault();
      editarIncapacidad(e.target.dataset.id);
    }
    if (e.target.classList.contains('btn-eliminar')) {
      e.preventDefault();
      confirmarEliminar(e.target.dataset.id);
    }
    if (e.target.classList.contains('btn-prorroga')) {
      e.preventDefault();
      mostrarFormularioProrroga(e.target.dataset.id);
    }
  });
}

// ==========================================
// VISTA DE LISTA DE INCAPACIDADES
// ==========================================

/**
 * Carga y muestra la lista de incapacidades
 */
function cargarListaIncapacidades() {
  appState.currentView = 'lista';
  mostrarVista('vistaLista');

  const incapacidades = obtenerIncapacidades();
  const container = document.getElementById('tablaIncapacidades');

  if (!container) return;

  if (incapacidades.length === 0) {
    container.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 40px;">
          <p style="color: var(--text-secondary); font-size: 1.1em;">
            📋 No hay incapacidades registradas
          </p>
          <button class="btn btn-primary" onclick="mostrarFormulario()">
            + Nueva Incapacidad
          </button>
        </td>
      </tr>
    `;
  } else {
    // Aquí va el código que renderiza la tabla con los registros
    container.innerHTML = incapacidades.map(incapacidad => `
      <tr class="fila-tabla estado-${incapacidad.estado.toLowerCase().replace(' ', '-')}">
        <td><strong>${incapacidad.nombre}</strong></td>
        <td>${incapacidad.cedula}</td>
        <td>${incapacidad.departamento}</td>
        <td><span class="badge badge-${incapacidad.tipo.toLowerCase().replace(' ', '-')}">${incapacidad.tipo}</span></td>
        <td>${formatearFecha(incapacidad.fechaInicio)}</td>
        <td><strong>${incapacidad.diasIncapacidad}</strong></td>
        <td><span class="badge badge-estado-${incapacidad.estado.toLowerCase()}">${incapacidad.estado}</span></td>
        <td class="columna-acciones">
          <div class="botones-grupo">
            <button class="btn btn-sm btn-info btn-ver-detalle" data-id="${incapacidad.id}" title="Ver detalles">
              👁️
            </button>
            <button class="btn btn-sm btn-warning btn-editar" data-id="${incapacidad.id}" title="Editar">
              ✏️
            </button>
            ${incapacidad.estado === 'Activa' ? `
              <button class="btn btn-sm btn-secondary btn-prorroga" data-id="${incapacidad.id}" title="Solicitar prórroga">
                ⏱️
              </button>
            ` : ''}
            <button class="btn btn-sm btn-danger btn-eliminar" data-id="${incapacidad.id}" title="Eliminar">
              🗑️
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  // Esta línea debe ir al final, fuera del if/else
  aplicarPermisos();
}
/**
 * Aplica filtros a la tabla
 */
function aplicarFiltros() {
  const busqueda = (document.getElementById('inputBusqueda')?.value || '').toLowerCase();
  const estado = document.getElementById('selectEstado')?.value || 'Todas';
  const departamento = document.getElementById('selectDepartamento')?.value || 'Todos';
  
  // Guardar estado del filtro
  appState.filtro = { busqueda, estado, departamento };
  
  const incapacidades = obtenerIncapacidades();
  const filas = document.querySelectorAll('#tablaIncapacidades tr');
  
  let visibles = 0;
  filas.forEach(fila => {
    const nombre = fila.querySelector('td:nth-child(1)')?.textContent.toLowerCase() || '';
    const cedula = fila.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
    const dept = fila.querySelector('td:nth-child(3)')?.textContent.toLowerCase() || '';
    const estadoFila = fila.querySelector('.badge-estado-activa, .badge-estado-finalizada, .badge-estado-prorroga')?.textContent.trim();
    
    const coincideBusqueda = nombre.includes(busqueda) || cedula.includes(busqueda);
    const coincideEstado = estado === 'Todas' || estadoFila === estado;
    const coincideDepartamento = departamento === 'Todos' || dept === departamento.toLowerCase();
    
    const visible = coincideBusqueda && coincideEstado && coincideDepartamento;
    fila.style.display = visible ? '' : 'none';
    if (visible) visibles++;
  });
  
  // Mostrar mensaje si no hay resultados
  if (visibles === 0) {
    const tbody = document.getElementById('tablaIncapacidades');
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; padding: 30px; color: var(--text-secondary);">
          No se encontraron registros que coincidan con los filtros
        </td>
      </tr>
    `;
  }
}

/**
 * Limpia los filtros aplicados
 */
function limpiarFiltros() {
  document.getElementById('inputBusqueda').value = '';
  document.getElementById('selectEstado').value = 'Todas';
  document.getElementById('selectDepartamento').value = 'Todos';
  
  appState.filtro = { busqueda: '', estado: 'Todas', departamento: 'Todos' };
  cargarListaIncapacidades();
}

// ==========================================
// VISTA DE FORMULARIO
// ==========================================

/**
 * Muestra el formulario para crear una nueva incapacidad
 */
function mostrarFormulario() {
  appState.currentView = 'registro';
  appState.modo = 'crear';
  appState.currentId = null;
  
  mostrarVista('vistaFormulario');
  
  // Limpiar formulario
  limpiarFormulario();
  document.getElementById('formTitle').textContent = 'Nueva Incapacidad';
  document.getElementById('btnGuardar').textContent = '💾 Guardar Incapacidad';
}

/**
 * Muestra el formulario en modo edición
 */
function editarIncapacidad(id) {
  appState.currentView = 'registro';
  appState.modo = 'editar';
  appState.currentId = id;
  
  mostrarVista('vistaFormulario');
  
  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  document.getElementById('formTitle').textContent = `Editar: ${incapacidad.nombre}`;
  document.getElementById('btnGuardar').textContent = '✏️ Actualizar Incapacidad';
  
  // Llenar formulario con datos
  document.getElementById('inputNombre').value = incapacidad.nombre;
  document.getElementById('inputCedula').value = incapacidad.cedula;
  document.getElementById('selectDepartamentoForm').value = incapacidad.departamento;
  document.getElementById('selectTipo').value = incapacidad.tipo;
  document.getElementById('inputBoleta').value = incapacidad.numBoleta;
  document.getElementById('inputFechaInicio').value = incapacidad.fechaInicio;
  document.getElementById('inputFechaFin').value = incapacidad.fechaFin;
  document.getElementById('selectEstado').value = incapacidad.estado;
  document.getElementById('textObservaciones').value = incapacidad.observaciones || '';
  
  // Mostrar archivo actual si existe
  if (incapacidad.urlAdjunto) {
    const archivoInfo = document.getElementById('archivoActual');
    archivoInfo.innerHTML = `
      <small style="color: var(--text-success);">
        ✓ Archivo actual: ${incapacidad.urlAdjunto.split('/').pop()}
      </small>
    `;
  }
  
  // Calcular días
  calcularDiasFormulario();
}

/**
 * Cancela la edición y vuelve a la lista
 */
function cancelarFormulario() {
  limpiarFormulario();
  cargarListaIncapacidades();
}

/**
 * Limpia todos los campos del formulario
 */
function limpiarFormulario() {
  document.getElementById('formRegistro').reset();
  document.getElementById('archivoActual').innerHTML = '';
  
  // Limpiar mensajes de error
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
  
  // Reset de campos
  document.getElementById('inputDias').value = '0';
}

/**
 * Guarda un nuevo registro o actualiza uno existente
 */
function guardarRegistro() {
  const datos = {
    nombre: document.getElementById('inputNombre').value,
    cedula: document.getElementById('inputCedula').value,
    departamento: document.getElementById('selectDepartamentoForm').value,
    tipo: document.getElementById('selectTipo').value,
    numBoleta: document.getElementById('inputBoleta').value,
    fechaInicio: document.getElementById('inputFechaInicio').value,
    fechaFin: document.getElementById('inputFechaFin').value,
    archivo: document.getElementById('inputArchivo').files[0] || null,
    estado: appState.modo === 'editar' ? document.getElementById('selectEstado').value : 'Activa',
    observaciones: document.getElementById('textObservaciones').value
  };
  
  // Validar formulario
  const validacion = validarFormularioRegistro(datos);
  if (!validacion.valido) {
    mostrarErroresFormulario(validacion.errores);
    return;
  }
  
  // Normalizar datos
  const datosLimpios = normalizarDatos(datos);
  
  // Calcular días
  const diasValidacion = calcularDiasIncapacidad(datosLimpios.fechaInicio, datosLimpios.fechaFin);
  
  try {
    if (appState.modo === 'crear') {
      // Crear nuevo registro
      const nuevoRegistro = {
        ...datosLimpios,
        diasIncapacidad: diasValidacion.diasCalculados,
        estado: 'Activa',
        urlAdjunto: '/documentos/incapacidad-' + generarIdUnico() + '.pdf'
      };
      
      if (guardarIncapacidad(nuevoRegistro)) {
        mostrarNotificacion('✅ Incapacidad registrada correctamente', 'success');
        cargarListaIncapacidades();
        actualizarEstadisticas();
      } else {
        mostrarNotificacion('❌ Error al guardar la incapacidad', 'error');
      }
    } else {
      // Actualizar registro existente
      const datosActualizados = {
        ...datosLimpios,
        diasIncapacidad: diasValidacion.diasCalculados,
        estado: document.getElementById('selectEstado').value
      };
      
      if (actualizarIncapacidad(appState.currentId, datosActualizados)) {
        mostrarNotificacion('✏️ Incapacidad actualizada correctamente', 'success');
        cargarListaIncapacidades();
        actualizarEstadisticas();
      } else {
        mostrarNotificacion('❌ Error al actualizar la incapacidad', 'error');
      }
    }
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error inesperado', 'error');
  }
}

/**
 * Valida un campo individual en tiempo real
 */
function validarCampo(e) {
  const campo = e.target;
  const id = campo.id;
  const valor = campo.value;
  const errorEl = document.getElementById(`error-${id}`);
  const formGroup = campo.closest('.form-group');
  
  if (!errorEl || !formGroup) return;
  
  let mensaje = '';
  
  switch (id) {
    case 'inputNombre':
      if (!valor || valor.length < 3) {
        mensaje = 'El nombre debe tener al menos 3 caracteres';
      }
      break;
    
    case 'inputCedula':
      if (!validarFormatoCedula(valor)) {
        mensaje = 'Formato inválido. Use: XXX-XXXXXX-X';
      }
      break;
    
    case 'inputBoleta':
      const validBoleta = validarBoletaUnica(valor, appState.currentId);
      if (!validBoleta.valido) {
        mensaje = validBoleta.mensaje;
      }
      break;
    
    case 'inputFechaInicio':
    case 'inputFechaFin':
      const fechaInicio = document.getElementById('inputFechaInicio').value;
      const fechaFin = document.getElementById('inputFechaFin').value;
      if (fechaInicio && fechaFin) {
        const diasVal = calcularDiasIncapacidad(fechaInicio, fechaFin);
        if (!diasVal.valido) {
          mensaje = diasVal.mensaje;
        }
      }
      break;
    
    case 'inputArchivo':
      if (campo.files.length > 0) {
        const validArchivo = validarFormatoArchivo(campo.files[0]);
        if (!validArchivo.valido) {
          mensaje = validArchivo.mensaje;
        }
      }
      break;
  }
  
  if (mensaje) {
    errorEl.textContent = mensaje;
    formGroup.classList.add('has-error');
  } else {
    errorEl.textContent = '';
    formGroup.classList.remove('has-error');
  }
}

/**
 * Calcula automáticamente los días en el formulario
 */
function calcularDiasFormulario() {
  const fechaInicio = document.getElementById('inputFechaInicio').value;
  const fechaFin = document.getElementById('inputFechaFin').value;
  
  if (!fechaInicio || !fechaFin) return;
  
  const resultado = calcularDiasIncapacidad(fechaInicio, fechaFin);
  const inputDias = document.getElementById('inputDias');
  
  if (resultado.valido) {
    inputDias.value = resultado.diasCalculados;
    inputDias.style.color = 'var(--text-success)';
  } else {
    inputDias.value = '0';
    inputDias.style.color = 'var(--text-danger)';
  }
}

/**
 * Muestra errores en el formulario
 */
function mostrarErroresFormulario(errores) {
  // Limpiar errores previos
  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('.form-group').forEach(el => el.classList.remove('has-error'));
  
  // Mostrar nuevos errores
  errores.forEach(error => {
    mostrarNotificacion(`⚠️ ${error}`, 'warning');
  });
}

// ==========================================
// VISTA DE DETALLE
// ==========================================

/**
 * Muestra el detalle de una incapacidad
 */
function mostrarDetalle(id) {
  appState.currentView = 'detalle';
  appState.currentId = id;
  
  mostrarVista('vistaDetalle');
  
  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  const container = document.getElementById('detalleContainer');
  
  container.innerHTML = `
    <div class="detalle-header">
      <h2>${incapacidad.nombre}</h2>
      <button class="btn btn-secondary" onclick="cargarListaIncapacidades()">← Volver</button>
    </div>
    
    <div class="detalle-grid">
      <section class="detalle-section">
        <h3>📋 Información Personal</h3>
        <div class="detalle-item">
          <span class="label">Cédula:</span>
          <span class="value">${incapacidad.cedula}</span>
        </div>
        <div class="detalle-item">
          <span class="label">Departamento:</span>
          <span class="value">${incapacidad.departamento}</span>
        </div>
      </section>
      
      <section class="detalle-section">
        <h3>🏥 Información de la Incapacidad</h3>
        <div class="detalle-item">
          <span class="label">Tipo:</span>
          <span class="badge badge-${incapacidad.tipo.toLowerCase().replace(' ', '-')}">${incapacidad.tipo}</span>
        </div>
        <div class="detalle-item">
          <span class="label">Número de Boleta:</span>
          <span class="value">${incapacidad.numBoleta}</span>
        </div>
        <div class="detalle-item">
          <span class="label">Estado:</span>
          <span class="badge badge-estado-${incapacidad.estado.toLowerCase()}">${incapacidad.estado}</span>
        </div>
      </section>
      
      <section class="detalle-section">
        <h3>📅 Fechas</h3>
        <div class="detalle-item">
          <span class="label">Inicio:</span>
          <span class="value">${formatearFecha(incapacidad.fechaInicio)}</span>
        </div>
        <div class="detalle-item">
          <span class="label">Fin:</span>
          <span class="value">${formatearFecha(incapacidad.fechaFin)}</span>
        </div>
        <div class="detalle-item">
          <span class="label">Días totales:</span>
          <span class="value" style="font-weight: bold; color: var(--text-accent);">${incapacidad.diasIncapacidad} días</span>
        </div>
      </section>
      
      ${incapacidad.observaciones ? `
        <section class="detalle-section full-width">
          <h3>📝 Observaciones</h3>
          <div class="observaciones-box">${incapacidad.observaciones}</div>
        </section>
      ` : ''}
      
      <section class="detalle-section full-width">
        <h3>📌 Historial</h3>
        <div class="detalle-item">
          <span class="label">Registrado:</span>
          <span class="value">${formatearFechaCompleta(incapacidad.fechaRegistro)}</span>
        </div>
        ${incapacidad.fechaActualizacion ? `
          <div class="detalle-item">
            <span class="label">Última actualización:</span>
            <span class="value">${formatearFechaCompleta(incapacidad.fechaActualizacion)}</span>
          </div>
        ` : ''}
      </section>
    </div>
    
    <div class="detalle-acciones">
      <button class="btn btn-warning" onclick="editarIncapacidad('${id}')">✏️ Editar</button>
      ${incapacidad.estado === 'Activa' ? `
        <button class="btn btn-secondary" onclick="mostrarFormularioProrroga('${id}')">⏱️ Solicitar Prórroga</button>
      ` : ''}
      <button class="btn btn-danger" onclick="confirmarEliminar('${id}')">🗑️ Eliminar</button>
    </div>
  `;
}

// ==========================================
// VISTA DE PRÓRROGA
// ==========================================

/**
 * Muestra el formulario para solicitar prórroga
 */
function mostrarFormularioProrroga(id) {
  appState.currentView = 'prorroga';
  appState.currentId = id;
  
  mostrarVista('vistaProrroag');
  
  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  document.getElementById('prorrogaTitle').textContent = `Prórroga: ${incapacidad.nombre}`;
  document.getElementById('prorrogaNombreActual').textContent = incapacidad.nombre;
  document.getElementById('prorrogaFechaFinActual').value = incapacidad.fechaFin;
  document.getElementById('prorrogaFechaFinNueva').value = incapacidad.fechaFin;
  
  document.getElementById('btnGuardarProrroga').onclick = () => guardarProrroga(id);
}

/**
 * Guarda la prórroga de una incapacidad
 */
function guardarProrroga(id) {
  const fechaFinNueva = document.getElementById('prorrogaFechaFinNueva').value;
  const motivo = document.getElementById('prorrogaMotivo').value;
  
  if (!fechaFinNueva) {
    mostrarNotificacion('⚠️ Ingresa la nueva fecha de fin', 'warning');
    return;
  }
  
  if (!motivo) {
    mostrarNotificacion('⚠️ Ingresa el motivo de la prórroga', 'warning');
    return;
  }
  
  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  // Calcular nuevos días
  const diasVal = calcularDiasIncapacidad(incapacidad.fechaInicio, fechaFinNueva);
  
  if (!diasVal.valido) {
    mostrarNotificacion(`❌ ${diasVal.mensaje}`, 'error');
    return;
  }
  
  const datosActualizados = {
    fechaFin: fechaFinNueva,
    diasIncapacidad: diasVal.diasCalculados,
    estado: 'Prorroga',
    observaciones: `${incapacidad.observaciones || ''}\n[Prórroga]: ${motivo}`
  };
  
  if (actualizarIncapacidad(id, datosActualizados)) {
    mostrarNotificacion('✅ Prórroga solicitada correctamente', 'success');
    cargarListaIncapacidades();
    actualizarEstadisticas();
  } else {
    mostrarNotificacion('❌ Error al registrar prórroga', 'error');
  }
}

// ==========================================
// ACCIONES Y CONFIRMACIONES
// ==========================================

/**
 * Solicita confirmación y elimina un registro
 */
function confirmarEliminar(id) {
  // Verificar permiso
  if (!autenticacion.tienePermiso('eliminar')) {
    mostrarNotificacion('⛔ No tienes permiso para eliminar registros', 'error');
    return;
  }

  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  const modal = document.getElementById('modalConfirmacion');
  document.getElementById('confirmMensaje').textContent = 
    `¿Estás seguro que deseas eliminar la incapacidad de ${incapacidad.nombre}? Esta acción no se puede deshacer.`;
  
  document.getElementById('btnConfirmarEliminar').onclick = () => {
    if (eliminarIncapacidad(id)) {
      mostrarNotificacion('✅ Incapacidad eliminada correctamente', 'success');
      cerrarModal();
      cargarListaIncapacidades();
      actualizarEstadisticas();
      aplicarPermisos();
    } else {
      mostrarNotificacion('❌ Error al eliminar', 'error');
    }
  };
  
  document.getElementById('btnCancelarEliminar').onclick = cerrarModal;
  modal.style.display = 'block';
}

// ==========================================
// ESTADÍSTICAS
// ==========================================

/**
 * Actualiza las estadísticas mostradas en el dashboard
 */
function actualizarEstadisticas() {
  const stats = obtenerEstadisticas();
  
  document.getElementById('statTotal').textContent = stats.total;
  document.getElementById('statActivas').textContent = stats.activas;
  document.getElementById('statFinalizadas').textContent = stats.finalizadas;
  document.getElementById('statProrroga').textContent = stats.prorroga;
  document.getElementById('statDias').textContent = stats.diasTotales;
}

// ==========================================
// UTILIDADES DE UI
// ==========================================

/**
 * Muestra una vista y oculta las demás
 */
function mostrarVista(vistaId) {
  document.querySelectorAll('[id^="vista"]').forEach(vista => {
    vista.style.display = 'none';
  });
  const vista = document.getElementById(vistaId);
  if (vista) vista.style.display = 'block';
}

/**
 * Muestra una notificación temporal
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
  const container = document.getElementById('notificaciones') || crearContenedorNotificaciones();
  
  const notif = document.createElement('div');
  notif.className = `notificacion notificacion-${tipo}`;
  notif.textContent = mensaje;
  
  container.appendChild(notif);
  
  setTimeout(() => {
    notif.classList.add('saliendo');
    setTimeout(() => notif.remove(), 300);
  }, 4000);
}

/**
 * Crea el contenedor de notificaciones si no existe
 */
function crearContenedorNotificaciones() {
  const container = document.createElement('div');
  container.id = 'notificaciones';
  container.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    max-width: 400px;
  `;
  document.body.appendChild(container);
  return container;
}

/**
 * Cierra el modal de confirmación
 */
function cerrarModal() {
  document.getElementById('modalConfirmacion').style.display = 'none';
}

// ==========================================
// FUNCIONES DE FORMATO
// ==========================================

/**
 * Formatea una fecha en formato DD/MM/YYYY
 */
function formatearFecha(fecha) {
  if (!fecha) return 'Sin fecha';
  const d = new Date(fecha);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/**
 * Formatea una fecha ISO en formato completo
 */
function formatearFechaCompleta(fecha) {
  if (!fecha) return 'Sin fecha';
  const d = new Date(fecha);
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return d.toLocaleDateString('es-CR', opciones);
}

/**
 * Exportar para uso externo
 */
window.app = {
  mostrarFormulario,
  editarIncapacidad,
  cancelarFormulario,
  guardarRegistro,
  cargarListaIncapacidades,
  mostrarDetalle,
  confirmarEliminar,
  mostrarFormularioProrroga,
  guardarProrroga,
  aplicarFiltros,
  limpiarFiltros
};
