import { useState} from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();
   const [sesionActiva, setSesionActiva] = useState(() => {
        return localStorage.getItem('merci_token') !== null;
    });

    // Función auxiliar para borrar el token en pruebas
    const cerrarSesion = () => {
        localStorage.removeItem('merci_token');
        setSesionActiva(false);
    };

    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
            <h1>Bienvenido a CORA MERCI</h1>
            <p>Módulo de Enrutamiento y Respuesta de Comunicaciones Inteligentes</p>
            
            <div style={{ marginTop: '40px' }}>
                {!sesionActiva ? (
                    // Si NO hay token, mostramos el botón de Registro
                    <button 
                        onClick={() => navigate('/registro')} 
                        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
                    >
                        Registrarse en MERCI
                    </button>
                ) : (
                    // Si SÍ hay token, mostramos el botón de Conexión UCM y un botón para limpiar pruebas
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                        <button 
                            onClick={() => navigate('/configurar-boveda')} 
                            style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}
                        >
                            Configurar Conexión CloudUCM
                        </button>
                        
                        <button 
                            onClick={cerrarSesion} 
                            style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer', backgroundColor: '#DC3545', color: 'white', border: 'none', borderRadius: '5px', marginTop: '20px' }}
                        >
                            Borrar Token (Reiniciar Prueba)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LandingPage;