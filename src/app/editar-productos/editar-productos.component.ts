import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../shared/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from '../shared/producto.model';
import { validarAutorizacion } from '../shared/utils';
import { ClienteService } from '../shared/cliente.service';
import { validarRol } from '../shared/utils';

@Component({
  selector: 'app-editar-productos',
  templateUrl: './editar-productos.component.html',
  styleUrls: ['./editar-productos.component.css']
})
export class EditarProductosComponent implements OnInit {
  idProducto = '';
  rol: string = '';
  producto = new ProductoModel("", "", "", 0,"");
  archivoSeleccionado:any

  constructor(private productoService: ProductoService, private clienteService: ClienteService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.idProducto = this.route.snapshot.params['idProducto'];

    if (this.idProducto) {//Viene de Editar
      this.productoService.obtenerProducto(this.idProducto).subscribe({
        next: data => {this.producto = data[0];}, 
        error: error => {validarAutorizacion(error, this.router); /*console.log(error);*/}
      });
    }

    this.clienteService.getRol().subscribe({//Estableciendo el rol
      next: data => {
        this.rol = data.rol;
        if (this.rol == "user") { this.router.navigate(['/productos']); }},
      error: error => { validarRol(error, this.router); /*console.log(error)*/}
    });
  }

  onArchivoSelecionado(e:any){this.archivoSeleccionado=e.target.files[0];/*console.log(e);*/}
  onSubmit() {
    let fd = new FormData();
    fd.append('nombre', this.producto.nombre);
    fd.append('detalle', this.producto.detalle);
    fd.append('valor', this.producto.valor.toString());
    fd.append('file',this.archivoSeleccionado);

    if(!this.archivoSeleccionado) {alert("No se ha seleccionado ningun archivo"); return;}

    if (this.producto.idProducto) {//Viene de Editar
      fd.append('idProducto',this.idProducto);
      this.productoService.actualizarProducto(fd).subscribe({
          next: data => {this.router.navigate(['/productos']);}, 
          error: error => { validarAutorizacion(error, this.router) }
        });
    }
    else {//nuevo producto
      this.productoService.agregarProducto(fd).subscribe({
        next: data => {this.router.navigate(['/productos']);},
        error: error => { validarAutorizacion(error, this.router);}
      });
    }
  }
}
