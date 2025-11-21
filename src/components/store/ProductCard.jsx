import { useStore } from '../../context/StoreContext';

function ProductCard({ product }) {
  const { addToCart, toggleFavorite, favorites } = useStore();
  const isFav = favorites.includes(product.id);

  return (
    <div className="cyber-card" style={{ '--card-color': product.color || 'var(--primary-cyan)' }}>
      {product.deal && <div className="cyber-badge">DEAL -15%</div>}

      <div className="card-image-container">
        <span className="card-emoji" role="img" aria-label={product.name}>{product.image}</span>
        <div className="card-overlay">
          <button
            className={`fav-btn ${isFav ? 'active' : ''}`}
            onClick={() => toggleFavorite(product.id)}
          >
            {isFav ? '★' : '☆'}
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="card-meta">
          <span className="category-pill">{product.category}</span>
          <span className="rating">★ {product.rating}</span>
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-tagline">{product.tagline}</p>

        {/* Tech Specs Mini-Display */}
        <div className="tech-specs">
            {product.tags.slice(0,2).map(tag => (
                <span key={tag} className="tech-tag">#{tag}</span>
            ))}
        </div>

        <div className="card-footer">
          <div className="price-block">
            <span className="price-label">CREDITS</span>
            <span className="price-value">${product.price}</span>
          </div>
          <button
            className="cyber-button small"
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
          >
            {product.stock > 0 ? 'ADD +' : 'OUT OF STOCK'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
