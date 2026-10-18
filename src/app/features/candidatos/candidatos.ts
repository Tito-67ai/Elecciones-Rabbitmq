import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Candidato, CandidatoAlta } from '../../core/models/candidato';
import { Eleccion } from '../../core/models/eleccion';
import { CandidatoService } from '../../core/services/candidato.service';
import { EleccionService } from '../../core/services/eleccion.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  imports: [FormsModule],
  selector: 'app-candidatos',
  styleUrl: './candidatos.css',
  templateUrl: './candidatos.html',
})
export class Candidatos {
  private readonly servicio = inject(CandidatoService);
  private readonly eleccionesServicio = inject(EleccionService);
  private readonly notificaciones = inject(NotificacionService);
  private readonly sesion = inject(SesionService);

  protected readonly registros = signal<Candidato[]>([]);
  protected readonly elecciones = signal<Eleccion[]>([]);
  protected readonly cargando = signal(false);
  protected readonly filtro = signal<number | 'todas'>('todas');
  protected readonly editando = signal<number | null>(null);
  protected readonly puedeEditar = computed(() => this.sesion.tieneRol('ADMIN', 'ROOT'));

  protected readonly filtrados = computed(() => {
    const seleccion = this.filtro();
    const todos = this.registros();

    if (seleccion === 'todas') {
      return todos;
    }

    return todos.filter((candidato) => candidato.eleccionId === seleccion);
  });

  protected formulario: CandidatoAlta = this.vacio();

  constructor() {
    this.cargar();
    this.eleccionesServicio.listar().subscribe({
      next: (datos) => this.elecciones.set(datos),
    });
  }

  protected cargar(): void {
    this.cargando.set(true);

    this.servicio.listar().subscribe({
      next: (datos) => {
        this.registros.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  protected nombreEleccion(eleccionId: number): string {
    const eleccion = this.elecciones().find((item) => item.id === eleccionId);
    return eleccion ? eleccion.nombre : `Elección ${eleccionId}`;
  }

  protected nuevo(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected editar(candidato: Candidato): void {
    this.editando.set(candidato.id);
    this.formulario = {
      nombre: candidato.nombre,
      apellido: candidato.apellido,
      partido: candidato.partido,
      eleccionId: candidato.eleccionId,
    };
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected guardar(): void {
    if (!this.formulario.nombre.trim() || this.formulario.eleccionId === null) {
      this.notificaciones.error('Completá el nombre y elegí una elección.');
      return;
    }

    const id = this.editando();
    const peticion =
      id === null
        ? this.servicio.crear(this.formulario)
        : this.servicio.modificar(id, this.formulario);

    peticion.subscribe({
      next: () => {
        this.notificaciones.ok(
          id === null ? 'Candidato creado.' : 'Candidato actualizado.',
        );
        this.cancelar();
        this.cargar();
      },
    });
  }

  protected eliminar(candidato: Candidato): void {
    const confirmado = confirm(
      `¿Eliminar a ${candidato.nombre} ${candidato.apellido}?`,
    );

    if (!confirmado) {
      return;
    }

    this.servicio.eliminar(candidato.id).subscribe({
      next: () => {
        this.notificaciones.ok('Candidato eliminado.');
        this.cargar();
      },
    });
  }

  private vacio(): CandidatoAlta {
    return { nombre: '', apellido: '', partido: '', eleccionId: null };
  }
}
