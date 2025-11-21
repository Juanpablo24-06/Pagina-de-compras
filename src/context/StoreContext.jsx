import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

/* SOLUCIÓN DEL CONFLICTO:
   Hemos eliminado 'INITIAL_PRODUCTS' porque el estado se inicializa 
   vacío y se llena mediante 'productService.getAll()' en el useEffect.
   Mantener el array hardcodeado aquí era código muerto.
*/

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [userXP, setUserXP] = useState(1500);
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem('gamer-favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [notifications, setNotifications] = useState([]);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
        try {
            const data = await productService.getAll();
            setProducts(data);
        } catch (err) {
            console.error("Error loading products", err);
            // Could handle error UI here
        } finally {
            setIsLoading(false);
        }
    };
    loadData();
  }, []);

  // Persistencia básica
  useEffect(() => {
    localStorage.setItem('gamer-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // --- Actions ---

  const pushNotification = useCallback((message, intent = 'info') => {
    const id = crypto.randomUUID();
    setNotifications((prev) => [...prev, { id, message, intent }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        if (exists.qty + qty > product.stock) {
          pushNotification(`Stock máximo alcanzado para ${product.name}`, 'warning');
          return prev;
        }
        pushNotification(`${product.name} (+${qty}) añadido`, 'success');
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + qty } : item
        );
      }
      pushNotification(`${product.name} añadido al inventario`, 'success');
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQty = (productId, qty) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== productId) return item;
        return { ...item, qty: Math.max(1, Math.min(qty, item.stock)) };
      })
    );
  };

  const clearCart = () => setCart([]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) => {
      const isFav = prev.includes(productId);
      pushNotification(
        isFav ? 'Eliminado de favoritos' : 'Guardado en favoritos',
        'info'
      );
      return isFav ? prev.filter((id) => id !== productId) : [...prev, productId];
    });
  };

  const addXP = (amount) => {
    setUserXP((prev) => prev + amount);
    // Podríamos añadir lógica de "Level Up" aquí
  };

  // Computed
  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.qty, 0);
  }, [cart]);

  const value = {
    products,
    isLoading,
    cart,
    favorites,
    userXP,
    notifications,
    cartTotal,
    cartCount,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
    toggleFavorite,
    addXP,
    pushNotification
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};