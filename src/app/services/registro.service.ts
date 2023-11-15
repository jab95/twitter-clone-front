import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private readonly _apiUrl: string = environment.url
  constructor(private http: HttpClient) { }


  public postUser(usuario: Usuario) {

    return this.http.post(`${this._apiUrl}/usuario/add`, usuario)
  }
}
