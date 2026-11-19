// src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, me, logout } from '../controllers/authController';
import { authenticate } from '../middlewares/authMiddleware';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiters';

const router = Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;