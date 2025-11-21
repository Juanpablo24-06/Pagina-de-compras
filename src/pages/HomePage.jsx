import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './PageStyles.css';

const highlights = [
  {
    title: 'Navegación coherente',
    description: 'Barra principal fija, accesible y con feedback activo para que los visitantes sepan dónde están.',
  },
  {
    title: 'Home moderna',
    description: 'Hero con mensaje claro, CTA visibles y métricas que refuerzan confianza en la experiencia.',
  },
  {
    title: 'Contenido vivo',
    description: 'Blog, newsletter y secciones de soporte para mantener a la comunidad informada y conectada.',
  },
  {
    title: 'Políticas visibles',
    description: 'Transparencia en envíos, devoluciones y privacidad para reducir fricción y aumentar conversiones.',
  },
];

const policies = [
  {
    name: 'Envíos y entregas',
    detail: 'Cobertura nacional con seguimiento en tiempo real y notificaciones cuando tu pedido cambia de estado.',
  },
  {
    name: 'Cambios y devoluciones',
    detail: 'Ventana de 30 días con etiquetas prepagadas y soporte humano para resolver cualquier incidencia.',
  },
  {
    name: 'Privacidad y cookies',
    detail: 'Datos cifrados, consentimiento granular y panel claro para revisar preferencias de comunicación.',
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

const supportChannels = [
  {
    label: 'Soporte en vivo',
    info: 'Chat 24/7 con especialistas gamer para resolver dudas de catálogo sin interrumpir tu partida.',
  },
  {
    label: 'Centro de ayuda',
    info: 'Guías rápidas, videos y respuestas a las preguntas más frecuentes organizadas por tema.',
  },
  {
    label: 'Mesa de casos',
    info: 'Seguimiento de tickets con SLA claros y alertas in-site para mantener la comunicación fluida.',
  },
];

function HomePage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactForm, setContactForm] = useState({ name: '', topic: 'Soporte', message: '' });
  const [notif, setNotif] = useState(null);

  const metrics = useMemo(
    () => [
      { value: '+60', label: 'SKUs listos para crecer' },
      { value: 'UI', label: 'Home, blog y secciones claras' },
      { value: 'Checkout', label: 'Validaciones + fidelidad' },
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

  const handleContact = (event) => {
    event.preventDefault();
    if (!contactForm.name.trim() || !contactForm.message.trim()) {
      handleToast('Completa tu nombre y mensaje para que podamos ayudarte.', 'warning');
      return;
    }
    handleToast('Recibimos tu consulta. Un agente te responderá en minutos.', 'success');
    setContactForm({ name: '', topic: contactForm.topic, message: '' });
  };

  return (
    <section className="page">
      {notif && (
        <div className={`inline-toast inline-toast-${notif.tone}`} role="status">
          <span className="toast-icon">{notif.tone === 'warning' ? '⚠️' : '✨'}</span>
          <p>{notif.message}</p>
        </div>
      )}

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
            {metrics.map((item) => (
              <div key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-sidecard">
          <p className="eyebrow">Modo marca</p>
          <h3>UI coherente + preferencias del jugador</h3>
          <ul>
            <li>Modo oscuro estable con acentos neón y tipografía limpia.</li>
            <li>Preferencias guardadas para idioma y accesibilidad sin tocar checkout.</li>
            <li>Nav principal responsive con feedback visual en cada sección.</li>
          </ul>
        </div>
      </div>

      <header className="page-header">
        <p className="eyebrow">Experiencia de marca</p>
        <h1 className="page-title">Prepara tu nueva experiencia de compras</h1>
        <p className="page-lead">
          Usa la navegación para explorar las secciones, probar el flujo de carrito y checkout,
          y personalizar el tema oscuro/neón con los estilos compartidos.
        </p>
      </header>

      <div className="card-grid">
        {highlights.map((item) => (
          <article key={item.title} className="info-card">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </article>
        ))}
      </div>

      <section className="section-grid">
        <div className="panel">
          <p className="eyebrow">Quiénes somos</p>
          <h2>Equipo E: narrativa y confianza</h2>
          <p className="panel-lead">
            Diseñamos la casa digital con secciones claras, mensajes accionables y señales de confianza
            que acompañan a catálogo y checkout sin modificar sus lógicas.
          </p>
          <div className="tag-row">
            <span className="tag">Branding</span>
            <span className="tag">UX copy</span>
            <span className="tag">Responsive</span>
            <span className="tag">Modo oscuro</span>
          </div>
        </div>

        <div className="panel highlights-panel">
          <div className="panel-row">
            <div>
              <p className="eyebrow">Destacados</p>
              <h3>Secciones listas para producción</h3>
              <ul className="checklist">
                <li>Home con hero, métricas y CTA claras.</li>
                <li>Newsletter y contenidos vivos para atraer comunidad.</li>
                <li>Soporte/contacto con feedback inmediato in-site.</li>
              </ul>
            </div>
            <div className="stamp">v2.0</div>
          </div>

          <div className="policies">
            {policies.map((policy) => (
              <article key={policy.name} className="policy-card">
                <h4>{policy.name}</h4>
                <p>{policy.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <header className="section-header">
          <div>
            <p className="eyebrow">Blog y contenidos</p>
            <h2>Historias para inspirar la compra</h2>
          </div>
          <NavLink to="/gamer-store" className="text-link">Ver catálogo</NavLink>
        </header>
        <div className="articles-grid">
          {articles.map((article) => (
            <article key={article.title} className="article-card">
              <span className="pill">{article.tag}</span>
              <h3>{article.title}</h3>
              <p>{article.snippet}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-grid newsletter-support">
        <div className="panel">
          <p className="eyebrow">Newsletter</p>
          <h2>Recibe drop alerts y lanzamientos</h2>
          <p className="panel-lead">
            Enviamos resúmenes breves con novedades del catálogo gamer, consejos de configuración y
            recordatorios de puntos de fidelidad.
          </p>
          <form className="form-card" onSubmit={handleNewsletter}>
            <label htmlFor="newsletter-email">Correo electrónico</label>
            <div className="input-row">
              <input
                id="newsletter-email"
                name="newsletter-email"
                type="email"
                placeholder="tu@correo.com"
                value={newsletterEmail}
                onChange={(event) => setNewsletterEmail(event.target.value)}
                required
              />
              <button type="submit" className="primary-button small">Unirme</button>
            </div>
            <small className="helper-text">Sin spam: puedes desuscribirte en cualquier momento.</small>
          </form>
        </div>

        <div className="panel">
          <p className="eyebrow">Soporte y contacto</p>
          <h2>Respuestas rápidas dentro del sitio</h2>
          <p className="panel-lead">
            Ajustamos la comunicación para que tengas confirmaciones inmediatas, sin depender de correos
            ni tocar el flujo de pago.
          </p>
          <div className="support-channels">
            {supportChannels.map((channel) => (
              <div key={channel.label} className="support-card">
                <strong>{channel.label}</strong>
                <p>{channel.info}</p>
              </div>
            ))}
          </div>
          <form className="form-card" onSubmit={handleContact}>
            <label htmlFor="contact-name">Nombre</label>
            <input
              id="contact-name"
              name="contact-name"
              type="text"
              placeholder="Ingresa tu nombre"
              value={contactForm.name}
              onChange={(event) => setContactForm({ ...contactForm, name: event.target.value })}
              required
            />
            <label htmlFor="contact-topic">Tema</label>
            <select
              id="contact-topic"
              name="contact-topic"
              value={contactForm.topic}
              onChange={(event) => setContactForm({ ...contactForm, topic: event.target.value })}
            >
              <option>Soporte</option>
              <option>Contenido</option>
              <option>Colaboraciones</option>
            </select>
            <label htmlFor="contact-message">Mensaje</label>
            <textarea
              id="contact-message"
              name="contact-message"
              rows="3"
              placeholder="Cuéntanos en qué podemos ayudarte"
              value={contactForm.message}
              onChange={(event) => setContactForm({ ...contactForm, message: event.target.value })}
              required
            />
            <button type="submit" className="ghost-button">Enviar consulta</button>
          </form>
        </div>
      </section>
    </section>
  );
}

export default HomePage;
