const mongoose = require('mongoose');

const sitioSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  ubicacion: { 
    type: String, 
    required: true 
  },
  ciudad: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Ciudad', 
    required: true 
  },
  tipoSitio: { 
    type: String, 
    required: true,
    enum: ['Restaurante', 'Hotel', 'Atracción Turística', 'Museo', 'Parque', 'Monumento', 'Centro Comercial', 'Teatro', 'Estadio', 'Otro']
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Sitio', sitioSchema);
