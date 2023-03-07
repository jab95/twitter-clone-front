import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url: string = environment.url

  constructor(private http: HttpClient) { }

  public findUser(user: string, pass: string) {
    return this.http.get<Usuario>(`${this._url}/usuario/get?user=${user}&pass=${pass}`)

  }

  public findUserByName(user: string) {
    return this.http.get<Usuario>(`${this._url}/usuario/getByName?user=${user}`)

  }

  public findUsersFilterByName(user: string) {
    return this.http.get<Usuario[]>(`${this._url}/usuario/getFiltersByName?user=${user}`)

  }
}
