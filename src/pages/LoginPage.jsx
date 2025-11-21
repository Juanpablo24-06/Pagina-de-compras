import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthStyles.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Mock validation
    if (!email || !password) {
        setError('Completa todos los datos');
        return;
    }

    // Mock login for now (AuthContext logic)
    const res = login({ email, password });
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
                <h2>¡Hola! Ingresa tu e-mail y contraseña</h2>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="ejemplo@email.com"
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label>Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </div>

                {error && <div className="auth-error">{error}</div>}

                <button type="submit" className="auth-btn-primary">Continuar</button>
                <button type="button" className="auth-btn-secondary" onClick={() => navigate('/register')}>
                    Crear cuenta
                </button>
            </form>
        </div>
    </div>
  );
}

export default LoginPage;
