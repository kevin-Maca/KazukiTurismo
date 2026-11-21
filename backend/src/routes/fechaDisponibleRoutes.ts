
import { Router } from 'express';
import { FechaDisponibleController } from '../controllers/fechaDisponibleController';
import { authenticate, requireRole } from '../middlewares/authMiddleware';

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
    authenticate,
    requireRole('ADMIN'),
    fechaDisponibleController.registrarRango
);

// Actualizar capacidad de una fecha
router.put(
    '/:idFecha/capacidad',
    authenticate,
    requireRole('ADMIN'),
    fechaDisponibleController.actualizarCapacidad
);

// Habilitar o deshabilitar una fecha
router.put(
    '/:idFecha/estado',
    authenticate,
    requireRole('ADMIN'),
    fechaDisponibleController.cambiarEstado
);

export default router;
