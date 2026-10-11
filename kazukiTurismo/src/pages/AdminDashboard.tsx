import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users, PieChart, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';
import { mockReservations } from '../data/mockData';
import type { Reservation } from '../types';
import '../styles/admin.css';

export const AdminDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8F9F5' }}>
      
      {/* 1. Sidebar / Barra Lateral */}
      <aside style={{ width: '260px', background: '#1E382B', color: 'white', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          {/* Logo */}
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🍃</span> Kazuki <strong>TURISMO</strong>
          </div>

          {/* Perfil de Usuario Administrador */}
          <div style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.75rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <small style={{ color: '#8FA396', display: 'block', fontSize: '0.7rem' }}>Comunidad Kazuki</small>
            <strong style={{ fontSize: '0.85rem' }}>Administrador</strong>
          </div>

          {/* Navegación del Sidebar */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#8FA396', letterSpacing: '1px', marginBottom: '0.25rem' }}>GESTIÓN</span>
            
            <Link to="/admin" style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', fontWeight: 600 }}>
              <LayoutDashboard size={18} /> Resumen
            </Link>

            <Link to="/admin/fechas" style={{ color: '#BAC7BE', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem' }}>
              <Calendar size={18} /> Gestión de Fechas
            </Link>

            <Link to="/admin/cupos" style={{ color: '#BAC7BE', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem' }}>
              <Users size={18} /> Gestión de Cupos
            </Link>

            <span style={{ fontSize: '0.7rem', color: '#8FA396', letterSpacing: '1px', marginTop: '1rem', marginBottom: '0.25rem' }}>OPERACIÓN</span>

            <a href="#visitantes" style={{ color: '#BAC7BE', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem' }}>
              <Users size={18} /> Visitantes
            </a>

            <a href="#reportes" style={{ color: '#BAC7BE', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem' }}>
              <PieChart size={18} /> Reportes
            </a>
          </nav>
        </div>

        {/* Footer Sidebar */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.8rem', color: '#8FA396' }}>
          <Link to="/" style={{ color: '#8FA396' }}>← Salir del panel</Link>
        </div>
      </aside>

      {/* 2. Main Content / Contenido Principal */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        
        {/* Encabezado */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', color: '#1A2E23' }}>Buenos días, Ana.</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Esto es lo que está pasando hoy en la comunidad.</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="btn-primary" style={{ background: '#1E382B', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
              <Plus size={16} /> Nueva reserva
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'white', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#DCE6D5', color: '#1E382B', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem' }}>
                AM
              </div>
              <div>
                <strong style={{ fontSize: '0.85rem', display: 'block' }}>Ana Martínez</strong>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gestor local</small>
              </div>
            </div>
          </div>
        </header>

        {/* Tarjetas de Métricas */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>RESERVAS ESTE MES</small>
            <h3 style={{ fontSize: '2rem', margin: '0.25rem 0', color: '#1E382B' }}>24</h3>
            <span style={{ color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600 }}>+12% vs mes anterior</span>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>VISITANTES HOY</small>
            <h3 style={{ fontSize: '2rem', margin: '0.25rem 0', color: '#1E382B' }}>17</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>3 llegadas pendientes</span>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>INGRESOS DEL MES</small>
            <h3 style={{ fontSize: '2rem', margin: '0.25rem 0', color: '#1E382B' }}>$7,68M</h3>
            <span style={{ color: '#2E7D32', fontSize: '0.8rem', fontWeight: 600 }}>+8% vs mes anterior</span>
          </div>

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700 }}>OCUPACIÓN PROMEDIO</small>
            <h3 style={{ fontSize: '2rem', margin: '0.25rem 0', color: '#1E382B' }}>72%</h3>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Meta mensual: 75%</span>
          </div>
        </section>

        {/* Grid Secciones Inferiores (Tabla de Reservas + Control de Aforo) */}
        <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
          
          {/* Tabla de Reservas Recientes */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E382B' }}>Reservas recientes</h3>
                <small style={{ color: 'var(--text-muted)' }}>Últimos movimientos de su inventario</small>
              </div>
              <a href="#todas" style={{ color: 'var(--primary)', fontSize: '0.85rem', fontWeight: 600 }}>Ver todas &rarr;</a>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  <th style={{ padding: '0.75rem 0.5rem' }}>RESERVA</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>HUÉSPED</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ALOJAMIENTO</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>FECHAS</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>PAX</th>
                  <th style={{ padding: '0.75rem 0.5rem' }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {mockReservations.map((res: Reservation) => (
                  <tr key={res.id} style={{ borderBottom: '1px solid #F0F4F1', fontSize: '0.85rem' }}>
                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold' }}>{res.id}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{res.guest}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{res.accommodation}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{res.dates}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>{res.pax}</td>
                    <td style={{ padding: '0.75rem 0.5rem' }}>
                      <span 
                        style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: res.status === 'Confirmada' ? '#E8F5E9' : res.status === 'Pendiente' ? '#FFF8E1' : '#FFEBEE',
                          color: res.status === 'Confirmada' ? '#2E7D32' : res.status === 'Pendiente' ? '#B78103' : '#C62828'
                        }}
                      >
                        ● {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Control de Aforo (Bloque lateral derecho) */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1E382B' }}>Control de aforo</h3>
                <span style={{ fontSize: '0.75rem', color: '#2E7D32', background: '#E8F5E9', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 }}>En vivo</span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Disponibilidad para hoy</p>

              {/* Indicador de Aforo Total */}
              <div style={{ background: '#F8F9F5', padding: '1rem', borderRadius: '8px', textAlign: 'center', marginBottom: '1.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 'bold', color: '#1E382B' }}>17 / 24 <small style={{ fontSize: '0.85rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>cupos</small></div>
                <div style={{ width: '100%', background: '#E0E0E0', height: '8px', borderRadius: '4px', margin: '0.5rem 0', overflow: 'hidden' }}>
                  <div style={{ width: '71%', background: '#1E382B', height: '100%' }}></div>
                </div>
                <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>71% de aforo cubierto hoy</small>
              </div>

              {/* Desglose por Cabaña */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F0F4F1' }}>
                  <span>Cabaña Bosque</span>
                  <strong>6 ocupados · 2 libres</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.5rem', borderBottom: '1px solid #F0F4F1' }}>
                  <span>Cabaña Río</span>
                  <strong>5 ocupados · 3 libres</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', paddingBottom: '0.5rem' }}>
                  <span>Cabaña Montaña</span>
                  <strong>6 ocupados · 2 libres</strong>
                </div>
              </div>
            </div>

            <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1.5rem', display: 'block', textAlign: 'center' }}>
              🛡 Los cambios de aforo se actualizan dinámicamente en el portal público.
            </small>
          </div>

        </section>

      </main>
    </div>
  );
};