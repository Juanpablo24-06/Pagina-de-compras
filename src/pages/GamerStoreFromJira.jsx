import { useMemo, useState } from 'react';
import jiraPageConfig from '../data/jiraPageConfig';
import './PageStyles.css';

const gamerProducts = [
  { id: 1, name: 'Auriculares Pro X', price: 129.99, category: 'Audio', platform: 'PC' },
  { id: 2, name: 'Control Elite', price: 149.99, category: 'Accesorios', platform: 'Xbox' },
  { id: 3, name: 'DualSense Edge', price: 199.99, category: 'Accesorios', platform: 'PlayStation' },
  { id: 4, name: 'Teclado Mecánico RGB', price: 89.99, category: 'Periféricos', platform: 'PC' },
  { id: 5, name: 'Mouse Inalámbrico Gamer', price: 59.99, category: 'Periféricos', platform: 'PC' },
  { id: 6, name: 'Steam Gift Card', price: 50.0, category: 'Gift Card', platform: 'PC' },
  { id: 7, name: 'Nintendo eShop Card', price: 35.0, category: 'Gift Card', platform: 'Nintendo' },
  { id: 8, name: 'FIFA Ultimate Edition', price: 89.99, category: 'Juegos', platform: 'PlayStation' },
  { id: 9, name: 'Halo Infinite', price: 69.99, category: 'Juegos', platform: 'Xbox' },
  { id: 10, name: 'Zelda: Tears of the Kingdom', price: 69.99, category: 'Juegos', platform: 'Nintendo' },
];

const filterOptions = {
  categories: ['Todos', 'Audio', 'Accesorios', 'Periféricos', 'Gift Card', 'Juegos'],
  platforms: ['Todas', 'PC', 'PlayStation', 'Xbox', 'Nintendo'],
};

function GamerStoreFromJira() {
  const [filters, setFilters] = useState({ search: '', category: 'Todos', platform: 'Todas' });
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
      'Explora el catálogo gamer, filtra por categoría y plataforma, agrega productos al carrito, simula un checkout y calcula los puntos que ganarías.'
    );
  }, [jiraByCategory]);

  const handleApplyFilters = () => {
    setAppliedFilters(filters);
  };

  const handleResetFilters = () => {
    const baseFilters = { search: '', category: 'Todos', platform: 'Todas' };
    setFilters(baseFilters);
    setAppliedFilters(baseFilters);
  };

  const filteredProducts = useMemo(() => {
    return gamerProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(appliedFilters.search.toLowerCase().trim());
      const matchesCategory =
        appliedFilters.category === 'Todos' || product.category === appliedFilters.category;
      const matchesPlatform =
        appliedFilters.platform === 'Todas' || product.platform === appliedFilters.platform;
      return matchesSearch && matchesCategory && matchesPlatform;
    });
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
      </header>

      <article className="info-card">
        <h2>Historias clave traídas desde Jira</h2>
        <p className="helper-text">
          La página se alimenta de la configuración generada desde el CSV para mantener los textos
          y acciones alineados con el backlog.
        </p>
        <div className="catalog-grid">
          {jiraPageConfig.map((item) => (
            <div key={item.id} className="catalog-card">
              <div>
                <h3>{item.titulo}</h3>
                <p className="meta">
                  ID: {item.id} · Categoría: {item.categoria}
                </p>
                <p className="helper-text">{item.descripcion}</p>
              </div>
              {item.acciones?.length ? (
                <ul className="bullet-list">
                  {item.acciones.map((action) => (
                    <li key={`${item.id}-${action}`}>{action}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </article>

      <div className="card-grid">
        <article className="info-card">
          <h2>{jiraByCategory.catalogo?.titulo || 'Filtros y búsqueda'}</h2>
          <p className="helper-text">
            {jiraByCategory.catalogo?.descripcion ||
              'Explora el catálogo gamer, filtra por categoría y plataforma o busca por nombre.'}
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
        </article>

        <article className="info-card">
          <h2>{jiraByCategory.catalogo?.titulo || 'Catálogo gamer'}</h2>
          <p className="helper-text">
            {jiraByCategory.catalogo?.descripcion || 'Revisa los productos destacados y agrégalos al carrito.'}
          </p>
          <div className="catalog-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="catalog-card">
                <div>
                  <h3>{product.name}</h3>
                  <p className="meta">{product.category}</p>
                  <p className="meta">Plataforma: {product.platform}</p>
                  <p className="price">${product.price.toFixed(2)}</p>
                </div>
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => handleAddToCart(product)}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <p className="helper-text">No hay productos que coincidan con los filtros.</p>
            )}
          </div>
          {renderActions('catalogo')}
        </article>

        <article className="info-card">
          <h2>{jiraByCategory.carrito?.titulo || 'Carrito'}</h2>
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
          <h2>{jiraByCategory.pagos?.titulo || 'Checkout simulado'}</h2>
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
          <h2>Historial de compras y puntos</h2>
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
          <h2>{jiraByCategory.soporte?.titulo || 'Soporte y contacto'}</h2>
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
