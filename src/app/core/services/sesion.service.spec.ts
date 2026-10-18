import { TestBed } from '@angular/core/testing';
import { SesionService } from './sesion.service';

function tokenCon(carga: Record<string, unknown>): string {
  const base64 = btoa(JSON.stringify(carga))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `cabecera.${base64}.firma`;
}

function enSegundos(fecha: number): number {
  return Math.floor(fecha / 1000);
}

describe('SesionService', () => {
  beforeEach(() => localStorage.clear());

  function crear(): SesionService {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({});
    return TestBed.inject(SesionService);
  }

  it('arranca sin sesión cuando no hay nada guardado', () => {
    const servicio = crear();

    expect(servicio.autenticado()).toBe(false);
    expect(servicio.token()).toBeNull();
    expect(servicio.rol()).toBeNull();
  });

  it('expone usuario, rol y token al guardar un token vigente', () => {
    const servicio = crear();

    servicio.guardar(
      tokenCon({
        sub: 'admin',
        role: 'ADMIN',
        exp: enSegundos(Date.now()) + 3600,
      }),
    );

    expect(servicio.autenticado()).toBe(true);
    expect(servicio.username()).toBe('admin');
    expect(servicio.rol()).toBe('ADMIN');
    expect(servicio.token()).toContain('cabecera.');
    expect(servicio.tieneRol('ADMIN', 'ROOT')).toBe(true);
    expect(servicio.tieneRol('ELECTOR')).toBe(false);
  });

  it('descarta una sesión vencida almacenada', () => {
    localStorage.setItem(
      'elecciones.sesion',
      JSON.stringify({
        token: 'vencido',
        username: 'admin',
        rol: 'ADMIN',
        expira: enSegundos(Date.now()) - 60,
      }),
    );

    const servicio = crear();

    expect(servicio.autenticado()).toBe(false);
    expect(localStorage.getItem('elecciones.sesion')).toBeNull();
  });

  it('limpia la sesión almacenada', () => {
    const servicio = crear();

    servicio.guardar(
      tokenCon({ sub: 'root', role: 'ROOT', exp: enSegundos(Date.now()) + 3600 }),
    );
    expect(servicio.autenticado()).toBe(true);

    servicio.limpiar();

    expect(servicio.autenticado()).toBe(false);
    expect(localStorage.getItem('elecciones.sesion')).toBeNull();
  });
});
