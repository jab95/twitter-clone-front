import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Usuario } from '../models/Usuario';
import { first, lastValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public router: Router, private _loginService: LoginService) { }

  private _activate: boolean = false

  async canActivate(): Promise<true | UrlTree> {
    const user = localStorage.getItem("usuario")
    console.log(user)
    if (user == null || user == "") {
      this._activate = false
      console.log("no hay")

    } else {

      await lastValueFrom(this._loginService.findUserByName(user)
        .pipe(
          first(),
          map((usuario) => {
            return usuario?.user ?? ""
          }))
      ).then((username) => {
        console.log("usernameee")
        console.log(username)
        if (username != "") {
          this._activate = true
        }
        if (!this._activate) {
          console.log("no ha activado")
          this._activate = false
        }

      })
    }
    console.log(this._activate)

    return this._activate ? true : this.router.parseUrl('login');
  }

}