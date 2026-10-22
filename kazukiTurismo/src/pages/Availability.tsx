import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { accommodationsData, mockCapacityConfigs } from '../data/mockData';
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

export const Availability: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCabin, setSelectedCabin] = useState<Accommodation>(accommodationsData[0]);
  const [visitors, setVisitors] = useState<number>(2);
  const [checkInDate, setCheckInDate] = useState<string>('');
  const [checkOutDate, setCheckOutDate] = useState<string>('');

  const selectedCapacity = mockCapacityConfigs.find(
    (capacity) => capacity.accommodationId === selectedCabin.id
  );

  const nights =
    checkInDate && checkOutDate
      ? (Date.parse(`${checkOutDate}T00:00:00Z`) -
          Date.parse(`${checkInDate}T00:00:00Z`)) /
        86_400_000
      : 1;

  const handleContinue = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (!checkInDate || !checkOutDate || checkOutDate <= checkInDate) {
      return;
    }

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
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>
            PASO 1 DE 4
          </small>

          <h2>Elige tu cabaña y fechas</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Selecciona el alojamiento, la llegada, la salida y la cantidad de
            visitantes.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
            }}
          >
            {accommodationsData.map((cab: Accommodation) => (
              <button
                type="button"
                key={cab.id}
                onClick={() => setSelectedCabin(cab)}
                aria-pressed={selectedCabin.id === cab.id}
                style={{
                  border:
                    selectedCabin.id === cab.id
                      ? '2px solid var(--primary)'
                      : '1px solid var(--border-color)',
                  background:
                    selectedCabin.id === cab.id ? 'var(--secondary)' : 'white',
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
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '6px',
                    objectFit: 'cover',
                  }}
                />
                <span>
                  <strong style={{ fontSize: '0.85rem', display: 'block' }}>
                    {cab.name}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ${cab.price.toLocaleString()} por visitante/noche
                  </span>
                </span>
              </button>
            ))}
          </div>

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
                <label
                  htmlFor="check-in"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
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

                    if (
                      checkOutDate &&
                      checkOutDate < getNextDate(nextCheckIn)
                    ) {
                      setCheckOutDate('');
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    font: 'inherit',
                  }}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                  Desde las 2:00 p. m.
                </small>
              </div>

              <div>
                <label
                  htmlFor="check-out"
                  style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontWeight: 600,
                  }}
                >
                  Fecha de salida
                </label>
                <input
                  id="check-out"
                  type="date"
                  value={checkOutDate}
                  min={checkInDate ? getNextDate(checkInDate) : getToday()}
                  required
                  onChange={(event) => setCheckOutDate(event.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'white',
                    font: 'inherit',
                  }}
                />
                <small style={{ color: 'var(--text-muted)' }}>
                  Hasta las 11:00 a. m.
                </small>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'white',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.5rem',
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
                  Cupos reservados: <strong>{selectedCapacity.reserved}</strong>
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="visitors"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontWeight: 600,
              }}
            >
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

          <button
            type="submit"
            className="btn-primary"
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