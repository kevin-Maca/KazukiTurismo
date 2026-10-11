import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { accommodationsData } from '../data/mockData';
import '../styles/public.css';

export const VisitorForm: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    sessionStorage.setItem('guestInfo', JSON.stringify({ firstName, lastName, email, phone }));
    navigate('/reserva/pago');
  };

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={2} />
      <div className="booking-layout">
        <div className="booking-form-box">
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 2 DE 4</small>
          <h2>Cuéntanos sobre ti</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Usaremos estos datos para gestionar tu reserva.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre</label>
                <input 
                  type="text" 
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Ej. María" 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }} 
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Apellidos</label>
                <input 
                  type="text" 
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Ej. Rodríguez" 
                  required 
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }} 
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Correo electrónico</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@correo.com" 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }} 
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Teléfono</label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 000 0000" 
                required 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginTop: '4px' }} 
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}>
              Confirmar datos y continuar &rarr;
            </button>
          </form>
        </div>

        <div>
          <BookingSummaryCard visitors={2} selectedCabin={accommodationsData[0]} />
        </div>
      </div>
    </div>
  );
};