import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Tweet } from '../models/Tweet';
import { Usuario } from '../models/Usuario';

@Injectable({
  providedIn: 'root'
})

export class DatosService {

  contadorCargaTweets: number = 1;
  maximosDocs: number = 0;
  hayTweets: boolean = false;
  hayTweetsPorVerMain: boolean = false;
  hayTweetsPorVerProfile: boolean = false;
  tweetsCargados: Tweet[] = [];
  fechaPosterior: Date;
  fechaPosteriorProfile: Date;
  fechaAnterior: Date;
  fechaAnteriorProfile: Date;
  templateActual: string
  profileUser: string = ""
  estaEnMain: boolean = false
  usuarioActual: Usuario = new Usuario();

  currentUserSubject: BehaviorSubject<Usuario> = new BehaviorSubject({} as Usuario);
  escribiendoTweet: boolean = false;


  constructor() {




  }

  removeAllItems() {
    this.contadorCargaTweets = 1

    this.maximosDocs = 0
    this.hayTweets = false
    this.hayTweetsPorVerMain = false
    this.tweetsCargados = []
    this.fechaPosterior = null
    this.fechaAnterior = null
    this.templateActual = ""
    this.estaEnMain = false

  }


  setDataProfile() {
    this.currentUserSubject.next(this.usuarioActual)
  }


}
