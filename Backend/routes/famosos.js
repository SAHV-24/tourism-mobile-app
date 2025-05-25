const express = require("express");
const router = express.Router();
const Famoso = require("../models/Famoso");
const admin = require("../middleware/admin");

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
