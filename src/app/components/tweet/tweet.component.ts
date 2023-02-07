import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Input } from '@angular/core';
import { Tweet } from '../../models/Tweet';
import { AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DatosService } from '../../services/datos.service';
import { LoginService } from '../../services/login.service';
import { Usuario } from '../../models/Usuario';
import { init, waitForInit } from '../../directivas/init';
import { lastValueFrom } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, NgIf, RouterModule],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {


  @Input() tweetActual: Tweet;
  imagenTweet: string
  fotoPerfil: string

  public imagenAdjuntada: boolean = false
  haceCuanto: string;
  private _usuarioActual: Usuario

  constructor(private datosService: DatosService, private userService: LoginService) { }

  @waitForInit
  ngOnInit(): void {

    this.imagenAdjuntada = this.tweetActual.foto ? true : false
    // this.haceCuanto = this.tweetActual.fecha.getTime()
    let horaTweet: number = Number(new Date(this.tweetActual?.fecha).toLocaleString("es-ES", { hour: 'numeric', hour12: false, timeZone: "UTC" }))
    let horaActual: number = Number(new Date().toLocaleString("es-ES", { hour: 'numeric', hour12: false, timeZone: "UTC" }))

    if ((horaActual - horaTweet) >= 24) {
      this.haceCuanto = new Date(this.tweetActual?.fecha).toLocaleString('es-ES', { timeZone: 'UTC' }).toString().split(",")[0]

    } else {
      this.haceCuanto = (horaActual - horaTweet).toString() + "h"

    }

    this.imagenTweet = environment.url + "/images/" + this.tweetActual._id + "_" + this.tweetActual.foto.replace(new RegExp(" ", 'g'), "_");

    if (this._usuarioActual.fotoPerfil == "profile-default") {
      this.fotoPerfil = "/assets/logo-angular.png"
    } else {
      this.fotoPerfil = environment.url + "/images/profiles/" + this._usuarioActual.fotoPerfil

    }

  }

  @init
  async _getFotoPerfil() {


    await lastValueFrom(this.userService.findUserByName(this.tweetActual.usuario)).then((data: Usuario) => {

      this._usuarioActual = data

    })

  }

  goToUrl() {
    window.open(this.imagenTweet, '_blank').focus();
  }

}
