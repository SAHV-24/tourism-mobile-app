// Interfaces para las 5 queries avanzadas

// 1. Famosos más taggeados por los usuarios
export interface FamosoTaggeado {
  famoso: {
    _id: string;
    nombre: string;
    ciudadNacimiento: string; // ObjectId de Ciudad
    actividad: string;
    foto: string;
    descripcion: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  totalTags: number;
}

// 2. Usuarios con más visitas
export interface UsuarioVisitas {
  usuario: {
    _id: string;
    nombre: string;
    apellido: string;
    correo: string;
    usuario: string;
    rol: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  totalVisitas: number;
}

// 3. Platos más taggeados, filtrando por país o ciudad
export interface PlatoTaggeado {
  plato: PlatoPorUsuariosUnicos;
  totalTags: number;
}

// 4. Platos registrados en visitas o tags por más de N usuarios
export interface PlatoPorUsuariosUnicos {
  _id: string;
  nombre: string;
  foto: string;
  sitio: string; // ObjectId de Sitio
  precio: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// 5. Top 10 sitios más visitados por país
export interface TopSitio {
  _id: string; // ObjectId de Sitio
  totalVisitas: number;
  sitioInfo: {
    _id: string;
    nombre: string;
    ubicacion: string;
    ciudad: string; // ObjectId de Ciudad
    tipoSitio: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  ciudadInfo: {
    _id: string;
    nombre: string;
    pais: string; // ObjectId de Pais
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
