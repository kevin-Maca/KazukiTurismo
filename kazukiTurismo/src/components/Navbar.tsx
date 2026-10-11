import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/public.css';

export const Navbar: React.FC = () => {
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
            <Link to="/admin" className="btn-secondary">Entrar como administrador</Link>
            <Link to="/reserva" className="btn-primary">Reservar</Link>
        </nav>
      </div>
    </header>
  );
};