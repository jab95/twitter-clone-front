import { enableProdMode, importProvidersFrom, } from '@angular/core';
import { provi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Route, RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthService } from './app/auth/auth.service';

if (environment.production) {
  enableProdMode();
}


const ROUTES: Routes = [
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
    importProvidersFrom(BrowserAnimationsModule, ToastrModule.forRoot()),
    provideRouter(ROUTES),
    provideHttpClient() //ACTUALIZAR A ANGULAR 15

  ]

})
  .catch(err => console.error(err));
