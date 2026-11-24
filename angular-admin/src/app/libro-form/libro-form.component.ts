import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LibroApi } from '../services/libro-api.service';
import { Libro } from '../models/libro';
import { validadorISBN } from '../validadores/validador-isbn';

@Component({
  selector: 'app-libro-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './libro-form.component.html'
})
export class LibroFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly libroApi = inject(LibroApi);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  esEdicion = false;
  libroId?: number;
  error = '';

  readonly formulario = this.fb.nonNullable.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    isbn: ['', [Validators.required, validadorISBN]],
    autor: ['', [Validators.required]],
    categoria: ['', [Validators.required]],
    anio: [2024, [Validators.required, Validators.min(1500), Validators.max(2026)]],
    disponible: [true]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esEdicion = true;
      this.libroId = Number(idParam);
      this.libroApi.obtener(this.libroId).subscribe({
        next: (data) => {
          this.formulario.patchValue({
            titulo: data.titulo,
            isbn: data.isbn || '',
            autor: data.autor,
            categoria: data.categoria,
            anio: data.anio,
            disponible: data.disponible ?? true
          });
        },
        error: () => {
          this.error = 'No se pudo cargar la información del libro.';
        }
      });
    }
  }

  guardar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valores = this.formulario.getRawValue();

    if (this.esEdicion && this.libroId) {
      const libroActualizado: Libro = {
        id: this.libroId,
        ...valores
      };
      this.libroApi.actualizar(libroActualizado).subscribe({
        next: () => this.router.navigate(['/libros']),
        error: () => this.error = 'Error al actualizar el libro.'
      });
    } else {
      this.libroApi.crear(valores).subscribe({
        next: () => this.router.navigate(['/libros']),
        error: () => this.error = 'Error al crear el libro.'
      });
    }
  }
}

export { LibroFormComponent as LibroForm };
