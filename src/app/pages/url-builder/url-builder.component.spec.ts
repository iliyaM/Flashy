import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlBuilderComponent } from './url-builder.component';

describe('UrlBuilderComponent', () => {
  let component: UrlBuilderComponent;
  let fixture: ComponentFixture<UrlBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlBuilderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
