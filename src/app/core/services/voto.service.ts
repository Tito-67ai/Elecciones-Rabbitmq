import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActaEleccion, Voto, VotoAlta } from '../models/voto';

@Injectable({ providedIn: 'root' })
export class VotoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiBaseUrl}/votos`;

  registrar(dto: VotoAlta): Observable<Voto> {
    return this.http.post<Voto>(this.url, dto);
  }

  listar(): Observable<Voto[]> {
    return this.http.get<Voto[]>(this.url);
  }

  listarPorEleccion(eleccionId: number): Observable<Voto[]> {
    return this.http.get<Voto[]>(`${this.url}/eleccion/${eleccionId}`);
  }

  contarPorCandidato(candidatoId: number): Observable<number> {
    return this.http.get<number>(`${this.url}/resultado/${candidatoId}`);
  }

  conteoPorEleccion(eleccionId: number): Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${this.url}/eleccion/${eleccionId}/conteo`);
  }

  acta(eleccionId: number): Observable<ActaEleccion> {
    return this.http.get<ActaEleccion>(`${this.url}/eleccion/${eleccionId}/acta`);
  }
}
