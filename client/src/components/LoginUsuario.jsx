import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginUsuario = () => {
    const navigate = useNavigate();
    const [credenciales, setCredenciales] = useState({ email: '', password: '' });
    const [estado, setEstado] = useState(null);

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEstado({ tipo: 'cargando', texto: 'Autenticando credenciales de operador...' });

        try {
            const respuesta = await fetch('http://localhost:3000/api/v1/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credenciales)
            });

            const data = await respuesta.json();

            if (!respuesta.ok) {
                if (respuesta.status === 403 && data.codigo === 'USUARIO_HUERFANO') {
                    setEstado({ tipo: 'advertencia', texto: data.error });
                    return;
                }
                throw new Error(data.error || 'No se pudo validar el acceso.');
            }

            localStorage.setItem('merci_token', data.token);
            setEstado({ tipo: 'exito', texto: `¡Bienvenido, ${data.empleado.nombre}! Acceso autorizado.` });

            setTimeout(() => {
                navigate('/configurar-boveda');
            }, 1200);

        } catch (error) {
            setEstado({ tipo: 'error', texto: error.message });
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-xl border border-merci-accent/20">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-merci-dark mb-2">Iniciar Sesión</h2>
                <p className="text-sm text-merci-neutral">Plataforma Middleware MERCI</p>
            </div>

            {estado && (
                <div className={`p-4 mb-6 text-sm font-medium rounded-lg text-center ${
                    estado.tipo === 'exito' ? 'bg-green-50 text-green-800 border border-green-200' : 
                    estado.tipo === 'error' ? 'bg-red-50 text-red-800 border border-red-200' : 
                    estado.tipo === 'advertencia' ? 'bg-orange-50 text-orange-800 border border-orange-200' : 
                    'bg-merci-light text-merci-primary border border-merci-accent/30'
                }`}>
                    {estado.texto}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">
                        Correo de Operador
                    </label>
                    <input 
                        type="email" name="email" placeholder="ejemplo@inttelec.com" 
                        onChange={handleChange} value={credenciales.email} required 
                        className="w-full px-4 py-3 rounded-lg border border-merci-accent/40 focus:outline-none focus:ring-2 focus:ring-merci-primary focus:border-merci-primary transition-all text-merci-dark"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-merci-neutral uppercase tracking-wide">
                        Contraseña del Sistema
                    </label>
                    <input 
                        type="password" name="password" placeholder="••••••••" 
                        onChange={handleChange} value={credenciales.password} required 
                        className="w-full px-4 py-3 rounded-lg border border-merci-accent/40 focus:outline-none focus:ring-2 focus:ring-merci-primary focus:border-merci-primary transition-all text-merci-dark"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={estado?.tipo === 'cargando'} 
                    className={`mt-2 w-full py-3.5 rounded-lg text-white font-semibold transition-all duration-200 cursor-pointer ${
                        estado?.tipo === 'cargando' 
                            ? 'bg-merci-accent cursor-not-allowed' 
                            : 'bg-merci-primary hover:bg-merci-dark shadow-md'
                    }`}
                >
                    {estado?.tipo === 'cargando' ? 'Verificando...' : 'Autenticar'}
                </button>
            </form>
        </div>
    );
};

export default LoginUsuario;