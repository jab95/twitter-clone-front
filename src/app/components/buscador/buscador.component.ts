import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { Usuario } from 'src/app/models/Usuario';
import * as _ from "lodash"
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {


  @ViewChild("buscadorUsers", { static: true }) buscadorUsers: ElementRef

  public usuariosSearchBar: Usuario[] = []
  usuariosAMostrar: boolean = false

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  escribeUsers() {
    if (_.isEmpty(this.buscadorUsers.nativeElement.value)) {
      this.usuariosAMostrar = false
    } else {
      this.usuariosAMostrar = true
      this.loginService.findUsersFilterByName(this.buscadorUsers.nativeElement.value).subscribe({
        next: (datos) => {
          this.usuariosSearchBar = datos
        }, complete: () => {

        }
      })
    }
  }

  focusOut() {
    this.usuariosAMostrar = false
  }


  irProfile(usuario) {
    this.router.navigate(["profile/", usuario])
  }

}
