import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import ProductCard from './ProductCard';
import './StoreStyles.css';

function StoreLayout() {
  const { products } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Handle Search Param from Header
  const searchTerm = searchParams.get('search') || '';

  // Derived Data
  const categories = ['All', ...new Set(products.map(p => p.category))];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.tags.some(t => t.includes(searchTerm.toLowerCase()));

        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

        const min = priceRange.min ? parseFloat(priceRange.min) : 0;
        const max = priceRange.max ? parseFloat(priceRange.max) : Infinity;
        const matchesPrice = p.price >= min && p.price <= max;

        return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, searchTerm, selectedCategory, priceRange]);

  return (
    <div className="ml-store-layout container">

        {/* --- SIDEBAR FILTERS --- */}
        <aside className="ml-sidebar">
            <div className="filter-group">
                <h3 className="filter-title">Categorías</h3>
                <ul className="filter-list">
                    {categories.map(cat => (
                        <li key={cat}>
                            <button
                                className={`filter-link ${selectedCategory === cat ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat} <span className="count">({products.filter(p => cat === 'All' || p.category === cat).length})</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="filter-group">
                <h3 className="filter-title">Precio</h3>
                <div className="price-inputs">
                    <input
                        type="number"
                        placeholder="Mínimo"
                        value={priceRange.min}
                        onChange={e => setPriceRange({...priceRange, min: e.target.value})}
                    />
                    <span>-</span>
                    <input
                        type="number"
                        placeholder="Máximo"
                        value={priceRange.max}
                        onChange={e => setPriceRange({...priceRange, max: e.target.value})}
                    />
                </div>
            </div>

            <div className="filter-group">
                <h3 className="filter-title">Envío</h3>
                <ul className="filter-list">
                    <li><button className="filter-link text-success">⚡ Full</button></li>
                    <li><button className="filter-link text-success">Envío gratis</button></li>
                </ul>
            </div>
        </aside>

        {/* --- PRODUCT GRID --- */}
        <main className="ml-search-results">
            <div className="results-header">
                <h1 className="search-title">
                    {searchTerm ? `Resultados para "${searchTerm}"` : 'Todos los productos'}
                </h1>
                <span className="results-count">{filteredProducts.length} resultados</span>
            </div>

            <div className="ml-products-grid">
                {filteredProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="no-results">
                    <h3>No encontramos publicaciones.</h3>
                    <p>Revisa que la palabra esté bien escrita o intenta con términos más generales.</p>
                </div>
            )}
        </main>
    </div>
  );
}

export default StoreLayout;
