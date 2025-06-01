const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/Usuario");
const auth = require("../middleware/auth");

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Endpoints para usuarios
 *
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *
 * /api/usuarios/login:
 *   post:
 *     summary: Login de usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *               contraseña:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *       404:
 *         description: Usuario no encontrado
 *   put:
 *     summary: Actualizar usuario (solo el usuario o admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Usuario actualizado
 *       404:
 *         description: Usuario no encontrado
 *   delete:
 *     summary: Eliminar usuario (solo el usuario o admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *
 * /api/usuarios/signup:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               correo:
 *                 type: string
 *               usuario:
 *                 type: string
 *               contraseña:
 *                 type: string
 *               rol:
 *                 type: Administrador | UsuarioDefault
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 id:
 *                   type: string
 *             example:
 *               mensaje: Usuario registrado correctamente
 *               id: 6654e1c2a1b2c3d4e5f6a7b8
 */

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
    res.status(201).json({ mensaje: "Usuario registrado correctamente", id: nuevoUsuario._id });
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

// GET - Obtener todos los usuarios
router.get("/", auth, async (req, res) => {
  try {
    const usuarios = await Usuario.find().select("-contraseña");
    res.json(usuarios);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener usuarios", error: error.message });
  }
});

// GET - Obtener usuario por ID
router.get("/:id", auth, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select("-contraseña");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener usuario", error: error.message });
  }
});

// PUT - Actualizar usuario
router.put("/:id", auth, async (req, res) => {
  try {
    const { contraseña, ...resto } = req.body;
    let updateData = { ...resto };
    if (contraseña) {
      updateData.contraseña = await bcrypt.hash(contraseña, 10);
    }
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-contraseña");
    if (!usuarioActualizado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    res
      .status(400)
      .json({ mensaje: "Error al actualizar usuario", error: error.message });
  }
});

// DELETE - Eliminar usuario
router.delete("/:id", auth, async (req, res) => {
  try {
    const usuarioEliminado = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuarioEliminado) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar usuario", error: error.message });
  }
});

module.exports = router;
