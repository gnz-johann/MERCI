import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UcmProvider } from './context/UcmContext';
import LandingPage from './views/LandingPage';
import ConfiguracionBoveda from './components/ConfiguracionBoveda';
import DashboardLayout from './layouts/DashboardLayout';
import CdrLogs from './views/CdrLogs';
import Extensiones from './views/Extensiones';

function App() {
  return (
    <UcmProvider>
      <Router>
        <Routes>
          {/* Ruta Pública Principal (Gestiona Login y Registro internamente) */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Rutas Operativas (Próximas a ser protegidas por el Filtro de Sesión) */}
          <Route path="/configurar-boveda" element={<ConfiguracionBoveda />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-slate-800">Panel Centralizado del Entorno Sandbox</h3>
                  <p className="text-slate-600 mt-2">Selecciona un módulo del menú izquierdo para iniciar las validaciones de la guía de pruebas.</p>
                </div>
              } />
              <Route path="cdr-logs" element={<CdrLogs />} />
              <Route path="extensiones" element={<Extensiones />} />
              <Route path="consola-marcado" element={
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-blue-700">Paso 3: Vista de Call Control (Pruebas en curso)</h3>
                </div>
              } />
          </Route>
        </Routes>
      </Router>
    </UcmProvider>
  );
}

export default App;