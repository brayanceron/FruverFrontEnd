import { Component, OnInit } from '@angular/core';
import { PedidoModel } from '../shared/pedido.model';
import { Observable } from 'rxjs';
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
  idCliente:string = '';
  rol: string = '';
  detallePedidoSeleccionado: any | undefined;
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
          this.pedidos.subscribe({error: error => validarAutorizacion(error)});
        }
        else if (this.rol == "user") {
          this.pedidos = this.pedidoService.obtenerPedidosCliente(this.idCliente);
          this.pedidos.subscribe({error: error => validarAutorizacion(error)});
        }
      },
    error: error => { validarRol(error); console.log(error) }
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
      error: error => {
        if(error.status==409){alert(error.error.mensaje);return;}
        validarAutorizacion(error);
      }});
  }
 
  setIdPedidoBorrar(idPedido: string){this.idPedidoBorrar=idPedido; }
  borrarPedido() {
    if(this.idPedidoBorrar==""){ alert("Error, No se puede completar la operación");}
    this.pedidoService.borrarPedido(this.idPedidoBorrar).subscribe({
        next: data => {this.ngOnInit();/*console.log("Registro Eliminado");*/}, 
        error: error => {
          validarAutorizacion(error);
        }});
  }

  actualizarPedido(){
    this.router.navigate([`/pedidos/editar/${this.detallePedidoSeleccionado[0].idPedido}`]);
  }

}


