// src/layouts/MainLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import './MainLayout.css';

function MainLayout() {
  // Estilos inline para asegurar el override del CSS anterior si hiciera falta
  const navStyle = {
    display: 'flex',
    gap: '1.5rem'
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span style={{fontSize: '1.5rem', marginRight: '5px'}}>⚡</span>
          <span style={{background: 'linear-gradient(to right, #00f3ff, #bc13fe)', WebkitBackgroundClip: 'text', color: 'transparent'}}>NEXUS PRIME</span>
        </div>
        <nav className="main-nav" style={navStyle}>
          <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Base
          </NavLink>
          <NavLink to="/gamer-store" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Store
          </NavLink>
          <NavLink to="/fidelidad" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Rewards
          </NavLink>
        </nav>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Nexus Prime</div>
            <p className="footer-copy">
              Home, contenido y comunicación alineados a la identidad gamer, sin tocar la lógica de auth ni checkout.
            </p>
            <div className="footer-social">
              <span className="pill-badge">Discord</span>
              <span className="pill-badge">Twitch</span>
              <span className="pill-badge">YouTube</span>
            </div>
          </div>

          <div className="footer-columns">
            <div>
              <p className="footer-title">Navegación</p>
              <NavLink to="/" className="footer-link">Home</NavLink>
              <NavLink to="/gamer-store" className="footer-link">Catálogo gamer</NavLink>
              <NavLink to="/fidelidad" className="footer-link">Fidelidad</NavLink>
            </div>
            <div>
              <p className="footer-title">Políticas</p>
              <span className="footer-link">Envíos y entregas</span>
              <span className="footer-link">Cambios y devoluciones</span>
              <span className="footer-link">Privacidad</span>
            </div>
            <div>
              <p className="footer-title">Soporte</p>
              <span className="footer-link">Centro de ayuda</span>
              <span className="footer-link">Estado del sistema</span>
              <span className="footer-link">Contáctanos</span>
            </div>
          </div>
        </div>

        <div className="footer-meta">
          <small style={{color: '#64748b'}}>© {new Date().getFullYear()} Nexus Prime Systems. All rights reserved.</small>
          <span className="build-chip">v2.0.0 [STABLE]</span>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
