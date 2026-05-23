const axios = require('axios');
const crypto = require('crypto');
const https = require('https');

const agent = new https.Agent({ rejectUnauthorized: false });

// 1. NUEVA LÓGICA DE AISLAMIENTO DE COOKIES
function parseCookies(setCookieHeader) {
    if (!setCookieHeader) return { red: '', aislada: null };
    
    const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    
    // Cookie de Red: Une todas las cabeceras (AWSALB, TRACKID, session-identify) para las peticiones HTTP
    const cookieRed = cookies.map(cookie => cookie.split(';')[0]).join('; ');

    // Cookie Aislada: Busca estrictamente la llave de sesión de Grandstream
    let cookieAislada = null;
    const cookieTarget = cookies.find(c => c.includes('session-identify'));
    if (cookieTarget) {
        // Extrae exactamente el valor de "session-identify=..." omitiendo rutas y parámetros de seguridad
        cookieAislada = cookieTarget.split(';')[0]; 
    }

    return { red: cookieRed, aislada: cookieAislada };
}

async function ejecutarConexionUCM(domain, usuario, secreto) {
    try {
        const baseURL = `https://${domain}:8443/api`;
        
        // PASO 1: Challenge
        const restChallenge = await axios.post(baseURL, {
            request: { action: "challenge", user: usuario, version: "1.0" }
        }, { httpsAgent: agent });
        
        if (restChallenge.data.status !== 0) {
           return { exito: false, mensaje: 'Reto rechazado por CloudUCM' };
        }

        const challenge = restChallenge.data.response.challenge;
        const cookiesChallenge = parseCookies(restChallenge.headers['set-cookie']);

        // PASO 2: MD5 Hash
        const hash = crypto.createHash('md5').update(challenge + secreto).digest('hex');

        // PASO 3: Login
        const restLogin = await axios.post(baseURL, {
            request: { action: "login", token: hash, url: baseURL, user: usuario }
        }, {
            headers: { 'Cookie': cookiesChallenge.red },
            httpsAgent: agent
        });

        if (restLogin.data.status === 0) {
            const cookiesFinales = parseCookies(restLogin.headers['set-cookie']);
            
            // Si el login generó nueva sesión, la tomamos. Si no, usamos la del challenge.
            const cookieAislada = cookiesFinales.aislada || cookiesChallenge.aislada;

            return { 
                exito: true, 
                mensaje: 'Login exitoso',
                datos_fase_0: {
                    challenge_generado: challenge,
                    hash_md5: hash,
                    cookie_session_identify: cookieAislada // Cookie purificada y aislada
                }
            };
        } else {
            return { exito: false, mensaje: 'Credenciales inválidas' };
        }
    } catch (error) {
        return { exito: false, mensaje: 'Error de red hacia Grandstream' };
    }
}

module.exports = { ejecutarConexionUCM };