import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ENLACES, Enlace } from '../../core/navegacion';
import { ETIQUETA_ROL } from '../../core/models/rol';
import { CiudadanoService } from '../../core/services/ciudadano.service';
import { EleccionService } from '../../core/services/eleccion.service';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  imports: [RouterLink],
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {
  private readonly sesion = inject(SesionService);
  private readonly elecciones = inject(EleccionService);
  private readonly ciudadanos = inject(CiudadanoService);

  protected readonly username = this.sesion.username;
  protected readonly etiquetaRol = computed(() => {
    const rol = this.sesion.rol();
    return rol ? ETIQUETA_ROL[rol] : '';
  });
  protected readonly puedeConsultarResumen = computed(() =>
    this.sesion.tieneRol('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL'),
  );
  protected readonly accesos = computed<Enlace[]>(() =>
    ENLACES.filter(
      (enlace) => enlace.ruta !== '/inicio' && this.sesion.tieneRol(...enlace.roles),
    ),
  );

  protected readonly eleccionesActivas = signal(0);
  protected readonly totalElecciones = signal(0);
  protected readonly totalCiudadanos = signal(0);
  protected readonly yaVotaron = signal(0);

  constructor() {
    if (!this.puedeConsultarResumen()) {
      return;
    }

    this.elecciones.listar().subscribe({
      next: (datos) => {
        this.totalElecciones.set(datos.length);
        this.eleccionesActivas.set(datos.filter((eleccion) => eleccion.activa).length);
      },
    });

    this.ciudadanos.listar().subscribe({
      next: (datos) => {
        this.totalCiudadanos.set(datos.length);
        this.yaVotaron.set(datos.filter((ciudadano) => ciudadano.yaVoto).length);
      },
    });
  }
}
