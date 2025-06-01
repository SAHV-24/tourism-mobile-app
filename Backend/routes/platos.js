const express = require('express');
const router = express.Router();
const Plato = require('../models/Plato');

/**
 * @swagger
 * tags:
 *   name: Platos
 *   description: Endpoints para platos
 *
 * /api/platos:
 *   get:
 *     summary: Obtener todos los platos
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de platos
 *
 * /api/platos/{id}:
 *   get:
 *     summary: Obtener plato por ID
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del plato
 *     responses:
 *       200:
 *         description: Plato encontrado
 *       404:
 *         description: Plato no encontrado
 *
 * /api/platos/sitio/{sitioId}:
 *   get:
 *     summary: Obtener platos por sitio
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sitioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del sitio
 *     responses:
 *       200:
 *         description: Lista de platos del sitio
 *
 * /api/platos/ciudad/{ciudadId}:
 *   get:
 *     summary: Obtener platos por ciudad
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ciudadId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ciudad
 *     responses:
 *       200:
 *         description: Lista de platos de la ciudad
 *
 * /api/platos/pais/{paisId}:
 *   get:
 *     summary: Obtener platos por país
 *     tags: [Platos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: paisId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del país
 *     responses:
 *       200:
 *         description: Lista de platos del país
 */

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

// GET - Obtener platos por ciudad
router.get('/ciudad/:ciudadId', async (req, res) => {
  try {
    const Sitio = require('../models/Sitio');
    // Buscar todos los sitios de la ciudad
    const sitios = await Sitio.find({ ciudad: req.params.ciudadId }).select('_id');
    const sitiosIds = sitios.map(s => s._id);

    // Buscar todos los platos de esos sitios
    const platos = await Plato.find({ sitio: { $in: sitiosIds } })
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
    res.status(500).json({ mensaje: 'Error al obtener platos por ciudad', error: error.message });
  }
});

// GET - Obtener platos por país
router.get('/pais/:paisId', async (req, res) => {
  try {
    const Sitio = require('../models/Sitio');
    const Ciudad = require('../models/Ciudad');
    // Buscar todas las ciudades del país
    const ciudades = await Ciudad.find({ pais: req.params.paisId }).select('_id');
    const ciudadesIds = ciudades.map(c => c._id);
    // Buscar todos los sitios en esas ciudades
    const sitios = await Sitio.find({ ciudad: { $in: ciudadesIds } }).select('_id');
    const sitiosIds = sitios.map(s => s._id);
    // Buscar todos los platos de esos sitios
    const platos = await Plato.find({ sitio: { $in: sitiosIds } })
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
    res.status(500).json({ mensaje: 'Error al obtener platos por país', error: error.message });
  }
});

module.exports = router;
