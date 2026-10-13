import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { accommodationsData, mockCapacityConfigs } from '../data/mockData';
import type { Accommodation } from '../types';
import '../styles/public.css';

export const Availability: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCabin, setSelectedCabin] = useState<Accommodation>(accommodationsData[0]);
  const [visitors, setVisitors] = useState<number>(2);
  const selectedCapacity = mockCapacityConfigs.find(
  (capacity) => capacity.accommodationId === selectedCabin.id
);

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

   
<div
  style={{
    background: '#F9FAFB',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    marginBottom: '1.5rem'
  }}
>
  <p style={{ textAlign: 'center', marginTop: 0 }}>
    📅 Calendario de demostración: 18–19 de octubre de 2026
  </p>

  <div
    style={{
      background: 'white',
      border: '1px solid var(--border-color)',
      borderRadius: '8px',
      padding: '1rem',
      marginTop: '1rem'
    }}
  >
    <h3 style={{ marginTop: 0 }}>
      Disponibilidad de {selectedCabin.name}
    </h3>

    {selectedCapacity ? (
      <>
        <p>
          Capacidad total:{' '}
          <strong>{selectedCapacity.totalCapacity} visitantes</strong>
        </p>
        <p>
          Cupos reservados:{' '}
          <strong>{selectedCapacity.reserved}</strong>
        </p>
        <p style={{ color: '#236344', fontSize: '1.1rem' }}>
          Cupos disponibles:{' '}
          <strong>{selectedCapacity.available}</strong>
        </p>
      </>
    ) : (
      <p>No hay información de disponibilidad para este alojamiento.</p>
    )}
  </div>
</div>


<div style={{ marginBottom: '1.5rem' }}>
  <label
    htmlFor="visitors"
    style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}
  >
    Cantidad de visitantes
  </label>

  <select
    id="visitors"
    value={visitors}
    onChange={(e) => setVisitors(Number(e.target.value))}
    style={{
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid var(--border-color)'
    }}
  >
    {Array.from(
      { length: selectedCabin.maxGuests },
      (_, index) => index + 1
    ).map((quantity) => (
      <option key={quantity} value={quantity}>
        {quantity} {quantity === 1 ? 'visitante' : 'visitantes'}
      </option>
    ))}
  </select>
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