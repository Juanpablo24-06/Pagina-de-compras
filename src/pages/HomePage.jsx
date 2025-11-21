import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './PageStyles.css';
import '../components/store/StoreStyles.css'; // Import store styles for top sellers

const highlights = [
  {
    title: 'Navegación Cyberpunk',
    description: 'Interfaz inmersiva con feedback visual neón para una experiencia de compra futurista.',
  },
  {
    title: 'Catálogo High-Tech',
    description: 'Productos seleccionados con specs detalladas, reseñas de la comunidad y modo comparación.',
  },
  {
    title: 'Soporte 24/7',
    description: 'Agentes IA y humanos listos para resolver dudas sobre compatibilidad y envíos al instante.',
  },
  {
    title: 'Envíos Seguros',
    description: 'Packaging reforzado y seguimiento GPS en tiempo real para todo tu hardware.',
  },
];

const articles = [
  {
    title: 'Setup de escritorios futuristas',
    tag: 'Blog',
    snippet: 'Guías de iluminación RGB, cable management y periféricos recomendados para distintos presupuestos.',
  },
  {
    title: 'Rutinas pro para ranked',
    tag: 'Comunidad',
    snippet: 'Checklist previa a las ranked, playlists para focus y cómo usar el modo oscuro para menos fatiga visual.',
  },
  {
    title: 'Actualizaciones del roadmap',
    tag: 'Producto',
    snippet: 'Nuevas integraciones con fidelidad, analítica y monitoreo de checkout sin tocar la UI pública.',
  },
];

function HomePage() {
  // Access store context
  const { products, addToCart } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [notif, setNotif] = useState(null);

  // Get Top 4 products for "Featured" section
  const topProducts = useMemo(() => products.slice(0, 4), [products]);

  const metrics = useMemo(
    () => [
      { value: '+500', label: 'SKUs High-End' },
      { value: '24h', label: 'Envío Prime' },
      { value: '100%', label: 'Garantía Gamer' },
    ],
    []
  );

  const handleToast = (message, tone = 'success') => {
    setNotif({ message, tone });
    setTimeout(() => setNotif(null), 3500);
  };

  const handleNewsletter = (event) => {
    event.preventDefault();
    if (!newsletterEmail.includes('@')) {
      handleToast('Por favor ingresa un correo válido para la newsletter.', 'warning');
      return;
    }
    handleToast('Te suscribimos al boletín semanal con novedades y drops.', 'success');
    setNewsletterEmail('');
  };

  return (
    <section className="page">
      {notif && (
        <div className={`inline-toast inline-toast-${notif.tone}`} role="status">
          <span className="toast-icon">{notif.tone === 'warning' ? '⚠️' : '✨'}</span>
          <p>{notif.message}</p>
        </div>
      )}

      <div className="promo-bar" style={{borderColor: 'var(--cyber-cyan)'}}>
        <span className="promo-label">CYBER WEEK</span>
        <span className="promo-pill">Envío gratis en 24h</span>
        <span className="promo-pill alt">CÓDIGO: NETRUNNER</span>
        <span className="promo-pill">Devolución Extendida</span>
      </div>

      <div className="hero" style={{
          background: 'linear-gradient(135deg, rgba(5, 5, 5, 0.95), rgba(10, 10, 20, 0.95))',
          border: '1px solid var(--cyber-border)',
          boxShadow: '0 0 30px rgba(0, 243, 255, 0.15)'
      }}>
        <div className="hero-sparks" />
        <div className="hero-content">
          <p className="eyebrow" style={{color: 'var(--cyber-magenta)'}}>NEXUS GAMING STORE</p>
          <h1 className="page-title" style={{
              fontSize: '3.5rem',
              textShadow: '0 0 10px rgba(0,243,255,0.5)',
              fontFamily: 'Impact, sans-serif',
              letterSpacing: '2px'
          }}>
            UPGRADE YOUR REALITY
          </h1>
          <p className="page-lead">
            La tienda definitiva para entusiastas del gaming. Hardware de alto rendimiento,
            periféricos de precisión y accesorios exclusivos.
          </p>
          <div className="hero-actions">
            <NavLink to="/gamer-store" className="primary-button" style={{
                background: 'var(--cyber-cyan)',
                color: '#000',
                boxShadow: '0 0 15px var(--cyber-cyan)'
            }}>
              ACCEDER AL SISTEMA
            </NavLink>
            <NavLink to="/fidelidad" className="ghost-button" style={{borderColor: 'var(--cyber-magenta)', color: 'var(--cyber-magenta)'}}>
              PROGRAMA VIP
            </NavLink>
          </div>
          <div className="hero-metrics">
            {metrics.map((item) => (
              <div key={item.label} className="metric-card" style={{borderColor: 'rgba(255,255,255,0.1)'}}>
                <strong style={{color: 'var(--cyber-yellow)'}}>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Top Sellers Section from Context --- */}
      <section className="content-section">
        <header className="section-header">
          <div>
            <p className="eyebrow" style={{color: 'var(--cyber-cyan)'}}>TRENDING HARDWARE</p>
            <h2>TOP SELLING GEAR</h2>
          </div>
          <NavLink to="/gamer-store" className="text-link" style={{color: 'var(--cyber-magenta)'}}>VER TODO >></NavLink>
        </header>

        <div className="products-grid-v2">
            {topProducts.map(product => (
                 <div key={product.id} className="cyber-card" style={{ '--card-color': product.color || 'var(--primary-cyan)' }}>
                 {product.deal && <div className="cyber-badge">DEAL -15%</div>}

                 <div className="card-image-container">
                   <span className="card-emoji" role="img" aria-label={product.name}>{product.image}</span>
                 </div>

                 <div className="card-body">
                   <div className="card-meta">
                     <span className="category-pill">{product.category}</span>
                     <span className="rating">★ {product.rating}</span>
                   </div>

                   <h3 className="card-title">{product.name}</h3>

                   <div className="card-footer">
                     <div className="price-block">
                       <span className="price-label">CREDITS</span>
                       <span className="price-value">${product.price}</span>
                     </div>
                     <button
                       className="cyber-button small"
                       disabled={product.stock === 0}
                       onClick={() => addToCart(product)}
                     >
                       ADD +
                     </button>
                   </div>
                 </div>
               </div>
            ))}
        </div>
      </section>

      <div className="card-grid">
        {highlights.map((item) => (
          <article key={item.title} className="info-card" style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <h2 style={{color: 'var(--cyber-cyan)'}}>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <section className="section-grid">
        <div className="panel" style={{borderColor: 'var(--cyber-border)'}}>
          <p className="eyebrow">Newsletter</p>
          <h2>Recibe Drop Alerts</h2>
          <p className="panel-lead">
            Sé el primero en enterarte de los restocks de GPUs y lanzamientos de ediciones limitadas.
          </p>
          <form className="form-card" onSubmit={handleNewsletter}>
            <label htmlFor="newsletter-email">Correo electrónico</label>
            <div className="input-row">
              <input
                id="newsletter-email"
                name="newsletter-email"
                type="email"
                placeholder="netrunner@city.com"
                className="cyber-input"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
              />
              <button type="submit" className="cyber-button small">SUSCRIBIRSE</button>
            </div>
          </form>
        </div>

        <section className="content-section">
            <header className="section-header">
            <div>
                <p className="eyebrow">LATEST TRANSMISSIONS</p>
                <h2>BLOG & NOTICIAS</h2>
            </div>
            </header>
            <div className="articles-grid">
            {articles.map((article) => (
                <article key={article.title} className="article-card" style={{background: 'rgba(0,0,0,0.5)', borderColor: '#333'}}>
                <span className="pill" style={{borderColor: 'var(--cyber-magenta)', color: 'var(--cyber-magenta)'}}>{article.tag}</span>
                <h3>{article.title}</h3>
                <p>{article.snippet}</p>
                </article>
            ))}
            </div>
        </section>
      </section>
    </section>
  );
}

export default HomePage;
