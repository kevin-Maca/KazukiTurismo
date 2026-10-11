import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { accommodationsData } from '../data/mockData';
import type { Accommodation } from '../types';
import '../styles/public.css';

export const Availability: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCabin, setSelectedCabin] = useState<Accommodation>(accommodationsData[0]);
  const [visitors, setVisitors] = useState<number>(2);

  const handleContinue = (): void => {
    sessionStorage.setItem('selectedCabinId', selectedCabin.id);
    sessionStorage.setItem('visitors', visitors.toString());
    navigate('/reserva/datos');
  };

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={1} />
      <div className="booking-layout">
        <div className="booking-form-box">
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 1 DE 4</small>
          <h2>Elige tu cabaña y fechas</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Selecciona el alojamiento, la llegada, la salida y la cantidad de visitantes.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            {accommodationsData.map((cab: Accommodation) => (
              <div 
                key={cab.id} 
                onClick={() => setSelectedCabin(cab)}
                style={{ 
                  border: selectedCabin.id === cab.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                  background: selectedCabin.id === cab.id ? 'var(--secondary)' : 'white',
                  padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', flex: 1, display: 'flex', gap: '0.5rem', alignItems: 'center'
                }}
              >
                <img src={cab.image} alt={cab.name} style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }} />
                <div>
                  <strong style={{ fontSize: '0.85rem' }}>{cab.name}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>${cab.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', textAlign: 'center', marginBottom: '2rem' }}>
            <p>📅 Calendario activo de demostración (18–19 de octubre, 2026 seleccionado)</p>
          </div>

          <button onClick={handleContinue} className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Continuar con mis datos &rarr;
          </button>
        </div>

        <div>
          <BookingSummaryCard visitors={visitors} selectedCabin={selectedCabin} />
        </div>
      </div>
    </div>
  );
};