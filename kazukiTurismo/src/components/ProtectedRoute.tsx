import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Rol } from '../types';

interface ProtectedRouteProps {
  roles?: Rol[];
}

export function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p style={{ padding: '2rem' }}>Cargando...</p>;

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;

  if (roles && !roles.includes(user.rol)) return <Navigate to="/" replace />;

  return <Outlet />;
}