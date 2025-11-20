import { useMemo, useState } from 'react';
import './PageStyles.css';

const gamerProducts = [
  {
    id: 1,
    name: 'Auriculares Pro X',
    price: 129.99,
    category: 'Audio',
    platform: 'PC',
    rating: 4.7,
    stock: 24,
    deal: true,
    tagline: 'Sonido 7.1, micrófono cardioide y perfil pro calibrado.',
  },
  {
    id: 2,
    name: 'Control Elite',
    price: 149.99,
    category: 'Accesorios',
    platform: 'Xbox',
    rating: 4.8,
    stock: 15,
    deal: false,
    tagline: 'Palancas intercambiables y grips antideslizantes.',
  },
  {
    id: 3,
    name: 'DualSense Edge',
    price: 199.99,
    category: 'Accesorios',
    platform: 'PlayStation',
    rating: 4.6,
    stock: 19,
    deal: true,
    tagline: 'Triggers hápticos y perfiles listos para eSports.',
  },
  {
    id: 4,
    name: 'Teclado Mecánico RGB',
    price: 89.99,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.5,
    stock: 41,
    deal: false,
    tagline: 'Switches lineales, placa de aluminio y cable desmontable.',
  },
  {
    id: 5,
    name: 'Mouse Inalámbrico Gamer',
    price: 59.99,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.4,
    stock: 33,
    deal: true,
    tagline: 'Batería de 90h, sensor 26K DPI y 70g de peso ultra ligero.',
  },
  {
    id: 6,
    name: 'Steam Gift Card',
    price: 50.0,
    category: 'Gift Card',
    platform: 'PC',
    rating: 4.9,
    stock: 60,
    deal: false,
    tagline: 'Recarga digital inmediata para tu biblioteca.',
  },
  {
    id: 7,
    name: 'Nintendo eShop Card',
    price: 35.0,
    category: 'Gift Card',
    platform: 'Nintendo',
    rating: 4.8,
    stock: 28,
    deal: false,
    tagline: 'Activa ofertas semanales y compra en minutos con entrega digital.',
  },
  {
    id: 8,
    name: 'FIFA Ultimate Edition',
    price: 89.99,
    category: 'Juegos',
    platform: 'PlayStation',
    rating: 4.2,
    stock: 12,
    deal: true,
    tagline: 'Incluye pases de temporada, sobres exclusivos y colección digital.',
  },
  {
    id: 9,
    name: 'Halo Infinite',
    price: 69.99,
    category: 'Juegos',
    platform: 'Xbox',
    rating: 4.3,
    stock: 16,
    deal: false,
    tagline: 'Campaña cooperativa y arenas competitivas.',
  },
  {
    id: 10,
    name: 'Zelda: Tears of the Kingdom',
    price: 69.99,
    category: 'Juegos',
    platform: 'Nintendo',
    rating: 4.9,
    stock: 11,
    deal: true,
    tagline: 'Mapa abierto, físicas creativas y misiones épicas de colección.',
  },
];

const filterOptions = {
  categories: ['Todos', 'Audio', 'Accesorios', 'Periféricos', 'Gift Card', 'Juegos'],
  platforms: ['Todas', 'PC', 'PlayStation', 'Xbox', 'Nintendo'],
  sort: [
    { value: 'featured', label: 'Destacados' },
    { value: 'price-asc', label: 'Precio ascendente' },
    { value: 'price-desc', label: 'Precio descendente' },
    { value: 'rating', label: 'Mejor calificados' },
    { value: 'name', label: 'A-Z' },
  ],
};

const quickTags = ['rgb', 'digital', 'colección', 'pro'];

function GamerStoreFromJira() {
  const maxPrice = useMemo(() => Math.ceil(Math.max(...gamerProducts.map((p) => p.price))), []);
  const [filters, setFilters] = useState({
    search: '',
    category: 'Todos',
    platform: 'Todas',
    sort: 'featured',
    maxPrice,
    onlyDeals: false,
    tag: '',
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({
    fullName: '',
    email: '',
    address: '',
    paymentMethod: 'Tarjeta',
  });
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [checkoutErrors, setCheckoutErrors] = useState({});
  const [pointsEarned, setPointsEarned] = useState(null);
  const [pointsBalance, setPointsBalance] = useState(0);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [supportForm, setSupportForm] = useState({ name: '', message: '' });
  const [supportStatus, setSupportStatus] = useState('');
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const notificationCount = purchaseHistory.length + (supportStatus ? 1 : 0);

  const pageLead =
    'Explora un catálogo curado, ajusta filtros en tiempo real, gestiona tu carrito y simula un checkout con fidelidad, todo en un diseño espacioso y claro.';

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const baseFilters = {
      search: '',
      category: 'Todos',
      platform: 'Todas',
      sort: 'featured',
      maxPrice,
      onlyDeals: false,
      tag: '',
    };
    setFilters(baseFilters);
    setAppliedFilters(baseFilters);
  };

  const filteredProducts = useMemo(() => {
    const filtered = gamerProducts.filter((product) => {
      const searchable = `${product.name} ${product.tagline}`.toLowerCase();
      const matchesSearch = product.name.toLowerCase().includes(appliedFilters.search.toLowerCase().trim());
      const matchesCategory = appliedFilters.category === 'Todos' || product.category === appliedFilters.category;
      const matchesPlatform = appliedFilters.platform === 'Todas' || product.platform === appliedFilters.platform;
      const matchesPrice = product.price <= appliedFilters.maxPrice;
      const matchesDeals = !appliedFilters.onlyDeals || product.deal;
      const matchesTag = !appliedFilters.tag || searchable.includes(appliedFilters.tag.toLowerCase());
      return matchesSearch && matchesCategory && matchesPlatform && matchesPrice && matchesDeals && matchesTag;
    });

    const sorted = [...filtered].sort((a, b) => {
      switch (appliedFilters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return Number(b.deal) - Number(a.deal) || b.rating - a.rating;
      }
    });

    return sorted;
  }, [appliedFilters]);

  const handleAddToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCheckoutStatus('');
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleStartCheckout = () => {
    if (cartItems.length === 0) {
      setCheckoutStatus('No hay productos en el carrito para iniciar el checkout.');
      return;
    }
    setCheckoutStarted(true);
    setCheckoutStatus('');
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
    setCheckoutErrors((prev) => {
      if (!prev[name]) return prev;
      const updated = { ...prev };
      delete updated[name];
      return updated;
    });
  };

  const validateCheckout = () => {
    const errors = {};
    if (!checkoutForm.fullName.trim()) {
      errors.fullName = 'El nombre es obligatorio.';
    }
    if (!checkoutForm.email.trim()) {
      errors.email = 'El correo es obligatorio.';
    }
    if (!checkoutForm.address.trim()) {
      errors.address = 'La dirección es obligatoria.';
    }
    if (!checkoutForm.paymentMethod) {
      errors.paymentMethod = 'Selecciona un método de pago.';
    }
    return errors;
  };

  const handleConfirmCheckout = () => {
    if (!checkoutStarted) {
      setCheckoutStatus('Inicia el checkout antes de confirmar.');
      return;
    }
    const errors = validateCheckout();
    setCheckoutErrors(errors);
    if (Object.keys(errors).length > 0) {
      setCheckoutStatus('Corrige los errores para confirmar tu checkout.');
      return;
    }
    const earnedPoints = Math.floor(cartTotal / 1000);
    setPointsEarned(earnedPoints);
    setPointsBalance((prev) => prev + earnedPoints);
    setCheckoutStatus(
      `Checkout confirmado para ${checkoutForm.fullName}. Has sumado ${earnedPoints} puntos (saldo: ${pointsBalance + earnedPoints}). ¡Gracias por tu compra!`,
    );
    setPurchaseHistory((prev) => [
      {
        id: Date.now(),
        customer: checkoutForm.fullName,
        paymentMethod: checkoutForm.paymentMethod,
        total: cartTotal,
        points: earnedPoints,
        items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
      },
      ...prev,
    ]);
    setCheckoutStarted(false);
    setCheckoutErrors({});
  };

  const handleCalculatePoints = () => {
    if (cartItems.length === 0) {
      setPointsEarned(0);
      return;
    }
    setPointsEarned(Math.floor(cartTotal / 1000));
  };

  const handleSupportSubmit = (event) => {
    event.preventDefault();
    if (!supportForm.name || !supportForm.message) {
      setSupportStatus('Por favor completa tu nombre y el mensaje.');
      return;
    }
    setSupportStatus(`Tu solicitud fue enviada, ${supportForm.name}. Responderemos pronto.`);
    setSupportForm({ name: '', message: '' });
  };

  return (
    <section className="page">
      <div className="promo-bar">
        <span className="promo-label">Flash sale</span>
        <span className="promo-pill">Entrega en 24h</span>
        <span className="promo-pill alt">Cyber Week -15%</span>
        <span className="promo-pill">Atención 24/7</span>
      </div>

      <div className="hero hero-split">
        <div className="hero-sparks" />
        <div className="hero-content">
          <p className="eyebrow">Gamer Store</p>
          <h1 className="page-title">Catálogo premium, filtros claros y checkout listo</h1>
          <p className="page-lead">{pageLead}</p>
          <div className="hero-actions">
            <button type="button" className="primary-button" onClick={handleApplyFilters}>
              Aplicar filtros al instante
            </button>
            <button type="button" className="ghost-button" onClick={handleResetFilters}>
              Reiniciar búsqueda
            </button>
          </div>
          <div className="hero-metrics">
            <div className="metric-card">
              <strong>{gamerProducts.length}</strong>
              <span>Productos activos</span>
            </div>
            <div className="metric-card">
              <strong>{cartItemCount}</strong>
              <span>Artículos en carrito</span>
            </div>
            <div className="metric-card">
              <strong>{notificationCount}</strong>
              <span>Alertas y novedades</span>
            </div>
          </div>
        </div>
        <div className="hero-panel">
          <div className="panel-content">
            <p className="eyebrow">Visión general</p>
            <h3>Experiencia lista para comprar</h3>
            <p className="helper-text">
              Grillas aireadas, badges claros, tarjetas con CTA visibles y módulos de carrito, checkout, puntos y soporte.
            </p>
            <div className="pill-row">
              <span className="badge counter">Catálogo filtrable</span>
              <span className="badge counter">Checkout guiado</span>
              <span className="badge counter">Puntos + soporte</span>
            </div>
          </div>
        </div>
      </div>

      <div className="store-layout">
        <div className="filters-col section-stack">
          <article className="info-card highlight">
            <div className="section-header">
              <div>
                <p className="eyebrow">Panel de filtros</p>
                <h2 className="section-title">Encuentra el match perfecto</h2>
                <p className="helper-text">
                  Combina búsqueda, categorías, plataforma, rangos y ofertas sin saturar la vista. Ajusta y aplica cuando estés listo.
                </p>
              </div>
              <div className="badge-row">
                <span className="badge category">Filtros activos</span>
                <span className="badge platform">{filteredProducts.length} resultados</span>
              </div>
            </div>

            <div className="filter-grid">
              <label className="filter-field">
                <span>Búsqueda</span>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                  placeholder="Auriculares, teclado, gift card..."
                />
              </label>
              <label className="filter-field">
                <span>Categoría</span>
                <select value={filters.category} onChange={(event) => setFilters({ ...filters, category: event.target.value })}>
                  {filterOptions.categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Plataforma</span>
                <select value={filters.platform} onChange={(event) => setFilters({ ...filters, platform: event.target.value })}>
                  {filterOptions.platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Ordenar</span>
                <select value={filters.sort} onChange={(event) => setFilters({ ...filters, sort: event.target.value })}>
                  {filterOptions.sort.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="filter-field">
                <span>Precio máximo</span>
                <div className="range-row">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={filters.maxPrice}
                    onChange={(event) => setFilters({ ...filters, maxPrice: Number(event.target.value) })}
                  />
                  <span className="range-value">${filters.maxPrice}</span>
                </div>
              </label>
              <label className="filter-field checkbox-field">
                <span>Solo promociones</span>
                <input
                  type="checkbox"
                  checked={filters.onlyDeals}
                  onChange={(event) => setFilters({ ...filters, onlyDeals: event.target.checked })}
                />
              </label>
            </div>

            <div className="quick-tags">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={`chip ${filters.tag === tag ? 'active' : ''}`}
                  onClick={() => setFilters({ ...filters, tag: filters.tag === tag ? '' : tag })}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="action-row">
              <button type="button" className="primary-button" onClick={handleApplyFilters}>
                Aplicar filtros
              </button>
              <button type="button" className="ghost-button" onClick={handleResetFilters}>
                Limpiar
              </button>
            </div>
            <p className="helper-text">Mostrando {filteredProducts.length} de {gamerProducts.length} productos disponibles.</p>
          </article>

          <article className="info-card">
            <div className="section-header">
              <h3 className="section-title">Servicio y confianza</h3>
              <div className="badge-row">
                <span className="badge platform">Soporte 24/7</span>
                <span className="badge category">Logística express</span>
              </div>
            </div>
            <ul className="bullet-list">
              <li>Seguridad en pagos con tarjetas, PayPal y transferencias.</li>
              <li>Actualizaciones constantes de stock y tiempos de entrega.</li>
              <li>Política de devoluciones clara y seguimiento en tiempo real.</li>
            </ul>
          </article>
        </div>

        <div className="catalog-col section-stack">
          <article className="info-card split">
            <div>
              <p className="eyebrow">Colección curada</p>
              <h2 className="section-title">Grid espacioso y fácil de leer</h2>
              <p className="helper-text">
                Cards con precio, rating, plataformas y promos claras. Agrega sin perder contexto del estado del carrito.
              </p>
              <div className="pill-row">
                <span className="badge counter">Stock fresco</span>
                <span className="badge counter">Precio visible</span>
                <span className="badge counter">CTA directo</span>
              </div>
            </div>
            <div className="hero-metrics compact">
              <div className="metric-card">
                <strong>{filteredProducts.length}</strong>
                <span>Productos visibles</span>
              </div>
              <div className="metric-card">
                <strong>{filters.maxPrice}</strong>
                <span>Tope de precio</span>
              </div>
              <div className="metric-card">
                <strong>{filters.onlyDeals ? 'Solo promos' : 'Todo'}</strong>
                <span>Modo de vista</span>
              </div>
            </div>
          </article>

          <div className="card-grid catalog-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className={`catalog-card ${product.deal ? 'highlight' : ''}`}>
                <div className="catalog-card__top">
                  <div>
                    <p className="eyebrow">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p className="helper-text">{product.tagline}</p>
                  </div>
                  <span className={`chip ${product.deal ? 'active' : ''}`}>
                    {product.deal ? 'Promo' : 'Nuevo'}
                  </span>
                </div>
                <div className="catalog-card__meta">
                  <span className="badge platform">{product.platform}</span>
                  <span className="badge category">Rating {product.rating}</span>
                  <span className="badge counter">Stock {product.stock}</span>
                </div>
                <div className="catalog-card__footer">
                  <div className="price-group">
                    <strong className="price">${product.price}</strong>
                    <span className="helper-text">Hasta 12 cuotas flex</span>
                  </div>
                  <button type="button" className="primary-button" onClick={() => handleAddToCart(product)}>
                    Agregar al carrito
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="checkout-col section-stack">
          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Carrito</h2>
              <div className="badge-row">
                <span className="badge category">Items {cartItemCount}</span>
                <span className="badge platform">Total ${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            {cartItems.length === 0 ? (
              <p className="helper-text">Tu carrito está vacío. Agrega productos para continuar.</p>
            ) : (
              <div className="cart-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item__info">
                      <strong>{item.name}</strong>
                      <p className="helper-text">
                        {item.quantity} x ${item.price} — {item.category}
                      </p>
                    </div>
                    <div className="cart-item__actions">
                      <span className="badge counter">{item.platform}</span>
                      <button type="button" className="ghost-button" onClick={() => handleRemoveFromCart(item.id)}>
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="action-row">
              <button type="button" className="primary-button" onClick={handleStartCheckout}>
                Iniciar checkout
              </button>
              <button type="button" className="ghost-button" onClick={handleCalculatePoints}>
                Calcular puntos
              </button>
            </div>
          </article>

          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Checkout guiado</h2>
              <div className="badge-row">
                <span className="badge category">Pago seguro</span>
                <span className="badge platform">Dirección + email</span>
              </div>
            </div>
            <div className="form-grid">
              <label className={`filter-field ${checkoutErrors.fullName ? 'has-error' : ''}`}>
                <span>Nombre completo</span>
                <input
                  type="text"
                  name="fullName"
                  value={checkoutForm.fullName}
                  onChange={handleCheckoutChange}
                  placeholder="Nombre y apellido"
                />
              </label>
              <label className={`filter-field ${checkoutErrors.email ? 'has-error' : ''}`}>
                <span>Correo</span>
                <input
                  type="email"
                  name="email"
                  value={checkoutForm.email}
                  onChange={handleCheckoutChange}
                  placeholder="tucorreo@email.com"
                />
              </label>
              <label className={`filter-field full ${checkoutErrors.address ? 'has-error' : ''}`}>
                <span>Dirección</span>
                <input
                  type="text"
                  name="address"
                  value={checkoutForm.address}
                  onChange={handleCheckoutChange}
                  placeholder="Calle, número, ciudad, país"
                />
              </label>
              <label className={`filter-field full ${checkoutErrors.paymentMethod ? 'has-error' : ''}`}>
                <span>Método de pago</span>
                <div className="radio-row">
                  {['Tarjeta', 'PayPal', 'Transferencia'].map((method) => (
                    <label key={method} className="radio-chip">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method}
                        checked={checkoutForm.paymentMethod === method}
                        onChange={handleCheckoutChange}
                      />
                      <span>{method}</span>
                    </label>
                  ))}
                </div>
              </label>
            </div>
            <div className="action-row">
              <button type="button" className="primary-button" onClick={handleConfirmCheckout}>
                Confirmar pedido
              </button>
            </div>
            {checkoutStatus && <p className="helper-text highlight-text">{checkoutStatus}</p>}
          </article>

          <article className="info-card split">
            <div>
              <h3 className="section-title">Puntos y compras</h3>
              <p className="helper-text">
                Suma 1 punto por cada $1000. Guarda el historial y recompensas acumuladas.
              </p>
              <div className="pill-row">
                <span className="badge counter">Saldo {pointsBalance}</span>
                {pointsEarned !== null && <span className="badge platform">Ganaste {pointsEarned}</span>}
              </div>
              <div className="history-list">
                {purchaseHistory.length === 0 ? (
                  <p className="helper-text">Aún no hay compras registradas.</p>
                ) : (
                  purchaseHistory.map((purchase) => (
                    <div key={purchase.id} className="history-item">
                      <div>
                        <strong>{purchase.customer}</strong>
                        <p className="helper-text">{purchase.items} items — {purchase.paymentMethod}</p>
                      </div>
                      <div className="badge-row">
                        <span className="badge category">${purchase.total.toFixed(2)}</span>
                        <span className="badge platform">{purchase.points} pts</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="card-accent">
              <p className="eyebrow">Tip</p>
              <p className="helper-text">Calcula puntos, valida campos y confirma el pedido antes de cerrar la sesión de checkout.</p>
            </div>
          </article>

          <article className="info-card">
            <div className="section-header">
              <h2 className="section-title">Soporte y contacto</h2>
              <div className="badge-row">
                <span className="badge platform">Respuesta inmediata</span>
                <span className="badge category">Centro de ayuda</span>
              </div>
            </div>
            <form className="form-grid" onSubmit={handleSupportSubmit}>
              <label className="filter-field">
                <span>Nombre</span>
                <input
                  type="text"
                  value={supportForm.name}
                  onChange={(event) => setSupportForm({ ...supportForm, name: event.target.value })}
                  placeholder="Cómo te llamamos"
                />
              </label>
              <label className="filter-field full">
                <span>Mensaje</span>
                <textarea
                  value={supportForm.message}
                  onChange={(event) => setSupportForm({ ...supportForm, message: event.target.value })}
                  rows={3}
                  placeholder="¿Cómo podemos ayudarte?"
                />
              </label>
              <div className="action-row">
                <button type="submit" className="primary-button">
                  Enviar solicitud
                </button>
              </div>
              {supportStatus && <p className="helper-text highlight-text">{supportStatus}</p>}
            </form>
          </article>
        </div>
      </div>
    </section>
  );
}

export default GamerStoreFromJira;
