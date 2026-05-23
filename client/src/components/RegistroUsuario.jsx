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
        setEstado({ tipo: 'cargando', texto: 'Creando usuario en MERCI...' });

        // MOCK: Simulamos el registro y la generación de un JWT
        setTimeout(() => {
            setEstado({ tipo: 'exito', texto: 'Usuario creado. Redirigiendo al inicio...' });
            
            // 1. Guardamos un token simulado en el navegador
            localStorage.setItem('merci_token', 'token_jwt_simulado_12345');
            
            // 2. Redirigimos a la Landing Page (raíz) después de 1.5 segundos
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }, 1000);
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>1. Crear Cuenta MERCI</h2>
            <p>Ingresa tus credenciales de acceso al sistema.</p>
            
            {estado && <div style={{ color: estado.tipo === 'exito' ? 'green' : 'blue', marginBottom: '15px' }}>{estado.texto}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" name="email" placeholder="Correo corporativo" 
                    onChange={handleChange} value={credenciales.email} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" name="password" placeholder="Contraseña segura" 
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