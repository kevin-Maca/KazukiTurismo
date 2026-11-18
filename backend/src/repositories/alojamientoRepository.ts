
import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';

export interface Alojamiento {
    IdAlojamiento: number;
    Nombre: string;
    Descripcion: string | null;
    PrecioPorPersonaNoche: number;
    CapacidadMaxima: number;
    Activo: boolean;
}

export class AlojamientoRepository {

    async obtenerTodos(): Promise<Alojamiento[]> {
        const pool = await connectDB();

        const resultado = await pool.request().query(`
            SELECT
                IdAlojamiento,
                Nombre,
                Descripcion,
                PrecioPorPersonaNoche,
                CapacidadMaxima,
                Activo
            FROM ALOJAMIENTOS
            WHERE Activo = 1
            ORDER BY IdAlojamiento;
        `);

        return resultado.recordset as Alojamiento[];
    }
}
