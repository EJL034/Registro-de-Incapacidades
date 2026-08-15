/**
 * MÓDULO DE DASHBOARD
 * feature/dashboard
 *
 * Mejora el dashboard existente con:
 * - Estadísticas más completas
 * - Gráficos simples (con CSS)
 * - Filtros rápidos por estado
 * - Resumen por departamento y tipo
 */

const Dashboard = (function () {

  /**
   * Inicializa el módulo de dashboard
   */
  function inicializar() {
    console.log('📊 Módulo de Dashboard inicializado');
    actualizarDashboard();
  }

  /**
   * Actualiza todas las estadísticas del dashboard
   */
  function actualizarDashboard() {
    const incapacidades = obtenerIncapacidades();

    // Contadores básicos
    const total = incapacidades.length;
    const activas = incapacidades.filter(i => i.estado === 'Activa').length;
    const finalizadas = incapacidades.filter(i => i.estado === 'Finalizada').length;
    const prorrogas = incapacidades.filter(i => i.estado === 'Prorroga' || i.estado === 'Prórroga').length;
    const enSeguimiento = incapacidades.filter(i => i.estado === 'En seguimiento').length;

    // Días acumulados
    const diasAcumulados = incapacidades.reduce((sum, i) => sum + (Number(i.diasIncapacidad) || 0), 0);

    // Actualizar elementos del DOM (si existen)
    actualizarElemento('statTotal', total);
    actualizarElemento('statActivas', activas);
    actualizarElemento('statFinalizadas', finalizadas);
    actualizarElemento('statProrroga', prorrogas);
    actualizarElemento('statDias', diasAcumulados);

    // Si existe el contenedor de dashboard avanzado, lo renderizamos
    const contenedorAvanzado = document.getElementById('dashboardAvanzado');
    if (contenedorAvanzado) {
      renderizarDashboardAvanzado(incapacidades);
    }
  }

  /**
   * Helper para actualizar un elemento
   */
  function actualizarElemento(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
  }

  /**
   * Renderiza un dashboard más completo (opcional)
   */
  function renderizarDashboardAvanzado(incapacidades) {
    const contenedor = document.getElementById('dashboardAvanzado');
    if (!contenedor) return;

    // Resumen por departamento
    const porDepartamento = {};
    incapacidades.forEach(i => {
      porDepartamento[i.departamento] = (porDepartamento[i.departamento] || 0) + 1;
    });

    // Resumen por tipo
    const porTipo = {};
    incapacidades.forEach(i => {
      porTipo[i.tipo] = (porTipo[i.tipo] || 0) + 1;
    });

    contenedor.innerHTML = `
      <div class="dashboard-avanzado">
        <div class="dashboard-seccion">
          <h3>📁 Por Departamento</h3>
          <div class="barras">
            ${Object.entries(porDepartamento).map(([dep, cant]) => `
              <div class="barra-item">
                <span class="barra-label">${dep}</span>
                <div class="barra-fondo">
                  <div class="barra-valor" style="width: ${(cant / incapacidades.length) * 100}%"></div>
                </div>
                <span class="barra-numero">${cant}</span>
              </div>
            `).join('') || '<p class="texto-vacio">Sin datos</p>'}
          </div>
        </div>

        <div class="dashboard-seccion">
          <h3>🏥 Por Tipo de Incapacidad</h3>
          <div class="barras">
            ${Object.entries(porTipo).map(([tipo, cant]) => `
              <div class="barra-item">
                <span class="barra-label">${tipo}</span>
                <div class="barra-fondo">
                  <div class="barra-valor barra-tipo" style="width: ${(cant / incapacidades.length) * 100}%"></div>
                </div>
                <span class="barra-numero">${cant}</span>
              </div>
            `).join('') || '<p class="texto-vacio">Sin datos</p>'}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Filtra la lista desde el dashboard (acceso rápido)
   */
  function filtrarPorEstado(estado) {
    const selectEstado = document.getElementById('selectEstado');
    if (selectEstado) {
      selectEstado.value = estado;
      // Disparar el evento de cambio si existe la función de filtrado
      if (typeof filtrarTablaIncapacidades === 'function') {
        filtrarTablaIncapacidades();
      } else if (typeof cargarListaIncapacidades === 'function') {
        cargarListaIncapacidades();
      }
    }
  }

  // API pública
  return {
    inicializar,
    actualizarDashboard,
    filtrarPorEstado
  };

})();

window.Dashboard = Dashboard;