import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useMemo, useState } from 'react';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, addToCart, isLoading } = useStore();
  const [mainImage, setMainImage] = useState(null);

  const product = useMemo(() => products.find(p => p.id === id), [products, id]);

  // Related products (same category, exclude current)
  const related = useMemo(() => {
      if (!product) return [];
      return products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);

  if (isLoading) return <div className="loading-screen">Cargando sistema...</div>;

  if (!product) {
    return (
        <div className="not-found-container">
            <h2>Producto no encontrado</h2>
            <button onClick={() => navigate('/gamer-store')}>Volver a la tienda</button>
        </div>
    );
  }

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <div className="ml-detail-page container">
      <div className="ml-detail-grid">

          {/* Left Column: Images */}
          <div className="detail-gallery">
              <div className="gallery-thumbnails">
                  {/* Mock Thumbnails (using same image for demo) */}
                  {[1,2,3].map(i => (
                      <div key={i} className="thumb" onMouseEnter={() => setMainImage(product.image)}>
                          <img src={product.image} alt="" />
                      </div>
                  ))}
              </div>
              <div className="gallery-main">
                  <img src={mainImage || product.image} alt={product.name} />
              </div>
          </div>

          {/* Middle/Right Column: Info & Buy Box */}
          <div className="detail-info">
              <div className="condition-subtitle">
                  Nuevo | {product.stock > 0 ? 'Disponible' : 'Agotado'} | {product.stock} vendidos
              </div>

              <h1 className="detail-title">{product.name}</h1>

              <div className="detail-rating">
                  ★★★★★ <span>({product.rating})</span>
              </div>

              {product.deal && <div className="deal-badge">OFERTA DEL DÍA</div>}

              <div className="price-block">
                  {product.originalPrice && (
                      <span className="original-price">${product.originalPrice}</span>
                  )}
                  <div className="current-price-row">
                      <span className="current-price">${product.price}</span>
                      {discountPercentage > 0 && <span className="discount-tag">{discountPercentage}% OFF</span>}
                  </div>
              </div>

              <div className="installments-info">
                  en <span>{product.installments}x ${(product.price / product.installments).toFixed(2)}</span> sin interés
              </div>

              {product.shipping?.free && (
                   <div className="shipping-info text-success">
                       <span className="icon">🚚</span> Envío gratis a todo el país
                   </div>
              )}

              {/* Specs Summary */}
              <div className="specs-preview">
                  {Object.entries(product.specs).slice(0, 3).map(([key, val]) => (
                      <div key={key} className="spec-pill">
                          <strong>{key}:</strong> {val}
                      </div>
                  ))}
              </div>

              {/* Actions */}
              <div className="buy-box">
                  {product.stock > 0 ? (
                      <>
                        <button className="btn-buy-now" onClick={() => {
                            addToCart(product);
                            navigate('/gamer-store'); // Mock "Buy Now" flow
                        }}>
                            Comprar ahora
                        </button>
                        <button className="btn-add-cart" onClick={() => addToCart(product)}>
                            Agregar al carrito
                        </button>
                      </>
                  ) : (
                      <button className="btn-disabled" disabled>Sin Stock</button>
                  )}
              </div>

              <div className="benefits-list">
                  <p>🛡️ <strong>Compra Protegida</strong>, recibe el producto que esperabas o te devolvemos tu dinero.</p>
                  <p>🏆 <strong>Mercado Puntos</strong>. Sumas puntos con esta compra.</p>
                  <p>📅 <strong>12 meses de garantía</strong> de fábrica.</p>
              </div>
          </div>
      </div>

      {/* Description Section */}
      <div className="detail-description-section">
          <h3>Descripción</h3>
          <p className="description-text">{product.description}</p>
          <p className="tagline">"{product.tagline}"</p>

          <h4>Características técnicas</h4>
          <ul className="specs-list">
              {Object.entries(product.specs).map(([key, val]) => (
                  <li key={key}>
                      <span>{key}</span>
                      <strong>{val}</strong>
                  </li>
              ))}
          </ul>
      </div>
    </div>
  );
}

export default ProductDetailPage;
