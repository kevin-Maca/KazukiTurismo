
import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';

export interface FechaDisponible {
    IdFecha: number;
    IdAlojamiento: number;
    Fecha: string;
    CapacidadTotal: number;
    CuposReservados: number;
    Habilitada: boolean;
}

export class FechaDisponibleRepository {

    // Consultar fechas habilitadas de un alojamiento
    async obtenerPorAlojamiento(
        idAlojamiento: number
    ): Promise<FechaDisponible[]> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('idAlojamiento', sql.Int, idAlojamiento)
            .query(`
                SELECT
                    IdFecha,
                    IdAlojamiento,
                    Fecha,
                    CapacidadTotal,
                    CuposReservados,
                    Habilitada
                FROM FECHAS_DISPONIBLES
                WHERE IdAlojamiento = @idAlojamiento
                  AND Habilitada = 1
                ORDER BY Fecha;
            `);

        return resultado.recordset as FechaDisponible[];
    }

    // Registrar una fecha individual o un rango de fechas
    async registrarRango(
        idAlojamiento: number,
        fechaInicio: string,
        fechaFin: string,
        capacidadTotal: number
    ): Promise<number> {

        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);

        let cantidadRegistrada = 0;

        try {
            await transaction.begin();

            const inicio = new Date(`${fechaInicio}T00:00:00`);
            const fin = new Date(`${fechaFin}T00:00:00`);

            const fechaActual = new Date(inicio);

            while (fechaActual <= fin) {

                const fechaSQL = new Date(
                    fechaActual.getFullYear(),
                    fechaActual.getMonth(),
                    fechaActual.getDate()
                );

                await new sql.Request(transaction)
                    .input('idAlojamiento', sql.Int, idAlojamiento)
                    .input('fecha', sql.Date, fechaSQL)
                    .input('capacidadTotal', sql.Int, capacidadTotal)
                    .query(`
                        INSERT INTO FECHAS_DISPONIBLES (
                            IdAlojamiento,
                            Fecha,
                            CapacidadTotal,
                            CuposReservados,
                            Habilitada
                        )
                        VALUES (
                            @idAlojamiento,
                            @fecha,
                            @capacidadTotal,
                            0,
                            1
                        );
                    `);

                cantidadRegistrada++;

                fechaActual.setDate(fechaActual.getDate() + 1);
            }

            await transaction.commit();

            return cantidadRegistrada;

        } catch (error) {

            await transaction.rollback();

            throw error;
        }
    }

    // Actualizar la capacidad de una fecha
    async actualizarCapacidad(
        idFecha: number,
        capacidadTotal: number
    ): Promise<string> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('idFecha', sql.Int, idFecha)
            .input('capacidadTotal', sql.Int, capacidadTotal)
            .query(`
                DECLARE @Resultado NVARCHAR(30);

                IF NOT EXISTS (
                    SELECT 1
                    FROM FECHAS_DISPONIBLES
                    WHERE IdFecha = @idFecha
                )
                BEGIN
                    SET @Resultado = 'NO_ENCONTRADA';
                END
                ELSE IF @capacidadTotal < (
                    SELECT CuposReservados
                    FROM FECHAS_DISPONIBLES
                    WHERE IdFecha = @idFecha
                )
                BEGIN
                    SET @Resultado = 'CAPACIDAD_INSUFICIENTE';
                END
                ELSE
                BEGIN
                    UPDATE FECHAS_DISPONIBLES
                    SET CapacidadTotal = @capacidadTotal
                    WHERE IdFecha = @idFecha;

                    SET @Resultado = 'ACTUALIZADA';
                END;

                SELECT @Resultado AS resultado;
            `);

        return resultado.recordset[0].resultado;
    }


    // Habilitar o deshabilitar una fecha
    async cambiarEstado(
        idFecha: number,
        habilitada: boolean
    ): Promise<string> {

        const pool = await connectDB();

        const resultado = await pool.request()
            .input('idFecha', sql.Int, idFecha)
            .input('habilitada', sql.Bit, habilitada)
            .query(`
                IF NOT EXISTS (
                    SELECT 1
                    FROM FECHAS_DISPONIBLES
                    WHERE IdFecha = @idFecha
                )
                BEGIN
                    SELECT 'NO_ENCONTRADA' AS resultado;
                END
                ELSE
                BEGIN
                    UPDATE FECHAS_DISPONIBLES
                    SET Habilitada = @habilitada
                    WHERE IdFecha = @idFecha;

                    SELECT 'ACTUALIZADA' AS resultado;
                END;
            `);

        return resultado.recordset[0].resultado;
    }


}
