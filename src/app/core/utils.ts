import {AbstractControl} from '@angular/forms';
import { v4 as uuidv4 } from 'uuid';

export function urlValidator(control: AbstractControl) {
  const value: string = control.value;
  if (!value) return null;

  try {
    new URL(value); // Will throw if invalid
    return null;
  } catch {
    return { invalidUrl: true };
  }
}

export function uuidGenerator() {
  return uuidv4();
}
