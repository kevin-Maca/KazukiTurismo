
import { Router } from 'express';
import { FechaDisponibleController } from '../controllers/fechaDisponibleController';

const router = Router();

const fechaDisponibleController = new FechaDisponibleController();

// Consultar fechas habilitadas por alojamiento
router.get(
    '/:idAlojamiento',
    fechaDisponibleController.obtenerPorAlojamiento
);

// Registrar una fecha individual o un rango
router.post(
    '/',
    fechaDisponibleController.registrarRango
);

// Actualizar capacidad de una fecha
router.put(
    '/:idFecha/capacidad',
    fechaDisponibleController.actualizarCapacidad
);

// Habilitar o deshabilitar una fecha
router.put(
    '/:idFecha/estado',
    fechaDisponibleController.cambiarEstado
);

export default router;
