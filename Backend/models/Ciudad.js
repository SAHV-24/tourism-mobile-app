const mongoose = require('mongoose');

const ciudadSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  pais: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Pais', 
    required: true 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Ciudad', ciudadSchema);
