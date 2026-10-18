import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/sesion';
import { SesionService } from './sesion.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sesion = inject(SesionService);

  login(credenciales: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${environment.apiBaseUrl}/auth/login`, credenciales)
      .pipe(tap((respuesta) => this.sesion.guardar(respuesta.token)));
  }

  logout(): void {
    this.sesion.limpiar();
    void this.router.navigate(['/login']);
  }
}
