import { Router } from 'express';
import { ReservaController } from '../controllers/reservaController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const reservaController = new ReservaController();

// Crear una reserva
router.post('/', authenticate, reservaController.crear);

// Consultar las reservas del usuario autenticado
router.get('/mis-reservas', authenticate, reservaController.obtenerMisReservas);

// Cancelar una reserva
router.delete('/:idReserva', authenticate, reservaController.cancelar);

export default router;