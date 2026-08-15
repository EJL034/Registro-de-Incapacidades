/**
 * MÓDULO DE COMPROBANTES
 * feature/comprobantes
 *
 * Permite:
 * - Generar comprobante de incapacidad (HTML imprimible)
 * - Descargar comprobante en PDF (usando window.print)
 * - Ver comprobante de reincorporación
 * - Generar comprobante simple de seguimiento
 */

const Comprobantes = (function () {

  /**
   * Inicializa el módulo
   */
  function inicializar() {
    console.log('📄 Módulo de Comprobantes inicializado');
  }

  /**
   * Genera y muestra el comprobante de una incapacidad
   * @param {string} id - ID de la incapacidad
   */
  function generarComprobanteIncapacidad(id) {
    const incapacidad = obtenerIncapacidadPorId(id);

    if (!incapacidad) {
      mostrarNotificacion('❌ No se encontró la incapacidad', 'error');
      return;
    }

    const usuario = autenticacion.obtenerUsuarioActual();
    const generadoPor = usuario ? usuario.nombre : 'Sistema';
    const fechaGeneracion = new Date().toLocaleString('es-CR');

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Comprobante de Incapacidad - ${incapacidad.numBoleta || incapacidad.id}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 40px;
            color: #2c3e50;
            background: #fff;
          }
          .comprobante {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #667eea;
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 25px 30px;
            text-align: center;
          }
          .header h1 { font-size: 1.6rem; margin-bottom: 6px; }
          .header p { opacity: 0.9; font-size: 0.95rem; }
          .contenido { padding: 30px; }
          .seccion { margin-bottom: 25px; }
          .seccion h3 {
            font-size: 1rem;
            color: #667eea;
            border-bottom: 2px solid #eee;
            padding-bottom: 8px;
            margin-bottom: 15px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
          }
          .campo label {
            display: block;
            font-size: 0.8rem;
            color: #7f8c8d;
            margin-bottom: 3px;
          }
          .campo p {
            font-size: 1rem;
            font-weight: 500;
          }
          .estado {
            display: inline-block;
            padding: 5px 14px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.9rem;
          }
          .estado-activa { background: #d4edda; color: #155724; }
          .estado-finalizada { background: #cce5ff; color: #004085; }
          .estado-prorroga { background: #fff3cd; color: #856404; }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px dashed #ddd;
            font-size: 0.85rem;
            color: #7f8c8d;
            display: flex;
            justify-content: space-between;
          }
          .acciones {
            text-align: center;
            margin-top: 30px;
          }
          .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            margin: 0 8px;
          }
          .btn-imprimir {
            background: #667eea;
            color: white;
          }
          .btn-cerrar {
            background: #e0e0e0;
            color: #333;
          }
          @media print {
            .acciones { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="comprobante">
          <div class="header">
            <h1>🏥 Comprobante de Incapacidad</h1>
            <p>Sistema de Gestión de Incapacidades</p>
          </div>

          <div class="contenido">
            <div class="seccion">
              <h3>Datos del Trabajador</h3>
              <div class="grid">
                <div class="campo">
                  <label>Nombre completo</label>
                  <p>${incapacidad.nombre}</p>
                </div>
                <div class="campo">
                  <label>Cédula</label>
                  <p>${incapacidad.cedula}</p>
                </div>
                <div class="campo">
                  <label>Departamento</label>
                  <p>${incapacidad.departamento}</p>
                </div>
                <div class="campo">
                  <label>Número de boleta</label>
                  <p>${incapacidad.numBoleta || '—'}</p>
                </div>
              </div>
            </div>

            <div class="seccion">
              <h3>Datos de la Incapacidad</h3>
              <div class="grid">
                <div class="campo">
                  <label>Tipo</label>
                  <p>${incapacidad.tipo}</p>
                </div>
                <div class="campo">
                  <label>Estado</label>
                  <p><span class="estado estado-${incapacidad.estado.toLowerCase().replace(' ', '-')}">${incapacidad.estado}</span></p>
                </div>
                <div class="campo">
                  <label>Fecha de inicio</label>
                  <p>${formatearFecha(incapacidad.fechaInicio)}</p>
                </div>
                <div class="campo">
                  <label>Fecha de fin</label>
                  <p>${formatearFecha(incapacidad.fechaFin)}</p>
                </div>
                <div class="campo">
                  <label>Días de incapacidad</label>
                  <p><strong>${incapacidad.diasIncapacidad}</strong> días</p>
                </div>
                ${incapacidad.fechaReincorporacion ? `
                <div class="campo">
                  <label>Fecha de reincorporación</label>
                  <p>${formatearFecha(incapacidad.fechaReincorporacion)}</p>
                </div>
                ` : ''}
              </div>
            </div>

            ${incapacidad.observaciones ? `
            <div class="seccion">
              <h3>Observaciones</h3>
              <p>${incapacidad.observaciones}</p>
            </div>
            ` : ''}

            <div class="footer">
              <div>
                <strong>Generado por:</strong> ${generadoPor}<br>
                <strong>Fecha:</strong> ${fechaGeneracion}
              </div>
              <div style="text-align: right;">
                <strong>ID:</strong> ${incapacidad.id}
              </div>
            </div>
          </div>
        </div>

        <div class="acciones">
          <button class="btn btn-imprimir" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
          <button class="btn btn-cerrar" onclick="window.close()">Cerrar</button>
        </div>
      </body>
      </html>
    `;

    // Abrir en nueva ventana
    const ventana = window.open('', '_blank', 'width=900,height=700');
    ventana.document.write(html);
    ventana.document.close();
  }

  /**
   * Genera comprobante de reincorporación
   */
  function generarComprobanteReincorporacion(id) {
    const incapacidad = obtenerIncapacidadPorId(id);

    if (!incapacidad) {
      mostrarNotificacion('❌ No se encontró la incapacidad', 'error');
      return;
    }

    if (!incapacidad.fechaReincorporacion) {
      mostrarNotificacion('⚠️ Esta incapacidad aún no tiene reincorporación registrada', 'error');
      return;
    }

    // Reutilizamos la misma función (ya incluye fecha de reincorporación)
    generarComprobanteIncapacidad(id);
  }

  /**
   * Muestra opciones de comprobante en un modal
   */
  function mostrarOpcionesComprobante(id) {
    const incapacidad = obtenerIncapacidadPorId(id);
    if (!incapacidad) return;

    const modal = document.getElementById('modalConfirmacion');
    if (!modal) {
      // Si no hay modal, generar directamente
      generarComprobanteIncapacidad(id);
      return;
    }

    document.querySelector('.modal-content').innerHTML = `
      <div class="modal-header">
        <h3>📄 Generar Comprobante</h3>
      </div>
      <div class="modal-body">
        <p style="margin-bottom: 20px; color: #555;">
          Trabajador: <strong>${incapacidad.nombre}</strong>
        </p>
        <div style="display: grid; gap: 10px;">
          <button class="btn btn-primary" onclick="Comprobantes.generarComprobanteIncapacidad('${id}'); cerrarModal();">
            📄 Comprobante de Incapacidad
          </button>
          ${incapacidad.fechaReincorporacion ? `
            <button class="btn btn-primary" onclick="Comprobantes.generarComprobanteReincorporacion('${id}'); cerrarModal();">
              🔄 Comprobante de Reincorporación
            </button>
          ` : ''}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="cerrarModal()">Cancelar</button>
      </div>
    `;

    modal.style.display = 'block';
  }

  // API pública
  return {
    inicializar,
    generarComprobanteIncapacidad,
    generarComprobanteReincorporacion,
    mostrarOpcionesComprobante
  };

})();

window.Comprobantes = Comprobantes;