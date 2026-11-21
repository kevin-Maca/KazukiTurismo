import { request } from './apiClient';
import type { Usuario, RegisterPayload } from '../types';

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

export interface UpdateProfilePayload {
  nombres: string;
  apellidos: string;
  telefono: string;
}

export interface ChangePasswordPayload {
  passwordActual: string;
  nuevaPassword: string;
}

interface ProfileResponse {
  message: string;
  usuario: Usuario;
}

interface ChangePasswordResponse {
  message: string;
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

  updateProfile: (data: UpdateProfilePayload) =>
    request<ProfileResponse>('/api/auth/profile', {
      method: 'PUT',
      body: data,
    }),

  changePassword: (data: ChangePasswordPayload) =>
    request<ChangePasswordResponse>('/api/auth/change-password', {
      method: 'PUT',
      body: data,
    }),

  logout: () => request<{ message: string }>('/api/auth/logout', { method: 'POST' }),
};