import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PedidoModel } from './pedido.model';
import { PedidoEnviarModel } from './pedidoenviar.model';
import { SERVER_BASE_URL,getHeaders} from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  BASE_URL = SERVER_BASE_URL;
  constructor(private http: HttpClient) { }

  obtenerPedidos() { 
    return this.http.get<PedidoModel[]>(`${this.BASE_URL}/pedidos`,getHeaders())
  }
  obtenerPedidosCliente(idCliente:string) { 
    return this.http.get<PedidoModel[]>(`${this.BASE_URL}/pedidos/cliente/${idCliente}`,getHeaders());
  }
  agregarPedido(idCliente:string ,carrito: PedidoEnviarModel[]) {
    return this.http.post<string>(`${this.BASE_URL}/pedidos`,{idCliente:idCliente,productos:carrito},getHeaders()); //idCliete debe ser el de que esta logeado
  }
  borrarPedido(idPedido: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/pedidos/${idPedido}`,getHeaders());
  }

  procesarPedido(idPedido:string){
    return this.http.put<string>(`${this.BASE_URL}/pedidos/procesar/${idPedido}`,{},getHeaders()); //idCliete debe ser el de que esta logeado
  }

}


