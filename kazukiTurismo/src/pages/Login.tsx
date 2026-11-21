import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { useAuth } from '../context/useAuth';
import { ApiError } from '../services/apiClient';
import '../styles/public.css';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  marginTop: '4px',
};

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname;

  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const usuario = await login(correo, password);
      navigate(from ?? (usuario.rol === 'ADMIN' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo iniciar sesión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '440px', margin: '3rem auto', padding: '0 1rem' }}>
        <form className="booking-form-box" onSubmit={handleSubmit}>
          <h2>Inicia sesión</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Ingresa para gestionar tus reservas.
          </p>

          <label htmlFor="correo" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Correo electrónico</label>
          <input id="correo" type="email" required value={correo}
            onChange={(e) => setCorreo(e.target.value)} style={inputStyle} />

          <label htmlFor="password" style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginTop: '1rem' }}>Contraseña</label>
          <input id="password" type="password" required value={password}
            onChange={(e) => setPassword(e.target.value)} style={inputStyle} />

          {error && <p role="alert" style={{ color: '#C62828', marginTop: '1rem' }}>{error}</p>}

          <button type="submit" className="btn-primary" disabled={submitting}
            style={{ width: '100%', padding: '0.85rem', marginTop: '1.5rem' }}>
            {submitting ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p style={{ marginTop: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </form>
      </div>
    </div>
  );
};