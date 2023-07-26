import { ClienteModel } from "./cliente.model";
import { DetallePedidoModel } from "./detallepedido.model";

export class PedidoModel{
constructor(
    public idPedido:string,
    public createdAt:string,
    public total:number,
    public procesado:Boolean, 
    public idCliente:string, 
    public detallePedidos:DetallePedidoModel[], 
    public cliente:ClienteModel){}
}



