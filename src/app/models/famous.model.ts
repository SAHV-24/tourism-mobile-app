import { ActivityEnum } from './enums';

export interface Famous {
  _id: string;
  nombre: string;
  ciudadNacimiento: {
    _id: string;
    nombre: string;
    pais: {
      _id: string;
      nombre: string;
    };
  };
  actividad: string;
  foto: string;
  descripcion: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}
