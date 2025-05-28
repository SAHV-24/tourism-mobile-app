const express = require('express');
const router = express.Router();
const Tag = require('../models/Tag');

/**
 * @swagger
 * tags:
 *   name: Tags
 *   description: Endpoints para tags
 *
 * /api/tags:
 *   get:
 *     summary: Obtener todos los tags
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tags
 *   post:
 *     summary: Crear un nuevo tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               famoso:
 *                 type: string
 *               latitud:
 *                 type: number
 *               longitud:
 *                 type: number
 *               fotoUrl:
 *                 type: string
 *               comentario:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tag creado
 *
 * /api/tags/{id}:
 *   get:
 *     summary: Obtener tag por ID
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tag
 *     responses:
 *       200:
 *         description: Tag encontrado
 *       404:
 *         description: Tag no encontrado
 *   put:
 *     summary: Actualizar tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tag
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Tag actualizado
 *       404:
 *         description: Tag no encontrado
 *   delete:
 *     summary: Eliminar tag
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tag
 *     responses:
 *       200:
 *         description: Tag eliminado correctamente
 *       404:
 *         description: Tag no encontrado
 *
 * /api/tags/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener tags por usuario
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de tags del usuario
 */

// GET - Obtener todos los tags
router.get('/', async (req, res) => {
  try {
    const tags = await Tag.find()
      .populate('usuario', 'nombre apellido')
      .populate({
        path: 'famoso',
        select: 'nombre actividad',
        populate: {
          path: 'ciudadNacimiento',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tags', error: error.message });
  }
});

// GET - Obtener tag por ID
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id)
      .populate('usuario', 'nombre apellido')
      .populate({
        path: 'famoso',
        select: 'nombre actividad',
        populate: {
          path: 'ciudadNacimiento',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    if (!tag) {
      return res.status(404).json({ mensaje: 'Tag no encontrado' });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tag', error: error.message });
  }
});

// GET - Obtener tags por usuario
router.get('/usuario/:usuarioId', async (req, res) => {
  try {
    const tags = await Tag.find({ usuario: req.params.usuarioId })
      .populate('usuario', 'nombre apellido')
      .populate({
        path: 'famoso',
        select: 'nombre actividad',
        populate: {
          path: 'ciudadNacimiento',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    res.json(tags);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tags del usuario', error: error.message });
  }
});

// POST - Crear nuevo tag
router.post('/', async (req, res) => {
  try {
    const nuevoTag = new Tag(req.body);
    const tagGuardado = await nuevoTag.save();
    const tagCompleto = await Tag.findById(tagGuardado._id)
      .populate('usuario', 'nombre apellido')
      .populate({
        path: 'famoso',
        select: 'nombre actividad',
        populate: {
          path: 'ciudadNacimiento',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    res.status(201).json(tagCompleto);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al crear tag', error: error.message });
  }
});

// PUT - Actualizar tag
router.put('/:id', async (req, res) => {
  try {
    const tagActualizado = await Tag.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    )
      .populate('usuario', 'nombre apellido')
      .populate({
        path: 'famoso',
        select: 'nombre actividad',
        populate: {
          path: 'ciudadNacimiento',
          select: 'nombre',
          populate: {
            path: 'pais',
            select: 'nombre'
          }
        }
      });
    
    if (!tagActualizado) {
      return res.status(404).json({ mensaje: 'Tag no encontrado' });
    }
    res.json(tagActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al actualizar tag', error: error.message });
  }
});

// DELETE - Eliminar tag
router.delete('/:id', async (req, res) => {
  try {
    const tagEliminado = await Tag.findByIdAndDelete(req.params.id);
    if (!tagEliminado) {
      return res.status(404).json({ mensaje: 'Tag no encontrado' });
    }
    res.json({ mensaje: 'Tag eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar tag', error: error.message });
  }
});

module.exports = router;
