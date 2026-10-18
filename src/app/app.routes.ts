import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./features/layout/layout').then((m) => m.Layout),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'inicio' },
      {
        path: 'inicio',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'padron',
        loadComponent: () =>
          import('./features/padron/padron').then((m) => m.Padron),
      },
      {
        path: 'elecciones',
        canActivate: [roleGuard('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL')],
        loadComponent: () =>
          import('./features/elecciones/elecciones').then((m) => m.Elecciones),
      },
      {
        path: 'candidatos',
        canActivate: [roleGuard('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL')],
        loadComponent: () =>
          import('./features/candidatos/candidatos').then((m) => m.Candidatos),
      },
      {
        path: 'votar',
        canActivate: [roleGuard('ELECTOR', 'AUTORIDAD_MESA')],
        loadComponent: () => import('./features/votar/votar').then((m) => m.Votar),
      },
      {
        path: 'votos',
        canActivate: [roleGuard('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL')],
        loadComponent: () => import('./features/votos/votos').then((m) => m.Votos),
      },
      {
        path: 'resultados',
        canActivate: [roleGuard('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL')],
        loadComponent: () =>
          import('./features/resultados/resultados').then((m) => m.Resultados),
      },
      {
        path: 'usuarios',
        canActivate: [roleGuard('ROOT', 'ADMIN')],
        loadComponent: () =>
          import('./features/usuarios/usuarios').then((m) => m.Usuarios),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
