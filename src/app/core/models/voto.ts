export interface Voto {
  id: number;
  eleccionId: number;
  candidatoId: number;
  dniCiudadano: string;
  fechaHora: string;
}

export interface VotoAlta {
  eleccionId: number | null;
  candidatoId: number | null;
  dniCiudadano: string;
}

export interface ResultadoCandidato {
  candidatoId: number;
  nombre: string;
  partido: string;
  votos: number;
}

export interface ActaEleccion {
  eleccionId: number;
  nombreEleccion: string;
  fecha: string;
  activa: boolean;
  totalVotos: number;
  totalHabilitados: number;
  participacion: number;
  resultados: ResultadoCandidato[];
}
