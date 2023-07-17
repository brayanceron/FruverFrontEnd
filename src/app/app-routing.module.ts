import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaProductosComponent } from './lista-productos/lista-productos.component';
import { EditarProductosComponent } from './editar-productos/editar-productos.component';
import { ListarPedidosComponent } from './listar-pedidos/listar-pedidos.component';
import { AutenticacionComponent } from './autenticacion/autenticacion.component';
import { logiAgainnGuard, loginGuard } from './guards/autenticacion.guard';
import { PerfilComponent } from './perfil/perfil.component';

const routes: Routes = [
  { path: 'login', component: AutenticacionComponent, canActivate:[logiAgainnGuard]},

  { path: 'productos', component: ListaProductosComponent, canActivate:[loginGuard] },
  { path: 'productos/editar/:idProducto', component: EditarProductosComponent,canActivate:[loginGuard] },
  { path: 'productos/agregar', component: EditarProductosComponent, canActivate:[loginGuard] },

  { path: 'pedidos', component: ListarPedidosComponent, canActivate:[loginGuard] },
  { path: 'perfil', component: PerfilComponent, canActivate:[loginGuard] },

  { path: '**', redirectTo: '/productos', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
