import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  url: string = `http://localhost:3000`

  constructor(private http: HttpClient) { }


  public postUser(usuario: Usuario) {

    return this.http.post(`${this.url}/usuario/add`, usuario)
  }
}
