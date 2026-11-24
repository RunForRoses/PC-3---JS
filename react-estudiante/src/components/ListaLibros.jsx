import { TarjetaLibro } from './TarjetaLibro';

export function ListaLibros({ libros }) {
  if (!libros || libros.length === 0) {
    return (
      <div className="alert alert-secondary text-center my-4">
        No se encontraron libros para mostrar.
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {libros.map((libro) => (
        <div className="col" key={libro.id}>
          <TarjetaLibro libro={libro} />
        </div>
      ))}
    </div>
  );
}
