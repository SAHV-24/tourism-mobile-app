const express = require('express');
const router = express.Router();
const Sitio = require('../models/Sitio');

// GET - Obtener todos los sitios
router.get('/', async (req, res) => {
  try {
    const sitios = await Sitio.find()
      .populate('ciudad', 'nombre')
      .populate({
        path: 'ciudad',
        populate: {
          path: 'pais',
          select: 'nombre'
        }
      });
    res.json(sitios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sitios', error: error.message });
  }
});

// GET - Obtener sitio por ID
router.get('/:id', async (req, res) => {
  try {
    const sitio = await Sitio.findById(req.params.id)
      .populate('ciudad', 'nombre')
      .populate({
        path: 'ciudad',
        populate: {
          path: 'pais',
          select: 'nombre'
        }
      });
    if (!sitio) {
      return res.status(404).json({ mensaje: 'Sitio no encontrado' });
    }
    res.json(sitio);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sitio', error: error.message });
  }
});

// GET - Obtener sitios por país
router.get('/pais/:paisId', async (req, res) => {
  try {
    const sitios = await Sitio.find()
      .populate({
        path: 'ciudad',
        match: { pais: req.params.paisId },
        select: 'nombre',
        populate: {
          path: 'pais',
          select: 'nombre'
        }
      });
    
    const sitiosFiltrados = sitios.filter(sitio => sitio.ciudad !== null);
    res.json(sitiosFiltrados);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener sitios del país', error: error.message });
  }
});

// POST - Crear nuevo sitio
router.post('/', async (req, res) => {
  try {
    const nuevoSitio = new Sitio(req.body);
    const sitioGuardado = await nuevoSitio.save();
    const sitioCompleto = await Sitio.findById(sitioGuardado._id)
      .populate('ciudad', 'nombre')
      .populate({
        path: 'ciudad',
        populate: {
          path: 'pais',
          select: 'nombre'
        }
      });
    res.status(201).json(sitioCompleto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear sitio', error: error.message });
  }
});

// PUT - Actualizar sitio
router.put('/:id', async (req, res) => {
  try {
    const sitioActualizado = await Sitio.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
      .populate('ciudad', 'nombre')
      .populate({
        path: 'ciudad',
        populate: {
          path: 'pais',
          select: 'nombre'
        }
      });
    
    if (!sitioActualizado) {
      return res.status(404).json({ mensaje: 'Sitio no encontrado' });
    }
    res.json(sitioActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar sitio', error: error.message });
  }
});

// DELETE - Eliminar sitio
router.delete('/:id', async (req, res) => {
  try {
    const sitioEliminado = await Sitio.findByIdAndDelete(req.params.id);
    if (!sitioEliminado) {
      return res.status(404).json({ mensaje: 'Sitio no encontrado' });
    }
    res.json({ mensaje: 'Sitio eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar sitio', error: error.message });
  }
});

module.exports = router;
