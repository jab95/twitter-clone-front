import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { first, lastValueFrom, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tweet } from '../../models/Tweet';
import { LoginService } from '../../services/login.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DatosService } from 'src/app/services/datos.service';
import * as _ from "lodash"
import { TweetsService } from 'src/app/services/tweets.service';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, RouterModule, MatMenuModule, MatIconModule],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {


  @Input() tweetActual: Tweet;
  imagenTweet: string
  fotoPerfil: string
  fotoPerfilTweet: string

  public imagenAdjuntada: boolean = false
  haceCuanto: string;
  usuarioActual: string

  constructor(public userService: LoginService, private router: Router, private dataService: DatosService, private _tweetService: TweetsService) {

    this.fotoPerfilTweet = "../../../assets/gray.png"
    this.fotoPerfil = "../../../assets/gray.png"
    this.usuarioActual = localStorage.getItem('usuario')
  }

  ngOnInit(): void {


    this.imagenAdjuntada = this.tweetActual.foto ? true : false

    lastValueFrom(this.userService.findUserByName(this.tweetActual.usuario)
      .pipe(
        first(),
        map((usuario) => {
          return usuario.fotoPerfil
        }))
    ).then((perfil) => {
      this.fotoPerfilTweet = perfil
    })

    // this.haceCuanto = this.tweetActual.fecha.getTime()
    const horaTweet = new Date(this.tweetActual.fecha).getUTCHours();
    const horaActual = new Date().getUTCHours();

    if ((horaActual - horaTweet) >= 24) {
      this.haceCuanto = new Date(this.tweetActual.fecha).toLocaleString('es-ES', { timeZone: 'UTC' }).toString().split(',')[0];
    } else {
      this.haceCuanto = `${horaActual - horaTweet}h`;
    }

    this.imagenTweet = `${environment.url}/images/${this.tweetActual._id}_${this.tweetActual.foto.replace(new RegExp(' ', 'g'), '_')}`;


  }

  eliminarTweet(_id: string) {
    this._tweetService.deleteTweet(_id)
      .pipe(first())
      .subscribe(
        {
          next: (a) => {
            this.dataService.tweetsCargados = _.reject(this.dataService.tweetsCargados, (tweet) => tweet._id == _id)
          }, complete: () => {
            if (!this.dataService.tweetsCargados.length) {
              this.dataService.hayTweets = false
            }
          }
        })


  }

  goToUrl() {
    window.open(this.imagenTweet, '_blank').focus();
  }

  goProfile() {

    this.dataService.currentUserSubject.next({ user: this.tweetActual.usuario })
    this.router.navigate(["profile/", this.tweetActual.usuario])
  }
}
