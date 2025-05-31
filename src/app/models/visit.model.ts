export interface Visit {
  _id: string;
  usuario: string;
  sitio: string;
  latitud: number;
  longitud: number;
  fechaYHora: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
