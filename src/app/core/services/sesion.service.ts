import { computed, Injectable, signal } from '@angular/core';
import { Rol } from '../models/rol';
import { Sesion } from '../models/sesion';

const CLAVE = 'elecciones.sesion';

@Injectable({ providedIn: 'root' })
export class SesionService {
  private readonly estado = signal<Sesion | null>(this.leer());

  readonly sesion = this.estado.asReadonly();
  readonly autenticado = computed(() => this.estado() !== null);
  readonly username = computed(() => this.estado()?.username ?? '');
  readonly rol = computed(() => this.estado()?.rol ?? null);

  token(): string | null {
    return this.estado()?.token ?? null;
  }

  tieneRol(...roles: Rol[]): boolean {
    const actual = this.estado()?.rol;
    return actual !== undefined && roles.includes(actual);
  }

  guardar(token: string): void {
    const sesion = this.decodificar(token);
    localStorage.setItem(CLAVE, JSON.stringify(sesion));
    this.estado.set(sesion);
  }

  limpiar(): void {
    localStorage.removeItem(CLAVE);
    this.estado.set(null);
  }

  private leer(): Sesion | null {
    const crudo = localStorage.getItem(CLAVE);

    if (!crudo) {
      return null;
    }

    try {
      const sesion = JSON.parse(crudo) as Sesion;

      if (sesion.expira * 1000 <= Date.now()) {
        localStorage.removeItem(CLAVE);
        return null;
      }

      return sesion;
    } catch {
      localStorage.removeItem(CLAVE);
      return null;
    }
  }

  private decodificar(token: string): Sesion {
    const carga = JSON.parse(this.aTexto(token.split('.')[1] ?? '')) as {
      sub: string;
      role: Rol;
      exp: number;
    };

    return {
      token,
      username: carga.sub,
      rol: carga.role,
      expira: carga.exp,
    };
  }

  private aTexto(segmento: string): string {
    const base64 = segmento.replace(/-/g, '+').replace(/_/g, '/');
    const relleno = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return atob(relleno);
  }
}
