import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useUcm } from '../context/UcmContext';

const DashboardLayout = () => {
    const navigate = useNavigate();
    const { tiempoRestante, sesion, cerrarSesionUcm } = useUcm();
    
    const [menuAbierto, setMenuAbierto] = useState({ paso2: false, paso3: false, paso4: false });

    const toggleMenu = (modulo) => {
        setMenuAbierto({ ...menuAbierto, [modulo]: !menuAbierto[modulo] });
    };

    const formatearTiempo = (segundos) => {
        const minutos = Math.floor(segundos / 60);
        const secs = segundos % 60;
        return `${minutos.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-merci-light font-sans antialiased">
            
            {/* SIDEBAR CON EL COLOR NEGRO PROFUNDO (#000F08) */}
            <div className="w-64 bg-merci-dark text-merci-accent flex flex-col shadow-2xl z-10">
                <div className="p-5 border-b border-merci-neutral/20">
                    <h3 className="text-white font-bold text-lg tracking-wide">MERCI <span className="font-light text-merci-accent text-sm">Sandbox</span></h3>
                </div>
                
                <nav className="flex flex-col gap-1 mt-4 flex-grow px-3 overflow-y-auto">
                    <button onClick={() => navigate('/dashboard')} className="flex items-center text-left w-full p-3 rounded-lg hover:bg-merci-primary hover:text-white text-slate-200 transition-colors text-sm font-medium cursor-pointer">
                        <span className="mr-3">🔑</span> Paso 1: Autenticación
                    </button>

                    <div className="flex flex-col">
                        <button onClick={() => toggleMenu('paso2')} className="flex justify-between items-center text-left w-full p-3 rounded-lg hover:bg-merci-primary hover:text-white transition-colors text-sm font-medium cursor-pointer">
                            <span><span className="mr-3">⚙️</span> Paso 2: Configuración</span>
                            <span className="text-xs text-merci-neutral">{menuAbierto.paso2 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso2 && (
                            <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-merci-neutral/30 ml-3">
                                <button onClick={() => navigate('/dashboard/extensiones')} className="text-left w-full p-2 rounded-md hover:text-white hover:bg-merci-primary/50 text-sm transition-colors text-merci-accent cursor-pointer">• Extensiones SIP</button>
                                <button className="text-left w-full p-2 rounded-md text-merci-neutral/50 text-sm cursor-not-allowed">• Troncales VoIP</button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <button onClick={() => toggleMenu('paso3')} className="flex justify-between items-center text-left w-full p-3 rounded-lg hover:bg-merci-primary hover:text-white transition-colors text-sm font-medium cursor-pointer">
                            <span><span className="mr-3">📞</span> Paso 3: Call Control</span>
                            <span className="text-xs text-merci-neutral">{menuAbierto.paso3 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso3 && (
                            <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-merci-neutral/30 ml-3">
                                <button onClick={() => navigate('/dashboard/consola-marcado')} className="text-left w-full p-2 rounded-md hover:text-white hover:bg-merci-primary/50 text-sm transition-colors text-merci-accent cursor-pointer">• Consola de Marcación</button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <button onClick={() => toggleMenu('paso4')} className="flex justify-between items-center text-left w-full p-3 rounded-lg hover:bg-merci-primary hover:text-white transition-colors text-sm font-medium cursor-pointer">
                            <span><span className="mr-3">📊</span> Paso 4: CDR Historial</span>
                            <span className="text-xs text-merci-neutral">{menuAbierto.paso4 ? '▼' : '►'}</span>
                        </button>
                        {menuAbierto.paso4 && (
                            <div className="flex flex-col gap-1 pl-4 mt-1 border-l border-merci-neutral/30 ml-3">
                                <button onClick={() => navigate('/dashboard/cdr-logs')} className="text-left w-full p-2 rounded-md hover:text-white hover:bg-merci-primary/50 text-sm transition-colors text-merci-accent cursor-pointer">• Visor de Logs</button>
                            </div>
                        )}
                    </div>
                </nav>

                <div className="p-4 border-t border-merci-neutral/20">
                    <button onClick={cerrarSesionUcm} className="w-full p-2.5 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-semibold flex justify-center items-center gap-2 cursor-pointer">
                        Salir del Entorno
                    </button>
                </div>
            </div>

            {/* AREA DE TRABAJO EN BLANCO MENTA (#F4FFF8) */}
            <div className="flex-grow bg-merci-light overflow-y-auto relative">
                <header className="bg-white border-b border-merci-accent/20 h-16 flex items-center px-8 shadow-sm">
                    <h2 className="text-merci-dark font-semibold">Workspace Operativo</h2>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>

                {sesion.isAutenticado && (
                    <div className={`fixed bottom-6 right-6 px-5 py-2.5 rounded-full font-bold text-sm shadow-lg border backdrop-blur-sm transition-all ${
                        tiempoRestante < 120 
                            ? 'bg-red-50/90 text-red-600 border-red-200 animate-pulse' 
                            : 'bg-white text-merci-primary border-merci-accent/40'
                    }`}>
                        ⏱️ Expira en: <span className="font-mono ml-1">{formatearTiempo(tiempoRestante)}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardLayout;