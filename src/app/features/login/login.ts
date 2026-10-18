import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from '../../core/models/sesion';
import { AuthService } from '../../core/services/auth.service';
import { NotificacionService } from '../../core/services/notificacion.service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notificaciones = inject(NotificacionService);

  protected readonly enviando = signal(false);
  protected modelo: LoginRequest = { username: '', password: '' };

  protected ingresar(): void {
    if (this.enviando()) {
      return;
    }

    this.enviando.set(true);

    this.auth.login(this.modelo).subscribe({
      next: () => {
        this.notificaciones.ok(`Bienvenido, ${this.modelo.username}.`);
        void this.router.navigate(['/inicio']);
      },
      error: () => this.enviando.set(false),
    });
  }
}
