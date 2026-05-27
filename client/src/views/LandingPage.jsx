import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
            <h1>Bienvenido a MERCI Sandbox</h1>
            <p>Entorno de desarrollo y pruebas para la integración con CloudUCM.</p>
            
            <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
                <button 
                    onClick={() => navigate('/login')} 
                    style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#333', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Iniciar Sesión
                </button>

                <button 
                    onClick={() => navigate('/registro')} 
                    style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Registrar Equipo
                </button>
                
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    Ir al Workspace
                </button>
            </div>
        </div>
    );
};

export default LandingPage;