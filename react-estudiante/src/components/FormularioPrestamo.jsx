import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validarPrestamo } from '../core/validadores.js';
import { puedePrestar, crearGeneradorCodigos } from '../core/estadisticas.js';

export function FormularioPrestamo({ libros, prestamos, onAgregarPrestamo }) {
  const { usuario } = useAuth();
  const [searchParams] = useSearchParams();
  const primerCampoRef = useRef(null);

  const [form, setForm] = useState({
    libroId: searchParams.get('libroId') || '',
    fechaPrestamo: '',
    fechaDevolucion: ''
  });
  const [errores, setErrores] = useState({});
  const [exito, setExito] = useState('');

  useEffect(() => {
    primerCampoRef.current?.focus();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrores({});
    setExito('');

    if (!puedePrestar(usuario.id, prestamos)) {
      setErrores({ general: 'Ya tienes 3 préstamos activos' });
      return;
    }

    const err = validarPrestamo(form);
    const libro = libros.find((l) => String(l.id) === String(form.libroId));
    if (libro && !libro.disponible) {
      err.libroId = 'Este libro no está disponible.';
    }

    if (Object.keys(err).length > 0) {
      setErrores(err);
      return;
    }

    const nuevo = {
      id: Date.now(),
      codigo: crearGeneradorCodigos('PRE', prestamos.length + 1)(),
      libroId: Number(form.libroId),
      usuarioId: usuario.id,
      fechaPrestamo: form.fechaPrestamo,
      fechaDevolucion: form.fechaDevolucion,
      estado: 'activo'
    };

    onAgregarPrestamo(nuevo);
    setExito(`¡Préstamo ${nuevo.codigo} registrado!`);
    setForm({ libroId: '', fechaPrestamo: '', fechaDevolucion: '' });
    primerCampoRef.current?.focus();
  };

  return (
    <div className="card shadow-sm p-4">
      <h3 className="card-title mb-3">Solicitar Préstamo</h3>
      {errores.general && <div className="alert alert-danger">{errores.general}</div>}
      {exito && <div className="alert alert-success">{exito}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label fw-bold">Libro</label>
          <select ref={primerCampoRef} name="libroId" className="form-select" value={form.libroId} onChange={handleChange}>
            <option value="">-- Selecciona un libro --</option>
            {libros.map((l) => (
              <option key={l.id} value={l.id}>{l.titulo} {l.disponible ? '' : '(No disponible)'}</option>
            ))}
          </select>
          {errores.libroId && <div className="text-danger small">{errores.libroId}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Fecha Préstamo</label>
          <input type="date" name="fechaPrestamo" className="form-control" value={form.fechaPrestamo} onChange={handleChange} />
          {errores.fechaPrestamo && <div className="text-danger small">{errores.fechaPrestamo}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label fw-bold">Fecha Devolución</label>
          <input type="date" name="fechaDevolucion" className="form-control" value={form.fechaDevolucion} onChange={handleChange} />
          {errores.fechaDevolucion && <div className="text-danger small">{errores.fechaDevolucion}</div>}
          {errores.duracion && <div className="text-danger small">{errores.duracion}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Registrar Préstamo</button>
      </form>
    </div>
  );
}
