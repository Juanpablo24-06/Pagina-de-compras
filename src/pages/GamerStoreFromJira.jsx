import { useMemo, useState } from 'react';
import jiraPageConfig from '../data/jiraPageConfig';
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

  const jiraByCategory = useMemo(
    () =>
      jiraPageConfig.reduce((grouped, item) => {
        grouped[item.categoria] = item;
        return grouped;
      }, {}),
    [],
  );

  const pageLead = useMemo(() => {
    const parts = ['catalogo', 'carrito', 'pagos']
      .map((category) => jiraByCategory[category]?.descripcion)
      .filter(Boolean);

    return (
      parts.join(' ') ||
      'Explora el catálogo gamer, filtra por categoría, plataforma o rango de precios, agrega productos al carrito y simula un checkout con puntos.'
    );
  }, [jiraByCategory]);

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
      const matchesSearch = product.name
        .toLowerCase()
        .includes(appliedFilters.search.toLowerCase().trim());
      const matchesCategory =
        appliedFilters.category === 'Todos' || product.category === appliedFilters.category;
      const matchesPlatform =
        appliedFilters.platform === 'Todas' || product.platform === appliedFilters.platform;
      const matchesPrice = product.price <= appliedFilters.maxPrice;
      const matchesDeals = !appliedFilters.onlyDeals || product.deal;
      const matchesTag =
        !appliedFilters.tag || searchable.includes(appliedFilters.tag.toLowerCase());
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
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
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
      `Checkout confirmado para ${checkoutForm.fullName}. Has sumado ${earnedPoints} puntos (saldo: ${
        pointsBalance + earnedPoints
      }). ¡Gracias por tu compra!`,
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

  const renderActions = (categoryKey) => {
    const item = jiraByCategory[categoryKey];
    if (!item?.acciones?.length) return null;
    return (
      <ul className="bullet-list">
        {item.acciones.map((action) => (
          <li key={`${categoryKey}-${action}`}>{action}</li>
        ))}
      </ul>
    );
  };

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Gamer Store</p>
        <h1 className="page-title">Catálogo y experiencia end-to-end</h1>
        <p className="page-lead">{pageLead}</p>
        <div className="pill-row">
          <span className="badge counter">Carrito: {cartItemCount}</span>
          <span className="badge counter">Notificaciones: {notificationCount}</span>
          <span className="badge counter">Puntos: {pointsBalance}</span>
        </div>
      </header>

      <article className="info-card highlight">
        <div className="section-header">
          <div>
            <p className="eyebrow">Nuevo diseño</p>
            <h2 className="section-title">Un storefront organizado y listo para producción</h2>
            <p className="helper-text">
              Grillas responsivas, cards con badges, filtros combinados y un flujo de checkout que
              cubre catálogo, carrito, pagos, puntos y soporte.
            </p>
          </div>
          <div className="hero-metrics compact">
            <div className="metric-card">
              <strong>{gamerProducts.length}</strong>
              <span>Productos activos</span>
            </div>
            <div className="metric-card">
              <strong>{filteredProducts.length}</strong>
              <span>Con los filtros aplicados</span>
            </div>
            <div className="metric-card">
              <strong>{cartItemCount}</strong>
              <span>Items en carrito</span>
            </div>
          </div>
        </div>
      </article>

      <article className="info-card split">
        <div className="filters-col">
          <div className="section-header">
            <h2 className="section-title">
              {jiraByCategory.catalogo?.titulo || 'Filtros y búsqueda refinada'}
            </h2>
            <div className="badge-row">
              <span className="badge category">Catálogo</span>
              <span className="badge platform">Plataformas</span>
            </div>
          </div>
          <p className="helper-text">
            {jiraByCategory.catalogo?.descripcion ||
              'Combina búsqueda, rango de precio, etiquetas rápidas y ordenamiento para encontrar el mejor fit.'}
          </p>

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
              <select
                value={filters.category}
                onChange={(event) => setFilters({ ...filters, category: event.target.value })}
              >
                {filterOptions.categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-field">
              <span>Plataforma</span>
              <select
                value={filters.platform}
                onChange={(event) => setFilters({ ...filters, platform: event.target.value })}
              >
                {filterOptions.platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-field">
              <span>Ordenar</span>
              <select
                value={filters.sort}
                onChange={(event) => setFilters({ ...filters, sort: event.target.value })}
              >
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
          <p className="helper-text">
            Mostrando {filteredProducts.length} de {gamerProducts.length} productos disponibles.
          </p>
          {renderActions('catalogo')}
        </div>

        <div className="catalog-col">
          <div className="section-header">
            <h2 className="section-title">{jiraByCategory.catalogo?.titulo || 'Catálogo gamer'}</h2>
            <div className="badge-row">
              <span className="badge category">Stock {filteredProducts.length}</span>
              <span className="badge platform">Total {gamerProducts.length}</span>
            </div>
          </div>
          <p className="helper-text">
            {jiraByCategory.catalogo?.descripcion || 'Revisa los productos destacados y agrégalos al carrito.'}
          </p>
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="catalog-card">
                <div className="card-top">
                  <div className="badge-row">
                    <span className="badge category">{product.category}</span>
                    <span className="badge platform">{product.platform}</span>
                    {product.deal && <span className="pill success">-15% Deal</span>}
                  </div>
                  <h3>{product.name}</h3>
                  <p className="meta">ID #{product.id} · {product.stock} en stock</p>
                  <p className="helper-text">{product.tagline}</p>
                </div>
                <div className="card-bottom">
                  <div>
                    <p className="price">${product.price.toFixed(2)}</p>
                    <p className="meta">⭐ {product.rating.toFixed(1)} · envío 24h</p>
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => handleAddToCart(product)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="helper-text">No hay productos que coincidan con los filtros.</p>
            )}
          </div>
          {renderActions('catalogo')}
        </div>
      </article>

      <div className="card-grid">
        <article className="info-card">
          <div className="section-header">
            <h2 className="section-title">{jiraByCategory.carrito?.titulo || 'Carrito'}</h2>
            <div className="badge-row">
              <span className="badge category">Ítems {cartItemCount}</span>
              <span className="badge platform">Total ${cartTotal.toFixed(2)}</span>
            </div>
          </div>
          <p className="helper-text">
            {jiraByCategory.carrito?.descripcion ||
              'Administra tus productos, ajusta cantidades y revisa el total a pagar.'}
          </p>
          {cartItems.length === 0 && <p className="helper-text">Aún no hay productos.</p>}
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <div>
                  <strong>{item.name}</strong>
                  <p className="meta">
                    {item.quantity} × ${item.price.toFixed(2)} ({item.category}, {item.platform})
                  </p>
                </div>
                <button
                  type="button"
                  className="ghost-button"
                  onClick={() => handleRemoveFromCart(item.id)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
          <p className="price">Total: ${cartTotal.toFixed(2)}</p>
          <div className="action-row">
            <button type="button" className="primary-button" onClick={handleStartCheckout}>
              Iniciar checkout
            </button>
            <button type="button" className="ghost-button" onClick={handleCalculatePoints}>
              Calcular puntos
            </button>
          </div>
          {pointsEarned !== null && (
            <p className="helper-text">Puntos estimados: {pointsEarned} pts</p>
          )}
          {renderActions('carrito')}
          {renderActions('puntos')}
        </article>

        <article className="info-card">
          <div className="section-header">
            <h2 className="section-title">{jiraByCategory.pagos?.titulo || 'Checkout simulado'}</h2>
            <div className="badge-row">
              <span className="badge category">Pago</span>
              <span className="badge platform">Puntos +{pointsBalance}</span>
            </div>
          </div>
          <p className="helper-text">
            {jiraByCategory.pagos?.descripcion ||
              'Completa los campos para confirmar tu pedido y verificar el cálculo de puntos.'}
          </p>
          <div className="form-grid">
            <label className="filter-field">
              <span>Nombre completo</span>
              <input
                type="text"
                name="fullName"
                value={checkoutForm.fullName}
                onChange={handleCheckoutChange}
                placeholder="Alex Gamer"
                aria-invalid={Boolean(checkoutErrors.fullName)}
              />
              {checkoutErrors.fullName && (
                <p className="error-text">{checkoutErrors.fullName}</p>
              )}
            </label>
            <label className="filter-field">
              <span>Correo</span>
              <input
                type="email"
                name="email"
                value={checkoutForm.email}
                onChange={handleCheckoutChange}
                placeholder="alex@example.com"
                aria-invalid={Boolean(checkoutErrors.email)}
              />
              {checkoutErrors.email && <p className="error-text">{checkoutErrors.email}</p>}
            </label>
            <label className="filter-field">
              <span>Dirección</span>
              <input
                type="text"
                name="address"
                value={checkoutForm.address}
                onChange={handleCheckoutChange}
                placeholder="Calle gamer 123"
                aria-invalid={Boolean(checkoutErrors.address)}
              />
              {checkoutErrors.address && <p className="error-text">{checkoutErrors.address}</p>}
            </label>
            <label className="filter-field">
              <span>Método de pago</span>
              <select
                name="paymentMethod"
                value={checkoutForm.paymentMethod}
                onChange={handleCheckoutChange}
                aria-invalid={Boolean(checkoutErrors.paymentMethod)}
              >
                <option value="Tarjeta">Tarjeta</option>
                <option value="PayPal">PayPal</option>
                <option value="Transferencia">Transferencia</option>
              </select>
              {checkoutErrors.paymentMethod && (
                <p className="error-text">{checkoutErrors.paymentMethod}</p>
              )}
            </label>
          </div>
          <button type="button" className="primary-button" onClick={handleConfirmCheckout}>
            Confirmar pedido
          </button>
          {checkoutStatus && <p className="status-text">{checkoutStatus}</p>}
          <p className="helper-text">Saldo actual de puntos: {pointsBalance} pts</p>
          {checkoutStarted && !checkoutStatus && (
            <p className="helper-text">Checkout iniciado. Confirma cuando estés listo.</p>
          )}
          {renderActions('pagos')}
        </article>

        <article className="info-card">
          <div className="section-header">
            <h2 className="section-title">Historial de compras y puntos</h2>
            <div className="badge-row">
              <span className="badge category">Órdenes {purchaseHistory.length}</span>
              <span className="badge platform">Balance {pointsBalance} pts</span>
            </div>
          </div>
          <p className="helper-text">
            Guarda un registro local de los pedidos confirmados con su total y puntos obtenidos.
          </p>
          {purchaseHistory.length === 0 && (
            <p className="helper-text">Aún no hay compras registradas.</p>
          )}
          <ul className="history-list">
            {purchaseHistory.map((purchase) => (
              <li key={purchase.id} className="history-item">
                <div>
                  <strong>{purchase.customer}</strong>
                  <p className="meta">
                    {purchase.items} ítems · {purchase.paymentMethod}
                  </p>
                </div>
                <div className="history-meta">
                  <p className="price">${purchase.total.toFixed(2)}</p>
                  <p className="helper-text">{purchase.points} pts</p>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="info-card">
          <div className="section-header">
            <h2 className="section-title">{jiraByCategory.soporte?.titulo || 'Soporte y contacto'}</h2>
            <div className="badge-row">
              <span className="badge category">Tickets</span>
              <span className="badge platform">Notif {notificationCount}</span>
            </div>
          </div>
          <p className="helper-text">
            {jiraByCategory.soporte?.descripcion || 'Envíanos tu solicitud rápida y obtén una confirmación inmediata.'}
          </p>
          <form className="form-grid" onSubmit={handleSupportSubmit}>
            <label className="filter-field">
              <span>Nombre</span>
              <input
                type="text"
                value={supportForm.name}
                onChange={(event) => setSupportForm({ ...supportForm, name: event.target.value })}
                placeholder="Tu nombre"
              />
            </label>
            <label className="filter-field">
              <span>Mensaje</span>
              <input
                type="text"
                value={supportForm.message}
                onChange={(event) =>
                  setSupportForm({ ...supportForm, message: event.target.value })
                }
                placeholder="Ayuda con mi pedido, método de pago..."
              />
            </label>
            <button type="submit" className="primary-button">
              Enviar a soporte
            </button>
          </form>
          {supportStatus && <p className="status-text">{supportStatus}</p>}
          {renderActions('soporte')}
        </article>
      </div>
    </section>
  );
}

export default GamerStoreFromJira;
