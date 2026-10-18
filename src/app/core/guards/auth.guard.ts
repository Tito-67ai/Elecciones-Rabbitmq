import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SesionService } from '../services/sesion.service';

export const authGuard: CanActivateFn = () => {
  const sesion = inject(SesionService);
  const router = inject(Router);

  if (sesion.autenticado()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
