
import { Request, Response } from 'express';
import { AlojamientoService } from '../services/alojamientoService';

export class AlojamientoController {

    private alojamientoService: AlojamientoService;

    constructor() {
        this.alojamientoService = new AlojamientoService();
    }

    obtenerTodos = async (req: Request, res: Response): Promise<void> => {
        try {
            const alojamientos = await this.alojamientoService.obtenerTodos();

            res.status(200).json({
                success: true,
                message: 'Alojamientos obtenidos correctamente',
                data: alojamientos
            });

        } catch (error) {
            console.error('Error al obtener alojamientos:', error);

            res.status(500).json({
                success: false,
                message: 'Error interno al consultar los alojamientos'
            });
        }
    };
}
