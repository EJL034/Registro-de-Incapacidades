/**
 * MÓDULO DE SEGUIMIENTO DE INCAPACIDADES
 * feature/seguimiento-incapacidades
 * 
 * Permite:
 * - Ver el estado actual de las incapacidades
 * - Registrar notas de seguimiento
 * - Cambiar estado (Activa → En seguimiento → Finalizada)
 * - Ver historial de seguimiento de cada registro
 */

const Seguimiento = (function () {

  // ========================
  // ESTADO INTERNO
  // ========================
  let incapacidadActual = null;

  // ========================
  // FUNCIONES PRINCIPALES
  // ========================

  /**
   * Inicializa el módulo de seguimiento
   */
  function inicializar() {
    console.log('📌 Módulo de Seguimiento inicializado');
  }

  /**
   * Abre la vista de seguimiento de una incapacidad
   * @param {string} id - ID de la incapacidad
   */
  function abrirSeguimiento(id) {
    const incapacidad = obtenerIncapacidadPorId(id);

    if (!incapacidad) {
      mostrarNotificacion('❌ No se encontró la incapacidad', 'error');
      return;
    }

    incapacidadActual = incapacidad;
    renderizarVistaSeguimiento(incapacidad);
    mostrarVista('vistaSeguimiento');
  }

  /**
   * Renderiza la interfaz de seguimiento
   */
  function renderizarVistaSeguimiento(incapacidad) {
    const container = document.getElementById('seguimientoContainer');
    if (!container) return;

    const historial = incapacidad.historialSeguimiento || [];

    container.innerHTML = `
      <div class="seguimiento-header">
        <div>
          <h2>📌 Seguimiento de Incapacidad</h2>
          <p class="subtitulo">${incapacidad.nombre} · ${incapacidad.cedula}</p>
        </div>
        <button class="btn btn-secondary" onclick="cargarListaIncapacidades()">
          ← Volver a la lista
        </button>
      </div>

      <!-- Información principal -->
      <div class="card-info">
        <div class="info-grid">
          <div>
            <label>Departamento</label>
            <p>${incapacidad.departamento}</p>
          </div>
          <div>
            <label>Tipo</label>
            <p>${incapacidad.tipo}</p>
          </div>
          <div>
            <label>Estado actual</label>
            <p><span class="badge badge-estado-${incapacidad.estado.toLowerCase()}">${incapacidad.estado}</span></p>
          </div>
          <div>
            <label>Días de incapacidad</label>
            <p><strong>${incapacidad.diasIncapacidad}</strong> días</p>
          </div>
          <div>
            <label>Fecha inicio</label>
            <p>${formatearFecha(incapacidad.fechaInicio)}</p>
          </div>
          <div>
            <label>Fecha fin</label>
            <p>${formatearFecha(incapacidad.fechaFin)}</p>
          </div>
        </div>
      </div>

      <!-- Formulario de nueva nota de seguimiento -->
      <div class="card-form">
        <h3>➕ Registrar seguimiento</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="seguimientoEstado">Nuevo estado</label>
            <select id="seguimientoEstado" class="input-select">
              <option value="Activa" ${incapacidad.estado === 'Activa' ? 'selected' : ''}>Activa</option>
              <option value="En seguimiento" ${incapacidad.estado === 'En seguimiento' ? 'selected' : ''}>En seguimiento</option>
              <option value="Prorroga" ${incapacidad.estado === 'Prorroga' ? 'selected' : ''}>Prórroga</option>
              <option value="Finalizada" ${incapacidad.estado === 'Finalizada' ? 'selected' : ''}>Finalizada</option>
            </select>
          </div>
          <div class="form-group">
            <label for="seguimientoFecha">Fecha de seguimiento</label>
            <input type="date" id="seguimientoFecha" class="input-text" value="${new Date().toISOString().split('T')[0]}">
          </div>
        </div>

        <div class="form-group">
          <label for="seguimientoNota">Nota / Observación *</label>
          <textarea id="seguimientoNota" class="input-text" rows="4" 
            placeholder="Ej: Se contactó al trabajador, presenta mejoría, se solicita evaluación médica..."></textarea>
        </div>

        <div class="form-acciones">
          <button class="btn btn-primary" onclick="Seguimiento.guardarSeguimiento()">
            <i class="ti ti-device-floppy"></i> Guardar seguimiento
          </button>
        </div>
      </div>

      <!-- Historial de seguimiento -->
      <div class="card-historial">
        <h3>📜 Historial de seguimiento</h3>
        ${historial.length === 0 
          ? `<p class="texto-vacio">Aún no hay registros de seguimiento</p>`
          : `
            <div class="timeline">
              ${historial.slice().reverse().map(item => `
                <div class="timeline-item">
                  <div class="timeline-fecha">${formatearFecha(item.fecha)} · ${item.hora || ''}</div>
                  <div class="timeline-estado">
                    <span class="badge badge-estado-${(item.estado || '').toLowerCase().replace(' ', '-')}">
                      ${item.estado}
                    </span>
                  </div>
                  <div class="timeline-nota">${item.nota}</div>
                  <div class="timeline-usuario">Registrado por: ${item.usuario || 'Sistema'}</div>
                </div>
              `).join('')}
            </div>
          `
        }
      </div>
    `;
  }

  /**
   * Guarda una nueva nota de seguimiento
   */
  function guardarSeguimiento() {
    if (!incapacidadActual) return;

    const nota = document.getElementById('seguimientoNota').value.trim();
    const nuevoEstado = document.getElementById('seguimientoEstado').value;
    const fecha = document.getElementById('seguimientoFecha').value;

    if (!nota) {
      mostrarNotificacion('⚠️ Debes escribir una nota de seguimiento', 'error');
      return;
    }

    if (!fecha) {
      mostrarNotificacion('⚠️ Debes indicar la fecha', 'error');
      return;
    }

    // Obtener usuario actual
    const usuario = autenticacion.obtenerUsuarioActual();
    const nombreUsuario = usuario ? usuario.nombre : 'Sistema';

    // Crear registro de seguimiento
    const nuevoRegistro = {
      fecha: fecha,
      hora: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      estado: nuevoEstado,
      nota: nota,
      usuario: nombreUsuario,
      fechaRegistro: new Date().toISOString()
    };

    // Actualizar el historial
    const historialActual = incapacidadActual.historialSeguimiento || [];
    historialActual.push(nuevoRegistro);

    // Actualizar la incapacidad
    const actualizado = actualizarIncapacidad(incapacidadActual.id, {
      estado: nuevoEstado,
      historialSeguimiento: historialActual,
      ultimaActualizacion: new Date().toISOString()
    });

    if (actualizado) {
      mostrarNotificacion('✅ Seguimiento registrado correctamente', 'success');
      incapacidadActual = obtenerIncapacidadPorId(incapacidadActual.id);
      renderizarVistaSeguimiento(incapacidadActual);

      // Actualizar lista y estadísticas si existen
      if (typeof cargarListaIncapacidades === 'function') {
        // No recargamos la vista actual
      }
      if (typeof actualizarEstadisticas === 'function') {
        actualizarEstadisticas();
      }
    } else {
      mostrarNotificacion('❌ Error al guardar el seguimiento', 'error');
    }
  }

  /**
   * Obtiene el historial de una incapacidad
   */
  function obtenerHistorial(id) {
    const incapacidad = obtenerIncapacidadPorId(id);
    return incapacidad ? (incapacidad.historialSeguimiento || []) : [];
  }

  // ========================
  // API PÚBLICA
  // ========================
  return {
    inicializar,
    abrirSeguimiento,
    guardarSeguimiento,
    obtenerHistorial
  };

})();

// Exportar globalmente
window.Seguimiento = Seguimiento;