import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { TweetComponent } from '../tweet/tweet.component';

@Component({
  selector: 'app-main-tl',
  standalone: true,
  imports: [CommonModule,HeaderComponent,TweetComponent,NgIf],
  templateUrl: './main-tl.component.html',
  styleUrls: ['./main-tl.component.css']
})
export class MainTlComponent implements OnInit {

  constructor() { }
  public hayTweets:boolean=true
  public tweetsNuevos:number=5
  

  ngOnInit(): void {
  }

}
