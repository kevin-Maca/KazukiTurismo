import reservaRoutes from './routes/reservaRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import fechaDisponibleRoutes from './routes/fechaDisponibleRoutes';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import alojamientoRoutes from './routes/alojamientoRoutes';
import authRoutes from './routes/authRoutes'

const app: Application = express();

// Configuración de middlewares
app.use(cors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5173' }));
app.use(express.json());

// Rutas de la API
app.use('/api/alojamientos', alojamientoRoutes);
app.use('/api/fechas-disponibles', fechaDisponibleRoutes);
app.use('/api/auth', authRoutes);
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

// Ruta no encontrada (después de todas las rutas)
app.use((_req: Request, res: Response) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Manejador de errores global (siempre al final, con 4 parámetros)

app.use((err: Error & { status?: number; statusCode?: number }, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status ?? err.statusCode ?? 500;

    if (status >= 500) {
        console.error(err);
        res.status(500).json({ message: 'Error interno del servidor' });
        return;
    }

    // Errores del cliente (por ejemplo, JSON mal formado)
    res.status(status).json({
        message: status === 400
            ? 'El cuerpo de la petición no es un JSON válido'
            : 'Solicitud inválida'
    });
});

export default app;
