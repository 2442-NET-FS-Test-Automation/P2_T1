import React, { useState } from 'react';
import { AxiosError } from 'axios';
import { login } from '../services/auth'; 
import type { LoginPayload } from '../services/auth';
import '../css/Login.css';

interface LoginProps {
  onNavigateToRegister: () => void;
  onLoginSuccess?: () => void;
}

export const Login: React.FC<LoginProps> = ({ 
  onNavigateToRegister, 
  onLoginSuccess 
}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload: LoginPayload = { email, password };
      
      // Llamada directa a tu función login() de auth.ts
      await login(payload);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      
      if (axiosError.response && axiosError.response.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('Credenciales inválidas o error de conexión');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Encabezado */}
        <div className="brand-header">
          <h1 className="brand-title">
            Gym<span className="brand-highlight">Quest</span>
          </h1>
          <div className="swords-icon">⚔️</div>
          <h2 className="form-subtitle">Login to your account</h2>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'LOGGING IN...' : 'LOG IN'}
          </button>

          {/* Muestra el mensaje de error si falla */}
          <div className="error-field">
            {error && <p className="error-text">{error}</p>}
          </div>
        </form>

        <hr className="divider" />

        {/* Link para navegar a Registro */}
        <p className="register-text">
          You don't have an account?{' '}
          <span className="register-link" onClick={onNavigateToRegister}>
            Register here
          </span>
        </p>
      </div>
    </div>
  );
};