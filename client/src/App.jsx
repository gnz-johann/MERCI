import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UcmProvider } from './context/UcmContext';
import LandingPage from './views/LandingPage';
import RegistroUsuario from './components/RegistroUsuario';
import LoginUsuario from './components/LoginUsuario';
import ConfiguracionBoveda from './components/ConfiguracionBoveda';
import DashboardLayout from './layouts/DashboardLayout';
import CdrLogs from './views/CdrLogs';
import Extensiones from './views/Extensiones';

function App() {
  return (
    <UcmProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginUsuario />} />
          <Route path="/registro" element={<RegistroUsuario />} />
          <Route path="/configurar-boveda" element={<ConfiguracionBoveda />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<div><h3>Panel Centralizado del Entorno Sandbox</h3><p>Selecciona un módulo del menú izquierdo para iniciar las validaciones de la guía de pruebas.</p></div>} />
              <Route path="cdr-logs" element={<CdrLogs />} />
              <Route path="extensiones" element={<Extensiones />} />
              <Route path="consola-marcado" element={<div><h3>Paso 3: Vista de Call Control (Kevin working here)</h3></div>} />
          </Route>
        </Routes>
      </Router>
    </UcmProvider>
  );
}

export default App;