import bcrypt from 'bcryptjs';
import { Usuario, CrearUsuario } from '../interfaces/usuario.interface';
import { UsuarioRepository } from '../repositories/usuarioRepository';

export class UsuarioService {

    private usuarioRepository: UsuarioRepository;

    constructor() {
        this.usuarioRepository = new UsuarioRepository();
    }

    // Registrar un visitante
    async crear(usuario: CrearUsuario): Promise<number> {

        if (!usuario.Nombres?.trim()) {
            throw new Error('Los nombres son obligatorios');
        }

        if (!usuario.Apellidos?.trim()) {
            throw new Error('Los apellidos son obligatorios');
        }

        if (!usuario.Correo?.trim()) {
            throw new Error('El correo electrónico es obligatorio');
        }

        const correo = usuario.Correo.trim().toLowerCase();
        const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!patronCorreo.test(correo)) {
            throw new Error('El formato del correo electrónico no es válido');
        }

        if (!usuario.Telefono?.trim()) {
            throw new Error('El teléfono es obligatorio');
        }

        if (!usuario.TipoDocumento?.trim()) {
            throw new Error('El tipo de documento es obligatorio');
        }

        if (!usuario.NumeroDocumento?.trim()) {
            throw new Error('El número de documento es obligatorio');
        }

        if (!usuario.Password || usuario.Password.length < 8) {
            throw new Error('La contraseña debe tener mínimo 8 caracteres');
        }

        // Generar hash de la contraseña
        const passwordHash = await bcrypt.hash(usuario.Password, 10);

        // Preparar información normalizada para el repositorio
        const usuarioNormalizado = {
            Nombres: usuario.Nombres.trim(),
            Apellidos: usuario.Apellidos.trim(),
            Correo: correo,
            Telefono: usuario.Telefono.trim(),
            TipoDocumento: usuario.TipoDocumento.trim(),
            NumeroDocumento: usuario.NumeroDocumento.trim(),
            PasswordHash: passwordHash
        };

        return await this.usuarioRepository.crear(usuarioNormalizado);
    }

    // Consultar todos los usuarios
    async obtenerTodos(): Promise<Usuario[]> {
        return await this.usuarioRepository.obtenerTodos();
    }

    // Consultar un usuario por ID
    async obtenerPorId(idUsuario: number): Promise<Usuario | null> {

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            throw new Error('El identificador del usuario no es válido');
        }

        return await this.usuarioRepository.obtenerPorId(idUsuario);
    }
}