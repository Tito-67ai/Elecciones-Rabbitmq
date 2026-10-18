import { ROLES, Rol } from './models/rol';

export interface Enlace {
  ruta: string;
  titulo: string;
  descripcion: string;
  roles: Rol[];
}

export const ENLACES: Enlace[] = [
  {
    ruta: '/inicio',
    titulo: 'Inicio',
    descripcion: 'Resumen general del sistema',
    roles: ROLES,
  },
  {
    ruta: '/votar',
    titulo: 'Emitir voto',
    descripcion: 'Registrar el voto de un ciudadano',
    roles: ['ELECTOR', 'AUTORIDAD_MESA'],
  },
  {
    ruta: '/padron',
    titulo: 'Padrón',
    descripcion: 'Ciudadanos habilitados y consulta por DNI',
    roles: ROLES,
  },
  {
    ruta: '/elecciones',
    titulo: 'Elecciones',
    descripcion: 'Comicios, fechas y estado',
    roles: ['ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL', 'ELECTOR'],
  },
  {
    ruta: '/candidatos',
    titulo: 'Candidatos',
    descripcion: 'Postulantes por elección y partido',
    roles: ['ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL', 'ELECTOR'],
  },
  {
    ruta: '/votos',
    titulo: 'Votos emitidos',
    descripcion: 'Listado de votos registrados',
    roles: ['ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL'],
  },
  {
    ruta: '/resultados',
    titulo: 'Resultados',
    descripcion: 'Conteo y acta de cada elección',
    roles: ['ADMIN', 'ROOT', 'AUTORIDAD_MESA', 'FISCAL'],
  },
  {
    ruta: '/usuarios',
    titulo: 'Usuarios',
    descripcion: 'Cuentas del sistema y roles',
    roles: ['ROOT', 'ADMIN'],
  },
];
