const crypto = require('crypto');

// Forzamos que la llave maestra tomada del .env tenga exactamente 32 bytes para AES-256
const LLAVE_MAESTRA = process.env.JWT_SECRET 
    ? process.env.JWT_SECRET.padEnd(32, '0').substring(0, 32) 
    : 'llave_con_error_de_inicializacion_';

const LONGITUD_IV = 16; // Vector de Inicialización estándar para CBC (16 bytes)

/**
 * Cifra un texto plano utilizando AES-256-CBC
 * @param {string} texto - Cadena en texto plano (ej: contraseña de CloudUCM)
 * @returns {string} iv:textoCifrado en formato hexadecimal
 */
function encriptar(texto) {
    const iv = crypto.randomBytes(LONGITUD_IV);
    const cifrador = crypto.createCipheriv('aes-256-cbc', Buffer.from(LLAVE_MAESTRA), iv);
    
    let encriptado = cifrador.update(texto, 'utf8');
    encriptado = Buffer.concat([encriptado, cifrador.final()]);
    
    // Retornamos el IV y el texto encriptado unidos por dos puntos
    return iv.toString('hex') + ':' + encriptado.toString('hex');
}

/**
 * Descifra un texto encriptado utilizando AES-256-CBC
 * @param {string} textoCifradoCompleto - Cadena con formato iv:textoCifrado
 * @returns {string} Texto plano original descifrado
 */
function desencriptar(textoCifradoCompleto) {
    const partes = textoCifradoCompleto.split(':');
    const iv = Buffer.from(partes.shift(), 'hex');
    const textoEncriptadoString = Buffer.from(partes.join(':'), 'hex');
    
    const descifrador = crypto.createDecipheriv('aes-256-cbc', Buffer.from(LLAVE_MAESTRA), iv);
    
    let desencriptado = descifrador.update(textoEncriptadoString);
    desencriptado = Buffer.concat([desencriptado, descifrador.final()]);
    
    return desencriptado.toString('utf8');
}

module.exports = { encriptar, desencriptar };