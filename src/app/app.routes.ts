import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: 'url-builder',
    loadComponent: () => import('./pages/url-builder/url-builder.component').then(c => c.UrlBuilderComponent),
  },
  {
    path: '**',
    redirectTo: 'url-builder'
  }
];
