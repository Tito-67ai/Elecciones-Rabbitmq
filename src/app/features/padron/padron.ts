import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ciudadano, CiudadanoAlta } from '../../core/models/ciudadano';
import { CiudadanoService } from '../../core/services/ciudadano.service';
import { NotificacionService } from '../../core/services/notificacion.service';
import { SesionService } from '../../core/services/sesion.service';

@Component({
  imports: [FormsModule],
  selector: 'app-padron',
  styleUrl: './padron.css',
  templateUrl: './padron.html',
})
export class Padron {
  private readonly servicio = inject(CiudadanoService);
  private readonly notificaciones = inject(NotificacionService);
  private readonly sesion = inject(SesionService);

  protected readonly registros = signal<Ciudadano[]>([]);
  protected readonly cargando = signal(false);
  protected readonly busqueda = signal('');
  protected readonly editando = signal<number | null>(null);
  protected readonly dniConsulta = signal('');
  protected readonly consultado = signal<Ciudadano | null>(null);
  protected readonly consultaRealizada = signal(false);

  protected readonly puedeListar = computed(() =>
    this.sesion.tieneRol('ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL'),
  );
  protected readonly puedeEditar = computed(() => this.sesion.tieneRol('ADMIN', 'ROOT'));

  protected readonly filtrados = computed(() => {
    const texto = this.busqueda().trim().toLowerCase();
    const todos = this.registros();

    if (!texto) {
      return todos;
    }

    return todos.filter((ciudadano) =>
      `${ciudadano.nombre} ${ciudadano.apellido} ${ciudadano.dni} ${ciudadano.email}`
        .toLowerCase()
        .includes(texto),
    );
  });

  protected formulario: CiudadanoAlta = this.vacio();

  constructor() {
    if (this.puedeListar()) {
      this.cargar();
    }
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

  protected editar(ciudadano: Ciudadano): void {
    this.editando.set(ciudadano.id);
    this.formulario = {
      nombre: ciudadano.nombre,
      apellido: ciudadano.apellido,
      dni: ciudadano.dni,
      email: ciudadano.email,
      direccion: ciudadano.direccion,
    };
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected guardar(): void {
    if (!this.formulario.dni.trim()) {
      this.notificaciones.error('El DNI es obligatorio.');
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
          id === null ? 'Ciudadano registrado.' : 'Ciudadano actualizado.',
        );
        this.cancelar();
        this.cargar();
      },
    });
  }

  protected eliminar(ciudadano: Ciudadano): void {
    const confirmado = confirm(
      `¿Eliminar a ${ciudadano.nombre} ${ciudadano.apellido}?`,
    );

    if (!confirmado) {
      return;
    }

    this.servicio.eliminar(ciudadano.id).subscribe({
      next: () => {
        this.notificaciones.ok('Ciudadano eliminado.');
        this.cargar();
      },
    });
  }

  protected consultarPorDni(): void {
    const dni = this.dniConsulta().trim();

    if (!dni) {
      this.notificaciones.error('Ingresá un DNI para consultar.');
      return;
    }

    this.consultado.set(null);
    this.consultaRealizada.set(false);

    this.servicio.obtenerPorDni(dni).subscribe({
      next: (ciudadano) => {
        this.consultado.set(ciudadano);
        this.consultaRealizada.set(true);
      },
      error: () => this.consultaRealizada.set(true),
    });
  }

  private vacio(): CiudadanoAlta {
    return { nombre: '', apellido: '', dni: '', email: '', direccion: '' };
  }
}
