import { request } from './apiClient';
import { getAccommodationImage } from '../data/accommodationImages';
import type { Accommodation, AlojamientoApi, ApiResponse } from '../types';

const toAccommodation = (a: AlojamientoApi): Accommodation => ({
  id: String(a.IdAlojamiento),
  name: a.Nombre,
  subtitle: a.Descripcion ?? '',
  description: a.Descripcion ?? '',
  price: a.PrecioPorPersonaNoche,
  maxGuests: a.CapacidadMaxima,
  badge: null,
  image: getAccommodationImage(a.Nombre),
});

export const alojamientoService = {
  list: async (): Promise<Accommodation[]> => {
    const res = await request<ApiResponse<AlojamientoApi[]>>('/api/alojamientos', { auth: false });
    return res.data.map(toAccommodation);
  },
};