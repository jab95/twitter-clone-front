import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { DatosService } from '../services/datos.service';
import { Tweet } from '../models/Tweet';
import { TweetsService } from '../services/tweets.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-escribir-tweet',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './escribir-tweet.component.html',
  styleUrls: ['./escribir-tweet.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class EscribirTweetComponent implements OnInit {

  private _tweet: Tweet = new Tweet()

  constructor(private datosService: DatosService, private tweetsService: TweetsService) { }

  @ViewChild("textoTweet", { static: true }) textoTeet: ElementRef

  ngOnInit(): void {
  }

  twetear() {
    this._tweet.texto = this.textoTeet.nativeElement.value
    this._tweet.foto = null
    this._tweet.usuario = localStorage.getItem("usuario")

    this.tweetsService.postTweet(this._tweet).subscribe({
      next: (tweet: Tweet) => {
        this.datosService.tweetsCargados.push(tweet)
      }, complete: () => {

      }
    })
  }
}
