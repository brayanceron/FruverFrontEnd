import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteModel } from './cliente.model';
import { SERVER_BASE_URL,getHeaders} from '../shared/utils';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  BASE_URL = SERVER_BASE_URL;
  constructor(private http: HttpClient) { }

  obtenerCliente(idCliente: string) {
    return this.http.get<ClienteModel[]>(`${this.BASE_URL}/cliente/${idCliente}`, getHeaders());
  }
  agregarCliente(cliente: ClienteModel){
    return this.http.post<string>(`${this.BASE_URL}/clientes`,cliente);
  }
  borrarCliente(idCliente: string) { 
    return this.http.delete<string>(`${this.BASE_URL}/clientes/${idCliente}`, getHeaders());
  }
  actualizarCliente(cliente: ClienteModel) { 
    return this.http.put<string>(`${this.BASE_URL}/clientes/${cliente.idCliente}`,cliente, getHeaders());
  }
  //AUTENTICACION
  
  login(correo: string, contrasena: string) {
    return this.http.post<any>(`${this.BASE_URL}/login`, { correo, contrasena }, { observe: 'response' });
  }

  verificarToken(): boolean {
    let b = true;
    this.http.get<any>(`${this.BASE_URL}/verificarToken`, getHeaders()).subscribe({
      error: error => {  if (error.status == 401) {b = false;}}
    });
    return b;
  }
  getRol(){
    return this.http.get<any>(`${this.BASE_URL}/getRol`, getHeaders())
  }

}
