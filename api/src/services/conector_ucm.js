const axios = require('axios');
const crypto = require('crypto');

async function ejecutarConexionUCM(config) {
    try {
        console.log(`Conexión establecida y conectada a: ${config.url}`);
        const cuerpoChallenge = {
            request: {
                action:"challenge",
                user: config.usuario,
                version: config.version
            }
        };

        const restChallenge = await axios.post(config.url, cuerpoChallenge);
        if(restChallenge.data.status !== 0 || !restChallenge.data.response?.challenge) {
           console.error('El conmutador rechazó la solicitud de reto:', restChallenge.data);
           return false;
        }

        const challenge = restChallenge.data.response.challenge;
        const cookie = restChallenge.headers['set-cookie'];
        console.log('PASO 1: Reto recibido del conmutador:');

        //FÓRMULA DE HASH: MD5(challenge + password)
        const hash = crypto.createHash('md5').update(challenge + config.secreto).digest('hex');

        //BLOQUE 5: PASO 3 || ENVÍO DEL TOKEN DE LOGIN
        const cuerpoLogin = {
            request: {
                action:"login",
                user: config.usuario,
                token: hash //SE ENVÍA BAJO EL NOMBRE "token" EN LUGAR DE "password"
            }
        };

        const restLogin = await axios.post(config.url, cuerpoLogin, {
            headers: {
                Cookie: cookie //SE INCLUYE LA COOKIE RECIBIDA EN EL PASO 1
            }
        });

        if(restLogin.data.status === 0) {
            console.log('PASO 3: Login exitoso, token de sesión recibido:');
            return true;
        }else {
            console.error('Login fallido, credenciales inválidas o token corrupto:', restLogin.data);
            return false;
        }
    } catch (error) {
        console.error('Error durante la conexión con CloudUCM:', error.message);
        return false;
    }
}

module.exports = { ejecutarConexionUCM };