/**
 * MÓDULO DE UTILIDADES
 * Funciones auxiliares para la aplicación
 */

/**
 * Clase para manejar la paginación de datos
 */
class Paginador {
  constructor(datos, porPagina = 10) {
    this.datos = datos;
    this.porPagina = porPagina;
    this.paginaActual = 1;
    this.totalPaginas = Math.ceil(datos.length / porPagina);
  }

  obtenerPagina(numero) {
    this.paginaActual = numero;
    const inicio = (numero - 1) * this.porPagina;
    const fin = inicio + this.porPagina;
    return this.datos.slice(inicio, fin);
  }

  siguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      return this.obtenerPagina(this.paginaActual);
    }
    return null;
  }

  anterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      return this.obtenerPagina(this.paginaActual);
    }
    return null;
  }

  ir(numero) {
    if (numero >= 1 && numero <= this.totalPaginas) {
      return this.obtenerPagina(numero);
    }
    return null;
  }
}

/**
 * Ordena un arreglo de incapacidades
 */
function ordenarIncapacidades(incapacidades, campo = 'nombre', direccion = 'asc') {
  const copia = [...incapacidades];
  
  copia.sort((a, b) => {
    let valorA = a[campo];
    let valorB = b[campo];
    
    // Convertir a minúsculas si son strings
    if (typeof valorA === 'string') valorA = valorA.toLowerCase();
    if (typeof valorB === 'string') valorB = valorB.toLowerCase();
    
    // Comparación
    if (valorA < valorB) return direccion === 'asc' ? -1 : 1;
    if (valorA > valorB) return direccion === 'asc' ? 1 : -1;
    return 0;
  });
  
  return copia;
}

/**
 * Busca registros por múltiples criterios
 */
function buscarAvanzado(incapacidades, criterios) {
  return incapacidades.filter(inc => {
    // Criterios soportados: nombre, cedula, departamento, tipo, estado, rango_dias
    
    if (criterios.nombre && !inc.nombre.toLowerCase().includes(criterios.nombre.toLowerCase())) {
      return false;
    }
    
    if (criterios.cedula && !inc.cedula.includes(criterios.cedula)) {
      return false;
    }
    
    if (criterios.departamento && inc.departamento !== criterios.departamento) {
      return false;
    }
    
    if (criterios.tipo && inc.tipo !== criterios.tipo) {
      return false;
    }
    
    if (criterios.estado && inc.estado !== criterios.estado) {
      return false;
    }
    
    if (criterios.rango_dias) {
      const { min, max } = criterios.rango_dias;
      if (inc.diasIncapacidad < min || inc.diasIncapacidad > max) {
        return false;
      }
    }
    
    if (criterios.fecha_inicio && criterios.fecha_fin) {
      const inicio = new Date(criterios.fecha_inicio);
      const fin = new Date(criterios.fecha_fin);
      const fechaReg = new Date(inc.fechaRegistro);
      
      if (fechaReg < inicio || fechaReg > fin) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Agrupa incapacidades por un campo específico
 */
function agruparIncapacidades(incapacidades, campo) {
  const grupos = {};
  
  incapacidades.forEach(inc => {
    const clave = inc[campo];
    if (!grupos[clave]) {
      grupos[clave] = [];
    }
    grupos[clave].push(inc);
  });
  
  return grupos;
}

/**
 * Calcula el rango de fechas entre incapacidades
 */
function calcularRangoFechas(incapacidades) {
  if (incapacidades.length === 0) {
    return { minima: null, maxima: null };
  }
  
  const fechas = incapacidades.map(inc => new Date(inc.fechaInicio));
  
  return {
    minima: new Date(Math.min(...fechas.map(f => f.getTime()))),
    maxima: new Date(Math.max(...fechas.map(f => f.getTime())))
  };
}

/**
 * Valida si un email es válido
 */
function validarEmail(email) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(email);
}

/**
 * Valida si un teléfono es válido
 */
function validarTelefono(telefono) {
  const patron = /^[0-9]{8}$/;
  return patron.test(telefono.replace(/[\s\-()]/g, ''));
}

/**
 * Convierte un string a formato de moneda
 */
function formatearMoneda(valor, moneda = 'CRC') {
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: moneda
  }).format(valor);
}

/**
 * Calcula la edad a partir de la fecha de nacimiento
 */
function calcularEdad(fechaNacimiento) {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
}

/**
 * Obtiene el día de la semana
 */
function obtenerDiaSemana(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[new Date(fecha).getDay()];
}

/**
 * Copia texto al portapapeles
 */
function copiarAlPortapapeles(texto) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(texto).then(() => {
      mostrarNotificacion('✅ Copiado al portapapeles', 'success');
    }).catch(err => {
      console.error('Error al copiar:', err);
    });
  } else {
    // Fallback para navegadores antiguos
    const textarea = document.createElement('textarea');
    textarea.value = texto;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    mostrarNotificacion('✅ Copiado al portapapeles', 'success');
  }
}

/**
 * Espera un tiempo determinado
 */
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Recarga la página
 */
function recargarPagina() {
  location.reload();
}

/**
 * Redirige a una URL
 */
function redirigir(url) {
  window.location.href = url;
}

/**
 * Obtiene un parámetro de la URL
 */
function obtenerParametroURL(nombre) {
  const params = new URLSearchParams(window.location.search);
  return params.get(nombre);
}

/**
 * Abre un link en una nueva pestaña
 */
function abrirEnPestana(url) {
  window.open(url, '_blank');
}

/**
 * Verifica si el navegador es móvil
 */
function esMovil() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Obtiene la resolución de pantalla
 */
function obtenerResolucion() {
  return {
    ancho: window.innerWidth,
    alto: window.innerHeight,
    dispositivo: esMovil() ? 'móvil' : 'escritorio'
  };
}

/**
 * Localiza el navegador
 */
function obtenerIdioma() {
  return navigator.language || navigator.userLanguage;
}

/**
 * Genera un color aleatorio
 */
function generarColorAleatorio() {
  const colores = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b', '#fa709a'];
  return colores[Math.floor(Math.random() * colores.length)];
}

/**
 * Anima un elemento (scrollIntoView)
 */
function animarElemento(elemento) {
  if (typeof elemento === 'string') {
    elemento = document.getElementById(elemento);
  }
  
  if (elemento) {
    elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Valida si una contraseña es segura
 */
function validarContraseniaSegura(contrasenia) {
  const requisitos = {
    minimo8: contrasenia.length >= 8,
    mayuscula: /[A-Z]/.test(contrasenia),
    minuscula: /[a-z]/.test(contrasenia),
    numero: /[0-9]/.test(contrasenia),
    especial: /[!@#$%^&*]/.test(contrasenia)
  };
  
  const cumple = Object.values(requisitos).filter(v => v).length;
  
  return {
    segura: cumple >= 4,
    cumple: requisitos,
    fortaleza: cumple <= 1 ? 'débil' : cumple <= 3 ? 'media' : 'fuerte'
  };
}

/**
 * Genera un hash simple de un string
 */
function generarHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

/**
 * Cachea datos en sessionStorage
 */
function cachearDatos(clave, datos, minutos = 60) {
  const ahora = new Date().getTime();
  const expiracion = ahora + (minutos * 60 * 1000);
  
  sessionStorage.setItem(clave, JSON.stringify({
    datos: datos,
    expiracion: expiracion
  }));
}

/**
 * Obtiene datos del cache
 */
function obtenerDelCache(clave) {
  const item = sessionStorage.getItem(clave);
  
  if (!item) return null;
  
  const { datos, expiracion } = JSON.parse(item);
  const ahora = new Date().getTime();
  
  if (ahora > expiracion) {
    sessionStorage.removeItem(clave);
    return null;
  }
  
  return datos;
}

/**
 * Limpia el cache
 */
function limpiarCache() {
  sessionStorage.clear();
}

/**
 * Clona un objeto profundamente
 */
function clonarObjeto(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Obtiene las propiedades únicas de un array de objetos
 */
function obtenerUnicos(array, propiedad) {
  return [...new Set(array.map(item => item[propiedad]))];
}

/**
 * Cuenta ocurrencias de un elemento
 */
function contarOcurrencias(array, elemento) {
  return array.filter(item => item === elemento).length;
}

/**
 * Exportar utilidades
 */
window.utilidades = {
  Paginador,
  ordenarIncapacidades,
  buscarAvanzado,
  agruparIncapacidades,
  calcularRangoFechas,
  validarEmail,
  validarTelefono,
  formatearMoneda,
  calcularEdad,
  obtenerDiaSemana,
  copiarAlPortapapeles,
  esperar,
  recargarPagina,
  redirigir,
  obtenerParametroURL,
  abrirEnPestana,
  esMovil,
  obtenerResolucion,
  obtenerIdioma,
  generarColorAleatorio,
  animarElemento,
  validarContraseniaSegura,
  generarHash,
  cachearDatos,
  obtenerDelCache,
  limpiarCache,
  clonarObjeto,
  obtenerUnicos,
  contarOcurrencias
};
