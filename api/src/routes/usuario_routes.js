const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario_controller');

// Ruta: POST /api/v1/usuarios/registro
router.post('/registro', usuarioController.registrarUsuarioBase);

module.exports = router;