
import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const router = Router();

const usuarioController = new UsuarioController();

// Registrar un visitante
router.post(
    '/',
    usuarioController.crear
);

// Consultar todos los usuarios
router.get(
    '/',
    usuarioController.obtenerTodos
);

// Consultar un usuario por ID
router.get(
    '/:idUsuario',
    usuarioController.obtenerPorId
);

export default router;
