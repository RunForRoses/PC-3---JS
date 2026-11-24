import { Link } from 'react-router-dom';
import { BadgeDisponible } from './BadgeDisponible';

export function TarjetaLibro({ libro }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">
          <Link to={`/catalogo/${libro.id}`} className="text-decoration-none text-dark">
            {libro.titulo}
          </Link>
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">{libro.autor}</h6>
        <p className="card-text mb-1">
          <small className="text-muted">Año: {libro.anio}</small>
        </p>
        <p className="card-text mb-2">
          <span className="badge bg-light text-dark border">{libro.categoria}</span>
        </p>
        <div className="mb-3">
          <BadgeDisponible disponible={libro.disponible} />
        </div>
        <div className="mt-auto">
          <Link
            to={`/nuevo-prestamo?libroId=${libro.id}`}
            className={`btn btn-primary w-100 ${!libro.disponible ? 'disabled' : ''}`}
            aria-disabled={!libro.disponible}
          >
            Pedir préstamo
          </Link>
        </div>
      </div>
    </div>
  );
}
