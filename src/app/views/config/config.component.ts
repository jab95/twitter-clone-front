import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, first, lastValueFrom, map, of, Subscription, switchMap, } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../../components/header/header.component';
import { Usuario } from '../../models/Usuario';
import { ConfigService } from '../../services/config.service';
import { DatosService } from '../../services/datos.service';
import { LoginService } from '../../services/login.service';
import * as _ from "lodash"
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatProgressSpinnerModule],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
})
export class ConfigComponent implements OnInit, OnDestroy {

  private _selectedFile: File;
  private _changeUserSubscriber: Subscription;
  private _changeDescSubscriber: Subscription;
  private _postProfileSubscriber: Subscription;
  private _changeProfileSubscriber: Subscription;
  private readonly _imagenGris: string = "../../../assets/gray.png"

  loadingHeader: boolean;
  loadingProfile: boolean;
  preview: string = "";
  previewCabecera: string = "";

  constructor(
    private readonly configService: ConfigService,
    private readonly toastr: ToastrService,
    private readonly userService: LoginService,
    private readonly datosService: DatosService) { }




  ngOnDestroy(): void {

    this._changeDescSubscriber?.unsubscribe()
    this._changeProfileSubscriber?.unsubscribe()
    this._changeUserSubscriber?.unsubscribe()
    this._postProfileSubscriber?.unsubscribe()
  }

  ngOnInit(): void {

    localStorage.setItem("currentLocation", "config")
    this.preview = this.datosService.usuarioActual.fotoPerfil ?? this._imagenGris
    this.previewCabecera = this.datosService.usuarioActual.fotoCabecera ?? this._imagenGris
    this.datosService.templateActual = "config"

    if (_.isEqual(this.preview, this._imagenGris) || _.isEqual(this.previewCabecera, this._imagenGris)) {
      this._getFotosUsuario();
    }

  }

  changeUsername(newValue: string): void {

    if (newValue) {
      this.configService.changeUsername(localStorage.getItem("usuario"), newValue)
        .then((dat: Usuario) => {
          this.toastr.success("Cambiado", "El usuario se cambio correctamente")
          localStorage.setItem("usuario", dat.user)
          this.datosService.usuarioActual = dat
          this.datosService.setDataProfile()
        })
        .catch(() => {
          this.toastr.error("Error", "Ha habido un error al cambiar el usuario")

        })
    }

  }

  changePassword(newValue: string): void {

    if (newValue) {
      this.configService.changePassword(localStorage.getItem("usuario"), newValue)
        .then(() => {
          this.toastr.success("Cambiado", "La contraseña se cambio correctamente")
        })
        .catch(() => {
          this.toastr.error("Error", "Ha habido un error al cambiar la contraseña")

        })
    }

  }

  async changeDescription(newValue: string): Promise<void> {

    if (newValue) {
      await this.configService.changeDescription(localStorage.getItem("usuario"), newValue)
        .then(() =>
          this.toastr.success("Cambiado", "La descripcion se cambió correctamente")

        ).catch(() => {
          this.toastr.error("Error", "Ha habido un error al cambiar la descripción")
        })
    }

  }


  async adjuntarImagen(event: any, tipo: 'perfil' | 'cabecera'): Promise<void> {

    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;


    if (this.checkErrorsFileTypes(input.files)) return

    this._selectedFile = input.files[0];

    const reader = new FileReader();

    reader.onload = (e) => {
      tipo === "perfil" ? this.preview = e.target?.result as string : this.previewCabecera = e.target?.result as string
    };

    reader.readAsDataURL(this._selectedFile);

    if (_.isEqual(tipo, 'perfil')) {
      await this.cambiaPerfil(this._selectedFile);
    } else {
      await this.cambiaImagenCabecera(this._selectedFile);
    }

  }

  async cambiaPerfil(file: File): Promise<void> {


    let urlNewProfile = `${environment.url}/images/profiles/profile-${localStorage.getItem("usuario")}.${file.type.split("/")[1]}?t=${Date.now()}`

    //hacemos uso de rxjs para hacer unas pruebas

    this.loadingProfile = true
    this._changeProfileSubscriber = this.configService.postNewImagenProfile(file, urlNewProfile)
      .pipe(
        first(),
        catchError(() => {
          this.toastr.error("Error", "Ha habido un error al cambiar la foto de perfil")
          return of(null)
        }),
        switchMap(() => {
          return this.configService.changeProfileImage(localStorage.getItem("usuario"), urlNewProfile)
        }),
        map((val) => {
          return val.user
        })
        , finalize(() => {
          this.loadingProfile = false
        })

      ).subscribe({
        next: (val: string) => {
          if (!_.isNil(val)) {
            console.log("en config: " + urlNewProfile)
            const newu = urlNewProfile.replace("\?.*$", '')
            this.datosService.usuarioActual.fotoPerfil = newu

            localStorage.setItem("usuario", val)
            this.toastr.success("Cambiado", "La foto de perfil se cambió correctamente")
          }
        }
      })

  }

  async cambiaImagenCabecera(file: File): Promise<void> {


    const urlNewCabecera = `${environment.url}/images/headers/header-${localStorage.getItem("usuario")}.${file.type.split("/")[1]}?t=${Date.now()}`

    //hacemos uso de rxjs para hacer unas pruebas

    this.loadingHeader = true
    this._changeProfileSubscriber = this.configService.postNewImagenHeader(file, urlNewCabecera)
      .pipe(
        first(),
        catchError((e) => {
          this.toastr.error("Error", "Ha habido un error al cambiar la imagen de cabecera")
          return of(null)
        }),
        switchMap(() => {

          return this.configService.changeHeaderImage(localStorage.getItem("usuario"), urlNewCabecera)
        }),
        map((val) => {

          return val.user
        })
        , finalize(() => {
          this.loadingHeader = false
        })

      ).subscribe({

        next: (val: string) => {

          if (!_.isNil(val)) {
            localStorage.setItem("usuario", val)
            this.toastr.success("Cambiado", "La imagen de cabecera se cambió correctamente")
            const newu = urlNewCabecera.replace("\?.*$", '')
            this.datosService.usuarioActual.fotoCabecera = newu
          }
        }
      })

  }

  _getFotosUsuario() {

    lastValueFrom(this.userService.findUserByName(localStorage.getItem("usuario")))
      .then((data: Usuario) => {

        this.preview = data.fotoPerfil || this._imagenGris
        this.previewCabecera = data.fotoCabecera || this._imagenGris
        this.datosService.usuarioActual.fotoPerfil = this.preview
        this.datosService.usuarioActual.fotoCabecera = this.previewCabecera

      })

  }

  checkErrorsFileTypes(files: FileList): boolean {

    let error: boolean = false;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    if (!allowedTypes.includes(files[0].type)) {
      // reject the file
      this.toastr.error("Error", "Solo ficheros de tipo 'jpeg', 'jpg' o 'png' estan permitidos")
      error = true;
    }


    return error

  }


}
