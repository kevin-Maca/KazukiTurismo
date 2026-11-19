export interface Usuario {
    IdUsuario: number;
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Telefono: string;
    TipoDocumento: string;
    NumeroDocumento: string;
    Rol: 'ADMIN' | 'VISITANTE';
    FechaRegistro: Date;
    Activo: boolean;
}

export interface CrearUsuario {
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Telefono: string;
    TipoDocumento: string;
    NumeroDocumento: string;
    Password: string;
}

export interface UsuarioLogin {
    Correo: string;
    Password: string;
}

export interface UsuarioAutenticacion {
    IdUsuario: number;
    Correo: string;
    Rol: 'ADMIN' | 'VISITANTE';
    Activo: boolean;
    PasswordHash: string;
}