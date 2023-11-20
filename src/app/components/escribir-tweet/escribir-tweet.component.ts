import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Subscription, lastValueFrom } from 'rxjs';
import { Tweet } from '../../models/Tweet';
import { DatosService } from '../../services/datos.service';
import { TweetsService } from '../../services/tweets.service';

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

  @ViewChild("textoTweet", { static: true }) private _textoTeet: ElementRef<HTMLInputElement>

  constructor(private datosService: DatosService, private tweetsService: TweetsService, private dialogRef: MatDialogRef<EscribirTweetComponent>) { }

  ngOnDestroy(): void {
    this._postTweetSubscriber?.unsubscribe()
    this._postImagenTweetSubscriber?.unsubscribe()
  }


  ngOnInit(): void {
  }

  adjuntarImagen(event: any): void {
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

  public noPuedeTweetear(): boolean {
    return _.isEqual(this._textoTeet.nativeElement.value.trim(), "") && _.isEqual(this.preview, "")
  }

  async twetear(): Promise<void> {
    this._tweet.texto = this._textoTeet.nativeElement.value
    this._tweet.foto = this.currentFile ? this.currentFile.name : ""
    this._tweet.usuario = localStorage.getItem("usuario")
    this.datosService.escribiendoTweet = true
    await lastValueFrom(this.tweetsService
      .postTweet(this._tweet)
    ).then(async (tweet: Tweet) => {
      this._tweet = tweet
      console.log("entra aqui1")
      console.log(this._tweet)

      if (this._tweet.foto) {
        console.log("entra aqui2")
        await lastValueFrom(this.tweetsService.postImagenEnTweet(this.currentFile,
          `${tweet._id}_${this.currentFile?.name?.replace(new RegExp(' ', 'g'), '_',)}`))
          .then((e) => {
            console.log("guardada: " + e)
          })
        console.log("entra aqui 3")
      }
      console.log("entra aqui 4")

      this.datosService.tweetsCargados.unshift(this._tweet)
      this.datosService.hayTweets = true
      this.datosService.fechaPosterior = this._tweet.fecha
      this.datosService.escribiendoTweet = false
      await this.dialogRef.close("enviado")

    }).catch((err) => {
      this.datosService.escribiendoTweet = false

    })
  }
}
