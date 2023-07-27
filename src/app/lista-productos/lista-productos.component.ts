import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductoModel } from '../shared/producto.model';
import { PedidoEnviarModel } from '../shared/pedidoenviar.model';
import { ProductoService } from '../shared/producto.service';
import { PedidoService } from '../shared/pedido.service';
import { SERVER_BASE_URL,validarAutorizacion,validarRol } from '../shared/utils';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';
//import { PedidoModel } from '../shared/pedido.model';


@Component({
  selector: 'app-lista-productos',
  templateUrl: './lista-productos.component.html',
  styleUrls: ['./lista-productos.component.css']
})
export class ListaProductosComponent implements OnInit {
  productos: Observable<ProductoModel[]> | undefined;
  //pedido:Observable<Pedi>;
  rol:string='';
  idCliente:string='';
  carrito: any[] = [];
  totalCarrito: number = 0;
  
  idPedido:string="";
  pedidoProcesado:Boolean=false;
  BASE_URL = SERVER_BASE_URL;
  idProductoBorrar:string="";

  patron:string="";

  constructor(private productoService: ProductoService, private pedidoService: PedidoService,private clienteService:ClienteService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.productos = this.productoService.obtenerProductos();
    this.productos.subscribe({error: error => {validarAutorizacion(error);console.log(error)}});

    this.idPedido = this.route.snapshot.params['idPedido'];

    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data=>{
        this.rol=data.rol;
        this.idCliente = data.idCliente

        if(this.idPedido){//Editar Pedido
          this.pedidoService.obtenerPedido(this.idPedido).subscribe({
            next: data=>{
              if(!data){this.router.navigate(["/pedidos"]);return;} //validando que el pedido exista o no este vacio
              
              this.pedidoProcesado=data.procesado;
              let carritoEditar: any[] = [];
              data.detallePedidos.forEach((element: any) => {
                let nuevoRegistro = {
                  idProducto: element.idProducto,
                  nombre: element.producto.nombre,
                  valor: element.producto.valor,
                  modelo: new PedidoEnviarModel(element.idProducto, element.cantidadProducto)
                }
                carritoEditar.push(nuevoRegistro); 
              });

              localStorage.setItem("carritoEditar",JSON.stringify(carritoEditar));
              localStorage.getItem('carritoEditar')?this.carrito=JSON.parse(localStorage.getItem('carritoEditar')!):this.carrito;
              this.calcluarTotalCarrito();
              if(this.idCliente!=data.idCliente){this.router.navigate(["/pedidos"]);return;} //validando que el pedido pertencezca al ciente
            },
            error: error=>{validarAutorizacion(error);}
          });
        }
        else{//Listar productos
          localStorage.getItem('carrito'+this.idCliente)?this.carrito=JSON.parse(localStorage.getItem('carrito'+this.idCliente)!):this.carrito;
          this.calcluarTotalCarrito();
        }
      },
      error: error=>{validarRol(error);}
    });
  }

  setProductoBorrar(idProducto: string) {this.idProductoBorrar=idProducto;}
  borrarProducto() {
    this.productoService.borrarProducto(this.idProductoBorrar).subscribe({
        next: data => {this.ngOnInit();}, 
        error: error => {
          if(error.status==500){alert(error.error.mensaje);return;}
          else{validarAutorizacion(error);}}
    });
  }

  anadirAlCarrito(idProducto: string, nombreProducto: string, valor: number,) {
    let b: Boolean = false;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {this.masUno(idProducto);b = true;}
    });
    if (b) return;

    let nuevoRegistro = {
      idProducto: idProducto,
      nombre: nombreProducto,
      valor: valor,
      modelo: new PedidoEnviarModel(idProducto, 1)
    }
    this.carrito.push(nuevoRegistro); 
    this.saveCarrito();
  }

  masUno(idProducto: string) {
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {p.modelo.cantidadProducto++;}
    });
    this.saveCarrito();
  }

  menosUno(idProducto: string) {
    let index: number = 0;
    this.carrito.forEach(p => {
      if (p.idProducto == idProducto) {
        if ((p.modelo.cantidadProducto - 1) > 0) {p.modelo.cantidadProducto--;}
        else {this.carrito.splice(index, 1);}
      }
      index++;
    });
    this.saveCarrito();
  }

  comprar() { //crear pedido
    let dataEnviar: PedidoEnviarModel[] = [];
    this.carrito.forEach(element => {dataEnviar.push(element.modelo);});
    this.pedidoService.agregarPedido(this.idCliente,dataEnviar).subscribe({
        next: data => {this.vaciarCarrito();},
        error: error => { validarAutorizacion(error);}
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
    this.saveCarrito();
  }

  saveCarrito(){
    if(!this.idPedido){localStorage.setItem("carrito"+this.idCliente,JSON.stringify(this.carrito));}
    this.calcluarTotalCarrito();
  }
  
  buscarProducto(nombre: string) {
    if(this.patron=='') return true
    else if((nombre.toLowerCase()).includes(this.patron.toLowerCase()) && this.patron!='') return true;
    else return false;
  }

  actualizarPedido(){
    let dataEnviar: PedidoEnviarModel[] = [];
    this.carrito.forEach(element => {dataEnviar.push(element.modelo);});
    this.pedidoService.actualizarPedido(this.idPedido,dataEnviar,false).subscribe({
        next: data => {this.router.navigate(["/pedidos"]);},
        error: error => { 
          if(error.status==409){alert(error.error.mensaje);return;}
          validarAutorizacion(error);
        }
      });
  }

}
