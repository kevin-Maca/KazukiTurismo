import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { useSelectedAccommodation } from '../hooks/useSelectedAccommodation';
import { listNights } from '../services/fechaService';
import { reservaService } from '../services/reservaService';
import { ApiError } from '../services/apiClient';
import { BANK_INFO } from '../config/bankInfo';
import '../styles/public.css';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
  marginTop: '4px',
};

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { selectedCabin, loading, error } = useSelectedAccommodation();

  const [referencia, setReferencia] = useState<string>('');
  const [observaciones, setObservaciones] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

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
  // Solo informativo: el total real lo calcula el backend al crear la reserva
  const total = selectedCabin.price * visitors * nights;

  const copyAccount = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(BANK_INFO.numeroCuenta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, el número sigue visible para copiarlo a mano
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    try {
      // Si la reserva ya se creó y falló el pago, se reutiliza para no duplicarla
      let reservaId = Number(sessionStorage.getItem('reservaId') ?? 0);

      if (!reservaId) {
        const reserva = await reservaService.create({
          idAlojamiento: Number(selectedCabin.id),
          fechaEntrada: checkInDate,
          fechaSalida: checkOutDate,
          cantidadVisitantes: visitors,
        });
        reservaId = reserva.IdReserva;
        sessionStorage.setItem('reservaId', String(reservaId));
      }

      await reservaService.registerPayment({
        idReserva: reservaId,
        referenciaPago: referencia.trim(),
        observaciones: observaciones.trim() || undefined,
      });

      navigate('/reserva/confirmacion');
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : 'No se pudo completar la reserva.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={3} />

      <div className="booking-layout">
        <form className="booking-form-box" onSubmit={handleSubmit}>
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 3 DE 4</small>
          <h2>Paga por transferencia</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Realiza la transferencia y registra aquí la referencia. Tu reserva quedará pendiente
            hasta que la comunidad apruebe el pago.
          </p>

          <div
            style={{
              background: '#F9FAFB',
              padding: '1.25rem',
              borderRadius: '8px',
              border: '1px solid var(--border-color)',
              marginBottom: '1.5rem',
            }}
          >
            <h3 style={{ marginTop: 0 }}>Datos para la transferencia</h3>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Banco:</strong> {BANK_INFO.banco}
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Tipo de cuenta:</strong> {BANK_INFO.tipoCuenta}
            </p>
            <p style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span>
                <strong>Número:</strong> {BANK_INFO.numeroCuenta}
              </span>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => void copyAccount()}
                style={{ padding: '0.2rem 0.7rem', fontSize: '0.8rem' }}
              >
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </p>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Titular:</strong> {BANK_INFO.titular} ({BANK_INFO.documentoTitular})
            </p>
            <p style={{ margin: '0.75rem 0 0', fontWeight: 700, color: 'var(--primary-dark)' }}>
              Valor a transferir: ${total.toLocaleString()} COP
            </p>
          </div>

          <label htmlFor="referencia" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
            Número o referencia de la transferencia
          </label>
          <input
            id="referencia"
            required
            maxLength={100}
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            style={inputStyle}
          />

          <label
            htmlFor="observaciones"
            style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginTop: '1rem' }}
          >
            Observaciones (opcional)
          </label>
          <textarea
            id="observaciones"
            maxLength={300}
            rows={3}
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            style={inputStyle}
          />

          {submitError && (
            <p role="alert" style={{ color: '#C62828', marginTop: '1rem' }}>
              {submitError}
            </p>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting}
            style={{ width: '100%', padding: '0.85rem', marginTop: '1.5rem' }}
          >
            {submitting ? 'Registrando...' : 'Registrar pago y reservar'}
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