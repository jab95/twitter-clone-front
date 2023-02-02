import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { ConfigService } from '../services/config.service';
import * as _ from "lodash"
import { Usuario } from '../models/Usuario';
import { DatosService } from '../services/datos.service';
import { init, waitForInit } from '../directivas/init';
import { LoginService } from '../services/login.service';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConfigComponent implements OnInit {

  private _selectedFiles: any;
  preview: string = "";
  private _currentFile: File;

  @ViewChild("fileInput", { static: true }) private _fileinput: ElementRef

  constructor(private configService: ConfigService, private userService: LoginService, private datosService: DatosService) { }

  @waitForInit
  ngOnInit(): void {
    this.datosService.templateActual = "config"

  }

  changeUsername(newValue) {

    if (newValue) {
      this.configService.changeUsername(localStorage.getItem("usuario"), newValue).subscribe({

        next: (val: Usuario) => {
          localStorage.setItem("usuario", val.user)
        }, complete: () => {
          console.log("terminado")
        }, error: () => {
          console.log("error")
        }

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

  async cambiaPerfil(file: File) {
    await this.configService.postProfile(file, "profile-" + localStorage.getItem("usuario") + "." + file.type.split("/")[1]).subscribe({
      next: (e) => {
      }
    })

    await this.configService.changeProfile(localStorage.getItem("usuario"), "profile-" + localStorage.getItem("usuario") + "." + file.type.split("/")[1]).subscribe({

      next: (val: Usuario) => {
        localStorage.setItem("usuario", val.user)
      }, complete: () => {
        this._fileinput.nativeElement.value = ''
      }, error: (e) => {
        console.log(e)
      }

    })
  }

  @init
  async _getFotoPerfil() {
    await lastValueFrom(this.userService.findUserByName(localStorage.getItem("usuario"))).then((data: Usuario) => {

      if (data.fotoPerfil == "profile-default") {
        this.preview = "/assets/logo-angular.png"
      } else {

        this.preview = environment.url + "/images/profiles/" + data.fotoPerfil + "?" + Math.floor(Math.random() * 100) + 1

      }


    })

  }

}
