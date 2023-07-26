export class DetallePedidoModel{
    constructor(
        public id:string,
        public cantidadProducto:number, 
        public totalProducto:number,
        public idPedido:string, 
        public idProducto:string){}
}

