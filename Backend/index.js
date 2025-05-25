require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET_KEY;

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

// Rutas públicas (login/signup)
app.use("/api/usuarios", require("./routes/usuarios"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    mensaje: "🚀 API de Proyecto Móviles 2025-01 funcionando correctamente",
    endpoints: [
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
