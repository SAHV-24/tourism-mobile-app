const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  apellido: { 
    type: String, 
    required: true,
    trim: true
  },
  correo: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  usuario: { 
    type: String, 
    required: true,
    unique: true,
    trim: true
  },
  contraseña: { 
    type: String, 
    required: true 
  },
  rol: { 
    type: String, 
    required: true,
    enum: ['Administrador', 'UsuarioDefault'],
    default: 'UsuarioDefault'
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Usuario', usuarioSchema);
