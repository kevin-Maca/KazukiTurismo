
import { Request, Response } from 'express';
import { FechaDisponibleService } from '../services/fechaDisponibleService';

export class FechaDisponibleController {

    private fechaDisponibleService: FechaDisponibleService;

    constructor() {
        this.fechaDisponibleService = new FechaDisponibleService();
    }

    // Consultar fechas habilitadas por alojamiento
    obtenerPorAlojamiento = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const idAlojamiento = Number(req.params.idAlojamiento);

            if (!Number.isInteger(idAlojamiento) || idAlojamiento <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'El identificador del alojamiento no es válido'
                });
                return;
            }

            const fechas =
                await this.fechaDisponibleService.obtenerPorAlojamiento(
                    idAlojamiento
                );

            res.status(200).json({
                success: true,
                message: 'Fechas disponibles consultadas correctamente',
                data: fechas
            });

        } catch (error) {
            console.error('Error al consultar fechas:', error);

            res.status(500).json({
                success: false,
                message: 'Error interno al consultar las fechas disponibles'
            });
        }
    };

    // Registrar una fecha individual o un rango
    registrarRango = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const {
                idAlojamiento,
                fechaInicio,
                fechaFin,
                capacidadTotal
            } = req.body;

            const cantidadRegistrada =
                await this.fechaDisponibleService.registrarRango(
                    Number(idAlojamiento),
                    fechaInicio,
                    fechaFin,
                    Number(capacidadTotal)
                );

            res.status(201).json({
                success: true,
                message: 'Fechas registradas correctamente',
                data: {
                    cantidadRegistrada
                }
            });

        } catch (error) {
            const errorSQL = error as { number?: number; message?: string };

            console.error('Error al registrar fechas:', error);

            if (
                errorSQL.number === 2627 ||
                errorSQL.number === 2601
            ) {
                res.status(409).json({
                    success: false,
                    message: 'Una o más fechas ya están registradas para este alojamiento'
                });
                return;
            }

            if (error instanceof Error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                });
                return;
            }

            res.status(500).json({
                success: false,
                message: 'Error interno al registrar las fechas'
            });
        }
    };


    // Actualizar capacidad de una fecha
    actualizarCapacidad = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const idFecha = Number(req.params.idFecha);
            const { capacidadTotal } = req.body;

            const resultado =
                await this.fechaDisponibleService.actualizarCapacidad(
                    idFecha,
                    Number(capacidadTotal)
                );

            if (resultado === 'NO_ENCONTRADA') {
                res.status(404).json({
                    success: false,
                    message: 'La fecha disponible no existe'
                });
                return;
            }

            if (resultado === 'CAPACIDAD_INSUFICIENTE') {
                res.status(400).json({
                    success: false,
                    message: 'La capacidad no puede ser inferior a los cupos reservados'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Capacidad actualizada correctamente'
            });

        } catch (error) {
            console.error('Error al actualizar capacidad:', error);

            res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : 'Error al actualizar la capacidad'
            });
        }
    };

    // Habilitar o deshabilitar una fecha
    cambiarEstado = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const idFecha = Number(req.params.idFecha);
            const { habilitada } = req.body;

            const resultado =
                await this.fechaDisponibleService.cambiarEstado(
                    idFecha,
                    habilitada
                );

            if (resultado === 'NO_ENCONTRADA') {
                res.status(404).json({
                    success: false,
                    message: 'La fecha disponible no existe'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: habilitada
                    ? 'Fecha habilitada correctamente'
                    : 'Fecha deshabilitada correctamente'
            });

        } catch (error) {
            console.error('Error al cambiar el estado de la fecha:', error);

            res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : 'Error al cambiar el estado de la fecha'
            });
        }
    };
    
}
