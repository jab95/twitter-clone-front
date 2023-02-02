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
  fechaPosterior: Date;
  fechaAnterior: Date;
  templateActual: string
  usuarioActual: Usuario

  constructor() {




  }

  removeAllItems() {
    this.contadorCargaTweets = 1

    this.maximosDocs = 0
    this.hayTweets = false
    this.hayTweetsPorVer = false
    this.tweetsCargados = []
    this.fechaPosterior = null
    this.fechaAnterior = null
    this.templateActual = ""
    this.usuarioActual = null

  }



}
