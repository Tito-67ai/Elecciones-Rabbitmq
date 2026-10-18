import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidato, CandidatoAlta, CandidatoModificar } from '../models/candidato';

@Injectable({ providedIn: 'root' })
export class CandidatoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/candidatos`;

  listar(): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(this.url);
  }

  listarPorEleccion(eleccionId: number): Observable<Candidato[]> {
    return this.http.get<Candidato[]>(`${this.url}/eleccion/${eleccionId}`);
  }

  obtenerPorId(id: number): Observable<Candidato> {
    return this.http.get<Candidato>(`${this.url}/${id}`);
  }

  crear(dto: CandidatoAlta): Observable<Candidato> {
    return this.http.post<Candidato>(this.url, dto);
  }

  modificar(id: number, dto: CandidatoModificar): Observable<Candidato> {
    return this.http.put<Candidato>(`${this.url}/${id}`, dto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
