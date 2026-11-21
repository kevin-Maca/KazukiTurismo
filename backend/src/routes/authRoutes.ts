// src/routes/authRoutes.ts
import { Router } from 'express';
import { authenticate, requireRole } from '../middlewares/authMiddleware';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiters';
import {
  register,
  login,
  me,
  logout,
  updateMyProfile,
  changeMyPassword,
} from '../controllers/authController';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);
router.put('/profile', authenticate, updateMyProfile);
router.put('/change-password', authenticate, changeMyPassword);

// router.get('/', listar);  // público
// router.post('/', authenticate, requireRole('ADMIN'), crear);
// router.put('/:id', authenticate, requireRole('ADMIN'), actualizar);
// router.patch('/:id/habilitar', authenticate, requireRole('ADMIN'), habilitar);

export default router;