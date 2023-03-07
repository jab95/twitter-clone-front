import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tweet } from '../models/Tweet';
import { LoadingService } from './loading.service';
import { map, finalize } from "rxjs"

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  url: string = environment.url

  constructor(private http: HttpClient, private _loadingService: LoadingService) { }


  public postTweet(tweet: Tweet) {

    return this.http.post(`${this.url}/tweet/add`, tweet)
  }

  public postImagenEnTweet(imagen: Blob, filename: string) {

    const profileData = new FormData()

    profileData.append("image", imagen, filename)

    return this.http.post(`${this.url}/tweet/addImageTweet`, profileData)
  }

  public getTwets(contadorCargaTweets) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)


    this._loadingService.setLoading(true)
    return this.http.get<Tweet>(`${this.url}/tweet/getTweets`, { params }).pipe(finalize(() => {
      this._loadingService.setLoading(false)
    }))
  }

  public getTwetsByProfile(user, contadorCargaTweets) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('user', user)


    return this.http.get(`${this.url}/tweet/getTweetsByProfile`, { params })
  }

  public getTweetsBeforeDate(contadorCargaTweets, fecha) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha)


    return this.http.get(`${this.url}/tweet/getTweetsBeforeDate`, { params })
  }

  public getTweetsBeforeDateByUser(contadorCargaTweets, fecha, user) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha)
      .set('user', user)


    return this.http.get(`${this.url}/tweet/getTweetsBeforeDateByUser`, { params })
  }


  public getTweetsAfterDate(contadorCargaTweets, fecha) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha)


    return this.http.get(`${this.url}/tweet/getTweetsAfterDate`, { params })
  }

  public getTweetsAfterDateByUser(contadorCargaTweets, fecha, user) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)
      .set('fecha', fecha)
      .set('user', user)


    return this.http.get(`${this.url}/tweet/getTweetsAfterDateByUser`, { params })
  }


  public getCountTweets() {


    return this.http.get(`${this.url}/tweet/getCountTweets`)
  }





}
