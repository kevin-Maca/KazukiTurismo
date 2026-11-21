import {
    PagoRepository,
    CrearPago,
    ResultadoCrearPago
} from '../repositories/pagoRepository';

export class PagoService {

    private pagoRepository: PagoRepository;

    constructor() {
        this.pagoRepository = new PagoRepository();
    }

    async crear(datos: CrearPago): Promise<ResultadoCrearPago> {

        // 1. Validar identificador de la reserva
        if (
            !datos.IdReserva ||
            !Number.isInteger(datos.IdReserva) ||
            datos.IdReserva <= 0
        ) {
            throw new Error('El identificador de la reserva no es válido');
        }

        // 2. Validar referencia del pago
        if (
            !datos.ReferenciaPago ||
            datos.ReferenciaPago.trim().length === 0
        ) {
            throw new Error('La referencia del pago es obligatoria');
        }

        if (datos.ReferenciaPago.trim().length > 200) {
            throw new Error('La referencia del pago no puede superar 200 caracteres');
        }

        // 3. Validar observaciones
        if (
            datos.Observaciones &&
            datos.Observaciones.trim().length > 600
        ) {
            throw new Error('Las observaciones no pueden superar 600 caracteres');
        }

        // 4. Normalizar datos
        const datosNormalizados: CrearPago = {
            IdReserva: datos.IdReserva,
            ReferenciaPago: datos.ReferenciaPago.trim(),
            Observaciones: datos.Observaciones?.trim() || undefined
        };

        // 5. Delegar el registro al repositorio
        return await this.pagoRepository.crear(datosNormalizados);
    }
}