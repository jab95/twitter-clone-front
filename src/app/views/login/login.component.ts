import { CommonModule } from '@angular/common';
import { } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
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


  @ViewChild('pass', { static: true }) pass!: ElementRef;
  @ViewChild('user', { static: true }) user!: ElementRef;

  public errorLogin: boolean = false

  private _loginSubscriber: Subscription;


  constructor(private login: LoginService, private dialog: MatDialog, private router: Router, private datosService: DatosService) { }

  ngOnDestroy(): void {
    this._loginSubscriber?.unsubscribe()
  }

  ngOnInit(): void {


  }

  acceder() {


    this._loginSubscriber = this.login.findUser(this.user.nativeElement.value, this.pass.nativeElement.value).subscribe({
      next: (data: any) => {
        if (data) {
          this.errorLogin = false
          localStorage.setItem("usuario", data.user)
          this.datosService.profileUser = data.user
          this.router.navigate(['home'])
        } else {
          this.errorLogin = true
        }
      }, error: () => {

      }, complete: () => {

      }
    })
  }


  async openDialog() {

    const dialogRef = this.dialog.open(RegistroComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
