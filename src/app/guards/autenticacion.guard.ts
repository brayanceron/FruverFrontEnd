import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../shared/cliente.service';
import { lastValueFrom } from 'rxjs';
import { cierreDeSesion } from '../shared/utils';

const loginGuard = async () => {
    let clienteService = inject(ClienteService);
    const router = inject(Router);
    if (localStorage.getItem('token')) {
        try{
            let res = await lastValueFrom(clienteService.verificarToken());
            if (res.status=="200") {return true;}
            else {
                cierreDeSesion();
                return false;
            }
        }
        catch(error){
            cierreDeSesion();
            return false
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




