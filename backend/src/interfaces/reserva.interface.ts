
export interface CrearReserva {
    IdUsuario: number;
    IdAlojamiento: number;
    FechaEntrada: string;
    FechaSalida: string;
    CantidadVisitantes: number;
}

export interface Reserva {
    IdReserva: number;
    IdUsuario: number;
    IdAlojamiento: number;
    FechaEntrada: string;
    FechaSalida: string;
    CantidadVisitantes: number;
    Estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    FechaCreacion: Date;

}

export interface ReservaConsulta {
    IdReserva: number;
    IdUsuario: number;
    IdAlojamiento: number;
    NombreAlojamiento: string;
    FechaEntrada: string;
    FechaSalida: string;
    CantidadVisitantes: number;
    Estado: 'PENDIENTE' | 'CONFIRMADA' | 'CANCELADA';
    FechaCreacion: Date;
}
