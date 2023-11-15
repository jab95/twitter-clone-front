import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly _apiUrl: string = `${environment.url}/usuario`

  constructor(private http: HttpClient) { }

  public findUser(user: string, pass: string) {
    return this.http.get<Usuario>(`${this._apiUrl}/get?user=${user}&pass=${pass}`)

  }

  public findUserByName(user: string) {
    return this.http.get<Usuario>(`${this._apiUrl}/getByName?user=${user}`)

  }

  public findUsersFilterByName(user: string) {
    return this.http.get<Usuario[]>(`${this._apiUrl}/getFiltersByName?user=${user}`)

  }
}
