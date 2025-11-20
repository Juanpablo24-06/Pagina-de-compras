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
  { id: 7, name: 'RTX 4090 Founder', price: 1599.00, category: 'Hardware', platform: 'PC', rating: 4.9, stock: 5, deal: false, image: '📟', tagline: 'La bestia gráfica' },
  { id: 8, name: 'Monitor 240Hz', price: 299.99, category: 'Hardware', platform: 'PC', rating: 4.3, stock: 12, deal: true, image: '🖥️', tagline: '1ms de respuesta' },
];

const categories = ['Todos', 'Audio', 'Accesorios', 'Periféricos', 'Digital', 'Hardware'];

function GamerStore() {
  // Estados
  const [filters, setFilters] = useState({ search: '', category: 'Todos', maxPrice: 2000 });
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [userXP, setUserXP] = useState(1500); // Gamificación: Puntos de usuario

  // Lógica de Filtros
  const filteredProducts = useMemo(() => {
    return gamerProducts.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesCategory = filters.category === 'Todos' || p.category === filters.category;
      const matchesPrice = p.price <= filters.maxPrice;
      return matchesSearch && matchesCategory && matchesPrice;
    });
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
          <label className="filter-label">Buscar Loot</label>
          <input 
            type="text" 
            className="store-input" 
            placeholder="Ej: Teclado..." 
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
          />
        </div>

        <div className="filter-group">
          <label className="filter-label">Clase (Categoría)</label>
          <select 
            className="store-select"
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
            onChange={(e) => setFilters({...filters, maxPrice: Number(e.target.value)})}
          />
        </div>

        {/* Widget de Usuario (Gamificación) */}
        <div className="cart-summary-panel">
          <h4 style={{color: '#fff', margin: 0}}>Nivel de Jugador</h4>
          <div className="xp-bar-container">
            <div className="xp-bar-fill" style={{width: `${(userXP % 1000) / 10}%`}}></div>
          </div>
          <small style={{color: 'var(--primary-cyan)'}}>{userXP} XP Totales</small>
        </div>
      </aside>

      {/* --- Contenido Principal --- */ }
      <main>
        <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="text-gradient" style={{ fontSize: '2.5rem', margin: 0 }}>Gamer Store</h1>
          <button className="btn-add" onClick={() => setShowCheckout(!showCheckout)}>
            🛒 Inventario <span className="badge-counter">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
          </button>
        </header>

        {showCheckout ? (
          <div className="cart-summary-panel" style={{animation: 'fadeIn 0.3s'}}>
            <h2 style={{color: 'white'}}>Tu Inventario (Carrito)</h2>
            {cart.length === 0 ? (
              <p style={{color: 'var(--text-muted)'}}>Tu inventario está vacío. Ve a buscar loot.</p>
            ) : (
              <>
                <ul style={{listStyle: 'none', padding: 0}}>
                  {cart.map(item => (
                    <li key={item.id} style={{display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '1rem 0', color: 'white'}}>
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
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                {product.deal && <span className="card-badge">-15% OFF</span>}
                <div style={{height: '150px', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem'}}>
                  {product.image}
                </div>
                <div className="card-content">
                  <span className="product-category">{product.category} | {product.platform}</span>
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.tagline}</p>
                  <div className="card-footer">
                    <span className="product-price">${product.price}</span>
                    <button className="btn-add" onClick={() => addToCart(product)}>+ Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default GamerStore;
