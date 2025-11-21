function FilterSidebar({ filters, setFilters, categories, platforms }) {
    return (
      <div className="filter-panel">

        {/* Categories */}
        <div className="filter-group">
            <div className="filter-title">
                <span>CATEGORY</span>
            </div>
            <div className="category-list">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={`cat-btn ${filters.category === cat ? 'active' : ''}`}
                        onClick={() => setFilters({ ...filters, category: cat })}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>
        </div>

        {/* Platform */}
        <div className="filter-group">
            <div className="filter-title">
                <span>PLATFORM</span>
            </div>
            <select
                style={{
                    width: '100%',
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #333',
                    padding: '0.8rem',
                    borderRadius: '4px'
                }}
                value={filters.platform}
                onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>

        {/* Price Range */}
        <div className="filter-group">
            <div className="filter-title">
                <span>MAX PRICE</span>
                <span style={{color: 'var(--accent-primary)'}}>${filters.maxPrice}</span>
            </div>
            <input
                type="range"
                min="0"
                max="2000"
                step="50"
                style={{width: '100%', accentColor: 'var(--accent-primary)'}}
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            />
        </div>

        {/* Toggles */}
        <div className="filter-group">
            <div className="filter-title">
                <span>OPTIONS</span>
            </div>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', cursor: 'pointer', color: '#ccc', fontSize: '0.9rem'}}>
                <input
                    type="checkbox"
                    checked={filters.onlyDeals}
                    onChange={(e) => setFilters({...filters, onlyDeals: e.target.checked})}
                    style={{accentColor: 'var(--accent-primary)'}}
                />
                SHOW DEALS ONLY
            </label>
            <label style={{display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: '#ccc', fontSize: '0.9rem'}}>
                <input
                    type="checkbox"
                    checked={filters.onlyAvailable}
                    onChange={(e) => setFilters({...filters, onlyAvailable: e.target.checked})}
                    style={{accentColor: 'var(--accent-primary)'}}
                />
                IN STOCK ONLY
            </label>
        </div>

      </div>
    );
  }

  export default FilterSidebar;
