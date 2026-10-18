import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidato } from '../../core/models/candidato';
import { Ciudadano } from '../../core/models/ciudadano';
import { Eleccion } from '../../core/models/eleccion';
import { CandidatoService } from '../../core/services/candidato.service';
import { CiudadanoService } from '../../core/services/ciudadano.service';
import { EleccionService } from '../../core/services/eleccion.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SesionService } from '../../core/services/sesion.service';
import { VotoService } from '../../core/services/voto.service';

@Component({
  imports: [FormsModule],
  selector: 'app-votar',
  styleUrl: './votar.css',
  templateUrl: './votar.html',
})
export class Votar {
  private readonly sesion = inject(SesionService);
  private readonly eleccionesServicio = inject(EleccionService);
  private readonly candidatosServicio = inject(CandidatoService);
  private readonly ciudadanosServicio = inject(CiudadanoService);
  private readonly votosServicio = inject(VotoService);
  private readonly notificaciones = inject(NotificacionService);

  protected readonly puedeEmitir = computed(() =>
    this.sesion.tieneRol('ELECTOR', 'AUTORIDAD_MESA'),
  );
  protected readonly puedeConsultarCandidatos = computed(() =>
    this.sesion.tieneRol('AUTORIDAD_MESA'),
  );

  protected readonly elecciones = signal<Eleccion[]>([]);
  protected readonly candidatos = signal<Candidato[]>([]);
  protected readonly eleccionId = signal<number | null>(null);
  protected readonly candidatoId = signal<number | null>(null);
  protected readonly dni = signal('');
  protected readonly ciudadano = signal<Ciudadano | null>(null);
  protected readonly registrando = signal(false);

  constructor() {
    if (!this.puedeConsultarCandidatos()) {
      return;
    }

    this.eleccionesServicio.listar().subscribe({
      next: (datos) => {
        const activas = datos.filter((eleccion) => eleccion.activa);
        this.elecciones.set(activas.length > 0 ? activas : datos);
      },
    });
  }

  protected cambiarEleccion(valor: number | null): void {
    this.eleccionId.set(valor);
    this.candidatoId.set(null);
    this.candidatos.set([]);

    if (valor === null) {
      return;
    }

    this.candidatosServicio.listarPorEleccion(valor).subscribe({
      next: (datos) => this.candidatos.set(datos),
    });
  }

  protected verificarCiudadano(): void {
    const dni = this.dni().trim();

    if (!dni) {
      this.notificaciones.error('Ingresá el DNI del ciudadano.');
      return;
    }

    this.ciudadano.set(null);

    this.ciudadanosServicio.obtenerPorDni(dni).subscribe({
      next: (datos) => this.ciudadano.set(datos),
    });
  }

  protected registrar(): void {
    const eleccionId = this.eleccionId();
    const candidatoId = this.candidatoId();
    const dni = this.dni().trim();

    if (eleccionId === null || candidatoId === null || !dni) {
      this.notificaciones.error('Elegí la elección, el candidato e ingresá el DNI.');
      return;
    }

    this.registrando.set(true);

    this.votosServicio
      .registrar({ eleccionId, candidatoId, dniCiudadano: dni })
      .subscribe({
        next: () => {
          this.notificaciones.ok('Voto registrado correctamente.');
          this.registrando.set(false);
          this.candidatoId.set(null);
          this.dni.set('');
          this.ciudadano.set(null);
        },
        error: () => this.registrando.set(false),
      });
  }
}
