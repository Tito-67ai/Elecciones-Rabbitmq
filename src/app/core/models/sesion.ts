import { Rol } from './rol';

export interface Sesion {
  token: string;
  username: string;
  rol: Rol;
  expira: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}
