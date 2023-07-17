import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoModel } from './producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  BASE_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }
  
  obtenerProductos() { 
    return this.http.get<ProductoModel[]>(`${this.BASE_URL}/productos`,this.getHeaders());
  }

  obtenerProducto(idProducto: string) { 
    return this.http.get<ProductoModel[]>(`${this.BASE_URL}/producto/${idProducto}`,this.getHeaders());
  }
  /*
  agregarProducto-1(producto: ProductoModel) {
    return this.http.post<string>(`${this.BASE_URL}/productos`,producto,this.getHeaders());
  }*/
  agregarProducto(producto: FormData) {
    return this.http.post<string>(`${this.BASE_URL}/productos`,producto,{
      headers: {
        //'Content-Type': 'multipart/form-data',
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':localStorage.getItem('token')!
      }
    });
  }
  /*actualizarProducto(producto: ProductoModel) { 
    return this.http.put<string>(`${this.BASE_URL}/productos/${producto.idProducto}`,producto,this.getHeaders());
  }*/
  actualizarProducto(producto: FormData) { 
    return this.http.put<string>(`${this.BASE_URL}/productos/${producto.get('idProducto')}`,producto,{
      headers: {
        //'Content-Type': 'multipart/form-data',
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization':localStorage.getItem('token')!
      }
    });
  }
  borrarProducto(idProducto: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/productos/${idProducto}`,this.getHeaders());
  }

  getHeaders(){
     return {
      headers: new HttpHeaders({
        'Authorization':localStorage.getItem('token')!
      })
    };
  }
}
