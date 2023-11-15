import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private readonly _apiUrl: string = `${environment.url}/usuario`

  constructor(private http: HttpClient) { }


  public changeUsername(oldValue: string, newValue: string) {


    return lastValueFrom(this.http.put<Usuario>(`${this._apiUrl}/changeUsername`, { oldValue: oldValue, newValue: newValue }))
  }


  public changePassword(user: string, newValue: string) {


    return lastValueFrom(this.http.put<Usuario>(`${this._apiUrl}/changePassword`, { user: user, newValue: newValue }))
  }

  public changeDescription(user: string, desc: string) {


    return lastValueFrom(this.http.put<Usuario>(`${this._apiUrl}/changeDescription`, { user: user, descripcion: desc }))
  }

  public changeProfileImage(user: string, newValue: string) {

    return this.http.put<Usuario>(`${this._apiUrl}/changeProfile`, { user: user, newProfile: newValue })
  }

  public changeHeaderImage(user: string, newValue: string) {

    return this.http.put<Usuario>(`${this._apiUrl}/changeHeader`, { user: user, newHeader: newValue })
  }

  public postNewImagenProfile(imagen: Blob, filename: string) {

    const profileData = new FormData()

    profileData.append("image", imagen, filename)

    return this.http.post(`${this._apiUrl}/addImageProfile`, profileData)
  }


  public postNewImagenHeader(imagen: Blob, filename: string) {

    const headerData = new FormData()

    headerData.append("image", imagen, filename)

    return this.http.post(`${this._apiUrl}/addImageHeader`, headerData)
  }





}
