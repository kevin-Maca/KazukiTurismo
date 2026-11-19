import bcrypt from 'bcryptjs';
import { env } from '../config/env';

export const hashPassword = (plain: string): Promise<string> =>
  bcrypt.hash(plain, env.bcryptRounds);

export const comparePassword = (plain: string, hash: string): Promise<boolean> =>
  bcrypt.compare(plain, hash);

// Devuelve la lista de errores; vacía si la contraseña es válida
export function validatePasswordStrength(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Debe tener al menos 8 caracteres');
  if (Buffer.byteLength(password, 'utf8') > 72) errors.push('Es demasiado larga (máximo 72 bytes)');
  if (!/[A-Z]/.test(password)) errors.push('Debe incluir una mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Debe incluir una minúscula');
  if (!/[0-9]/.test(password)) errors.push('Debe incluir un número');
  return errors;
}