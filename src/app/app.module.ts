import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { EditarProductosComponent } from './editar-productos/editar-productos.component';
import { ProductoService } from './shared/producto.service';
import { PedidoService } from './shared/pedido.service';
import { NavbarComponent } from './navbar/navbar.component';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { AutenticacionComponent } from './autenticacion/autenticacion.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ClienteService } from './shared/cliente.service';

@NgModule({
  declarations: [
    AppComponent,
    ListaProductosComponent,
    EditarProductosComponent,
    NavbarComponent,
    ListarPedidosComponent,
    AutenticacionComponent,
    PerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    ProductoService,
    PedidoService,
    ClienteService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
