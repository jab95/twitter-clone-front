import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router) { }

  canActivate(): true | UrlTree {
    const user = localStorage.getItem("usuario")

    if (user == null || user == "") {
      return this.router.parseUrl('login');
    }
    return true;
  }
}