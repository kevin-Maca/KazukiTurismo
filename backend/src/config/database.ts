import sql from 'mssql/msnodesqlv8';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = [
    `Driver={${process.env.DB_DRIVER}}`,
    `Server=${process.env.DB_SERVER}`,
    `Database=${process.env.DB_DATABASE}`,
    'Trusted_Connection=Yes',
    'Encrypt=Yes',
    'TrustServerCertificate=Yes'
].join(';') + ';';

const dbConfig: sql.config = {
    connectionString,
    driver: 'msnodesqlv8'
};

let pool: sql.ConnectionPool | null = null;

export const connectDB = async (): Promise<sql.ConnectionPool> => {
    try {
        if (pool?.connected) {
            return pool;
        }

        pool = await new sql.ConnectionPool(dbConfig).connect();

        console.log('Conexión exitosa con SQL Server');

        return pool;
    } catch (error) {
        console.error('Error al conectar con SQL Server:', error);
        throw error;
    }
};