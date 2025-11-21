import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useStore } from '../../context/StoreContext';
import './Header.css';

function Header() {
  const { preferences, setTheme, session, account, logout } = useAuth();
  const { cartCount } = useStore();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const toggleTheme = () => {
    setTheme(preferences.theme === 'dark' ? 'light' : 'dark');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
        // Navigate to store with search param (In a real app, this would update the URL params)
        // For now, we'll just navigate to the store page.
        navigate('/gamer-store?search=' + encodeURIComponent(searchTerm));
    }
  };

  return (
    <header className="ml-header">
      <div className="ml-header-container">
        {/* --- ROW 1: Logo, Search, Right Actions --- */}
        <div className="ml-header-row-1">
          {/* Logo */}
          <NavLink to="/" className="ml-logo">
             <span className="ml-logo-icon">⚡</span>
             <span className="ml-logo-text">NEXUS PRIME</span>
          </NavLink>

          {/* Search Bar (Central) */}
          <form className="ml-search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="ml-search-input"
              placeholder="Buscar productos, marcas y más..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="ml-search-btn">
              🔍
            </button>
          </form>

          {/* Right Actions (Promo / Theme) */}
          <div className="ml-header-actions">
             <button onClick={toggleTheme} className="ml-nav-link theme-toggle" title="Cambiar Tema">
                {preferences.theme === 'dark' ? '🌞' : '🌙'}
             </button>
             <span className="ml-promo-text">Nivel 6: Envíos gratis</span>
          </div>
        </div>

        {/* --- ROW 2: Location, Nav, User --- */}
        <div className="ml-header-row-2">
            <div className="ml-location">
                <span className="ml-location-icon">📍</span>
                <div className="ml-location-text">
                    <span className="line-1">Ingresa tu</span>
                    <span className="line-2">CP: 12345</span>
                </div>
            </div>

            <nav className="ml-nav-links">
                <div className="ml-categories-dropdown">
                    Categorías ▼
                    <div className="ml-dropdown-content">
                        <NavLink to="/gamer-store">Hardware</NavLink>
                        <NavLink to="/gamer-store">Periféricos</NavLink>
                        <NavLink to="/gamer-store">Consolas</NavLink>
                    </div>
                </div>
                <NavLink to="/gamer-store" className="ml-nav-link">Ofertas</NavLink>
                <NavLink to="/gamer-store" className="ml-nav-link">Historial</NavLink>
                <NavLink to="/fidelidad" className="ml-nav-link">Supermercado</NavLink>
                <NavLink to="/gamer-store" className="ml-nav-link">Moda</NavLink>
                <NavLink to="/fidelidad" className="ml-nav-link">Vender</NavLink>
                <NavLink to="/admin" className="ml-nav-link">Ayuda</NavLink>
            </nav>

            <div className="ml-user-menu">
                {session ? (
                     <div className="ml-user-dropdown">
                        <span className="ml-user-name">Hola, {account?.name}</span>
                        <div className="ml-dropdown-content right-aligned">
                            <NavLink to="/auth">Mi Perfil</NavLink>
                            <button onClick={logout}>Salir</button>
                        </div>
                     </div>
                ) : (
                    <>
                        <NavLink to="/auth" className="ml-nav-link">Crea tu cuenta</NavLink>
                        <NavLink to="/auth" className="ml-nav-link">Ingresa</NavLink>
                    </>
                )}
                <NavLink to="/gamer-store" className="ml-nav-link">Mis compras</NavLink>
                <button className="ml-cart-icon" onClick={() => navigate('/gamer-store')}>
                    🛒 {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
            </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
