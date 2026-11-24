export class Libro {
    constructor({ titulo, año }) {
        this.titulo = titulo;
        this.año = año;
    }

    get etiqueta() {
        return `${this.titulo} (${this.año})`;
    }
}

export class Prestamo {
    constructor({ id, libroId, usuarioId, fechaPrestamo, fechaDevolucion, estado = 'activo' }) {
        this.id = id;
        this.libroId = libroId;
        this.usuarioId = usuarioId;
        this.fechaPrestamo = fechaPrestamo;
        this.fechaDevolucion = fechaDevolucion;
        this.estado = estado;
    }

    get activo() {
        return this.estado === 'activo';
    }

    diasPrestamo() {
        return (new Date(this.fechaDevolucion) - new Date(this.fechaPrestamo)) / (1000 * 60 * 60 * 24);
    }

    estaVencido(hoy) {
        return this.activo && hoy > this.fechaDevolucion;
    }
}
