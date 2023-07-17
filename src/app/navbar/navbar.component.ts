import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';
import { validarRol } from '../shared/utils';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
 rol:string='';
  constructor(private router: Router,private clienteService:ClienteService){}
  ngOnInit() {
    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data=>{this.rol=data.rol},
      error: error=>{validarRol(error, this.router);console.log(error)}
    });
  }

  cerrarSesion(){
    localStorage.removeItem("token");
    this.router.navigate(["/login"]);
  }

}
