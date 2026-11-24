import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'estadoPrestamo',
  standalone: true
})
export class EstadoPrestamoPipe implements PipeTransform {
  transform(estado: string | null | undefined): string {
    if (!estado) return '';
    const normalizado = estado.toLowerCase().trim();
    if (normalizado === 'activo') return '📖 Activo';
    if (normalizado === 'devuelto') return '✅ Devuelto';
    return estado;
  }
}
