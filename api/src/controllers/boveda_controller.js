const pool = require('../config/db'); 
const { encriptar } = require('../utils/cifrador_llaves');
// Importamos ÚNICAMENTE la función de conexión base
const { ejecutarConexionUCM } = require('../services/conector_ucm');

const configurarBoveda = async (req, res) => {
    // 1. Extraemos los datos que Ferchis envía desde Postman/Front
    const { empresa_id, ucm_domain, ucm_user, ucm_secret } = req.body;

    try {
        // 2. ÚNICA Y EXCLUSIVAMENTE LA CONEXIÓN (Handshake + Login)
        const conexion = await ejecutarConexionUCM(ucm_domain, ucm_user, ucm_secret);

        if (!conexion.exito) {
            return res.status(401).json({
                status: 'error',
                message: conexion.mensaje
            });
        }

        // 3. Si CloudUCM autorizó el login, encriptamos la contraseña
        const secretoCifrado = encriptar(ucm_secret);

        // 4. Inserción en la Caja Fuerte de PostgreSQL
        const query = `
            INSERT INTO bovedas_ucm (empresa_id, ucm_domain, ucm_user, ucm_secret_cifrado)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (empresa_id) 
            DO UPDATE SET 
                ucm_domain = EXCLUDED.ucm_domain, 
                ucm_user = EXCLUDED.ucm_user, 
                ucm_secret_cifrado = EXCLUDED.ucm_secret_cifrado
            RETURNING id;
        `;
        
        await pool.query(query, [empresa_id, ucm_domain, ucm_user, secretoCifrado]);

        // 5. Pase Frontend (Mostrando la data aislada para la Guía de Pruebas)
        return res.status(200).json({
            status: 'success',
            autorizado: true,
            message: 'Conexión validada exitosamente con CloudUCM y credenciales resguardadas.',
            fase_0_documentacion: conexion.datos_fase_0 // Imprime Challenge, Hash y la Cookie aislada
        });

    } catch (error) {
        console.error('Error en Bóveda Controller:', error);
        return res.status(500).json({
            status: 'error',
            message: 'Error interno en el servidor de MERCI.'
        });
    }
};

module.exports = { configurarBoveda };