import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url: string = `https://twitter-clone-back-production.up.railway.app:3000`

  constructor(private http: HttpClient) { }

  public findUser(user: string, pass: string) {
    return this.http.get(`${this._url}/usuario/get?user=${user}&pass=${pass}`)

  }
}
