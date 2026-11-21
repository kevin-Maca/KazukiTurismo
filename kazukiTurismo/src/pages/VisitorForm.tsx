import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { useAuth } from '../context/useAuth';
import { useSelectedAccommodation } from '../hooks/useSelectedAccommodation';
import { listNights } from '../services/fechaService';
import '../styles/public.css';

export const VisitorForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selectedCabin, loading, error } = useSelectedAccommodation();

  const visitors = Number(sessionStorage.getItem('visitors') ?? 0);
  const checkInDate = sessionStorage.getItem('checkInDate') ?? '';
  const checkOutDate = sessionStorage.getItem('checkOutDate') ?? '';

  if (loading) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  if (error) {
    return (
      <p role="alert" style={{ padding: '2rem', color: '#C62828' }}>
        {error}
      </p>
    );
  }

  if (!selectedCabin || !checkInDate || !checkOutDate || visitors < 1) {
    return <Navigate to="/reserva" replace />;
  }

  const nights = listNights(checkInDate, checkOutDate).length;

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={2} />

      <div className="booking-layout">
        <div className="booking-form-box">
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 2 DE 4</small>
          <h2>Confirma tus datos</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            La reserva quedará a nombre de tu cuenta.
          </p>

          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '0.6rem 1.5rem',
              margin: 0,
            }}
          >
            <dt style={{ fontWeight: 600 }}>Nombre</dt>
            <dd style={{ margin: 0 }}>
              {user?.nombres} {user?.apellidos}
            </dd>
            <dt style={{ fontWeight: 600 }}>Correo</dt>
            <dd style={{ margin: 0 }}>{user?.correo}</dd>
          </dl>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/reserva')}>
              &larr; Cambiar fechas
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
              onClick={() => navigate('/reserva/pago')}
            >
              Continuar al pago &rarr;
            </button>
          </div>
        </div>

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