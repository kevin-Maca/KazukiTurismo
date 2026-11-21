import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Footer, AccommodationGrid } from '../components';
import { useAccommodations } from '../hooks/useAccommodations';
import '../styles/public.css';

export const Home: React.FC = () => {
  const { accommodations, loading, error } = useAccommodations();

  return (
    <div>
      <Navbar />

      <section className="home-hero">
        <div className="home-hero-content">
          <span className="home-hero-tag">✨ TURISMO RURAL COMUNITARIO</span>

          <h1>
            Viaja con propósito.
            <br />
            <em>Conecta con lo esencial.</em>
          </h1>

          <p>
            Descubre la riqueza natural y cultural de nuestros territorios mientras apoyas a las
            comunidades que los protegen.
          </p>

          <Link to="/reserva" className="btn-primary">
            Reservar ahora &rarr;
          </Link>
        </div>
      </section>

      <section className="home-section">
        <h2>Elige tu refugio en la naturaleza</h2>
        <p className="home-section-intro">
          Cada estadía apoya directamente a las familias anfitrionas y la conservación del
          territorio.
        </p>

        <AccommodationGrid accommodations={accommodations} loading={loading} error={error} />
      </section>

      <Footer />
    </div>
  );
};