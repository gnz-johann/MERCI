import { useState } from 'react';
import Topbar from '../components/Topbar';
import LoginUsuario from '../components/LoginUsuario';
import RegistroUsuario from '../components/RegistroUsuario';

const LandingPage = () => {
    const [vistaActiva, setVistaActiva] = useState('inicio'); 

    return (
        <div className="min-h-screen bg-merci-light font-sans antialiased text-merci-dark">
            
            <Topbar vistaActiva={vistaActiva} setVistaActiva={setVistaActiva} />

            <main>
                {vistaActiva === 'inicio' && (
                    <>
                        <section className="bg-merci-primary min-h-screen flex flex-col justify-center items-center text-white text-center px-6">
                            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight max-w-4xl">
                                Gestión Inteligente de Comunicaciones
                            </h1>
                            <p className="text-base md:text-lg max-w-2xl leading-relaxed text-merci-light opacity-90">
                                El middleware corporativo diseñado para conectar, auditar y controlar tu entorno CloudUCM con el poder de comandos de voz e inteligencia artificial.
                            </p>
                        </section>
                        
                        <section className="min-h-screen py-24 px-8 bg-white flex flex-col justify-center items-center">
                            <h2 className="text-3xl font-bold text-merci-primary tracking-tight">
                                Ecosistema de Alta Exigencia
                            </h2>
                            <p className="mt-4 text-merci-neutral max-w-xl text-center leading-relaxed">
                                Desplázate hacia abajo para observar cómo el menú superior translúcido deja de camuflarse con el Hero y se consolida de forma sólida sobre las secciones claras.
                            </p>
                        </section>
                    </>
                )}

                {vistaActiva === 'login' && (
                    <div className="pt-24 min-h-screen bg-merci-light flex items-center justify-center">
                        <LoginUsuario />
                    </div>
                )}

                {vistaActiva === 'registro' && (
                    <div className="pt-24 min-h-screen bg-merci-light flex items-center justify-center">
                        <RegistroUsuario />
                    </div>
                )}
            </main>
        </div>
    );
};

export default LandingPage;