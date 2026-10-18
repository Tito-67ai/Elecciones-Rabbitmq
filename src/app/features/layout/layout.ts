import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ENLACES, Enlace } from '../../core/navegacion';
import { ETIQUETA_ROL } from '../../core/models/rol';
import { AuthService } from '../../core/services/auth.service';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-layout',
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout {
  private readonly sesion = inject(SesionService);
  private readonly auth = inject(AuthService);

  protected readonly username = this.sesion.username;
  protected readonly etiquetaRol = computed(() => {
    const rol = this.sesion.rol();
    return rol ? ETIQUETA_ROL[rol] : '';
  });
  protected readonly enlaces = computed<Enlace[]>(() =>
    ENLACES.filter((enlace) => this.sesion.tieneRol(...enlace.roles)),
  );

  protected salir(): void {
    this.auth.logout();
  }
}
