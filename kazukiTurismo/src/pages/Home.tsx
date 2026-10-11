import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components';
import { accommodationsData } from '../data/mockData';
import type { Accommodation } from '../types';
import '../styles/public.css';

export const Home: React.FC = () => {
  return (
    <div>
      <Navbar />
      
      {/* Hero Section */}
      <section 
        style={{
          background: 'linear-gradient(90deg, rgba(30,56,43,0.85) 0%, rgba(30,56,43,0.3) 100%), url("https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80") center/cover',
          color: 'white', 
          padding: '6rem 4rem'
        }}
      >
        <div style={{ maxWidth: '650px' }}>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem' }}>
            ✨ TURISMO RURAL COMUNITARIO
          </span>
          <h1 style={{ fontSize: '3rem', margin: '1rem 0', lineHeight: 1.1 }}>
            Viaja con propósito.<br /><em>Conecta con lo esencial.</em>
          </h1>
          <p style={{ marginBottom: '2rem', color: '#E8EFE3' }}>
            Descubre la riqueza natural y cultural de nuestros territorios mientras apoyas a las comunidades que los protegen.
          </p>
          <Link to="/reserva" className="btn-primary" style={{ background: '#DCE6D5', color: '#1E382B', padding: '0.8rem 2rem' }}>
            Reservar ahora &rarr;
          </Link>
        </div>
      </section>

      {/* Grid de Alojamientos */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '0 1.5rem' }}>
        <h2>Elige tu refugio en la naturaleza</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Cada estadía apoya directamente a las familias anfitrionas y la conservación del territorio.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {accommodationsData.map((cab: Accommodation) => (
            <div key={cab.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
              <img src={cab.image} alt={cab.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <small style={{ color: '#B58444', fontWeight: 700 }}>{cab.subtitle.toUpperCase()}</small>
                <h3 style={{ margin: '0.25rem 0' }}>{cab.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.5rem 0 1rem' }}>{cab.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <div>
                    <small style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>DESDE</small>
                    <div><strong>${cab.price.toLocaleString()}</strong> <small>/ huésped · noche</small></div>
                  </div>
                  <Link to="/reserva" className="btn-primary">&rarr;</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};