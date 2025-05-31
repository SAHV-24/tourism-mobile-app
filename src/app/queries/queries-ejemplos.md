# Ejemplos de Respuesta de Endpoints de Queries Avanzadas

A continuación se muestran ejemplos de cómo se retornan los datos en cada endpoint de queries avanzadas, usando interfaces TypeScript para mayor claridad.

---

## 1. Famosos más taggeados por los usuarios
**GET /api/queries/famosos-mas-taggeados**

```typescript
interface FamosoTaggeado {
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
// Respuesta: FamosoTaggeado[]
```

---

## 2. Usuarios con más visitas
**GET /api/queries/usuarios-mas-visitas**

```typescript
interface UsuarioVisitas {
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
// Respuesta: UsuarioVisitas[]
```

---

---

## 3. Buscar platos por país y/o ciudad
**GET /api/queries/platos-por-ubicacion?paisId=&ciudadId=**

```typescript
interface Plato {
  _id: string;
  nombre: string;
  foto: string;
  sitio: string; // ObjectId de Sitio
  precio: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// Respuesta: Plato[]
```

---
---

## 4. Platos registrados en visitas o tags por más de N usuarios
**GET /api/queries/platos-por-usuarios-unicos?n=2**

```typescript
interface Plato {
  _id: string;
  nombre: string;
  foto: string;
  sitio: string; // ObjectId de Sitio
  precio: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
// Respuesta: Plato[]
```

---

## 5. Top 10 sitios más visitados por país
**GET /api/queries/top-sitios?paisId=**

```typescript
interface TopSitio {
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
// Respuesta: TopSitio[]
```
