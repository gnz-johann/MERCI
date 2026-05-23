const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. CARGAR VARIABLES DE ENTORNO ANTES QUE NADA
dotenv.config();

// 2. Ahora sí, importamos nuestras rutas locales (que ya podrán leer el .env)
const bovedaRoutes = require('./routes/boveda_routes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'success', message: 'API MERCI Operativa' });
});

// Conectamos la ruta POST
app.use('/api/v1/boveda', bovedaRoutes);

module.exports = app;