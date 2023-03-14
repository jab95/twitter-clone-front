import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from "lodash";
import { delay, first, lastValueFrom, Subscription } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { HeaderComponent } from '../../components/header/header.component';
import { TweetComponent } from '../../components/tweet/tweet.component';
import { init, waitForInit } from '../../directivas/init';
import { Tweet } from '../../models/Tweet';
import { Usuario } from '../../models/Usuario';
import { DatosService } from '../../services/datos.service';
import { LoginService } from '../../services/login.service';
import { TweetsService } from '../../services/tweets.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TweetComponent, MatProgressSpinnerModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  username: string
  private _tweetsAnteriores: any;
  fotoPerfil: string
  fotoCabecera: string
  tweetsCargadosProfile: Tweet[];
  contadorCargaTweetsProfile: number = 1;
  descripcion: string;
  private _interval = null
  loading: boolean = false;

  private _tweetsAfterSubscriber: Subscription;
  private _tweetsBeforeSubscriber: Subscription;
  private _loadingSubsciption$: Subscription;
  private _profileSubscription$: Subscription;
  private _fondoGris: string = "../../../assets/gray.png"

  constructor(public datosService: DatosService, private loadingService: LoadingService, private router: Router, private userService: LoginService, private route: ActivatedRoute, private tweetsService: TweetsService) {



    localStorage.setItem("currentLocation", "profile")
    this.datosService.hayTweets = false

    if (this.route.snapshot.paramMap.get("usuario") == "" || this.route.snapshot.paramMap.get("usuario") == undefined) {
      this.username = localStorage.getItem("usuario")

    } else {
      this.username = this.route.snapshot.paramMap.get("usuario")
    }


    // if (this.route.snapshot.paramMap.get("usuario") == "" || this.route.snapshot.paramMap.get("usuario") == undefined) {
    //   this.username = localStorage.getItem("usuario")
    // } else {
    //   this.username = this.route.snapshot.paramMap.get("usuario")

    // }






    // if (this._isUsuarioActual()) {

    //   this.fotoPerfil = this.datosService.usuarioActual.fotoPerfil ?? this._fondoGris
    //   this.fotoCabecera = this.datosService.usuarioActual.fotoCabecera ?? this._fondoGris
    // } else {

    //   this.fotoPerfil = this._fondoGris
    //   this.fotoCabecera = this._fondoGris
    // }


  }

  ngOnDestroy(): void {
    if (!_.isNil(this._interval)) {

      clearInterval(this._interval)
    }

    this._tweetsAfterSubscriber?.unsubscribe()
    this._tweetsBeforeSubscriber?.unsubscribe()
    this._loadingSubsciption$?.unsubscribe()
    this._profileSubscription$?.unsubscribe()
  }


  // @waitForInit
  ngOnInit(): void {



    this._profileSubscription$ = this.datosService.currentUserSubject.pipe().subscribe((datos: Usuario) => {

      this._reiniciarContadores()

      this.username = datos.user ?? this.route.snapshot.paramMap.get("usuario")

      if (this._isUsuarioActual()) {

        this.fotoPerfil = this.datosService.usuarioActual.fotoPerfil ?? this._fondoGris
        this.fotoCabecera = this.datosService.usuarioActual.fotoCabecera ?? this._fondoGris


      } else {

        this.fotoPerfil = this._fondoGris
        this.fotoCabecera = this._fondoGris
      }

      this.datosService.usuarioActual.user = localStorage.getItem("usuario")

      this.cargarTweets()

    })


    if (_.isEqual(this.fotoPerfil, this._fondoGris) || _.isEqual(this.fotoCabecera, this._fondoGris)) {
      lastValueFrom(this.userService.findUserByName(this.username)).then((data: Usuario) => {

        this.fotoPerfil = data.fotoPerfil
        this.fotoCabecera = data.fotoCabecera
        this.descripcion = data.descripcion

        if (this._isUsuarioActual()) {
          this.datosService.usuarioActual = { user: localStorage.getItem("usuario"), descripcion: this.descripcion, fotoCabecera: this.fotoCabecera, fotoPerfil: this.fotoPerfil }
        }
      })
    }



    this._interval = setInterval(() => {
      this.cargarTweetsPosteriores("intervalo");
    }, 5000)


  }


  cargarTweetsPosteriores(intervalo?) {
    let posteriores
    this._tweetsAfterSubscriber = this.tweetsService.getTweetsAfterDateByUser(this.contadorCargaTweetsProfile, this.datosService.fechaPosteriorProfile, this.username).subscribe({
      next: (tweets: any) => {
        if (tweets.length != 0) {

          this.datosService.hayTweetsPorVerProfile = true
          posteriores = tweets
        }



        if (intervalo == null && this.datosService.hayTweetsPorVerProfile) {

          this.tweetsCargadosProfile = this.tweetsCargadosProfile.concat(tweets)
          this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile, _.isEqual)
          this.tweetsCargadosProfile = _.orderBy(this.tweetsCargadosProfile, ["fecha"], ["desc"])

        }

        for (const tweet of tweets) {
          if (this.tweetsCargadosProfile.includes(tweet)) {

            this.datosService.hayTweetsPorVerProfile = false
          }
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.tweetsCargadosProfile = []
          this.contadorCargaTweetsProfile = 1
        }

      }, complete: () => {

        if (posteriores && (posteriores.length != 0 && (posteriores.length % 4 == 0))) {
          this.contadorCargaTweetsProfile++
        }
        if (this.tweetsCargadosProfile.length != 0) {
          this.datosService.fechaPosteriorProfile = _.first(this.tweetsCargadosProfile)?.fecha
        }

      }
    })
  }

  cargarTweetsAnteriores() {


    this.datosService.fechaAnteriorProfile = _.last(this.tweetsCargadosProfile)?.fecha

    this._tweetsBeforeSubscriber = this.tweetsService.getTweetsBeforeDateByUser(this.contadorCargaTweetsProfile, this.datosService.fechaAnteriorProfile, this.username).subscribe({
      next: (tweets: any) => {

        if (tweets.length != 0) {

          this.datosService.hayTweetsPorVerProfile = false
          this._tweetsAnteriores = tweets
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.tweetsCargadosProfile = []
          this.contadorCargaTweetsProfile = 1
        }

      }, complete: () => {

        if (this._tweetsAnteriores && (this._tweetsAnteriores.length && (this._tweetsAnteriores.length % 4 == 0))) {
          this.contadorCargaTweetsProfile++
        }

        if (this._tweetsAnteriores != undefined)
          this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(this._tweetsAnteriores), _.isEqual)

      }
    })
  }

  cargarTweets() {

    lastValueFrom(this.tweetsService.getTwetsByProfile(this.username, this.contadorCargaTweetsProfile)).then((tweets: Tweet) => {
      this.tweetsCargadosProfile = []

      if (this.tweetsCargadosProfile.length < tweets.totalDocs) {

        this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(tweets.docs), _.isEqual)

      } else {


        this.datosService.hayTweetsPorVerProfile = false;

      }


      if (!tweets.totalDocs) {
        this._reiniciarContadores()
      } else {

        this.datosService.hayTweets = true
        this.datosService.fechaPosteriorProfile = _.first(this.tweetsCargadosProfile)?.fecha

      }

      if (this.tweetsCargadosProfile.length && (this.tweetsCargadosProfile.length % 4 == 0)) {

        this.contadorCargaTweetsProfile++
      }

    })



  }

  private _isUsuarioActual() {
    return _.isEqual(this.username, localStorage.getItem("usuario"))
  }


  private _reiniciarContadores() {
    this.datosService.hayTweets = false
    this.tweetsCargadosProfile = []
    this.contadorCargaTweetsProfile = 1
  }


}
