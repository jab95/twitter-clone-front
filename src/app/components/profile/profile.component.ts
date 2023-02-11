import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { DatosService } from '../../services/datos.service';
import { ActivatedRoute, NavigationStart, Route, Router } from '@angular/router';
import { TweetsService } from '../../services/tweets.service';
import * as _ from "lodash"
import { TweetComponent } from '../tweet/tweet.component';
import { Tweet } from '../../models/Tweet';
import { init, waitForInit } from '../../directivas/init';
import { lastValueFrom, Subscription } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../models/Usuario';
import { environment } from 'src/environments/environment';
declare var require: any

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TweetComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  username: string
  private _tweetsAnteriores: any;
  fotoPerfil: string
  tweetsCargadosProfile: Tweet[];
  contadorCargaTweetsProfile: number = 1;
  descripcion: string;
  private _interval = null

  private _tweetsAfterSubscriber: Subscription;
  private _tweetsBeforeSubscriber: Subscription;
  private _tweetsProfileSubscriber: Subscription;



  constructor(public datosService: DatosService, private router: Router, private userService: LoginService, private route: ActivatedRoute, private tweetsService: TweetsService) {

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
    this._tweetsProfileSubscriber?.unsubscribe()
  }


  ngOnInit(): void {



    lastValueFrom(this.userService.findUserByName(this.username)).then((data: Usuario) => {

      if (data.fotoPerfil == "profile-default") {
        this.fotoPerfil = "/assets/logo-angular.png"
      } else {
        this.fotoPerfil = environment.url + "/images/profiles/" + data.fotoPerfil

      }

      this.descripcion = data.descripcion

    })

    this.cargarTweets()

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

        if (this._tweetsAnteriores && (this._tweetsAnteriores.length != 0 && (this._tweetsAnteriores.length % 4 == 0))) {
          this.contadorCargaTweetsProfile++
        }

        if (this._tweetsAnteriores != undefined)
          this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(this._tweetsAnteriores), _.isEqual)

      }
    })
  }

  cargarTweets() {


    this._tweetsProfileSubscriber = this.tweetsService.getTwetsByProfile(this.username, this.contadorCargaTweetsProfile).subscribe({
      next: (tweets: Tweet) => {

        this.tweetsCargadosProfile = []


        if (this.tweetsCargadosProfile.length < tweets.totalDocs) {

          this.tweetsCargadosProfile = _.uniqWith(this.tweetsCargadosProfile.concat(tweets.docs), _.isEqual)

        } else {


          this.datosService.hayTweetsPorVerProfile = false;

        }



        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.tweetsCargadosProfile = []
          this.contadorCargaTweetsProfile = 1
        } else {

          this.datosService.hayTweets = true
          this.datosService.fechaPosteriorProfile = _.first(this.tweetsCargadosProfile)?.fecha

        }

      }, complete: () => {


        if (this.tweetsCargadosProfile.length != 0 && (this.tweetsCargadosProfile.length % 4 == 0)) {

          this.contadorCargaTweetsProfile++
        }

      }
    })
  }



}
