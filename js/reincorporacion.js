/**
 * MÓDULO DE REINCORPORACIÓN
 * feature/reincorporacion
 *
 * Permite:
 * - Registrar la reincorporación de un trabajador
 * - Marcar la incapacidad como Finalizada
 * - Guardar fecha real de reincorporación y observaciones
 * - Ver historial de reincorporaciones
 */

const Reincorporacion = (function () {

  let incapacidadActual = null;

  /**
   * Inicializa el módulo
   */
  function inicializar() {
    console.log('🔄 Módulo de Reincorporación inicializado');
  }

  /**
   * Abre la vista de reincorporación de una incapacidad
   * @param {string} id
   */
  function abrirReincorporacion(id) {
    const incapacidad = obtenerIncapacidadPorId(id);

    if (!incapacidad) {
      mostrarNotificacion('❌ No se encontró la incapacidad', 'error');
      return;
    }

    // Solo se puede reincorporar si no está finalizada
    if (incapacidad.estado === 'Finalizada') {
      mostrarNotificacion('ℹ️ Esta incapacidad ya está finalizada', 'info');
      return;
    }

    incapacidadActual = incapacidad;
    renderizarVistaReincorporacion(incapacidad);
    mostrarVista('vistaReincorporacion');
  }

  /**
   * Renderiza la interfaz de reincorporación
   */
  function renderizarVistaReincorporacion(incapacidad) {
    const container = document.getElementById('reincorporacionContainer');
    if (!container) return;

    const hoy = new Date().toISOString().split('T')[0];

    container.innerHTML = `
      <div class="reincorporacion-header">
        <div>
          <h2>🔄 Reincorporación de Trabajador</h2>
          <p class="subtitulo">${incapacidad.nombre} · ${incapacidad.cedula}</p>
        </div>
        <button class="btn btn-secondary" onclick="cargarListaIncapacidades()">
          ← Volver a la lista
        </button>
      </div>

      <!-- Información de la incapacidad -->
      <div class="card-info">
        <div class="info-grid">
          <div>
            <label>Departamento</label>
            <p>${incapacidad.departamento}</p>
          </div>
          <div>
            <label>Tipo de incapacidad</label>
            <p>${incapacidad.tipo}</p>
          </div>
          <div>
            <label>Estado actual</label>
            <p><span class="badge badge-estado-${incapacidad.estado.toLowerCase().replace(' ', '-')}">${incapacidad.estado}</span></p>
          </div>
          <div>
            <label>Días de incapacidad</label>
            <p><strong>${incapacidad.diasIncapacidad}</strong> días</p>
          </div>
          <div>
            <label>Fecha de inicio</label>
            <p>${formatearFecha(incapacidad.fechaInicio)}</p>
          </div>
          <div>
            <label>Fecha de fin programada</label>
            <p>${formatearFecha(incapacidad.fechaFin)}</p>
          </div>
        </div>
      </div>

      <!-- Formulario de reincorporación -->
      <div class="card-form">
        <h3>📋 Registrar reincorporación</h3>

        <div class="form-row">
          <div class="form-group">
            <label for="fechaReincorporacion">Fecha real de reincorporación *</label>
            <input type="date" id="fechaReincorporacion" class="input-text" value="${hoy}" required>
          </div>
          <div class="form-group">
            <label for="tipoReincorporacion">Tipo de reincorporación</label>
            <select id="tipoReincorporacion" class="input-select">
              <option value="Normal">Normal (sin restricciones)</option>
              <option value="Con restricciones">Con restricciones / labores ligeras</option>
              <option value="Parcial">Reincorporación parcial</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="observacionesReincorporacion">Observaciones / Comentarios</label>
          <textarea id="observacionesReincorporacion" class="input-text" rows="4"
            placeholder="Ej: Trabajador se reincorpora sin restricciones. Se recomienda seguimiento médico..."></textarea>
        </div>

        <div class="form-group">
          <label>
            <input type="checkbox" id="confirmarReincorporacion">
            Confirmo que el trabajador se reincorpora a sus labores
          </label>
        </div>

        <div class="form-acciones">
          <button class="btn btn-primary btn-lg" onclick="Reincorporacion.guardarReincorporacion()">
            <i class="ti ti-check"></i> Confirmar Reincorporación
          </button>
          <button class="btn btn-secondary btn-lg" onclick="cargarListaIncapacidades()">
            Cancelar
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Guarda la reincorporación
   */
  function guardarReincorporacion() {
    if (!incapacidadActual) return;

    const fechaReinc = document.getElementById('fechaReincorporacion').value;
    const tipo = document.getElementById('tipoReincorporacion').value;
    const observaciones = document.getElementById('observacionesReincorporacion').value.trim();
    const confirmado = document.getElementById('confirmarReincorporacion').checked;

    // Validaciones
    if (!fechaReinc) {
      mostrarNotificacion('⚠️ Debes indicar la fecha de reincorporación', 'error');
      return;
    }

    if (!confirmado) {
      mostrarNotificacion('⚠️ Debes confirmar la reincorporación', 'error');
      return;
    }

    // Validar que la fecha no sea anterior al inicio
    if (fechaReinc < incapacidadActual.fechaInicio) {
      mostrarNotificacion('⚠️ La fecha de reincorporación no puede ser anterior a la fecha de inicio', 'error');
      return;
    }

    const usuario = autenticacion.obtenerUsuarioActual();
    const nombreUsuario = usuario ? usuario.nombre : 'Sistema';

    // Datos a actualizar
    const datosActualizacion = {
      estado: 'Finalizada',
      fechaReincorporacion: fechaReinc,
      tipoReincorporacion: tipo,
      observacionesReincorporacion: observaciones,
      reincorporadoPor: nombreUsuario,
      fechaRegistroReincorporacion: new Date().toISOString(),
      ultimaActualizacion: new Date().toISOString()
    };

    // Agregar al historial de seguimiento también
    const historial = incapacidadActual.historialSeguimiento || [];
    historial.push({
      fecha: fechaReinc,
      hora: new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' }),
      estado: 'Finalizada',
      nota: `Reincorporación registrada (${tipo}). ${observaciones || 'Sin observaciones adicionales.'}`,
      usuario: nombreUsuario,
      fechaRegistro: new Date().toISOString()
    });
    datosActualizacion.historialSeguimiento = historial;

    const actualizado = actualizarIncapacidad(incapacidadActual.id, datosActualizacion);

    if (actualizado) {
      mostrarNotificacion('✅ Reincorporación registrada correctamente', 'success');
      
      // Volver a la lista después de un momento
      setTimeout(() => {
        cargarListaIncapacidades();
        if (typeof actualizarEstadisticas === 'function') {
          actualizarEstadisticas();
        }
      }, 1000);
    } else {
      mostrarNotificacion('❌ Error al registrar la reincorporación', 'error');
    }
  }

  /**
   * Verifica si una incapacidad ya fue reincorporada
   */
  function estaReincorporada(id) {
    const incapacidad = obtenerIncapacidadPorId(id);
    return incapacidad && incapacidad.estado === 'Finalizada' && incapacidad.fechaReincorporacion;
  }

  // API pública
  return {
    inicializar,
    abrirReincorporacion,
    guardarReincorporacion,
    estaReincorporada
  };

})();

window.Reincorporacion = Reincorporacion;