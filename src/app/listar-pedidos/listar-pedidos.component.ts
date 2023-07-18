import { Component, OnInit } from '@angular/core';
import { PedidoModel } from '../shared/pedido.model';
import { Observable, catchError } from 'rxjs';
import { PedidoService } from '../shared/pedido.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  detallePedidoSeleccionado: any | undefined;
  idCliente:string = '';
  rol: string = '';
  idPedidoBorrar:string='';
  idPedidoProcesar:string='';

  constructor(private pedidoService: PedidoService, private clienteService: ClienteService, private routeActivated: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.clienteService.getRol().subscribe({
      next: data => {
        this.rol = data.rol;
        this.idCliente = data.idCliente;

        if (this.rol == "admin") {
          this.pedidos = this.pedidoService.obtenerPedidos();
          this.pedidos.subscribe({error: error => validarAutorizacion(error, this.router)});
        }
        else if (this.rol == "user") {
          this.pedidos = this.pedidoService.obtenerPedidosCliente(this.idCliente);
          this.pedidos.subscribe({error: error => validarAutorizacion(error, this.router)});
        }
      },
    error: error => { validarRol(error, this.router); console.log(error) }
    });
  }

  verProductosDePedido(idPedido: string) {
    this.detallePedidoSeleccionado = null;
    this.pedidos?.forEach(element => {
      element.forEach(e => {
        if (e.idPedido == idPedido) {this.detallePedidoSeleccionado = e.detallePedidos;}
      });
    });
  }

  setIdPedidoProcesar(idPedido: string){this.idPedidoProcesar=idPedido;}
  procesarPedido() {
    if(this.idPedidoProcesar==""){ alert("Error, No se puede completar la operación");}
    this.pedidoService.procesarPedido(this.idPedidoProcesar).subscribe({
      next: data => {this.ngOnInit();/*console.log("Registro Procesado");*/},
      error: error => validarAutorizacion(error, this.router)});
  }
 
  setIdPedidoBorrar(idPedido: string){this.idPedidoBorrar=idPedido; }
  borrarPedido(/*idPedido: string*/) {
    if(this.idPedidoBorrar==""){ alert("Error, No se puede completar la operación");}
    this.pedidoService.borrarPedido(this.idPedidoBorrar).subscribe({
        next: data => {this.ngOnInit();/*console.log("Registro Eliminado");*/}, 
        error: error => {
          validarAutorizacion(error, this.router);
          alert(error.error.mensaje);
          /*if(error.status==500){
            alert(error.error.mensaje);
            return;
          }else{
            validarAutorizacion(error, this.router) 

          }*/
        }});
  }
}
