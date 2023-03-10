import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route, RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { LoginService } from './app/services/login.service';
import { environment } from './environments/environment';
import { RegistroComponent } from './app/components/registro/registro.component';
import { RegistroService } from './app/services/registro.service';
import { ToastrModule } from 'ngx-toastr';
import { MainTlComponent } from './app/views/main-tl/main-tl.component';
import { LoginComponent } from './app/views/login/login.component';
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AuthService } from './app/auth/auth.service';

if (environment.production) {
  enableProdMode();
}


export const ROUTES: Route[] = [
  { path: '', loadComponent: () => import('./app/views/main-tl/main-tl.component').then(mod => mod.MainTlComponent) },
  { path: 'home', canActivate: [AuthService], loadComponent: () => import('./app/views/main-tl/main-tl.component').then(mod => mod.MainTlComponent) },
  { path: 'login', loadComponent: () => import('./app/views/login/login.component').then(mod => mod.LoginComponent) },
  { path: 'config', canActivate: [AuthService], loadComponent: () => import('./app/views/config/config.component').then(mod => mod.ConfigComponent) },
  { path: 'profile/:usuario', canActivate: [AuthService], loadComponent: () => import('./app/views/profile/profile.component').then(mod => mod.ProfileComponent) },
  { path: '**', loadComponent: () => import('./app/views/login/login.component').then(mod => mod.LoginComponent) },
  // ...
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule, ToastrModule.forRoot(), RouterModule.forRoot(ROUTES, { useHash: true })),

  ]

})
  .catch(err => console.error(err));
