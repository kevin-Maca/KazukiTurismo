
import { Request, Response } from 'express';
import { ReservaService } from '../services/reservaService';

export class ReservaController {

    private reservaService: ReservaService;

    constructor() {
        this.reservaService = new ReservaService();
    }

    // Crear una reserva
    crear = async (req: Request, res: Response): Promise<void> => {

        try {

                if (!req.user) {
        res.status(401).json({
            mensaje: 'Usuario no autenticado'
        });
        return;
    }

    const datosReserva = {
        IdUsuario: req.user.id,
        IdAlojamiento: Number(req.body.idAlojamiento ?? req.body.IdAlojamiento),
        FechaEntrada: req.body.fechaEntrada ?? req.body.FechaEntrada,
        FechaSalida: req.body.fechaSalida ?? req.body.FechaSalida,
        CantidadVisitantes: Number(
            req.body.cantidadVisitantes ?? req.body.CantidadVisitantes
        )
    };

    const resultado = await this.reservaService.crear(datosReserva);

            switch (resultado.resultado) {

                case 'CREADA':
                    res.status(201).json({
                        mensaje: 'Reserva creada exitosamente',
                        reserva: resultado.reserva
                    });
                    return;

                case 'ALOJAMIENTO_NO_ENCONTRADO':
                    res.status(404).json({
                        mensaje: 'El alojamiento no existe o no está activo'
                    });
                    return;

                case 'CAPACIDAD_ALOJAMIENTO_EXCEDIDA':
                    res.status(400).json({
                        mensaje: 'La cantidad de visitantes supera la capacidad máxima del alojamiento'
                    });
                    return;

                case 'FECHAS_NO_DISPONIBLES':
                    res.status(400).json({
                        mensaje: 'No existen fechas registradas para todas las noches de la reserva'
                    });
                    return;

                case 'CUPOS_INSUFICIENTES':
                    res.status(409).json({
                        mensaje: 'No hay cupos suficientes para las fechas seleccionadas'
                    });
                    return;

                default:
                    res.status(500).json({
                        mensaje: 'No fue posible procesar la reserva'
                    });
                    return;
            }

        } catch (error) {

            res.status(400).json({
                mensaje: error instanceof Error
                    ? error.message
                    : 'Error al crear la reserva'
            });
        }
    };

        obtenerPorUsuario = async (req: Request, res: Response): Promise<void> => {
        try {
            const idUsuario = Number(req.params.idUsuario);

            const reservas = await this.reservaService.obtenerPorUsuario(idUsuario);

            res.status(200).json({
                mensaje: 'Reservas consultadas exitosamente',
                reservas
            });
        } catch (error) {
            res.status(400).json({
                mensaje: error instanceof Error
                    ? error.message
                    : 'Error al consultar las reservas'
            });
        }
    };

            obtenerMisReservas = async (req: Request, res: Response): Promise<void> => {
        try {
            if (!req.user) {
                res.status(401).json({
                    mensaje: 'Usuario no autenticado'
                });
                return;
            }

            const idUsuario = Number(req.user.id);

            const reservas = await this.reservaService.obtenerPorUsuario(idUsuario);

            res.status(200).json({
                mensaje: 'Mis reservas consultadas exitosamente',
                reservas
            });

        } catch (error) {
            res.status(400).json({
                mensaje: error instanceof Error
                    ? error.message
                    : 'Error al consultar las reservas'
            });
        }
    };

        cancelar = async (req: Request, res: Response): Promise<void> => {
        try {
            const idReserva = Number(req.params.idReserva);

            const resultado = await this.reservaService.cancelar(idReserva);

            if (resultado === 'NO_ENCONTRADA') {
                res.status(404).json({
                    mensaje: 'La reserva no existe'
                });
                return;
            }

            if (resultado === 'NO_CANCELABLE') {
                res.status(400).json({
                    mensaje: 'La reserva no se puede cancelar porque no está en estado PENDIENTE'
                });
                return;
            }

            res.status(200).json({
                mensaje: 'Reserva cancelada exitosamente'
            });

        } catch (error) {
            res.status(400).json({
                mensaje: error instanceof Error
                    ? error.message
                    : 'Error al cancelar la reserva'
            });
        }
    };
}
