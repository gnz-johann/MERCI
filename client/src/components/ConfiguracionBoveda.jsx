import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTACIÓN DEL ENRUTADOR
import { useUcm } from '../context/UcmContext';   // 2. IMPORTACIÓN DEL CONTEXTO GLOBAL

const ConfiguracionBoveda = () => {
    const navigate = useNavigate();              // Inicialización del hook de navegación
    const { iniciarSesionUcm } = useUcm();       // Extracción de la función del contexto

    // Estados base del formulario
    const [datosBoveda, setDatosBoveda] = useState({
        empresa_id: '',
        ucm_domain: '',
        ucm_user: '',
        ucm_secret: ''
    });

    const [estadoRed, setEstadoRed] = useState(null);

    // Estados para el Modal de Auditoría
    const [mostrarModal, setMostrarModal] = useState(false);
    const [datosFase0, setDatosFase0] = useState({
        challenge_generado: '',
        hash_md5: '',
        cookie_session_identify: ''
    });

    const handleChange = (e) => {
        setDatosBoveda({ ...datosBoveda, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoRed({ tipo: 'cargando', texto: 'Validando y conectando con CloudUCM...' });

        try {
            const respuesta = await fetch('http://localhost:3000/api/v1/boveda/configurar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosBoveda)
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.autorizado) {
                setEstadoRed({ tipo: 'exito', texto: data.message });
                
                // 3. REGISTRO EN MEMORIA GLOBAL (Activa el contador y desbloquea el Sidebar)
                iniciarSesionUcm({
                    empresa_id: datosBoveda.empresa_id,
                    ucm_domain: datosBoveda.ucm_domain,
                    cookie_session_identify: data.fase_0_documentacion.cookie_session_identify
                });

                // Almacenamos localmente para pintar en el modal
                setDatosFase0({
                    challenge_generado: data.fase_0_documentacion.challenge_generado,
                    hash_md5: data.fase_0_documentacion.hash_md5,
                    cookie_session_identify: data.fase_0_documentacion.cookie_session_identify
                });
                
                // Desplegamos el modal para que el equipo pueda copiar sus evidencias
                setMostrarModal(true);
            } else {
                setEstadoRed({ tipo: 'error', texto: data.message || 'Error en validación' });
            }

        } catch (error) {
            setEstadoRed({ tipo: 'error', texto: 'El backend de MERCI no responde. Verifica la terminal.' });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '450px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
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
                        type="text" name="empresa_id" placeholder="ID de Empresa (UUID)" 
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

            {/* MODAL DE AUDITORÍA FLOTANTE */}
            {mostrarModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', padding: '30px', borderRadius: '8px',
                        maxWidth: '600px', width: '90%', boxSizing: 'border-box'
                    }}>
                        <h3 style={{ color: 'green', marginTop: 0 }}>✅ Conexión Exitosa - Datos de Auditoría (Fase 0)</h3>
                        <p style={{ fontSize: '14px', color: '#666' }}>
                            Los siguientes datos fueron procesados en memoria por el backend. Copia estos valores para el reporte de pruebas antes de continuar.
                        </p>
                        
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '12px', display: 'block' }}>CHALLENGE GENERADO (16 Dígitos):</label>
                                <input type="text" readOnly value={datosFase0.challenge_generado} style={{ width: '100%', padding: '8px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', fontFamily: 'monospace' }} />
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '12px', display: 'block' }}>HASH MD5 RESULTANTE (32 Caracteres):</label>
                                <input type="text" readOnly value={datosFase0.hash_md5} style={{ width: '100%', padding: '8px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', fontFamily: 'monospace' }} />
                            </div>

                            <div>
                                <label style={{ fontWeight: 'bold', fontSize: '12px', display: 'block' }}>COOKIE DE SESIÓN AISLADA (session-identify):</label>
                                <textarea readOnly value={datosFase0.cookie_session_identify} rows={3} style={{ width: '100%', padding: '8px', backgroundColor: '#f4f4f4', border: '1px solid #ccc', fontFamily: 'monospace', resize: 'none' }} />
                            </div>
                        </div>

                        {/* 4. BOTÓN CON REDIRECCIÓN INCORPORADA */}
                        <button 
                            onClick={() => {
                                setMostrarModal(false);
                                navigate('/dashboard'); // Desvío automático al Workspace central
                            }}
                            style={{ marginTop: '25px', padding: '12px 24px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', float: 'right', fontWeight: 'bold' }}
                        >
                            Ingresar al Workspace
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfiguracionBoveda;