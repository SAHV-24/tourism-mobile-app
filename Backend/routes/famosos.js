const express = require("express");
const router = express.Router();
const Famoso = require("../models/Famoso");
const admin = require("../middleware/admin");

/**
 * @swagger
 * tags:
 *   name: Famosos
 *   description: Endpoints para famosos
 *
 * /api/famosos:
 *   get:
 *     summary: Obtener todos los famosos
 *     tags: [Famosos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de famosos
 *   post:
 *     summary: Crear un famoso (solo admin)
 *     tags: [Famosos]
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
 *               ciudadNacimiento:
 *                 type: string
 *               actividad:
 *                 type: string
 *               foto:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Famoso creado
 *
 * /api/famosos/{id}:
 *   get:
 *     summary: Obtener famoso por ID
 *     tags: [Famosos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del famoso
 *     responses:
 *       200:
 *         description: Famoso encontrado
 *       404:
 *         description: Famoso no encontrado
 *   put:
 *     summary: Actualizar famoso (solo admin)
 *     tags: [Famosos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del famoso
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Famoso actualizado
 *       404:
 *         description: Famoso no encontrado
 *   delete:
 *     summary: Eliminar famoso (solo admin)
 *     tags: [Famosos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del famoso
 *     responses:
 *       200:
 *         description: Famoso eliminado
 *       404:
 *         description: Famoso no encontrado
 *
 * /api/famosos/pais/{paisId}:
 *   get:
 *     summary: Obtener famosos por país
 *     tags: [Famosos]
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
 *         description: Lista de famosos del país
 */

// GET - Obtener todos los famosos
router.get("/", async (req, res) => {
  try {
    const famosos = await Famoso.find().populate({
      path: "ciudadNacimiento",
      select: "nombre",
      populate: {
        path: "pais",
        select: "nombre",
      },
    });
    res.json(famosos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener famosos", error: error.message });
  }
});

// GET - Obtener famoso por ID
router.get("/:id", async (req, res) => {
  try {
    const famoso = await Famoso.findById(req.params.id).populate({
      path: "ciudadNacimiento",
      select: "nombre",
      populate: {
        path: "pais",
        select: "nombre",
      },
    });
    if (!famoso) {
      return res.status(404).json({ mensaje: "Famoso no encontrado" });
    }
    res.json(famoso);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener famoso", error: error.message });
  }
});

// GET - Obtener famosos por país
router.get("/pais/:paisId", async (req, res) => {
  try {
    const famosos = await Famoso.find().populate({
      path: "ciudadNacimiento",
      match: { pais: req.params.paisId },
      select: "nombre",
      populate: {
        path: "pais",
        select: "nombre",
      },
    });

    const famososFiltrados = famosos.filter(
      (famoso) => famoso.ciudadNacimiento !== null
    );
    res.json(famososFiltrados);
  } catch (error) {
    res
      .status(500)
      .json({
        mensaje: "Error al obtener famosos del país",
        error: error.message,
      });
  }
});

// CREATE - Solo admin
router.post("/", admin, async (req, res) => {
  try {
    const { nombre, ciudadNacimiento, actividad, foto, descripcion } = req.body;
    const famoso = new Famoso({
      nombre,
      ciudadNacimiento,
      actividad,
      foto,
      descripcion,
    });
    await famoso.save();
    res.status(201).json(famoso);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al crear famoso", error: error.message });
  }
});

// UPDATE - Solo admin
router.put("/:id", admin, async (req, res) => {
  try {
    const famosoActualizado = await Famoso.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!famosoActualizado) {
      return res.status(404).json({ mensaje: "Famoso no encontrado" });
    }
    res.json(famosoActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar famoso", error: error.message });
  }
});
// DELETE - Solo admin
router.delete("/:id", admin, async (req, res) => {
  try {
    const famosoEliminado = await Famoso.findByIdAndDelete(req.params.id);
    if (!famosoEliminado) {
      return res.status(404).json({ mensaje: "Famoso no encontrado" });
    }
    res.json({ mensaje: "Famoso eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar famoso", error: error.message });
  }
});

module.exports = router;
