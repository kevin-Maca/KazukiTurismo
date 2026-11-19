import { Rol } from '../services/tokenService';

declare global {
  namespace Express {
    interface Request {
      user?: { id: number; rol: Rol };
    }
  }
}
export {};