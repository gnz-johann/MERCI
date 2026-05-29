import { useState } from 'react';
import Topbar from '../components/Topbar';
import LoginUsuario from '../components/LoginUsuario';
import RegistroUsuario from '../components/RegistroUsuario';

const LandingPage = () => {
    // Control maestro de lo que se renderiza en pantalla
    const [vistaActiva, setVistaActiva] = useState('inicio'); 

    return (
        <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
            
            {/* Inyección del componente modularizado */}
            <Topbar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

            {/* Contenedor Principal de Vistas */}
            <main>
                {vistaActiva === 'inicio' && (
                    <>
                        {/* SECCIÓN HERO (Mismo color base azul-700 que el Topbar sólido para camuflaje perfecto) */}
                        <section className="bg-blue-700 min-h-screen flex flex-col justify-center items-center text-white text-center px-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight max-w-4xl">
                                Gestión Inteligente de Comunicaciones
                            </h1>
                            <p className="text-base md:text-lg max-w-2xl leading-relaxed text-blue-100 opacity-90">
                                El middleware corporativo diseñado para conectar, auditar y controlar tu entorno CloudUCM con el poder de comandos de voz e inteligencia artificial.
                            </p>
                        </section>
                        
                        {/* Sección inferior informativa para forzar el scroll en las pruebas */}
                        <section className="min-h-screen py-24 px-8 bg-white flex flex-col justify-center items-center">
                            <h2 className="text-3xl font-bold text-blue-700 tracking-tight">
                                Ecosistema de Alta Exigencia
                            </h2>
                            <p className="mt-4 text-slate-600 max-w-xl text-center leading-relaxed">
                                Desplázate hacia abajo para observar cómo el menú superior translúcido deja de camuflarse con el Hero y se consolida de forma sólida sobre las secciones claras.
                            </p>
                        </section>
                    </>
                )}

                {/* Área de login y registro locales desvinculados de URLs rígidas */}
                {vistaActiva === 'login' && (
                    <div className="pt-20">
                        <LoginUsuario />
                    </div>
                )}

                {vistaActiva === 'registro' && (
                    <div className="pt-20">
                        <RegistroUsuario />
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPage;