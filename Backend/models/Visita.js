const mongoose = require('mongoose');

const visitaSchema = new mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  sitio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sitio', 
    required: true 
  },
  latitud: { 
    type: Number, 
    required: true 
  },
  longitud: { 
    type: Number, 
    required: true 
  },
  fechaYHora: { 
    type: Date, 
    default: Date.now 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Visita', visitaSchema);
