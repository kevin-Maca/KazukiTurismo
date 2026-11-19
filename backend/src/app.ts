import reservaRoutes from './routes/reservaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import fechaDisponibleRoutes from './routes/fechaDisponibleRoutes';
import express, { Application } from 'express';
import cors from 'cors';
import alojamientoRoutes from './routes/alojamientoRoutes';

const app: Application = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/alojamientos', alojamientoRoutes);
app.use('/api/fechas-disponibles', fechaDisponibleRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/reservas', reservaRoutes);

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
