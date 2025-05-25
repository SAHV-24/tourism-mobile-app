const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// GET - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-contraseña'); // No devolver contraseñas
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message });
  }
});

// GET - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-contraseña');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message });
  }
});

// POST - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const nuevoUsuario = new Usuario(req.body);
    const usuarioGuardado = await nuevoUsuario.save();
    const usuarioRespuesta = await Usuario.findById(usuarioGuardado._id).select('-contraseña');
    res.status(201).json(usuarioRespuesta);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El correo o usuario ya existe' });
    }
    res.status(400).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
});

// PUT - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    ).select('-contraseña');
    
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ mensaje: 'El correo o usuario ya existe' });
    }
    res.status(400).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});

// DELETE - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario', error: error.message });
  }
});

// POST - Autenticar usuario (login)
router.post('/login', async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    
    if (!usuario || !contraseña) {
      return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
    }

    const usuarioEncontrado = await Usuario.findOne({ usuario });
    
    if (!usuarioEncontrado || usuarioEncontrado.contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuarioRespuesta = await Usuario.findById(usuarioEncontrado._id).select('-contraseña');
    res.json({ 
      mensaje: 'Login exitoso', 
      usuario: usuarioRespuesta 
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el login', error: error.message });
  }
});

module.exports = router;
