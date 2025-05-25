const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  usuario: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  famoso: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Famoso', 
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
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  fotoUrl: { 
    type: String, 
    required: true 
  },
  comentario: { 
    type: String,
    default: ''
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Tag', tagSchema);
