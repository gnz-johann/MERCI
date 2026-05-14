const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check - Ruta de prueba inicial
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'success', message: 'API MERCI Operativa' });
});

module.exports = app;