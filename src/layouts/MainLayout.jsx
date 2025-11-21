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
        <div className="footer-meta">
          <small style={{ color: '#64748b' }}>© {new Date().getFullYear()} Nexus Prime Systems. All rights reserved.</small>
          <span className="build-chip">v2.0.0 [STABLE]</span>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
