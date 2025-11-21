import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useStore();

  const discountPercentage = useMemo(() => {
    if (!product.originalPrice) return 0;
    return Math.round((1 - product.price / product.originalPrice) * 100);
  }, [product.price, product.originalPrice]);

  return (
    /* Usamos NavLink para envolver la tarjeta completa */
    <NavLink to={`/product/${product.id}`} className="ml-card-link">
        <div className="ml-card">
        <div className="ml-card-image">
            <img src={product.image} alt={product.name} loading="lazy" />
            {product.shipping?.full && <span className="badge-full">⚡ FULL</span>}
        </div>

        <div className="ml-card-content">
            <h3 className="ml-card-title">{product.name}</h3>

            <div className="ml-card-price-block">
                {product.originalPrice && (
                    <span className="ml-card-original-price">${product.originalPrice}</span>
                )}
                <div className="price-row">
                    <span className="ml-card-price">${product.price}</span>
                    {discountPercentage > 0 && <span className="ml-card-discount">{discountPercentage}% OFF</span>}
                </div>
            </div>

            <div className="ml-card-installments">
                12x ${Math.round(product.price / 12)} sin interés
            </div>

            {product.shipping?.free && (
                <div className="ml-card-shipping">Envío gratis</div>
            )}

            <div className="ml-card-actions">
                <button
                    className="ml-card-btn-cart"
                    onClick={(e) => {
                        /* Vital: Prevenimos la navegación del NavLink padre */
                        e.preventDefault(); 
                        addToCart(product);
                    }}
                >
                    Agregar
                </button>
            </div>
        </div>
        </div>
    </NavLink>
  );
}

export default ProductCard;