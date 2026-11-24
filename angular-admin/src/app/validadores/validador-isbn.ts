import { AbstractControl, ValidationErrors } from '@angular/forms';

export function validadorISBN(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;

  const patronISBN = /^(978|979)\d{10}$/;
  return patronISBN.test(String(valor).trim()) ? null : { isbnInvalido: true };
}
