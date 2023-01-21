import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Input } from '@angular/core';
import { Tweet } from '../models/Tweet';
import { AfterViewInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit, AfterViewInit {


  @Input() tweetActual: Tweet;
  public imagenTweet: string

  public imagenAdjuntada: boolean = false
  constructor() { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.imagenAdjuntada = this.tweetActual.foto ? true : false

    this.imagenTweet = environment.url + "/images/" + this.tweetActual._id + "_" + this.tweetActual.foto.replace(new RegExp(" ", 'g'), "_")
  }
  goToUrl() {
    window.open(this.imagenTweet, '_blank').focus();
  }

}
