// src/repositories/authRepository.ts
import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';

export interface UsuarioAuth {
  IdUsuario: number;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Rol: 'ADMIN' | 'VISITANTE';
  PasswordHash: string | null;
  Activo: boolean;
}

export interface NuevoUsuario {
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  passwordHash: string;
}

const COLUMNAS =
  'IdUsuario, Nombres, Apellidos, Correo, Rol, PasswordHash, Activo';

export async function findByEmail(correo: string): Promise<UsuarioAuth | null> {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input('correo', sql.NVarChar(150), correo)
    .query(`SELECT ${COLUMNAS} FROM dbo.USUARIOS WHERE Correo = @correo`);
  return result.recordset[0] ?? null;
}

export async function findById(id: number): Promise<UsuarioAuth | null> {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .query(`SELECT ${COLUMNAS} FROM dbo.USUARIOS WHERE IdUsuario = @id`);
  return result.recordset[0] ?? null;
}

export async function createUser(
  data: NuevoUsuario,
  rol: 'ADMIN' | 'VISITANTE'
): Promise<number> {
  const pool = await connectDB();
  const result = await pool
    .request()
    .input('nombres', sql.NVarChar(100), data.nombres)
    .input('apellidos', sql.NVarChar(100), data.apellidos)
    .input('correo', sql.NVarChar(150), data.correo)
    .input('telefono', sql.NVarChar(20), data.telefono)
    .input('tipoDocumento', sql.NVarChar(30), data.tipoDocumento)
    .input('numeroDocumento', sql.NVarChar(30), data.numeroDocumento)
    .input('rol', sql.NVarChar(20), rol)
    .input('passwordHash', sql.NVarChar(255), data.passwordHash)
    .query(`
      INSERT INTO dbo.USUARIOS
        (Nombres, Apellidos, Correo, Telefono, TipoDocumento,
         NumeroDocumento, Rol, PasswordHash)
      OUTPUT INSERTED.IdUsuario
      VALUES
        (@nombres, @apellidos, @correo, @telefono, @tipoDocumento,
         @numeroDocumento, @rol, @passwordHash)
    `);
  return result.recordset[0].IdUsuario;
}