import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useNavigate } from 'react-router-dom'

import Home from './Home'
import Achievements from './Achievements'
import {Login} from './pages/Login'
import ProfileSettings from './ProfileSettings'
import { LandingPage } from './pages/LandingPage'

// Componente auxiliar para manejar la navegación interna
const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <Login
      onNavigateToRegister={() => navigate('/register')}
      onLoginSuccess={() => navigate('/dashboard')}
    />
  );
};

const RegisterPage = () => {
  return <div>Pantalla de Registro (En proceso)</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile/settings" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)