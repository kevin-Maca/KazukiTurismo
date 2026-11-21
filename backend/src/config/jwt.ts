import dotenv from 'dotenv';

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    throw new Error('JWT_SECRET no está configurado en el archivo .env');
}

export const jwtConfig = {
    secret: jwtSecret,
    expiresIn: '1h'
};