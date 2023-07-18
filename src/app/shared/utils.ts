import { HttpErrorResponse,HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

let SERVER_BASE_URL:string = 'http://localhost:3000';
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
  function getHeaders() {
    return {
      headers: new HttpHeaders({
        'Authorization': localStorage.getItem('token')!
      })};
  }

  export{ SERVER_BASE_URL,validarAutorizacion,validarRol,getHeaders}
