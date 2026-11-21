// src/scripts/seedAdmin.ts
import dotenv from 'dotenv';
dotenv.config();

import { hashPassword, validatePasswordStrength } from '../services/passwordService';
import { findByEmail, createUser } from '../repositories/authRepository';

async function main() {
  const correo = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!correo || !password) {
    throw new Error('Define ADMIN_EMAIL y ADMIN_PASSWORD en el .env');
  }
  const errores = validatePasswordStrength(password);
  if (errores.length > 0) {
    throw new Error(`ADMIN_PASSWORD débil: ${errores.join(', ')}`);
  }

  if (await findByEmail(correo)) {
    console.log('El administrador ya existe. No se hizo nada.');
    return;
  }

  await createUser(
    {
      nombres: 'Administrador',
      apellidos: 'Kazuki',
      correo,
      telefono: '0000000',
      tipoDocumento: 'ADMIN',
      numeroDocumento: 'ADMIN-0001',
      passwordHash: await hashPassword(password),
    },
    'ADMIN'
  );
  console.log(`Administrador creado: ${correo}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  });