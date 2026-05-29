import { useState, useEffect } from 'react';

const Topbar = ({ vistaActiva, setVistaActiva }) => {
    const [isScrolled, setIsScrolled] = useState(false);

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

    // NUEVA LÓGICA: El fondo es sólido si haces scroll O si no estás en la vista de inicio
    const esFondoSolido = isScrolled || vistaActiva !== 'inicio';

    return (
        <nav className={`fixed top-0 left-0 w-full h-16 flex items-center justify-between px-8 transition-all duration-300 z-[1000] ${
            esFondoSolido 
                ? 'bg-merci-primary/95 backdrop-blur-md border-b border-merci-accent/20 shadow-lg' 
                : 'bg-transparent'
        }`}>
            <div 
                className="text-white text-xl font-bold cursor-pointer tracking-wider select-none"
                onClick={() => setVistaActiva('inicio')}
            >
                MERCI <span className="font-light text-xs tracking-normal text-merci-accent">by CORA</span>
            </div>

            <div className="flex items-center gap-6">
                {vistaActiva !== 'inicio' && (
                    <button 
                        onClick={() => setVistaActiva('inicio')} 
                        className="text-merci-light/80 hover:text-white text-sm font-medium transition-colors cursor-pointer"
                    >
                        Inicio
                    </button>
                )}
                
                <button 
                    onClick={() => setVistaActiva('login')} 
                    className={`px-5 py-2 text-sm font-semibold rounded transition-all duration-200 cursor-pointer ${
                        vistaActiva === 'login'
                            ? 'bg-transparent text-white border border-white'
                            : 'bg-merci-light text-merci-primary hover:bg-white shadow-sm'
                    }`}
                >
                    Acceso Operador
                </button>
            </div>
        </nav>
    );
};

export default Topbar;