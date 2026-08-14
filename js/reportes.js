/**
 * MÓDULO DE REPORTES Y EXPORTACIÓN
 * Genera reportes en PDF, Excel y otros formatos
 */

/**
 * Exporta los datos a formato JSON y descarga
 */
function exportarJSON() {
  try {
    const incapacidades = obtenerIncapacidades();
    const datos = {
      fecha_exportacion: new Date().toISOString(),
      total_registros: incapacidades.length,
      registros: incapacidades
    };
    
    const contenido = JSON.stringify(datos, null, 2);
    descargarArchivo(contenido, 'incapacidades-' + generarTimestamp() + '.json', 'application/json');
    
    mostrarNotificacion('✅ Archivo JSON exportado correctamente', 'success');
  } catch (error) {
    console.error('Error al exportar JSON:', error);
    mostrarNotificacion('❌ Error al exportar JSON', 'error');
  }
}

/**
 * Exporta los datos a formato CSV (Excel compatible)
 */
function exportarCSV() {
  try {
    const incapacidades = obtenerIncapacidades();
    
    // Encabezados
    const encabezados = [
      'ID',
      'Nombre',
      'Cédula',
      'Departamento',
      'Tipo',
      'Boleta',
      'Fecha Inicio',
      'Fecha Fin',
      'Días',
      'Estado',
      'Observaciones',
      'Fecha Registro'
    ];
    
    // Convertir a CSV
    let csv = encabezados.join(',') + '\n';
    
    incapacidades.forEach(inc => {
      const fila = [
        inc.id,
        `"${inc.nombre}"`,
        inc.cedula,
        `"${inc.departamento}"`,
        `"${inc.tipo}"`,
        inc.numBoleta,
        inc.fechaInicio,
        inc.fechaFin,
        inc.diasIncapacidad,
        inc.estado,
        `"${(inc.observaciones || '').replace(/"/g, '""')}"`,
        formatearFechaCompleta(inc.fechaRegistro)
      ];
      csv += fila.join(',') + '\n';
    });
    
    descargarArchivo(csv, 'incapacidades-' + generarTimestamp() + '.csv', 'text/csv;charset=utf-8;');
    
    mostrarNotificacion('✅ Archivo CSV exportado correctamente', 'success');
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    mostrarNotificacion('❌ Error al exportar CSV', 'error');
  }
}

/**
 * Genera un reporte en formato HTML (imprimible)
 */
function generarReportHTML() {
  try {
    const incapacidades = obtenerIncapacidades();
    const stats = obtenerEstadisticas();
    const ahora = new Date().toLocaleDateString('es-CR');
    
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Incapacidades</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 1000px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #667eea; padding-bottom: 20px; }
          .header h1 { color: #667eea; font-size: 28px; margin-bottom: 10px; }
          .header p { color: #666; }
          .stats { display: grid; grid-template-columns: repeat(5, 1fr); gap: 15px; margin-bottom: 40px; }
          .stat-box { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border-left: 4px solid #667eea; }
          .stat-box .number { font-size: 24px; font-weight: bold; color: #667eea; }
          .stat-box .label { font-size: 12px; color: #666; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          table thead { background: #f8f9fa; }
          table th { padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #667eea; }
          table td { padding: 10px 12px; border-bottom: 1px solid #ddd; }
          table tbody tr:nth-child(even) { background: #f9f9f9; }
          .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold; }
          .badge-activa { background: #e8f5e9; color: #2e7d32; }
          .badge-finalizada { background: #f5f5f5; color: #616161; }
          .badge-prorroga { background: #fff3e0; color: #e65100; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px; }
          .no-print { display: none; }
          @media print {
            body { margin: 0; padding: 0; }
            .container { max-width: 100%; }
            .btn { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏥 Reporte de Incapacidades</h1>
            <p>Generado el ${ahora}</p>
          </div>
          
          <div class="stats">
            <div class="stat-box">
              <div class="number">${stats.total}</div>
              <div class="label">Total</div>
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
              <div class="label">Prórrogas</div>
            </div>
            <div class="stat-box">
              <div class="number">${stats.diasTotales}</div>
              <div class="label">Días</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Departamento</th>
                <th>Tipo</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Días</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${incapacidades.map(inc => `
                <tr>
                  <td>${inc.nombre}</td>
                  <td>${inc.cedula}</td>
                  <td>${inc.departamento}</td>
                  <td>${inc.tipo}</td>
                  <td>${formatearFecha(inc.fechaInicio)}</td>
                  <td>${formatearFecha(inc.fechaFin)}</td>
                  <td>${inc.diasIncapacidad}</td>
                  <td><span class="badge badge-${inc.estado.toLowerCase().replace(' ', '-')}">${inc.estado}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>© 2026 Sistema de Gestión de Incapacidades | Reporte confidencial</p>
          </div>
        </div>
        
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => window.print(), 500);
          });
        </script>
      </body>
      </html>
    `;
    
    // Abrir en nueva pestaña
    const ventana = window.open('', '_blank');
    ventana.document.write(html);
    ventana.document.close();
    
  } catch (error) {
    console.error('Error al generar reporte:', error);
    mostrarNotificacion('❌ Error al generar reporte', 'error');
  }
}

/**
 * Genera reporte detallado de un trabajador
 */
function generarReporteDetalleTrabajador(cedula) {
  try {
    const incapacidades = obtenerIncapacidades();
    const registros = incapacidades.filter(inc => inc.cedula === cedula);
    
    if (registros.length === 0) {
      mostrarNotificacion('⚠️ No se encontraron registros para esta cédula', 'warning');
      return;
    }
    
    const trabajador = registros[0];
    const diasTotales = registros.reduce((sum, inc) => sum + inc.diasIncapacidad, 0);
    
    let html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte Individual - ${trabajador.nombre}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
          .container { max-width: 900px; margin: 40px auto; padding: 40px; background: white; border-radius: 8px; }
          .header { margin-bottom: 30px; }
          .header h1 { color: #667eea; margin-bottom: 10px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 30px; background: #f8f9fa; padding: 20px; border-radius: 8px; }
          .info-item { }
          .info-label { font-weight: bold; color: #667eea; font-size: 12px; }
          .info-value { font-size: 16px; margin-top: 5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 30px; }
          table th { background: #667eea; color: white; padding: 12px; text-align: left; }
          table td { padding: 10px 12px; border-bottom: 1px solid #ddd; }
          table tbody tr:nth-child(even) { background: #f9f9f9; }
          .resumen { background: #e8f5e9; padding: 20px; border-radius: 8px; margin-top: 30px; }
          .resumen-item { display: flex; justify-content: space-between; margin: 10px 0; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 Reporte Individual de Incapacidades</h1>
            <p>Generado: ${new Date().toLocaleDateString('es-CR')}</p>
          </div>
          
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Nombre Completo</div>
              <div class="info-value">${trabajador.nombre}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Cédula</div>
              <div class="info-value">${trabajador.cedula}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Departamento</div>
              <div class="info-value">${trabajador.departamento}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Total de Incapacidades</div>
              <div class="info-value">${registros.length}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Boleta</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Días</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${registros.map(inc => `
                <tr>
                  <td>${inc.tipo}</td>
                  <td>${inc.numBoleta}</td>
                  <td>${formatearFecha(inc.fechaInicio)}</td>
                  <td>${formatearFecha(inc.fechaFin)}</td>
                  <td><strong>${inc.diasIncapacidad}</strong></td>
                  <td>${inc.estado}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="resumen">
            <h3 style="color: #2e7d32; margin-bottom: 15px;">📊 Resumen</h3>
            <div class="resumen-item">
              <span>Total de Incapacidades:</span>
              <strong>${registros.length}</strong>
            </div>
            <div class="resumen-item">
              <span>Días Totales Acumulados:</span>
              <strong>${diasTotales}</strong>
            </div>
            <div class="resumen-item">
              <span>Promedio de Días por Incapacidad:</span>
              <strong>${(diasTotales / registros.length).toFixed(1)}</strong>
            </div>
          </div>
        </div>
        
        <script>
          window.addEventListener('load', () => {
            setTimeout(() => window.print(), 500);
          });
        </script>
      </body>
      </html>
    `;
    
    const ventana = window.open('', '_blank');
    ventana.document.write(html);
    ventana.document.close();
    
  } catch (error) {
    console.error('Error al generar reporte detallado:', error);
    mostrarNotificacion('❌ Error al generar reporte', 'error');
  }
}

/**
 * Exporta datos filtrados por período
 */
function exportarPorPeriodo(fechaInicio, fechaFin) {
  try {
    const incapacidades = obtenerIncapacidades();
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    
    const filtrados = incapacidades.filter(inc => {
      const fechaReg = new Date(inc.fechaRegistro);
      return fechaReg >= inicio && fechaReg <= fin;
    });
    
    if (filtrados.length === 0) {
      mostrarNotificacion('⚠️ No hay registros en el período seleccionado', 'warning');
      return;
    }
    
    const datos = {
      periodo: `${formatearFecha(fechaInicio)} - ${formatearFecha(fechaFin)}`,
      total_registros: filtrados.length,
      fecha_exportacion: new Date().toISOString(),
      registros: filtrados
    };
    
    const csv = convertirACSV(filtrados);
    descargarArchivo(csv, `incapacidades-${generarTimestamp()}.csv`, 'text/csv');
    
    mostrarNotificacion(`✅ ${filtrados.length} registros exportados`, 'success');
  } catch (error) {
    console.error('Error:', error);
    mostrarNotificacion('❌ Error al exportar', 'error');
  }
}

/**
 * Convierte datos a formato CSV
 */
function convertirACSV(incapacidades) {
  const encabezados = ['ID', 'Nombre', 'Cédula', 'Departamento', 'Tipo', 'Boleta', 'Inicio', 'Fin', 'Días', 'Estado'];
  let csv = encabezados.join(',') + '\n';
  
  incapacidades.forEach(inc => {
    const fila = [
      inc.id,
      `"${inc.nombre}"`,
      inc.cedula,
      `"${inc.departamento}"`,
      `"${inc.tipo}"`,
      inc.numBoleta,
      inc.fechaInicio,
      inc.fechaFin,
      inc.diasIncapacidad,
      inc.estado
    ];
    csv += fila.join(',') + '\n';
  });
  
  return csv;
}

/**
 * Descarga un archivo
 */
function descargarArchivo(contenido, nombre, tipo) {
  const elemento = document.createElement('a');
  const blob = new Blob([contenido], { type: tipo });
  elemento.href = URL.createObjectURL(blob);
  elemento.download = nombre;
  document.body.appendChild(elemento);
  elemento.click();
  document.body.removeChild(elemento);
  URL.revokeObjectURL(elemento.href);
}

/**
 * Genera un timestamp para nombres de archivo
 */
function generarTimestamp() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, '0');
  const dia = String(ahora.getDate()).padStart(2, '0');
  const hora = String(ahora.getHours()).padStart(2, '0');
  const minuto = String(ahora.getMinutes()).padStart(2, '0');
  
  return `${anio}${mes}${dia}-${hora}${minuto}`;
}

/**
 * Genera estadísticas por departamento
 */
function obtenerEstadisticasPorDepartamento() {
  const incapacidades = obtenerIncapacidades();
  const estadisticas = {};
  
  incapacidades.forEach(inc => {
    if (!estadisticas[inc.departamento]) {
      estadisticas[inc.departamento] = {
        total: 0,
        dias: 0,
        activas: 0,
        finalizadas: 0
      };
    }
    
    estadisticas[inc.departamento].total++;
    estadisticas[inc.departamento].dias += inc.diasIncapacidad;
    
    if (inc.estado === 'Activa') {
      estadisticas[inc.departamento].activas++;
    } else if (inc.estado === 'Finalizada') {
      estadisticas[inc.departamento].finalizadas++;
    }
  });
  
  return estadisticas;
}

/**
 * Genera estadísticas por tipo de incapacidad
 */
function obtenerEstadisticasPorTipo() {
  const incapacidades = obtenerIncapacidades();
  const estadisticas = {};
  
  incapacidades.forEach(inc => {
    if (!estadisticas[inc.tipo]) {
      estadisticas[inc.tipo] = {
        total: 0,
        dias: 0,
        casos: []
      };
    }
    
    estadisticas[inc.tipo].total++;
    estadisticas[inc.tipo].dias += inc.diasIncapacidad;
    estadisticas[inc.tipo].casos.push({
      nombre: inc.nombre,
      dias: inc.diasIncapacidad
    });
  });
  
  return estadisticas;
}

/**
 * Imprime un registro específico
 */
function imprimirDetalle(id) {
  const incapacidad = obtenerIncapacidadPorId(id);
  if (!incapacidad) return;
  
  let html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>${incapacidad.nombre}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { border-bottom: 2px solid #667eea; padding-bottom: 20px; margin-bottom: 30px; }
        .section { margin-bottom: 30px; }
        .section-title { color: #667eea; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #667eea; padding-left: 10px; }
        .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .label { font-weight: bold; color: #333; }
        .value { color: #666; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${incapacidad.nombre}</h1>
        <p>Reporte de Incapacidad - Generado: ${new Date().toLocaleDateString('es-CR')}</p>
      </div>
      
      <div class="section">
        <div class="section-title">👤 Datos Personales</div>
        <div class="item">
          <span class="label">Cédula:</span>
          <span class="value">${incapacidad.cedula}</span>
        </div>
        <div class="item">
          <span class="label">Departamento:</span>
          <span class="value">${incapacidad.departamento}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">🏥 Información de Incapacidad</div>
        <div class="item">
          <span class="label">Tipo:</span>
          <span class="value">${incapacidad.tipo}</span>
        </div>
        <div class="item">
          <span class="label">Número de Boleta:</span>
          <span class="value">${incapacidad.numBoleta}</span>
        </div>
        <div class="item">
          <span class="label">Estado:</span>
          <span class="value">${incapacidad.estado}</span>
        </div>
      </div>
      
      <div class="section">
        <div class="section-title">📅 Fechas</div>
        <div class="item">
          <span class="label">Inicio:</span>
          <span class="value">${formatearFecha(incapacidad.fechaInicio)}</span>
        </div>
        <div class="item">
          <span class="label">Fin:</span>
          <span class="value">${formatearFecha(incapacidad.fechaFin)}</span>
        </div>
        <div class="item">
          <span class="label">Días Totales:</span>
          <span class="value"><strong>${incapacidad.diasIncapacidad}</strong></span>
        </div>
      </div>
      
      ${incapacidad.observaciones ? `
        <div class="section">
          <div class="section-title">📝 Observaciones</div>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
            ${incapacidad.observaciones}
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
  
  const ventana = window.open('', '_blank');
  ventana.document.write(html);
  ventana.document.close();
}

/**
 * Exportar para uso externo
 */
window.reportes = {
  exportarJSON,
  exportarCSV,
  generarReportHTML,
  generarReporteDetalleTrabajador,
  exportarPorPeriodo,
  obtenerEstadisticasPorDepartamento,
  obtenerEstadisticasPorTipo,
  imprimirDetalle
};
