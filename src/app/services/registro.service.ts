import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  url: string = environment.url
  constructor(private http: HttpClient) { }


  public postUser(usuario: Usuario) {

    return this.http.post(`${this.url}/usuario/add`, usuario)
  }
}
