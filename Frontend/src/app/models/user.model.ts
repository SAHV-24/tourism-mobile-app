import { UserRoleEnum } from './enums';

export interface User {
  _id: string;
  nombre: string;
  apellido: string;
  correo: string;
  usuario: string;
  rol: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
