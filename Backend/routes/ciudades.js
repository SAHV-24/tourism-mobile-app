const express = require('express');
const router = express.Router();
const Ciudad = require('../models/Ciudad');

// GET - Obtener todas las ciudades
router.get('/', async (req, res) => {
  try {
    const ciudades = await Ciudad.find().populate('pais', 'nombre');
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ciudades', error: error.message });
  }
});

// GET - Obtener ciudad por ID
router.get('/:id', async (req, res) => {
  try {
    const ciudad = await Ciudad.findById(req.params.id).populate('pais', 'nombre');
    if (!ciudad) {
      return res.status(404).json({ mensaje: 'Ciudad no encontrada' });
    }
    res.json(ciudad);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ciudad', error: error.message });
  }
});

// GET - Obtener ciudades por país
router.get('/pais/:paisId', async (req, res) => {
  try {
    const ciudades = await Ciudad.find({ pais: req.params.paisId }).populate('pais', 'nombre');
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ciudades del país', error: error.message });
  }
});

module.exports = router;
