import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export type Rol = 'ADMIN' | 'VISITANTE';

export interface TokenPayload {
  sub: number;   // IdUsuario
  rol: Rol;
}

export const signToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
  });

export const verifyToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;