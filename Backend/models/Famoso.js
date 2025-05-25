const mongoose = require('mongoose');

const famosoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  ciudadNacimiento: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ciudad', 
    required: true 
  },
  actividad: { 
    type: String, 
    required: true,
    enum: ['Actor', 'Actriz', 'Cantante', 'Deportista', 'Político', 'Escritor', 'Artista', 'Científico', 'Empresario', 'Otro']
  },
  foto: { 
    type: String, 
    required: true 
  },
  descripcion: { 
    type: String, 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Famoso', famosoSchema);
