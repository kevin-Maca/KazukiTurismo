import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(
                `Servidor KAZUKI TURISMO ejecutándose en http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.error('No fue posible iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();