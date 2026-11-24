import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LibroApi } from '../services/libro-api.service';
import { Libro } from '../models/libro';

@Component({
  selector: 'app-libro-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './libro-lista.component.html'
})
export class LibroListaComponent implements OnInit {
  private readonly libroApi = inject(LibroApi);

  libros = signal<Libro[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');
  categoriaSeleccionada = signal<string>('');

  ngOnInit(): void {
    this.cargarLibros();
  }

  cargarLibros(): void {
    this.cargando.set(true);
    this.error.set('');

    this.libroApi.listar(this.categoriaSeleccionada() || undefined).subscribe({
      next: (data) => {
        this.libros.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de libros. Verifica que la API esté activa.');
        this.cargando.set(false);
      }
    });
  }

  filtrarPorCategoria(event: Event): void {
    const valor = (event.target as HTMLSelectElement).value;
    this.categoriaSeleccionada.set(valor);
    this.cargarLibros();
  }

  eliminarLibro(id: number, titulo: string): void {
    const confirmar = confirm(`¿Estás seguro de eliminar el libro "${titulo}"?`);
    if (!confirmar) return;

    this.libroApi.eliminar(id).subscribe({
      next: () => {
        this.cargarLibros();
      },
      error: () => {
        this.error.set('Error al intentar eliminar el libro.');
      }
    });
  }
}

export { LibroListaComponent as LibrosListaComponent };
