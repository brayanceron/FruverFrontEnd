import { Component } from '@angular/core';
import { ClienteService } from '../shared/cliente.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteModel } from '../shared/cliente.model';



@Component({
  selector: 'app-autenticacion',
  templateUrl: './autenticacion.component.html',
  styleUrls: ['./autenticacion.component.css']
})
export class AutenticacionComponent {

  correo: string = 'admin';
  contrasena: string = 'admin';

  nombres: string = '';
  apellidos: string = '';
  correo_registro: string = '';
  contrasena_registro: string = '';
  contrasena_registro2: string = '';

  errorLogin:string='';
  errorRegistrar:string='';


  constructor(private clienteService: ClienteService, private router: Router) { }

  async iniciarSesion() {
    //console.log(this.correo+"-"+this.contrasena+"-");


    this.clienteService.login(this.correo, this.contrasena).subscribe({
      next: data => {
        console.log(data);
        localStorage.setItem("token", data.body.token);
        this.router.navigate(['/productos']);
      }, error: error => {
        this.errorLogin=error.error.msg;
        //console.log(error);
        //console.log(error.status);
        //console.log(error.error.msg);        
      }
    });

    //const response= await this.clienteService.login(correo,contrasena);
    //console.log(response);
    //console.log(response.error);
  }


  registrar() {
    //alert(this.nombres + this.apellidos + this.correo_registro + this.contrasena_registro)
    if (this.contrasena_registro == this.contrasena_registro2) {
      let newCliente = new ClienteModel("", this.nombres, this.apellidos, this.correo_registro, this.contrasena_registro, "user");
      this.clienteService.agregarCliente(newCliente).subscribe({
        next: data => {
          this.correo=this.correo_registro;
          this.contrasena=this.contrasena_registro;
          this.iniciarSesion()
        },
        error: error => { 
          this.errorRegistrar=error.error.mensaje;
          console.log(error);
          console.log(error.error.mensaje);
          //alert("Error al intentar hacer el registro"); }
      }});
    }
    else {
      alert("Las contraseñas no coinciden");
    }
  }
}
