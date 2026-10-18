import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Ciudadano, CiudadanoAlta, CiudadanoModificar } from '../models/ciudadano';

@Injectable({ providedIn: 'root' })
export class CiudadanoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/ciudadanos`;

  listar(): Observable<Ciudadano[]> {
    return this.http.get<Ciudadano[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Ciudadano> {
    return this.http.get<Ciudadano>(`${this.url}/${id}`);
  }

  obtenerPorDni(dni: string): Observable<Ciudadano> {
    return this.http.get<Ciudadano>(`${this.url}/dni/${dni}`);
  }

  crear(dto: CiudadanoAlta): Observable<Ciudadano> {
    return this.http.post<Ciudadano>(this.url, dto);
  }

  modificar(id: number, dto: CiudadanoModificar): Observable<Ciudadano> {
    return this.http.put<Ciudadano>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
