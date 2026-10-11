import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Plus, ToggleLeft, ToggleRight } from 'lucide-react';
import { mockDatesList } from '../data/mockData';
import type { DateManagementItem } from '../types';

export const ManageDates: React.FC = () => {
  const [dates, setDates] = useState<DateManagementItem[]>(mockDatesList);

  const toggleStatus = (id: string): void => {
    setDates(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === 'Habilitada' ? 'Deshabilitada' : 'Habilitada' }
          : item
      )
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F5' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#1E382B', color: 'white', padding: '2rem 1.5rem' }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '2rem' }}>🍃 Kazuki <strong>TURISMO</strong></div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', color: '#8FA396', letterSpacing: '1px', marginBottom: '0.5rem' }}>GESTIÓN</span>
          <Link to="/admin" style={{ color: '#BAC7BE', display: 'flex', gap: '0.5rem', padding: '0.5rem' }}><LayoutDashboard size={18} /> Resumen</Link>
          <Link to="/admin/fechas" style={{ color: 'white', display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)' }}><Calendar size={18} /> Gestión de Fechas</Link>
          <Link to="/admin/cupos" style={{ color: '#BAC7BE', display: 'flex', gap: '0.5rem', padding: '0.5rem' }}><Users size={18} /> Gestión de Cupos</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2>Gestión de Fechas y Disponibilidad</h2>
            <p style={{ color: 'var(--text-muted)' }}>Habilita o deshabilita jornadas de operación para la comunidad.</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={16} /> Habilitar Nueva Fecha
          </button>
        </header>

        {/* Tabla de Fechas */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem' }}>FECHA</th>
                <th style={{ padding: '0.75rem' }}>ESTADO</th>
                <th style={{ padding: '0.75rem' }}>CAPACIDAD TOTAL</th>
                <th style={{ padding: '0.75rem' }}>OCUPADOS</th>
                <th style={{ padding: '0.75rem' }}>DISPONIBLES</th>
                <th style={{ padding: '0.75rem' }}>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {dates.map((item: DateManagementItem) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{item.date}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span style={{ color: item.status === 'Habilitada' ? '#2E7D32' : '#C62828', fontWeight: 600 }}>
                      ● {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem' }}>{item.capacity} cupos</td>
                  <td style={{ padding: '0.75rem' }}>{item.occupied}</td>
                  <td style={{ padding: '0.75rem' }}>{item.available}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button 
                      onClick={() => toggleStatus(item.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {item.status === 'Habilitada' ? <ToggleRight size={22} color="#2E7D32" /> : <ToggleLeft size={22} color="#888" />}
                      <span style={{ fontSize: '0.8rem' }}>Cambiar</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};