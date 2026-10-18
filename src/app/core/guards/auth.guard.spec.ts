import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter,
} from '@angular/router';
import { authGuard } from './auth.guard';
import { roleGuard } from './role.guard';
import { SesionService } from '../services/sesion.service';

function ejecutar(guardia: typeof authGuard) {
  return TestBed.runInInjectionContext(() =>
    guardia({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
  );
}

describe('authGuard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('redirige al login cuando no hay sesión', () => {
    const resultado = ejecutar(authGuard);

    expect(resultado).toBeInstanceOf(UrlTree);
  });

  it('permite el acceso cuando hay sesión', () => {
    TestBed.inject(SesionService).guardar(
      tokenConRol('FISCAL'),
    );

    expect(ejecutar(authGuard)).toBe(true);
  });

  it('deja pasar solo a los roles habilitados', () => {
    TestBed.inject(SesionService).guardar(tokenConRol('FISCAL'));
    const soloAdmin = roleGuard('ADMIN', 'ROOT');

    const resultado = TestBed.runInInjectionContext(() =>
      soloAdmin({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot),
    );

    expect(resultado).toBeInstanceOf(UrlTree);
  });
});

function tokenConRol(rol: string): string {
  const base64 = btoa(
    JSON.stringify({
      sub: 'usuario',
      role: rol,
      exp: Math.floor(Date.now() / 1000) + 3600,
    }),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `cabecera.${base64}.firma`;
}
