import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '../context/useAuth';

type Section = 'resumen' | 'fechas' | 'cupos';

interface NavItem {
  key: Section;
  to: string;
  label: string;
  Icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'resumen', to: '/admin', label: 'Resumen', Icon: LayoutDashboard },
  { key: 'fechas', to: '/admin/fechas', label: 'Gestión de Fechas', Icon: Calendar },
  { key: 'cupos', to: '/admin/cupos', label: 'Gestión de Cupos', Icon: Users },
];

interface AdminSidebarProps {
  active: Section;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ active }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <aside className="adm-sidebar">
      <div>
        <div className="adm-logo">
          <span>🍃</span> Kazuki <strong>TURISMO</strong>
        </div>

        <div className="adm-role">
          <small>Comunidad Kazuki</small>
          <strong>Administrador</strong>
        </div>

        <nav className="adm-nav">
          <span className="adm-nav-title">GESTIÓN</span>

          {NAV_ITEMS.map(({ key, to, label, Icon }) => (
            <Link
              key={key}
              to={to}
              className={key === active ? 'adm-link adm-link--active' : 'adm-link'}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="adm-sidebar-footer">
        <Link to="/">&larr; Ir al sitio</Link>
        <button type="button" className="adm-linkbtn" onClick={() => void handleLogout()}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};