import { UserRoleEnum } from './enums';

export interface User {
  idUser: number;
  name: string;
  role: UserRoleEnum;
  username: string;
  email: string;
  password: string;
}
