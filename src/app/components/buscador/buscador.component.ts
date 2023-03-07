import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import * as _ from "lodash";
import { debounceTime, distinctUntilChanged, Observable, Subject, switchMap } from 'rxjs';
import { Usuario } from 'src/app/models/Usuario';
import { LoginService } from 'src/app/services/login.service';

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
  fotoPerfil: string;
  private _searchTerm$ = new Subject<string>()
  userObservable$: Observable<Usuario[]>

  constructor(private loginService: LoginService, private router: Router) {

    this.userObservable$ = this._searchTerm$.pipe(
      debounceTime(500), //para que se ejecute despues de 0.5 segundos
      distinctUntilChanged(),
      switchMap((term: string) => {
        return this.loginService.findUsersFilterByName(term)
      })
    )
  }

  ngOnInit(): void {



  }

  escribeUsers() {

    if (_.isEmpty(this.buscadorUsers.nativeElement.value)) {
      this.usuariosAMostrar = false
    } else {
      this.usuariosAMostrar = true
      this._searchTerm$.next(this.buscadorUsers.nativeElement.value)
    }
  }

  focusOut() {
    this.usuariosAMostrar = false
  }


  irProfile(usuario) {
    this.router.navigate(["profile/", usuario])
  }

}
