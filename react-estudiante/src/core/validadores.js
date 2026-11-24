const patronISBN = /^(978|979)\d{10}$/;

export function esISBN(isbn) {
    if (typeof isbn !== 'string') return false;
    return patronISBN.test(isbn.trim());
}

const patronCodigoAlumno = /^U\d{8}$/;

export function esCodigoAlumno(codigo) {
    if (typeof codigo !== 'string') return false;
    return patronCodigoAlumno.test(codigo.trim());
}

const patronFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

export function esFecha(fecha) {
    if (typeof fecha !== 'string') return false;
    return patronFecha.test(fecha.trim());
}

export function validarPrestamo({ libroId, fechaPrestamo, fechaDevolucion }) {
    const errores = {};

    if (!libroId) {
        errores.libroId = `El libroId es obligatorio.`;
    }

    if (!esFecha(fechaPrestamo)) {
        errores.fechaPrestamo = `La fecha de préstamo "${fechaPrestamo}" no es válida.`;
    }

    if (!esFecha(fechaDevolucion)) {
        errores.fechaDevolucion = `La fecha de devolución "${fechaDevolucion}" no es válida.`;
    }

    if (esFecha(fechaPrestamo) && esFecha(fechaDevolucion)) {
        if (fechaDevolucion <= fechaPrestamo) {
            errores.fechaDevolucion = `La fecha de devolución "${fechaDevolucion}" debe ser posterior a "${fechaPrestamo}".`;
        }

        const unDia = 1000 * 60 * 60 * 24;
        const dias = (new Date(fechaDevolucion) - new Date(fechaPrestamo)) / unDia;

        if (dias > 15) {
            errores.duracion = `El préstamo no puede durar más de 15 días (dura ${dias} días).`;
        }
    }

    return errores;
}