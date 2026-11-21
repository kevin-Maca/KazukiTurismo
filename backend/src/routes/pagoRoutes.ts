import { Router } from 'express';
import { PagoController } from '../controllers/pagoController';
import { authenticate } from '../middlewares/authMiddleware';

const router = Router();
const pagoController = new PagoController();

// Registrar pago de una reserva (usuario autenticado)
router.post('/', authenticate, pagoController.crear);

export default router;