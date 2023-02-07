import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  url: string = environment.url

  constructor(private http: HttpClient) { }


  public changeUsername(oldValue: string, newValue: string) {


    return this.http.put(`${this.url}/usuario/changeUsername`, { oldValue: oldValue, newValue: newValue })
  }

  public changeDescription(user: string, desc: string) {


    return this.http.put(`${this.url}/usuario/changeDescription`, { user: user, descripcion: desc })
  }

  public changeProfile(user: string, newValue: string) {

    return this.http.put(`${this.url}/usuario/changeProfile`, { user: user, newProfile: newValue })
  }

  public postProfile(imagen: Blob, filename: string) {

    const profileData = new FormData()

    profileData.append("image", imagen, filename)

    return this.http.post(`${this.url}/usuario/addImageProfile`, profileData)
  }




}
