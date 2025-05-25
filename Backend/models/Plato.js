const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  foto: { 
    type: String, 
    required: true 
  },
  sitio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Sitio', 
    required: true 
  },
  precio: { 
    type: Number, 
    required: true,
    min: 0
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Plato', platoSchema);
