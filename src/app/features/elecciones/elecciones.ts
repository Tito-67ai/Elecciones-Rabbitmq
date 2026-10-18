import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Eleccion, EleccionModificar } from '../../core/models/eleccion';
import { EleccionService } from '../../core/services/eleccion.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  imports: [FormsModule],
  selector: 'app-elecciones',
  styleUrl: './elecciones.css',
  templateUrl: './elecciones.html',
})
export class Elecciones {
  private readonly servicio = inject(EleccionService);
  private readonly notificaciones = inject(NotificacionService);
  private readonly sesion = inject(SesionService);

  protected readonly registros = signal<Eleccion[]>([]);
  protected readonly cargando = signal(false);
  protected readonly editando = signal<number | null>(null);
  protected readonly puedeEditar = computed(() => this.sesion.tieneRol('ADMIN', 'ROOT'));

  protected formulario: EleccionModificar = this.vacio();

  constructor() {
    this.cargar();
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

  protected nuevo(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected editar(eleccion: Eleccion): void {
    this.editando.set(eleccion.id);
    this.formulario = {
      nombre: eleccion.nombre,
      descripcion: eleccion.descripcion,
      fecha: eleccion.fecha,
      activa: eleccion.activa,
    };
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected guardar(): void {
    if (!this.formulario.nombre.trim()) {
      this.notificaciones.error('El nombre de la elección es obligatorio.');
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
          id === null ? 'Elección creada.' : 'Elección actualizada.',
        );
        this.cancelar();
        this.cargar();
      },
    });
  }

  protected eliminar(eleccion: Eleccion): void {
    const confirmado = confirm(`¿Eliminar la elección "${eleccion.nombre}"?`);

    if (!confirmado) {
      return;
    }

    this.servicio.eliminar(eleccion.id).subscribe({
      next: () => {
        this.notificaciones.ok('Elección eliminada.');
        this.cargar();
      },
    });
  }

  private vacio(): EleccionModificar {
    return { nombre: '', descripcion: '', fecha: '', activa: true };
  }
}
