import { Link } from 'react-router-dom';
import { useTitulo } from '../hooks/useTitulo';

export function NotFound() {
  useTitulo('Página no encontrada');

  return (
    <div className="text-center py-5">
      <h1 className="display-1 fw-bold text-muted">404</h1>
      <h2>Página no encontrada</h2>
      <p className="text-muted mb-4">La ruta a la que intentas acceder no existe.</p>
      <Link to="/catalogo" className="btn btn-primary">
        Ir al catálogo
      </Link>
    </div>
  );
}
