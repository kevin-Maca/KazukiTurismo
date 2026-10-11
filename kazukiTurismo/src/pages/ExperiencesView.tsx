import React from 'react';
import { Navbar, Footer } from '../components';
import { Link } from 'react-router-dom';

export const ExperiencesView: React.FC = () => {
  const experiences = [
    {
      id: '1',
      title: 'Senderismo y Avistamiento de Aves',
      description: 'Caminata guiada por los senderos nativos reconociendo la flora y fauna local.',
      duration: '3 horas',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Taller de Gastronomía Tradicional',
      description: 'Aprende a cocinar platos típicos de la región con ingredientes cultivados en la comunidad.',
      duration: '2.5 horas',
      price: 60000,
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div>
      <Navbar />
      <main style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <h2>Experiencias Comunitarias</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Actividades diseñadas y guiadas directamente por los habitantes del territorio.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          {experiences.map((exp) => (
            <div key={exp.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img src={exp.image} alt={exp.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1.5rem' }}>
                <small style={{ color: 'var(--gold)', fontWeight: 700 }}>{exp.duration.toUpperCase()}</small>
                <h3 style={{ margin: '0.5rem 0' }}>{exp.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{exp.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>${exp.price.toLocaleString()} COP</strong>
                  <Link to="/reserva" className="btn-primary">Reservar clase</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};