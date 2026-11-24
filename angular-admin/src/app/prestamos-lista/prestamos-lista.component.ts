import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrestamoApi } from '../services/prestamo-api.service';
import { LibroApi } from '../services/libro-api.service';
import { Prestamo } from '../models/prestamo';
import { Libro } from '../models/libro';
import { EstadoPrestamoPipe } from '../pipes/estado-prestamo.pipe';

@Component({
  selector: 'app-prestamo-lista',
  standalone: true,
  imports: [CommonModule, EstadoPrestamoPipe],
  templateUrl: './prestamos-lista.component.html'
})
export class PrestamoListaComponent implements OnInit {
  private readonly prestamoApi = inject(PrestamoApi);
  private readonly libroApi = inject(LibroApi);

  prestamos = signal<Prestamo[]>([]);
  libros = signal<Map<number, string>>(new Map());
  cargando = signal<boolean>(true);

  ngOnInit(): void {
    this.libroApi.listar().subscribe({
      next: (librosList: Libro[]) => {
        const mapa = new Map<number, string>();
        for (const l of librosList) {
          mapa.set(l.id, l.titulo);
        }
        this.libros.set(mapa);
      }
    });

    this.prestamoApi.listar().subscribe({
      next: (data) => {
        this.prestamos.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.cargando.set(false);
      }
    });
  }

  obtenerNombreLibro(libroId: number): string {
    return this.libros().get(libroId) || `Libro #${libroId}`;
  }
}

export { PrestamoListaComponent as PrestamosListaComponent, PrestamoListaComponent as PrestamoLista };
