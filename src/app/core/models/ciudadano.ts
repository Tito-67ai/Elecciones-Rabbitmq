export interface Ciudadano {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  direccion: string;
  yaVoto: boolean;
}

export interface CiudadanoAlta {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  direccion: string;
}

export type CiudadanoModificar = CiudadanoAlta;
