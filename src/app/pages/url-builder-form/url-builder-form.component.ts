import {Component, computed, effect, inject, Signal} from '@angular/core';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {IParamGroup, IUrlForm, IUrlFormValue, UrlBuild} from '../../core/interfaces/urlFormInterface.interface';
import {HttpService} from '../../core/services/http.service';
import {CustomIconsComponent} from '../../shared/components/custsom-icons/custom-icons.component';
import {FormErrorMessageComponent} from '../../shared/components/form-error-message/form-error-message.component';
import {urlValidator, uuidGenerator} from '../../core/utils';
import {toSignal} from '@angular/core/rxjs-interop';
import {filter, map, startWith} from 'rxjs';
import {HighlightUrlPipe} from '../../shared/pipes/highlight-url.pipe';
import {GenericModalService} from '../../core/services/generic-modal.service';

@Component({
  selector: 'app-url-builder-form',
  imports: [ReactiveFormsModule, CustomIconsComponent, FormErrorMessageComponent, HighlightUrlPipe],
  templateUrl: './url-builder-form.component.html',
  styleUrl: './url-builder-form.component.scss'
})

export class UrlBuilderFormComponent {
  private httpService: HttpService = inject(HttpService);
  private genericModalService: GenericModalService = inject(GenericModalService);

  form: FormGroup<IUrlForm> = new FormGroup<IUrlForm>({
    baseUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, urlValidator]
    }),
    utmSource: new FormControl<string | null>(null),
    utmMedium: new FormControl<string | null>(null),
    utmCampaign: new FormControl<string | null>(null),
    params: new FormArray<FormGroup<IParamGroup>>([])
  });

  params:FormArray<FormGroup<IParamGroup>> = this.form.controls.params;

  // Convert valueChanges to signal
  formValue: Signal<IUrlFormValue> = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      filter(() => this.form.valid), // only valid values
      map(value => value as IUrlFormValue)
    ),
  ) as Signal<IUrlFormValue>;

  // computed final URL
  finalUrl: Signal<string> = computed(() => {
    const value: IUrlFormValue = this.formValue();

    if (!value || !value.baseUrl) return ''

    const url = new URL(value.baseUrl);

    // Add UTM params
    if (value.utmSource) url.searchParams.set('**utm_source**', value.utmSource);
    if (value.utmMedium) url.searchParams.set('**utm_medium**', value.utmMedium);
    if (value.utmCampaign) url.searchParams.set('**utm_campaign**', value.utmCampaign);

    // Add dynamic params
    value.params?.forEach((p: { key: string; value: string }) => {
      if (p.key && p.value) url.searchParams.set(`**${p.key}**`, `**${p.value}**`);
    });
    return url.toString();
  });

  // computed URL length
  urlLength: Signal<number> = computed(() => {
    return this.finalUrl().replace(/\*\*/g, '').length;
  });

  constructor() {
    this.patchFormFromHistory();
  }

  private patchFormFromHistory() {
    effect(() => {
      const selected: UrlBuild | null = this.httpService.selectedItem();

      if (!selected) {
        return;
      }

      this.form.patchValue({
        baseUrl: selected.form.baseUrl,
        utmSource: selected.form.utmSource || null,
        utmMedium: selected.form.utmMedium || null,
        utmCampaign: selected.form.utmCampaign || null
      });

      this.params.clear();
      selected.form.params.forEach((p: { key: string; value: string } ) => {
        this.params.push(new FormGroup<IParamGroup>({
          key: new FormControl(p.key, { nonNullable: true }),
          value: new FormControl(p.value, { nonNullable: true })
        }));
      });
    });
  }

  addParam() {
    const paramGroup = new FormGroup<IParamGroup>({
      key: new FormControl('', {nonNullable: true, validators: Validators.required}),
      value: new FormControl('', {nonNullable: true, validators: Validators.required})
    });
    this.params.push(paramGroup);
  }

  removeParam(i: number) {
    this.params.removeAt(i);
  }

  async copyUrl() {
    await navigator.clipboard.writeText(this.finalUrl().replace(/\*\*/g, ''));
    this.genericModalService.open('SUCCESS', 'URL copied to clipboard');
  }

  async saveUrl() {
    const formValue: IUrlFormValue = this.formValue();
    const body: UrlBuild = {
      id: uuidGenerator(),
      finalUrl: this.finalUrl().replace(/\*\*/g, ''),
      form: {
        baseUrl: formValue.baseUrl,
        utmSource: formValue.utmSource ?? '',
        utmMedium: formValue.utmMedium ?? '',
        utmCampaign: formValue.utmCampaign ?? '',
        params: formValue.params
      },
      createdAt: new Date().toISOString()
    }

    await this.httpService.post(body).then(() => {
      this.genericModalService.open('SUCCESS', 'URL saved to history');
    });
  }
}
