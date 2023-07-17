import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoModel } from '../shared/producto.model';
import { PedidoEnviarModel } from '../shared/pedidoenviar.model';
import { ProductoService } from '../shared/producto.service';
import { PedidoService } from '../shared/pedido.service';
import { CarritoComponent } from '../carrito/carrito.component';
import { validarAutorizacion,validarRol } from '../shared/utils';
import { Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';
//import { PedidoModel } from '../shared/pedido.model';
//import { DetallePedidoModel } from '../shared/detallepedido.model';


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
  BASE_URL = 'http://localhost:3000';
  //Esto borrarlo despues
  constructor(private productoService: ProductoService, private pedidoService: PedidoService,private clienteService:ClienteService, private router: Router) { }

  ngOnInit() {
    this.productos = this.productoService.obtenerProductos();
    this.productos.subscribe({
      error: error => {validarAutorizacion(error, this.router);console.log(error)}
    });

    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data=>{this.rol=data.rol;this.idCliente = data.idCliente},
      error: error=>{validarRol(error, this.router);console.log(error)}
    });
  }

  borrarProducto(idProducto: string) {
    this.productoService.borrarProducto(idProducto).subscribe(
      {
        next: data => {
          console.log("Registro Eliminado");
          this.ngOnInit();
        }, error: error => {
          if(error.status==500){
            alert(error.error.mensaje);
            return;
          }else{
            validarAutorizacion(error, this.router) 

          }
          //console.log(error);
        }
      }
    );
  }

  //-------------------------------------------------------------

  anadirAlCarrito(idProducto: string, nombreProducto: string, valor: number,) {
    let b: Boolean = false;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {
        this.masUno(idProducto);
        b = true;
      }
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
    //this.ngOnInit();
  }

  masUno(idProducto: string) {
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {
        //p.cantidadProducto++;
        p.modelo.cantidadProducto++;
      }
    });
    this.calcluarTotalCarrito();
  }
  menosUno(idProducto: string) {
    let index: number = 0;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {
        let cant = p.modelo.cantidadProducto;
        if (cant - 1 > 0) {
          p.modelo.cantidadProducto--;
        }
        else {
          this.carrito.splice(index, 1);
        }
      }
      index++;
    });
    this.calcluarTotalCarrito();
  }

  comprar() {
    let dataEnviar: PedidoEnviarModel[] = [];
    this.carrito.forEach(element => {
      dataEnviar.push(element.modelo);
    });
    this.pedidoService.agregarPedido(this.idCliente,dataEnviar).subscribe(
      {
        next: data => {
          //this.router.navigate(['/productos']);
          console.log("Pedido registrado");
          this.carrito = [];
          this.totalCarrito = 0;
        },
        error: error => { validarAutorizacion(error, this.router) }
      }
    );
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
