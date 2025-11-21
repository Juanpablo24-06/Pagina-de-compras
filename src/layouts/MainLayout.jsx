import { NavLink, Outlet } from 'react-router-dom';
import Header from '../components/layout/Header';
import './MainLayout.css';

function MainLayout() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <Outlet />
      </main>

      <footer className="app-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">Nexus Prime</div>
            <p className="footer-copy">
              El marketplace definitivo para gamers. Compra segura y envío veloz.
            </p>
          </div>

          <div className="footer-columns">
            <div>
              <p className="footer-title">Acerca de</p>
              <NavLink to="/" className="footer-link">Home</NavLink>
              <NavLink to="/gamer-store" className="footer-link">Catálogo</NavLink>
              <NavLink to="/fidelidad" className="footer-link">Premios</NavLink>
            </div>
            <div>
              <p className="footer-title">Ayuda</p>
              <span className="footer-link">Comprar</span>
              <span className="footer-link">Vender</span>
              <span className="footer-link">Resolución de problemas</span>
            </div>
            <div>
              <p className="footer-title">Redes</p>
              <span className="footer-link">Twitter</span>
              <span className="footer-link">Instagram</span>
              <span className="footer-link">YouTube</span>
            </div>
          </div>
        </div>
        <div className="footer-meta">
          <small>© {new Date().getFullYear()} Nexus Prime. Todos los derechos reservados.</small>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
