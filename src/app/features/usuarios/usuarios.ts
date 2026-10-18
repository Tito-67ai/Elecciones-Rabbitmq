import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ETIQUETA_ROL, ROLES, Rol } from '../../core/models/rol';
import { Usuario, UsuarioModificar } from '../../core/models/usuario';
import { NotificacionService } from '../../core/services/notificacion.service';
import { UsuarioService } from '../../core/services/usuario.service';

interface FormularioUsuario {
  username: string;
  password: string;
  rol: Rol;
}

@Component({
  imports: [FormsModule],
  selector: 'app-usuarios',
  styleUrl: './usuarios.css',
  templateUrl: './usuarios.html',
})
export class Usuarios {
  private readonly servicio = inject(UsuarioService);
  private readonly notificaciones = inject(NotificacionService);

  protected readonly registros = signal<Usuario[]>([]);
  protected readonly cargando = signal(false);
  protected readonly editando = signal<number | null>(null);
  protected readonly roles = ROLES;
  protected readonly etiquetas = ETIQUETA_ROL;

  protected formulario: FormularioUsuario = this.vacio();

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

  protected editar(usuario: Usuario): void {
    this.editando.set(usuario.id);
    this.formulario = {
      username: usuario.username,
      password: '',
      rol: usuario.rol,
    };
  }

  protected cancelar(): void {
    this.editando.set(null);
    this.formulario = this.vacio();
  }

  protected guardar(): void {
    const username = this.formulario.username.trim();

    if (!username) {
      this.notificaciones.error('El usuario es obligatorio.');
      return;
    }

    const id = this.editando();

    if (id === null) {
      if (!this.formulario.password.trim()) {
        this.notificaciones.error('La contraseña es obligatoria para el alta.');
        return;
      }

      this.servicio
        .crear({
          username,
          password: this.formulario.password,
          rol: this.formulario.rol,
        })
        .subscribe({
          next: () => {
            this.notificaciones.ok('Usuario creado.');
            this.cancelar();
            this.cargar();
          },
        });

      return;
    }

    const dto: UsuarioModificar = { username, rol: this.formulario.rol };

    if (this.formulario.password.trim()) {
      dto.password = this.formulario.password;
    }

    this.servicio.modificar(id, dto).subscribe({
      next: () => {
        this.notificaciones.ok('Usuario actualizado.');
        this.cancelar();
        this.cargar();
      },
    });
  }

  protected eliminar(usuario: Usuario): void {
    const confirmado = confirm(`¿Eliminar al usuario "${usuario.username}"?`);

    if (!confirmado) {
      return;
    }

    this.servicio.eliminar(usuario.id).subscribe({
      next: () => {
        this.notificaciones.ok('Usuario eliminado.');
        this.cargar();
      },
    });
  }

  private vacio(): FormularioUsuario {
    return { username: '', password: '', rol: 'ELECTOR' };
  }
}
