import { Injectable } from '@angular/core';
import { Tweet } from '../models/Tweet';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  contadorCargaTweets: number = 1;
  maximosDocs: number = 0;
  hayTweets: boolean = false;
  hayTweetsPorVer: boolean = false;
  tweetsCargados: Tweet[] = [];

  constructor() { }



}
