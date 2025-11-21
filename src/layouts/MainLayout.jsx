// src/layouts/MainLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './MainLayout.css';

function MainLayout() {
  const { session, account, logout, preferences } = useAuth();

  const navStyle = {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>⚡</span>
          <span style={{ background: 'linear-gradient(to right, #00f3ff, #bc13fe)', WebkitBackgroundClip: 'text', color: 'transparent' }}>NEXUS PRIME</span>
        </div>
        <nav className="main-nav" style={navStyle}>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Base
          </NavLink>
          <NavLink to="/gamer-store" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Store
          </NavLink>
          <NavLink to="/fidelidad" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Rewards
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
          <NavLink to="/auth" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Cuenta
          </NavLink>
          <span className="nav-chip">{preferences.language.toUpperCase()} · {preferences.theme === 'dark' ? '🌙' : '☀️'}</span>
          {session && account ? (
            <button className="nav-logout" onClick={logout} title="Cerrar sesión">{account.name}</button>
          ) : (
            <NavLink to="/auth" className="nav-link">Inicia sesión</NavLink>
          )}
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
          <small style={{ color: '#64748b' }}>© {new Date().getFullYear()} Nexus Prime Systems. All rights reserved.</small>
          <span className="build-chip">v2.0.0 [STABLE]</span>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
