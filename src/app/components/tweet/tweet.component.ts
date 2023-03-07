import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tweet } from '../../models/Tweet';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit {


  @Input() tweetActual: Tweet;
  imagenTweet: string
  fotoPerfil: string

  public imagenAdjuntada: boolean = false
  haceCuanto: string;
  fotoPerfil$: Observable<String>;

  constructor(public userService: LoginService) {

    this.fotoPerfil = "../../../assets/gray.png"

  }

  ngOnInit(): void {



    this.fotoPerfil$ = this.userService.findUserByName(this.tweetActual.usuario).pipe(map((usuario) => {
      console.log(usuario)
      return usuario.fotoPerfil
    }))

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



  }

  goToUrl() {
    window.open(this.imagenTweet, '_blank').focus();
  }

}
