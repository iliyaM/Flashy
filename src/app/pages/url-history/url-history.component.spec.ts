import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlHistoryComponent } from './url-history.component';
import {HttpService} from '../../core/services/http.service';
import {FormsModule} from '@angular/forms';
import {DatePipe} from '@angular/common';
import {UrlBuild} from '../../core/interfaces/urlFormInterface.interface';

describe('UrlHistoryComponent', () => {
  let component: UrlHistoryComponent;
  let fixture: ComponentFixture<UrlHistoryComponent>;
  let httpService: HttpService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, DatePipe, UrlHistoryComponent],
      providers: [HttpService],
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlHistoryComponent);
    component = fixture.componentInstance;
    httpService = TestBed.inject(HttpService);

    httpService.historyItems.set([]);
    httpService.selectedItem.set(null);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show all history items', () => {
    const items: UrlBuild[] = [
      { id: '1', finalUrl: 'https://a.com', form: { baseUrl: 'https://a.com', utmSource: '', utmMedium: '', utmCampaign: '', params: [] }, createdAt: new Date().toISOString() },
      { id: '2', finalUrl: 'https://b.com', form: { baseUrl: 'https://b.com', utmSource: '', utmMedium: '', utmCampaign: '', params: [] }, createdAt: new Date().toISOString() }
    ];
    httpService.historyItems.set(items);

    fixture.detectChanges();

    expect(httpService.filteredHistory().length).toBe(2);
    expect(httpService.filteredHistory()[0].finalUrl).toBe('https://a.com');
  });

  it('should filter history items', () => {
    const items: UrlBuild[] = [
      { id: '1', finalUrl: 'https://apple.com', form: { baseUrl: 'https://apple.com', utmSource: '', utmMedium: '', utmCampaign: '', params: [] }, createdAt: new Date().toISOString() },
      { id: '2', finalUrl: 'https://banana.com', form: { baseUrl: 'https://banana.com', utmSource: '', utmMedium: '', utmCampaign: '', params: [] }, createdAt: new Date().toISOString() }
    ];
    httpService.historyItems.set(items);

    httpService.filterText.set('apple');
    fixture.detectChanges();

    const filtered = httpService.filteredHistory();
    expect(filtered.length).toBe(1);
    expect(filtered[0].finalUrl).toBe('https://apple.com');
  });

  it('should set selected item on click', () => {
    const item: UrlBuild = {
      id: '1',
      finalUrl: 'https://click.com',
      form: { baseUrl: 'https://click.com', utmSource: '', utmMedium: '', utmCampaign: '', params: [] },
      createdAt: new Date().toISOString()
    };

    component.setActive(item);

    expect(httpService.selectedItem()).toEqual(item);
  });


});
