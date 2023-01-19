import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { TweetsService } from '../services/tweets.service';
import { Tweet } from '../models/Tweet';
import { DatosService } from '../services/datos.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<Object>();

  constructor(private _tweetsService: TweetsService, private datosService: DatosService) { }

  private _tweets: any

  ngOnInit(): void {
  }

  irArriba() {


    this._tweetsService.getTwets(this.datosService.contadorCargaTweets).subscribe({
      next: (tweets: any) => {
        this.datosService.maximosDocs = tweets.totalDocs


        if (tweets.docs.length != 0) {
          this.datosService.hayTweetsPorVer = false

          this._tweets = tweets
          this.newItemEvent.emit(tweets)
        }
      }, complete: () => {

        if (this._tweets.docs.length != 0 && (this._tweets.docs.length % 4 == 0)) {
          this.datosService.contadorCargaTweets++
        }

        window.scroll({
          top: 0,
          left: 0,
        });

      }
    })


  }
}
