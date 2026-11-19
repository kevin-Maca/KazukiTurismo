
import {
    FechaDisponible,
    FechaDisponibleRepository
} from '../repositories/fechaDisponibleRepository';

export class FechaDisponibleService {

    private fechaDisponibleRepository: FechaDisponibleRepository;

    constructor() {
        this.fechaDisponibleRepository = new FechaDisponibleRepository();
    }

    // Consultar fechas habilitadas por alojamiento
    async obtenerPorAlojamiento(
        idAlojamiento: number
    ): Promise<FechaDisponible[]> {

        if (!Number.isInteger(idAlojamiento) || idAlojamiento <= 0) {
            throw new Error('El identificador del alojamiento no es válido');
        }

        return await this.fechaDisponibleRepository.obtenerPorAlojamiento(
            idAlojamiento
        );
    }

    // Registrar una fecha individual o un rango
    async registrarRango(
        idAlojamiento: number,
        fechaInicio: string,
        fechaFin: string,
        capacidadTotal: number
    ): Promise<number> {

        if (!Number.isInteger(idAlojamiento) || idAlojamiento <= 0) {
            throw new Error('El identificador del alojamiento no es válido');
        }

        if (!Number.isInteger(capacidadTotal) || capacidadTotal <= 0) {
            throw new Error('La capacidad debe ser un número entero mayor que cero');
        }

        const validarFecha = (fecha: string): boolean => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
                return false;
            }

            const [anio, mes, dia] = fecha.split('-').map(Number);

            const fechaValidada = new Date(
                Date.UTC(anio, mes - 1, dia)
            );

            return (
                fechaValidada.getUTCFullYear() === anio &&
                fechaValidada.getUTCMonth() === mes - 1 &&
                fechaValidada.getUTCDate() === dia
            );
        };

        if (!validarFecha(fechaInicio) || !validarFecha(fechaFin)) {
            throw new Error('Las fechas deben tener un formato válido YYYY-MM-DD');
        }

        if (fechaInicio > fechaFin) {
            throw new Error('La fecha de inicio no puede ser posterior a la fecha final');
        }

        return await this.fechaDisponibleRepository.registrarRango(
            idAlojamiento,
            fechaInicio,
            fechaFin,
            capacidadTotal
        );
    }


    // Actualizar capacidad de una fecha
    async actualizarCapacidad(
        idFecha: number,
        capacidadTotal: number
    ): Promise<string> {

        if (!Number.isInteger(idFecha) || idFecha <= 0) {
            throw new Error('El identificador de la fecha no es válido');
        }

        if (!Number.isInteger(capacidadTotal) || capacidadTotal <= 0) {
            throw new Error('La capacidad debe ser un número entero mayor que cero');
        }

        return await this.fechaDisponibleRepository.actualizarCapacidad(
            idFecha,
            capacidadTotal
        );
    }


    // Habilitar o deshabilitar una fecha
    async cambiarEstado(
        idFecha: number,
        habilitada: boolean
    ): Promise<string> {

        if (!Number.isInteger(idFecha) || idFecha <= 0) {
            throw new Error('El identificador de la fecha no es válido');
        }

        if (typeof habilitada !== 'boolean') {
            throw new Error('El estado debe ser verdadero o falso');
        }

        return await this.fechaDisponibleRepository.cambiarEstado(
            idFecha,
            habilitada
        );
    }

}
