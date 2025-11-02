import {TestBed} from '@angular/core/testing';
import {HttpService} from './http.service';
import {UrlBuild} from '../interfaces/urlFormInterface.interface';

describe('HttpService', () => {
  let service: HttpService;

  beforeEach(() => {
    // Clear localStorage for tests
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [HttpService]
    });

    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load history from localStorage', () => {
    const saved: UrlBuild[] = [
      {
        id: '1',
        finalUrl: 'https://a.com',
        form: {baseUrl: 'https://a.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('URLS', JSON.stringify(saved));

    service.loadHistory();

    expect(service.historyItems()).toEqual(saved);
  });

  it('should save new item and keep last 5 items', async () => {
    const items: UrlBuild[] = [
      {
        id: '1',
        finalUrl: 'https://1.com',
        form: {baseUrl: 'https://1.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        finalUrl: 'https://2.com',
        form: {baseUrl: 'https://2.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      },
      {
        id: '3',
        finalUrl: 'https://3.com',
        form: {baseUrl: 'https://3.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      },
      {
        id: '4',
        finalUrl: 'https://4.com',
        form: {baseUrl: 'https://4.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      },
      {
        id: '5',
        finalUrl: 'https://5.com',
        form: {baseUrl: 'https://5.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      }
    ];

    items.forEach((item: UrlBuild) => service.historyItems.set([...service.historyItems(), item]));

    const newItem: UrlBuild = {
      id: '6',
      finalUrl: 'https://6.com',
      form: {baseUrl: 'https://6.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
      createdAt: new Date().toISOString()
    };
    await service.post(newItem);

    const current: UrlBuild[] = service.historyItems();

    expect(current.length).toBe(5);
    expect(current.find((i: UrlBuild) => i.id === '1')).toBeUndefined();
    expect(current.find((i: UrlBuild) => i.id === '6')).toBeTruthy();
  });

  it('should compute filteredHistory without filter (sorted newest first)', () => {
    const items: UrlBuild[] = [
      {
        id: '1',
        finalUrl: 'https://old.com',
        form: {baseUrl: 'https://old.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date('2020-01-01').toISOString()
      },
      {
        id: '2',
        finalUrl: 'https://new.com',
        form: {baseUrl: 'https://new.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date('2025-01-01').toISOString()
      }
    ];

    service.historyItems.set(items);

    const filtered = service.filteredHistory();

    expect(filtered[0].id).toBe('2');
    expect(filtered[1].id).toBe('1');
  });

  it('should filter history items by filterText', () => {
    const items: UrlBuild[] = [
      {
        id: '1',
        finalUrl: 'https://apple.com',
        form: {baseUrl: 'https://apple.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        finalUrl: 'https://banana.com',
        form: {baseUrl: 'https://banana.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
        createdAt: new Date().toISOString()
      }
    ];

    service.historyItems.set(items);
    service.filterText.set('apple');

    const filtered = service.filteredHistory();
    expect(filtered.length).toBe(1);
    expect(filtered[0].finalUrl).toBe('https://apple.com');
  });

  it('should set selected item', () => {
    const item: UrlBuild = {
      id: '1',
      finalUrl: 'https://test.com',
      form: {baseUrl: 'https://test.com', utmSource: '', utmMedium: '', utmCampaign: '', params: []},
      createdAt: new Date().toISOString()
    };

    service.setSelectedUrlBuild(item);

    expect(service.selectedItem()).toEqual(item);
  });
});
