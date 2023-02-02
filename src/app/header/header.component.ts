import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { TweetsService } from '../services/tweets.service';
import { Tweet } from '../models/Tweet';
import { DatosService } from '../services/datos.service';
import * as _ from "lodash"
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<Object>();

  constructor(private _tweetsService: TweetsService, private datosService: DatosService) { }

  public id: string = "pepe"
  private _tweets: any

  ngOnInit(): void {
  }

  irArriba() {

    this._tweetsService.getCountTweets().subscribe({
      next: (count) => {

        if (count == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        }
      }
    })

    this._tweetsService.getTweetsAfterDate(this.datosService.contadorCargaTweets, this.datosService.fechaPosterior).subscribe({
      next: (tweets: any) => {

        this.datosService.maximosDocs = tweets.totalDocs


        if (tweets.length != 0) {
          this.datosService.hayTweetsPorVer = false

          this._tweets = tweets
          this.newItemEvent.emit(tweets)
        }


      }, complete: () => {

        if (this._tweets && (this._tweets.length != 0 && (this._tweets.length % 4 == 0))) {
          this.datosService.contadorCargaTweets++
        }
        if (this.datosService.hayTweets) this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados).fecha
        window.scroll({
          top: 0,
          left: 0,
        });

      }
    })


  }

  logout() {
    localStorage.removeItem("usuario")
    this.datosService.removeAllItems()
  }
}
