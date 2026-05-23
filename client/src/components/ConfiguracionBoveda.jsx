import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConfiguracionBoveda = () => {
    const navigate = useNavigate();
    const [datosBoveda, setDatosBoveda] = useState({
        empresa_id: '', // UUID Manual para las pruebas
        ucm_domain: '',
        ucm_user: '',
        ucm_secret: ''
    });
    const [estadoRed, setEstadoRed] = useState(null);

    const handleChange = (e) => {
        setDatosBoveda({ ...datosBoveda, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoRed({ tipo: 'cargando', texto: 'Validando y conectando con Grandstream...' });

        try {
            // Petición real al servidor Node.js
            const respuesta = await fetch('http://localhost:3000/api/v1/boveda/configurar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosBoveda)
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.autorizado) {
                setEstadoRed({ tipo: 'exito', texto: data.message });
                // En el futuro, aquí enviaremos al usuario a su panel
                // setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setEstadoRed({ tipo: 'error', texto: data.message || 'Error en validación' });
            }

        } catch (error) {
            setEstadoRed({ tipo: 'error', texto: 'El backend de MERCI no responde. Revisa tu consola.' });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '450px', margin: '50px auto', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>2. Configurar Bóveda CloudUCM</h2>
            <p>Conecta el hardware de tu empresa con MERCI.</p>
            
            {estadoRed && (
                <div style={{ 
                    color: estadoRed.tipo === 'error' ? 'red' : estadoRed.tipo === 'exito' ? 'green' : 'blue', 
                    marginBottom: '15px', fontWeight: 'bold' 
                }}>
                    {estadoRed.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" name="empresa_id" placeholder="ID de Empresa (Pega el UUID aquí)" 
                    onChange={handleChange} value={datosBoveda.empresa_id} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="text" name="ucm_domain" placeholder="Dominio limpio (ej: 0724ae.a.myucm.cloud)" 
                    onChange={handleChange} value={datosBoveda.ucm_domain} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="text" name="ucm_user" placeholder="Usuario API" 
                    onChange={handleChange} value={datosBoveda.ucm_user} required 
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" name="ucm_secret" placeholder="Contraseña de CloudUCM" 
                    onChange={handleChange} value={datosBoveda.ucm_secret} required 
                    style={{ padding: '10px' }}
                />
                <button type="submit" disabled={estadoRed?.tipo === 'cargando'} style={{ padding: '10px', cursor: 'pointer' }}>
                    {estadoRed?.tipo === 'cargando' ? 'Procesando...' : 'Guardar y Conectar'}
                </button>
            </form>
        </div>
    );
};

export default ConfiguracionBoveda;