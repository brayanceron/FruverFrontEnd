import { Component, OnInit } from '@angular/core';
import { PedidoModel } from '../shared/pedido.model';
import { Observable, catchError } from 'rxjs';
import { PedidoService } from '../shared/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { validarAutorizacion } from '../shared/utils';
import { ClienteService } from '../shared/cliente.service';
import { validarRol } from '../shared/utils';

@Component({
  selector: 'app-listar-pedidos',
  templateUrl: './listar-pedidos.component.html',
  styleUrls: ['./listar-pedidos.component.css']
})
export class ListarPedidosComponent implements OnInit {
  pedidos: Observable<PedidoModel[]> | undefined;
  //pedidos:PedidoModel[] | undefined;
  detallePedidoSeleccionado: any | undefined;
  idCliente:string = '';
  rol: string = '';
  idPedidoBorrar:string='';
  idPedidoProcesar:string='';

  constructor(private pedidoService: PedidoService, private clienteService: ClienteService, private routeActivated: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    //this.idCliente = this.routeActivated.snapshot.params['idCliente'];
    //console.log("url Actual: "+this.router.url)

    //if (/*this.idCliente*/this.router.url == "/pedidos") {
    //pedidos de un cliente


    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data => {
        this.rol = data.rol;
        this.idCliente = data.idCliente;

        if (this.rol == "admin") {
          this.pedidos = this.pedidoService.obtenerPedidos();
          this.pedidos.subscribe({
            error: error => validarAutorizacion(error, this.router)
          });
        }
        else if (this.rol == "user") {
          this.pedidos = this.pedidoService.obtenerPedidosCliente(this.idCliente);
          this.pedidos.subscribe({
            error: error => validarAutorizacion(error, this.router)
          });
        }
      },
      error: error => { validarRol(error, this.router); console.log(error) }
    });

    if (this.rol == "admin") {
      this.pedidos = this.pedidoService.obtenerPedidos();
      this.pedidos.subscribe({
        error: error => validarAutorizacion(error, this.router)
      });
    }
    else if (this.rol == "user") {
      this.pedidos = this.pedidoService.obtenerPedidosCliente(this.idCliente);
      this.pedidos.subscribe({
        error: error => validarAutorizacion(error, this.router)
      });
    }


    //}    else if (this.router.url == "/pedidos/cliente") {
    //Todos los pedidos(admin)
    //this.pedidos = this.pedidoService.obtenerPedidosCliente("2"); //el id del cliente logeado           
    //}

    /*if(this.router.url=="/pedidos"){
      if(this.idCliente){this.pedidos = this.pedidoService.obtenerPedidos();}
      else{this.pedidos = this.pedidoService.obtenerPedidos();}
    }
    else if(this.router.url=="/pedidos/pendientes"){
      if(this.idCliente){this.pedidos = this.pedidoService.obtenerPedidos();}
      else{this.pedidos = this.pedidoService.obtenerPedidos();}
    }*/
    //console.log(this.pedidos);
  }

  verProductosDePedido(idPedido: string) {
    /*this.pedidos = this.pedidoService.obtenerPedidos();
    this.pedidos.subscribe({
      error: error => validarAutorizacion(error, this.router)
    });
    */
    //console.log(this.pedidos)
    this.detallePedidoSeleccionado = null;

    this.pedidos?.forEach(element => {
      element.forEach(e => {
        //console.log(e);
        if (e.idPedido == idPedido) {
          this.detallePedidoSeleccionado = e.detallePedidos;
        }
        console.log(this.detallePedidoSeleccionado)
      })

    });

  }
  setIdPedidoProcesar(idPedido: string){
    this.idPedidoProcesar=idPedido;
  }
  procesarPedido() {
    //console.log("borrando...")
    //let res=this.pedidoService.procesarPedido(idPedido);
    if(this.idPedidoProcesar==""){ alert("Error, No se puede completar la operación");}
    this.pedidoService.procesarPedido(this.idPedidoProcesar).subscribe({
      next: data => {
        console.log("Registro Procesado");
        this.ngOnInit();
      },
      error: error => validarAutorizacion(error, this.router)
    });
    //console.log(res);
  }
 
  
  setIdPedidoBorrar(idPedido: string){
    this.idPedidoBorrar=idPedido;
  }
  borrarPedido(/*idPedido: string*/) {
    if(this.idPedidoBorrar==""){ alert("Error, No se puede completar la operación");}
    this.pedidoService.borrarPedido(this.idPedidoBorrar).subscribe(
      {
        next: data => {
          console.log("Registro Eliminado");
          this.ngOnInit();
        }, error: error => {
          alert(error.error.mensaje);
          /*if(error.status==500){
            alert(error.error.mensaje);
            return;
          }else{
            validarAutorizacion(error, this.router) 

          }*/
          //console.log(error);
        }
      }
    );
  }




}
