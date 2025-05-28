const express = require('express');
const router = express.Router();
const Pais = require('../models/Pais');

/**
 * @swagger
 * /api/paises:
 *   get:
 *     summary: Obtener todos los países
 *     tags: [Paises]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de países
 * 
 * /api/paises/{id}:
 *   get:
 *     summary: Obtener país por ID
 *     tags: [Paises]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del país
 *     responses:
 *       200:
 *         description: País encontrado
 *       404:
 *         description: País no encontrado
 */

// GET - Obtener todos los países
router.get('/', async (req, res) => {
  try {
    const paises = await Pais.find();
    res.json(paises);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener países', error: error.message });
  }
});

// GET - Obtener país por ID
router.get('/:id', async (req, res) => {
  try {
    const pais = await Pais.findById(req.params.id);
    if (!pais) {
      return res.status(404).json({ mensaje: 'País no encontrado' });
    }
    res.json(pais);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener país', error: error.message });
  }
});

module.exports = router;
