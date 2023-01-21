import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route, RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { LoginService } from './app/services/login.service';
import { environment } from './environments/environment';
import { RegistroComponent } from './app/registro/registro/registro.component';
import { RegistroService } from './app/services/registro.service';
import { ToastrModule } from 'ngx-toastr';

if (environment.production) {
  enableProdMode();
}

export const ROUTES: Routes = [
  { path: '', loadComponent: () => import('./app/login/login.component').then(mod => mod.LoginComponent) },
  { path: 'home', runGuardsAndResolvers: 'always', loadComponent: () => import('./app/main-tl/main-tl.component').then(mod => mod.MainTlComponent) },
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LoginService, useClass: LoginService },
    { provide: RegistroService, useClass: RegistroService },
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule, ToastrModule.forRoot(), RouterModule.forRoot(ROUTES, { onSameUrlNavigation: 'reload' })),

  ]

})
  .catch(err => console.error(err));
