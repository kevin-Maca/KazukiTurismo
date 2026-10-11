import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import '../styles/public.css';

export const Confirmation: React.FC = () => {
  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={4} />
      <div style={{ maxWidth: '800px', margin: '3rem auto', background: 'white', padding: '3rem', borderRadius: '12px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
        <div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✓</div>
        <h2>¡Tu aventura comienza aquí!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Enviamos el comprobante de reserva a tu correo electrónico.</p>

        <div style={{ background: 'var(--bg-light)', padding: '1.5rem', borderRadius: '8px', textAlign: 'left', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <small style={{ color: 'var(--text-muted)' }}>CÓDIGO DE RESERVA</small>
            <h3 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem' }}>KZT-1842</h3>
            <p style={{ fontSize: '0.9rem' }}>Cabaña Bosque · 18–19 oct. 2026 · 2 personas</p>
          </div>
          <div style={{ background: '#1E382B', color: 'white', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
            📱 <div style={{ fontSize: '0.7rem', marginTop: '4px' }}>Código QR</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/" className="btn-primary">Volver al inicio</Link>
          <Link to="/admin" className="btn-secondary" style={{ padding: '0.6rem 1.2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>Ir al panel administrativo &rarr;</Link>
        </div>
      </div>
    </div>
  );
};