import { Rol } from './rol';

export interface Usuario {
  id: number;
  username: string;
  rol: Rol;
}

export interface UsuarioAlta {
  username: string;
  password: string;
  rol: Rol;
}

export interface UsuarioModificar {
  username: string;
  password?: string;
  rol: Rol;
}
