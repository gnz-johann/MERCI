const express = require('express');
const router = express.Router();

// Importamos el guardia (Zod) y el controlador
const validarDatos = require('../middlewares/validar_datos');
const bovedaSchema = require('../schemas/boveda_schema');
const { configurarBoveda } = require('../controllers/boveda_controller');

// Ruta definitiva: Pasa por el filtro de Zod antes de llegar al controlador
router.post('/configurar', validarDatos(bovedaSchema), configurarBoveda);

module.exports = router;