import { useStore } from '../../context/StoreContext';

function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, removeFromCart, updateCartQty, cartTotal, clearCart } = useStore();

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay">
      <div className="drawer-panel">
        <header className="drawer-header">
          <h3>INVENTORY</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </header>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <div className="empty-state">
              <span style={{ fontSize: '3rem' }}>🕸️</span>
              <p>NO ITEMS DETECTED</p>
            </div>
          ) : (
            <ul className="cart-list">
              {cart.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-thumb">{item.image}</div>
                  <div className="cart-details">
                    <h4>{item.name}</h4>
                    <span className="item-price">${item.price}</span>
                    <div className="qty-control">
                        <button onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                    </div>
                  </div>
                  <button className="remove-btn" onClick={() => removeFromCart(item.id)}>🗑️</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="drawer-footer">
          <div className="total-row">
            <span>TOTAL CREDITS</span>
            <span className="total-value">${cartTotal.toFixed(2)}</span>
          </div>
          <button
            className="cyber-button full"
            disabled={cart.length === 0}
            onClick={onCheckout}
          >
            INITIATE CHECKOUT
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CartDrawer;
