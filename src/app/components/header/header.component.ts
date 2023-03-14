import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as _ from "lodash";
import { Subscription } from 'rxjs';
import { DatosService } from '../../services/datos.service';
import { TweetsService } from '../../services/tweets.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() newItemEvent = new EventEmitter<Object>();


  private _countTweetsSubscriber: Subscription;
  private _tweetsAferSubscriber: Subscription;

  buscadorAbierto: boolean = false

  private _tweets: any
  user: string


  constructor(private _tweetsService: TweetsService, public datosService: DatosService, private router: Router) {
    this.user = localStorage.getItem("usuario")

  }

  ngOnDestroy(): void {
    this._countTweetsSubscriber?.unsubscribe()
    this._tweetsAferSubscriber?.unsubscribe()
  }

  ngOnInit(): void {
  }

  irArriba() {


    if (this.datosService.estaEnMain) {

      this._countTweetsSubscriber = this._tweetsService.getCountTweets().subscribe({
        next: (count) => {

          if (count == 0) {
            this.datosService.hayTweets = false
            this.datosService.tweetsCargados = []
            this.datosService.contadorCargaTweets = 1
          }
        }
      })

      this._tweetsAferSubscriber = this._tweetsService.getTweetsAfterDate(this.datosService.contadorCargaTweets, this.datosService.fechaPosterior).subscribe({
        next: (tweets: any) => {

          this.datosService.maximosDocs = tweets.totalDocs


          if (tweets.length != 0) {
            this.datosService.hayTweetsPorVerMain = false

            this._tweets = tweets
            this.newItemEvent.emit(tweets)
          }


        }, complete: () => {

          if (this._tweets && (this._tweets.length != 0 && (this._tweets.length % 4 == 0))) {
            this.datosService.contadorCargaTweets++
          }

          if (this.datosService.hayTweets) this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados)?.fecha
          window.scroll({
            top: 0,
            left: 0,
          });

        }
      })
    }

  }

  goProfile() {

    console.log(localStorage.getItem("usuario"))

    this.router.navigate(["profile/", localStorage.getItem("usuario")])
    this.datosService.setDataProfile()

  }


  logout() {
    localStorage.removeItem("usuario")
    this.datosService.removeAllItems()
  }
}
