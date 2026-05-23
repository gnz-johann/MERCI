import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './views/LandingPage';
import RegistroUsuario from './components/RegistroUsuario';
import ConfiguracionBoveda from './components/ConfiguracionBoveda';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta principal: La Landing Page dinámica */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Ruta del Formulario 1 */}
        <Route path="/registro" element={<RegistroUsuario />} />
        
        {/* Ruta del Formulario 2 (El que se conecta al backend real) */}
        <Route path="/configurar-boveda" element={<ConfiguracionBoveda />} />
      </Routes>
    </Router>
  );
}

export default App;