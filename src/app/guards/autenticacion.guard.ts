import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';


const loginGuard = () => {
    let clienteService = inject(ClienteService);
    const router = inject(Router);
    if (localStorage.getItem('token')) {
        if (clienteService.verificarToken()) {return true;}
        else {
            router.navigate(['/login']);
            return false;
        }
    }
    else {
        router.navigate(['/login']);
        return false;
    }

}
const logiAgainnGuard = () => {
    const router = inject(Router);
    if (localStorage.getItem('token')) {
        router.navigate(['/productos']);
        return false;
    }
    else {return true;}

}
export { loginGuard, logiAgainnGuard }