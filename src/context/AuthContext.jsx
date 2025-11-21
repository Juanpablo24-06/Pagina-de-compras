import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'auth-state';

const defaultPreferences = {
  theme: 'dark',
  language: 'es',
};

const AuthContext = createContext(null);

const validateEmail = (email) => /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);

const loadState = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('No se pudo leer el estado de autenticación', error);
    return null;
  }
};

const persistState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('No se pudo guardar el estado de autenticación', error);
  }
};

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(() => loadState()?.account ?? null);
  const [session, setSession] = useState(() => loadState()?.session ?? null);
  const [preferences, setPreferences] = useState(() => loadState()?.preferences ?? defaultPreferences);
  const [resetRequest, setResetRequest] = useState(() => loadState()?.resetRequest ?? null);

  useEffect(() => {
    persistState({ account, session, preferences, resetRequest });
  }, [account, session, preferences, resetRequest]);

  useEffect(() => {
    if (preferences.theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
    document.documentElement.lang = preferences.language;
  }, [preferences]);

  const register = ({ name, email, password }) => {
    if (!name.trim()) return { ok: false, message: 'El nombre es obligatorio.' };
    if (!validateEmail(email)) return { ok: false, message: 'Ingresa un correo válido.' };
    if (password.length < 8) return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' };
    if (account && account.email === email.trim().toLowerCase()) return { ok: false, message: 'Ya existe una cuenta con este correo.' };

    const newAccount = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      lastUpdatedAt: new Date().toISOString(),
    };
    setAccount(newAccount);
    setSession({ email: newAccount.email, startedAt: Date.now() });
    setResetRequest(null);
    return { ok: true, message: 'Cuenta creada y sesión iniciada.' };
  };

  const login = ({ email, password }) => {
    if (!account) return { ok: false, message: 'No hay una cuenta registrada aún.' };
    if (!validateEmail(email)) return { ok: false, message: 'Correo inválido.' };
    if (account.email !== email.trim().toLowerCase() || account.password !== password) {
      return { ok: false, message: 'Las credenciales no coinciden.' };
    }
    setSession({ email: account.email, startedAt: Date.now() });
    return { ok: true, message: 'Bienvenido de nuevo.' };
  };

  const logout = () => {
    setSession(null);
  };

  const updateProfile = ({ name, email }) => {
    if (!account) return { ok: false, message: 'Primero registra una cuenta.' };
    if (!name.trim()) return { ok: false, message: 'El nombre es obligatorio.' };
    if (!validateEmail(email)) return { ok: false, message: 'Correo inválido.' };

    const updated = {
      ...account,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      lastUpdatedAt: new Date().toISOString(),
    };
    setAccount(updated);
    if (session) setSession({ ...session, email: updated.email });
    return { ok: true, message: 'Datos de cuenta actualizados.' };
  };

  const deleteAccount = () => {
    setAccount(null);
    setSession(null);
    setResetRequest(null);
    return { ok: true, message: 'Cuenta eliminada y sesión cerrada.' };
  };

  const changePassword = ({ currentPassword, newPassword }) => {
    if (!account) return { ok: false, message: 'Registra una cuenta primero.' };
    if (account.password !== currentPassword) return { ok: false, message: 'La contraseña actual no coincide.' };
    if (newPassword.length < 8) return { ok: false, message: 'La nueva contraseña debe tener al menos 8 caracteres.' };

    setAccount({ ...account, password: newPassword, lastUpdatedAt: new Date().toISOString() });
    return { ok: true, message: 'Contraseña actualizada correctamente.' };
  };

  const requestPasswordReset = (email) => {
    if (!account || account.email !== email.trim().toLowerCase()) {
      return { ok: false, message: 'No encontramos una cuenta con ese correo.' };
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const request = { email: account.email, code, requestedAt: Date.now() };
    setResetRequest(request);
    return { ok: true, message: `Código generado: ${code}. Úsalo para restablecer.` };
  };

  const resetPassword = ({ code, newPassword }) => {
    if (!resetRequest) return { ok: false, message: 'Solicita un código de recuperación primero.' };
    if (resetRequest.code !== code.trim()) return { ok: false, message: 'El código no coincide.' };
    if (newPassword.length < 8) return { ok: false, message: 'La contraseña debe tener al menos 8 caracteres.' };

    setAccount({ ...account, password: newPassword, lastUpdatedAt: new Date().toISOString() });
    setResetRequest(null);
    return { ok: true, message: 'Contraseña restablecida. Inicia sesión con la nueva clave.' };
  };

  const setTheme = (theme) => setPreferences((prev) => ({ ...prev, theme }));
  const setLanguage = (language) => setPreferences((prev) => ({ ...prev, language }));

  const value = useMemo(
    () => ({
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
    }),
    [account, session, preferences]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
