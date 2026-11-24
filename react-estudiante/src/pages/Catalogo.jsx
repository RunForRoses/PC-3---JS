import { useState } from 'react';
import { ListaLibros } from '../components/ListaLibros';
import { useTitulo } from '../hooks/useTitulo';

export function Catalogo({ libros }) {
  useTitulo('Catálogo');

  const [categoria, setCategoria] = useState('');
  const [texto, setTexto] = useState('');

  // Generado con Set como pide la guía
  const categorias = [...new Set(libros.map((l) => l.categoria))];

  // La lista filtrada se calcula en cada render, sin otro estado
  const librosFiltrados = libros.filter((l) => {
    const coincideCategoria = !categoria || l.categoria === categoria;
    const busqueda = texto.toLowerCase().trim();
    const coincideTexto =
      !busqueda ||
      l.titulo.toLowerCase().includes(busqueda) ||
      l.autor.toLowerCase().includes(busqueda);

    return coincideCategoria && coincideTexto;
  });

  return (
    <div>
      <h2 className="mb-4">Catálogo de Libros</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label fw-bold">Categoría</label>
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-8">
          <label className="form-label fw-bold">Buscar por título o autor</label>
          <input
            type="text"
            className="form-control"
            placeholder="Escribe el nombre del libro o autor..."
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
        </div>
      </div>

      <ListaLibros libros={librosFiltrados} />
    </div>
  );
}
