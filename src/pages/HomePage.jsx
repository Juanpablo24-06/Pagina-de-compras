import { NavLink } from 'react-router-dom';
import './PageStyles.css';

function HomePage() {
  return (
    <section className="page">
      <div className="promo-bar">
        <span className="promo-label">Boost semanal</span>
        <span className="promo-pill">Envío gratis en 24h</span>
        <span className="promo-pill alt">Cupón NEON10</span>
        <span className="promo-pill">Soporte 24/7</span>
      </div>

      <div className="hero">
        <div className="hero-sparks" />
        <div className="hero-content">
          <p className="eyebrow">Nexus Prime</p>
          <h1 className="page-title">Energiza tu próxima compra gamer</h1>
          <p className="page-lead">
            Creamos una vitrina completa con navegación clara, catálogo filtrable, flujos de
            checkout realistas y un tema oscuro con acentos neón que se siente premium.
          </p>
          <div className="hero-actions">
            <NavLink to="/gamer-store" className="primary-button">
              Explorar catálogo gamer
            </NavLink>
            <NavLink to="/fidelidad" className="ghost-button">
              Beneficios y fidelidad
            </NavLink>
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <strong>+60</strong>
              <span>SKUs listos para crecer</span>
            </div>
            <div className="metric-card">
              <strong>Filtros</strong>
              <span>Búsqueda, rango y tags</span>
            </div>
            <div className="metric-card">
              <strong>Checkout</strong>
              <span>Validaciones + fidelidad</span>
            </div>
          </div>
        </div>
      </div>

      <header className="page-header">
        <p className="eyebrow">Bienvenido</p>
        <h1 className="page-title">Prepara tu nueva experiencia de compras</h1>
        <p className="page-lead">
          Usa la navegación para explorar las secciones, probar el flujo de carrito y checkout,
          y personalizar el tema oscuro/neón con los estilos compartidos.
        </p>
      </header>
      <div className="card-grid">
        <article className="info-card">
          <h2>Routing básico</h2>
          <p>El enrutador está configurado con páginas de inicio, fidelidad y un fallback.</p>
        </article>
        <article className="info-card">
          <h2>Layout general</h2>
          <p>
            Usa el encabezado y pie de página comunes para mantener una experiencia coherente
            en toda la aplicación.
          </p>
        </article>
        <article className="info-card">
          <h2>Catálogo listo para lanzar</h2>
          <p>
            El catálogo gamer incluye filtros dinámicos, cards con badges, CTA claros y un flujo de
            compra que simula puntos de fidelidad y soporte inmediato.
          </p>
        </article>
      </div>
    </section>
  );
}

export default HomePage;
