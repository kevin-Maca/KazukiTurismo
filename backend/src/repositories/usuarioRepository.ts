import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';
import {
    Usuario,
    UsuarioAutenticacion
} from '../interfaces/usuario.interface';

export interface CrearUsuarioRepository {
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Telefono: string;
    TipoDocumento: string;
    NumeroDocumento: string;
    PasswordHash: string;
}

export class UsuarioRepository {

    // Registrar un visitante
    async crear(usuario: CrearUsuarioRepository): Promise<number> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('nombres', sql.NVarChar(100), usuario.Nombres)
            .input('apellidos', sql.NVarChar(100), usuario.Apellidos)
            .input('correo', sql.NVarChar(150), usuario.Correo)
            .input('telefono', sql.NVarChar(20), usuario.Telefono)
            .input('tipoDocumento', sql.NVarChar(30), usuario.TipoDocumento)
            .input('numeroDocumento', sql.NVarChar(30), usuario.NumeroDocumento)
            .input('passwordHash', sql.NVarChar(255), usuario.PasswordHash)
            .query(`
                INSERT INTO USUARIOS (
                    Nombres,
                    Apellidos,
                    Correo,
                    Telefono,
                    TipoDocumento,
                    NumeroDocumento,
                    PasswordHash
                )
                OUTPUT INSERTED.IdUsuario
                VALUES (
                    @nombres,
                    @apellidos,
                    @correo,
                    @telefono,
                    @tipoDocumento,
                    @numeroDocumento,
                    @passwordHash
                );
            `);

        return resultado.recordset[0].IdUsuario;
    }

    // Consultar todos los usuarios
    async obtenerTodos(): Promise<Usuario[]> {

        const pool = await connectDB();

        const resultado = await pool.request().query(`
            SELECT
                IdUsuario,
                Nombres,
                Apellidos,
                Correo,
                Telefono,
                TipoDocumento,
                NumeroDocumento,
                Rol,
                FechaRegistro,
                Activo
            FROM USUARIOS
            ORDER BY IdUsuario DESC;
        `);

        return resultado.recordset as Usuario[];
    }

    // Consultar usuario por ID
    async obtenerPorId(idUsuario: number): Promise<Usuario | null> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('idUsuario', sql.Int, idUsuario)
            .query(`
                SELECT
                    IdUsuario,
                    Nombres,
                    Apellidos,
                    Correo,
                    Telefono,
                    TipoDocumento,
                    NumeroDocumento,
                    Rol,
                    FechaRegistro,
                    Activo
                FROM USUARIOS
                WHERE IdUsuario = @idUsuario;
            `);

        return resultado.recordset[0] ?? null;
    }

    // Consultar usuario para autenticación
    async obtenerPorCorreoAutenticacion(
        correo: string
    ): Promise<UsuarioAutenticacion | null> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('correo', sql.NVarChar(150), correo)
            .query(`
                SELECT
                    IdUsuario,
                    Correo,
                    Rol,
                    Activo,
                    PasswordHash
                FROM USUARIOS
                WHERE Correo = @correo;
            `);

        return resultado.recordset[0] ?? null;
    }
}