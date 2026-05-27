import { createContext, useState, useEffect, useContext } from 'react';

const UcmContext = createContext();

export const UcmProvider = ({ children }) => {
    const [sesion, setSesion] = useState({
        empresa_id: '',
        ucm_domain: '',
        cookie_session_identify: '',
        isAutenticado: false
    });

    const [tiempoRestante, setTiempoRestante] = useState(600); // 10 minutos en segundos
    const [timerActivo, setTimerActivo] = useState(false);

    // Efecto para controlar la cuenta regresiva de la cookie
    useEffect(() => {
        let intervalo = null;

        if (timerActivo && tiempoRestante > 0) {
            intervalo = setInterval(() => {
                setTiempoRestante((prev) => prev - 1);
            }, 1000);
        } else if (tiempoRestante === 0) {
            // Si el tiempo expira, cerramos la sesión temporalmente por seguridad
            setTimerActivo(false);
            setSesion((prev) => ({ ...prev, cookie_session_identify: '', isAutenticado: false }));
        }

        return () => clearInterval(intervalo);
    }, [timerActivo, tiempoRestante]);

    // Función para iniciar el temporizador cuando el Paso 1 sea exitoso
    const iniciarSesionUcm = (datos) => {
        setSesion({
            empresa_id: datos.empresa_id,
            ucm_domain: datos.ucm_domain,
            cookie_session_identify: datos.cookie_session_identify,
            isAutenticado: true
        });
        setTiempoRestante(600); // Reseteamos a 10 minutos
        setTimerActivo(true);
    };

    // Función para extender el tiempo tras cada petición exitosa
    const renovarTiempoSesion = () => {
        if (sesion.isAutenticado) {
            setTiempoRestante(600);
        }
    };

    const cerrarSesionUcm = () => {
        setSesion({ empresa_id: '', ucm_domain: '', cookie_session_identify: '', isAutenticado: false });
        setTimerActivo(false);
        setTiempoRestante(600);
        localStorage.removeItem('merci_token');
    };

    return (
        <UcmContext.Provider value={{ sesion, iniciarSesionUcm, resetearTimer: renovarTiempoSesion, tiempoRestante, cerrarSesionUcm }}>
            {children}
        </UcmContext.Provider>
    );
};

export const useUcm = () => useContext(UcmContext);