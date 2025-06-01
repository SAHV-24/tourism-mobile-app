export interface Tag {
  _id: string;
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
  };
  famoso: {
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
  };
  latitud: number;
  longitud: number;
  fotoUrl: string;
  comentario: string;
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
