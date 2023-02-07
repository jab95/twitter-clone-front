import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { Tweet } from '../../models/Tweet';
import { TweetsService } from '../../services/tweets.service';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import * as _ from 'lodash';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-escribir-tweet',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './escribir-tweet.component.html',
  styleUrls: ['./escribir-tweet.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class EscribirTweetComponent implements OnInit, OnDestroy {

  private _tweet: Tweet = new Tweet()
  public imagenAdjuntada: boolean = false
  public texto: string;
  selectedFiles: any;
  preview: string = "";
  progress: number;
  message: string;
  currentFile: File;

  private _postImagenTweetSubscriber: Subscription;
  private _postTweetSubscriber: Subscription;

  @ViewChild("textoTweet", { static: true }) textoTeet: ElementRef

  constructor(private datosService: DatosService, private tweetsService: TweetsService, private dialogRef: MatDialogRef<EscribirTweetComponent>) { }

  ngOnDestroy(): void {
    this._postTweetSubscriber?.unsubscribe()
    this._postImagenTweetSubscriber?.unsubscribe()
  }


  ngOnInit(): void {
  }

  adjuntarImagen(event: any) {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.preview = '';
        this.currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        reader.readAsDataURL(this.currentFile);
        this.imagenAdjuntada = true

      }
    }

  }

  public noPuedeTweetear() {
    return _.isEqual(this.textoTeet.nativeElement.value, "") && _.isEqual(this.preview, "")
  }

  async twetear() {
    this._tweet.texto = this.textoTeet.nativeElement.value
    this._tweet.foto = this.currentFile ? this.currentFile.name : ""
    this._tweet.usuario = localStorage.getItem("usuario")

    this._postTweetSubscriber = await this.tweetsService.postTweet(this._tweet).subscribe({
      next: async (tweet: Tweet) => {
        this._tweet = tweet
        if (this._tweet.foto) {
          this._postImagenTweetSubscriber = await this.tweetsService.postImagenEnTweet(this.currentFile, tweet._id + "_" + this.currentFile?.name?.replace(new RegExp(" ", 'g'), "_")).subscribe({

          })
        }

      }, complete: async () => {
        this.datosService.tweetsCargados.unshift(this._tweet)
        this.datosService.hayTweets = true
        this.datosService.fechaPosterior = this._tweet.fecha
        await this.dialogRef.close("enviado")
      }
    })
  }
}
