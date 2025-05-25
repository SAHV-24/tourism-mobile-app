const express = require('express');
const router = express.Router();
const Visita = require('../models/Visita');

// GET - Obtener todas las visitas
router.get('/', async (req, res) => {
  try {
    const visitas = await Visita.find()
      .populate('usuario', 'nombre apellido')
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
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener visitas', error: error.message });
  }
});

// GET - Obtener visita por ID
router.get('/:id', async (req, res) => {
  try {
    const visita = await Visita.findById(req.params.id)
      .populate('usuario', 'nombre apellido')
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
    if (!visita) {
      return res.status(404).json({ mensaje: 'Visita no encontrada' });
    }
    res.json(visita);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener visita', error: error.message });
  }
});

// GET - Obtener visitas por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const visitas = await Visita.find({ usuario: req.params.usuarioId })
      .populate('usuario', 'nombre apellido')
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
    res.json(visitas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener visitas del usuario', error: error.message });
  }
});

// GET - Top 10 sitios más visitados por país
router.get('/top-sitios/:paisId', async (req, res) => {
  try {
    const topSitios = await Visita.aggregate([
      {
        $lookup: {
          from: 'sitios',
          localField: 'sitio',
          foreignField: '_id',
          as: 'sitioInfo'
        }
      },
      {
        $unwind: '$sitioInfo'
      },
      {
        $lookup: {
          from: 'ciudads',
          localField: 'sitioInfo.ciudad',
          foreignField: '_id',
          as: 'ciudadInfo'
        }
      },
      {
        $unwind: '$ciudadInfo'
      },
      {
        $match: {
          'ciudadInfo.pais': new require('mongoose').Types.ObjectId(req.params.paisId)
        }
      },
      {
        $group: {
          _id: '$sitio',
          totalVisitas: { $sum: 1 },
          sitioInfo: { $first: '$sitioInfo' },
          ciudadInfo: { $first: '$ciudadInfo' }
        }
      },
      {
        $sort: { totalVisitas: -1 }
      },
      {
        $limit: 10
      }
    ]);
    
    res.json(topSitios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener top sitios', error: error.message });
  }
});

// POST - Crear nueva visita
router.post('/', async (req, res) => {
  try {
    const nuevaVisita = new Visita(req.body);
    const visitaGuardada = await nuevaVisita.save();
    const visitaCompleta = await Visita.findById(visitaGuardada._id)
      .populate('usuario', 'nombre apellido')
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
    res.status(201).json(visitaCompleta);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear visita', error: error.message });
  }
});

// PUT - Actualizar visita
router.put('/:id', async (req, res) => {
  try {
    const visitaActualizada = await Visita.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
      .populate('usuario', 'nombre apellido')
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
    
    if (!visitaActualizada) {
      return res.status(404).json({ mensaje: 'Visita no encontrada' });
    }
    res.json(visitaActualizada);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar visita', error: error.message });
  }
});

// DELETE - Eliminar visita
router.delete('/:id', async (req, res) => {
  try {
    const visitaEliminada = await Visita.findByIdAndDelete(req.params.id);
    if (!visitaEliminada) {
      return res.status(404).json({ mensaje: 'Visita no encontrada' });
    }
    res.json({ mensaje: 'Visita eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar visita', error: error.message });
  }
});

module.exports = router;
