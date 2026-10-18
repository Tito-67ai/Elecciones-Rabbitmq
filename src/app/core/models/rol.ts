export type Rol = 'ROOT' | 'ADMIN' | 'AUTORIDAD_MESA' | 'FISCAL' | 'ELECTOR';

export const ROLES: Rol[] = ['ROOT', 'ADMIN', 'AUTORIDAD_MESA', 'FISCAL', 'ELECTOR'];

export const ETIQUETA_ROL: Record<Rol, string> = {
  ROOT: 'Root',
  ADMIN: 'Administrador',
  AUTORIDAD_MESA: 'Autoridad de mesa',
  FISCAL: 'Fiscal',
  ELECTOR: 'Elector',
};
