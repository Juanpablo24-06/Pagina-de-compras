// src/pages/GamerStoreFromJira.jsx
import { useEffect, useMemo, useState } from 'react';
import './PageStyles.css';

// Datos simulados pero enriquecidos
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
    image: '🎧',
    tagline: 'Sonido 7.1 Surround',
    tags: ['streaming', 'esports'],
  },
  {
    id: 2,
    name: 'Control Elite V2',
    price: 149.99,
    category: 'Accesorios',
    platform: 'Xbox',
    rating: 4.8,
    stock: 15,
    deal: false,
    image: '🎮',
    tagline: 'Grips antideslizantes',
    tags: ['competitivo', 'wireless'],
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
    image: '🕹️',
    tagline: 'Triggers hápticos',
    tags: ['nuevo', 'premium'],
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
    image: '⌨️',
    tagline: 'Switches Cherry MX',
    tags: ['rgb', 'oficina'],
  },
  {
    id: 5,
    name: 'Mouse Ultra-Light',
    price: 59.99,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.4,
    stock: 33,
    deal: true,
    image: '🖱️',
    tagline: 'Solo 60g de peso',
    tags: ['fps', 'liviano'],
  },
  {
    id: 6,
    name: 'Steam Gift Card $50',
    price: 50.0,
    category: 'Digital',
    platform: 'PC',
    rating: 5.0,
    stock: 999,
    deal: false,
    image: '💳',
    tagline: 'Entrega inmediata',
    tags: ['gift', 'digital'],
  },
  {
    id: 7,
    name: 'RTX 4090 Founder',
    price: 1599.0,
    category: 'Hardware',
    platform: 'PC',
    rating: 4.9,
    stock: 5,
    deal: false,
    image: '📟',
    tagline: 'La bestia gráfica',
    tags: ['4k', 'rtx'],
  },
  {
    id: 8,
    name: 'Monitor 240Hz',
    price: 299.99,
    category: 'Hardware',
    platform: 'PC',
    rating: 4.3,
    stock: 12,
    deal: true,
    image: '🖥️',
    tagline: '1ms de respuesta',
    tags: ['esports', 'hdr'],
  },
  {
    id: 9,
    name: 'Switch OLED',
    price: 349.99,
    category: 'Consolas',
    platform: 'Nintendo',
    rating: 4.9,
    stock: 9,
    deal: true,
    image: '🎴',
    tagline: 'Pantalla vibrante para portabilidad',
    tags: ['portatil', 'family'],
  },
  {
    id: 10,
    name: 'Silla Ergo Gaming',
    price: 259.99,
    category: 'Mobiliario',
    platform: 'PC',
    rating: 4.2,
    stock: 27,
    deal: false,
    image: '🪑',
    tagline: 'Soporte lumbar certificado',
    tags: ['ergonomia', 'setup'],
  },
];

const categories = ['Todos', 'Audio', 'Accesorios', 'Periféricos', 'Digital', 'Hardware', 'Consolas', 'Mobiliario'];
const platforms = ['Todas', 'PC', 'PlayStation', 'Xbox', 'Nintendo'];

function GamerStore() {
  // Estados
  const [filters, setFilters] = useState({
    search: '',
    category: 'Todos',
    maxPrice: 2000,
    platform: 'Todas',
    onlyDeals: false,
    minRating: 4,
    onlyAvailable: true,
  });
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userXP, setUserXP] = useState(1500); // Gamificación: Puntos de usuario
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('gamer-favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [reviews, setReviews] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('gamer-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    setReviewsLoading(true);
    const controller = new AbortController();
    // Simulación de fetch hacia API de reseñas sin tocar autenticación ni checkout
    const timer = setTimeout(() => {
      if (controller.signal.aborted) return;
      setReviews({
        1: [{ user: 'Ada', comment: 'Audio limpísimo y muy cómodo.', rating: 5 }],
        2: [{ user: 'Leo', comment: 'Construcción premium, vale la pena.', rating: 4 }],
        3: [
          { user: 'Fiona', comment: 'Perfecto para shooters.', rating: 5 },
          { user: 'Mauro', comment: 'Personalización brutal.', rating: 4 },
        ],
        7: [{ user: 'Sofía', comment: 'Rinde 4K sin sudar.', rating: 5 }],
        9: [{ user: 'Kiro', comment: 'Ideal para viajar con Zelda.', rating: 5 }],
      });
      setReviewsLoading(false);
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, []);

  // Lógica de Filtros
  const filteredProducts = useMemo(() => {
    return gamerProducts
      .filter((p) => {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          p.name.toLowerCase().includes(search) ||
          p.tagline.toLowerCase().includes(search) ||
          p.tags.some((tag) => tag.includes(search));
        const matchesCategory = filters.category === 'Todos' || p.category === filters.category;
        const matchesPlatform = filters.platform === 'Todas' || p.platform === filters.platform;
        const matchesPrice = p.price <= filters.maxPrice;
        const matchesDeals = !filters.onlyDeals || p.deal;
        const matchesRating = p.rating >= filters.minRating;
        const matchesAvailability = !filters.onlyAvailable || p.stock > 0;
        return (
          matchesSearch &&
          matchesCategory &&
          matchesPlatform &&
          matchesPrice &&
          matchesDeals &&
          matchesRating &&
          matchesAvailability
        );
      })
      .sort((a, b) => b.rating - a.rating);
  }, [filters]);

  // Lógica del Carrito
  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(item => item.id !== id));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const recommendedProducts = useMemo(() => {
    if (favorites.length === 0 && cart.length === 0) {
      return gamerProducts.filter((p) => p.rating >= 4.7).slice(0, 3);
    }

    const categoriesVisited = [
      ...favorites.map((id) => gamerProducts.find((p) => p.id === id)?.category),
      ...cart.map((item) => gamerProducts.find((p) => p.id === item.id)?.category),
    ].filter(Boolean);

    const topCategory = categoriesVisited[0];

    return gamerProducts
      .filter((p) => p.category === topCategory && !cart.some((item) => item.id === p.id))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [favorites, cart]);

  const resultMessage = filteredProducts.length
    ? `${filteredProducts.length} resultados listos. Filtra por categoría o plataforma para afinar.`
    : 'No encontramos productos con esos criterios. Intenta borrar filtros o usar otra palabra clave.';

  const getReviewsForProduct = (productId) => reviews[productId] || [];

  // Simulación de Checkout
  const handleCheckout = () => {
    alert(`¡Compra exitosa! Has ganado ${Math.floor(cartTotal / 10)} XP`);
    setUserXP(prev => prev + Math.floor(cartTotal / 10));
    setCart([]);
    setShowCheckout(false);
  };

  return (
    <div className="store-container">
      {/* --- Sidebar de Filtros --- */ }
      <aside className="filters-panel">
        <h3 className="filters-title">Configuración</h3>

        <div className="filter-group">
          <label className="filter-label">Buscar loot</label>
          <input
            type="text"
            className="store-input"
            placeholder="Ej: teclado, Xbox, streaming..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
          <p className="hint">Resultados incluyen nombre, descripción y tags.</p>
        </div>

        <div className="filter-group dual-grid">
          <div>
            <label className="filter-label">Clase (Categoría)</label>
            <select
              className="store-select"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div>
            <label className="filter-label">Plataforma</label>
            <select
              className="store-select"
              value={filters.platform}
              onChange={(e) => setFilters({...filters, platform: e.target.value})}
            >
              {platforms.map(plat => <option key={plat} value={plat}>{plat}</option>)}
            </select>
          </div>
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
            onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
          />
        </div>

        <div className="filter-group dual-grid">
          <div>
            <label className="filter-label">Rating mínimo</label>
            <input
              type="range"
              min="3"
              max="5"
              step="0.1"
              className="range-slider"
              value={filters.minRating}
              onChange={(e) => setFilters({...filters, minRating: Number(e.target.value)})}
            />
            <p className="hint">Solo mostramos productos con {filters.minRating.toFixed(1)}⭐ o más.</p>
          </div>
          <div className="pill-group">
            <label className="filter-label">Filtros rápidos</label>
            <button
              type="button"
              className={filters.onlyDeals ? 'pill active' : 'pill'}
              onClick={() => setFilters({...filters, onlyDeals: !filters.onlyDeals})}
            >
              Ofertas activas
            </button>
            <button
              type="button"
              className={filters.onlyAvailable ? 'pill active' : 'pill'}
              onClick={() => setFilters({...filters, onlyAvailable: !filters.onlyAvailable})}
            >
              Solo stock disponible
            </button>
          </div>
        </div>

        <div className="filter-group">
          <p className="eyebrow">Explora por tags</p>
          <div className="tag-chips">
            {['esports', 'premium', 'rgb', 'hdr', 'digital', 'setup'].map((tag) => (
              <button
                key={tag}
                className={filters.search === tag ? 'chip active' : 'chip'}
                onClick={() => setFilters({...filters, search: tag})}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Widget de Usuario (Gamificación) */}
        <div className="cart-summary-panel">
          <h4 style={{color: '#fff', margin: 0}}>Nivel de Jugador</h4>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{width: `${(userXP % 1000) / 10}%`}}></div>
          </div>
          <small style={{color: 'var(--primary-cyan)'}}>{userXP} XP Totales</small>
          <p className="hint">Suma XP con compras y reviews positivas.</p>
        </div>
      </aside>

      {/* --- Contenido Principal --- */ }
      <main>
        <header className="store-hero">
          <div>
            <p className="eyebrow">Catálogo gamer vivo</p>
            <h1 className="page-title">Gamer Store</h1>
            <p className="page-lead">
              Busca por categoría, filtra por plataforma, lee reseñas comunitarias y guarda tus favoritos sin tocar
              los flujos de pago.
            </p>
            <div className="status-bar">
              <span className="status-pill">SEO friendly</span>
              <span className="status-pill">Rendimiento optimizado</span>
              <span className="status-pill">Recomendaciones activas</span>
            </div>
          </div>
          <button className="btn-add" onClick={() => setShowCheckout(!showCheckout)}>
            🛒 Inventario <span className="badge-counter">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
          </button>
        </header>

        <div className="results-banner">
          <div>
            <p className="eyebrow">Resultados</p>
            <strong>{resultMessage}</strong>
          </div>
          <div className="results-meta">
            <span>{favorites.length} favoritos guardados</span>
            <span>{cart.length} ítems en carrito</span>
          </div>
        </div>

        {showCheckout ? (
          <div className="cart-summary-panel" style={{animation: 'fadeIn 0.3s'}}>
            <h2 style={{color: 'white'}}>Tu Inventario (Carrito)</h2>
            {cart.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>Tu inventario está vacío. Ve a buscar loot.</p>
            ) : (
              <>
                <ul style={{listStyle: 'none', padding: 0}}>
                  {cart.map(item => (
                    <li key={item.id} style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(195,255,255,0.1)', padding: '1rem 0', color: 'white'}}>
                      <span>{item.qty}x {item.name}</span>
                      <div>
                        <span style={{marginRight: '1rem'}}>${(item.price * item.qty).toFixed(2)}</span>
                        <button onClick={() => removeFromCart(item.id)} style={{background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer'}}>✕</button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--primary-cyan)', fontSize: '1.2rem', fontWeight: 'bold'}}>
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn-primary" onClick={handleCheckout}>Confirmar Adquisición</button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="products-grid">
              {filteredProducts.map(product => (
                <div key={product.id} className="product-card">
                  {product.deal && <span className="card-badge">-15% OFF</span>}
                  <div className="product-media">
                    <span className="media-emoji" aria-hidden>{product.image}</span>
                    <button
                      className={favorites.includes(product.id) ? 'favorite active' : 'favorite'}
                      onClick={() => toggleFavorite(product.id)}
                      aria-label="Guardar en favoritos"
                    >
                      {favorites.includes(product.id) ? '★' : '☆'}
                    </button>
                  </div>
                  <div className="card-content">
                    <span className="product-category">{product.category} | {product.platform}</span>
                    <h3 className="product-title">{product.name}</h3>
                    <p className="product-description">{product.tagline}</p>
                    <div className="rating-row">
                      <span className="rating-pill">{product.rating} ⭐</span>
                      <span className="stock-pill">{product.stock} en stock</span>
                    </div>
                    <div className="tags-row">
                      {product.tags.map((tag) => (
                        <span key={tag} className="chip">#{tag}</span>
                      ))}
                    </div>
                    <div className="card-footer">
                      <span className="product-price">${product.price}</span>
                      <div className="actions">
                        <button className="btn-add" onClick={() => addToCart(product)}>+ Agregar</button>
                      </div>
                    </div>
                    <div className="reviews-block">
                      {reviewsLoading ? (
                        <p className="hint">Cargando reseñas...</p>
                      ) : getReviewsForProduct(product.id).length ? (
                        <>
                          <p className="hint">Último comentario: "{getReviewsForProduct(product.id)[0].comment}"</p>
                          <small className="eyebrow">{getReviewsForProduct(product.id).length} reseñas verificadas vía API</small>
                        </>
                      ) : (
                        <p className="hint">Sé el primero en dejar feedback.</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <section className="recommendations">
              <header className="section-header">
                <div>
                  <p className="eyebrow">Recomendado para ti</p>
                  <h2 className="page-title">Sugerencias basadas en interacciones</h2>
                  <p className="page-lead">Priorizamos categorías marcadas en favoritos y en tu carrito.</p>
                </div>
              </header>
              <div className="mini-grid">
                {recommendedProducts.map((product) => (
                  <article key={product.id} className="mini-card">
                    <div className="mini-top">
                      <span className="media-emoji" aria-hidden>{product.image}</span>
                      <span className="chip">{product.category}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.tagline}</p>
                    <div className="rating-row">
                      <span className="rating-pill">{product.rating} ⭐</span>
                      <span className="stock-pill">Stock: {product.stock}</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default GamerStore;
