import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUcm } from '../context/UcmContext';

const ConfiguracionBoveda = () => {
    const navigate = useNavigate();
    const { iniciarSesionUcm } = useUcm();

    const [datosBoveda, setDatosBoveda] = useState({
        empresa_id: '', ucm_domain: '', ucm_user: '', ucm_secret: ''
    });

    const [estadoRed, setEstadoRed] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [datosFase0, setDatosFase0] = useState({
        challenge_generado: '', hash_md5: '', cookie_session_identify: ''
    });

    const handleChange = (e) => {
        setDatosBoveda({ ...datosBoveda, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstadoRed({ tipo: 'cargando', texto: 'Negociando handshake con CloudUCM...' });

        try {
            const respuesta = await fetch('http://localhost:3000/api/v1/boveda/configurar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosBoveda)
            });

            const data = await respuesta.json();

            if (respuesta.ok && data.autorizado) {
                setEstadoRed({ tipo: 'exito', texto: data.message });
                iniciarSesionUcm({
                    empresa_id: datosBoveda.empresa_id,
                    ucm_domain: datosBoveda.ucm_domain,
                    cookie_session_identify: data.fase_0_documentacion.cookie_session_identify
                });
                setDatosFase0({
                    challenge_generado: data.fase_0_documentacion.challenge_generado,
                    hash_md5: data.fase_0_documentacion.hash_md5,
                    cookie_session_identify: data.fase_0_documentacion.cookie_session_identify
                });
                setMostrarModal(true);
            } else {
                setEstadoRed({ tipo: 'error', texto: data.message || 'La API de Grandstream rechazó la conexión.' });
            }
        } catch (error) {
            setEstadoRed({ tipo: 'error', texto: 'El backend no responde. Verifica la conexión local.' });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-merci-light p-6">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl border border-merci-accent/20">
                <div className="mb-6 border-b border-merci-light pb-4">
                    <h2 className="text-2xl font-bold text-merci-dark">2. Bóveda CloudUCM</h2>
                    <p className="text-sm text-merci-neutral mt-1">Conecta y encripta las credenciales del PBX corporativo.</p>
                </div>
                
                {estadoRed && (
                    <div className={`p-4 mb-6 text-sm font-medium rounded-lg ${
                        estadoRed.tipo === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 
                        estadoRed.tipo === 'exito' ? 'bg-green-50 text-green-700 border border-green-200' : 
                        'bg-merci-light text-merci-primary border border-merci-accent/30'
                    }`}>
                        {estadoRed.texto}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">ID de Empresa (UUID)</label>
                        <input type="text" name="empresa_id" onChange={handleChange} value={datosBoveda.empresa_id} required className="w-full px-4 py-2.5 rounded-lg border border-merci-accent/40 focus:ring-2 focus:ring-merci-primary focus:outline-none text-merci-dark font-mono text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">Dominio Limpio API</label>
                        <input type="text" name="ucm_domain" onChange={handleChange} value={datosBoveda.ucm_domain} required className="w-full px-4 py-2.5 rounded-lg border border-merci-accent/40 focus:ring-2 focus:ring-merci-primary focus:outline-none text-merci-dark" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">Usuario API</label>
                            <input type="text" name="ucm_user" onChange={handleChange} value={datosBoveda.ucm_user} required className="w-full px-4 py-2.5 rounded-lg border border-merci-accent/40 focus:ring-2 focus:ring-merci-primary focus:outline-none text-merci-dark" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">Contraseña PBX</label>
                            <input type="password" name="ucm_secret" onChange={handleChange} value={datosBoveda.ucm_secret} required className="w-full px-4 py-2.5 rounded-lg border border-merci-accent/40 focus:ring-2 focus:ring-merci-primary focus:outline-none text-merci-dark" />
                        </div>
                    </div>
                    <button type="submit" disabled={estadoRed?.tipo === 'cargando'} className={`mt-4 py-3 rounded-lg text-white font-semibold transition-all cursor-pointer ${estadoRed?.tipo === 'cargando' ? 'bg-merci-accent cursor-not-allowed' : 'bg-merci-primary hover:bg-merci-dark shadow-md'}`}>
                        {estadoRed?.tipo === 'cargando' ? 'Negociando...' : 'Guardar y Conectar'}
                    </button>
                </form>
            </div>

            {mostrarModal && (
                <div className="fixed inset-0 bg-merci-dark/60 backdrop-blur-sm flex justify-center items-center z-[1000] p-4">
                    <div className="bg-white p-8 rounded-xl max-w-2xl w-full shadow-2xl border border-merci-accent/20">
                        <h3 className="text-xl font-bold text-merci-primary mb-2 flex items-center gap-2">✅ Conexión Exitosa - Fase 0</h3>
                        <div className="flex flex-col gap-4 mt-4">
                            <div>
                                <label className="text-xs font-bold text-merci-neutral mb-1 block">CHALLENGE GENERADO:</label>
                                <input type="text" readOnly value={datosFase0.challenge_generado} className="w-full p-3 bg-merci-light border border-merci-accent/30 rounded text-merci-dark font-mono text-sm focus:outline-none select-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-merci-neutral mb-1 block">HASH MD5 RESULTANTE:</label>
                                <input type="text" readOnly value={datosFase0.hash_md5} className="w-full p-3 bg-merci-light border border-merci-accent/30 rounded text-merci-dark font-mono text-sm focus:outline-none select-all" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-merci-neutral mb-1 block">COOKIE DE SESIÓN (session-identify):</label>
                                <textarea readOnly value={datosFase0.cookie_session_identify} rows={2} className="w-full p-3 bg-merci-light border border-merci-accent/30 rounded text-merci-dark font-mono text-sm focus:outline-none resize-none select-all" />
                            </div>
                        </div>
                        <div className="mt-8 flex justify-end">
                            <button onClick={() => { setMostrarModal(false); navigate('/dashboard'); }} className="px-6 py-2.5 bg-merci-primary hover:bg-merci-dark text-white rounded-lg font-semibold transition-colors cursor-pointer">
                                Ingresar al Workspace
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConfiguracionBoveda;