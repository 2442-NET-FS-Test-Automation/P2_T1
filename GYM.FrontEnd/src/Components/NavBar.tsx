import { useState } from 'react';
import { FiCalendar, FiAward, FiUser, FiX, FiLogOut, FiSettings } from 'react-icons/fi';
// Link to navigate through screens. The replacement of <a> tag
import { Link } from 'react-router-dom'; 

interface NavbarProps {
  onLogout?: () => void;
}
    
export default function Navbar({ onLogout }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);


  return (
    <>
      {/* HEADER PRINCIPAL */}
      <nav className="navbar navbar-dark bg-dark px-4 py-3" style={{ backgroundColor: '#0B0C10', borderBottom: '1px solid #1f2229' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          {/* Logo GymQuest */}
          <Link to="/" className="navbar-brand fw-bold fs-4 d-flex align-items-center" style={{ color: '#FFFFFF' }}>
            Gym<span style={{ color: '#00E5FF' }}>Quest</span>
            <span className="ms-2" style={{ fontSize: '0.9rem', color: '#8A8D93' }}>⚔️</span>
          </Link>

          {/* Iconos de la derecha */}
          <div className="d-flex align-items-center gap-4" style={{ color: '#FFFFFF', fontSize: '1.4rem' }}>
            <FiCalendar className="role-button" style={{ cursor: 'pointer' }} title="Reservas / Clases" />
            <FiAward className="role-button" style={{ cursor: 'pointer' }} title="Logros" />
            <FiUser className="role-button" style={{ cursor: 'pointer', color: '#00E5FF' }} onClick={toggleMenu} title="Perfil" />
          </div>
        </div>
      </nav>

      {/* MENÚ DESPLEGABLE DESDE LA DERECHA (Offcanvas personalizado) */}
      <div 
        className={`position-fixed top-0 end-0 h-100 p-4 shadow-lg transition-all`} 
        style={{ 
          width: '300px', 
          backgroundColor: '#121321', 
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease-in-out',
          borderLeft: '1px solid #1f2229'
        }}
      >
        {/* Header del menú */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="text-white m-0 fw-bold">Menu</h5>
          <FiX className="text-white fs-4" style={{ cursor: 'pointer' }} onClick={toggleMenu} />
        </div>

        {/* Enlaces del menú */}
        <div className="d-flex flex-column gap-3">
          <a href="#perfil" className="text-decoration-none text-white d-flex align-items-center gap-2 p-2 rounded hover-effect" onClick={toggleMenu}>
            <FiUser style={{ color: '#00E5FF' }} /> Your profile
          </a>
          <Link to="/profile/settings" className="text-decoration-none text-white d-flex align-items-center gap-2 p-2 rounded hover-effect" onClick={toggleMenu}>
            <FiSettings /> Configuration
          </Link>
          <hr className="text-muted my-2" />
          <button 
            className="btn btn-link text-decoration-none text-danger d-flex align-items-center gap-2 p-2 w-100 text-start" 
            onClick={() => { toggleMenu(); if(onLogout) onLogout(); }}
          >
            <FiLogOut /> Log Out
          </button>
        </div>
            </div>

      {/* Fondo oscuro traslúcido cuando el menú está abierto */}
      {isOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
          onClick={toggleMenu}
        />
      )}
    </>
    );
}