// controllers/queriesController.js
// Consultas avanzadas para el proyecto de turismo

const Tag = require('../models/Tag');
const Visita = require('../models/Visita');
const Usuario = require('../models/Usuario');
const Famoso = require('../models/Famoso');
const Plato = require('../models/Plato');
const Sitio = require('../models/Sitio');
const Ciudad = require('../models/Ciudad');

// 1. Famosos más taggeados por los usuarios
exports.famososMasTaggeados = async (req, res) => {
  try {
    const resultado = await Tag.aggregate([
      { $group: { _id: "$famoso", totalTags: { $sum: 1 } } },
      { $sort: { totalTags: -1 } },
      { $lookup: {
          from: "famosos",
          localField: "_id",
          foreignField: "_id",
          as: "famoso"
      }},
      { $unwind: "$famoso" },
      { $project: { _id: 0, famoso: 1, totalTags: 1 } }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la consulta', error: error.message });
  }
};

// 2. Usuarios con más visitas
exports.usuariosMasVisitas = async (req, res) => {
  try {
    const resultado = await Visita.aggregate([
      { $group: { _id: "$usuario", totalVisitas: { $sum: 1 } } },
      { $sort: { totalVisitas: -1 } },
      { $lookup: {
          from: "usuarios",
          localField: "_id",
          foreignField: "_id",
          as: "usuario"
      }},
      { $unwind: "$usuario" },
      { $project: { _id: 0, usuario: 1, totalVisitas: 1 } }
    ]);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la consulta', error: error.message });
  }
};

// 3. Platos por país y/o ciudad
exports.platosPorPaisCiudad = async (req, res) => {
  try {
    const { paisId, ciudadId } = req.query;
    let ciudadFilter = {};
    if (paisId) {
      ciudadFilter.pais = paisId;
    }
    if (ciudadId) {
      ciudadFilter._id = ciudadId;
    }
    // Buscar ciudades que cumplen el filtro
    const ciudades = await Ciudad.find(ciudadFilter).select('_id');
    const ciudadesIds = ciudades.map(c => c._id);
    // Buscar sitios en esas ciudades
    const sitios = await Sitio.find({ ciudad: { $in: ciudadesIds } }).select('_id');
    const sitiosIds = sitios.map(s => s._id);
    // Buscar platos en esos sitios
    const platos = await Plato.find({ sitio: { $in: sitiosIds } });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al buscar platos', error: error.message });
  }
};

// 4. Platos registrados en visitas o tags por más de N usuarios (N=2 por defecto)
exports.platosPorUsuariosUnicos = async (req, res) => {
  try {
    const N = parseInt(req.query.n) || 2;
    // Usuarios únicos por plato en visitas
    const visitas = await Visita.aggregate([
      { $group: { _id: { plato: "$plato", usuario: "$usuario" } } },
      { $group: { _id: "$_id.plato", usuarios: { $addToSet: "$_id.usuario" } } },
      { $project: { plato: "$_id", usuarios: 1, _id: 0 } }
    ]);
    // Usuarios únicos por plato en tags
    const tags = await Tag.aggregate([
      { $group: { _id: { plato: "$plato", usuario: "$usuario" } } },
      { $group: { _id: "$_id.plato", usuarios: { $addToSet: "$_id.usuario" } } },
      { $project: { plato: "$_id", usuarios: 1, _id: 0 } }
    ]);
    // Unir usuarios únicos por plato
    const usuariosPorPlato = {};
    visitas.forEach(v => {
      usuariosPorPlato[v.plato] = new Set(v.usuarios);
    });
    tags.forEach(t => {
      if (!usuariosPorPlato[t.plato]) usuariosPorPlato[t.plato] = new Set();
      t.usuarios.forEach(u => usuariosPorPlato[t.plato].add(u));
    });
    // Filtrar platos con más de N usuarios únicos
    const platosIds = Object.entries(usuariosPorPlato)
      .filter(([plato, usuarios]) => plato !== 'null' && usuarios.size >= N)
      .map(([plato]) => plato);
    // Obtener info de los platos
    const platos = await Plato.find({ _id: { $in: platosIds } });
    res.json(platos);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en la consulta', error: error.message });
  }
};

// 5. Top 10 sitios más visitados de toda la base de datos
exports.topSitios = async (req, res) => {
  try {
    const topSitios = await Visita.aggregate([
      {
        $lookup: {
          from: 'sitios',
          localField: 'sitio',
          foreignField: '_id',
          as: 'sitioInfo'
        }
      },
      { $unwind: '$sitioInfo' },
      {
        $lookup: {
          from: 'ciudads',
          localField: 'sitioInfo.ciudad',
          foreignField: '_id',
          as: 'ciudadInfo'
        }
      },
      { $unwind: '$ciudadInfo' },
      {
        $group: {
          _id: '$sitio',
          totalVisitas: { $sum: 1 },
          sitioInfo: { $first: '$sitioInfo' },
          ciudadInfo: { $first: '$ciudadInfo' }
        }
      },
      { $sort: { totalVisitas: -1 } },
      { $limit: 10 }
    ]);
    res.json(topSitios);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener top sitios', error: error.message });
  }
};
