import './PageStyles.css';

function HomePage() {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Bienvenido</p>
        <h1 className="page-title">Prepara tu nueva experiencia de compras</h1>
        <p className="page-lead">
          Esta es la estructura inicial de la aplicación. Usa la navegación para explorar
          las secciones y continúa construyendo sobre este layout.
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
      </div>
    </section>
  );
}

export default HomePage;
