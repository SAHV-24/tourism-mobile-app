module.exports = (req, res, next) => {
  if (req.usuario && req.usuario.rol === 'Administrador') {
    return next();
  }
  return res.status(403).json({ mensaje: 'Acceso restringido a administradores.' });
};
