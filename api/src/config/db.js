const { Pool } = require('pg');
require('dotenv').config();

// Creamos la instancia de conexión utilizando las variables de nuestro .env
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

// Mensaje de éxito para saber que el puente se estableció al arrancar
pool.on('connect', () => {
    console.log('✅ Puente de conexión con PostgreSQL establecido.');
});

// Capturador de errores por si la base de datos se apaga
pool.on('error', (err) => {
    console.error('❌ Error inesperado en el cliente de PostgreSQL:', err);
    process.exit(-1);
});

module.exports = pool;