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
declare var require: any

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

  constructor(public datosService: DatosService, private loadingService: LoadingService, private router: Router, private userService: LoginService, private route: ActivatedRoute, private tweetsService: TweetsService) {

    localStorage.setItem("currentLocation", "profile")
    this.datosService.hayTweets = false
    this.fotoPerfil = "../../../assets/gray.png"

    if (this.route.snapshot.paramMap.get("usuario") == "") {
      this.username = localStorage.getItem("usuario")
    } else {
      this.username = this.route.snapshot.paramMap.get("usuario")
    }

  }

  ngOnDestroy(): void {
    if (!_.isNil(this._interval)) {

      clearInterval(this._interval)
    }

    this._tweetsAfterSubscriber?.unsubscribe()
    this._tweetsBeforeSubscriber?.unsubscribe()
    this._loadingSubsciption$?.unsubscribe()
  }


  @waitForInit
  ngOnInit(): void {

    this.listenToLoading()

    lastValueFrom(this.userService.findUserByName(this.username)).then((data: Usuario) => {


      console.log(data)

      this.fotoPerfil = data.fotoPerfil
      this.fotoCabecera = data.fotoCabecera
      this.descripcion = data.descripcion
    })

    this._interval = setInterval(() => {
      this.cargarTweetsPosteriores("intervalo");
    }, 5000)


  }

  @init
  async cargaTweets() {
    await this.cargarTweets()
  }

  listenToLoading(): void {
    this._loadingSubsciption$ = this.loadingService.loadingSub
      .pipe(delay(0), first()) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });

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

        if (this._tweetsAnteriores && (this._tweetsAnteriores.length != 0 && (this._tweetsAnteriores.length % 4 == 0))) {
          this.contadorCargaTweetsProfile++
        }

        if (this._tweetsAnteriores != undefined)
          this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(this._tweetsAnteriores), _.isEqual)

      }
    })
  }

  async cargarTweets() {

    console.log("a1")
    await lastValueFrom(this.tweetsService.getTwetsByProfile(this.username, this.contadorCargaTweetsProfile)).then((tweets: Tweet) => {
      console.log("a2")
      console.log(tweets)

      this.tweetsCargadosProfile = []

      if (this.tweetsCargadosProfile.length < tweets.totalDocs) {

        this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(tweets.docs), _.isEqual)

      } else {


        this.datosService.hayTweetsPorVerProfile = false;

      }

      console.log(this.datosService.hayTweets)
      console.log(tweets)

      if (!tweets.totalDocs) {
        console.log("aaa")
        this.datosService.hayTweets = false
        this.tweetsCargadosProfile = []
        this.contadorCargaTweetsProfile = 1
      } else {

        this.datosService.hayTweets = true
        this.datosService.fechaPosteriorProfile = _.first(this.tweetsCargadosProfile)?.fecha

      }

      if (this.tweetsCargadosProfile.length != 0 && (this.tweetsCargadosProfile.length % 4 == 0)) {

        this.contadorCargaTweetsProfile++
      }

    })



  }



}
