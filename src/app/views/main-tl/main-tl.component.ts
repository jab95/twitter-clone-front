import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import * as _ from "lodash";
import { finalize, interval, lastValueFrom, Subject, Subscription, takeUntil } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';
import { BuscadorComponent } from '../../components/buscador/buscador.component';
import { EscribirTweetComponent } from '../../components/escribir-tweet/escribir-tweet.component';
import { HeaderComponent } from '../../components/header/header.component';
import { TweetComponent } from '../../components/tweet/tweet.component';
import { init, waitForInit } from '../../directivas/init';
import { DatosService } from '../../services/datos.service';
import { TweetsService } from '../../services/tweets.service';

@Component({
  selector: 'app-main-tl',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TweetComponent, MatProgressSpinnerModule, MatDialogModule, BuscadorComponent],
  templateUrl: './main-tl.component.html',
  styleUrls: ['./main-tl.component.css'],

})
export class MainTlComponent implements OnInit, OnDestroy {

  private _intervalSubscription: Subscription;
  private _tweetsBeforeSubscribe: Subscription;
  private _tweetsAfterSubscribe: Subscription;
  private _loadingSubscription$: Subscription;
  private _tweetsSubscribe: Subscription;
  private _tweetsAnteriores: any;

  loading: boolean

  private _destroyed$: Subject<void> = new Subject<void>();


  constructor(
    private dialog: MatDialog,
    private readonly loadingService: LoadingService,
    private router: Router,
    public datosService: DatosService,
    private readonly tweetsService: TweetsService) {

    this.loading = true
  }



  @waitForInit
  ngOnInit(): void {

    this.datosService.estaEnMain = true

    if (!localStorage.getItem("usuario")) {
      this.router.navigate(["/login"])
    }

    this._intervalSubscription = interval(10000)
      .pipe(takeUntil(this._destroyed$))
      .subscribe(async () => {
        if (!this.datosService.escribiendoTweet)
          await this.cargarTweetsPosteriores()
      });

    this._loadingSubscription$ = this.loadingService.loadingSub$.subscribe({
      next: (loading) => {
        this.loading = loading
      }
    });


  }

  @init
  async cargaTweetsBeforeInit(): Promise<void> {

    await this.cargarTweets(localStorage.getItem("currentLocation"))

  }

  ngOnDestroy(): void {

    this._destroyed$.next();
    this._destroyed$.complete();

    this._intervalSubscription?.unsubscribe();
    this.datosService.estaEnMain = false

    this._tweetsAfterSubscribe?.unsubscribe()
    this._tweetsBeforeSubscribe?.unsubscribe()
    this._tweetsSubscribe?.unsubscribe()
    this._loadingSubscription$?.unsubscribe()

  }

  cargaDatos($event: any) {
    this.datosService.tweetsCargados.unshift($event[0])
    this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)

  }

  async twetear(): Promise<void> {

    const dialogRef = this.dialog.open(EscribirTweetComponent, { panelClass: 'escribir-tweet-dialog', width: "500px", maxHeight: "fit-content" });

    dialogRef.afterClosed().subscribe(result => {
      if (_.isEqual(result, "enviado")) {

        window.scroll({
          top: 0,
          left: 0,
        });
      }
    });
  }


  async cargarTweets(currentLocation?: string): Promise<void> {

    if (_.isEqual(currentLocation, "main") || _.isEmpty(this.datosService.tweetsCargados)) {


      this.loading = true
      const tweets = await lastValueFrom(this.tweetsService.getTwets(this.datosService.contadorCargaTweets)
        .pipe(
          finalize(() => {
            this.loading = false
          })
        ))


      if (this.datosService.tweetsCargados.length < tweets.totalDocs) {

        this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(tweets.docs), _.isEqual)
      } else {
        this.datosService.hayTweetsPorVerMain = false;

      }


      this.datosService.hayTweets = tweets.totalDocs > 0
      this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados)?.fecha


    } else if (this.datosService.tweetsCargados.length) {
      this.datosService.hayTweets = true

    }

    localStorage.setItem("currentLocation", "main")

  }


  cargarTweetsAnteriores(): void {


    this.datosService.fechaAnterior = _.last(this.datosService.tweetsCargados)?.fecha

    this._tweetsBeforeSubscribe = this.tweetsService.getTweetsBeforeDate(this.datosService.contadorCargaTweets, this.datosService.fechaAnterior).subscribe({
      next: (tweets: any) => {

        if (tweets.length) {
          this.datosService.hayTweetsPorVerMain = false
          this._tweetsAnteriores = tweets
        }

        if (tweets.totalDocs === 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        }

      }, complete: () => {

        if (this._tweetsAnteriores && this._tweetsAnteriores?.length % 4 == 0) {

          this.datosService.contadorCargaTweets++
        }

        if (this._tweetsAnteriores)
          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados.concat(this._tweetsAnteriores), _.isEqual)

      }
    })
  }

  async cargarTweetsPosteriores(intervalo: boolean = true): Promise<void> {

    this.datosService.hayTweetsPorVerMain = false
    await lastValueFrom(this.tweetsService.getTweetsAfterDate(this.datosService.contadorCargaTweets, this.datosService.fechaPosterior))
      .then((tweets: any) => {

        if (tweets.length) {
          this.datosService.hayTweetsPorVerMain = true
        }

        if (!intervalo && this.datosService.hayTweetsPorVerMain) {

          this.datosService.tweetsCargados = this.datosService.tweetsCargados.concat(tweets)
          this.datosService.tweetsCargados = _.uniqWith(this.datosService.tweetsCargados, _.isEqual)
          this.datosService.tweetsCargados = _.orderBy(this.datosService.tweetsCargados, ["fecha"], ["desc"])

        }


        for (const tweet of tweets) {

          if (this.datosService.tweetsCargados.includes(tweet)) {
            this.datosService.hayTweetsPorVerMain = false
            break;
          }
        }

        if (tweets.totalDocs == 0) {
          this.datosService.hayTweets = false
          this.datosService.tweetsCargados = []
          this.datosService.contadorCargaTweets = 1
        }

        const posteriores = this.datosService.tweetsCargados.filter(
          (tweet) => tweet.fecha > this.datosService.fechaPosterior
        );

        if (posteriores && (posteriores.length % 4 === 0)) {

          this.datosService.contadorCargaTweets++
        }

        this.datosService.fechaPosterior = _.first(this.datosService.tweetsCargados)?.fecha ?? undefined


      })
  }


  hacerModoOscuro(): void {

  }

}
