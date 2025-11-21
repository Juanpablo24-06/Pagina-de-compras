import { useState } from 'react';
import { useStore } from '../../context/StoreContext';

function CheckoutModal({ onClose }) {
  const { cartTotal, clearCart, addXP, pushNotification } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', address: '', card: '', expiry: '', cvc: '' });

  const xpToEarn = Math.floor(cartTotal / 10);

  const handleNext = () => {
    if (step === 1) {
        // Step 1 Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email || !emailRegex.test(form.email)) {
            pushNotification('INVALID_ID: Please provide a valid communication channel.', 'warning');
            return;
        }
        if (form.address.length < 5) {
            pushNotification('INVALID_COORDS: Drop location unclear.', 'warning');
            return;
        }
        setStep(2);
    } else if (step === 2) {
        // Step 2 Validation (Simulation)
        if (form.card.length < 12) {
            pushNotification('PAYMENT_ERROR: Credit unit invalid.', 'warning');
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            addXP(xpToEarn);
            clearCart();
        }, 3000); // 3s delay for effect
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="checkout-modal">
        <header className="drawer-header">
            <h3 style={{margin: 0, color: 'var(--accent-primary)'}}>SECURE_CHECKOUT // V2.0</h3>
            {step < 3 && (
                <button onClick={onClose} style={{background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.5rem'}}>✕</button>
            )}
        </header>

        <div style={{padding: '2rem'}}>

            {/* Progress Bar */}
            <div className="checkout-progress">
                <div className={`step-node ${step >= 1 ? 'completed' : 'active'}`}>1</div>
                <div className={`step-node ${step >= 2 ? (step > 2 ? 'completed' : 'active') : ''}`}>2</div>
                <div className={`step-node ${step >= 3 ? 'completed' : ''}`}>3</div>
            </div>

            {step === 1 && (
                <div className="fade-in">
                    <h4 style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>USER IDENTIFICATION & LOGISTICS</h4>

                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888'}}>COMMUNICATION ID (EMAIL)</label>
                        <input
                            type="email"
                            className="search-input"
                            style={{width: '100%', background: '#000', border: '1px solid #333'}}
                            value={form.email}
                            onChange={e => setForm({...form, email: e.target.value})}
                            placeholder="operative@nexus.net"
                        />
                    </div>

                    <div style={{marginBottom: '1.5rem'}}>
                        <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888'}}>DROP COORDINATES (ADDRESS)</label>
                        <input
                            type="text"
                            className="search-input"
                            style={{width: '100%', background: '#000', border: '1px solid #333'}}
                            value={form.address}
                            onChange={e => setForm({...form, address: e.target.value})}
                            placeholder="Sector 7, Apt 402"
                        />
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="fade-in">
                    <h4 style={{marginBottom: '1.5rem', color: 'var(--text-muted)'}}>CREDIT TRANSFER PROTOCOL</h4>

                    {loading ? (
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <div className="scan-line" style={{height: '2px', background: 'var(--accent-primary)', width: '100%', animation: 'loading 1s infinite alternate'}}></div>
                            <p style={{marginTop: '1rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)'}}>
                                ESTABLISHING SECURE LINK...<br/>
                                VERIFYING ASSETS...
                            </p>
                        </div>
                    ) : (
                        <div style={{background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '8px', border: '1px solid #333'}}>
                            <div style={{marginBottom: '1rem'}}>
                                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888'}}>CARD NUMBER</label>
                                <input
                                    type="text"
                                    className="search-input"
                                    style={{width: '100%', background: '#000', border: '1px solid #333', fontFamily: 'var(--font-mono)', letterSpacing: '2px'}}
                                    value={form.card}
                                    onChange={e => setForm({...form, card: e.target.value})}
                                    placeholder="0000 0000 0000 0000"
                                    maxLength={19}
                                />
                            </div>
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <div style={{flex: 1}}>
                                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888'}}>EXPIRY</label>
                                    <input
                                        type="text"
                                        className="search-input"
                                        style={{width: '100%', background: '#000', border: '1px solid #333', textAlign: 'center'}}
                                        value={form.expiry}
                                        onChange={e => setForm({...form, expiry: e.target.value})}
                                        placeholder="MM/YY"
                                        maxLength={5}
                                    />
                                </div>
                                <div style={{flex: 1}}>
                                    <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#888'}}>CVC</label>
                                    <input
                                        type="password"
                                        className="search-input"
                                        style={{width: '100%', background: '#000', border: '1px solid #333', textAlign: 'center'}}
                                        value={form.cvc}
                                        onChange={e => setForm({...form, cvc: e.target.value})}
                                        placeholder="***"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                            <div style={{marginTop: '1.5rem', textAlign: 'right', fontSize: '1.2rem', color: 'var(--accent-primary)'}}>
                                AUTHORIZING: ${cartTotal.toFixed(2)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="fade-in" style={{textAlign: 'center', padding: '1rem'}}>
                    <div style={{fontSize: '4rem', marginBottom: '1rem'}}>✅</div>
                    <h2 style={{color: 'var(--accent-success)', marginBottom: '0.5rem'}}>TRANSACTION SUCCESSFUL</h2>
                    <p style={{color: '#888', marginBottom: '2rem'}}>Assets have been provisioned and are en route to your coordinates.</p>

                    <div style={{background: 'rgba(255, 184, 0, 0.1)', border: '1px dashed var(--accent-warning)', padding: '1rem', display: 'inline-block', borderRadius: '8px'}}>
                        <span style={{display: 'block', fontSize: '0.8rem', color: 'var(--accent-warning)'}}>REWARD GRANTED</span>
                        <strong style={{fontSize: '1.5rem', color: 'var(--accent-warning)'}}>+{xpToEarn} XP</strong>
                    </div>
                </div>
            )}

        </div>

        <footer className="drawer-footer" style={{display: 'flex', justifyContent: 'flex-end'}}>
            {step === 3 ? (
                <button
                    className="btn-primary"
                    style={{width: '100%'}}
                    onClick={onClose}
                >
                    RETURN TO LOBBY
                </button>
            ) : (
                <button
                    className="btn-primary"
                    disabled={loading}
                    onClick={handleNext}
                >
                    {step === 1 ? 'PROCEED TO PAYMENT' : (loading ? 'PROCESSING...' : 'AUTHORIZE TRANSFER')}
                </button>
            )}
        </footer>
      </div>
    </div>
  );
}

export default CheckoutModal;
