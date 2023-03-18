import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, lastValueFrom, of } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { RegistroService } from 'src/app/services/registro.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class RegistroComponent implements OnInit {

  public errorRegistro: boolean = false

  usuario: Usuario = new Usuario()


  @ViewChild('pass', { static: true }) pass!: ElementRef;
  @ViewChild('user', { static: true }) user!: ElementRef;

  errorMessage: string;

  constructor(private registroService: RegistroService, private toastr: ToastrService, private dialogRef: MatDialogRef<RegistroComponent>) { }

  ngOnInit(): void {

  }

  hayErrores() {

    if (!/^[a-zA-Z0-9]+$/g.test(this.user.nativeElement.value)) {
      this.errorRegistro = true
      this.errorMessage = "El usuario solo permite letras y numeros"
    } else {


      if (!/(?=.*[A-Z]).{6,}/g.test(this.pass.nativeElement.value) || /\s/g.test(this.pass.nativeElement.value) || this.pass.nativeElement.value.length == 0) {
        this.errorRegistro = true
        this.errorMessage = "La contraseña debe de tener al menos 6 caracteres incluida 1 mayuscula."
      } else {
        this.errorRegistro = false

        this.usuario.pass = this.pass.nativeElement.value
        this.usuario.user = this.user.nativeElement.value
        this.usuario.fotoPerfil = environment.url + "/images/profiles/logo-angular.png"
        this.usuario.fotoCabecera = environment.url + "/images/headers/back-log.webp"

        lastValueFrom(this.registroService.postUser(this.usuario).pipe(
          catchError(() => {
            this.toastr.error("Registrado", "Ha habido un error con el registro")
            return of("")
          }))
        ).then(() => {
          this.toastr.success("Registrado", "El usuario se registro correctamente")
          this.dialogRef.close()
        }
        )
      }


    };


  }

}
