import { useStore } from '../../context/StoreContext';

function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { cart, removeFromCart, updateCartQty, cartTotal } = useStore();

  if (!isOpen) return null;

  // Simulation of taxes
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + tax;

  return (
    <div className="modal-backdrop" style={{justifyContent: 'flex-end'}}>
      <div className="drawer-container">
        <header className="drawer-header">
          <h3 style={{margin: 0}}>LOOT BOX</h3>
          <button
            onClick={onClose}
            style={{background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem'}}
          >
            ✕
          </button>
        </header>

        <div className="drawer-content">
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '4rem 0', color: '#666'}}>
              <div style={{fontSize: '3rem', marginBottom: '1rem'}}>🕸️</div>
              <p>CONTAINER EMPTY</p>
              <p style={{fontSize: '0.8rem'}}>ACQUIRE ASSETS TO PROCEED</p>
            </div>
          ) : (
            <div>
                {cart.map((item) => (
                    <div key={item.id} className="cart-item-row">
                        <div className="cart-item-img">
                            {item.image}
                        </div>
                        <div className="cart-item-info">
                            <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                <h4 style={{fontSize: '0.95rem', margin: '0 0 0.3rem 0'}}>{item.name}</h4>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    style={{background: 'none', border: 'none', color: '#666', cursor: 'pointer'}}
                                >
                                    ✕
                                </button>
                            </div>
                            <div style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem'}}>
                                ${item.price} x {item.qty}
                            </div>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty - 1)}>-</button>
                                <span className="qty-val">{item.qty}</span>
                                <button className="qty-btn" onClick={() => updateCartQty(item.id, item.qty + 1)}>+</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          )}
        </div>

        <footer className="drawer-footer">
          <div style={{marginBottom: '1rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9rem', marginBottom: '5px'}}>
                <span>SUBTOTAL</span>
                <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', color: '#aaa', fontSize: '0.9rem', marginBottom: '1rem'}}>
                <span>TAX (EST. 8%)</span>
                <span>${tax.toFixed(2)}</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)'}}>
                <span>TOTAL</span>
                <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{width: '100%'}}
            disabled={cart.length === 0}
            onClick={onCheckout}
          >
            INITIATE SECURE CHECKOUT
          </button>
        </footer>
      </div>
    </div>
  );
}

export default CartDrawer;
