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
          <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Admin
          </NavLink>
        </nav>
      </header>
      
      <main className="app-main">
        <Outlet />
      </main>
      
      <footer className="app-footer">
        <div className="footer-meta">
          <small style={{color: '#64748b'}}>© {new Date().getFullYear()} Nexus Prime Systems. All rights reserved.</small>
          <span className="build-chip">v2.0.0 [STABLE]</span>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
