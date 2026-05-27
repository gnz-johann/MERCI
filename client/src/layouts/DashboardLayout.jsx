import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUcm } from '../context/UcmContext';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { tiempoRestante, sesion, cerrarSesionUcm } = useUcm();
    
    // Estado para controlar qué menús del sidebar están abiertos
    const [menuAbierto, setMenuAbierto] = useState({
        paso2: false,
        paso3: false,
        paso4: false
    });

    const toggleMenu = (modulo) => {
        setMenuAbierto({ ...menuAbierto, [modulo]: !menuAbierto[modulo] });
    };

    // Formateador de segundos a MM:SS
    const formatearTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', fontFamily: 'sans-serif' }}>
            
            {/* SIDEBAR ESTILO CRM */}
            <div style={{ width: '260px', backgroundColor: '#111c24', color: '#acb3b9', display: 'flex', flexDirection: 'column', padding: '15px' }}>
                <h3 style={{ color: '#fff', borderBottom: '1px solid #222e38', paddingBottom: '10px', marginTop: '5px' }}>MERCI Sandbox</h3>
                
                <nav style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px', flexGrow: 1 }}>
                    
                    {/* PASO 1 */}
                    <button onClick={() => navigate('/dashboard')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#inherit', padding: '10px', cursor: 'pointer', fontSize: '14px' }}>
                        🔑 Paso 1: Autenticación
                    </button>

                    {/* PASO 2 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => toggleMenu('paso2')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>⚙️ Paso 2: Configuración</span>
                            <span>{menuAbierto.paso2 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso2 && (
                            <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#17232d' }}>
                                <button onClick={() => navigate('/dashboard/extensiones')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '8px', cursor: 'pointer', fontSize: '13px' }}>• Extensiones SIP</button>
                                <button style={{ textAlign: 'left', background: 'none', border: 'none', color: '#66727a', padding: '8px', fontSize: '13px' }}>• Troncales VoIP</button>
                            </div>
                        )}
                    </div>

                    {/* PASO 3 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => toggleMenu('paso3')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>📞 Paso 3: Call Control</span>
                            <span>{menuAbierto.paso3 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso3 && (
                            <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#17232d' }}>
                                <button onClick={() => navigate('/dashboard/consola-marcado')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '8px', cursor: 'pointer', fontSize: '13px' }}>• Consola de Marcación</button>
                            </div>
                        )}
                    </div>

                    {/* PASO 4 */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <button onClick={() => toggleMenu('paso4')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '10px', cursor: 'pointer', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
                            <span>📊 Paso 4: CDR Historial</span>
                            <span>{menuAbierto.paso4 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso4 && (
                            <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '2px', backgroundColor: '#17232d' }}>
                                <button onClick={() => navigate('/dashboard/cdr-logs')} style={{ textAlign: 'left', background: 'none', border: 'none', color: '#acb3b9', padding: '8px', cursor: 'pointer', fontSize: '13px' }}>• Visor de Logs</button>
                            </div>
                        )}
                    </div>

                </nav>

                <button onClick={cerrarSesionUcm} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Salir del Entorno
                </button>
            </div>

            {/* AREA DE TRABAJO (WORKSPACE CENTRAL) */}
            <div style={{ flexGrow: 1, backgroundColor: '#f8f9fa', padding: '30px', overflowY: 'auto', position: 'relative' }}>
                {/* El Outlet inyectará la vista correspondiente aquí sin recargar la barra lateral */}
                <Outlet />

                {/* CONTADOR EN LA ESQUINA INFERIOR DERECHA */}
                {sesion.isAutenticado && (
                    <div style={{
                        position: 'fixed', bottom: '20px', right: '20px',
                        backgroundColor: tiempoRestante < 120 ? '#fff3f3' : '#f0fff4',
                        color: tiempoRestante < 120 ? '#dc3545' : '#28a745',
                        border: `1px solid ${tiempoRestante < 120 ? '#dc3545' : '#28a745'}`,
                        padding: '10px 15px', borderRadius: '20px', fontWeight: 'bold',
                        fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        animation: tiempoRestante < 60 ? 'blink 1s infinite' : 'none'
                    }}>
                        ⏱️ Expira en: {formatearTiempo(tiempoRestante)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;