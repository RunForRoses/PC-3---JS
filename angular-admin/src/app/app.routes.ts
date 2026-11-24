import { Routes } from '@angular/router';
import { LibroListaComponent } from './libro-lista/libro-lista.component';
import { LibroFormComponent } from './libro-form/libro-form.component';
import { PrestamoListaComponent } from './prestamos-lista/prestamos-lista.component';

export const routes: Routes = [
  { path: 'libros', component: LibroListaComponent },
  { path: 'libros/nuevo', component: LibroFormComponent },
  { path: 'libros/:id/editar', component: LibroFormComponent },
  { path: 'prestamos', component: PrestamoListaComponent },
  { path: '', redirectTo: '/libros', pathMatch: 'full' },
  { path: '**', redirectTo: '/libros' }
];
