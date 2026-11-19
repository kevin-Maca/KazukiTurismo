// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken, Rol } from '../services/tokenService';
import { findById } from '../repositories/authRepository';

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token no proporcionado' });
    return;
  }

  let userId: number;
  try {
    userId = verifyToken(header.slice(7)).sub;
  } catch {
    res.status(401).json({ message: 'Token inválido o expirado' });
    return;
  }

  const usuario = await findById(userId);
  if (!usuario || !usuario.Activo) {
    res.status(401).json({ message: 'Cuenta no disponible' });
    return;
  }

  req.user = { id: usuario.IdUsuario, rol: usuario.Rol as Rol };
  next();
}

export const requireRole =
  (...roles: Rol[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }
    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ message: 'No tienes permisos para esta acción' });
      return;
    }
    next();
  };