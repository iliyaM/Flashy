import {Component, inject} from '@angular/core';
import {UrlHistoryComponent} from '../url-history/url-history.component';
import {UrlBuilderFormComponent} from '../url-builder-form/url-builder-form.component';
import {HttpService} from '../../core/services/http.service';

@Component({
  selector: 'app-url-builder',
  imports: [
    UrlHistoryComponent,
    UrlBuilderFormComponent
  ],
  templateUrl: './url-builder.component.html',
  styleUrl: './url-builder.component.scss'
})
export class UrlBuilderComponent {
  public httpService: HttpService = inject(HttpService);

}
