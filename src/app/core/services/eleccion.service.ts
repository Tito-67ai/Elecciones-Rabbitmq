import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Eleccion, EleccionAlta, EleccionModificar } from '../models/eleccion';

@Injectable({ providedIn: 'root' })
export class EleccionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/elecciones`;

  listar(): Observable<Eleccion[]> {
    return this.http.get<Eleccion[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Eleccion> {
    return this.http.get<Eleccion>(`${this.url}/${id}`);
  }

  crear(dto: EleccionAlta): Observable<Eleccion> {
    return this.http.post<Eleccion>(this.url, dto);
  }

  modificar(id: number, dto: EleccionModificar): Observable<Eleccion> {
    return this.http.put<Eleccion>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
