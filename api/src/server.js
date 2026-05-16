const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor API MERCI escuchando en el puerto ${PORT}`);
}); 

const {obtenerConfiguracionLocal} = require('./middlewares/gestor_empresas');
const {ejecutarConexionUCM} = require('./services/conector_ucm');

setTimeout(async () => {
    console.log('Iniciando proceso de conexión con CloudUCM...');

    const datosConfig = obtenerConfiguracionLocal();
    const conexionExitosa = await ejecutarConexionUCM(datosConfig);

    if (conexionExitosa) {
        console.log('Conexión con CloudUCM establecida exitosamente.');
    } else {
        console.error('El conmutador rechazó el token final.');
    }
}, 3000); // Esperamos 5 segundos para asegurarnos de que el servidor esté listo antes de intentar la conexión