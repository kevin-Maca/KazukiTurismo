import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import '../styles/public.css';

export const Navbar: React.FC = () => {
  const {user, logout} = useAuth()
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-container">
          <span style={{ fontSize: '1.4rem' }}>🍃</span>
          <div>
            <strong>Kazuki</strong>
            <small style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '1px', color: 'var(--text-muted)' }}>
              TURISMO
            </small>
          </div>
        </Link>

           <nav className="nav-links">
          <Link to="/">Inicio</Link>
          <Link to="/alojamientos">Alojamientos</Link>
          <Link to="/experiencias">Experiencias</Link>
          {user?.rol === 'ADMIN' && <Link to="/admin" className="btn-secondary">Panel</Link>}
          {user ? (
            <>
              <span style={{ fontSize: '0.85rem' }}>Hola, {user.nombres}</span>
              <button type="button" className="btn-secondary" onClick={() => void logout()}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login">Ingresar</Link>
              <Link to="/registro">Registrarse</Link>
            </>
          )}
          <Link to="/reserva" className="btn-primary">Reservar</Link>
        </nav>
      </div>
    </header>
  );
};