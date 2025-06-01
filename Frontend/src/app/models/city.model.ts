export interface City {
  _id: string;
  nombre: string;
  pais: {
    _id: string;
    nombre: string;
  };
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}
