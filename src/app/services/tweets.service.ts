import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Tweet } from '../models/Tweet';

@Injectable({
  providedIn: 'root'
})
export class TweetsService {

  url: string = `https://twitter-clone-back-production.up.railway.app:3000`

  constructor(private http: HttpClient) { }


  public postTweet(tweet: Tweet) {

    return this.http.post(`${this.url}/tweet/add`, tweet)
  }

  public getTwets(contadorCargaTweets) {

    const params = new HttpParams()
      .set('page', contadorCargaTweets)


    return this.http.get(`${this.url}/tweet/getTweets`, { params })
  }
}
