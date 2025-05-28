const express = require('express');
const router = express.Router();
const Ciudad = require('../models/Ciudad');

/**
 * @swagger
 * tags:
 *   name: Ciudades
 *   description: Endpoints para ciudades
 *
 * /api/ciudades:
 *   get:
 *     summary: Obtener todas las ciudades
 *     tags: [Ciudades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ciudades
 *
 * /api/ciudades/{id}:
 *   get:
 *     summary: Obtener ciudad por ID
 *     tags: [Ciudades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ciudad
 *     responses:
 *       200:
 *         description: Ciudad encontrada
 *       404:
 *         description: Ciudad no encontrada
 *
 * /api/ciudades/pais/{paisId}:
 *   get:
 *     summary: Obtener ciudades por país
 *     tags: [Ciudades]
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
 *         description: Lista de ciudades del país
 */

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
