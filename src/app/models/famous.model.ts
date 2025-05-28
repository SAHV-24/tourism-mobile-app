import { ActivityEnum } from './enums';

export interface Famous {
  idFamous: number;
  idCity: number; // Foreign key to City
  name: string;
  activity: ActivityEnum;
  photoUrl: string;
  description: string;
}
