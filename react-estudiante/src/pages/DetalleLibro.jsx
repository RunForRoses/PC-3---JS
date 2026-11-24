import { useParams, Link } from 'react-router-dom';
import { BadgeDisponible } from '../components/BadgeDisponible';
import { useTitulo } from '../hooks/useTitulo';

export function DetalleLibro({ libros }) {
  const { id } = useParams();
  const libro = libros.find((l) => String(l.id) === String(id));

  useTitulo(libro ? libro.titulo : 'Libro no encontrado');

  if (!libro) {
    return (
      <div className="alert alert-warning my-4">
        <h4>Libro no encontrado</h4>
        <p>El libro con identificador {id} no existe en nuestro catálogo.</p>
        <Link to="/catalogo" className="btn btn-outline-primary">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="card shadow-sm p-4">
      <div className="card-body">
        <h2 className="card-title mb-3">{libro.titulo}</h2>
        <h5 className="text-muted mb-3">Autor: {libro.autor}</h5>
        <div className="mb-3">
          <BadgeDisponible disponible={libro.disponible} />
        </div>
        <ul className="list-group list-group-flush mb-4">
          <li className="list-group-item px-0">
            <strong>ISBN:</strong> {libro.isbn}
          </li>
          <li className="list-group-item px-0">
            <strong>Categoría:</strong> {libro.categoria}
          </li>
          <li className="list-group-item px-0">
            <strong>Año de publicación:</strong> {libro.anio}
          </li>
        </ul>
        <div className="d-flex gap-2">
          <Link to="/catalogo" className="btn btn-secondary">
            Volver
          </Link>
          <Link
            to={`/nuevo-prestamo?libroId=${libro.id}`}
            className={`btn btn-primary ${!libro.disponible ? 'disabled' : ''}`}
            aria-disabled={!libro.disponible}
          >
            Pedir préstamo
          </Link>
        </div>
      </div>
    </div>
  );
}
