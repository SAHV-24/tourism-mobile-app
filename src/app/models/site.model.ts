export interface Site {
  _id: string;
  nombre: string;
  ubicacion: string;
  ciudad: {
    _id: string;
    nombre: string;
    pais: {
      _id: string;
      nombre: string;
    };
    __v?: number;
    createdAt?: string;
    updatedAt?: string;
  };
  tipoSitio: string;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}
