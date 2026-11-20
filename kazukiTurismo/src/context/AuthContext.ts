import { createContext } from 'react';
import type { Usuario, RegisterPayload } from '../types';

export interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  login: (correo: string, password: string) => Promise<Usuario>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);