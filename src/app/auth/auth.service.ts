import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable()
export class AuthService {

  constructor(public router: Router) { }

  canActivate(): boolean {
    const user = localStorage.getItem("usuario")

    if (user == null || user == "") {
      console.log("aa")
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}