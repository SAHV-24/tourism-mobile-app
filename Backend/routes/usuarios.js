const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");

// POST /api/usuarios/signup - Registro
router.post("/signup", async (req, res) => {
  try {
    const { nombre, apellido, correo, usuario, contraseña, rol } = req.body;
    if (!nombre || !apellido || !correo || !usuario || !contraseña) {
      return res
        .status(400)
        .json({ mensaje: "Todos los campos son requeridos" });
    }
    const existe = await Usuario.findOne({ $or: [{ correo }, { usuario }] });
    if (existe) {
      return res.status(400).json({ mensaje: "El correo o usuario ya existe" });
    }
    const hash = await bcrypt.hash(contraseña, 10);
    const nuevoUsuario = new Usuario({
      nombre,
      apellido,
      correo,
      usuario,
      contraseña: hash,
      rol,
    });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario registrado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al registrar usuario", error: error.message });
  }
});

// POST /api/usuarios/login - Login
router.post("/login", async (req, res) => {
  try {
    const { usuario, contraseña } = req.body;
    if (!usuario || !contraseña) {
      return res
        .status(400)
        .json({ mensaje: "Usuario y contraseña son requeridos" });
    }
    const usuarioEncontrado = await Usuario.findOne({ usuario });
    if (!usuarioEncontrado) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
    const passwordValida = await bcrypt.compare(
      contraseña,
      usuarioEncontrado.contraseña
    );
    if (!passwordValida) {
      return res.status(401).json({ mensaje: "Credenciales incorrectas" });
    }
    const token = jwt.sign(
      {
        _id: usuarioEncontrado._id,
        usuario: usuarioEncontrado.usuario,
        rol: usuarioEncontrado.rol,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.json({ mensaje: "Login exitoso", token });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error en el login", error: error.message });
  }
});

module.exports = router;
