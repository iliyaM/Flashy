import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlBuilderFormComponent } from './url-builder-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpService } from '../../core/services/http.service';
import { GenericModalService } from '../../core/services/generic-modal.service';
import { UrlBuild } from '../../core/interfaces/urlFormInterface.interface';

describe('UrlBuilderFormComponent', () => {
  let component: UrlBuilderFormComponent;
  let fixture: ComponentFixture<UrlBuilderFormComponent>;
  let httpService: HttpService;
  let modalService: GenericModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        HttpService,
        {
          provide: GenericModalService,
          useValue: { open: jasmine.createSpy('open') }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UrlBuilderFormComponent);
    component = fixture.componentInstance;

    httpService = TestBed.inject(HttpService);
    modalService = TestBed.inject(GenericModalService);

    fixture.detectChanges(); // triggers constructor and patchFormFromHistory
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have empty form initially', () => {
    expect(component.form.value.baseUrl).toBe('');
    expect(component.form.value.utmSource).toBeNull();
    expect(component.params.length).toBe(0);
  });

  it('should compute final URL correctly', () => {
    component.form.patchValue({ baseUrl: 'https://example.com', utmSource: 'google' });
    const final = component.finalUrl();
    expect(final).toContain('https://example.com');
    expect(final).toContain('**utm_source**=google');
  });

  it('should patch form when selectedItem changes', async () => {
    const mockItem: UrlBuild = {
      id: '123',
      finalUrl: 'https://test.com',
      form: {
        baseUrl: 'https://test.com',
        utmSource: 'abc',
        utmMedium: 'def',
        utmCampaign: 'ghi',
        params: [{ key: 'foo', value: 'bar' }]
      },
      createdAt: new Date().toISOString()
    };

    // set selectedItem
    httpService.selectedItem.set(mockItem);

    // wait for reactive effect to run
    await Promise.resolve();
    fixture.detectChanges();

    expect(component.form.value.baseUrl).toBe('https://test.com');
    expect(component.form.value.utmSource).toBe('abc');
    expect(component.params.length).toBe(1);
    expect(component.params.at(0)?.value.key).toBe('foo');
    expect(component.params.at(0)?.value.value).toBe('bar');
  });


  it('should save URL using HttpService', async () => {
    spyOn(httpService, 'post').and.returnValue(Promise.resolve());

    component.form.patchValue({ baseUrl: 'https://save.com', utmSource: 'x' });
    await component.saveUrl();

    expect(httpService.post).toHaveBeenCalled();
    expect(modalService.open).toHaveBeenCalledWith('SUCCESS', 'URL saved to history');
  });

  it('should add and remove param controls', () => {
    expect(component.params.length).toBe(0);

    component.addParam();
    expect(component.params.length).toBe(1);

    component.removeParam(0);
    expect(component.params.length).toBe(0);
  });
});
