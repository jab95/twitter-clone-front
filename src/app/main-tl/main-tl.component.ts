import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TweetComponent } from '../tweet/tweet.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Tweet } from '../models/Tweet';
import { DatosService } from '../services/datos.service';
import { TweetsService } from '../services/tweets.service';
import * as _ from "lodash"
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-tl',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TweetComponent, MatDialogModule, NgIf, NgFor,],
  templateUrl: './main-tl.component.html',
  styleUrls: ['./main-tl.component.css']
})
export class MainTlComponent implements OnInit {

  constructor(private dialog: MatDialog, private router: Router, public datosService: DatosService, private tweetsService: TweetsService) { }

  private _tweetsAnteriores: any;

  ngOnInit(): void {

    this.datosService.templateActual = "home"

    if (_.isNil(localStorage.getItem("usuario"))) {
      this.router.navigate(["/login"])
    }
    this.cargarTweets()
    setInterval(() => {
      this.cargarTweetsPosteriores("intervalo");
    }, 20000)

  }


  cargaDatos($event: any) {
    this.datosService.tweetsCargados.unshift($event[0])
    this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)

  }

  async twetear() {
    const { EscribirTweetComponent } = await import(
      '../escribir-tweet/escribir-tweet.component'
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


  cargarTweets() {

    this.tweetsService.getTwets(this.datosService.contadorCargaTweets).subscribe({
      next: (tweets: Tweet) => {


        if (this.datosService.tweetsCargados.length < tweets.totalDocs) {

          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(tweets.docs), _.isEqual)

        } else {


          this.datosService.hayTweetsPorVer = false;

        }



        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        } else {

          this.datosService.hayTweets = true
          this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados).fecha

        }

      }, complete: () => {


        if (this.datosService.tweetsCargados.length != 0 && (this.datosService.tweetsCargados.length % 4 == 0)) {

          this.datosService.contadorCargaTweets++
        }

      }
    })
  }

  cargarTweetsAnteriores() {


    this.datosService.fechaAnterior = _.last(this.datosService.tweetsCargados).fecha

    this.tweetsService.getTweetsBeforeDate(this.datosService.contadorCargaTweets, this.datosService.fechaAnterior).subscribe({
      next: (tweets: any) => {

        if (tweets.length != 0) {
          this.datosService.hayTweetsPorVer = false
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
    this.tweetsService.getTweetsAfterDate(this.datosService.contadorCargaTweets, this.datosService.fechaPosterior).subscribe({
      next: (tweets: any) => {

        if (tweets.length != 0) {
          this.datosService.hayTweetsPorVer = true
          posteriores = tweets
        }



        if (intervalo == null && this.datosService.hayTweetsPorVer) {



          this.datosService.tweetsCargados = this.datosService.tweetsCargados.concat(tweets)
          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)
          this.datosService.tweetsCargados = _.orderBy(this.datosService.tweetsCargados, ["fecha"], ["desc"])

        }

        for (const tweet of tweets) {
          if (this.datosService.tweetsCargados.includes(tweet)) {
            this.datosService.hayTweetsPorVer = false
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
          this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados).fecha
        }

      }
    })
  }

}
