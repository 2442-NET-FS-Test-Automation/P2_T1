import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import type { SubmitEvent } from "react";
import '../css/Register.css';

export function Register() {
  const navigate = useNavigate();

  // Registration Form States
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Submit Handler
  async function onSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    // Validar que el teléfono tenga exactamente 10 dígitos numéricos
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
        setError("Phone number must contain exactly 10 digits.");
        return;
    }

    // Basic frontend validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // API Call Placeholder (e.g., registerService({ email, phone, password }))
      console.log('Registering user:', { email, phone, password });

      // Simulated API response
      setTimeout(() => {
        setLoading(false);
        // Navigate to login
        navigate('/login');
      }, 1000);

    } catch (err) {
      setLoading(false);
      setError("An error occurred while creating your account. Please try again.");
    }
  }

  return (
    <div className="register-bg min-vh-100 d-flex flex-column align-items-center justify-content-center p-3">
      {/* Back to Home Button */}
      <button 
        className="btn btn-outline-neon rounded-pill px-3 py-1 position-absolute top-0 start-0 m-4 small fw-semibold"
        onClick={() => navigate('/')}
      >
        ← Back to Home
      </button>

      <div className="register-card-container w-100" style={{ maxWidth: '440px' }}>
        <div className="register-card p-4 p-sm-5 rounded-4 border-neon-subtle shadow-neon-lg">
          
          {/* GymQuest Header */}
          <div className="text-center mb-4">
            <h1 className="fw-bold display-6 mb-1 cursor-pointer text-white" onClick={() => navigate('/')}>
              Gym<span className="text-neon">Quest</span>
            </h1>
            <div className="fs-2 my-1">⚔️</div>
            <h2 className="fs-6 text-white fw-normal text-uppercase letter-spacing-1 m-0">
              Create your hero account
            </h2>
          </div>

          {/* Registration Form */}
          <form onSubmit={onSubmit} className="register-form">
            
            {/* 1. Email Input */}
            <div className="mb-3">
              <label className="form-label text-neon small fw-semibold">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-white">✉️</span>
                <input
                  type="email"
                  className="form-control quest-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* 2. Phone Input */}
            <div className="mb-3">
              <label className="form-label text-neon small fw-semibold">Phone Number</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-white">📱</span>
                    <input
                    type="tel"
                    className="form-control quest-input"
                    placeholder="10-digit phone number"
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        // Extra: filtra cualquier caracter que NO sea número mientras el usuario escribe
                        const onlyNums = e.target.value.replace(/\D/g, '');
                        setPhone(onlyNums);
                    }}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    inputMode="numeric"
                    title="Please enter a valid 10-digit phone number"
                    required
                    />
              </div>
            </div>

            {/* 3. Password Input */}
            <div className="mb-3">
              <label className="form-label text-neon small fw-semibold">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-white">🔒</span>
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

            {/* 4. Confirm Password Input */}
            <div className="mb-4">
              <label className="form-label text-neon small fw-semibold">Confirm Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark border-secondary text-white">🛡️</span>
                <input
                  type="password"
                  className="form-control quest-input"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="alert alert-danger-quest p-2 mb-3 text-center small rounded-3 fw-semibold" role="alert">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-neon w-100 py-2.5 rounded-pill fw-bold text-uppercase shadow-neon"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </span>
              ) : (
                'Register ⚔️'
              )}
            </button>
          </form>

          <hr className="hr-neon my-4" />

          {/* Link to Login */}
          <p className="text-center text-white small m-0">
            Already have an account?{' '}
            <span 
              className="text-neon fw-bold cursor-pointer hover-underline ms-1"
              onClick={() => navigate('/login')}
            >
              Log in here
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}