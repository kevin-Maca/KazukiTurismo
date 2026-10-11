import React from 'react';
import '../styles/public.css';

export const Footer: React.FC = () => {
  return (
    <footer className="main-footer" style={{ background: '#1E382B', color: 'white', padding: '2rem', textAlign: 'center', marginTop: '4rem', fontSize: '0.85rem' }}>
      <p>© 2026 KAZUKI TURISMO — Turismo que transforma territorios. Instituto Tecnológico Metropolitano (ITM).</p>
    </footer>
  );
};