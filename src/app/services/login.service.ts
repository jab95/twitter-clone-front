import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url: string = environment.url

  constructor(private http: HttpClient) { }

  public findUser(user: string, pass: string) {
    return this.http.get(`${this._url}/usuario/get?user=${user}&pass=${pass}`)

  }
}
