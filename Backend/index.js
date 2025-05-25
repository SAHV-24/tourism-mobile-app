require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_ATLAS_URI)
  .then(() => console.log('✅ Conectado a MongoDB Atlas - Base de datos: mobile'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));

// Rutas
app.use('/api/paises', require('./routes/paises'));
app.use('/api/ciudades', require('./routes/ciudades'));
app.use('/api/sitios', require('./routes/sitios'));
app.use('/api/platos', require('./routes/platos'));
app.use('/api/famosos', require('./routes/famosos'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/tags', require('./routes/tags'));
app.use('/api/visitas', require('./routes/visitas'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: '🚀 API de Proyecto Móviles 2025-01 funcionando correctamente',
    endpoints: [
      '/api/paises',
      '/api/ciudades', 
      '/api/sitios',
      '/api/platos',
      '/api/famosos',
      '/api/usuarios',
      '/api/tags',
      '/api/visitas'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📡 Accesible en: http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Error al iniciar el servidor:', err);
  console.log('💡 Intenta ejecutar como administrador o usa un puerto diferente');
});
