import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, lastValueFrom, of } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { RegistroService } from 'src/app/services/registro.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class RegistroComponent implements OnInit {

  public errorRegistro: boolean = false
  usuario: Usuario = new Usuario()
  errorMessage: string;

  registerForm: FormGroup

  constructor(private fb: FormBuilder, private readonly registroService: RegistroService, private toastr: ToastrService, private dialogRef: MatDialogRef<RegistroComponent>) { }

  ngOnInit(): void {

    this.registerForm = this.inintForm()

  }

  inintForm(): FormGroup {
    return this.fb.group({
      user: ['', [Validators.required, Validators.maxLength(6), Validators.pattern("^[a-zA-Z0-9]+$"), Validators.pattern("(?=.*[A-Z])")]],
      pass: ['', [Validators.required, Validators.maxLength(6), Validators.pattern("(?=.*[A-Z])"), this.errorPassMalFormato]],

    })
  }

  register(pass: string, user: string): void {


    console.log(this.registerForm.get('pass')?.errors)

    // const usernameRegex = /^[a-zA-Z0-9]+$/g;
    // const passwordRegex = /(?=.*[A-Z]).{6,}/g;


    // if (!usernameRegex.test(user)) {
    //   this.errorRegistro = true
    //   this.errorMessage = "El usuario solo permite letras y numeros"
    // } else {


    //   if (!passwordRegex.test(pass) || /\s/g.test(pass) || pass.length === 0) {
    //     this.errorRegistro = true
    //     this.errorMessage = "La contraseña debe de tener al menos 6 caracteres incluida 1 mayuscula."

    //   } else {
    //     this.errorRegistro = false

    //     this.usuario.pass = pass
    //     this.usuario.user = user
    //     this.usuario.fotoPerfil = `${environment.url}/images/profiles/logo-angular.png`;
    //     this.usuario.fotoCabecera = `${environment.url}/images/headers/back-log.webp`;

    //     lastValueFrom(this.registroService.postUser(this.usuario).pipe(
    //       catchError(() => {
    //         this.toastr.error("Registrado", "Ha habido un error con el registro")
    //         return of("")
    //       }))
    //     ).then(() => {
    //       this.toastr.success("Registrado", "El usuario se registro correctamente")
    //       this.dialogRef.close()
    //     }
    //     )
    //   }


    // };


  }

  errorUserObligatorio(): boolean {

    return this.registerForm?.get('user')?.touched && this.registerForm?.get('user')?.errors['required']

  }

  errorPassObligatoria(): boolean {

    return this.registerForm?.get('pass')?.touched && this.registerForm?.get('pass')?.errors['required']

  }

  errorUserMaxLength(): boolean {

    return this.registerForm?.get('user')?.touched && this.registerForm?.get('user')?.errors['maxlength']

  }

  errorPassMalFormato(control: FormControl) {

    let isValid: boolean = false

    console.log("a")

    isValid = control?.touched && (control?.errors['maxlength'] || control?.errors['pattern'] || /\s/g.test(control?.value))
    console.log(isValid)

    return isValid ? { "malformato": true } : null

  }

}
