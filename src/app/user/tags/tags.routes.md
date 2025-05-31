# Documentación de la Entidad Tag y Endpoints de /api/tags

La entidad **Tag** representa una acción de un usuario que etiqueta (taggea) a un famoso en una ubicación geográfica, agregando información adicional como foto y comentario. Es útil para registrar avistamientos, eventos o interacciones con famosos en el contexto de la aplicación de turismo.

## Esquema de Tag

```typescript
interface Tag {
  _id: string;
  usuario: string; // ObjectId de Usuario
  famoso: string;  // ObjectId de Famoso
  latitud: number;
  longitud: number;
  fecha: string;   // ISO date
  fotoUrl: string;
  comentario: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
```

## Endpoints de /api/tags

### 1. Obtener todos los tags
**GET /api/tags**

Retorna todos los tags registrados.

**Ejemplo de respuesta:**
```json
[
  {
    "_id": "6657e1b2c2a1b2c3d4e5f111",
    "usuario": "6657e1b2c2a1b2c3d4e5f001",
    "famoso": "6657e1b2c2a1b2c3d4e5f002",
    "latitud": 4.710989,
    "longitud": -74.072092,
    "fecha": "2024-05-31T10:00:00.000Z",
    "fotoUrl": "https://ejemplo.com/foto.jpg",
    "comentario": "Lo vi en el centro de Bogotá",
    "createdAt": "2024-05-31T10:00:00.000Z",
    "updatedAt": "2024-05-31T10:00:00.000Z",
    "__v": 0
  }
]
```

---

### 2. Obtener un tag por ID
**GET /api/tags/:id**

Retorna el tag correspondiente al ID especificado.

**Ejemplo de respuesta:**
```json
{
  "_id": "6657e1b2c2a1b2c3d4e5f111",
  "usuario": "6657e1b2c2a1b2c3d4e5f001",
  "famoso": "6657e1b2c2a1b2c3d4e5f002",
  "latitud": 4.710989,
  "longitud": -74.072092,
  "fecha": "2024-05-31T10:00:00.000Z",
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "comentario": "Lo vi en el centro de Bogotá",
  "createdAt": "2024-05-31T10:00:00.000Z",
  "updatedAt": "2024-05-31T10:00:00.000Z",
  "__v": 0
}
```

---

### 3. Obtener tags por usuario
**GET /api/tags/usuario/:usuarioId**

Retorna todos los tags realizados por un usuario específico.

**Ejemplo de respuesta:**
```json
[
  {
    "_id": "6657e1b2c2a1b2c3d4e5f111",
    "usuario": "6657e1b2c2a1b2c3d4e5f001",
    "famoso": "6657e1b2c2a1b2c3d4e5f002",
    "latitud": 4.710989,
    "longitud": -74.072092,
    "fecha": "2024-05-31T10:00:00.000Z",
    "fotoUrl": "https://ejemplo.com/foto.jpg",
    "comentario": "Lo vi en el centro de Bogotá",
    "createdAt": "2024-05-31T10:00:00.000Z",
    "updatedAt": "2024-05-31T10:00:00.000Z",
    "__v": 0
  }
]
```

---

### 4. Crear un nuevo tag
**POST /api/tags**

Crea un nuevo tag con los datos enviados en el cuerpo de la petición.

**Ejemplo de body:**
```json
{
  "usuario": "6657e1b2c2a1b2c3d4e5f001",
  "famoso": "6657e1b2c2a1b2c3d4e5f002",
  "latitud": 4.710989,
  "longitud": -74.072092,
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "comentario": "Lo vi en el centro de Bogotá"
}
```

**Ejemplo de respuesta:**
```json
{
  "_id": "6657e1b2c2a1b2c3d4e5f111",
  "usuario": "6657e1b2c2a1b2c3d4e5f001",
  "famoso": "6657e1b2c2a1b2c3d4e5f002",
  "latitud": 4.710989,
  "longitud": -74.072092,
  "fecha": "2024-05-31T10:00:00.000Z",
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "comentario": "Lo vi en el centro de Bogotá",
  "createdAt": "2024-05-31T10:00:00.000Z",
  "updatedAt": "2024-05-31T10:00:00.000Z",
  "__v": 0
}
```

---

### 5. Actualizar un tag
**PUT /api/tags/:id**

Actualiza los datos de un tag existente.

**Ejemplo de body:**
```json
{
  "comentario": "Nuevo comentario sobre el famoso"
}
```

**Ejemplo de respuesta:**
```json
{
  "_id": "6657e1b2c2a1b2c3d4e5f111",
  "usuario": "6657e1b2c2a1b2c3d4e5f001",
  "famoso": "6657e1b2c2a1b2c3d4e5f002",
  "latitud": 4.710989,
  "longitud": -74.072092,
  "fecha": "2024-05-31T10:00:00.000Z",
  "fotoUrl": "https://ejemplo.com/foto.jpg",
  "comentario": "Nuevo comentario sobre el famoso",
  "createdAt": "2024-05-31T10:00:00.000Z",
  "updatedAt": "2024-05-31T12:00:00.000Z",
  "__v": 0
}
```

---

### 6. Eliminar un tag
**DELETE /api/tags/:id**

Elimina el tag correspondiente al ID especificado.

**Ejemplo de respuesta:**
```json
{
  "mensaje": "Tag eliminado correctamente"
}
```

---

## Resumen
- **Tag** permite registrar avistamientos o interacciones de usuarios con famosos, incluyendo ubicación, foto y comentario.
- Los endpoints permiten crear, consultar, actualizar y eliminar tags, así como filtrar por usuario.
- Todos los IDs son cadenas (ObjectId de MongoDB).
