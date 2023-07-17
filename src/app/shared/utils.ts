import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

function validarAutorizacion(error: HttpErrorResponse,router:Router) {
    if (error.status == 401) {
      localStorage.removeItem('token');
      router.navigate(['/login']);
    }
  }
  function validarRol(error: HttpErrorResponse,router:Router) {
    if (error.status == 400 || error.status == 401) {
      localStorage.removeItem('token');
      router.navigate(['/login']);
    }
  }

  export{ validarAutorizacion,validarRol}
