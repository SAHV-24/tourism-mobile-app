export interface Dish {
  _id: string;
  nombre: string;
  foto: string;
  sitio: {
    _id: string;
    nombre: string;
    ciudad: {
      _id: string;
      nombre: string;
      pais: {
        _id: string;
        nombre: string;
      };
    };
    tipoSitio: string;
  };
  precio: number;
  __v?: number;
  createdAt?: string;
  updatedAt?: string;
}
