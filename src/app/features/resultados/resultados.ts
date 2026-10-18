import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Eleccion } from '../../core/models/eleccion';
import { ActaEleccion } from '../../core/models/voto';
import { EleccionService } from '../../core/services/eleccion.service';
import { VotoService } from '../../core/services/voto.service';

@Component({
  imports: [FormsModule, DecimalPipe],
  selector: 'app-resultados',
  styleUrl: './resultados.css',
  templateUrl: './resultados.html',
})
export class Resultados {
  private readonly eleccionesServicio = inject(EleccionService);
  private readonly votosServicio = inject(VotoService);

  protected readonly elecciones = signal<Eleccion[]>([]);
  protected readonly eleccionId = signal<number | null>(null);
  protected readonly acta = signal<ActaEleccion | null>(null);
  protected readonly cargando = signal(false);

  protected readonly maximoVotos = computed(() => {
    const resultados = this.acta()?.resultados ?? [];
    return resultados.reduce((maximo, resultado) => Math.max(maximo, resultado.votos), 0);
  });

  constructor() {
    this.eleccionesServicio.listar().subscribe({
      next: (datos) => this.elecciones.set(datos),
    });
  }

  protected consultar(valor: number | null): void {
    this.eleccionId.set(valor);
    this.acta.set(null);

    if (valor === null) {
      return;
    }

    this.cargando.set(true);

    this.votosServicio.acta(valor).subscribe({
      next: (datos) => {
        this.acta.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected porcentaje(votos: number): number {
    const maximo = this.maximoVotos();
    return maximo === 0 ? 0 : Math.round((votos / maximo) * 100);
  }
}
