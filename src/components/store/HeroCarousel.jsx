import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

function HeroCarousel() {
  const { products, addToCart } = useStore();

  // Select high-tier items for the carousel
  const featuredProducts = products
    .filter(p => p.price > 300 || p.rating === 5.0)
    .slice(0, 4);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  const currentProduct = featuredProducts[currentIndex];

  if (!currentProduct) return null;

  // Dynamic background style based on product color
  const slideStyle = {
    background: `radial-gradient(circle at 70% 50%, ${currentProduct.color}22 0%, #000 70%)`
  };

  return (
    <div className="hero-carousel">
      <div className="hero-slide" style={slideStyle}>

        <div className="hero-content">
            <div className="hero-badge">
                LIMITED TIME OFFER // -15% OFF
            </div>

            <h1 className="hero-title">{currentProduct.name}</h1>
            <p className="hero-subtitle">{currentProduct.tagline}</p>

            <div className="tech-specs" style={{marginBottom: '2rem', display: 'flex', gap: '1rem'}}>
                <span style={{fontFamily: 'var(--font-mono)', color: 'var(--text-muted)'}}>
                    CLASS: <span style={{color: '#fff'}}>{currentProduct.category.toUpperCase()}</span>
                </span>
                <span style={{fontFamily: 'var(--font-mono)', color: 'var(--text-muted)'}}>
                     RATING: <span style={{color: 'var(--accent-warning)'}}>★ {currentProduct.rating}</span>
                </span>
            </div>

            <div className="hero-price-box">
                <div className="hero-price">
                    <span style={{fontSize: '1.5rem', verticalAlign: 'top', marginRight: '5px'}}>$</span>
                    {currentProduct.price}
                </div>
                <button
                    className="btn-primary"
                    onClick={() => addToCart(currentProduct)}
                >
                    ACQUIRE ASSET
                </button>
            </div>
        </div>

        <div className="hero-visual">
            <div className="hero-emoji">
                {currentProduct.image}
            </div>
        </div>
      </div>

      {/* Indicators */}
      <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '4rem',
          display: 'flex',
          gap: '10px',
          zIndex: 10
        }}>
        {featuredProducts.map((_, idx) => (
            <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                    width: idx === currentIndex ? '30px' : '10px',
                    height: '4px',
                    background: idx === currentIndex ? 'var(--accent-primary)' : '#444',
                    border: 'none',
                    borderRadius: '2px',
                    transition: 'all 0.3s'
                }}
            />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;
