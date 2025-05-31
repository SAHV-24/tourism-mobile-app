require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose
  .connect(process.env.MONGO_ATLAS_URI)
  .then(() =>
    console.log("✅ Conectado a MongoDB Atlas - Base de datos: mobile")
  )
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Rutas protegidas
app.use("/api/paises", auth, require("./routes/paises"));
app.use("/api/ciudades", auth, require("./routes/ciudades"));
app.use("/api/sitios", auth, require("./routes/sitios"));
app.use("/api/platos", auth, require("./routes/platos"));
app.use("/api/famosos", auth, require("./routes/famosos"));
app.use("/api/tags", auth, require("./routes/tags"));
app.use("/api/visitas", auth, require("./routes/visitas"));
app.use("/api/queries", auth, require("./routes/queries"));

// Rutas públicas (login/signup)
app.use("/api/usuarios", require("./routes/usuarios"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "🚀 API de Proyecto Móviles 2025-01 funcionando correctamente",
    endpoints: [
      "/api-docs",
      "/api/paises",
      "/api/ciudades",
      "/api/sitios",
      "/api/platos",
      "/api/famosos",
      "/api/usuarios",
      "/api/tags",
      "/api/visitas",
    ],
  });
});

// Configuración de Swagger
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Tourism REST API",
    version: "1.0.0",
    description: "Documentación de la API para el proyecto de turismo",
  },
  tags: [
    {
      name: "Usuarios",
      description: "Endpoints de autenticación y gestión de usuarios",
    },
    { name: "Paises", description: "Endpoints para países" },
    { name: "Ciudades", description: "Endpoints para ciudades" },
    { name: "Sitios", description: "Endpoints para sitios" },
    { name: "Platos", description: "Endpoints para platos" },
    { name: "Famosos", description: "Endpoints para famosos" },
    { name: "Tags", description: "Endpoints para tags" },
    { name: "Visitas", description: "Endpoints para visitas" },
  ],
  servers: [
    {
      url: `http://localhost:${PORT}`,
      description: "Servidor de desarrollo local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Pais: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre"]
      },
      Ciudad: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          pais: { type: "string", description: "ObjectId de Pais" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre", "pais"]
      },
      Sitio: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          ubicacion: { type: "string" },
          ciudad: { type: "string", description: "ObjectId de Ciudad" },
          tipoSitio: {
            type: "string",
            enum: [
              "Restaurante", "Hotel", "Atracción Turística", "Museo", "Parque", "Monumento", "Centro Comercial", "Teatro", "Estadio", "Otro"
            ]
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre", "ubicacion", "ciudad", "tipoSitio"]
      },
      Plato: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          foto: { type: "string" },
          sitio: { type: "string", description: "ObjectId de Sitio" },
          precio: { type: "number", minimum: 0 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre", "foto", "sitio", "precio"]
      },
      Famoso: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          ciudadNacimiento: { type: "string", description: "ObjectId de Ciudad" },
          actividad: {
            type: "string",
            enum: [
              "Actor", "Actriz", "Cantante", "Deportista", "Político", "Escritor", "Artista", "Científico", "Empresario", "Otro"
            ]
          },
          foto: { type: "string" },
          descripcion: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre", "ciudadNacimiento", "actividad", "foto", "descripcion"]
      },
      Usuario: {
        type: "object",
        properties: {
          _id: { type: "string" },
          nombre: { type: "string" },
          apellido: { type: "string" },
          correo: { type: "string" },
          usuario: { type: "string" },
          rol: {
            type: "string",
            enum: ["Administrador", "UsuarioDefault"],
            default: "UsuarioDefault"
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["nombre", "apellido", "correo", "usuario", "rol"]
      },
      Tag: {
        type: "object",
        properties: {
          _id: { type: "string" },
          usuario: { type: "string", description: "ObjectId de Usuario" },
          famoso: { type: "string", description: "ObjectId de Famoso" },
          latitud: { type: "number" },
          longitud: { type: "number" },
          fecha: { type: "string", format: "date-time" },
          fotoUrl: { type: "string" },
          comentario: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["usuario", "famoso", "latitud", "longitud", "fotoUrl"]
      },
      Visita: {
        type: "object",
        properties: {
          _id: { type: "string" },
          usuario: { type: "string", description: "ObjectId de Usuario" },
          sitio: { type: "string", description: "ObjectId de Sitio" },
          latitud: { type: "number" },
          longitud: { type: "number" },
          fechaYHora: { type: "string", format: "date-time" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["usuario", "sitio", "latitud", "longitud"]
      }
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app
  .listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 Accesible en: http://localhost:${PORT}`);
  })
  .on("error", (err) => {
    console.error("❌ Error al iniciar el servidor:", err);
    console.log(
      "💡 Intenta ejecutar como administrador o usa un puerto diferente"
    );
  });
