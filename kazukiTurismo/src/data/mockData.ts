import type { Accommodation, Reservation, DateManagementItem, CapacityConfig } from '../types';

export const accommodationsData: Accommodation[] = [
  {
    id: 'cabana-bosque',
    name: 'Cabaña Bosque',
    subtitle: 'Refugio entre árboles',
    description: 'Una cabaña cálida y privada rodeada de bosque nativo, ideal para descansar y reconectar.',
    price: 160000,
    maxGuests: 4,
    badge: 'MÁS ELEGIDA',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cabana-rio',
    name: 'Cabaña Río',
    subtitle: 'Sonidos del agua',
    description: 'Despierta junto al río y disfruta una terraza abierta para contemplar el paisaje.',
    price: 145000,
    maxGuests: 6,
    badge: null,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cabana-montana',
    name: 'Cabaña Montaña',
    subtitle: 'Horizonte infinito',
    description: 'Nuestro alojamiento más amplio, con vista privileged a las montañas.',
    price: 190000,
    maxGuests: 8,
    badge: null,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80'
  }
];

export const mockReservations: Reservation[] = [
  { id: 'KZT-1842', guest: 'María Rodríguez', accommodation: 'Cabaña Bosque', dates: '18–19 oct.', pax: 2, status: 'Confirmada', payment: 'Aprobado vía PSE' },
  { id: 'KZT-1841', guest: 'Tomás Valencia', accommodation: 'Cabaña Río', dates: '19–20 oct.', pax: 4, status: 'Confirmada', payment: 'Aprobado vía Tarjeta' },
  { id: 'KZT-1840', guest: 'Laura Gómez', accommodation: 'Cabaña Bosque', dates: '20–21 oct.', pax: 3, status: 'Pendiente', payment: 'Pendiente' },
  { id: 'KZT-1839', guest: 'Samir López', accommodation: 'Cabaña Montaña', dates: '22–24 oct.', pax: 2, status: 'Confirmada', payment: 'Transferencia' }
];

export const mockDatesList: DateManagementItem[] = [
  { id: '1', date: '2026-10-18', status: 'Habilitada', capacity: 20, occupied: 17, available: 3 },
  { id: '2', date: '2026-10-19', status: 'Habilitada', capacity: 20, occupied: 12, available: 8 },
  { id: '3', date: '2026-10-20', status: 'Deshabilitada', capacity: 20, occupied: 0, available: 0 },
  { id: '4', date: '2026-10-21', status: 'Habilitada', capacity: 20, occupied: 20, available: 0 },
];

export const mockCapacityConfigs: CapacityConfig[] = [
  { accommodationId: 'cabana-bosque', accommodationName: 'Cabaña Bosque', totalCapacity: 8, reserved: 6, available: 2 },
  { accommodationId: 'cabana-rio', accommodationName: 'Cabaña Río', totalCapacity: 8, reserved: 5, available: 3 },
  { accommodationId: 'cabana-montana', accommodationName: 'Cabaña Montaña', totalCapacity: 8, reserved: 6, available: 2 },
];