import {FormArray, FormControl, FormGroup} from '@angular/forms';

export interface IUrlForm {
  baseUrl: FormControl<string>;
  utmSource: FormControl<string | null>;
  utmMedium: FormControl<string | null>;
  utmCampaign: FormControl<string | null>;
  params: FormArray<FormGroup<IParamGroup>>
}

export interface IUrlFormValue {
  baseUrl: string;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  params:  Array<{ key: string; value: string }>;
}

export interface IParamGroup {
  key: FormControl<string>;
  value: FormControl<string>;
}

export interface UrlBuild {
  id: string;
  finalUrl: string;
  form: {
    baseUrl: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    params: Array<{ key: string; value: string }>;
  };
  createdAt: string;
}
