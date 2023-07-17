import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoModel } from './pedido.model';
import { PedidoEnviarModel } from './pedidoenviar.model';
import { catchError } from 'rxjs/operators';
import { throwError as obsevableThrowError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  BASE_URL = 'http://localhost:3000';
  constructor(private http: HttpClient) { }

  obtenerPedidos() { 
    return this.http.get<PedidoModel[]>(`${this.BASE_URL}/pedidos`,this.getHeaders())
  }
  obtenerPedidosCliente(idCliente:string) { 
    return this.http.get<PedidoModel[]>(`${this.BASE_URL}/pedidos/cliente/${idCliente}`,this.getHeaders());
  }
  agregarPedido(idCliente:string ,carrito: PedidoEnviarModel[]) {
    return this.http.post<string>(`${this.BASE_URL}/pedidos`,{idCliente:idCliente,productos:carrito},this.getHeaders()); //idCliete debe ser el de que esta logeado
  }
  borrarPedido(idPedido: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/pedidos/${idPedido}`,this.getHeaders());
  }

  procesarPedido(idPedido:string){
    return this.http.put<string>(`${this.BASE_URL}/pedidos/procesar/${idPedido}`,{},this.getHeaders()); //idCliete debe ser el de que esta logeado
  }

  getHeaders(){
    return {
     headers: new HttpHeaders({
       'Authorization':localStorage.getItem('token')!
     })};
 }

}
