import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './PageStyles.css';

function HomePage() {
  const { products } = useStore();

  // "Best Sellers" / "Offers"
  const deals = useMemo(() => products.filter(p => p.deal).slice(0, 5), [products]);
  const bestSellers = useMemo(() => products.sort((a,b) => b.rating - a.rating).slice(0, 5), [products]);

  return (
    <section className="ml-home-page">

      {/* --- HERO BANNER --- */}
      <div className="ml-hero-banner">
         <div className="ml-banner-content">
             <h1>CYBER WEEK DEALS</h1>
             <p>HASTA 40% OFF EN PERIFÉRICOS</p>
             <NavLink to="/gamer-store" className="ml-banner-btn">VER OFERTAS</NavLink>
         </div>
      </div>

      {/* --- PAYMENT STRIP --- */}
      <div className="ml-payment-strip">
          <div className="container strip-content">
              <div className="strip-item">
                  <span className="strip-icon">💳</span>
                  <div>
                      <strong>Tarjeta de crédito</strong>
                      <span className="strip-sub">Ver promociones bancarias</span>
                  </div>
              </div>
              <div className="strip-item">
                  <span className="strip-icon">💵</span>
                  <div>
                      <strong>Efectivo</strong>
                      <span className="strip-sub">Ver puntos de pago</span>
                  </div>
              </div>
              <div className="strip-item">
                  <span className="strip-icon">🚚</span>
                  <div>
                      <strong>Envío Gratis</strong>
                      <span className="strip-sub">En productos desde $299</span>
                  </div>
              </div>
               <div className="strip-item">
                  <span className="strip-icon">➕</span>
                  <div className="strip-action">Más medios de pago</div>
              </div>
          </div>
      </div>

      {/* --- CAROUSELS --- */}
      <div className="container ml-home-content">

          {/* Section 1: Deals */}
          <section className="ml-carousel-section">
              <div className="section-header">
                  <h2>Ofertas del día</h2>
                  <NavLink to="/gamer-store" className="view-all">Ver todas</NavLink>
              </div>
              <div className="ml-carousel-track">
                  {deals.map(product => (
                      <NavLink to="/gamer-store" key={product.id} className="ml-product-card-mini">
                          <div className="card-img-wrap">
                              <img src={product.image} alt={product.name} loading="lazy" />
                          </div>
                          <div className="card-info">
                              <span className="price">${product.price}</span>
                              {product.originalPrice && <span className="discount">{Math.round((1 - product.price/product.originalPrice)*100)}% OFF</span>}
                              {product.shipping?.free && <span className="shipping">Envío gratis ⚡</span>}
                          </div>
                      </NavLink>
                  ))}
              </div>
          </section>

          {/* Section 2: Best Sellers */}
           <section className="ml-carousel-section">
              <div className="section-header">
                  <h2>Lo más vendido en Gaming</h2>
                  <NavLink to="/gamer-store" className="view-all">Ver historial</NavLink>
              </div>
              <div className="ml-carousel-track">
                  {bestSellers.map(product => (
                      <NavLink to="/gamer-store" key={product.id} className="ml-product-card-mini">
                          <div className="card-img-wrap">
                              <img src={product.image} alt={product.name} loading="lazy" />
                          </div>
                          <div className="card-info">
                              <span className="price">${product.price}</span>
                              <p className="title">{product.name}</p>
                          </div>
                      </NavLink>
                  ))}
              </div>
          </section>

          {/* Banner Secondary */}
          <section className="ml-secondary-banners">
              <div className="secondary-banner b1">
                  <h3>COMPUTACIÓN</h3>
                  <p>HASTA 12X SIN INTERÉS</p>
                  <button>Ver más</button>
              </div>
              <div className="secondary-banner b2">
                  <h3>CONSOLAS</h3>
                  <p>LO ÚLTIMO EN NEXT-GEN</p>
                  <button>Ver más</button>
              </div>
          </section>

      </div>
    </section>
  );
}

export default HomePage;
