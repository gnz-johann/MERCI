const { encriptar, desencriptar } = require('../utils/cifrador_llaves');

function obtenerConfiguracionLocal() {
    const ip = process.env.GRANDSTREAM_IP.trim();
    const usuario = process.env.GRANDSTREAM_USER.trim();
    const secretoPuro = process.env.GRANDSTREAM_SECRET.trim();

    const secretoCifrado = encriptar(secretoPuro);

    return {
        url: `https://${ip}:8443/api`,
        usuario: usuario,
        secreto: desencriptar(secretoCifrado), // Desencriptamos para usarlo en la conexión
        version: "1.0" 
    };
}
module.exports = { obtenerConfiguracionLocal };