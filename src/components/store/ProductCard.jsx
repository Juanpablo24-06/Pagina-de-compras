import { useStore } from '../../context/StoreContext';

function ProductCard({ product }) {
  const { addToCart, favorites } = useStore();
  // const isFav = favorites.includes(product.id); // Could use for a heart icon later

  return (
    <div className="product-card">
      {product.deal && <div className="deal-badge">SPECIAL DEAL</div>}

      <div className="card-img-box">
        <div className="card-emoji">{product.image}</div>
      </div>

      <div className="card-info">
        <div className="card-header">
            <span className="card-category">{product.category}</span>
            <span className="card-rating">★ {product.rating}</span>
        </div>

        <h3 className="card-title">{product.name}</h3>
        <p className="card-desc">{product.tagline}</p>

        <div className="card-actions">
            <div className="card-price">${product.price}</div>
            <button
                className="btn-add"
                disabled={product.stock === 0}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent click if we add modal later
                    addToCart(product);
                }}
            >
                {product.stock > 0 ? 'ADD TO CART' : 'OUT OF STOCK'}
            </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
