import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthStyles.css';

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const res = register(formData);
    if (res.ok) {
        navigate('/');
    } else {
        setError(res.message);
    }
  };

  return (
    <div className="auth-page-container">
        <div className="auth-box">
            <div className="auth-header">
                <h2>Completa tus datos</h2>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                 <div className="form-group">
                    <label>Nombre y apellido</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Elige una contraseña</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                    />
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button type="submit" className="auth-btn-primary">Continuar</button>
                <button type="button" className="auth-btn-link" onClick={() => navigate('/login')}>
                    Ya tengo cuenta
                </button>
            </form>
        </div>
    </div>
  );
}

export default RegisterPage;
