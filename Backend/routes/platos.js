const express = require('express');
const router = express.Router();
const Plato = require('../models/Plato');

// GET - Obtener todos los platos
router.get('/', async (req, res) => {
  try {
    const platos = await Plato.find()
      .populate({
        path: 'sitio',
        select: 'nombre tipoSitio',
        populate: {
          path: 'ciudad',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener platos', error: error.message });
  }
});

// GET - Obtener plato por ID
router.get('/:id', async (req, res) => {
  try {
    const plato = await Plato.findById(req.params.id)
      .populate({
        path: 'sitio',
        select: 'nombre tipoSitio',
        populate: {
          path: 'ciudad',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    if (!plato) {
      return res.status(404).json({ mensaje: 'Plato no encontrado' });
    }
    res.json(plato);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener plato', error: error.message });
  }
});

// GET - Obtener platos por sitio
router.get('/sitio/:sitioId', async (req, res) => {
  try {
    const platos = await Plato.find({ sitio: req.params.sitioId })
      .populate({
        path: 'sitio',
        select: 'nombre tipoSitio',
        populate: {
          path: 'ciudad',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener platos del sitio', error: error.message });
  }
});

module.exports = router;
