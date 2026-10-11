import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, Save } from 'lucide-react';
import { mockCapacityConfigs } from '../data/mockData';
import type { CapacityConfig } from '../types';

export const ManageCapacity: React.FC = () => {
  const [capacities, setCapacities] = useState<CapacityConfig[]>(mockCapacityConfigs);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-18');

  const handleCapacityChange = (id: string, newTotal: number): void => {
    setCapacities(prev =>
      prev.map(item =>
        item.accommodationId === id
          ? {
              ...item,
              totalCapacity: newTotal,
              available: Math.max(0, newTotal - item.reserved)
            }
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
          <Link to="/admin/fechas" style={{ color: '#BAC7BE', display: 'flex', gap: '0.5rem', padding: '0.5rem' }}><Calendar size={18} /> Gestión de Fechas</Link>
          <Link to="/admin/cupos" style={{ color: 'white', display: 'flex', gap: '0.5rem', padding: '0.5rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)' }}><Users size={18} /> Gestión de Cupos</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2.5rem' }}>
        <header style={{ marginBottom: '2rem' }}>
          <h2>Gestión de Cupos y Aforo</h2>
          <p style={{ color: 'var(--text-muted)' }}>Ajusta la capacidad máxima por alojamiento para las fechas seleccionadas.</p>
        </header>

        {/* Selector de fecha */}
        <div style={{ background: 'white', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 600 }}>Seleccionar Fecha de Operación:</label>
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
          />
        </div>

        {/* Configuración de Aforo por Cabaña */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {capacities.map((item: CapacityConfig) => (
            <div key={item.accommodationId} style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <h3 style={{ color: 'var(--primary-dark)', marginBottom: '1rem' }}>{item.accommodationName}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Capacidad Total Permitida:</label>
                  <input 
                    type="number" 
                    min={item.reserved} 
                    max="15"
                    value={item.totalCapacity} 
                    onChange={(e) => handleCapacityChange(item.accommodationId, parseInt(e.target.value) || 0)}
                    style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}
                  />
                </div>

                <div style={{ background: '#F8F9F5', padding: '0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Cupos Ocupados:</span>
                    <strong>{item.reserved}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Cupos Disponibles:</span>
                    <strong style={{ color: '#2E7D32' }}>{item.available}</strong>
                  </div>
                </div>

                <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '0.6rem' }}>
                  <Save size={16} /> Guardar Configuración
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};