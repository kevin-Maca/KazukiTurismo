
import { Router } from 'express';
import { AlojamientoController } from '../controllers/alojamientoController';

const router = Router();

const alojamientoController = new AlojamientoController();

// Consultar todos los alojamientos activos
router.get('/', alojamientoController.obtenerTodos);

export default router;
