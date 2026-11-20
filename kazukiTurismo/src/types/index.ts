// Modelo para los Alojamientos
export interface Accommodation {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  maxGuests: number;
  badge?: string | null;
  image: string;
}

// Estados posibles de una reserva
export type ReservationStatus = 'Confirmada' | 'Pendiente' | 'Cancelada';

// Modelo para las Reservas
export interface Reservation {
  id: string;
  guest: string;
  accommodation: string;
  dates: string;
  pax: number;
  status: ReservationStatus;
  payment: string;
}

// Datos de la Reserva en progreso (Estado Global / Session)
export interface BookingData {
  selectedCabin: Accommodation;
  checkInDate: string;
  checkOutDate: string;
  visitors: number;
  guestInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    documentType: string;
    documentNumber: string;
  };
  paymentMethod?: 'PSE' | 'CARD' | 'TRANSFER';
}

// Modelo para la Gestión de Fechas
export interface DateManagementItem {
  id: string;
  date: string;
  status: 'Habilitada' | 'Deshabilitada';
  capacity: number;
  occupied: number;
  available: number;
}

// Modelo para la Configuración de Cupos por Alojamiento
export interface CapacityConfig {
  accommodationId: string;
  accommodationName: string;
  totalCapacity: number;
  reserved: number;
  available: number;
}

export type Rol = 'ADMIN' | 'VISITANTE';

export interface Usuario {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  rol: Rol;
}

export interface RegisterPayload {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  password: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AlojamientoApi {
  IdAlojamiento: number;
  Nombre: string;
  Descripcion: string | null;
  PrecioPorPersonaNoche: number;
  CapacidadMaxima: number;
  Activo: boolean;
}