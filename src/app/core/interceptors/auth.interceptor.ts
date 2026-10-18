import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SesionService } from '../services/sesion.service';

const RUTAS_PUBLICAS = ['/auth/login'];

export const authInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const token = inject(SesionService).token();
  const esPublica = RUTAS_PUBLICAS.some((ruta) => peticion.url.includes(ruta));

  if (!token || esPublica) {
    return siguiente(peticion);
  }

  return siguiente(
    peticion.clone({ setHeaders: { Authorization: `Bearer ${token}` } }),
  );
};
