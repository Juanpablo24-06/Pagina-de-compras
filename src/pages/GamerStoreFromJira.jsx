// src/pages/GamerStoreFromJira.jsx
import { useMemo, useState } from 'react';
import './PageStyles.css';

// Datos simulados pero enriquecidos
const gamerProducts = [
  { id: 1, name: 'Auriculares Pro X', price: 129.99, category: 'Audio', platform: 'PC', rating: 4.7, stock: 24, deal: true, image: '🎧', tagline: 'Sonido 7.1 Surround' },
  { id: 2, name: 'Control Elite V2', price: 149.99, category: 'Accesorios', platform: 'Xbox', rating: 4.8, stock: 15, deal: false, image: '🎮', tagline: 'Grips antideslizantes' },
  { id: 3, name: 'DualSense Edge', price: 199.99, category: 'Accesorios', platform: 'PlayStation', rating: 4.6, stock: 19, deal: true, image: '🕹️', tagline: 'Triggers hápticos' },
  { id: 4, name: 'Teclado Mecánico RGB', price: 89.99, category: 'Periféricos', platform: 'PC', rating: 4.5, stock: 41, deal: false, image: '⌨️', tagline: 'Switches Cherry MX' },
  { id: 5, name: 'Mouse Ultra-Light', price: 59.99, category: 'Periféricos', platform: 'PC', rating: 4.4, stock: 33, deal: true, image: '🖱️', tagline: 'Solo 60g de peso' },
  { id: 6, name: 'Steam Gift Card $50', price: 50.0, category: 'Digital', platform: 'PC', rating: 5.0, stock: 999, deal: false, image: '💳', tagline: 'Entrega inmediata' },
  { id: 7, name: 'RTX 4090 Founder', price: 1599.0, category: 'Hardware', platform: 'PC', rating: 4.9, stock: 5, deal: false, image: '📟', tagline: 'La bestia gráfica' },
  { id: 8, name: 'Monitor 240Hz', price: 299.99, category: 'Hardware', platform: 'PC', rating: 4.3, stock: 12, deal: true, image: '🖥️', tagline: '1ms de respuesta' },
];

const categories = ['Todos', 'Audio', 'Accesorios', 'Periféricos', 'Digital', 'Hardware'];

function GamerStore() {
  // Estados
  const [filters, setFilters] = useState({ search: '', category: 'Todos', maxPrice: 2000 });
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userXP, setUserXP] = useState(1500); // Gamificación: Puntos de usuario
  const [checkoutData, setCheckoutData] = useState({ email: '', address: '', paymentStatus: 'pending' });
  const [formErrors, setFormErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState('borrador');
  const [notifications, setNotifications] = useState([]);

  // Lógica de Filtros
  const filteredProducts = useMemo(() => {
    return gamerProducts.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'Todos' || p.category === filters.category;
      const matchesPrice = p.price <= filters.maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [filters]);

  // Lógica del Carrito
  const pushNotification = (message, intent = 'info') => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, intent }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const addToCart = (product, goToCheckout = false) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists && exists.qty >= product.stock) {
        pushNotification(`Stock agotado para ${product.name}`, 'warning');
        return prev;
      }

      const updatedCart = exists
        ? prev.map((item) =>
            item.id === product.id
              ? { ...item, qty: Math.min(item.qty + 1, product.stock) }
              : item
          )
        : [...prev, { ...product, qty: 1 }];

      pushNotification(`${product.name} añadido al carrito`, 'success');
      if (goToCheckout) {
        setShowCheckout(true);
        setCurrentStep(1);
      }

      return updatedCart;
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((item) => item.id !== id));
  const handleQuantityChange = (id, value) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const safeQty = Math.min(Math.max(Number(value) || 1, 1), item.stock);
        return { ...item, qty: safeQty };
      })
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const loyaltyPointsEarned = Math.max(10, Math.floor(cartTotal / 8));

  const proceedToCheckout = () => {
    if (cart.length === 0) {
      pushNotification('Agrega productos antes de avanzar al checkout', 'warning');
      return;
    }
    setShowCheckout(true);
    setCurrentStep(1);
  };

  const validateStepTwo = () => {
    const errors = {};
    if (!checkoutData.email.includes('@')) errors.email = 'Ingresa un correo válido para notificaciones.';
    if (checkoutData.address.trim().length < 6) errors.address = 'Completa una dirección de entrega.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Simulación de Checkout
  const handleCheckout = () => {
    if (!validateStepTwo()) {
      setCurrentStep(2);
      return;
    }

    setCheckoutData((prev) => ({ ...prev, paymentStatus: 'processing' }));
    setOrderStatus('pagando');
    pushNotification('Redirigiendo a Mercado Pago...', 'info');

    setTimeout(() => {
      setCheckoutData((prev) => ({ ...prev, paymentStatus: 'approved' }));
      setOrderStatus('pagado');
      setUserXP((prev) => prev + loyaltyPointsEarned);
      pushNotification(`Pago aprobado. ${loyaltyPointsEarned} puntos añadidos a tu perfil.`, 'success');
      setCart([]);
      setShowCheckout(false);
      setCurrentStep(1);
    }, 1400);
  };

  return (
    <div className="store-container">
      {/* --- Sidebar de Filtros --- */}
      <aside className="filters-panel">
        <h3 className="filters-title">Configuración</h3>

        <div className="filter-group">
          <label className="filter-label">Buscar Loot</label>
          <input
            type="text"
            className="store-input"
            placeholder="Ej: Teclado..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Clase (Categoría)</label>
          <select
            className="store-select"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Presupuesto Máximo: ${filters.maxPrice}</label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            className="range-slider"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />
        </div>

        {/* Widget de Usuario (Gamificación) */}
        <div className="cart-summary-panel">
          <h4 style={{ color: '#fff', margin: 0 }}>Nivel de Jugador</h4>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{ width: `${(userXP % 1000) / 10}%` }}></div>
          </div>
          <small style={{ color: 'var(--primary-cyan)' }}>{userXP} XP Totales</small>
        </div>
      </aside>

      {/* --- Contenido Principal --- */}
      <main>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>
              Gamer Store
            </h1>
            <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
              Carrito validado con stock y checkout guiado.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn-add" onClick={() => setShowCheckout(!showCheckout)}>
              🛒 Inventario <span className="badge-counter">{cartItemsCount}</span>
            </button>
            <button className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.25rem' }} onClick={proceedToCheckout}>
              Ir a checkout seguro
            </button>
          </div>
        </header>

        {showCheckout ? (
          <div className="cart-summary-panel" style={{ animation: 'fadeIn 0.3s' }}>
            <div className="checkout-head">
              <div>
                <p className="eyebrow" style={{ margin: 0 }}>
                  Checkout
                </p>
                <h2 style={{ color: 'white', margin: '4px 0' }}>Flujo con validaciones y puntos</h2>
              </div>
              <span className={`status-pill status-${orderStatus}`}>
                {orderStatus === 'borrador' && 'Borrador'}
                {orderStatus === 'pagando' && 'En pago'}
                {orderStatus === 'pagado' && 'Pagado'}
              </span>
            </div>

            <div className="checkout-steps">
              {[1, 2, 3].map((step) => (
                <div key={step} className={`step ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'done' : ''}`}>
                  <span className="step-number">{step}</span>
                  <div>
                    <strong>
                      {step === 1 ? 'Revisar carrito' : step === 2 ? 'Datos de envío' : 'Pago Mercado Pago'}
                    </strong>
                    <p>
                      {step === 1
                        ? 'Valida stock y cantidades'
                        : step === 2
                        ? 'Contacto y dirección'
                        : 'Sincroniza estado de pago'}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {currentStep === 1 && (
              <div className="step-content">
                <h3>Inventario validado</h3>
                {cart.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)' }}>Tu inventario está vacío. Agrega artículos para continuar.</p>
                ) : (
                  <table className="cart-table">
                    <thead>
                      <tr>
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Cantidad</th>
                        <th>Subtotal</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <strong>{item.name}</strong>
                            <p className="muted">{item.tagline}</p>
                          </td>
                          <td>
                            <span className="pill info">{item.stock} uds</span>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              max={item.stock}
                              value={item.qty}
                              onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                              className="qty-input"
                            />
                            {item.qty >= item.stock && (
                              <p className="muted" style={{ color: '#f59e0b' }}>
                                Máximo stock alcanzado
                              </p>
                            )}
                          </td>
                          <td>${(item.price * item.qty).toFixed(2)}</td>
                          <td>
                            <button onClick={() => removeFromCart(item.id)} className="link-danger">
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div className="checkout-actions">
                  <div>
                    <p className="muted">Total del pedido</p>
                    <h3 style={{ margin: 0 }}>${cartTotal.toFixed(2)}</h3>
                  </div>
                  <button className="btn-primary" disabled={cart.length === 0} onClick={() => setCurrentStep(2)}>
                    Continuar a datos
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="step-content">
                <h3>Datos de contacto y entrega</h3>
                <div className="form-grid">
                  <label>
                    Correo para notificaciones
                    <input
                      type="email"
                      className={`store-input ${formErrors.email ? 'input-error' : ''}`}
                      placeholder="nombre@correo.com"
                      value={checkoutData.email}
                      onChange={(e) => setCheckoutData({ ...checkoutData, email: e.target.value })}
                    />
                    {formErrors.email && <span className="form-error">{formErrors.email}</span>}
                  </label>
                  <label>
                    Dirección de entrega
                    <input
                      type="text"
                      className={`store-input ${formErrors.address ? 'input-error' : ''}`}
                      placeholder="Calle 123, Ciudad"
                      value={checkoutData.address}
                      onChange={(e) => setCheckoutData({ ...checkoutData, address: e.target.value })}
                    />
                    {formErrors.address && <span className="form-error">{formErrors.address}</span>}
                  </label>
                </div>
                <div className="checkout-actions">
                  <button className="btn-add" onClick={() => setCurrentStep(1)}>
                    Volver al carrito
                  </button>
                  <button className="btn-primary" onClick={() => setCurrentStep(3)} disabled={!validateStepTwo()}>
                    Ir a pasarela
                  </button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="step-content">
                <h3>Mercado Pago y sincronización de estado</h3>
                <div className="payment-box">
                  <p className="muted">Método</p>
                  <div className="payment-row">
                    <div>
                      <strong>Mercado Pago</strong>
                      <p className="muted">Pago seguro con status en tiempo real.</p>
                    </div>
                    <span className={`status-pill status-${checkoutData.paymentStatus}`}>
                      {checkoutData.paymentStatus === 'pending' && 'Pendiente'}
                      {checkoutData.paymentStatus === 'processing' && 'Procesando'}
                      {checkoutData.paymentStatus === 'approved' && 'Aprobado'}
                    </span>
                  </div>
                  <div className="summary-row">
                    <div>
                      <p className="muted">Total</p>
                      <h3 style={{ margin: 0 }}>${cartTotal.toFixed(2)}</h3>
                    </div>
                    <div>
                      <p className="muted">Puntos a ganar</p>
                      <strong className="text-gradient">{loyaltyPointsEarned} XP</strong>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={handleCheckout}
                    disabled={checkoutData.paymentStatus === 'processing'}
                  >
                    Pagar con Mercado Pago
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {product.deal && <span className="card-badge">-15% OFF</span>}
                <div
                  style={{
                    height: '150px',
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '4rem',
                  }}
                >
                  {product.image}
                </div>
                <div className="card-content">
                  <span className="product-category">
                    {product.category} | {product.platform}
                  </span>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.tagline}</p>
                  <div className="card-footer">
                    <span className="product-price">${product.price}</span>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn-add" onClick={() => addToCart(product)} disabled={product.stock === 0}>
                        + Agregar
                      </button>
                      <button
                        className="btn-add"
                        style={{ borderColor: 'var(--primary-magenta)', color: 'var(--primary-magenta)' }}
                        onClick={() => addToCart(product, true)}
                      >
                        Comprar ahora
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="toast-stack">
          {notifications.map((note) => (
            <div key={note.id} className={`toast toast-${note.intent}`}>
              {note.message}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default GamerStore;
