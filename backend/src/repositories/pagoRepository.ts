import sql from 'mssql/msnodesqlv8';
import { connectDB } from '../config/database';

export interface CrearPago {
    IdReserva: number;
    ReferenciaPago: string;
    Observaciones?: string;
}

export interface Pago {
    IdPago: number;
    IdReserva: number;
    MetodoPago: string;
    Monto: number;
    Estado: string;
    ReferenciaPago: string | null;
    Observaciones: string | null;
    FechaPago: Date | null;
    FechaRegistro: Date;
}

export type ResultadoCrearPago =
    | { resultado: 'CREADO'; pago: Pago }
    | { resultado: 'RESERVA_NO_ENCONTRADA' }
    | { resultado: 'RESERVA_NO_PENDIENTE' }
    | { resultado: 'PAGO_EXISTENTE' };

export class PagoRepository {

    async crear(datos: CrearPago): Promise<ResultadoCrearPago> {

        const pool = await connectDB();
        const transaction = new sql.Transaction(pool);

        try {

            await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);

            // 1. Consultar la reserva y el precio del alojamiento
            const resultadoReserva = await transaction.request()
                .input('idReserva', sql.Int, datos.IdReserva)
                .query(`
                    SELECT
                        R.IdReserva,
                        R.Estado,
                        R.FechaEntrada,
                        R.FechaSalida,
                        R.CantidadVisitantes,
                        A.PrecioPorPersonaNoche
                    FROM RESERVAS R WITH (UPDLOCK, HOLDLOCK)
                    INNER JOIN ALOJAMIENTOS A
                        ON R.IdAlojamiento = A.IdAlojamiento
                    WHERE R.IdReserva = @idReserva;
                `);

            if (resultadoReserva.recordset.length === 0) {
                await transaction.rollback();
                return { resultado: 'RESERVA_NO_ENCONTRADA' };
            }

            const reserva = resultadoReserva.recordset[0];

            // 2. Validar estado de la reserva
            if (reserva.Estado !== 'PENDIENTE') {
                await transaction.rollback();
                return { resultado: 'RESERVA_NO_PENDIENTE' };
            }

            // 3. Verificar si ya existe un pago asociado
            const pagoExistente = await transaction.request()
                .input('idReserva', sql.Int, datos.IdReserva)
                .query(`
                    SELECT IdPago
                    FROM PAGOS WITH (UPDLOCK, HOLDLOCK)
                    WHERE IdReserva = @idReserva;
                `);

            if (pagoExistente.recordset.length > 0) {
                await transaction.rollback();
                return { resultado: 'PAGO_EXISTENTE' };
            }

            // 4. Calcular noches
            const fechaEntrada = new Date(reserva.FechaEntrada);
            const fechaSalida = new Date(reserva.FechaSalida);

            const milisegundosPorDia = 1000 * 60 * 60 * 24;

            const cantidadNoches = Math.round(
                (fechaSalida.getTime() - fechaEntrada.getTime()) /
                milisegundosPorDia
            );

            // 5. Calcular monto del pago
            const monto =
                reserva.PrecioPorPersonaNoche *
                reserva.CantidadVisitantes *
                cantidadNoches;

            // 6. Registrar el pago
            const resultadoPago = await transaction.request()
                .input('idReserva', sql.Int, datos.IdReserva)
                .input('metodoPago', sql.NVarChar(60), 'TRANSFERENCIA')
                .input('monto', sql.Decimal(12, 2), monto)
                .input('referenciaPago', sql.NVarChar(200), datos.ReferenciaPago)
                .input('observaciones', sql.NVarChar(600), datos.Observaciones ?? null)
                .query(`
                    INSERT INTO PAGOS (
                        IdReserva,
                        MetodoPago,
                        Monto,
                        Estado,
                        ReferenciaPago,
                        Observaciones
                    )
                    OUTPUT
                        INSERTED.IdPago,
                        INSERTED.IdReserva,
                        INSERTED.MetodoPago,
                        INSERTED.Monto,
                        INSERTED.Estado,
                        INSERTED.ReferenciaPago,
                        INSERTED.Observaciones,
                        INSERTED.FechaPago,
                        INSERTED.FechaRegistro
                    VALUES (
                        @idReserva,
                        @metodoPago,
                        @monto,
                        'PENDIENTE',
                        @referenciaPago,
                        @observaciones
                    );
                `);

            await transaction.commit();

            return {
                resultado: 'CREADO',
                pago: resultadoPago.recordset[0] as Pago
            };

        } catch (error) {

            try {
                await transaction.rollback();
            } catch {
                // La transacción podría haberse cerrado previamente.
            }

            throw error;
        }
    }
}