import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { from } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MainTlComponent } from './main-tl/main-tl.component';
import { RegistroComponent } from './registro/registro/registro.component';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports:[
    RouterOutlet,
    RouterModule
  ],
})
export class AppComponent {

  title = 'twitter-front';
}
