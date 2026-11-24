import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTitulo } from '../hooks/useTitulo';

export function Login() {
  useTitulo('Iniciar Sesión');

  const { login } = useAuth();
  const navigate = useNavigate();

  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = login(correo, password);
    if (res.ok) {
      navigate('/mis-prestamos');
    } else {
      setError(res.mensaje);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4">Iniciar Sesión</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Correo institucional UTP</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="ejemplo@utp.edu.pe"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Ingresar
              </button>
            </form>

            <div className="mt-3 text-muted small text-center">
              Ejemplo: u20231234@utp.edu.pe / est123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
