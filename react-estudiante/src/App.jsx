import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import db from './data/db.json';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { RutaProtegida } from './components/RutaProtegida';
import { Catalogo } from './pages/Catalogo';
import { DetalleLibro } from './pages/DetalleLibro';
import { Login } from './pages/Login';
import { NuevoPrestamo } from './pages/NuevoPrestamo';
import { MisPrestamos } from './pages/MisPrestamos';
import { NotFound } from './pages/NotFound';

export default function App() {
  const [libros, setLibros] = useState(db.libros);
  // Estado elevado de préstamos en App
  const [prestamos, setPrestamos] = useState(db.prestamos);

  const agregarPrestamo = (nuevoPrestamo) => {
    setPrestamos((prev) => [nuevoPrestamo, ...prev]);
    // Marcar libro como prestado
    setLibros((prev) =>
      prev.map((l) =>
        l.id === nuevoPrestamo.libroId ? { ...l, disponible: false } : l
      )
    );
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-vh-100 bg-light d-flex flex-column">
          <Navbar />
          <main className="container pb-5">
            <Routes>
              <Route path="/" element={<Navigate to="/catalogo" replace />} />
              <Route path="/catalogo" element={<Catalogo libros={libros} />} />
              <Route path="/catalogo/:id" element={<DetalleLibro libros={libros} />} />
              <Route path="/login" element={<Login />} />

              {/* Rutas protegidas */}
              <Route element={<RutaProtegida />}>
                <Route
                  path="/mis-prestamos"
                  element={<MisPrestamos prestamos={prestamos} libros={libros} />}
                />
                <Route
                  path="/nuevo-prestamo"
                  element={
                    <NuevoPrestamo
                      libros={libros}
                      prestamos={prestamos}
                      onAgregarPrestamo={agregarPrestamo}
                    />
                  }
                />
              </Route>

              {/* Página 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
