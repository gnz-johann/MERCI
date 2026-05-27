import { useState } from 'react';
import { useUcm } from '../context/UcmContext';
import MiniPostman from '../components/MiniPostman';

const CdrLogs = () => {
    const { sesion, resetearTimer } = useUcm();
    const [rawJson, setRawJson] = useState(null);
    const [loading, setLoading] = useState(false);

    const consultarHistorial = async () => {
        setLoading(true);
        try {
            // Simulamos la petición del Paso 4 enviando las credenciales del Context
            console.log("Consultando CDR con Cookie activa:", sesion.cookie_session_identify);
            
            const mockupResponse = {
                status: 0,
                response: {
                    total: 2,
                    cdr: [
                        { acctid: "1", src: "1001", dst: "1002", duration: "45", disposition: "ANSWERED" },
                        { acctid: "2", src: "1005", dst: "93112345", duration: "120", disposition: "BUSY" }
                    ]
                }
            };

            setRawJson(mockupResponse);
            resetearTimer(); // Restablece automáticamente los 10 minutos por actividad exitosa
        } catch (error) {
            setRawJson({ error: "Fallo en la consulta" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Módulo de Pruebas: Paso 4 (CDR Historial)</h2>
            <p style={{ color: '#666' }}>Dominio activo en memoria: <strong>{sesion.ucm_domain}</strong></p>
            
            <button onClick={consultarHistorial} disabled={loading} style={{ padding: '10px 20px', cursor: 'pointer' }}>
                {loading ? 'Consultando...' : 'Simular Consulta de CDR'}
            </button>

            {/* Inyectamos el componente MiniPostman al final */}
            <MiniPostman response={rawJson} />
        </div>
    );
};

export default CdrLogs;