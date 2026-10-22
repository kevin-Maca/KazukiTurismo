import React from 'react';
import type { Accommodation } from '../types';
import '../styles/public.css';

interface BookingSummaryCardProps {
  selectedCabin: Accommodation;
  visitors: number;
  checkInDate?: string;
  checkOutDate?: string;
  nights?: number;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
  selectedCabin,
  visitors,
  checkInDate,
  checkOutDate,
  nights = 1,
}) => {
  const total = selectedCabin.price * visitors * nights;

  const formatDate = (date: string | undefined): string =>
    date
      ? new Date(`${date}T00:00:00`).toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'Selecciona una fecha';

  return (
    <div className="summary-card">
      <div
        style={{
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '140px',
          marginBottom: '1rem',
        }}
      >
        <img
          src={selectedCabin.image}
          alt={selectedCabin.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <span
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            background: '#1E382B',
            color: 'white',
            fontSize: '0.65rem',
            padding: '3px 8px',
            borderRadius: '4px',
          }}
        >
          ESTADÍA RURAL
        </span>
      </div>

      <small style={{ color: '#B58444', fontWeight: 700, fontSize: '0.7rem' }}>
        COMUNIDAD KAZUKI - CUNDINAMARCA
      </small>
      <h3 style={{ margin: '0.25rem 0 0.5rem 0' }}>{selectedCabin.name}</h3>
      <p
        style={{
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1rem',
        }}
      >
        {selectedCabin.subtitle} · {nights} {nights === 1 ? 'noche' : 'noches'}
      </p>

      <div
        style={{
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          marginBottom: '1rem',
        }}
      >
        <div>
          📅 {formatDate(checkInDate)} · <small>2:00 p. m.</small>
        </div>
        <div>
          📅 {formatDate(checkOutDate)} · <small>11:00 a. m.</small>
        </div>
        <div>👥 {visitors} visitantes</div>
      </div>

      <hr
        style={{
          border: 'none',
          borderTop: '1px solid var(--border-color)',
          margin: '1rem 0',
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.9rem',
          marginBottom: '0.5rem',
        }}
      >
        <span>
          ${selectedCabin.price.toLocaleString()} × {visitors} × {nights}{' '}
          {nights === 1 ? 'noche' : 'noches'}
        </span>
        <strong>${total.toLocaleString()}</strong>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '0.85rem',
          color: 'var(--text-muted)',
          marginBottom: '1.5rem',
        }}
      >
        <span>Aporte comunitario</span>
        <span>Incluido</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontWeight: 700,
          fontSize: '1.2rem',
          color: 'var(--primary-dark)',
        }}
      >
        <span>Total</span>
        <span>${total.toLocaleString()} COP</span>
      </div>
    </div>
  );
};