import { Injectable, signal } from '@angular/core';

export type TipoNotificacion = 'ok' | 'error' | 'info';

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class NotificacionService {
  private secuencia = 0;
  private readonly estado = signal<Notificacion[]>([]);

  readonly notificaciones = this.estado.asReadonly();

  mostrar(mensaje: string, tipo: TipoNotificacion = 'info'): void {
    const id = ++this.secuencia;

    this.estado.update((actuales) => [...actuales, { id, tipo, mensaje }]);
    setTimeout(() => this.cerrar(id), 6000);
  }

  ok(mensaje: string): void {
    this.mostrar(mensaje, 'ok');
  }

  error(mensaje: string): void {
    this.mostrar(mensaje, 'error');
  }

  cerrar(id: number): void {
    this.estado.update((actuales) => actuales.filter((notificacion) => notificacion.id !== id));
  }
}
