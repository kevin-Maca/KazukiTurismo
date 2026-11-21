import { request } from './apiClient';
import type { ApiResponse } from '../types';

export interface CrearReservaPayload {
  idAlojamiento: number;
  fechaEntrada: string;   // YYYY-MM-DD
  fechaSalida: string;    // YYYY-MM-DD
  cantidadVisitantes: number;
}

export interface ReservaCreada {
  IdReserva: number;
  Estado: string;
  Total: number;
}

export interface RegistrarPagoPayload {
  idReserva: number;
  referenciaPago: string;
  observaciones?: string;
}

export interface PagoRegistrado {
  IdPago: number;
  Estado: string;
}

export const reservaService = {
  // Crea la reserva del usuario autenticado (el IdUsuario sale del token en el backend)
  create: async (data: CrearReservaPayload): Promise<ReservaCreada> => {
    const res = await request<ApiResponse<ReservaCreada>>('/api/reservas', {
      method: 'POST',
      body: data,
    });
    return res.data;
  },

  // Registra la transferencia; el pago queda PENDIENTE hasta que un ADMIN lo apruebe
  registerPayment: async (data: RegistrarPagoPayload): Promise<PagoRegistrado> => {
    const res = await request<ApiResponse<PagoRegistrado>>('/api/pagos', {
      method: 'POST',
      body: data,
    });
    return res.data;
  },
};