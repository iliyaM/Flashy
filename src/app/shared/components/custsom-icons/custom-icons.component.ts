import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-icons',
  standalone: true,
  template: `
    <svg [attr.width]="size" [attr.height]="size" class="icon">
      <use [attr.href]="'svg-sprite.svg#' + name"></use>
    </svg>
  `,
  styles: []
})
export class CustomIconsComponent {
  @Input() name!: string;
  @Input() size: number = 24;
}
