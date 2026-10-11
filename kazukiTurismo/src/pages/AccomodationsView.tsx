import React from 'react';
import { Link } from 'react-router-dom';
import { accommodationsData } from '../data/mockData';
import type { Accommodation } from '../types';
import '../styles/public.css';

export const AccommodationsView: React.FC = () => {
  return (
    <section className="accommodations-section" style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Cabecera de la sección con el recuadro de impacto local */}
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--primary-dark)', marginBottom: '0.5rem' }}>
            Elige tu refugio en la naturaleza
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Cada estadía apoya directamente a las familias anfitrionas y la conservación del territorio.
          </p>
        </div>

        {/* Recuadro de Impacto Local Real (exacto al Figma) */}
        <div style={{ 
          background: '#1E382B', 
          color: 'white', 
          padding: '0.85rem 1.25rem', 
          borderRadius: '10px', 
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }}>
          <span>🍃</span>
          <div>
            <strong>Impacto local real:</strong> 
            <div style={{ color: '#E8EFE3', fontSize: '0.8rem' }}>El 80% de tu reserva permanece en la comunidad.</div>
          </div>
        </div>
      </div>

      {/* Cuadrícula de Tarjetas de Cabañas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {accommodationsData.map((cab: Accommodation, index: number) => (
          <article 
            key={cab.id} 
            style={{ 
              background: 'white', 
              borderRadius: '16px', 
              border: '1px solid var(--border-color)', 
              overflow: 'hidden',
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease'
            }}
          >
            {/* Contenedor de la Imagen */}
            <div style={{ position: 'relative', height: '240px' }}>
              <img src={cab.image} alt={cab.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              
              {/* Etiqueta condicional para la cabaña más elegida */}
              {cab.badge && (
                <span style={{ 
                  position: 'absolute', top: '16px', left: '16px', 
                  background: '#F4E8D2', color: '#1A2E23', 
                  padding: '4px 12px', borderRadius: '20px', 
                  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5px' 
                }}>
                  {cab.badge}
                </span>
              )}

              {/* Número de referencia de la tarjeta (01, 02, 03) */}
              <span style={{ 
                position: 'absolute', bottom: '16px', right: '16px', 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1.8rem', fontWeight: 700, fontStyle: 'italic',
                textShadow: '0 2px 4px rgba(0,0,0,0.4)'
              }}>
                0{index + 1}
              </span>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
              <div>
                <small style={{ color: 'var(--gold)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '1px', display: 'block', marginBottom: '0.4rem' }}>
                  {cab.subtitle.toUpperCase()}
                </small>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--primary-dark)', marginBottom: '0.75rem' }}>
                  {cab.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  {cab.description}
                </p>
              </div>

              <div>
                {/* Características rápidas */}
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  <span>👥 Hasta {cab.maxGuests} huéspedes</span>
                  <span>🌲 Experiencia rural</span>
                </div>

                {/* Footer de la tarjeta con precio y botón */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <small style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, letterSpacing: '0.5px' }}>DESDE</small>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-dark)' }}>
                      $ {cab.price.toLocaleString()} <small style={{ fontSize: '0.75rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>/ huésped · noche</small>
                    </div>
                  </div>

                  <Link 
                    to="/reserva" 
                    style={{ 
                      background: 'var(--primary-dark)', 
                      color: 'white', 
                      width: '44px', 
                      height: '44px', 
                      borderRadius: '8px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.2rem',
                      transition: 'background 0.2s'
                    }}
                  >
                    &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};