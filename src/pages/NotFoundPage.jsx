import { NavLink } from 'react-router-dom';
import './PageStyles.css';

function NotFoundPage() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">404</p>
        <h1 className="page-title">Página no encontrada</h1>
        <p className="page-lead">La ruta solicitada no existe. Regresa al inicio para continuar.</p>
      </header>
      <NavLink to="/" className="primary-button">
        Volver al inicio
      </NavLink>
    </section>
  );
}

export default NotFoundPage;
