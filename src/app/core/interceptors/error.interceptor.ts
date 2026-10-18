import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ErrorApi } from '../models/error-api';
import { NotificacionService } from '../services/notificacion.service';
import { SesionService } from '../services/sesion.service';

const RUTAS_PUBLICAS = ['/auth/login'];

export const errorInterceptor: HttpInterceptorFn = (peticion, siguiente) => {
  const notificaciones = inject(NotificacionService);
  const sesion = inject(SesionService);
  const router = inject(Router);

  return siguiente(peticion).pipe(
    catchError((error: HttpErrorResponse) => {
      const esRutaPublica = RUTAS_PUBLICAS.some((ruta) => peticion.url.includes(ruta));

      if (esRutaPublica) {
        notificaciones.error(mensajeDe(error));
      } else if (error.status === 401) {
        sesion.limpiar();
        notificaciones.error('Tu sesión expiró. Iniciá sesión nuevamente.');
        void router.navigate(['/login']);
      } else if (error.status === 403) {
        notificaciones.error('No tenés permisos para realizar esta operación.');
      } else {
        notificaciones.error(mensajeDe(error));
      }

      return throwError(() => error);
    }),
  );
};

function mensajeDe(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'No se pudo conectar con el servidor.';
  }

  const cuerpo = error.error as ErrorApi | string | null;

  if (cuerpo && typeof cuerpo === 'object') {
    if (cuerpo.campos) {
      const detalles = Object.entries(cuerpo.campos).map(
        ([campo, detalle]) => `${campo}: ${detalle}`,
      );

      if (detalles.length > 0) {
        return detalles.join(' · ');
      }
    }

    if (cuerpo.mensaje) {
      return cuerpo.mensaje;
    }

    if (cuerpo.error) {
      return cuerpo.error;
    }
  }

  if (typeof cuerpo === 'string' && cuerpo.trim()) {
    return cuerpo;
  }

  return `La solicitud falló con estado ${error.status}`;
}
