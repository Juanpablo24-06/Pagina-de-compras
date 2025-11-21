import { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import ProductDetailsModal from './ProductDetailsModal';
import HeroCarousel from './HeroCarousel';
import './StoreStyles.css';

function StoreLayout() {
  const { products, cartCount, userXP, notifications } = useStore();

  // Local filter state
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    platform: 'All',
    maxPrice: 2000,
    onlyDeals: false,
    onlyAvailable: true
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Derived Data
  const categories = ['All', ...new Set(products.map(p => p.category))];
  const platforms = ['All', ...new Set(products.map(p => p.platform))];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const searchMatch = p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                            p.tags.some(t => t.includes(filters.search.toLowerCase()));
        const catMatch = filters.category === 'All' || p.category === filters.category;
        const platMatch = filters.platform === 'All' || p.platform === filters.platform;
        const priceMatch = p.price <= filters.maxPrice;
        const dealMatch = !filters.onlyDeals || p.deal;
        const stockMatch = !filters.onlyAvailable || p.stock > 0;

        return searchMatch && catMatch && platMatch && priceMatch && dealMatch && stockMatch;
    });
  }, [products, filters]);

  return (
    <div className="nexus-layout">

      {/* Sticky Header */}
      <header className="nexus-header">
        <div className="brand-section">
            <div className="brand-logo">NEXUS // STORE</div>
        </div>

        {/* Quick Search in Header */}
        <div style={{ flex: 1, maxWidth: '500px', margin: '0 2rem' }}>
             <input
                type="text"
                className="search-input"
                placeholder="SEARCH_DATABASE..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
        </div>

        <div className="header-actions">
            <div className="user-xp-display">
                <div className="xp-bar-mini">
                    <div className="xp-fill" style={{width: `${(userXP % 1000) / 10}%`}}></div>
                </div>
                <span>LVL {Math.floor(userXP / 1000)}</span>
            </div>

            <button className="nav-btn">PROFILE</button>
            <button className="nav-btn cart-btn" onClick={() => setIsCartOpen(true)}>
                LOOT BOX [{cartCount}]
            </button>
        </div>
      </header>

      <div className="nexus-container">

        {/* Hero Section */}
        <section className="hero-section">
            <HeroCarousel />
        </section>

        {/* Main Content Grid */}
        <div className="store-grid-layout">
            {/* Left Sidebar */}
            <aside>
                <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    categories={categories}
                    platforms={platforms}
                />
            </aside>

            {/* Product Grid */}
            <main>
                <div className="filter-title">
                    <span>QUERY_RESULTS: {filteredProducts.length} ASSETS FOUND</span>
                    <div style={{height: '1px', flex:1, background: '#222', marginLeft: '1rem'}}></div>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="no-results" style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>
                        <h3>NO MATCHES FOUND</h3>
                        <p>ADJUST SEARCH PARAMETERS OR RESET FILTERS.</p>
                    </div>
                ) : (
                    <div className="product-grid">
                        {filteredProducts.map(p => (
                            <div key={p.id} onClick={() => setSelectedProduct(p)}>
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="nexus-footer">
        <div className="nexus-container footer-content">
            <div className="footer-col">
                <h4>NEXUS STORE</h4>
                <a href="#" className="footer-link">About Us</a>
                <a href="#" className="footer-link">Careers</a>
                <a href="#" className="footer-link">Press</a>
            </div>
            <div className="footer-col">
                <h4>SUPPORT</h4>
                <a href="#" className="footer-link">Help Center</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Privacy Policy</a>
            </div>
            <div className="footer-col">
                <h4>COMMUNITY</h4>
                <a href="#" className="footer-link">Discord Server</a>
                <a href="#" className="footer-link">Twitter</a>
                <a href="#" className="footer-link">Instagram</a>
            </div>
             <div className="footer-col">
                <h4>SECURE PAYMENT</h4>
                <span style={{color: '#666', fontSize: '0.8rem'}}>Encrypted by CyberSec Inc.</span>
            </div>
        </div>
      </footer>

      {/* Overlays */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
        }}
      />

      {isCheckoutOpen && (
        <CheckoutModal onClose={() => setIsCheckoutOpen(false)} />
      )}

      {selectedProduct && (
        <ProductDetailsModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
        />
      )}

      <div className="toast-container" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 3000 }}>
        {notifications.map(n => (
            <div key={n.id} className={`toast-notification ${n.intent}`}>
                {n.intent === 'success' ? '✅' : n.intent === 'warning' ? '⚠️' : 'ℹ️'}
                <span>{n.message}</span>
            </div>
        ))}
      </div>
    </div>
  );
}

export default StoreLayout;
