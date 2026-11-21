import { request } from './apiClient';

export interface CrearReservaPayload {
  idAlojamiento: number;
  fechaEntrada: string;
  fechaSalida: string;
  cantidadVisitantes: number;
}

export interface ReservaCreada {
  IdReserva: number;
  IdUsuario: number;
  IdAlojamiento: number;
  FechaEntrada: string;
  FechaSalida: string;
  CantidadVisitantes: number;
  Estado: string;
  FechaCreacion: string;
}

export interface ReservaUsuario extends ReservaCreada {
  NombreAlojamiento: string;
}

interface ReservaResponse {
  mensaje: string;
  reserva: ReservaCreada;
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

interface PagoResponse {
  mensaje: string;
  pago: PagoRegistrado;
}

interface MisReservasResponse {
  mensaje: string;
  reservas: ReservaUsuario[];
}

export const reservaService = {
  create: async (data: CrearReservaPayload): Promise<ReservaCreada> => {
    const res = await request<ReservaResponse>('/api/reservas', {
      method: 'POST',
      body: data,
    });
    return res.reserva;
  },

    getMyReservations: async (): Promise<ReservaUsuario[]> => {
    const res = await request<MisReservasResponse>('/api/reservas/mis-reservas');
    return res.reservas;
  },

  registerPayment: async (data: RegistrarPagoPayload): Promise<PagoRegistrado> => {
    const res = await request<PagoResponse>('/api/pagos', {
      method: 'POST',
      body: data,
    });
    return res.pago;
  },
};