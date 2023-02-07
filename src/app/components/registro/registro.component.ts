import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ViewEncapsulation } from '@angular/core';
import { RegistroService } from 'src/app/services/registro.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/Usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, NgIf],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class RegistroComponent implements OnInit, OnDestroy {

  public errorRegistro: boolean = false

  usuario = new Usuario()


  @ViewChild('pass', { static: true }) pass!: ElementRef;
  @ViewChild('user', { static: true }) user!: ElementRef;
  private _postUserSubscriber: Subscription;

  constructor(private registroService: RegistroService, private toastr: ToastrService, private dialogRef: MatDialogRef<RegistroComponent>) { }

  ngOnDestroy(): void {
    this._postUserSubscriber?.unsubscribe()
  }

  ngOnInit(): void {

  }

  hayErrores() {

    if (!/(?=.*[A-Z]).{6,}/g.test(this.pass.nativeElement.value) || /\s/g.test(this.pass.nativeElement.value) || this.pass.nativeElement.value.length == 0) {
      this.errorRegistro = true
    } else {
      this.errorRegistro = false

      this.usuario.pass = this.pass.nativeElement.value
      this.usuario.user = this.user.nativeElement.value
      this.usuario.fotoPerfil = "profile-default"
      this._postUserSubscriber = this.registroService.postUser(this.usuario).subscribe(
        {
          next: (data) => {
          },
          error: (err) => {
            this.toastr.success("Registrado", "Ha habido un error con el registro")

          },
          complete: () => {
            this.toastr.success("Registrado", "El usuario se registro correctamente")
            this.dialogRef.close()
          }
        }
      )
    }


  }

}
