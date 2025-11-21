function FilterSidebar({ filters, setFilters, categories, platforms }) {
    return (
      <aside className="cyber-sidebar">
        <div className="sidebar-header">
          <h3>SYSTEM FILTERS</h3>
          <div className="scan-line"></div>
        </div>

        <div className="filter-section">
          <label className="cyber-label">SEARCH_QUERY</label>
          <input
            type="text"
            className="cyber-input"
            placeholder="Input keyword..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <div className="filter-section">
          <label className="cyber-label">CLASS_TYPE</label>
          <div className="radio-group">
            {categories.map((cat) => (
              <label key={cat} className={`radio-chip ${filters.category === cat ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="category"
                  value={cat}
                  checked={filters.category === cat}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                />
                {cat}
              </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
            <label className="cyber-label">PLATFORM_TARGET</label>
            <select
                className="cyber-select"
                value={filters.platform}
                onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
            >
                {platforms.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
        </div>

        <div className="filter-section">
          <label className="cyber-label">CREDIT_LIMIT: ${filters.maxPrice}</label>
          <input
            type="range"
            min="0"
            max="2000"
            step="50"
            className="cyber-range"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          />
        </div>

        <div className="filter-section checkbox-row">
            <label className="cyber-checkbox">
                <input
                    type="checkbox"
                    checked={filters.onlyDeals}
                    onChange={(e) => setFilters({...filters, onlyDeals: e.target.checked})}
                />
                <span className="checkmark"></span>
                DEAL_MODE
            </label>
            <label className="cyber-checkbox">
                <input
                    type="checkbox"
                    checked={filters.onlyAvailable}
                    onChange={(e) => setFilters({...filters, onlyAvailable: e.target.checked})}
                />
                <span className="checkmark"></span>
                IN_STOCK
            </label>
        </div>
      </aside>
    );
  }

  export default FilterSidebar;
