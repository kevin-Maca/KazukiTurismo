
import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuarioService';

export class UsuarioController {

    private usuarioService: UsuarioService;

    constructor() {
        this.usuarioService = new UsuarioService();
    }

    // Registrar un visitante
    crear = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const idUsuario = await this.usuarioService.crear(req.body);

            res.status(201).json({
                success: true,
                message: 'Usuario registrado correctamente',
                data: {
                    idUsuario
                }
            });

        } catch (error) {
            const errorSQL = error as { number?: number };

            console.error('Error al registrar usuario:', error);

            if (
                errorSQL.number === 2601 ||
                errorSQL.number === 2627
            ) {
                res.status(409).json({
                    success: false,
                    message: 'El correo electrónico o el documento ya se encuentran registrados'
                });
                return;
            }

            res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : 'Error al registrar el usuario'
            });
        }
    };

    // Consultar todos los usuarios
    obtenerTodos = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const usuarios = await this.usuarioService.obtenerTodos();

            res.status(200).json({
                success: true,
                message: 'Usuarios consultados correctamente',
                data: usuarios
            });

        } catch (error) {
            console.error('Error al consultar usuarios:', error);

            res.status(500).json({
                success: false,
                message: 'Error interno al consultar los usuarios'
            });
        }
    };

    // Consultar un usuario por ID
    obtenerPorId = async (
        req: Request,
        res: Response
    ): Promise<void> => {

        try {
            const idUsuario = Number(req.params.idUsuario);

            const usuario = await this.usuarioService.obtenerPorId(idUsuario);

            if (!usuario) {
                res.status(404).json({
                    success: false,
                    message: 'El usuario no existe'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Usuario consultado correctamente',
                data: usuario
            });

        } catch (error) {
            console.error('Error al consultar usuario:', error);

            res.status(400).json({
                success: false,
                message: error instanceof Error
                    ? error.message
                    : 'Error al consultar el usuario'
            });
        }
    };
}
