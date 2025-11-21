import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './PageStyles.css';

const initialRegister = { name: '', email: '', password: '', confirmPassword: '' };
const initialLogin = { email: '', password: '' };
const initialProfile = { name: '', email: '' };
const initialPasswordChange = { currentPassword: '', newPassword: '', confirmPassword: '' };
const initialReset = { email: '', code: '', newPassword: '' };

function Status({ result }) {
  if (!result) return null;
  return (
    <p className={`status ${result.ok ? 'status-success' : 'status-error'}`}>{result.message}</p>
  );
}

function AuthPage() {
  const {
    account,
    session,
    preferences,
    register,
    login,
    logout,
    updateProfile,
    deleteAccount,
    changePassword,
    requestPasswordReset,
    resetPassword,
    setTheme,
    setLanguage,
  } = useAuth();

  const [registerData, setRegisterData] = useState(initialRegister);
  const [loginData, setLoginData] = useState(initialLogin);
  const [profileData, setProfileData] = useState(initialProfile);
  const [passwordData, setPasswordData] = useState(initialPasswordChange);
  const [resetData, setResetData] = useState(initialReset);

  const [registerStatus, setRegisterStatus] = useState(null);
  const [loginStatus, setLoginStatus] = useState(null);
  const [profileStatus, setProfileStatus] = useState(null);
  const [passwordStatus, setPasswordStatus] = useState(null);
  const [resetStatus, setResetStatus] = useState(null);
  const [deleteStatus, setDeleteStatus] = useState(null);

  const sessionInfo = useMemo(() => {
    if (!session || !account) return 'Sin sesión activa';
    const started = new Date(session.startedAt).toLocaleString();
    return `Sesión activa como ${account.name} (${account.email}) desde ${started}`;
  }, [session, account]);

  const handleRegister = (event) => {
    event.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterStatus({ ok: false, message: 'Las contraseñas no coinciden.' });
      return;
    }
    const result = register(registerData);
    if (result.ok) {
      setRegisterData(initialRegister);
      setProfileData({ name: registerData.name, email: registerData.email });
    }
    setRegisterStatus(result);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const result = login(loginData);
    if (result.ok) setLoginData(initialLogin);
    setLoginStatus(result);
  };

  const handleUpdateProfile = (event) => {
    event.preventDefault();
    const result = updateProfile(profileData);
    setProfileStatus(result);
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordStatus({ ok: false, message: 'La confirmación no coincide.' });
      return;
    }
    const result = changePassword(passwordData);
    if (result.ok) setPasswordData(initialPasswordChange);
    setPasswordStatus(result);
  };

  const handleRequestReset = (event) => {
    event.preventDefault();
    const result = requestPasswordReset(resetData.email);
    setResetStatus(result);
  };

  const handleReset = (event) => {
    event.preventDefault();
    const result = resetPassword({ code: resetData.code, newPassword: resetData.newPassword });
    if (result.ok) setResetData(initialReset);
    setResetStatus(result);
  };

  const handleDelete = () => {
    const confirmed = window.confirm('¿Seguro que deseas eliminar la cuenta? Esta acción es irreversible.');
    if (!confirmed) return;
    const result = deleteAccount();
    setDeleteStatus(result);
    setProfileData(initialProfile);
  };

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Equipo A · Sesiones</p>
        <h1 className="page-title">Autenticación, recuperación y preferencias</h1>
        <p className="page-lead">
          Gestiona registro, inicio/cierre de sesión, seguridad de contraseñas, eliminación de cuenta y
          preferencias persistentes como modo oscuro e idioma.
        </p>
        <div className="session-pill">{sessionInfo}</div>
      </header>

      <div className="grid auth-grid">
        <article className="info-card">
          <h2>Registro seguro</h2>
          <p>Crea una cuenta con validaciones estrictas y sesión persistente.</p>
          <form className="form" onSubmit={handleRegister}>
            <label className="form-label">
              Nombre
              <input
                required
                className="form-input"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="Nombre visible"
              />
            </label>
            <label className="form-label">
              Correo electrónico
              <input
                required
                type="email"
                className="form-input"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="email@dominio.com"
              />
            </label>
            <div className="form-row">
              <label className="form-label">
                Contraseña
                <input
                  required
                  type="password"
                  minLength={8}
                  className="form-input"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                />
              </label>
              <label className="form-label">
                Confirmar
                <input
                  required
                  type="password"
                  minLength={8}
                  className="form-input"
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                  placeholder="Repite la contraseña"
                />
              </label>
            </div>
            <button className="primary-button" type="submit">Crear cuenta</button>
            <Status result={registerStatus} />
          </form>
        </article>

        <article className="info-card">
          <h2>Ingreso y sesión</h2>
          <p>Inicia sesión y conserva el estado gracias al almacenamiento local.</p>
          <form className="form" onSubmit={handleLogin}>
            <label className="form-label">
              Correo
              <input
                required
                type="email"
                className="form-input"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="email registrado"
              />
            </label>
            <label className="form-label">
              Contraseña
              <input
                required
                type="password"
                className="form-input"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="Contraseña"
              />
            </label>
            <div className="form-row">
              <button className="primary-button" type="submit">Entrar</button>
              <button className="ghost-button" type="button" onClick={logout}>Cerrar sesión</button>
            </div>
            <Status result={loginStatus} />
          </form>

          <div className="divider" />
          <h3>Recuperación</h3>
          <form className="form" onSubmit={handleRequestReset}>
            <label className="form-label">
              Correo asociado
              <input
                type="email"
                required
                className="form-input"
                value={resetData.email}
                onChange={(e) => setResetData({ ...resetData, email: e.target.value })}
                placeholder="email@dominio.com"
              />
            </label>
            <button className="secondary-button" type="submit">Generar código</button>
          </form>

          <form className="form" onSubmit={handleReset}>
            <div className="form-row">
              <label className="form-label">
                Código recibido
                <input
                  className="form-input"
                  value={resetData.code}
                  onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                  placeholder="Ej. 123456"
                  required
                />
              </label>
              <label className="form-label">
                Nueva contraseña
                <input
                  type="password"
                  minLength={8}
                  className="form-input"
                  value={resetData.newPassword}
                  onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                  placeholder="Mínimo 8 caracteres"
                  required
                />
              </label>
            </div>
            <button className="primary-button" type="submit">Restablecer</button>
            <Status result={resetStatus} />
          </form>
        </article>

        <article className="info-card">
          <h2>Perfil y seguridad</h2>
          <p>Actualiza datos básicos, modifica la contraseña o elimina la cuenta.</p>
          <form className="form" onSubmit={handleUpdateProfile}>
            <label className="form-label">
              Nombre
              <input
                className="form-input"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder={account?.name ?? 'Nombre visible'}
                required
              />
            </label>
            <label className="form-label">
              Correo
              <input
                className="form-input"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder={account?.email ?? 'correo@dominio.com'}
                required
              />
            </label>
            <button className="primary-button" type="submit">Guardar cambios</button>
            <Status result={profileStatus} />
          </form>

          <div className="divider" />
          <h3>Contraseña actual</h3>
          <form className="form" onSubmit={handleChangePassword}>
            <div className="form-row">
              <label className="form-label">
                Actual
                <input
                  type="password"
                  className="form-input"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  required
                />
              </label>
              <label className="form-label">
                Nueva
                <input
                  type="password"
                  minLength={8}
                  className="form-input"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                />
              </label>
              <label className="form-label">
                Confirmar
                <input
                  type="password"
                  minLength={8}
                  className="form-input"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                />
              </label>
            </div>
            <button className="secondary-button" type="submit">Actualizar contraseña</button>
            <Status result={passwordStatus} />
          </form>

          <div className="danger-zone">
            <div>
              <h4>Eliminar cuenta</h4>
              <p>Se borrarán datos locales y se cerrará la sesión.</p>
            </div>
            <button className="danger-button" type="button" onClick={handleDelete}>Eliminar</button>
          </div>
          <Status result={deleteStatus} />
        </article>

        <article className="info-card">
          <h2>Preferencias persistentes</h2>
          <p>Elige el modo de color y el idioma a nivel de app. Se guarda en localStorage.</p>
          <div className="preference-group">
            <div>
              <p className="eyebrow">Tema</p>
              <div className="button-row">
                <button
                  className={preferences.theme === 'dark' ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setTheme('dark')}
                >
                  🌙 Oscuro
                </button>
                <button
                  className={preferences.theme === 'light' ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setTheme('light')}
                >
                  ☀️ Claro
                </button>
              </div>
            </div>
            <div>
              <p className="eyebrow">Idioma</p>
              <div className="button-row">
                <button
                  className={preferences.language === 'es' ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setLanguage('es')}
                >
                  Español
                </button>
                <button
                  className={preferences.language === 'en' ? 'chip active' : 'chip'}
                  type="button"
                  onClick={() => setLanguage('en')}
                >
                  English
                </button>
              </div>
            </div>
          </div>
          <div className="session-pill">
            Preferencias actuales: tema {preferences.theme} · idioma {preferences.language.toUpperCase()}
          </div>
        </article>
      </div>
    </section>
  );
}

export default AuthPage;
