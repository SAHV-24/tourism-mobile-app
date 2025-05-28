const express = require("express");
const router = express.Router();
const Sitio = require("../models/Sitio");
const admin = require("../middleware/admin");

/**
 * @swagger
 * tags:
 *   name: Sitios
 *   description: Endpoints para sitios
 *
 * /api/sitios:
 *   get:
 *     summary: Obtener todos los sitios
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de sitios
 *   post:
 *     summary: Crear un nuevo sitio (solo admin)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               ubicacion:
 *                 type: string
 *               ciudad:
 *                 type: string
 *               tipoSitio:
 *                 type: string
 *     responses:
 *       201:
 *         description: Sitio creado
 *
 * /api/sitios/{id}:
 *   get:
 *     summary: Obtener sitio por ID
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del sitio
 *     responses:
 *       200:
 *         description: Sitio encontrado
 *       404:
 *         description: Sitio no encontrado
 *   put:
 *     summary: Actualizar sitio (solo admin)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del sitio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Sitio actualizado
 *       404:
 *         description: Sitio no encontrado
 *   delete:
 *     summary: Eliminar sitio (solo admin)
 *     tags: [Sitios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del sitio
 *     responses:
 *       200:
 *         description: Sitio eliminado correctamente
 *       404:
 *         description: Sitio no encontrado
 *
 * /api/sitios/pais/{paisId}:
 *   get:
 *     summary: Obtener sitios por país
 *     tags: [Sitios]
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
 *         description: Lista de sitios del país
 */

// GET - Obtener todos los sitios
router.get("/", async (req, res) => {
  try {
    const sitios = await Sitio.find()
      .populate("ciudad", "nombre")
      .populate({
        path: "ciudad",
        populate: {
          path: "pais",
          select: "nombre",
        },
      });
    res.json(sitios);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener sitios", error: error.message });
  }
});

// GET - Obtener sitio por ID
router.get("/:id", async (req, res) => {
  try {
    const sitio = await Sitio.findById(req.params.id)
      .populate("ciudad", "nombre")
      .populate({
        path: "ciudad",
        populate: {
          path: "pais",
          select: "nombre",
        },
      });
    if (!sitio) {
      return res.status(404).json({ mensaje: "Sitio no encontrado" });
    }
    res.json(sitio);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener sitio", error: error.message });
  }
});

// GET - Obtener sitios por país
router.get("/pais/:paisId", async (req, res) => {
  try {
    const sitios = await Sitio.find().populate({
      path: "ciudad",
      match: { pais: req.params.paisId },
      select: "nombre",
      populate: {
        path: "pais",
        select: "nombre",
      },
    });

    const sitiosFiltrados = sitios.filter((sitio) => sitio.ciudad !== null);
    res.json(sitiosFiltrados);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener sitios del país",
      error: error.message,
    });
  }
});

// POST - Crear nuevo sitio
router.post("/", admin, async (req, res) => {
  try {
    const nuevoSitio = new Sitio(req.body);
    const sitioGuardado = await nuevoSitio.save();
    const sitioCompleto = await Sitio.findById(sitioGuardado._id)
      .populate("ciudad", "nombre")
      .populate({
        path: "ciudad",
        populate: {
          path: "pais",
          select: "nombre",
        },
      });
    res.status(201).json(sitioCompleto);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear sitio", error: error.message });
  }
});

// PUT - Actualizar sitio
router.put("/:id", admin, async (req, res) => {
  try {
    const sitioActualizado = await Sitio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("ciudad", "nombre")
      .populate({
        path: "ciudad",
        populate: {
          path: "pais",
          select: "nombre",
        },
      });

    if (!sitioActualizado) {
      return res.status(404).json({ mensaje: "Sitio no encontrado" });
    }
    res.json(sitioActualizado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al actualizar sitio", error: error.message });
  }
});

// DELETE - Eliminar sitio
router.delete("/:id", admin, async (req, res) => {
  try {
    const sitioEliminado = await Sitio.findByIdAndDelete(req.params.id);
    if (!sitioEliminado) {
      return res.status(404).json({ mensaje: "Sitio no encontrado" });
    }
    res.json({ mensaje: "Sitio eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar sitio", error: error.message });
  }
});

module.exports = router;
