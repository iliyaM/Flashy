import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {GenericModalService} from './core/services/generic-modal.service';
import {GenericModalComponent} from './shared/components/generic-modal/generic-modal.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, GenericModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(public genericModalService: GenericModalService) {
  }
}
