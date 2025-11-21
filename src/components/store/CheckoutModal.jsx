import { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';

function CheckoutModal({ onClose }) {
  const { cartTotal, clearCart, addXP, pushNotification } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', address: '', card: '' });

  const xpToEarn = Math.floor(cartTotal / 10);

  const handleNext = () => {
    if (step === 1) {
        if (!form.email || !form.address) {
            pushNotification('MISSING_DATA: Complete all fields.', 'warning');
            return;
        }
        setStep(2);
    } else if (step === 2) {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            addXP(xpToEarn);
            clearCart();
        }, 2500);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="cyber-modal">
        <header className="modal-header">
          <h2>SECURE CHECKOUT_V2</h2>
          {step < 3 && <button className="close-btn" onClick={onClose}>✕</button>}
        </header>

        <div className="modal-body">
            {/* Step Indicator */}
            <div className="step-indicator">
                <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className="step-line"></div>
                <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
            </div>

            {step === 1 && (
                <div className="checkout-form">
                    <h3>// CONTACT_DATA</h3>
                    <label>
                        USER_EMAIL
                        <input
                            type="email"
                            className="cyber-input"
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="user@net.com"
                        />
                    </label>
                    <label>
                        DROP_COORDS (Address)
                        <input
                            type="text"
                            className="cyber-input"
                            value={form.address}
                            onChange={e => setForm({...form, address: e.target.value})}
                            placeholder="Sector 7, Block 4"
                        />
                    </label>
                </div>
            )}

            {step === 2 && (
                <div className="payment-sim">
                    <h3>// PAYMENT_GATEWAY</h3>
                    <div className="credit-card-box">
                        <p>Mercado Pago Integration</p>
                        <p className="total-display">${cartTotal.toFixed(2)}</p>
                    </div>
                    {loading ? (
                        <div className="loading-bar-container">
                            <p>ENCRYPTING TRANSACTION...</p>
                            <div className="loading-bar"></div>
                        </div>
                    ) : (
                        <p className="secure-msg">🔒 CONNECTION SECURED. READY TO TRANSFER.</p>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="success-view">
                    <div className="success-icon">✅</div>
                    <h3>TRANSACTION COMPLETE</h3>
                    <p>Your gear is being provisioned.</p>
                    <div className="xp-reward">
                        <span>XP GAINED</span>
                        <strong>+{xpToEarn}</strong>
                    </div>
                </div>
            )}
        </div>

        <footer className="modal-footer">
            {step === 3 ? (
                <button className="cyber-button full" onClick={onClose}>RETURN TO LOBBY</button>
            ) : (
                <button
                    className="cyber-button full"
                    onClick={handleNext}
                    disabled={loading}
                >
                    {step === 1 ? 'PROCEED TO PAYMENT' : (loading ? 'PROCESSING...' : 'CONFIRM TRANSFER')}
                </button>
            )}
        </footer>
      </div>
    </div>
  );
}

export default CheckoutModal;
