export interface Candidato {
  id: number;
  nombre: string;
  apellido: string;
  partido: string;
  eleccionId: number;
}

export interface CandidatoAlta {
  nombre: string;
  apellido: string;
  partido: string;
  eleccionId: number | null;
}

export type CandidatoModificar = CandidatoAlta;
