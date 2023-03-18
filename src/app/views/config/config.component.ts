import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, finalize, first, lastValueFrom, map, of, Subscription, switchMap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HeaderComponent } from '../../components/header/header.component';
import { init, waitForInit } from '../../directivas/init';
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

  private _selectedFiles: any;
  preview: string = "";
  previewCabecera: string = "";
  private _currentFile: File;

  @ViewChild("fileInput", { static: true }) private _fileinput: ElementRef

  private _changeUserSubscriber: Subscription;
  private _changeDescSubscriber: Subscription;
  private _postProfileSubscriber: Subscription;
  private _changeProfileSubscriber: Subscription;
  private _imagenGris: string = "../../../assets/gray.png"
  loadingHeader: boolean;
  loadingProfile: boolean;

  constructor(private configService: ConfigService, private toastr: ToastrService, private userService: LoginService, private datosService: DatosService) {

    localStorage.setItem("currentLocation", "config")
    this.preview = this.datosService.usuarioActual.fotoPerfil ?? this._imagenGris
    this.previewCabecera = this.datosService.usuarioActual.fotoCabecera ?? this._imagenGris
  }



  ngOnDestroy(): void {

    this._changeDescSubscriber?.unsubscribe()
    this._changeProfileSubscriber?.unsubscribe()
    this._changeUserSubscriber?.unsubscribe()
    this._postProfileSubscriber?.unsubscribe()
  }

  ngOnInit(): void {
    this.datosService.templateActual = "config"
    if (_.isEqual(this.preview, this._imagenGris) || _.isEqual(this.previewCabecera, this._imagenGris)) {
      this._getFotosUsuario();
    }

  }

  changeUsername(newValue) {

    if (newValue) {
      this.configService.changeUsername(localStorage.getItem("usuario"), newValue)
        .then((dat: Usuario) => {
          this.toastr.success("Cambiado", "El usuario se cambio correctamente")
          this.datosService.tweetsCargados.filter(t => t.usuario == localStorage.getItem("usuario")).map(t => t.usuario = dat.user)

          localStorage.setItem("usuario", dat.user)
        })
        .catch(error => {
          this.toastr.error("Error", "Ha habido un error al cambiar el usuario")

        })
    }

  }

  changeDescription(newValue) {

    if (newValue) {
      this.configService.changeDescription(localStorage.getItem("usuario"), newValue).then(data =>
        this.toastr.success("Cambiado", "La descripcion se cambió correctamente")

      ).catch(error => {
        this.toastr.error("Error", "Ha habido un error al cambiar la descripción")
      })
    }

  }


  async adjuntarImagen(event: any) {
    this.preview = '';
    this._selectedFiles = event.target.files;

    if (this._selectedFiles) {

      const file: File | null = this._selectedFiles.item(0);

      if (file) {

        this.preview = '';
        this._currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };

        await reader.readAsDataURL(this._currentFile);
        await this.cambiaPerfil(this._currentFile)

      }
    }

  }


  async adjuntarImagenCabecera(event: any) {
    this.previewCabecera = '';
    this._selectedFiles = event.target.files;

    if (this._selectedFiles) {

      const file: File | null = this._selectedFiles.item(0);

      if (file) {

        this.previewCabecera = '';
        this._currentFile = file;

        const reader = new FileReader();

        reader.onload = (e: any) => {
          this.previewCabecera = e.target.result;
        };

        await reader.readAsDataURL(this._currentFile);
        await this.cambiaImagenCabecera(this._currentFile)

      }
    }

  }

  async cambiaPerfil(file: File) {


    const urlNewProfile = `${environment.url}/images/profiles/profile-${localStorage.getItem("usuario")}.${file.type.split("/")[1]}`

    //hacemos uso de rxjs para hacer unas pruebas

    this.loadingProfile = true
    this._changeProfileSubscriber = this.configService.postNewImagenProfile(file, urlNewProfile)
      .pipe(
        first(),
        catchError(() => {
          this.toastr.success("Error", "Ha habido un error al cambiar la foto de perfil")
          return of(null)
        }),
        switchMap(() => {
          return this.configService.changeProfileImage(localStorage.getItem("usuario"), urlNewProfile)
        }),
        map((val: Usuario) => {
          return val.user
        })
        , finalize(() => {
          this.loadingProfile = false
          this._fileinput.nativeElement.value = ''
        })

      ).subscribe({
        next: (val: string) => {
          if (!_.isNil(val)) {
            this.datosService.usuarioActual.fotoPerfil = urlNewProfile

            localStorage.setItem("usuario", val)
            this.toastr.success("Cambiado", "La foto de perfil se cambió correctamente")
          }
        }
      })

  }

  async cambiaImagenCabecera(file: File) {


    const urlNewCabecera = `${environment.url}/images/headers/header-${localStorage.getItem("usuario")}.${file.type.split("/")[1]}`

    //hacemos uso de rxjs para hacer unas pruebas

    this.loadingHeader = true
    this._changeProfileSubscriber = this.configService.postNewImagenHeader(file, urlNewCabecera)
      .pipe(
        first(),
        catchError((e) => {
          return throwError(() => "Ha habido un error al cambiar la imagen de cabecera")
        }),
        switchMap(() => {

          return this.configService.changeHeaderImage(localStorage.getItem("usuario"), urlNewCabecera)
        }),
        map((val: Usuario) => {

          return val.user
        })
        , finalize(() => {
          this.loadingHeader = false
          this._fileinput.nativeElement.value = ''
        })

      ).subscribe({

        next: (val: string | null) => {

          if (!_.isNil(val)) {
            localStorage.setItem("usuario", val)
            this.toastr.success("Cambiado", "La imagen de cabecera se cambió correctamente")
            this.datosService.usuarioActual.fotoCabecera = urlNewCabecera
          }
        }, error: (error) => {
          this.previewCabecera = ""
          this.toastr.success(error, "Error")

        }
      })

  }

  // @init
  _getFotosUsuario() {



    lastValueFrom(this.userService.findUserByName(localStorage.getItem("usuario"))).then((data: Usuario) => {

      this.preview = data.fotoPerfil
      this.previewCabecera = data.fotoCabecera
      this.datosService.usuarioActual.fotoPerfil = this.preview
      this.datosService.usuarioActual.fotoCabecera = this.previewCabecera

    })

  }

}
