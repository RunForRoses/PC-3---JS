export function BadgeDisponible({ disponible }) {
  return (
    <span className={`badge ${disponible ? 'bg-success' : 'bg-secondary'}`}>
      {disponible ? 'Disponible' : 'No disponible'}
    </span>
  );
}
