import { request } from './apiClient';
import type { Usuario, RegisterPayload } from '../types';

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export const authService = {
  login: (correo: string, password: string) =>
    request<LoginResponse>('/api/auth/login', {
      method: 'POST',
      body: { correo, password },
      auth: false,
    }),

  register: (data: RegisterPayload) =>
    request<{ message: string; usuario: Usuario }>('/api/auth/register', {
      method: 'POST',
      body: data,
      auth: false,
    }),

  me: () => request<Usuario>('/api/auth/me'),

  logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};