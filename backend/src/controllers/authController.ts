// src/controllers/authController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../config/env';
import {
  hashPassword,
  comparePassword,
  validatePasswordStrength,
} from '../services/passwordService';
import { signToken } from '../services/tokenService';
import { findByEmail, findById, createUser } from '../repositories/authRepository';

const registerSchema = z.object({
  nombres: z.string().trim().min(1).max(100),
  apellidos: z.string().trim().min(1).max(100),
  correo: z.string().trim().toLowerCase().email().max(150),
  telefono: z.string().trim().regex(/^[0-9+\s-]{7,20}$/, 'Teléfono inválido'),
  tipoDocumento: z.string().trim().min(1).max(30),
  numeroDocumento: z.string().trim().min(1).max(30),
  password: z.string().min(1),
});

const loginSchema = z.object({
  correo: z.string().trim().toLowerCase().email(),
  password: z.string().min(1),
});

// Hash de relleno: se compara aunque el correo no exista, para que
// el tiempo de respuesta no revele qué correos están registrados.
const DUMMY_HASH = bcrypt.hashSync('contraseña-de-relleno', env.bcryptRounds);

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      message: 'Datos inválidos',
      errors: parsed.error.issues.map((i) => ({
        campo: i.path.join('.'),
        mensaje: i.message,
      })),
    });
    return;
  }

  const { password, ...datos } = parsed.data;

  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length > 0) {
    res.status(400).json({ message: 'Contraseña débil', errors: passwordErrors });
    return;
  }

  try {
    const passwordHash = await hashPassword(password);
    // El rol se fija aquí, en el servidor: el registro público es siempre VISITANTE
    const id = await createUser({ ...datos, passwordHash }, 'VISITANTE');

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      usuario: {
        id,
        nombres: datos.nombres,
        apellidos: datos.apellidos,
        correo: datos.correo,
        rol: 'VISITANTE',
      },
    });
  } catch (error: any) {
    // 2627 / 2601: violación de restricción UNIQUE
    if (error?.number === 2627 || error?.number === 2601) {
      const msg = String(error.message);
      if (msg.includes('UQ_Usuarios_Correo')) {
        res.status(409).json({ message: 'El correo ya está registrado' });
        return;
      }
      if (msg.includes('UQ_Usuarios_Documento')) {
        res.status(409).json({ message: 'El documento ya está registrado' });
        return;
      }
      res.status(409).json({ message: 'El usuario ya existe' });
      return;
    }
    throw error;
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
    return;
  }
  const { correo, password } = parsed.data;

  const usuario = await findByEmail(correo);
  const hashAComparar = usuario?.PasswordHash ?? DUMMY_HASH;
  const passwordOk = await comparePassword(password, hashAComparar);

  if (!usuario || !usuario.PasswordHash || !passwordOk) {
    res.status(401).json({ message: 'Credenciales inválidas' });
    return;
  }

  if (!usuario.Activo) {
    res.status(403).json({ message: 'La cuenta está desactivada' });
    return;
  }

  const token = signToken({ sub: usuario.IdUsuario, rol: usuario.Rol });

  res.status(200).json({
    token,
    usuario: {
      id: usuario.IdUsuario,
      nombres: usuario.Nombres,
      apellidos: usuario.Apellidos,
      correo: usuario.Correo,
      rol: usuario.Rol,
    },
  });
}

export async function me(req: Request, res: Response): Promise<void> {
  const usuario = await findById(req.user!.id);
  if (!usuario) {
    res.status(404).json({ message: 'Usuario no encontrado' });
    return;
  }
  res.status(200).json({
    id: usuario.IdUsuario,
    nombres: usuario.Nombres,
    apellidos: usuario.Apellidos,
    correo: usuario.Correo,
    rol: usuario.Rol,
  });
}

// El JWT es stateless: el logout real lo hace el cliente descartando el token.
export function logout(_req: Request, res: Response): void {
  res.status(200).json({ message: 'Sesión cerrada' });
}