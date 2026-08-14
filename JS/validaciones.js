/**
 * Módulo de Validaciones - Registro de Incapacidades
 * Archivo: js/validaciones.js
 */

// 1. Calcular días de incapacidad entre fecha inicio y fecha fin
function calcularDiasIncapacidad(fechaInicio, fechaFin) {
    if (!fechaInicio || !fechaFin) return 0;

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime()) || fin < inicio) {
        return 0;
    }

    // Diferencia en milisegundos convertida a días (+1 para incluir el día inicial)
    const diffTiempo = Math.abs(fin - inicio);
    return Math.ceil(diffTiempo / (1000 * 60 * 60 * 24)) + 1;
}

// 2. Validar que el número de boleta no esté duplicado en el sistema
function validarBoletaUnica(numBoleta, listaIncapacidades = []) {
    if (!numBoleta) return false;

    const existe = listaIncapacidades.some(
        item => item.numBoleta?.toString().toLowerCase().trim() === numBoleta.toString().toLowerCase().trim()
    );

    // Retorna true si es única (NO existe previamente)
    return !existe;
}

// 3. Validar formato y peso del archivo adjunto
function validarFormatoArchivo(archivo, tamanoMaximoMB = 5) {
    if (!archivo) return { valido: false, mensaje: "Debe adjuntar un archivo." };

    const extensionesPermitidas = ['pdf', 'jpg', 'jpeg', 'png'];
    const extension = archivo.name.split('.').pop().toLowerCase();

    if (!extensionesPermitidas.includes(extension)) {
        return { valido: false, mensaje: "Formato no permitido. Solo PDF, JPG o PNG." };
    }

    const maxBytes = tamanoMaximoMB * 1024 * 1024;
    if (archivo.size > maxBytes) {
        return { valido: false, mensaje: `El archivo supera el tamaño máximo de ${tamanoMaximoMB}MB.` };
    }

    return { valido: true, mensaje: "Archivo válido." };
}

// 4. Validación integral de todo el formulario
function validarFormularioRegistro(datos, listaExistente = []) {
    const errores = [];

    // Validar boleta vacía y formato básico
    if (!datos.numBoleta || datos.numBoleta.trim() === '') {
        errores.push("El número de boleta es obligatorio.");
    } else if (!validarBoletaUnica(datos.numBoleta, listaExistente)) {
        errores.push("El número de boleta ya está registrado en el sistema.");
    }

    // Validar Cédula
    if (!datos.cedula || !/^\d{9,12}$/.test(datos.cedula.replace(/[-\s]/g, ''))) {
        errores.push("La cédula debe contener entre 9 y 12 dígitos.");
    }

    // Validar Nombre
    if (!datos.nombre || datos.nombre.trim().length < 3) {
        errores.push("El nombre completo debe tener al menos 3 caracteres.");
    }

    // Validar Departamento
    if (!datos.departamento || datos.departamento.trim() === '') {
        errores.push("Debe seleccionar un departamento.");
    }

    // Validar Tipo de Incapacidad
    if (!datos.tipoIncapacidad || datos.tipoIncapacidad.trim() === '') {
        errores.push("Debe seleccionar el tipo de incapacidad.");
    }

    // Validar Fechas y Días
    const dias = calcularDiasIncapacidad(datos.fechaInicio, datos.fechaFin);
    if (dias <= 0) {
        errores.push("La fecha de fin no puede ser anterior a la fecha de inicio.");
    }

    // Validar Archivo (si viene en los datos)
    if (datos.archivo) {
        const resArchivo = validarFormatoArchivo(datos.archivo);
        if (!resArchivo.valido) {
            errores.push(resArchivo.mensaje);
        }
    }

    return {
        esValido: errores.length === 0,
        errores: errores,
        diasCalculados: dias
    };
}

// Exportación para entornos modularizados
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calcularDiasIncapacidad,
        validarBoletaUnica,
        validarFormatoArchivo,
        validarFormularioRegistro
    };
}