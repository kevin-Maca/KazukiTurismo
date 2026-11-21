import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { useAccommodations } from '../hooks/useAccommodations';
import { useFechasDisponibles } from '../hooks/useFechasDisponibles';
import { getStayAvailability } from '../services/fechaService';
import type { Accommodation } from '../types';
import '../styles/public.css';

const getToday = (): string => {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
};

const getNextDate = (date: string): string => {
  const nextDate = new Date(`${date}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return nextDate.toISOString().slice(0, 10);
};

const fieldStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  background: '#646b63',
  font: 'inherit',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
};

export const Availability: React.FC = () => {
  const navigate = useNavigate();
  const { accommodations, loading, error } = useAccommodations();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [visitors, setVisitors] = useState<number>(2);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  const selectedCabin = accommodations.find((c) => c.id === selectedId) ?? accommodations[0];

  const {
    fechas,
    loading: loadingFechas,
    error: errorFechas,
  } = useFechasDisponibles(selectedCabin ? Number(selectedCabin.id) : null);

  const stay =
    checkInDate && checkOutDate && checkOutDate > checkInDate
      ? getStayAvailability(fechas, checkInDate, checkOutDate)
      : null;

  const nights = stay?.nights ?? 1;
  const canContinue =
    stay !== null && stay.missing.length === 0 && stay.maxVisitors >= visitors;

  if (loading) return <p style={{ padding: '2rem' }}>Cargando alojamientos...</p>;

  if (error || !selectedCabin) {
    return (
      <p role="alert" style={{ padding: '2rem', color: '#C62828' }}>
        {error ?? 'No hay alojamientos disponibles.'}
      </p>
    );
  }

  const handleSelectCabin = (cab: Accommodation): void => {
    setSelectedId(cab.id);
    setVisitors((current) => Math.min(current, cab.maxGuests));
  };

  const handleContinue = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (!canContinue) return;

    // Si cambia la selección, se descarta una reserva anterior sin terminar
    sessionStorage.removeItem('reservaId');
    sessionStorage.setItem('selectedCabinId', selectedCabin.id);
    sessionStorage.setItem('visitors', visitors.toString());
    sessionStorage.setItem('checkInDate', checkInDate);
    sessionStorage.setItem('checkOutDate', checkOutDate);

    navigate('/reserva/datos');
  };

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={1} />

      <div className="booking-layout">
        <form className="booking-form-box" onSubmit={handleContinue}>
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 1 DE 4</small>

          <h2>Elige tu cabaña y fechas</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Selecciona el alojamiento, la llegada, la salida y la cantidad de visitantes.
          </p>

          {/* Selección de cabaña */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {accommodations.map((cab: Accommodation) => (
              <button
                type="button"
                key={cab.id}
                onClick={() => handleSelectCabin(cab)}
                aria-pressed={selectedCabin.id === cab.id}
                style={{
                  border:
                    selectedCabin.id === cab.id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border-color)',
                  background: selectedCabin.id === cab.id ? 'var(--secondary)' : 'white',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: '1 1 180px',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                  textAlign: 'left',
                }}
              >
                <img
                  src={cab.image}
                  alt=""
                  style={{ width: '45px', height: '45px', borderRadius: '6px', objectFit: 'cover' }}
                />
                <span>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>{cab.name}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ${cab.price.toLocaleString()} por visitante/noche
                  </span>
                </span>
              </button>
            ))}
          </div>

          {/* Fechas */}
          <div
            style={{
              background: '#F9FAFB',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Fechas de tu estadía</h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <label htmlFor="check-in" style={labelStyle}>
                  Fecha de llegada
                </label>
                <input
                  id="check-in"
                  type="date"
                  value={checkInDate}
                  min={getToday()}
                  required
                  onChange={(event) => {
                    const nextCheckIn = event.target.value;
                    setCheckInDate(nextCheckIn);
                    if (checkOutDate && checkOutDate < getNextDate(nextCheckIn)) {
                      setCheckOutDate('');
                    }
                  }}
                  style={fieldStyle}
                />
                <small style={{ color: 'var(--text-muted)' }}>Desde las 2:00 p. m.</small>
              </div>

              <div>
                <label htmlFor="check-out" style={labelStyle}>
                  Fecha de salida
                </label>
                <input
                  id="check-out"
                  type="date"
                  value={checkOutDate}
                  min={checkInDate ? getNextDate(checkInDate) : getToday()}
                  required
                  onChange={(event) => setCheckOutDate(event.target.value)}
                  style={fieldStyle}
                />
                <small style={{ color: 'var(--text-muted)' }}>Hasta las 11:00 a. m.</small>
              </div>
            </div>
          </div>

          {/* Disponibilidad */}
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Disponibilidad de {selectedCabin.name}</h3>

            {loadingFechas && <p>Consultando disponibilidad...</p>}

            {errorFechas && (
              <p role="alert" style={{ color: '#C62828' }}>
                {errorFechas}
              </p>
            )}

            {!loadingFechas && !errorFechas && !stay && (
              <p style={{ color: 'var(--text-muted)' }}>
                Elige las fechas para ver los cupos disponibles.
              </p>
            )}

            {stay && stay.missing.length > 0 && (
              <p role="alert" style={{ color: '#C62828' }}>
                No hay disponibilidad para {stay.missing.length === 1 ? 'la noche' : 'las noches'}:{' '}
                {stay.missing.join(', ')}.
              </p>
            )}

            {stay && stay.missing.length === 0 && (
              <p
                style={{
                  color: stay.maxVisitors >= visitors ? '#236344' : '#C62828',
                  fontSize: '1.1rem',
                }}
              >
                Cupos disponibles en toda tu estadía: <strong>{stay.maxVisitors}</strong>
                {stay.maxVisitors < visitors && ' — reduce la cantidad de visitantes.'}
              </p>
            )}
          </div>

          {/* Cantidad de visitantes */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="visitors" style={labelStyle}>
              Cantidad de visitantes
            </label>

            <select
              id="visitors"
              value={visitors}
              onChange={(event) => setVisitors(Number(event.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            >
              {Array.from({ length: selectedCabin.maxGuests }, (_, index) => index + 1).map(
                (quantity) => (
                  <option key={quantity} value={quantity}>
                    {quantity} {quantity === 1 ? 'visitante' : 'visitantes'}
                  </option>
                )
              )}
            </select>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={!canContinue}
            style={{ width: '100%', padding: '0.85rem' }}
          >
            Continuar con mis datos &rarr;
          </button>
        </form>

        <div>
          <BookingSummaryCard
            visitors={visitors}
            selectedCabin={selectedCabin}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            nights={nights}
          />
        </div>
      </div>
    </div>
  );
};