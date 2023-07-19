import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoModel } from '../shared/producto.model';
import { PedidoEnviarModel } from '../shared/pedidoenviar.model';
import { ProductoService } from '../shared/producto.service';
import { PedidoService } from '../shared/pedido.service';
import { SERVER_BASE_URL,validarAutorizacion,validarRol } from '../shared/utils';
import { Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';


@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {
  productos: Observable<ProductoModel[]> | undefined;
  rol:string='';
  idCliente:string='';
  carrito: any[] = [];
  totalCarrito: number = 0;
  BASE_URL = SERVER_BASE_URL;

  patron="";

  constructor(private productoService: ProductoService, private pedidoService: PedidoService,private clienteService:ClienteService, private router: Router) { }
  ngOnInit() {
    this.productos = this.productoService.obtenerProductos();
    this.productos.subscribe({error: error => {validarAutorizacion(error);console.log(error)}});

    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data=>{this.rol=data.rol;this.idCliente = data.idCliente},
      error: error=>{validarRol(error);console.log(error)}
    });
  }

  borrarProducto(idProducto: string) {
    this.productoService.borrarProducto(idProducto).subscribe({
        next: data => {this.ngOnInit();/*console.log("Registro Eliminado");*/}, 
        error: error => {
          if(error.status==500){alert(error.error.mensaje);return;}
          else{validarAutorizacion(error);}}
    });
  }
  buscarProducto(nombre: string) {
    if(this.patron=='') return true
    else if((nombre.toLowerCase()).includes(this.patron.toLowerCase()) && this.patron!='') return true;
    else return false;
  }

  anadirAlCarrito(idProducto: string, nombreProducto: string, valor: number,) {
    let b: Boolean = false;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {this.masUno(idProducto);b = true;}
    });
    if (b) return;

    let newProducto = new PedidoEnviarModel(idProducto, 1);
    let nuevoRegistro = {
      idProducto: idProducto,
      nombre: nombreProducto,
      valor: valor,
      modelo: newProducto
    }
    this.carrito.push(nuevoRegistro); localStorage.setItem("carrito",JSON.stringify(this.carrito));
    this.calcluarTotalCarrito();
  }

  masUno(idProducto: string) {
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {p.modelo.cantidadProducto++;}
    });
    this.calcluarTotalCarrito();
  }
  menosUno(idProducto: string) {
    let index: number = 0;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {
        let cant = p.modelo.cantidadProducto;
        if (cant - 1 > 0) {p.modelo.cantidadProducto--;}
        else {this.carrito.splice(index, 1);}
      }
      index++;
    });
    this.calcluarTotalCarrito();
  }

  comprar() {
    let dataEnviar: PedidoEnviarModel[] = [];
    this.carrito.forEach(element => {dataEnviar.push(element.modelo);});
    this.pedidoService.agregarPedido(this.idCliente,dataEnviar).subscribe({
        next: data => {
          this.carrito = [];
          this.totalCarrito = 0;},
        error: error => { validarAutorizacion(error) }
      });
  }

  calcluarTotalCarrito() {
    this.totalCarrito = 0;
    this.carrito.forEach(element => {
      this.totalCarrito += element.valor * element.modelo.cantidadProducto;
    });
  }

  vaciarCarrito() {
    this.carrito = [];
    this.totalCarrito = 0;
  }

}
