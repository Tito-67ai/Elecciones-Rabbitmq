export interface Eleccion {
  id: number;
  nombre: string;
  descripcion: string;
  fecha: string;
  activa: boolean;
}

export interface EleccionAlta {
  nombre: string;
  descripcion: string;
  fecha: string;
}

export interface EleccionModificar extends EleccionAlta {
  activa: boolean;
}
