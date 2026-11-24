export interface Libro {
  id: number;
  isbn: string;
  titulo: string;
  autor: string;
  categoria: string;
  anio: number;
  disponible: boolean;
  estado: 'disponible' | 'agotado';
}

export type NuevoLibro = Omit<Libro, 'id'>;
