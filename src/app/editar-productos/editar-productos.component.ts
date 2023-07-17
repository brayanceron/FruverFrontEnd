import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../shared/producto.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoModel } from '../shared/producto.model';
import { validarAutorizacion } from '../shared/utils';
import { ClienteService } from '../shared/cliente.service';
import { validarRol } from '../shared/utils';
//import { FormGroup,FormControl } from '@angular/forms';

@Component({
  selector: 'app-editar-productos',
  templateUrl: './editar-productos.component.html',
  styleUrls: ['./editar-productos.component.css']
})
export class EditarProductosComponent implements OnInit {

  idProducto = '';
  rol: string = '';
  producto = new ProductoModel("", "", "", 1,"");

  /*
  productoFormulario :FormGroup = new FormGroup({
    nombre: new FormControl(''),
    detalle: new FormControl(''),
    valor: new FormControl(''),
    file: new FormControl(''),
  });*/

  //archivoSeleccionado!: File;
  //archivoSeleccionado!:Blob;
  archivoSeleccionado:any

  constructor(private productoService: ProductoService, private clienteService: ClienteService, private route: ActivatedRoute, private router: Router) { }


  ngOnInit() {
    this.idProducto = this.route.snapshot.params['idProducto'];
    console.log("El id de Producto es :" + this.idProducto);

    if (this.idProducto) {
      //Editar
      this.productoService.obtenerProducto(this.idProducto).subscribe({
        next: data => {
          this.producto = data[0];
        }, error: error => {
          validarAutorizacion(error, this.router); console.log(error);
        }
      });
    }
    else {
      //Nuevo Producto
      console.log('Nuevo Producto');

    }


    //Estableciendo el rol
    this.clienteService.getRol().subscribe({
      next: data => {
        this.rol = data.rol;
        if (this.rol == "user") { this.router.navigate(['/productos']); }
      },
      error: error => { validarRol(error, this.router); console.log(error) }
    });

  }

  /*
  onSubmit() {
    console.log("Submit realizado");
    if (this.producto.idProducto) {
      //Viene de Editar
      this.productoService.actualizarProducto(this.producto).subscribe(
        {
          next: data => {
            console.log(data);
            this.router.navigate(['/productos']);
          }, error: error => { validarAutorizacion(error, this.router) }
        }
      );
    }
    else {
      //Viene de crear Nuevo Producto
      console.log('Nuevo Producto');
      this.productoService.agregarProducto(this.producto).subscribe({
        next: data => {
          this.router.navigate(['/productos']);
        },
        error: error => { validarAutorizacion(error, this.router) }
      });
    }

  }
  */
  onArchivoSelecionado(e:any){
    console.log(e);
    this.archivoSeleccionado=e.target.files[0];
  }
  onSubmit() {
    console.log("Submit realizado");
    
    let fd = new FormData();
    fd.append('nombre', this.producto.nombre);
    fd.append('detalle', this.producto.detalle);
    fd.append('valor', this.producto.valor.toString());
    fd.append('file',this.archivoSeleccionado);

    if(!this.archivoSeleccionado) {alert("No se ha seleccionado ningun archivo"); return;}

    if (this.producto.idProducto) {
      //Viene de Editar
      fd.append('idProducto',this.idProducto);
      this.productoService.actualizarProducto(fd).subscribe(
        {
          next: data => {
            console.log(data);
            this.router.navigate(['/productos']);
          }, error: error => { validarAutorizacion(error, this.router) }
        }
      );
    }
    else {
      //Viene para crear
      this.productoService.agregarProducto(fd).subscribe({
        next: data => {
          this.router.navigate(['/productos']);
        },
       error: error => { validarAutorizacion(error, this.router) }
      });
    }

  }
}
