import {Component, inject} from '@angular/core';
import {HttpService} from '../../core/services/http.service';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UrlBuild} from '../../core/interfaces/urlFormInterface.interface';

@Component({
  selector: 'app-url-history',
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: './url-history.component.html',
  styleUrl: './url-history.component.scss'
})
export class UrlHistoryComponent {
  public httpService: HttpService = inject(HttpService);

  setActive(item: UrlBuild) {
    this.httpService.setSelectedUrlBuild(item)
  }
  }
