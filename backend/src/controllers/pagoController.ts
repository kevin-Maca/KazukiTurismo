import { Request, Response } from 'express';
import { PagoService } from '../services/pagoService';

export class PagoController {

    private pagoService: PagoService;

    constructor() {
        this.pagoService = new PagoService();
    }

    crear = async (req: Request, res: Response): Promise<void> => {

        try {

            // 1. Obtener y mapear datos enviados por el frontend
            const datosPago = {
                IdReserva: Number(req.body.idReserva ?? req.body.IdReserva),
                ReferenciaPago:
                    req.body.referenciaPago ?? req.body.ReferenciaPago,
                Observaciones:
                    req.body.observaciones ?? req.body.Observaciones
            };

            // 2. Registrar pago a través del servicio
            const resultado = await this.pagoService.crear(datosPago);

            // 3. Manejar los resultados del repositorio
            switch (resultado.resultado) {

                case 'CREADO':
                    res.status(201).json({
                        mensaje: 'Pago registrado exitosamente',
                        pago: resultado.pago
                    });
                    return;

                case 'RESERVA_NO_ENCONTRADA':
                    res.status(404).json({
                        mensaje: 'La reserva no existe'
                    });
                    return;

                case 'RESERVA_NO_PENDIENTE':
                    res.status(400).json({
                        mensaje: 'La reserva no se encuentra en estado pendiente'
                    });
                    return;

                case 'PAGO_EXISTENTE':
                    res.status(409).json({
                        mensaje: 'Ya existe un pago registrado para esta reserva'
                    });
                    return;
            }

        } catch (error) {

            res.status(400).json({
                mensaje: error instanceof Error
                    ? error.message
                    : 'No se pudo registrar el pago'
            });
        }
    };
}