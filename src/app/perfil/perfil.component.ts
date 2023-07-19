import { Component, OnInit } from '@angular/core';
import { ClienteModel } from '../shared/cliente.model';
import { Observable } from 'rxjs';
import { ClienteService } from '../shared/cliente.service';
import { validarAutorizacion, validarRol } from '../shared/utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  cliente: Observable<ClienteModel[]> | undefined;
  idCliente:string = '';
  rol: string = '';

  nombres:string="";
  apellidos:string="";
  edit_nombres:string="";
  edit_apellidos:string="";
  correo:string="";

  constructor(private clienteService: ClienteService,private router: Router){}
  ngOnInit(): void {
    this.clienteService.getRol().subscribe({
      next: async data => {
        this.rol = data.rol;
        this.idCliente = data.idCliente;

        this.cliente=await this.clienteService.obtenerCliente(this.idCliente);
        this.cliente.subscribe({
          next: data =>{
            this.nombres=data[0].nombres; this.edit_nombres= this.nombres;
            this.apellidos=data[0].apellidos; this.edit_apellidos=this.apellidos;
            this.correo=data[0].correo;
          },
          error: error => {validarAutorizacion(error); /*console.log(error);*/}
        });},
      error: error => { validarRol(error); /*console.log(error);*/ }
    });
  }
  
  borrarCliente() {
    this.clienteService.borrarCliente(this.idCliente).subscribe({
        next: data => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);}, 
        error: error => {
          if(error.status==500){alert(error.error.mensaje);return;}
          else{validarAutorizacion(error);}}
      });
  }

  actualizarClient(){
    if (this.nombres=="" || this.apellidos == ""){alert("los campos no pueden estar vacíos");return;}
    let clienteModificado=new ClienteModel(this.idCliente,this.nombres,this.apellidos,"","","");
    this.clienteService.actualizarCliente(clienteModificado).subscribe({
        next: data => {this.ngOnInit();}, 
        error: error => { validarAutorizacion(error); /*console.log(error);console.log(error.message);*/}
      });
  }
}
