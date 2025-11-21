import { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import CartDrawer from './CartDrawer';
import CheckoutModal from './CheckoutModal';
import './StoreStyles.css'; // We will create this next

function StoreLayout() {
  const { products, cartCount, userXP, notifications, pushNotification } = useStore();

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
    <div className="store-layout">
      <div className="store-background-grid"></div>

      {/* Header Overlay */}
      <header className="store-topbar">
        <div className="user-status">
            <span className="xp-badge">LVL {Math.floor(userXP / 1000)} • {userXP} XP</span>
        </div>
        <button className="cart-trigger" onClick={() => setIsCartOpen(true)}>
            INVENTORY [{cartCount}]
        </button>
      </header>

      <div className="store-main-container">
        <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            platforms={platforms}
        />

        <main className="product-grid-area">
            <div className="results-header">
                <h2>CATALOG_VIEW // {filteredProducts.length} ITEMS</h2>
                <div className="scan-line horizontal"></div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="no-results">
                    <h3>NO MATCHES FOUND</h3>
                    <p>Adjust search parameters.</p>
                </div>
            ) : (
                <div className="products-grid-v2">
                    {filteredProducts.map(p => (
                        <ProductCard key={p.id} product={p} />
                    ))}
                </div>
            )}
        </main>
      </div>

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

      <div className="toast-container">
        {notifications.map(n => (
            <div key={n.id} className={`cyber-toast ${n.intent}`}>
                {n.message}
            </div>
        ))}
      </div>
    </div>
  );
}

export default StoreLayout;
