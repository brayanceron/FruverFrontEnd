import { HttpErrorResponse, HttpHeaders } from "@angular/common/http";

let SERVER_BASE_URL: string = 'http://localhost:3000';

const validarAutorizacion=(error: HttpErrorResponse)=> {
  if (error.status == 401) {//Es porque se cerro la sesion
    cierreDeSesion();
    return;
  }
  alert("Error, No se pudo completar la operación, inténtelo mas tarde"); //Es un error desconocido
}

const validarRol=(error: HttpErrorResponse) =>{
  if (error.status == 400 || error.status == 401 || error.status == 404) {    
    cierreDeSesion();
    //return;
  }
}

const getHeaders= () =>{
  return {
    headers: new HttpHeaders({
      'Authorization': localStorage.getItem('token')!
    })
  };
}

const cierreDeSesion=()=>{          
  alert("La sesión ha terminado, todos los cambios realizados no seran guardados. Por favor vuelva a hacer login nuevamente");
  localStorage.removeItem('token'); 
  window.location.reload();
}

export { SERVER_BASE_URL, validarAutorizacion, validarRol, getHeaders,cierreDeSesion }


