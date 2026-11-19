
import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';
import { CrearReserva, Reserva, ReservaConsulta } from '../interfaces/reserva.interface';

export type ResultadoCrearReserva =
    | { resultado: 'CREADA'; reserva: Reserva }
    | { resultado: 'ALOJAMIENTO_NO_ENCONTRADO' }
    | { resultado: 'CAPACIDAD_ALOJAMIENTO_EXCEDIDA' }
    | { resultado: 'FECHAS_NO_DISPONIBLES' }
    | { resultado: 'CUPOS_INSUFICIENTES' };

export class ReservaRepository {

    // Crear reserva validando disponibilidad y actualizando cupos
    async crear(datos: CrearReserva): Promise<ResultadoCrearReserva> {

        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);

        try {

            await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

            // Validar que el alojamiento exista y esté activo
            const alojamiento = await new sql.Request(transaction)
                .input('idAlojamiento', sql.Int, datos.IdAlojamiento)
                .query(`
                    SELECT
                        IdAlojamiento,
                        PrecioPorPersonaNoche,
                        CapacidadMaxima
                    FROM ALOJAMIENTOS WITH (UPDLOCK, HOLDLOCK)
                    WHERE IdAlojamiento = @idAlojamiento
                      AND Activo = 1;
                `);

            if (alojamiento.recordset.length === 0) {
                await transaction.rollback();
                return { resultado: 'ALOJAMIENTO_NO_ENCONTRADO' };
            }

            const capacidadMaxima =
                alojamiento.recordset[0].CapacidadMaxima;

            if (datos.CantidadVisitantes > capacidadMaxima) {
                await transaction.rollback();
                return { resultado: 'CAPACIDAD_ALOJAMIENTO_EXCEDIDA' };
            }

            // Calcular número de noches
            const fechaEntrada = new Date(`${datos.FechaEntrada}T00:00:00Z`);
            const fechaSalida = new Date(`${datos.FechaSalida}T00:00:00Z`);

            const milisegundosPorDia = 1000 * 60 * 60 * 24;

            const cantidadNoches = Math.round(
                (fechaSalida.getTime() - fechaEntrada.getTime()) /
                milisegundosPorDia
            );

            // Consultar y bloquear las fechas del rango
            const fechas = await new sql.Request(transaction)
                .input('idAlojamiento', sql.Int, datos.IdAlojamiento)
                .input('fechaEntrada', sql.Date, fechaEntrada)
                .input('fechaSalida', sql.Date, fechaSalida)
                .query(`
                    SELECT
                        IdFecha,
                        Fecha,
                        CapacidadTotal,
                        CuposReservados,
                        Habilitada
                    FROM FECHAS_DISPONIBLES WITH (UPDLOCK, HOLDLOCK)
                    WHERE IdAlojamiento = @idAlojamiento
                      AND Fecha >= @fechaEntrada
                      AND Fecha < @fechaSalida
                    ORDER BY Fecha;
                `);

            // Debe existir una fecha disponible por cada noche
            if (fechas.recordset.length !== cantidadNoches) {
                await transaction.rollback();
                return { resultado: 'FECHAS_NO_DISPONIBLES' };
            }

            // Validar habilitación y cupos para todas las noches
            const fechasValidas = fechas.recordset.every(
                (fecha: any) =>
                    fecha.Habilitada === true &&
                    fecha.CuposReservados + datos.CantidadVisitantes
                        <= fecha.CapacidadTotal
            );

            if (!fechasValidas) {
                await transaction.rollback();
                return { resultado: 'CUPOS_INSUFICIENTES' };
            }

            // Crear la reserva inicialmente pendiente
            const reservaCreada = await new sql.Request(transaction)
                .input('idUsuario', sql.Int, datos.IdUsuario)
                .input('idAlojamiento', sql.Int, datos.IdAlojamiento)
                .input('fechaEntrada', sql.Date, fechaEntrada)
                .input('fechaSalida', sql.Date, fechaSalida)
                .input('cantidadVisitantes', sql.Int, datos.CantidadVisitantes)
                .query(`
                    INSERT INTO RESERVAS (
                        IdUsuario,
                        IdAlojamiento,
                        FechaEntrada,
                        FechaSalida,
                        CantidadVisitantes,
                        Estado
                    )
                    OUTPUT
                        INSERTED.IdReserva,
                        INSERTED.IdUsuario,
                        INSERTED.IdAlojamiento,
                        INSERTED.FechaEntrada,
                        INSERTED.FechaSalida,
                        INSERTED.CantidadVisitantes,
                        INSERTED.Estado,
                        INSERTED.FechaCreacion
                    VALUES (
                        @idUsuario,
                        @idAlojamiento,
                        @fechaEntrada,
                        @fechaSalida,
                        @cantidadVisitantes,
                        'PENDIENTE'
                    );
                `);

            // Incrementar cupos reservados para cada noche
            await new sql.Request(transaction)
                .input('idAlojamiento', sql.Int, datos.IdAlojamiento)
                .input('fechaEntrada', sql.Date, fechaEntrada)
                .input('fechaSalida', sql.Date, fechaSalida)
                .input('cantidadVisitantes', sql.Int, datos.CantidadVisitantes)
                .query(`
                    UPDATE FECHAS_DISPONIBLES
                    SET CuposReservados = CuposReservados + @cantidadVisitantes
                    WHERE IdAlojamiento = @idAlojamiento
                      AND Fecha >= @fechaEntrada
                      AND Fecha < @fechaSalida;
                `);

            await transaction.commit();

            return {
                resultado: 'CREADA',
                reserva: reservaCreada.recordset[0] as Reserva
            };

        } catch (error) {

            if (transaction) {
                try {
                    await transaction.rollback();
                } catch {
                    // La transacción podría haberse cerrado previamente.
                }
            }

            throw error;
        }
    }

    async obtenerPorUsuario(idUsuario: number): Promise<ReservaConsulta[]> {
    const pool = await connectDB();

    const resultado = await pool.request()
        .input('idUsuario', sql.Int, idUsuario)
        .query(`
            SELECT
                R.IdReserva,
                R.IdUsuario,
                R.IdAlojamiento,
                A.Nombre AS NombreAlojamiento,
                CONVERT(VARCHAR(10), R.FechaEntrada, 23) AS FechaEntrada,
                CONVERT(VARCHAR(10), R.FechaSalida, 23) AS FechaSalida,
                R.CantidadVisitantes,
                R.Estado,
                R.FechaCreacion
            FROM RESERVAS R
            INNER JOIN ALOJAMIENTOS A
                ON R.IdAlojamiento = A.IdAlojamiento
            WHERE R.IdUsuario = @idUsuario
            ORDER BY R.FechaCreacion DESC;
        `);

        return resultado.recordset as ReservaConsulta[];
    }
        async cancelar(idReserva: number): Promise<
    'CANCELADA' |
    'NO_ENCONTRADA' |
    'NO_CANCELABLE'
> {
    const pool = await connectDB();
    const transaction = new sql.Transaction(pool);

    await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

    try {
        // 1. Consultar y bloquear la reserva
        const resultadoReserva = await transaction.request()
            .input('idReserva', sql.Int, idReserva)
            .query(`
                SELECT
                    IdReserva,
                    IdAlojamiento,
                    FechaEntrada,
                    FechaSalida,
                    CantidadVisitantes,
                    Estado
                FROM RESERVAS WITH (UPDLOCK, HOLDLOCK)
                WHERE IdReserva = @idReserva;
            `);

        if (resultadoReserva.recordset.length === 0) {
            await transaction.rollback();
            return 'NO_ENCONTRADA';
        }

        const reserva = resultadoReserva.recordset[0];

        // 2. Verificar si la reserva puede cancelarse
        if (reserva.Estado !== 'PENDIENTE') {
            await transaction.rollback();
            return 'NO_CANCELABLE';
        }

        // 3. Devolver los cupos de las fechas reservadas
        await transaction.request()
            .input('idAlojamiento', sql.Int, reserva.IdAlojamiento)
            .input('fechaEntrada', sql.Date, reserva.FechaEntrada)
            .input('fechaSalida', sql.Date, reserva.FechaSalida)
            .input('cantidad', sql.Int, reserva.CantidadVisitantes)
            .query(`
                UPDATE FECHAS_DISPONIBLES
                SET CuposReservados = CuposReservados - @cantidad
                WHERE IdAlojamiento = @idAlojamiento
                    AND Fecha >= @fechaEntrada
                    AND Fecha < @fechaSalida;
            `);

            // 4. Cambiar el estado de la reserva
            await transaction.request()
                .input('idReserva', sql.Int, idReserva)
                .query(`
                    UPDATE RESERVAS
                    SET Estado = 'CANCELADA'
                    WHERE IdReserva = @idReserva;
                `);

            // 5. Confirmar la transacción
            await transaction.commit();

            return 'CANCELADA';

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}
