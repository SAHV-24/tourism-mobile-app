/**
 * @swagger
 * tags:
 *   name: Consultas
 *   description: Endpoints de consultas avanzadas y estadísticas
 *
 * /api/queries/famosos-mas-taggeados:
 *   get:
 *     summary: Famosos más taggeados por los usuarios
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de famosos ordenados por cantidad de tags
 *
 * /api/queries/usuarios-mas-visitas:
 *   get:
 *     summary: Usuarios con más visitas
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios ordenados por cantidad de visitas
 *
 * /api/queries/platos-por-ubicacion:
 *   get:
 *     summary: Buscar platos por país y/o ciudad
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paisId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID del país (opcional)
 *       - in: query
 *         name: ciudadId
 *         schema:
 *           type: string
 *         required: false
 *         description: ID de la ciudad (opcional)
 *     responses:
 *       200:
 *         description: Lista de platos encontrados
 *
 * /api/queries/platos-por-usuarios-unicos:
 *   get:
 *     summary: Platos registrados en visitas o tags por más de N usuarios únicos
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: n
 *         schema:
 *           type: integer
 *         required: false
 *         description: Número mínimo de usuarios únicos (por defecto 2)
 *     responses:
 *       200:
 *         description: Lista de platos
 *
 * /api/queries/top-sitios:
 *   get:
 *     summary: Top 10 sitios más visitados por país
 *     tags: [Consultas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paisId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del país
 *     responses:
 *       200:
 *         description: Lista de los 10 sitios más visitados del país
 */

const express = require('express');
const router = express.Router();
const queriesController = require('../controllers/queriesController');

// 1. Famosos más taggeados por los usuarios
router.get('/famosos-mas-taggeados', queriesController.famososMasTaggeados);

// 2. Usuarios con más visitas
router.get('/usuarios-mas-visitas', queriesController.usuariosMasVisitas);

// 3. Buscar platos por país y/o ciudad (query params: paisId, ciudadId)
router.get('/platos-por-ubicacion', queriesController.platosPorPaisCiudad);

// 4. Platos registrados en visitas o tags por más de N usuarios (query param: n)
router.get('/platos-por-usuarios-unicos', queriesController.platosPorUsuariosUnicos);

// 5. Top 10 sitios más visitados por país
router.get('/top-sitios', queriesController.topSitios);

module.exports = router;
