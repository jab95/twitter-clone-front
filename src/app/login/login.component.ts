import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../services/login.service';
import { } from '@angular/common/http';
import { CommonModule, NgIf } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RegistroComponent } from '../registro/registro/registro.component';
import { MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { DatosService } from '../services/datos.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    NgIf,

  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  @ViewChild('pass', { static: true }) pass!: ElementRef;
  @ViewChild('user', { static: true }) user!: ElementRef;

  public errorLogin: boolean = false


  constructor(private login: LoginService, private dialog: MatDialog, private router: Router, private datosService: DatosService) { }

  ngOnInit(): void {


  }

  acceder() {


    this.login.findUser(this.user.nativeElement.value, this.pass.nativeElement.value).subscribe({
      next: (data: any) => {
        if (data) {
          this.errorLogin = false
          localStorage.setItem("usuario", data.user)
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
    const { RegistroComponent } = await import(
      '../registro/registro/registro.component'
    );
    const dialogRef = this.dialog.open(RegistroComponent, { disableClose: true });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
