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
import { MainTlComponent } from './app/main-tl/main-tl.component';
import { LoginComponent } from './app/login/login.component';

if (environment.production) {
  enableProdMode();
}

export const ROUTES: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: MainTlComponent },
  { path: 'login', component: LoginComponent },
  { path: '**', component: LoginComponent },
];

bootstrapApplication(AppComponent, {
  providers: [
    { provide: LoginService, useClass: LoginService },
    { provide: RegistroService, useClass: RegistroService },
    importProvidersFrom(HttpClientModule, BrowserAnimationsModule, ToastrModule.forRoot(), RouterModule.forRoot(ROUTES)),

  ]

})
  .catch(err => console.error(err));
