import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextValue } from './AuthContext';
import { authService } from '../services/authService';
import { tokenStorage, UNAUTHORIZED_EVENT } from '../services/apiClient';
import type { Usuario, RegisterPayload } from '../types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState<boolean>(() => tokenStorage.get() !== null);

  // Restaurar la sesión si hay un token guardado
  useEffect(() => {
    if (!tokenStorage.get()) return;
    let cancelled = false;

    authService
      .me()
      .then((usuario) => {
        if (!cancelled) setUser(usuario);
      })
      .catch(() => undefined) // el 401 ya limpia el token en apiClient
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Si cualquier petición recibe 401 con token, se cierra la sesión
  useEffect(() => {
    const onUnauthorized = (): void => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const login = useCallback(async (correo: string, password: string): Promise<Usuario> => {
    const { token, usuario } = await authService.login(correo, password);
    tokenStorage.set(token);
    setUser(usuario);
    return usuario;
  }, []);

  const register = useCallback(async (data: RegisterPayload): Promise<void> => {
    await authService.register(data);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await authService.logout();
    } catch {
      // aunque falle la petición, la sesión local se cierra igual
    }
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}