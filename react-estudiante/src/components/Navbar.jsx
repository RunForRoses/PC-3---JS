import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/catalogo">
          📚 BiblioUTP
        </Link>
        <div className="navbar-nav me-auto">
          <NavLink className="nav-link" to="/catalogo">
            Catálogo
          </NavLink>
          {usuario && (
            <>
              <NavLink className="nav-link" to="/mis-prestamos">
                Mis Préstamos
              </NavLink>
              <NavLink className="nav-link" to="/nuevo-prestamo">
                Nuevo Préstamo
              </NavLink>
            </>
          )}
        </div>
        <div className="navbar-nav ms-auto align-items-center">
          {usuario ? (
            <div className="d-flex align-items-center gap-2">
              <span className="text-white small">Hola, {usuario.nombre}</span>
              <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                Salir
              </button>
            </div>
          ) : (
            <NavLink className="btn btn-outline-light btn-sm" to="/login">
              Iniciar sesión
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
