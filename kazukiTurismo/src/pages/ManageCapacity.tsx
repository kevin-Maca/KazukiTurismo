import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Save } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAccommodations } from '../hooks/useAccommodations';
import { fechaService } from '../services/fechaService';
import { ApiError } from '../services/apiClient';
import type { FechaDisponible } from '../types';

interface CapacityCardProps {
  name: string;
  max: number;
  fecha: FechaDisponible | undefined;
  onSave: (id: number, capacity: number) => Promise<void>;
}

const CapacityCard: React.FC<CapacityCardProps> = ({ name, max, fecha, onSave }) => {
  const [value, setValue] = useState<number>(fecha?.capacity ?? 1);

  return (
    <div
      style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '8px',
        border: '1px solid var(--border-color)',
      }}
    >
      <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>{name}</h3>

      {!fecha ? (
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No hay una fecha registrada para este día. Regístrala en{' '}
          <Link to="/admin/fechas">Gestión de Fechas</Link>.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              Capacidad total (máx. {max}):
            </label>
            <input
              type="number"
              min={Math.max(1, fecha.reserved)}
              max={max}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
              }}
            />
          </div>

          <div
            style={{
              background: '#F8F9F5',
              padding: '0.75rem',
              borderRadius: '6px',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Cupos reservados:</span>
              <strong>{fecha.reserved}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Cupos disponibles:</span>
              <strong style={{ color: '#2E7D32' }}>{fecha.available}</strong>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary"
            disabled={value === fecha.capacity}
            onClick={() => void onSave(fecha.id, value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '100%',
              padding: '0.6rem',
            }}
          >
            <Save size={16} /> Guardar configuración
          </button>
        </div>
      )}
    </div>
  );
};

export const ManageCapacity: React.FC = () => {
  const { accommodations, loading: loadingAcc, error: errorAcc } = useAccommodations();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [byAcc, setByAcc] = useState<Record<string, FechaDisponible | undefined>>({});
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!selectedDate || accommodations.length === 0) return;
    let cancelled = false;

    Promise.all(accommodations.map((a) => fechaService.list(Number(a.id))))
      .then((lists) => {
        if (cancelled) return;
        const next: Record<string, FechaDisponible | undefined> = {};
        accommodations.forEach((a, i) => {
          next[a.id] = lists[i].find((f) => f.date === selectedDate);
        });
        setByAcc(next);
      })
      .catch((err: Error) => {
        if (!cancelled) setFeedback({ type: 'error', text: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, accommodations, refreshKey]);

  const save = async (id: number, capacity: number): Promise<void> => {
    setFeedback(null);
    try {
      const res = await fechaService.updateCapacity(id, capacity);
      setFeedback({ type: 'ok', text: res.message });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Error inesperado.',
      });
    }
  };

  if (loadingAcc) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  if (errorAcc) {
    return (
      <p role="alert" style={{ padding: '2rem', color: '#C62828' }}>
        {errorAcc}
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F5' }}>
      <AdminSidebar active="cupos" />

      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h2>Gestión de Cupos y Aforo</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Ajusta la capacidad de cada alojamiento para la fecha elegida.
          </p>
        </header>

        <div
          style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <label htmlFor="fecha-op" style={{ fontWeight: 600 }}>
            Fecha de operación:
          </label>
          <input
            id="fecha-op"
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setByAcc({});
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border-color)',
            }}
          />
        </div>

        {feedback && (
          <p
            role={feedback.type === 'error' ? 'alert' : 'status'}
            style={{ color: feedback.type === 'ok' ? '#2E7D32' : '#C62828', marginBottom: '1rem' }}
          >
            {feedback.text}
          </p>
        )}

        {!selectedDate ? (
          <p style={{ color: 'var(--text-muted)' }}>
            Elige una fecha para ver la capacidad de cada alojamiento.
          </p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {accommodations.map((a) => (
              <CapacityCard
                key={`${a.id}-${selectedDate}-${byAcc[a.id]?.capacity ?? 'x'}`}
                name={a.name}
                max={a.maxGuests}
                fecha={byAcc[a.id]}
                onSave={save}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};