import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";

let SERVER_BASE_URL: string = 'http://localhost:3000';
let router:Router;

function validarAutorizacion(error: HttpErrorResponse) {
  if (error.status == 401) {//Es porque se cerro la sesion
    localStorage.removeItem('token');
    router.navigate(['/login']);
    return;
  }
  console.log(error.message);
  alert("Error, No se pudo completar la operación, inténtelo mas tarde"); //Es un error desconocido
}

function validarRol(error: HttpErrorResponse) {
  if (error.status == 400 || error.status == 401 || error.status == 404) {
    localStorage.removeItem('token');
    router.navigate(['/login']);
  }
}

function getHeaders() {
  return {
    headers: new HttpHeaders({
      'Authorization': localStorage.getItem('token')!
    })
  };
}

export { SERVER_BASE_URL, validarAutorizacion, validarRol, getHeaders }
