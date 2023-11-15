import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Usuario } from '../models/Usuario';
import { first, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router, private _loginService: LoginService) { }

  private _activate: boolean = false

  canActivate(): true | UrlTree {
    const user = localStorage.getItem("usuario")
    if (user == null || user == "") {
      this._activate = false
    } else {

      this._loginService.findUserByName(user)
        .pipe(
          first(),
          map((usuario) => {
            return usuario?.user ?? ""
          }))
        .subscribe((username) => {
          if (username == "") {
            this._activate = false
          }
          this._activate = true
        })
    }

    if (!this._activate) {
      return this.router.parseUrl('login');
    }

    return true
  }

}