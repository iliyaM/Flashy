import {Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'app-form-error-message',
  imports: [],
  templateUrl: './form-error-message.component.html',
  styleUrl: './form-error-message.component.scss'
})
export class FormErrorMessageComponent {
  @Input() control!: AbstractControl | null;
  @Input() message: string = '';
}
