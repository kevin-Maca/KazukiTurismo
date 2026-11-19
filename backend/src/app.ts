
import fechaDisponibleRoutes from './routes/fechaDisponibleRoutes';
import express, { Application } from 'express';
import cors from 'cors';
import alojamientoRoutes from './routes/alojamientoRoutes';

const app: Application = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/alojamientos', alojamientoRoutes);
app.use('/api/fechas-disponibles', fechaDisponibleRoutes);

// Ruta principal
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Bienvenido a la API de KAZUKI TURISMO',
        status: 'OK'
    });
});

// Ruta para verificar el estado del servidor
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'El servidor está funcionando correctamente'
    });
});

export default app;
