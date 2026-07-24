import React, { useState } from 'react';
import type { SubmitEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../auth/useAuth';
import '../css/Login.css';

export function Login () { 

  const {login, status} = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const[error, setError] = useState<string | null>(null);

  //const [loading, setLoading] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const navigate = useNavigate();

  async function onSubmit(e: SubmitEvent<HTMLFormElement>){
    e.preventDefault();

    setError(null);

    const ok = await login(email, password)
    console.log("¿Qué devolvió la función login?:", ok);

    if(ok){
      console.log("Ok on submit Login button");
      navigate("/");
    } 
    else
      setError("Invalid username or password")
  }

  return (
<div className="login-bg min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
      {/* Botón para regresar a la Landing */}
      <button 
        className="btn btn-outline-neon rounded-pill px-3 py-1 position-absolute top-0 start-0 m-4 small fw-semibold"
        onClick={() => navigate('/')}
      >
        ← Volver al inicio
      </button>

      <div className="login-card-container w-100" style={{ maxWidth: '420px' }}>
        <div className="login-card p-4 p-sm-5 rounded-4 border-neon-subtle shadow-neon-lg">
          
          {/* Encabezado con estética GymQuest */}
          <div className="text-center mb-4">
            <h1 className="fw-bold display-6 mb-1 cursor-pointer text-white" onClick={() => navigate('/')}>
              Gym<span className="text-neon">Quest</span>
            </h1>
            <div className="fs-2 my-2">⚔️</div>
            <h2 className="fs-6 text-white   fw-normal text-uppercase letter-spacing-1 m-0">
              Inicia sesión en tu cuenta
            </h2>
          </div>

          {/* Formulario */}
          <form onSubmit={onSubmit} className="login-form">
            
            {/* Input Email */}
            <div className="mb-3">
              <label className="form-label text-neon small fw-semibold">Correo Electrónico</label>

              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-muted">✉️</span>
                <input
                  type="email"
                  className="form-control quest-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>

            </div>

            {/* Input Password */}
            <div className="mb-3">
              <label className="form-label text-neon small fw-semibold">Contraseña</label>

              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-muted">🔒</span>
                <input
                  type="password"
                  className="form-control quest-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </div>

            </div>

            {/* Checkbox Remember Me */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check custom-checkbox">
                <input
                  className="form-check-input quest-checkbox"
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberMe(e.target.checked)}
                />
                <label className="form-check-label small text-gray cursor-pointer" htmlFor="rememberMe">
                  Recordarme
                </label>
              </div>
            </div>

            {/* Mensaje de Error (alerta estilizada) */}
            {error && (
              <div className="alert alert-danger-quest p-2 mb-3 text-center small rounded-3 text-danger fw-semibold" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* Botón de Submit con Estado de Carga */}
            <button 
              type="submit" 
              className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase shadow-neon"
              disabled={status === "authenticating"}
            >
              {status === "authenticating" ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión ⚔️'
              )}
            </button>
          </form>

          <hr className="hr-neon my-4" />

          {/* Registro */}
          <p className="text-center text-white small m-0">
            ¿Aún no tienes una cuenta?{' '}
            <span 
              className="text-neon fw-bold cursor-pointer hover-underline ms-1"
              onClick={() => navigate('/register')}
            >
              Regístrate aquí
            </span>
          </p>

        </div>
      </div>
    </div>
  )

};