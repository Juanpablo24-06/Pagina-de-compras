import { NavLink, Outlet } from 'react-router-dom';
import './MainLayout.css';

function MainLayout() {
  const buildTimestamp =
    import.meta.env.VITE_BUILD_TIMESTAMP ||
    (typeof __BUILD_TIMESTAMP__ !== 'undefined' ? __BUILD_TIMESTAMP__ : '');

  const buildDate = buildTimestamp ? new Date(buildTimestamp) : null;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Nexus Prime</div>
        <nav className="main-nav">
          <NavLink to="/" end className="nav-link">
            Inicio
          </NavLink>
          <NavLink to="/fidelidad" className="nav-link">
            Fidelidad
          </NavLink>
          <NavLink to="/gamer-store" className="nav-link">
            Gamer Store
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <div className="footer-meta">
          <small>© {new Date().getFullYear()} Página de Compras</small>
          {buildDate ? (
            <span className="build-chip" title={buildDate.toISOString()}>
              Build {buildDate.toLocaleString('es-ES', { timeZone: 'UTC' })} UTC
            </span>
          ) : (
            <span className="build-chip">Build en desarrollo</span>
          )}
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
