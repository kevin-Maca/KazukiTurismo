import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { useAuth } from '../context/useAuth';
import { useAccommodations } from '../hooks/useAccommodations';
import { useAforoHoy } from '../hooks/useAforoHoy'
import '../styles/admin.css';

interface MetricCardProps {
  label: string;
  value: string | number;
  note?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, note }) => (
  <div className="adm-card">
    <small className="adm-metric-label">{label}</small>
    <h3 className="adm-metric-value">{value}</h3>
    {note && <span className="adm-metric-note">{note}</span>}
  </div>
);

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { accommodations, loading, error } = useAccommodations();
  const aforo = useAforoHoy(accommodations);

  const fullName = user ? `${user.nombres} ${user.apellidos}` : '';
  const initials = user
    ? `${user.nombres[0] ?? ''}${user.apellidos[0] ?? ''}`.toUpperCase()
    : '';

  return (
    <div className="adm-layout">
      <AdminSidebar active="resumen" />

      <main className="adm-main">
        <header className="adm-header">
          <div>
            <h2>Hola, {user?.nombres}.</h2>
            <p className="adm-muted">Esto es lo que está pasando hoy en la comunidad.</p>
          </div>

          <div className="adm-user">
            <div className="adm-avatar">{initials}</div>
            <div>
              <strong>{fullName}</strong>
              <small>Administrador</small>
            </div>
          </div>
        </header>

        {loading && <p>Cargando...</p>}
        {error && <p role="alert" className="adm-error">{error}</p>}

        {!loading && !error && (
          <>
            <section className="adm-metrics">
              <MetricCard label="ALOJAMIENTOS ACTIVOS" value={accommodations.length} />
              <MetricCard
                label="CUPOS RESERVADOS HOY"
                value={aforo.totalReserved}
                note={`de ${aforo.totalCapacity} habilitados`}
              />
              <MetricCard label="OCUPACIÓN DE HOY" value={`${aforo.occupancy}%`} />
            </section>

            <section className="adm-columns">
              <div className="adm-card">
                <h3>Reservas recientes</h3>
                <small className="adm-muted">Últimos movimientos de su inventario</small>
                <p className="adm-muted" style={{ marginTop: '1.5rem' }}>
                  Aún no hay reservas para mostrar. Aparecerán aquí cuando el módulo de
                  reservas esté conectado.
                </p>
              </div>

              <div className="adm-card">
                <h3>Control de aforo</h3>
                <p className="adm-muted" style={{ marginBottom: '1.25rem' }}>
                  Disponibilidad para hoy ({aforo.today})
                </p>

                {aforo.loading && <p>Consultando...</p>}
                {aforo.error && <p role="alert" className="adm-error">{aforo.error}</p>}

                {!aforo.loading && !aforo.error && (
                  <div className="adm-aforo-list">
                    {accommodations.map((a) => {
                      const fecha = aforo.byAccommodation[a.id];

                      return (
                        <div key={a.id} className="adm-aforo-row">
                          <span>{a.name}</span>
                          <strong>
                            {fecha
                              ? `${fecha.reserved} ocupados · ${fecha.available} libres`
                              : 'Sin fecha habilitada'}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};