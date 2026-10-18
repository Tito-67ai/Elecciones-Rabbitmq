import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NotificacionService } from '../services/notificacion.service';
import { SesionService } from '../services/sesion.service';
import { Rol } from '../models/rol';

export function roleGuard(...roles: Rol[]): CanActivateFn {
  return () => {
    const sesion = inject(SesionService);
    const router = inject(Router);
    const notificaciones = inject(NotificacionService);

    if (sesion.tieneRol(...roles)) {
      return true;
    }

    notificaciones.error('No tenés permisos para acceder a esa sección.');
    return router.createUrlTree(['/inicio']);
  };
}
