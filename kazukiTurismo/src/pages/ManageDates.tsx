import React, { useState } from 'react';
import { Plus, ToggleLeft, ToggleRight, Save } from 'lucide-react';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAccommodations } from '../hooks/useAccommodations';
import { useFechasDisponibles } from '../hooks/useFechasDisponibles';
import { fechaService } from '../services/fechaService';
import { ApiError } from '../services/apiClient';
import type { FechaDisponible } from '../types';

const inputStyle: React.CSSProperties = {
  padding: '0.6rem',
  borderRadius: '6px',
  border: '1px solid var(--border-color)',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
};

interface CapacityCellProps {
  fecha: FechaDisponible;
  max: number;
  onSave: (id: number, capacity: number) => Promise<void>;
}

const CapacityCell: React.FC<CapacityCellProps> = ({ fecha, max, onSave }) => {
  const [value, setValue] = useState<number>(fecha.capacity);

  return (
    <span style={{ display: 'inline-flex', gap: '0.4rem', alignItems: 'center' }}>
      <input
        type="number"
        min={Math.max(1, fecha.reserved)}
        max={max}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ ...inputStyle, width: '80px' }}
      />
      <button
        type="button"
        disabled={value === fecha.capacity}
        onClick={() => void onSave(fecha.id, value)}
        aria-label="Guardar capacidad"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <Save size={16} />
      </button>
    </span>
  );
};

export const ManageDates: React.FC = () => {
  const { accommodations, loading: loadingAcc, error: errorAcc } = useAccommodations();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  const [range, setRange] = useState({ fechaInicio: '', fechaFin: '', capacidadTotal: 1 });

  const current = accommodations.find((a) => a.id === selectedId) ?? accommodations[0];

  const { fechas, loading, error } = useFechasDisponibles(
    current ? Number(current.id) : null,
    refreshKey
  );

  const run = async (action: () => Promise<{ message: string }>): Promise<void> => {
    setFeedback(null);
    try {
      const res = await action();
      setFeedback({ type: 'ok', text: res.message });
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof ApiError ? err.message : 'Error inesperado.',
      });
    }
  };

  const handleRegister = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!current) return;
    void run(() =>
      fechaService.registerRange({
        idAlojamiento: Number(current.id),
        fechaInicio: range.fechaInicio,
        fechaFin: range.fechaFin || range.fechaInicio, // una sola fecha si no hay fin
        capacidadTotal: range.capacidadTotal,
      })
    );
  };

  if (loadingAcc) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  if (errorAcc || !current) {
    return (
      <p role="alert" style={{ padding: '2rem', color: '#C62828' }}>
        {errorAcc ?? 'No hay alojamientos.'}
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F5' }}>
      <AdminSidebar active="fechas" />

      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h2>Gestión de Fechas y Disponibilidad</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Registra, habilita o deshabilita las fechas de cada alojamiento.
          </p>
        </header>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          {accommodations.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setSelectedId(a.id)}
              aria-pressed={a.id === current.id}
              className={a.id === current.id ? 'btn-primary' : 'btn-secondary'}
            >
              {a.name}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleRegister}
          style={{
            background: 'white',
            padding: '1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
          }}
        >
          <div>
            <label htmlFor="inicio" style={labelStyle}>Desde</label>
            <input
              id="inicio"
              type="date"
              required
              value={range.fechaInicio}
              onChange={(e) => setRange((r) => ({ ...r, fechaInicio: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="fin" style={labelStyle}>Hasta (opcional)</label>
            <input
              id="fin"
              type="date"
              min={range.fechaInicio}
              value={range.fechaFin}
              onChange={(e) => setRange((r) => ({ ...r, fechaFin: e.target.value }))}
              style={inputStyle}
            />
          </div>
          <div>
            <label htmlFor="cap" style={labelStyle}>Capacidad</label>
            <input
              id="cap"
              type="number"
              min={1}
              max={current.maxGuests}
              required
              value={range.capacidadTotal}
              onChange={(e) => setRange((r) => ({ ...r, capacidadTotal: Number(e.target.value) }))}
              style={{ ...inputStyle, width: '100px' }}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Habilitar fechas
          </button>
        </form>

        {feedback && (
          <p
            role={feedback.type === 'error' ? 'alert' : 'status'}
            style={{ color: feedback.type === 'ok' ? '#2E7D32' : '#C62828', marginBottom: '1rem' }}
          >
            {feedback.text}
          </p>
        )}

        <div
          style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid var(--border-color)',
          }}
        >
          {loading && <p>Cargando fechas...</p>}
          {error && (
            <p role="alert" style={{ color: '#C62828' }}>
              {error}
            </p>
          )}
          {!loading && !error && fechas.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>
              Aún no hay fechas registradas para {current.name}. Usa el formulario de arriba.
            </p>
          )}

          {fechas.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                  }}
                >
                  <th style={{ padding: '0.75rem' }}>FECHA</th>
                  <th style={{ padding: '0.75rem' }}>ESTADO</th>
                  <th style={{ padding: '0.75rem' }}>CAPACIDAD</th>
                  <th style={{ padding: '0.75rem' }}>RESERVADOS</th>
                  <th style={{ padding: '0.75rem' }}>DISPONIBLES</th>
                  <th style={{ padding: '0.75rem' }}>ACCIÓN</th>
                </tr>
              </thead>
              <tbody>
                {fechas.map((f) => (
                  <tr
                    key={f.id}
                    style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{f.date}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ color: f.enabled ? '#2E7D32' : '#C62828', fontWeight: 600 }}>
                        ● {f.enabled ? 'Habilitada' : 'Deshabilitada'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <CapacityCell
                        key={`${f.id}-${f.capacity}`}
                        fecha={f}
                        max={current.maxGuests}
                        onSave={(id, cap) => run(() => fechaService.updateCapacity(id, cap))}
                      />
                    </td>
                    <td style={{ padding: '0.75rem' }}>{f.reserved}</td>
                    <td style={{ padding: '0.75rem' }}>{f.available}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => void run(() => fechaService.setEnabled(f.id, !f.enabled))}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                        }}
                      >
                        {f.enabled ? (
                          <ToggleRight size={22} color="#2E7D32" />
                        ) : (
                          <ToggleLeft size={22} color="#888" />
                        )}
                        <span style={{ fontSize: '0.8rem' }}>
                          {f.enabled ? 'Deshabilitar' : 'Habilitar'}
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};