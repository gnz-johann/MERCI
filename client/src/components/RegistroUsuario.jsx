import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistroUsuario = () => {
    const navigate = useNavigate();
    const [credenciales, setCredenciales] = useState({
        email: '',
        password: ''
    });
    const [estado, setEstado] = useState(null);

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validación estricta solicitada: Solo letras y números
        const esAlfanumerica = /^[a-zA-Z0-9]+$/.test(credenciales.password);
        if (!esAlfanumerica) {
            setEstado({ tipo: 'error', texto: 'Para esta fase de pruebas, la contraseña solo debe contener letras y números.' });
            return;
        }

        setEstado({ tipo: 'cargando', texto: 'Creando usuario en MERCI...' });

        try {
            // 2. Petición real al backend local que acabamos de configurar
            const respuesta = await fetch('http://localhost:3000/api/v1/usuarios/registro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciales)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                // Captura el error exacto que arroje nuestro try-catch del backend (ej. 409 Correo duplicado)
                throw new Error(data.error || 'Ocurrió un error al registrar el usuario.');
            }

            // 3. Flujo de éxito
            setEstado({ tipo: 'exito', texto: 'Usuario creado correctamente. Redirigiendo al Login...' });
            
            // Ya no guardamos un JWT falso, redirigimos al login real
            setTimeout(() => {
                navigate('/login');
            }, 1500);

        } catch (error) {
            // Se pinta de rojo el error proveniente del servidor o de la red
            setEstado({ tipo: 'error', texto: error.message });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>1. Crear Cuenta MERCI</h2>
            <p>Ingresa tus credenciales de acceso al sistema.</p>
            
            {/* Renderizado dinámico de alertas */}
            {estado && (
                <div style={{ 
                    color: estado.tipo === 'exito' ? 'green' : estado.tipo === 'error' ? 'red' : 'blue', 
                    marginBottom: '15px',
                    fontWeight: 'bold'
                }}>
                    {estado.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" name="email" placeholder="Correo electrónico (@gmail.com permitido)" 
                    onChange={handleChange} value={credenciales.email} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" name="password" placeholder="Contraseña (Solo letras y números)" 
                    onChange={handleChange} value={credenciales.password} required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" disabled={estado?.tipo === 'cargando'} style={{ padding: '10px', cursor: 'pointer' }}>
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default RegistroUsuario;