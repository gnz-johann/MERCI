// La función recibe el "schema" y retorna el middleware que Express entiende
const validarDatos = (schema) => (req, res, next) => {
    try {
        // Utilizamos el esquema que recibimos como parámetro
        schema.parse(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            status: 'error',
            message: 'Datos de entrada inválidos',
            errores: error.errors.map(err => err.message)
        });
    }
};

module.exports = validarDatos;