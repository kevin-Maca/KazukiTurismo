
import { useEffect, useState } from 'react';
import { reservaService } from '../services/reservaService';
import type { ReservaUsuario } from '../services/reservaService';
import { Navbar } from '../components/Navbar';
import { BotonAtras } from '../components/BotonAtras';

function formatearFecha(fecha: string): string {
  const fechaLocal = fecha.includes('T')
    ? fecha.split('T')[0]
    : fecha;

  const [anio, mes, dia] = fechaLocal.split('-');

  return `${dia}/${mes}/${anio}`;
}

function obtenerClaseEstado(estado: string): string {
  return `estado-reserva ${estado.toLowerCase()}`;
}

export function MisReservas() {
  const [reservas, setReservas] = useState<ReservaUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    reservaService
      .getMyReservations()
      .then(setReservas)
      .catch((err: unknown) => {
        setError(
          err instanceof Error
            ? err.message
            : 'No fue posible consultar tus reservas.',
        );
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mis-reservas">
          <BotonAtras />
          <h1>Mis reservas</h1>
          <p>Consultando tus reservas...</p>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <main className="mis-reservas">
          <BotonAtras />
          <h1>Mis reservas</h1>
          <p className="mensaje-error">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="mis-reservas">
        <BotonAtras />

        <h1>Mis reservas</h1>

        {reservas.length === 0 ? (
          <p className="reservas-vacias">
            No tienes reservas registradas.
          </p>
        ) : (
          <section className="reservas-lista">
            {reservas.map((reserva) => (
              <article
                className="reserva-card"
                key={reserva.IdReserva}
              >
                <h2>{reserva.NombreAlojamiento}</h2>

                <p>
                  <strong>Reserva:</strong> #{reserva.IdReserva}
                </p>

                <p>
                  <strong>Fecha de entrada:</strong>{' '}
                  {formatearFecha(reserva.FechaEntrada)}
                </p>

                <p>
                  <strong>Fecha de salida:</strong>{' '}
                  {formatearFecha(reserva.FechaSalida)}
                </p>

                <p>
                  <strong>Visitantes:</strong>{' '}
                  {reserva.CantidadVisitantes}
                </p>

                <p className="reserva-estado">
                  <strong>Estado:</strong>
                  <span className={obtenerClaseEstado(reserva.Estado)}>
                    {reserva.Estado}
                  </span>
                </p>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
