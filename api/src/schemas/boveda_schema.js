const {z} = require('zod');

const bovedaSchema = z.object({
    empresa_id: z.string()
        .uuid({message: "El ID de empresa debe ser un UUID válido"}),

        ucm_domain: z.string()
        .min(5, { message: "El dominio es muy corto." })
        .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { 
            message: "Formato inválido. Solo envía el host (ej: 0724ae.a.myucm.cloud), sin https://" 
        }),

        ucm_user: z.string()
        .min(3, { message: "El usuario UCM debe ser el mismo que el usuario API." })
        .trim(), // Elimina espacios en blanco accidentales al inicio o al final
        
    ucm_secret: z.string()
        .min(5, { message: "La contraseña UCM no es válida." })
        .trim()
});

module.exports = bovedaSchema;