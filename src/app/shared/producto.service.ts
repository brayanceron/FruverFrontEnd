import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductoModel } from './producto.model';
import { SERVER_BASE_URL,getHeaders} from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  BASE_URL = SERVER_BASE_URL;
  constructor(private http: HttpClient) { }
  
  obtenerProductos() { 
    return this.http.get<ProductoModel[]>(`${this.BASE_URL}/productos`,getHeaders());
  }

  obtenerProducto(idProducto: string) { 
    return this.http.get<ProductoModel[]>(`${this.BASE_URL}/producto/${idProducto}`,getHeaders());
  }

  agregarProducto(producto: FormData) {
    return this.http.post<string>(`${this.BASE_URL}/productos`,producto,getHeaders());
  }
  
  actualizarProducto(producto: FormData) { 
    return this.http.put<string>(`${this.BASE_URL}/productos/${producto.get('idProducto')}`,producto,getHeaders());
  }
  borrarProducto(idProducto: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/productos/${idProducto}`,getHeaders());
  }

}


