export interface Prestamo {
  id: number;
  codigo: string;
  libroId: number;
  usuarioId: number;
  fechaPrestamo: string;
  fechaDevolucion: string;
  estado: 'activo' | 'devuelto';
}
