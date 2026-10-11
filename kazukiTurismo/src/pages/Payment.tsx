import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { BookingStepper } from '../components/BookingStepper';
import { BookingSummaryCard } from '../components/BookingSummaryCard';
import { accommodationsData } from '../data/mockData';
import '../styles/public.css';

export const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'PSE' | 'CARD' | 'TRANSFER'>('PSE');

  const handlePayment = (): void => {
    sessionStorage.setItem('paymentMethod', paymentMethod);
    navigate('/reserva/confirmacion');
  };

  return (
    <div>
      <Navbar />
      <BookingStepper currentStep={3} />
      <div className="booking-layout">
        <div className="booking-form-box">
          <small style={{ color: 'var(--text-muted)', fontWeight: 700 }}>PASO 3 DE 4</small>
          <h2>Finaliza tu reserva</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Selecciona tu método de pago preferido (Simulado).</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <label 
              onClick={() => setPaymentMethod('PSE')}
              style={{ 
                border: paymentMethod === 'PSE' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                background: paymentMethod === 'PSE' ? 'var(--secondary)' : 'white', 
                padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' 
              }}
            >
              <input type="radio" name="payment" checked={paymentMethod === 'PSE'} readOnly />
              <div>
                <strong>PSE</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Débito desde tu cuenta bancaria</div>
              </div>
            </label>

            <label 
              onClick={() => setPaymentMethod('CARD')}
              style={{ 
                border: paymentMethod === 'CARD' ? '2px solid var(--primary)' : '1px solid var(--border-color)', 
                background: paymentMethod === 'CARD' ? 'var(--secondary)' : 'white', 
                padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' 
              }}
            >
              <input type="radio" name="payment" checked={paymentMethod === 'CARD'} readOnly />
              <div>
                <strong>Tarjeta crédito o débito</strong>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Visa, Mastercard o Amex</div>
              </div>
            </label>
          </div>

          <button onClick={handlePayment} className="btn-primary" style={{ width: '100%', padding: '0.85rem', background: '#1E382B' }}>
            Pagar $ 320.000 COP 🔒
          </button>
        </div>

        <div>
          <BookingSummaryCard visitors={2} selectedCabin={accommodationsData[0]} />
        </div>
      </div>
    </div>
  );
};