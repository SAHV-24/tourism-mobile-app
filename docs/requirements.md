# 📱 Proyecto de Fin de Semestre - Desarrollo Móviles 2025-01

## 🧱 Modelado y API

Implementar una base de datos en **MongoDB con enfoque relacional** para crear una **API REST**, que será consumida por una aplicación **Ionic**. Esta API debe permitir cumplir con los siguientes requerimientos funcionales.

> **Nota**: Las entidades con título en **azul** requieren operaciones **CRUD**. Las demás solo necesitan **lectura** (`getAll`, `getById`).

---

## 📦 Entidades y datos mínimos

### 🗺️ Países (`PAIS`)
- Se deben registrar **3 países**:  
  - Colombia  
  - Costa Rica  
  - Guatemala  

### 🏙️ Ciudades (`CIUDAD`)
- **10 ciudades** por país

### 🏛️ Sitios (`SITIO`)
- Campos: `nombre`, `ubicacion`, `ciudad`, `tipoSitio`  
- **10 sitios por país**

### 🍽️ Platos (`PLATO`)
- Campos: `nombre`, `foto`, `sitio`, `precio`  
- **10 platos por país**

### 🌟 Famosos (`FAMOSO`)
- Campos: `ciudad de nacimiento`, `ActividadEnum`, `foto`, `descripción`  
- **10 famosos por país**

### 👤 Usuarios (`USUARIO`)
- Campos: `nombre`, `rol`, `apellido`, `correo`, `usuario`, `contraseña`

### 🏷️ Tags (`TAG`)
- Campos: `idTag`, `idUsuario`, `idFamoso`, `latitud`, `longitud`, `fecha`, `fotoUrl`, `comentario`

### 📍 Visitas (`VISITA`)
- Campos: `idVisita`, `idUsuario`, `idSitio`, `latitud`, `longitud`, `fechaYHora`  
- Guardar tanto **en BD como en Local Storage** (Ionic)

---

## ✅ Requerimientos funcionales

- La app debe permitir:
  - Definir **sitios favoritos** (almacenados en Local Storage).
  - Crear **rutas de visita** con estos sitios (también en Local Storage).
  - Registrar y autenticar **usuarios** (`Administrador` o `UsuarioDefault`).
  - **Filtrar acceso** a información según el usuario autenticado.
  - Registrar **visitas a sitios**, con fecha y hora.
  - Registrar un **tag** cuando el usuario se encuentra con un personaje famoso en un sitio, con foto y geolocalización (por QR o cámara).
  - Solo el **Administrador** puede **agregar nuevos sitios** desde la aplicación.

---

## 🔎 Consultas requeridas en la app

1. Listar **famosos por país**, incluyendo lugar de procedencia y razón de fama.
2. Mostrar los **Top 10 sitios más visitados por país**.
3. Crear al menos **3 consultas adicionales** útiles con la información disponible.

---

