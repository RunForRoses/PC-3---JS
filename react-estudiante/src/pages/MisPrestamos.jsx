import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTitulo } from '../hooks/useTitulo';
import { Prestamo } from '../core/modelos.js';

export function MisPrestamos({ prestamos, libros }) {
  useTitulo('Mis Préstamos');
  const { usuario } = useAuth();
  const [tiempoRestante, setTiempoRestante] = useState(null);

  const hoy = new Date().toISOString().slice(0, 10);
  const misPrestamos = prestamos.filter((p) => p.usuarioId === usuario?.id);

  const activosNoVencidos = misPrestamos.filter((p) => {
    const obj = new Prestamo(p);
    return obj.activo && !obj.estaVencido(hoy);
  });

  const proximo = activosNoVencidos.sort((a, b) =>
    a.fechaDevolucion.localeCompare(b.fechaDevolucion)
  )[0];

  useEffect(() => {
    if (!proximo) {
      setTiempoRestante(null);
      return;
    }

    const calcular = () => {
      const diff = new Date(`${proximo.fechaDevolucion}T23:59:59`) - new Date();
      if (diff <= 0) {
        setTiempoRestante('¡Vence hoy!');
        return;
      }
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTiempoRestante(`${d}d ${h}h ${m}m ${s}s`);
    };

    calcular();
    const id = setInterval(calcular, 1000);
    return () => clearInterval(id);
  }, [proximo?.id, proximo?.fechaDevolucion]);

  const nombreLibro = (libroId) => {
    const l = libros.find((item) => item.id === libroId);
    return l ? l.titulo : `Libro #${libroId}`;
  };

  return (
    <div>
      <h2 className="mb-3">Mis Préstamos</h2>

      {proximo && tiempoRestante && (
        <div className="alert alert-info d-flex align-items-center justify-content-between mb-4">
          <div><strong>Próxima devolución:</strong> {nombreLibro(proximo.libroId)} ({proximo.fechaDevolucion})</div>
          <span className="badge bg-primary fs-6">⏳ {tiempoRestante}</span>
        </div>
      )}

      {misPrestamos.length === 0 ? (
        <div className="alert alert-secondary text-center my-4">No tienes préstamos registrados.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Código</th>
                <th>Libro</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {misPrestamos.map((p) => {
                const vencido = new Prestamo(p).estaVencido(hoy);
                return (
                  <tr key={p.id} className={vencido ? 'table-danger text-danger fw-bold' : ''}>
                    <td>{p.codigo}</td>
                    <td>{nombreLibro(p.libroId)}</td>
                    <td>{p.fechaPrestamo}</td>
                    <td>{p.fechaDevolucion}</td>
                    <td>
                      {vencido ? (
                        <span className="badge bg-danger">Vencido</span>
                      ) : p.estado === 'activo' ? (
                        <span className="badge bg-warning text-dark">Activo</span>
                      ) : (
                        <span className="badge bg-success">Devuelto</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
