import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Tweet } from '../models/Tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  url: string = environment.url

  constructor(private http: HttpClient) { }


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


    return this.http.get(`${this.url}/tweet/getTweets`, { params })
  }




}
