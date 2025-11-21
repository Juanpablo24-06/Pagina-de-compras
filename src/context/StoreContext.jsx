import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

const StoreContext = createContext();

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// Datos iniciales de productos (Expanded & Cyberpunk themed)
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'Neon Pulse Headset',
    price: 129.99,
    category: 'Audio',
    platform: 'PC',
    rating: 4.8,
    stock: 24,
    deal: true,
    image: '🎧',
    color: '#00f3ff',
    tagline: 'Sonido Surround 7.1 con cancelación de ruido activa.',
    tags: ['streaming', 'esports', 'rgb'],
    specs: { driver: '50mm', battery: '30h', wireless: true }
  },
  {
    id: 2,
    name: 'CyberGrip Elite V2',
    price: 159.99,
    category: 'Accesorios',
    platform: 'Xbox',
    rating: 4.9,
    stock: 12,
    deal: false,
    image: '🎮',
    color: '#10b981',
    tagline: 'Grips texturizados y palancas intercambiables.',
    tags: ['competitivo', 'wireless', 'macro'],
    specs: { connectivity: '2.4GHz', weight: '345g' }
  },
  {
    id: 3,
    name: 'Haptic Sense Edge',
    price: 210.00,
    category: 'Accesorios',
    platform: 'PlayStation',
    rating: 4.7,
    stock: 8,
    deal: true,
    image: '🕹️',
    color: '#3b82f6',
    tagline: 'Retroalimentación háptica de próxima generación.',
    tags: ['inmersivo', 'premium'],
    specs: { triggers: 'Adaptive', battery: '12h' }
  },
  {
    id: 4,
    name: 'MechKeys Void Pro',
    price: 99.99,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.6,
    stock: 45,
    deal: false,
    image: '⌨️',
    color: '#d946ef',
    tagline: 'Switches ópticos ultra-rápidos para FPS.',
    tags: ['rgb', 'esports', 'clicky'],
    specs: { switches: 'Optical Red', size: '60%' }
  },
  {
    id: 5,
    name: 'Ghost Shell Mouse',
    price: 65.00,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.5,
    stock: 30,
    deal: true,
    image: '🖱️',
    color: '#ffffff',
    tagline: 'Estructura de panal, solo 58g de peso.',
    tags: ['fps', 'liviano', 'cable-free'],
    specs: { dpi: '26000', sensor: 'Focus+' }
  },
  {
    id: 6,
    name: 'Steam Wallet Card',
    price: 50.00,
    category: 'Digital',
    platform: 'PC',
    rating: 5.0,
    stock: 999,
    deal: false,
    image: '💳',
    color: '#64748b',
    tagline: 'Código digital de entrega inmediata.',
    tags: ['gift', 'digital'],
    specs: { delivery: 'Instant', region: 'Global' }
  },
  {
    id: 7,
    name: 'Titan RTX 4090',
    price: 1699.00,
    category: 'Hardware',
    platform: 'PC',
    rating: 5.0,
    stock: 3,
    deal: false,
    image: '📟',
    color: '#76e405', // Nvidia Green-ish
    tagline: 'Dominio absoluto en 4K y Ray Tracing.',
    tags: ['4k', 'rtx', 'ai'],
    specs: { vram: '24GB', boost: '2.5GHz' }
  },
  {
    id: 8,
    name: 'Quantum View 240Hz',
    price: 320.00,
    category: 'Hardware',
    platform: 'PC',
    rating: 4.4,
    stock: 15,
    deal: true,
    image: '🖥️',
    color: '#f59e0b',
    tagline: 'Panel IPS rápido con colores calibrados.',
    tags: ['esports', 'hdr', 'g-sync'],
    specs: { refresh: '240Hz', response: '1ms' }
  },
  {
    id: 9,
    name: 'Switch OLED Neon',
    price: 349.99,
    category: 'Consolas',
    platform: 'Nintendo',
    rating: 4.9,
    stock: 10,
    deal: true,
    image: '🎴',
    color: '#ef4444',
    tagline: 'Pantalla vibrante para jugar donde sea.',
    tags: ['portatil', 'family'],
    specs: { screen: '7 inch OLED', storage: '64GB' }
  },
  {
    id: 10,
    name: 'ErgoThrone X1',
    price: 289.99,
    category: 'Mobiliario',
    platform: 'PC',
    rating: 4.3,
    stock: 20,
    deal: false,
    image: '🪑',
    color: '#8b5cf6',
    tagline: 'Soporte lumbar adaptable 4D.',
    tags: ['ergonomia', 'setup', 'comfort'],
    specs: { material: 'Mesh', load: '150kg' }
  },
  {
    id: 11,
    name: 'VR Nexus Headset',
    price: 499.99,
    category: 'Accesorios',
    platform: 'PC',
    rating: 4.6,
    stock: 7,
    deal: false,
    image: '🕶️',
    color: '#ec4899',
    tagline: 'Inmersión total con tracking inside-out.',
    tags: ['vr', 'metaverse'],
    specs: { resolution: '4K', fov: '110°' }
  },
  {
    id: 12,
    name: 'StreamDeck Mk.2',
    price: 149.99,
    category: 'Periféricos',
    platform: 'PC',
    rating: 4.8,
    stock: 40,
    deal: true,
    image: '🎛️',
    color: '#3b82f6',
    tagline: 'Control total de tu transmisión al alcance.',
    tags: ['streaming', 'content-creator'],
    specs: { keys: '15 LCD', software: 'Included' }
  },
  {
    id: 13,
    name: 'Retro Arcade Stick',
    price: 199.99,
    category: 'Accesorios',
    platform: 'Todas',
    rating: 4.7,
    stock: 5,
    deal: false,
    image: '🕹️',
    color: '#f43f5e',
    tagline: 'Componentes Sanwa auténticos para fighting games.',
    tags: ['fighting', 'retro', 'arcade'],
    specs: { gate: 'Octagonal', buttons: 'Sanwa Denshi' }
  },
  {
    id: 14,
    name: 'Neural Link Earbuds',
    price: 89.99,
    category: 'Audio',
    platform: 'Mobile',
    rating: 4.2,
    stock: 55,
    deal: true,
    image: '🔈',
    color: '#14b8a6',
    tagline: 'Baja latencia para gaming móvil competitivo.',
    tags: ['mobile', 'tws', 'bluetooth'],
    specs: { latency: '60ms', drivers: '10mm' }
  },
  {
    id: 15,
    name: 'CyberDesk RGB',
    price: 399.99,
    category: 'Mobiliario',
    platform: 'PC',
    rating: 4.9,
    stock: 4,
    deal: false,
    image: '🧱',
    color: '#a855f7',
    tagline: 'Escritorio elevable con iluminación integrada.',
    tags: ['setup', 'rgb', 'standing'],
    specs: { width: '160cm', motors: 'Dual' }
  }
];

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
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
