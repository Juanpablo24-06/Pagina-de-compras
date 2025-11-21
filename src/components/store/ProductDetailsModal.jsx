import { useStore } from '../../context/StoreContext';

function ProductDetailsModal({ product, onClose }) {
  const { addToCart, products } = useStore();

  // Find related products (same category, excluding current)
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Simulated reviews based on rating
  const reviewCount = Math.floor(Math.random() * 50) + 10;
  const reviews = [
    { user: "CyberWolf99", text: "Absolute game changer. Worth every credit.", rating: 5 },
    { user: "NeonDrifter", text: "Solid build quality, but delivery took 2 cycles.", rating: 4 },
    { user: "TechJunkie", text: "Compatible with my rig perfectly.", rating: 5 }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="checkout-modal"
        style={{width: '800px', display: 'flex', flexDirection: 'column', maxHeight: '90vh'}}
        onClick={e => e.stopPropagation()}
      >
        <div style={{position: 'relative', height: '300px', background: '#000', overflow: 'hidden', flexShrink: 0}}>
             <div style={{
                 position: 'absolute', inset: 0,
                 background: `radial-gradient(circle at 50% 50%, ${product.color}44 0%, #000 80%)`
             }}></div>
             <div style={{
                 height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 fontSize: '8rem', position: 'relative', zIndex: 1
             }}>
                 {product.image}
             </div>
             <button
                onClick={onClose}
                style={{
                    position: 'absolute', top: '20px', right: '20px', zIndex: 10,
                    background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff',
                    width: '40px', height: '40px', borderRadius: '50%', fontSize: '1.2rem'
                }}
             >✕</button>
        </div>

        <div style={{padding: '2rem', overflowY: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem'}}>
                <div>
                    <span style={{color: 'var(--accent-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-mono)'}}>
                        // {product.category.toUpperCase()} // {product.platform}
                    </span>
                    <h2 style={{fontSize: '2rem', margin: '0.5rem 0', color: '#fff'}}>{product.name}</h2>
                    <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                        <span style={{color: 'var(--accent-warning)'}}>
                            {'★'.repeat(Math.floor(product.rating))}
                            <span style={{color: '#666'}}> ({reviewCount} reviews)</span>
                        </span>
                        {product.stock > 0 ? (
                            <span style={{color: 'var(--accent-success)', fontSize: '0.8rem', border: '1px solid var(--accent-success)', padding: '2px 6px', borderRadius: '4px'}}>IN STOCK</span>
                        ) : (
                            <span style={{color: 'var(--accent-danger)', fontSize: '0.8rem'}}>OUT OF STOCK</span>
                        )}
                    </div>
                </div>
                <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '2.5rem', fontWeight: 'bold', fontFamily: 'var(--font-mono)'}}>
                        ${product.price}
                    </div>
                </div>
            </div>

            <p style={{fontSize: '1.1rem', color: '#ccc', lineHeight: '1.6', marginBottom: '2rem', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '1rem'}}>
                {product.tagline}
            </p>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem'}}>
                <div>
                    <h3 style={{fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem'}}>TECHNICAL SPECS</h3>
                    <ul style={{listStyle: 'none', padding: 0, display: 'grid', gap: '0.8rem'}}>
                        {Object.entries(product.specs || {}).map(([key, val]) => (
                            <li key={key} style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem'}}>
                                <span style={{color: '#888', textTransform: 'uppercase'}}>{key}</span>
                                <span style={{color: '#fff', fontFamily: 'var(--font-mono)'}}>{val}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                     <h3 style={{fontSize: '1rem', borderBottom: '1px solid #333', paddingBottom: '0.5rem', marginBottom: '1rem'}}>TAGS</h3>
                     <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.5rem'}}>
                         {product.tags.map(tag => (
                             <span key={tag} style={{background: '#111', border: '1px solid #333', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: '#aaa'}}>
                                 #{tag}
                             </span>
                         ))}
                     </div>
                </div>
            </div>

            <div style={{marginBottom: '2rem'}}>
                <h3 style={{fontSize: '1rem', marginBottom: '1rem'}}>USER FEEDBACK</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                    {reviews.map((rev, i) => (
                        <div key={i} style={{background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px'}}>
                             <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                                 <strong style={{color: 'var(--accent-primary)', fontSize: '0.9rem'}}>{rev.user}</strong>
                                 <span style={{color: 'var(--accent-warning)', fontSize: '0.8rem'}}>{'★'.repeat(rev.rating)}</span>
                             </div>
                             <p style={{margin: 0, fontSize: '0.9rem', color: '#ddd'}}>"{rev.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        <div style={{
            padding: '1.5rem', borderTop: '1px solid #333', background: '#111',
            display: 'flex', justifyContent: 'flex-end', gap: '1rem'
        }}>
            <button
                className="btn-primary"
                style={{background: 'transparent', border: '1px solid #fff', color: '#fff'}}
                onClick={onClose}
            >
                CLOSE
            </button>
            <button
                className="btn-primary"
                disabled={product.stock === 0}
                onClick={() => {
                    addToCart(product);
                    onClose();
                }}
            >
                ADD TO LOADOUT
            </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsModal;
