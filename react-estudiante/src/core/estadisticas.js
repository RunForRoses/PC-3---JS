export function prestamosPorEstado(prestamos) {
    return prestamos.reduce(
        (acc, p) => {
            if (p.estado === 'activo') acc.activo += 1;
            if (p.estado === 'devuelto') acc.devuelto += 1;
            return acc;
        },
        { activo: 0, devuelto: 0 }
    );
}

export function librosMasPrestados(libros, prestamos) {
    const conteo = new Map();

    for (const p of prestamos) {
        conteo.set(p.libroId, (conteo.get(p.libroId) || 0) + 1);
    }

    return [...libros]
        .map((libro) => ({
            ...libro,
            totalPrestamos: conteo.get(libro.id) || 0,
        }))
        .sort((a, b) => b.totalPrestamos - a.totalPrestamos);
}

export function autoresUnicos(libros) {
    return [...new Set(libros.map((libro) => libro.autor))];
}

export function puedePrestar(usuarioId, prestamos) {
    const activos = prestamos.filter(
        (p) => p.usuarioId === usuarioId && p.estado === 'activo'
    );
    return activos.length < 3;
}

export function crearGeneradorCodigos(prefijo, inicio) {
    let contador = inicio;
    return function () {
        const codigo = `${prefijo}-${String(contador).padStart(4, '0')}`;
        contador += 1;
        return codigo;
    };
}
