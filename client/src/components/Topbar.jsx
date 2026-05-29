import { useState, useEffect } from 'react';

const Topbar = ({ vistaActiva, setVistaActiva }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    // Escuchamos el scroll para cambiar el fondo dinámicamente
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 transition-all duration-300 z-[1000] ${
            isScrolled 
                ? 'bg-blue-700/90 backdrop-blur-md border-b border-white/10 shadow-lg' 
                : 'bg-transparent'
        }`}>
            {/* Logotipo del Ecosistema */}
            <div 
                className="text-white text-xl font-bold cursor-pointer tracking-wider select-none"
                onClick={() => setVistaActiva('inicio')}
            >
                MERCI <span className="font-light text-xs tracking-normal text-blue-200">by CORA</span>
            </div>

            {/* Menú de Navegación */}
            <div className="flex items-center gap-6">
                {vistaActiva !== 'inicio' && (
                    <button 
                        onClick={() => setVistaActiva('inicio')} 
                        className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                    >
                        Inicio
                    </button>
                )}
                
                <button 
                    onClick={() => setVistaActiva('login')} 
                    className={`px-5 py-2 text-sm font-semibold rounded transition-all duration-200 ${
                        vistaActiva === 'login'
                            ? 'bg-transparent text-white border border-white'
                            : 'bg-white text-blue-700 hover:bg-blue-50 shadow-sm'
                    }`}
                >
                    Acceso Operador
                </button>
            </div>
        </nav>
    );
};

export default Topbar;