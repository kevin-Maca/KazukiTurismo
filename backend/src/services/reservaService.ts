
import { CrearReserva, ReservaConsulta } from '../interfaces/reserva.interface';
import {
    ReservaRepository,
    ResultadoCrearReserva
} from '../repositories/reservaRepository';

export class ReservaService {

    private reservaRepository: ReservaRepository;

    constructor() {
        this.reservaRepository = new ReservaRepository();
    }

    // Crear una reserva
    async crear(datos: CrearReserva): Promise<ResultadoCrearReserva> {

        // Validar identificador del usuario
        if (!Number.isInteger(datos.IdUsuario) || datos.IdUsuario <= 0) {
            throw new Error('El identificador del usuario no es válido');
        }

        // Validar identificador del alojamiento
        if (
            !Number.isInteger(datos.IdAlojamiento) ||
            datos.IdAlojamiento <= 0
        ) {
            throw new Error('El identificador del alojamiento no es válido');
        }

        // Validar cantidad de visitantes
        if (
            !Number.isInteger(datos.CantidadVisitantes) ||
            datos.CantidadVisitantes <= 0
        ) {
            throw new Error('La cantidad de visitantes debe ser un entero mayor que cero');
        }

        // Validar formato y existencia real de fechas
        const validarFecha = (fecha: string): boolean => {

            if (
                typeof fecha !== 'string' ||
                !/^\d{4}-\d{2}-\d{2}$/.test(fecha)
            ) {
                return false;
            }

            const [anio, mes, dia] = fecha.split('-').map(Number);

            const fechaValidada = new Date(Date.UTC(anio, mes - 1, dia));

            return (
                fechaValidada.getUTCFullYear() === anio &&
                fechaValidada.getUTCMonth() === mes - 1 &&
                fechaValidada.getUTCDate() === dia
            );
        };

        if (
            !validarFecha(datos.FechaEntrada) ||
            !validarFecha(datos.FechaSalida)
        ) {
            throw new Error('Las fechas deben ser válidas y tener formato YYYY-MM-DD');
        }

        // Validar orden de fechas
        if (datos.FechaEntrada >= datos.FechaSalida) {
            throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
        }

        // Obtener fecha actual en formato YYYY-MM-DD
        const hoy = new Date();

        const fechaHoy = [
            hoy.getFullYear(),
            String(hoy.getMonth() + 1).padStart(2, '0'),
            String(hoy.getDate()).padStart(2, '0')
        ].join('-');

        // No permitir reservas para fechas pasadas
        if (datos.FechaEntrada < fechaHoy) {
            throw new Error('La fecha de entrada no puede ser anterior a hoy');
        }

        // Delegar la operación al repositorio
        return await this.reservaRepository.crear(datos);}

        async obtenerPorUsuario(idUsuario: number): Promise<ReservaConsulta[]> {
        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new Error('El identificador del usuario no es válido');
        }

        return await this.reservaRepository.obtenerPorUsuario(idUsuario);
    }

        async cancelar(idReserva: number): Promise<
        'CANCELADA' |
        'NO_ENCONTRADA' |
        'NO_CANCELABLE'
    > {
        if (!Number.isInteger(idReserva) || idReserva <= 0) {
            throw new Error('El identificador de la reserva no es válido');
        }

        return await this.reservaRepository.cancelar(idReserva);
    }
}
