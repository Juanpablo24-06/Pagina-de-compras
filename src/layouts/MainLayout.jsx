import { NavLink, Outlet } from 'react-router-dom';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">Página de Compras</div>
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
          <NavLink to="/gamer-store-jira" className="nav-link">
            Gamer Store Jira
          </NavLink>
        </nav>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <small>© {new Date().getFullYear()} Página de Compras</small>
      </footer>
    </div>
  );
}

export default MainLayout;
