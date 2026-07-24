import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiCalendar, FiUser, FiX, FiLogOut, FiSettings, FiActivity, 
  FiPlusCircle, FiUserPlus, FiBookOpen, FiHome, FiInfo, FiStar } from 'react-icons/fi';
import { useAuth } from '../auth/useAuth'; 
import "../css/Navbar.css"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { status, user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);

  const isAuthenticated = status === "authenticated";
  const role = user?.role?.toLowerCase() || '';

  const handleLogout = () => {
    toggleMenu();
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* HEADER PRINCIPAL */}
      <nav className="navbar navbar-dark gq-navbar px-4 py-3 position-relative z-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Logo GymQuest */}
          <Link to={isAuthenticated ? "/home-user" : "/"} className="navbar-brand fw-bold fs-3 d-flex align-items-center gq-brand">
            Gym<span className="gq-text-neon">Quest</span>
            <span className="ms-2 fs-5">⚔️</span>
          </Link>

          {/* Estado SIN AUTENTICAR: Botones Login y Register */}
          {!isAuthenticated ? (
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-neon rounded-pill px-4 fw-semibold" 
                onClick={() => navigate('/login')}
              >
                LOG IN
              </button>
              <button 
                className="btn btn-neon rounded-pill px-4 fw-bold" 
                onClick={() => navigate('/register')}
              >
                REGISTER
              </button>
            </div>
          ) : (
            /* Estado AUTENTICADO: Iconos Rápidos y Menú Avatar */
            <div className="d-flex align-items-center gap-3 text-white fs-4">
              <Link to="/user/booking" className="gq-nav-icon" title="Booking">
                <FiCalendar />
              </Link>

              <Link to="/user/achievements" className="gq-nav-icon" title="Achievements">
                <FiStar />
              </Link>

              {/* Botón Avatar de Perfil */}
              <div 
                className="gq-profile-avatar"
                onClick={toggleMenu}
                title="Profile Menu"
              >
                <FiUser className="gq-text-neon fs-5" />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE DESDE LA DERECHA (Offcanvas) */}
      <div 
        className="gq-drawer p-4" 
        style={{ 
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)'
        }}
      >
        {/* Header del menú */}
        <div className="d-flex justify-content-between align-items-center mb-3 pb-2 gq-drawer-header">
          <div>
            <h5 className="text-white m-0 fw-bold">
              {user?.name || "Hero"} ⚔️
            </h5>
            <small className="gq-text-neon text-uppercase fw-semibold" style={{ fontSize: '0.75rem' }}>
              Role: {user?.role || "User"}
            </small>
          </div>
          <FiX className="text-white fs-3 cursor-pointer gq-nav-icon" onClick={toggleMenu} />
        </div>

        {/* Enlaces del menú según Rol */}
        <div className="d-flex flex-column gap-1 mt-3">
          
          {/* --- RUTAS USER --- */}
          <Link to="/home-user" className="drawer-link" onClick={toggleMenu}>
            <FiHome className="gq-text-neon" /> Home User
          </Link>

          <Link to="/user/achievements" className="drawer-link" onClick={toggleMenu}>
            <FiStar className="gq-text-neon" /> Achievements
          </Link>

          <Link to="/user/stadistics" className="drawer-link" onClick={toggleMenu}>
            <FiActivity className="gq-text-neon" /> Profile Stats
          </Link>

          <Link to="/routines" className="drawer-link" onClick={toggleMenu}>
            <FiBookOpen className="gq-text-neon" /> Routines
          </Link>

          <Link to="/routines/myroutines" className="drawer-link" onClick={toggleMenu}>
            <FiBookOpen className="gq-text-neon" /> My Routines
          </Link>

          <Link to="/training" className="drawer-link" onClick={toggleMenu}>
            <FiActivity className="gq-text-neon" /> Trainings
          </Link>

          <Link to="/about" className="drawer-link" onClick={toggleMenu}>
            <FiInfo className="gq-text-neon" /> About
          </Link>

          {/* --- RUTAS TRAINER --- */}
          {(role === 'trainer' || role === 'admin') && (
            <>
              <hr className="border-secondary my-2" />
              <small className="gq-text-gold text-uppercase fw-bold px-2 mb-1">Trainer Panel</small>
              
              <Link to="/training/add" className="drawer-link" onClick={toggleMenu}>
                <FiPlusCircle className="gq-text-gold" /> Add Training
              </Link>

              <Link to="/exercise/add" className="drawer-link" onClick={toggleMenu}>
                <FiPlusCircle className="gq-text-gold" /> Add Exercise
              </Link>
            </>
          )}

          {/* --- RUTAS ADMIN --- */}
          {role === 'admin' && (
            <>
              <hr className="border-secondary my-2" />
              <small className="text-danger text-uppercase fw-bold px-2 mb-1">Admin Panel</small>

              <Link to="/register-trainer" className="drawer-link" onClick={toggleMenu}>
                <FiUserPlus className="text-danger" /> Register Trainer
              </Link>
            </>
          )}

          <hr className="border-secondary my-2" />

          {/* Configuración y Logout */}
          <Link to="/user/profileSettings" className="drawer-link" onClick={toggleMenu}>
            <FiSettings /> Configuration
          </Link>

          <button 
            className="btn btn-outline-danger d-flex align-items-center gap-2 p-2 w-100 rounded-pill mt-3 fw-semibold" 
            onClick={handleLogout}
          >
            <FiLogOut /> Log Out
          </button>
        </div>
      </div>

      {/* Fondo obscuro traslúcido */}
      {isOpen && (
        <div 
          className="gq-drawer-overlay"
          onClick={toggleMenu}
        />
      )}
    </>
  );
}