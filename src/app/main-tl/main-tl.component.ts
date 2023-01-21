import { Component, OnInit } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TweetComponent } from '../tweet/tweet.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Usuario } from '../models/Usuario';
import { HostListener } from '@angular/core';
import { Tweet } from '../models/Tweet';
import { DatosService } from '../services/datos.service';
import { TweetsService } from '../services/tweets.service';
import { ThisReceiver } from '@angular/compiler';
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
  public tweetsNuevos: number = 5
  public quedanTweetsPorVer: boolean = false;
  private _tweetsEnCarga: any;

  ngOnInit(): void {

    if (_.isNil(localStorage.getItem("usuario"))) {
      this.router.navigate(["/login"])
    }
    this._cargarTweets()
    setInterval(() => {
      this._cargarTweets(true);
    }, 20000)

  }


  cargaDatos($event) {
    this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat($event.docs), _.isEqual)
  }

  async twetear() {
    const { EscribirTweetComponent } = await import(
      '../escribir-tweet/escribir-tweet.component'
    );
    const dialogRef = this.dialog.open(EscribirTweetComponent, { width: "500px", maxHeight: "fit-content" });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }


  clickCargarMas() {

    this._cargarTweets()

  }


  _cargarTweets(conIntervalo?: boolean) {

    this.tweetsService.getTwets(this.datosService.contadorCargaTweets).subscribe({
      next: (tweets: Tweet) => {
        if (conIntervalo == null) {

          this._tweetsEnCarga = tweets;

          if (this.datosService.tweetsCargados.length < tweets.totalDocs) {

            this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(tweets.docs), _.isEqual)

          } else {

            this.datosService.hayTweetsPorVer = false;

          }
        } else {
          if (this.datosService.tweetsCargados.length < tweets.totalDocs) {
            this.datosService.hayTweetsPorVer = true;

          } else {
            this.datosService.hayTweetsPorVer = false;

          }
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        } else {

          this.datosService.hayTweets = true
        }

      }, complete: () => {
        if (this._tweetsEnCarga.docs.length != 0 && (this._tweetsEnCarga.docs.length % 4 == 0)) {

          if (conIntervalo == null) {
            this.datosService.contadorCargaTweets++
          }
        }

      }
    })
  }

}
