import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tweet } from '../models/Tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  private readonly _apiUrl: string = `${environment.url}/tweet`

  constructor(private http: HttpClient) { }


  public postTweet(tweet: Tweet) {

    return this.http.post<Tweet>(`${this._apiUrl}/add`, tweet)
  }

  public postImagenEnTweet(imagen: Blob, filename: string) {

    const profileData = new FormData()

    console.log("imagen: " + imagen)
    console.log("imagen filename: " + filename)
    profileData.append("image", imagen, filename)

    return this.http.post<Tweet>(`${this._apiUrl}/addImageTweet`, profileData)
  }

  public getTwets(contadorCargaTweets: number) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)


    return this.http.get<Tweet>(`${this._apiUrl}/getTweets`, { params })

  }

  public getTwetsByProfile(user: string, contadorCargaTweets: number) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('user', user)


    return this.http.get<Tweet>(`${this._apiUrl}/getTweetsByProfile`, { params })
  }

  public getTweetsBeforeDate(contadorCargaTweets: number, fecha: Date) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha?.toString())


    return this.http.get<Tweet>(`${this._apiUrl}/getTweetsBeforeDate`, { params })
  }

  public getTweetsBeforeDateByUser(contadorCargaTweets: number, fecha: Date, user: string) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha?.toString())
      .set('user', user)


    return this.http.get<Tweet>(`${this._apiUrl}/getTweetsBeforeDateByUser`, { params })
  }


  public getTweetsAfterDate(contadorCargaTweets: number, fecha: Date) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha?.toString())

    return this.http.get<Tweet>(`${this._apiUrl}/getTweetsAfterDate`, { params })
  }

  public getTweetsAfterDateByUser(contadorCargaTweets: number, fecha: Date, user: string) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha?.toString())
      .set('user', user)


    return this.http.get<Tweet>(`${this._apiUrl}/getTweetsAfterDateByUser`, { params })
  }


  public getCountTweets() {


    return this.http.get<number>(`${this._apiUrl}/getCountTweets`)
  }


  public deleteTweet(id: string) {


    return this.http.delete(`${this._apiUrl}/remove/${id}`)
  }






}
