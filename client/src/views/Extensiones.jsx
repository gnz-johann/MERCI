import { useState } from 'react';
import { useUcm } from '../context/UcmContext';
import MiniPostman from '../components/MiniPostman';

const Extensiones = () => {
    const { sesion, resetearTimer } = useUcm();
    const [rawJson, setRawJson] = useState(null);
    const [estado, setEstado] = useState({ loading: false, error: null });

    const consultarExtensiones = async () => {
        setEstado({ loading: true, error: null });
        setRawJson(null);

        try {
            // Disparamos la petición a nuestro backend, enviando los datos del Context
            const respuesta = await fetch('http://localhost:3000/api/v1/config/extensiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ucm_domain: sesion.ucm_domain,
                    cookie_session: sesion.cookie_session_identify
                })
            });

            const data = await respuesta.json();

            // Si CloudUCM rechaza la cookie (ej. Error -6), mostramos una alerta
            if (data.status !== 0 && data.status !== undefined) {
                setEstado({ loading: false, error: `CloudUCM rechazó la petición. Código de estado: ${data.status}` });
            } else {
                setEstado({ loading: false, error: null });
                resetearTimer(); // Restablece los 10 minutos de la sesión activa
            }

            // Inyectamos el JSON crudo en el componente Mini-Postman
            setRawJson(data);

        } catch (error) {
            setEstado({ loading: false, error: "El backend local no responde." });
        }
    };

    return (
        <div>
            <h2 style={{ marginBottom: '5px' }}>Paso 2: Gestión de Extensiones SIP</h2>
            <p style={{ color: '#666', marginTop: 0 }}>Valida la lectura del catálogo de extensiones configuradas en la nube.</p>
            
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
                <p><strong>Dominio objetivo:</strong> {sesion.ucm_domain}</p>
                
                <button 
                    onClick={consultarExtensiones} 
                    disabled={estado.loading || !sesion.isAutenticado} 
                    style={{ 
                        padding: '10px 20px', cursor: 'pointer', backgroundColor: '#007BFF', 
                        color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' 
                    }}
                >
                    {estado.loading ? 'Consultando hardware...' : 'GET: Obtener Lista de Extensiones'}
                </button>

                {estado.error && (
                    <div style={{ marginTop: '15px', color: '#dc3545', fontWeight: 'bold' }}>
                        ❌ {estado.error}
                    </div>
                )}
            </div>

            {/* Consola inferior inteligente */}
            <MiniPostman response={rawJson} />
        </div>
    );
};

export default Extensiones;