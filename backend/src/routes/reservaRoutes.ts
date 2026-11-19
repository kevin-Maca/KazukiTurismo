
import { Router } from 'express';
import { ReservaController } from '../controllers/reservaController';

const router = Router();
const reservaController = new ReservaController();

// Crear una reserva
router.post('/', reservaController.crear);
// Consultar reservas por usuario
router.get('/usuario/:idUsuario', reservaController.obtenerPorUsuario);
// Cancelar una reserva
router.delete('/:idReserva', reservaController.cancelar);

export default router;
