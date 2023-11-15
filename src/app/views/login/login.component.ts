import { CommonModule } from '@angular/common';
import { } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { RegistroComponent } from '../../components/registro/registro.component';
import { DatosService } from '../../services/datos.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    RegistroComponent

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  errorLogin: boolean

  private _loginSubscriber$: Subscription;

  constructor(
    private readonly loginService: LoginService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly datosService: DatosService) {
    this.errorLogin = false
  }

  ngOnDestroy(): void {
    this._loginSubscriber$?.unsubscribe()
  }

  ngOnInit(): void {


  }

  acceder(user: string, pass: string): void {


    this._loginSubscriber$ = this.loginService.findUser(user, pass)
      .subscribe({
        next: (data: Usuario) => {
          if (data) {
            this.errorLogin = false
            localStorage.setItem("usuario", data.user)
            this.datosService.profileUser = data.user
            this.datosService.usuarioActual = data
            this.router.navigate(['home'])
          } else {
            this.errorLogin = true
          }
        }, error: () => {

        }, complete: () => {

        }
      })
  }


  openDialog(): void {

    const dialogRef = this.dialog.open(RegistroComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
