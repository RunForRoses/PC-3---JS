import { FormularioPrestamo } from '../components/FormularioPrestamo';
import { useTitulo } from '../hooks/useTitulo';

export function NuevoPrestamo({ libros, prestamos, onAgregarPrestamo }) {
  useTitulo('Nuevo Préstamo');

  return (
    <div className="row justify-content-center">
      <div className="col-md-7">
        <FormularioPrestamo
          libros={libros}
          prestamos={prestamos}
          onAgregarPrestamo={onAgregarPrestamo}
        />
      </div>
    </div>
  );
}
