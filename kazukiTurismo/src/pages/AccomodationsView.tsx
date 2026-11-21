import React from 'react';
import { Navbar, Footer, AccommodationGrid } from '../components';
import { useAccommodations } from '../hooks/useAccommodations';
import '../styles/public.css';

export const AccommodationsView: React.FC = () => {
  const { accommodations, loading, error } = useAccommodations();

  return (
    <div>
      <Navbar />

      <section className="acc-page">
        <div className="acc-page-header">
          <div>
            <h2>Elige tu refugio en la naturaleza</h2>
            <p>
              Cada estadía apoya directamente a las familias anfitrionas y la conservación del
              territorio.
            </p>
          </div>

          <div className="acc-impact">
            <span>🍃</span>
            <div>
              <strong>Impacto local real:</strong>
              <small>El 80% de tu reserva permanece en la comunidad.</small>
            </div>
          </div>
        </div>

        <AccommodationGrid
          accommodations={accommodations}
          loading={loading}
          error={error}
          variant="detailed"
        />
      </section>

      <Footer />
    </div>
  );
};