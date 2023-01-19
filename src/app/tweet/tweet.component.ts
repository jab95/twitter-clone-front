import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Input } from '@angular/core';
import { Tweet } from '../models/Tweet';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-tweet',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.css']
})
export class TweetComponent implements OnInit, AfterViewInit {


  @Input() tweetActual: Tweet;

  public imagen: string = "../../assets//back-log.webp"
  public imagenAdjuntada: boolean = true
  constructor() { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
  }

}
