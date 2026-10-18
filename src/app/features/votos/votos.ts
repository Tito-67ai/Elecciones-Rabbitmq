import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidato } from '../../core/models/candidato';
import { Eleccion } from '../../core/models/eleccion';
import { Voto } from '../../core/models/voto';
import { CandidatoService } from '../../core/services/candidato.service';
import { EleccionService } from '../../core/services/eleccion.service';
import { VotoService } from '../../core/services/voto.service';

@Component({
  imports: [FormsModule],
  selector: 'app-votos',
  styleUrl: './votos.css',
  templateUrl: './votos.html',
})
export class Votos {
  private readonly servicio = inject(VotoService);
  private readonly eleccionesServicio = inject(EleccionService);
  private readonly candidatosServicio = inject(CandidatoService);

  protected readonly registros = signal<Voto[]>([]);
  protected readonly elecciones = signal<Eleccion[]>([]);
  protected readonly candidatos = signal<Candidato[]>([]);
  protected readonly cargando = signal(false);
  protected readonly filtro = signal<number | 'todas'>('todas');

  protected readonly titulo = computed(() => {
    const seleccion = this.filtro();

    if (seleccion === 'todas') {
      return 'Últimos votos registrados';
    }

    return `Votos de ${this.nombreEleccion(seleccion)}`;
  });

  constructor() {
    this.eleccionesServicio.listar().subscribe({
      next: (datos) => this.elecciones.set(datos),
    });

    this.candidatosServicio.listar().subscribe({
      next: (datos) => this.candidatos.set(datos),
    });

    this.cargar();
  }

  protected cargar(): void {
    const seleccion = this.filtro();
    this.cargando.set(true);

    const peticion =
      seleccion === 'todas'
        ? this.servicio.listar()
        : this.servicio.listarPorEleccion(seleccion);

    peticion.subscribe({
      next: (datos) => {
        this.registros.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected cambiarFiltro(valor: number | 'todas'): void {
    this.filtro.set(valor);
    this.cargar();
  }

  protected nombreEleccion(eleccionId: number): string {
    const eleccion = this.elecciones().find((item) => item.id === eleccionId);
    return eleccion ? eleccion.nombre : `Elección ${eleccionId}`;
  }

  protected nombreCandidato(candidatoId: number): string {
    const candidato = this.candidatos().find((item) => item.id === candidatoId);

    if (!candidato) {
      return `Candidato ${candidatoId}`;
    }

    return `${candidato.nombre} ${candidato.apellido} (${candidato.partido})`;
  }
}
