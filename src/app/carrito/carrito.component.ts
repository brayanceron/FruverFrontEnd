import { Component, Input } from '@angular/core';
import { PedidoEnviarModel } from '../shared/pedidoenviar.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent {
  @Input() prueba:string | undefined;
  @Input() carrito:PedidoEnviarModel[] | undefined;

  public contador:number=1;
  static contador: any;
}
