const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

// 1. Registro de Usuarios Base (Manteniendo la lógica existente)
const registrarUsuarioBase = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            console.log('🟡 [MERCI] Intento de registro fallido: Faltan credenciales.');
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO usuarios (email, password_hash) 
            VALUES ($1, $2) 
            RETURNING id, email, fecha_creacion;
        `;
        const valores = [email, passwordHash];
        const resultado = await pool.query(query, valores);
        const nuevoUsuario = resultado.rows[0];

        console.log(`🟢 [MERCI] Nuevo usuario registrado exitosamente: ${nuevoUsuario.email}`);

        res.status(201).json({
            exito: true,
            mensaje: 'Usuario registrado correctamente en MERCI.',
            usuario: nuevoUsuario
        });

    } catch (error) {
        console.error('🔴 [MERCI] Error en registrarUsuarioBase:', error.message);
        if (error.code === '23505') {
            return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
        }
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
};

// 2. NUEVO: Autenticación de Usuarios con Validación Operativa
const loginUsuario = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            console.log('🟡 [MERCI] Intento de login fallido: Campos incompletos.');
            return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
        }

        // Paso A: Verificar la existencia del usuario en la plataforma
        const usuarioQuery = 'SELECT * FROM usuarios WHERE email = $1';
        const usuarioResult = await pool.query(usuarioQuery, [email]);

        if (usuarioResult.rows.length === 0) {
            console.log(`🟡 [MERCI] Acceso denegado: El correo electrónico [${email}] no está registrado.`);
            return res.status(401).json({ error: 'Credenciales de acceso incorrectas.' });
        }

        const usuario = usuarioResult.rows[0];

        // Paso B: Validar la contraseña desencriptando el hash
        const contraseñaCorrecta = await bcrypt.compare(password, usuario.password_hash);
        if (!contraseñaCorrecta) {
            console.log(`🟡 [MERCI] Acceso denegado: Contraseña errónea para el usuario [${email}].`);
            return res.status(401).json({ error: 'Credenciales de acceso incorrectas.' });
        }

        // Paso C: Validación Multi-tenant. Verificar si el usuario está asociado a un Empleado
        const empleadoQuery = 'SELECT * FROM empleados WHERE usuario_id = $1';
        const empleadoResult = await pool.query(empleadoQuery, [usuario.id]);

        if (empleadoResult.rows.length === 0) {
            console.log(`🔵 [MERCI] Acceso retenido: El usuario [${email}] es un registro huérfano en el sistema.`);
            return res.status(403).json({
                exito: false,
                codigo: 'USUARIO_HUERFANO',
                error: 'Tu cuenta está activa, pero no estás vinculado a ningún perfil de empleado de Inttelec.'
            });
        }

        const empleado = empleadoResult.rows[0];
        console.log(`🟢 [MERCI] Autenticación exitosa: ${email} ha iniciado sesión. Operador: ${empleado.nombre} ${empleado.apellido}.`);

        // Paso D: Firma del Token Real (Utiliza la variable JWT_SECRET del .env o un fallback seguro de pruebas)
        const firmaSecreta = process.env.JWT_SECRET || 'merci_sandbox_secret_key_2026';
        const token = jwt.sign(
            { 
                usuarioId: usuario.id, 
                empleadoId: empleado.id, 
                empresaId: empleado.empresa_id 
            },
            firmaSecreta,
            { expiresIn: '8h' }
        );

        // Respuesta limpia y estructurada
        res.status(200).json({
            exito: true,
            mensaje: 'Acceso autorizado.',
            token,
            empleado: {
                nombre: empleado.nombre,
                apellido: empleado.apellido,
                rol: empleado.rol,
                empresaId: empleado.empresa_id
            }
        });

    } catch (error) {
        console.error('🔴 [MERCI] Error crítico en el método loginUsuario:', error.message);
        res.status(500).json({ error: 'Error interno del servidor al procesar el acceso.' });
    }
};

module.exports = {
    registrarUsuarioBase,
    loginUsuario
};