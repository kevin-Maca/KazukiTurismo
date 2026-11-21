import { request } from './apiClient';
import type {
  ApiMessage,
  ApiResponse,
  FechaDisponible,
} from '../types';

export interface RangoPayload {
  idAlojamiento: number;
  fechaInicio: string;
  fechaFin: string;
  capacidadTotal: number;
}

type Raw = Record<string, unknown>;

// Acepta nombres de columna (PascalCase) o camelCase
const pick = (row: Raw, ...keys: string[]): unknown => {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null) return row[key];
  }
  return undefined;
};

const toFecha = (row: Raw): FechaDisponible => {
  const capacity = Number(pick(row, 'CapacidadTotal', 'capacidadTotal'));
  const reserved = Number(pick(row, 'CuposReservados', 'cuposReservados') ?? 0);
  const enabled = pick(row, 'Habilitada', 'habilitada');

  return {
    id: Number(pick(row, 'IdFecha', 'idFecha')),
    date: String(pick(row, 'Fecha', 'fecha') ?? '').slice(0, 10),
    capacity,
    reserved,
    available: capacity - reserved,
    enabled: enabled === true || enabled === 1,
  };
};

// const toFecha = (f: FechaDisponibleApi): FechaDisponible => ({
//   id: f.IdFecha,
//   date: String(f.Fecha).slice(0, 10),
//   capacity: f.CapacidadTotal,
//   reserved: f.CuposReservados,
//   available: f.CapacidadTotal - f.CuposReservados,
//   enabled: f.Habilitada,
// });

export const fechaService = {
list: async (idAlojamiento: number): Promise<FechaDisponible[]> => {
  const res = await request<ApiResponse<Raw[]>>(
    `/api/fechas-disponibles/${idAlojamiento}`,
    { auth: false }
  );
  return res.data.map(toFecha);
},

  registerRange: (data: RangoPayload) =>
    request<ApiMessage & { data: { cantidadRegistrada: number } }>('/api/fechas-disponibles', {
      method: 'POST',
      body: data,
    }),

  updateCapacity: (idFecha: number, capacidadTotal: number) =>
    request<ApiMessage>(`/api/fechas-disponibles/${idFecha}/capacidad`, {
      method: 'PUT',
      body: { capacidadTotal },
    }),

  setEnabled: (idFecha: number, habilitada: boolean) =>
    request<ApiMessage>(`/api/fechas-disponibles/${idFecha}/estado`, {
      method: 'PUT',
      body: { habilitada },
    }),
};

// Noches de la estadía: la fecha de salida NO consume cupo
export function listNights(checkIn: string, checkOut: string): string[] {
  const nights: string[] = [];
  const cursor = new Date(`${checkIn}T00:00:00Z`);
  const end = new Date(`${checkOut}T00:00:00Z`);
  while (cursor < end) {
    nights.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return nights;
}

export interface StayAvailability {
  nights: number;
  missing: string[];    // noches sin fecha habilitada
  maxVisitors: number;  // cupo mínimo entre todas las noches
}

// Se validan todas las noches antes de permitir continuar
export function getStayAvailability(
  fechas: FechaDisponible[],
  checkIn: string,
  checkOut: string
): StayAvailability {
  const nights = listNights(checkIn, checkOut);
  const byDate = new Map(fechas.map((f) => [f.date, f]));
  const missing = nights.filter((n) => !byDate.get(n)?.enabled);

  if (nights.length === 0 || missing.length > 0) {
    return { nights: nights.length, missing, maxVisitors: 0 };
  }

  const maxVisitors = Math.min(...nights.map((n) => byDate.get(n)!.available));
  return { nights: nights.length, missing, maxVisitors };
}