import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { lastValueFrom, Subscription } from 'rxjs';
import { Tweet } from 'src/app/models/Tweet';
import { LoadingService } from 'src/app/services/loading.service';
import { BuscadorComponent } from '../../components/buscador/buscador.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TweetComponent } from '../../components/tweet/tweet.component';
import { init, waitForInit } from '../../directivas/init';
import { DatosService } from '../../services/datos.service';
import { TweetsService } from '../../services/tweets.service';

@Component({
  selector: 'app-main-tl',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TweetComponent, MatProgressSpinnerModule, MatDialogModule, BuscadorComponent],
  templateUrl: './main-tl.component.html',
  styleUrls: ['./main-tl.component.css'],

})
export class MainTlComponent implements OnInit, OnDestroy {

  private _interval = null
  private _tweetsBeforeSubscribe: Subscription;
  private _tweetsAfterSubscribe: Subscription;
  private _tweetsSubscribe: Subscription;
  loading: boolean = false;
  private _tweetsAnteriores: any;

  constructor(private dialog: MatDialog, private loadingService: LoadingService, private router: Router, public datosService: DatosService, private tweetsService: TweetsService) {
    this.datosService.estaEnMain = true


  }



  @waitForInit
  ngOnInit(): void {
    if (_.isNil(localStorage.getItem("usuario"))) {
      this.router.navigate(["/login"])
    }

    this._interval = setInterval(() => {
      this.cargarTweetsPosteriores("intervalo");
    }, 7000)

  }

  @init
  async cargaTweetsBeforeInit() {

    await this.cargarTweets(localStorage.getItem("currentLocation"))

  }

  ngOnDestroy(): void {

    if (!_.isNil(this._interval)) {

      clearInterval(this._interval)
    }
    this.datosService.estaEnMain = false

    this._tweetsAfterSubscribe?.unsubscribe()
    this._tweetsBeforeSubscribe?.unsubscribe()
    this._tweetsSubscribe?.unsubscribe()



  }

  cargaDatos($event: any) {
    this.datosService.tweetsCargados.unshift($event[0])
    this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)

  }

  async twetear() {
    const { EscribirTweetComponent } = await import(
      '../../components/escribir-tweet/escribir-tweet.component'
    );
    const dialogRef = this.dialog.open(EscribirTweetComponent, { width: "500px", maxHeight: "fit-content" });

    dialogRef.afterClosed().subscribe(result => {
      if (_.isEqual(result, "enviado")) {

        window.scroll({
          top: 0,
          left: 0,
        });
      }
    });
  }


  async cargarTweets(currentLocation?: string) {

    if (_.isEqual(currentLocation, "main") || _.isEmpty(this.datosService.tweetsCargados)) {

      const tweets: Tweet = await lastValueFrom(this.tweetsService.getTwets(this.datosService.contadorCargaTweets))
      if (this.datosService.tweetsCargados.length < tweets.totalDocs) {

        this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(tweets.docs), _.isEqual)
      } else {
        this.datosService.hayTweetsPorVerMain = false;

      }

      if (tweets.totalDocs == 0) {
        this.datosService.hayTweets = false
        this.datosService.tweetsCargados = []
        this.datosService.contadorCargaTweets = 1
      } else {

        this.datosService.hayTweets = true
        this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados)?.fecha

      }
    } else {
      if (this.datosService.tweetsCargados.length) {
        this.datosService.hayTweets = true
      }
    }

    localStorage.setItem("currentLocation", "main")

  }


  cargarTweetsAnteriores() {


    this.datosService.fechaAnterior = _.last(this.datosService.tweetsCargados)?.fecha

    this._tweetsBeforeSubscribe = this.tweetsService.getTweetsBeforeDate(this.datosService.contadorCargaTweets, this.datosService.fechaAnterior).subscribe({
      next: (tweets: any) => {

        if (tweets.length != 0) {
          this.datosService.hayTweetsPorVerMain = false
          this._tweetsAnteriores = tweets
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        }

      }, complete: () => {

        if (this._tweetsAnteriores && (this._tweetsAnteriores.length != 0 && (this._tweetsAnteriores.length % 4 == 0))) {

          this.datosService.contadorCargaTweets++
        }

        if (this._tweetsAnteriores != undefined)
          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(this._tweetsAnteriores), _.isEqual)

      }
    })
  }
  cargarTweetsPosteriores(intervalo?) {
    let posteriores
    this._tweetsAfterSubscribe = this.tweetsService.getTweetsAfterDate(this.datosService.contadorCargaTweets, this.datosService.fechaPosterior).subscribe({
      next: (tweets: any) => {

        if (tweets.length != 0) {
          this.datosService.hayTweetsPorVerMain = true
          posteriores = tweets
        }



        if (intervalo == null && this.datosService.hayTweetsPorVerMain) {



          this.datosService.tweetsCargados = this.datosService.tweetsCargados.concat(tweets)
          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)
          this.datosService.tweetsCargados = _.orderBy(this.datosService.tweetsCargados, ["fecha"], ["desc"])

        }

        for (const tweet of tweets) {
          if (this.datosService.tweetsCargados.includes(tweet)) {
            this.datosService.hayTweetsPorVerMain = false
          }
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        }

      }, complete: () => {

        if (posteriores && (posteriores.length != 0 && (posteriores.length % 4 == 0))) {

          this.datosService.contadorCargaTweets++
        }
        if (this.datosService.tweetsCargados.length != 0) {
          this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados)?.fecha
        }

      }
    })
  }

}
