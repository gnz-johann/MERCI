import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
    const navigate = useNavigate();
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const [estado, setEstado] = useState(null);

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstado({ tipo: 'cargando', texto: 'Autenticando credenciales de operador...' });

        try {
            const respuesta = await fetch('http://localhost:3000/api/v1/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credenciales)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                // Interceptamos de forma inteligente si el servidor indica que es un usuario sin empresa vinculada
                if (respuesta.status === 403 && data.codigo === 'USUARIO_HUERFANO') {
                    setEstado({ tipo: 'advertencia', texto: data.error });
                    return;
                }
                throw new Error(data.error || 'No se pudo validar el acceso.');
            }

            // Guardamos el token JWT legítimo generado por el backend
            localStorage.setItem('merci_token', data.token);
            
            setEstado({ tipo: 'exito', texto: `¡Bienvenido, ${data.empleado.nombre}! Acceso autorizado.` });

            // Redirección directa hacia la raíz o el Workspace de trabajo
            setTimeout(() => {
                navigate('/configurar-boveda');
            }, 1200);

        } catch (error) {
            setEstado({ tipo: 'error', texto: error.message });
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '40px',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #eaeaea'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '35px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a1a', margin: '0 0 10px 0' }}>
                        Iniciar Sesión
                    </h2>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        Plataforma Middleware MERCI Sandbox
                    </p>
                </div>

                {estado && (
                    <div style={{
                        padding: '12px',
                        borderRadius: '6px',
                        fontSize: '14px',
                        marginBottom: '20px',
                        fontWeight: '500',
                        textAlign: 'center',
                        backgroundColor: estado.tipo === 'exito' ? '#e6f4ea' : estado.tipo === 'error' ? '#fce8e6' : estado.tipo === 'advertencia' ? '#ffe6cc' : '#e8f0fe',
                        color: estado.tipo === 'exito' ? '#137333' : estado.tipo === 'error' ? '#c5221f' : estado.tipo === 'advertencia' ? '#b06000' : '#1a73e8'
                    }}>
                        {estado.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Correo de Operador
                        </label>
                        <input 
                            type="email" name="email" placeholder="ejemplo@inttelec.com" 
                            onChange={handleChange} value={credenciales.email} required 
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <label style={{ fontSize: '12px', fontWeight: '600', color: '#444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Contraseña del Sistema
                        </label>
                        <input 
                            type="password" name="password" placeholder="••••••••" 
                            onChange={handleChange} value={credenciales.password} required 
                            style={{ padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '15px', outline: 'none' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={estado?.tipo === 'cargando'} 
                        style={{ 
                            padding: '14px', 
                            borderRadius: '6px', 
                            backgroundColor: '#1a1a1a', 
                            color: '#ffffff', 
                            border: 'none', 
                            fontSize: '15px', 
                            fontWeight: '600', 
                            cursor: estado?.tipo === 'cargando' ? 'not-allowed' : 'pointer',
                            opacity: estado?.tipo === 'cargando' ? 0.7 : 1,
                            transition: 'background-color 0.2s ease',
                            marginTop: '10px'
                        }}
                    >
                        {estado?.tipo === 'cargando' ? 'Verificando...' : 'Autenticar'}
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '25px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button 
                        onClick={() => navigate('/')} 
                        style={{ background: 'none', border: 'none', color: '#555', fontSize: '14px', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Volver a la Página Principal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginUsuario;